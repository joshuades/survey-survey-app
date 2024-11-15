import { auth } from "@/lib/auth";
import {
  CollectedAnswer,
  CollectedAnswerer,
  CollectedDelete,
  CollectedQuestion,
} from "@/store/surveys";
import { sql as vercelSql } from "@vercel/postgres";
import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { drizzle } from "drizzle-orm/vercel-postgres";
import {
  answerer as answererTable,
  answer as answerTable,
  question as questionTable,
  survey as surveyTable,
  users as userTable,
} from "./schema";

export const db = drizzle(vercelSql);

// TYPES

export type Survey = {
  id: number;
  name: string;
  questionsCount: number;
  answersCount: number;
  userId: string;
  updated_at: Date | null;
  created_at: Date;
  deleted_at: Date | null;
};

export interface SurveyAndQuestions {
  survey: Survey | null;
  questions: Question[];
}

export interface SurveyFull extends Survey {
  questions: FullQuestion[];
}

export interface Question extends CollectedQuestion {
  id: number;
  surveyId: number;
  deleted_at: Date | null;
}

export interface FullQuestion extends Question {
  answers: (Answer & { answerer: Answerer })[];
}

export interface Answer extends CollectedAnswer {
  id: number;
  answererId: number;
}

export interface Answerer extends CollectedAnswerer {
  id: number;
}

// SURVEY FUNCTIONS

export async function createSurvey(name: string, collectedQuestions: CollectedQuestion[]) {
  const session = await auth();
  if (!session?.user?.id) return { survey: null, message: "unauthenticated" };

  const survey = await db
    .insert(surveyTable)
    .values({ name, userId: session?.user?.id })
    .returning();
  if (!survey || survey.length == 0) return { survey, message: "internal error" };

  if (collectedQuestions.length > 0) {
    const result = await createQuestions(collectedQuestions, survey[0].id, true);
    if (result.message !== "success") {
      return { survey, message: result.message };
    }
  }

  const { survey: surveyWithQuestions, message } = await getSurveyById(survey[0].id, true);

  if (message !== "success") {
    return { survey: surveyWithQuestions, message };
  }

  return { survey: surveyWithQuestions, message: "success" };
}

export async function getSurveys() {
  const session = await auth();
  if (!session?.user?.id) return { surveys: [], message: "unauthenticated" };

  const surveys = await db
    .select()
    .from(surveyTable)
    .where(eq(surveyTable.userId, session?.user?.id))
    .orderBy(desc(surveyTable.updated_at), desc(surveyTable.created_at));

  return { surveys, message: "success" };
}

export async function getSurveyById(id: number, alreadyAuthorized: boolean = false) {
  if (!alreadyAuthorized) {
    const session = await auth();
    if (!session?.user?.id) return { survey: null, message: "unauthenticated" };
  }

  // join survey with the question table and with the user table
  const survey = await db
    .select()
    .from(surveyTable)
    .where(eq(surveyTable.id, id))
    .leftJoin(questionTable, eq(surveyTable.id, questionTable.surveyId))
    .leftJoin(userTable, eq(surveyTable.userId, userTable.id));

  if (!alreadyAuthorized) {
    const session = await auth();
    if (survey.length > 0 && survey[0].survey.userId !== session?.user?.id) {
      return { survey: null, message: "unauthorized" };
    }
  }
  if (!survey || survey.length == 0) return { survey: null, message: "not found" };

  const questions = survey.reduce<Question[]>((acc, row) => {
    const question = row.question;
    if (question) {
      acc.push(question);
    }
    return acc;
  }, []);

  const creator = {
    name: survey[0]?.user?.name,
    thankYouMessage: survey[0]?.user?.thankYouMessage,
  };

  return { survey: { ...survey[0].survey, questions, creator }, message: "success" };
}

export async function getSurvAndQuestById(id: number, alreadyAuthorized: boolean = false) {
  if (!alreadyAuthorized) {
    const session = await auth();
    if (!session?.user?.id) return { survey: null, message: "unauthenticated" };
  }

  // join survey with the question table
  const survey = await db
    .select()
    .from(surveyTable)
    .where(eq(surveyTable.id, id))
    .leftJoin(questionTable, eq(surveyTable.id, questionTable.surveyId));

  if (!alreadyAuthorized) {
    const session = await auth();
    if (survey.length > 0 && survey[0].survey.userId !== session?.user?.id) {
      return { message: "unauthorized" };
    }
  }
  if (!survey || survey.length == 0) return { survey: null, message: "not found" };

  const questions = survey.reduce<Question[]>((acc, row) => {
    const question = row.question;
    if (question) {
      acc.push(question);
    }
    return acc;
  }, []);

  const surveyAndQuestions = {
    survey: survey[0].survey,
    questions,
  };
  return { surveyAndQuestions, message: "success" };
}

