// import "@/lib/config";
import { auth } from "@/lib/auth";
import { CollectedDelete, CollectedQuestion } from "@/store/surveys";
import { sql } from "@vercel/postgres";
import { and, desc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/vercel-postgres";
import {
  answer as answerTable,
  question as questionTable,
  survey as surveyTable,
  users,
} from "./schema";

export const db = drizzle(sql);

// TYPES

export type Survey = {
  id: number;
  name: string;
  userId: string;
  updated_at: Date | null;
  created_at: Date;
  deleted_at: Date | null;
};

export type SurveysWithQuestions = {
  survey: Survey | null;
  questions: Question[];
};

export type FullSurvey = {
  survey: Survey;
  questions: (Question & { answers: Answer[] })[];
};

export interface Question extends CollectedQuestion {
  surveyId: number;
  deleted_at: Date | null;
  // questionText: string;
  // answerType: string;
  // updated_at: Date | null;
  // created_at: Date;
}

export type Answer = {
  id: number;
  type: string;
  answerText?: string | null;
  answerBoolean?: boolean | null;
  username: string;
  email?: string | null;
  questionId: number;
  updated_at: Date | null;
  created_at: Date;
  deleted_at: Date | null;
};

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

  // // join the survey table with the question table
  // const surveys = await db
  //   .select()
  //   .from(surveyTable)
  //   .where(eq(surveyTable.userId, session?.user?.id))
  //   .leftJoin(questionTable, eq(surveyTable.id, questionTable.surveyId));

  // // aggregate the questions for each survey
  // const surveysWithQuestions = surveys.reduce<
  //   Record<number, { survey: Survey; questions: Question[] }>
  // >((acc, row) => {
  //   const survey = row.survey;
  //   const question = row.question;
  //   if (!acc[survey.id]) {
  //     acc[survey.id] = { survey, questions: [] };
  //   }
  //   if (question) {
  //     acc[survey.id].questions.push(question);
  //   }
  //   return acc;
  // }, {});

  return { surveys, message: "success" };
}

export async function getSurveyById(id: number, alreadyAuthorized: boolean = false) {
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

  // aggregate questions for each survey
  const surveyAggregated = survey.reduce<{ survey: Survey; questions: Question[] }>(
    (acc, row) => {
      const question = row.question;
      if (question) {
        acc.questions.push(question);
      }
      return acc;
    },
    { survey: survey[0].survey, questions: [] }
  );

  return { survey: surveyAggregated, message: "success" };
}

export async function getFullSurveyById(id: number) {
  const session = await auth();
  if (!session?.user?.id) return { survey: null, message: "unauthenticated" };

  const simpleSurvey = await db.select().from(surveyTable).where(eq(surveyTable.id, id));

  if (simpleSurvey.length > 0 && simpleSurvey[0].userId !== session?.user?.id) {
    return { message: "unauthorized" };
  }
  if (!simpleSurvey || simpleSurvey.length == 0) return { simpleSurvey, message: "not found" };

  // join the question table with the answer table
  const questions = await db
    .select()
    .from(questionTable)
    .where(eq(questionTable.surveyId, id))
    .leftJoin(answerTable, eq(questionTable.id, answerTable.questionId));

  const surveyAggregated = questions.reduce<
    Record<number, { survey: Survey; questions: (Question & { answers: Answer[] })[] }>
  >((acc, row) => {
    const survey = simpleSurvey[0];
    const question = row.question;
    const answer = row.answer;
    if (!acc[survey.id]) {
      acc[survey.id] = { survey, questions: [] };
    }
    const existingQuestion = acc[survey.id].questions.find((q) => q.id === question.id);
    if (existingQuestion) {
      if (answer) {
        existingQuestion.answers.push(answer);
      }
    } else {
      acc[survey.id].questions.push({ ...question, answers: answer ? [answer] : [] });
    }
    return acc;
  }, {});

  return { survey: surveyAggregated, message: "success" };
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

export async function createQuestion(collectedQuestion: CollectedQuestion, surveyId: number) {
  const session = await auth();
  if (!session?.user) return { question: null, message: "unauthenticated" };

  if (!(await isAuthorized(surveyId, session?.user))) {
    return { question: null, message: "unauthorized" };
  }

  const question = await db
    .insert(questionTable)
    .values({ ...collectedQuestion, surveyId })
    .returning();
  if (!question || question.length == 0) return { question, message: "internal error" };

  return { question, message: "success" };
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
      collectedQuestions.map(({ questionText, answerType, created_at, updated_at }) => ({
        questionText,
        answerType,
        created_at: new Date(created_at),
        updated_at: updated_at ? new Date(updated_at) : null,
        surveyId,
      }))
    )
    .returning();

  if (!questions || questions.length == 0) {
    return { questions, message: "internal error" };
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

// USER FUNCTIONS

export const getUsers = async () => {
  const selectResult = await db.select().from(users);
  return selectResult;
};

// HELPER FUNCTIONS

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function isAuthorized(surveyId: number, user: any) {
  const survey = await db.select().from(surveyTable).where(eq(surveyTable.id, surveyId));
  if (survey.length > 0 && survey[0].userId !== user.id) {
    return false;
  }
  return true;
}
