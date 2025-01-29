import { auth } from "@/lib/auth";
import { CollectedAnswer, CollectedAnswerer } from "@/store/surveysStore";
import { sql as vercelSql } from "@vercel/postgres";
import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { generateAccessLinkId } from "@/lib/utils";
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
  answersCount: number;
  userId: string;
  status: string;
  accessLinkId: string;
  linkUpdatedAt: Date | null;
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

export interface Question {
  id: number;
  questionText: string;
  answerType: string;
  index: number;
  status: string;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
  surveyId: number;
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

export interface PatchUpdate {
  id: number;
  [key: string]: string | number;
}

// SURVEY FUNCTIONS

export async function createSurvey(name: string, questions: Question[]) {
  const session = await auth();
  if (!session?.user?.id) return { survey: null, message: "unauthenticated" };

  const survey = await db
    .insert(surveyTable)
    .values({ name, userId: session?.user?.id, accessLinkId: generateAccessLinkId() })
    .returning();
  if (!survey || survey.length == 0) return { survey, message: "internal error" };

  if (questions.length > 0) {
    const result = await createQuestions(questions, survey[0].id, true);
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
    .orderBy(desc(surveyTable.created_at));

  return { surveys, message: "success" };
}

export async function getSurveyById(
  id: number | string,
  alreadyAuthorized: boolean = false,
  usingAccessLinkId: boolean = false
) {
  if (!alreadyAuthorized) {
    const session = await auth();
    if (!session?.user?.id) return { survey: null, message: "unauthenticated" };
  }

  // join survey with the question table and with the user table
  const survey = await db
    .select()
    .from(surveyTable)
    .where(
      usingAccessLinkId
        ? eq(surveyTable.accessLinkId, id.toString())
        : eq(surveyTable.id, Number(id))
    )
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

export async function updateSurvey(patchUpdate: PatchUpdate, surveyId: number) {
  const session = await auth();
  if (!session?.user) return { message: "unauthenticated" };
  if (!(await isAuthorized(surveyId, session?.user))) {
    return { message: "unauthorized" };
  }
  if (!patchUpdate) {
    return { message: "internal error" };
  }

  if (patchUpdate.hasOwnProperty("accessLinkId")) {
    const survey = await db
      .update(surveyTable)
      .set({
        accessLinkId: generateAccessLinkId(),
        updated_at: new Date(),
        linkUpdatedAt: new Date(),
      })
      .where(eq(surveyTable.id, surveyId))
      .returning();

    if (!survey || survey.length == 0) return { message: "not found" };

    return { survey: survey[0], message: "success" };
  }
  return { message: "internal error" };
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
  questions: Question[],
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

  const createdQuestions = await db
    .insert(questionTable)
    .values(
      questions.map(({ questionText, answerType, index, created_at, updated_at }) => ({
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

  if (!createdQuestions || createdQuestions.length == 0) {
    return { questions: createdQuestions, message: "internal error" };
  }

  await db.update(surveyTable).set({ updated_at: new Date() }).where(eq(surveyTable.id, surveyId));

  return { questions: createdQuestions, message: "success" };
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

  await db.update(surveyTable).set({ updated_at: new Date() }).where(eq(surveyTable.id, surveyId));

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

  await db.update(surveyTable).set({ updated_at: new Date() }).where(eq(surveyTable.id, surveyId));

  return { question, message: "success" };
}

export async function deleteQuestions(collectedDeletes: Question[], surveyId: number) {
  const session = await auth();
  if (!session?.user) return { message: "unauthenticated" };
  if (!(await isAuthorized(surveyId, session?.user))) {
    return { message: "unauthorized" };
  }

  const questionIds = collectedDeletes.map((d) => d.id);
  const deletedQuestions = await db
    .delete(questionTable)
    .where(and(eq(questionTable.surveyId, surveyId), inArray(questionTable.id, questionIds)))
    .returning();

  if (!deletedQuestions || deletedQuestions.length == 0) return { message: "not found" };

  await db.update(surveyTable).set({ updated_at: new Date() }).where(eq(surveyTable.id, surveyId));

  return { questions: deletedQuestions, message: "success" };
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

export async function updateQuestions(patchUpdates: PatchUpdate[], surveyId: number) {
  const session = await auth();
  if (!session?.user) return { message: "unauthenticated" };
  if (!(await isAuthorized(surveyId, session?.user))) {
    return { message: "unauthorized" };
  }
  if (patchUpdates.length === 0) {
    return { message: "internal error" };
  }
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const errors: any[] = [];

  // prepare update query for: INDEX UPDATES
  const index_up_query = db
    .update(questionTable)
    .set({ index: sql`CAST(${sql.placeholder("index")} AS INT)` })
    .where(eq(questionTable.id, sql.placeholder("id")))
    .prepare("index_up_query");

  /**
   * Executes an update query for a specific patch update.
   *
   * @returns {Promise<any>} The result of the update query.
   */
  function executeTask(patchUpdate: PatchUpdate) {
    if (patchUpdate.hasOwnProperty("index")) {
      return index_up_query.execute(patchUpdate);
    }
  }

  /**
   * Executes a series of patch updates by preparing and running tasks concurrently.
   *
   * @param {PatchUpdate[]} patchUpdates - An array of patch update objects to be processed.
   * @returns {Promise<void>} A promise that resolves when all tasks have been executed.
   */
  async function run(patchUpdates: PatchUpdate[]) {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const prepared_tasks: any[] = [];
    patchUpdates.forEach((patchUpdate) => {
      prepared_tasks.push(executeTask(patchUpdate));
    });
    await Promise.all(prepared_tasks);
  }

  try {
    await run(patchUpdates);
  } catch (e) {
    console.error("Caught error: ", e);
    errors.push(e);
  }

  if (errors.length > 0) {
    forceIndexes(surveyId);
    return { message: "partial error" };
  }

  await db.update(surveyTable).set({ updated_at: new Date() }).where(eq(surveyTable.id, surveyId));

  return { message: "success" };
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

/* eslint-disable  @typescript-eslint/no-explicit-any */
async function isAuthorized(surveyId: number, user: any) {
  const survey = await db.select().from(surveyTable).where(eq(surveyTable.id, surveyId));
  if (survey.length > 0 && survey[0].userId !== user.id) {
    return false;
  }
  return true;
}

/**
 * Used when updating questions' indexes failed.
 *
 * Sorts all questions by their current index and then updates each question's index
 * to ensure they are sequentially ordered starting from 1.
 */
async function forceIndexes(surveyId: number) {
  const questions = await db
    .select()
    .from(questionTable)
    .where(eq(questionTable.surveyId, surveyId))
    .orderBy(questionTable.index);

  questions.forEach(async (question, i) => {
    await db
      .update(questionTable)
      .set({ index: i + 1 })
      .where(eq(questionTable.id, question.id));
    // TODO: throw error if update fails
  });
}