export async function getFullSurveyById(id: number) {
  const session = await auth();
  if (!session?.user?.id) return { survey: null, message: "unauthenticated" };

  const survey = await db.select().from(surveyTable).where(eq(surveyTable.id, id));

  if (survey.length > 0 && survey[0].userId !== session?.user?.id) {
    return { survey: null, message: "unauthorized" };
  }
  if (!survey || survey.length == 0) return { survey: null, message: "not found" };

  // join the question table with the answer table after joining the answer table with the answerer table
  const questions = await db
    .select()
    .from(questionTable)
    .where(eq(questionTable.surveyId, id))
    .leftJoin(answerTable, eq(questionTable.id, answerTable.questionId))
    .leftJoin(answererTable, eq(answerTable.answererId, answererTable.id));

  // aggregate answers for each question
  const fullQuestions = questions.reduce<FullQuestion[]>((acc, row) => {
    const question = row.question;
    const answer = row.answer;
    const answerer = row.answerer as Answerer;
    if (!question) return acc;
    const existingQuestion = acc.find((q) => q.id === question.id);
    if (existingQuestion) {
      if (answer && answerer) {
        existingQuestion.answers.push({ ...answer, answerer });
      }
    } else {
      acc.push({ ...question, answers: answer ? [{ ...answer, answerer }] : [] });
    }
    return acc;
  }, []);
  return {
    survey: { ...survey[0], questions: fullQuestions },
    message: "success",
  };
}

export async function updateSurvey(id: number, name: string) {
  const session = await auth();
  if (!session?.user?.id) return { survey: null, message: "unauthenticated" };

  const survey = await db
    .update(surveyTable)
    .set({ name })
    .where(and(eq(surveyTable.id, id), eq(surveyTable.userId, session?.user?.id)))
    .returning();
  if (!survey || survey.length == 0) return { survey, message: "not found" };
  return { survey, message: "success" };
}

export async function deleteSurvey(id: number) {
  const session = await auth();
  if (!session?.user?.id) return { survey: null, message: "unauthenticated" };

  const survey = await db
    .delete(surveyTable)
    .where(and(eq(surveyTable.id, id), eq(surveyTable.userId, session?.user?.id)))
    .returning();
  if (!survey || survey.length == 0) return { survey, message: "not found" };
  return { survey, message: "success" };
}

// QUESTION FUNCTIONS

export async function getQuestionsForSurvey(surveyId: number) {
  const session = await auth();
  if (!session?.user) return { questions: [], message: "unauthenticated" };

  if (!(await isAuthorized(surveyId, session?.user))) {
    return { question: [], message: "unauthorized" };
  }

  const questions = await db
    .select()
    .from(questionTable)
    .where(eq(questionTable.surveyId, surveyId));

  return { questions, message: "success" };
}

export async function createQuestions(
  collectedQuestions: CollectedQuestion[],
  surveyId: number,
  alreadyAuthorized: boolean = false
) {
  if (!alreadyAuthorized) {
    const session = await auth();
    if (!session?.user) return { questions: [], message: "unauthenticated" };
    if (!(await isAuthorized(surveyId, session?.user))) {
      return { questions: [], message: "unauthorized" };
    }
  }

  const questions = await db
    .insert(questionTable)
    .values(
      collectedQuestions.map(({ questionText, answerType, index, created_at, updated_at }) => ({
        questionText,
        answerType,
        index,
        status: "active",
        created_at: new Date(created_at),
        updated_at: updated_at ? new Date(updated_at) : null,
        surveyId,
      }))
    )
    .returning();

  if (!questions || questions.length == 0) {
    return { questions, message: "internal error" };
  }

  // update questionsCount count on the survey
  const survey = await db
    .update(surveyTable)
    .set({ questionsCount: sql`"survey"."questionsCount" + ${questions.length}` })
    .where(eq(surveyTable.id, surveyId))
    .returning();

  // updated updated_at on the survey
  await db
    .update(surveyTable)
    .set({ updated_at: new Date() })
    .where(eq(surveyTable.id, surveyId))
    .returning();

  if (!survey || survey.length == 0) {
    return { survey, message: "internal error" };
  }

  return { questions, message: "success" };
}

export async function updateQuestion(id: number, questionText: string, surveyId: number) {
  const session = await auth();
  if (!session?.user) return { question: null, message: "unauthenticated" };

  if (!(await isAuthorized(surveyId, session?.user))) {
    return { question: null, message: "unauthorized" };
  }

  const question = await db
    .update(questionTable)
    .set({ questionText })
    .where(eq(questionTable.id, id))
    .returning();
  if (!question || question.length == 0) return { question, message: "not found" };

  await db
    .update(surveyTable)
    .set({ updated_at: new Date() })
    .where(eq(surveyTable.id, surveyId))
    .returning();

  return { question, message: "success" };
}

export async function deleteQuestion(id: number, surveyId: number) {
  const session = await auth();
  if (!session?.user) return { question: null, message: "unauthenticated" };

  if (!(await isAuthorized(surveyId, session?.user))) {
    return { question: null, message: "unauthorized" };
  }

  const question = await db.delete(questionTable).where(eq(questionTable.id, id)).returning();
  if (!question || question.length == 0) return { question, message: "not found" };

  await db
    .update(surveyTable)
    .set({ updated_at: new Date() })
    .where(eq(surveyTable.id, surveyId))
    .returning();

  return { question, message: "success" };
}

export async function deleteQuestions(collectedDeletes: CollectedDelete[], surveyId: number) {
  const session = await auth();
  if (!session?.user) return { message: "unauthenticated" };
  if (!(await isAuthorized(surveyId, session?.user))) {
    return { message: "unauthorized" };
  }

  const questionIds = collectedDeletes.map((d) => d.questionId);
  const result = await db
    .delete(questionTable)
    .where(and(eq(questionTable.surveyId, surveyId), inArray(questionTable.id, questionIds)))
    .returning();

  if (!result || result.length == 0) return { message: "not found" };

  // update questionsCount count on the survey
  const survey = await db
    .update(surveyTable)
    .set({ questionsCount: sql`"survey"."questionsCount" - ${result.length}` })
    .where(eq(surveyTable.id, surveyId))
    .returning();

  if (!survey || survey.length == 0) {
    return { message: "internal error" };
  }

  await db
    .update(surveyTable)
    .set({ updated_at: new Date() })
    .where(eq(surveyTable.id, surveyId))
    .returning();

  return { message: "success" };
}

export async function getQuestionById(id: number, surveyId: number) {
  const session = await auth();
  if (!session?.user) return { question: null, message: "unauthenticated" };

  if (!(await isAuthorized(surveyId, session?.user))) {
    return { question: null, message: "unauthorized" };
  }

  const question = await db.select().from(questionTable).where(eq(questionTable.id, id));
  if (!question || question.length == 0) return { question, message: "not found" };
  return { question, message: "success" };
}

// ANSWER FUNCTIONS

export async function createAnswers(
  collectedAnswers: CollectedAnswer[],
  surveyId: number,
  collectedAnswerer: CollectedAnswerer
) {
  // TODO: check if the user has a valid access key for the survey

  const answerer = await db.insert(answererTable).values(collectedAnswerer).returning();

  if (!answerer || answerer.length == 0) {
    return { answers: [], message: "internal error" };
  }
  const answererId = answerer[0].id;

  const answers = await db
    .insert(answerTable)
    .values(
      collectedAnswers.map(({ type, answerText, answerBoolean, questionId, created_at }) => ({
        type,
        answerText,
        answerBoolean,
        questionId,
        answererId: answererId,
        created_at: new Date(created_at),
      }))
    )
    .returning();

  if (!answers || answers.length == 0) {
    return { answers: [], message: "internal error" };
  }

  const survey = await db
    .update(surveyTable)
    .set({ answersCount: sql`"survey"."answersCount" + 1` })
    .where(eq(surveyTable.id, surveyId))
    .returning();

  if (!survey || survey.length == 0) {
    return { survey, message: "internal error" };
  }

  return { answers, message: "success" };
}

// USER FUNCTIONS

export const getUsers = async () => {
  const selectResult = await db.select().from(userTable);
  return selectResult;
};

export const getUserSettings = async () => {
  const session = await auth();
  if (!session?.user?.id) return { message: "unauthenticated" };

  const user = await db.select().from(userTable).where(eq(userTable.id, session?.user?.id));
  if (!user || user.length == 0) return { message: "not found" };

  const settings = { thankYouMessage: user[0].thankYouMessage };
  return { settings, message: "success" };
};

export async function updateUser(username: string, thankYouMessage: string) {
  const session = await auth();
  if (!session?.user?.id) return { message: "unauthenticated" };

  const updateResult = await db
    .update(userTable)
    .set({ name: username, thankYouMessage })
    .where(eq(userTable.id, session?.user?.id))
    .returning();

  if (!updateResult || updateResult.length == 0) {
    return { message: "internal error" };
  }

  return { user: { name: updateResult[0].name, thankYouMessage }, message: "success" };
}

// HELPER FUNCTIONS

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function isAuthorized(surveyId: number, user: any) {
  const survey = await db.select().from(surveyTable).where(eq(surveyTable.id, surveyId));
  if (survey.length > 0 && survey[0].userId !== user.id) {
    return false;
  }
  return true;
}
