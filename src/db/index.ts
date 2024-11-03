// import "@/lib/config";
import { auth } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { question as questionTable, survey as surveyTable, users } from "./schema";

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

export type Question = {
  id: number;
  questionText: string;
  surveyId: number;
  updated_at: Date | null;
  created_at: Date;
  deleted_at: Date | null;
};

export type SurveysWithQuestions = Record<number, { survey: Survey; questions: Question[] }>;

// SURVEY FUNCTIONS

export async function createSurvey(name: string) {
  const session = await auth();
  if (!session?.user) return { survey: null, message: "unauthenticated" };

  const survey = await db
    .insert(surveyTable)
    .values({ name, userId: session?.user?.id! })
    .returning();
  if (!survey || survey.length == 0) return { survey, message: "internal error" };
  return { survey, message: "success" };
}

export async function getSurveys() {
  const session = await auth();
  if (!session?.user) return { surveys: [], message: "unauthenticated" };

  // join the survey table with the question table
  const surveys = await db
    .select()
    .from(surveyTable)
    .where(eq(surveyTable.userId, session?.user?.id!))
    .leftJoin(questionTable, eq(surveyTable.id, questionTable.surveyId));

  // aggregate the questions for each survey
  const surveysWithQuestions = surveys.reduce<
    Record<number, { survey: Survey; questions: Question[] }>
  >((acc, row) => {
    const survey = row.survey;
    const question = row.question;
    if (!acc[survey.id]) {
      acc[survey.id] = { survey, questions: [] };
    }
    if (question) {
      acc[survey.id].questions.push(question);
    }
    return acc;
  }, {});

  return { surveys: surveysWithQuestions, message: "success" };
}

export async function getSurveyById(id: number) {
  const session = await auth();
  if (!session?.user) return { survey: null, message: "unauthenticated" };

  const survey = await db.select().from(surveyTable).where(eq(surveyTable.id, id));

  if (survey.length > 0 && survey[0].userId !== session?.user?.id) {
    return { message: "unauthorized" };
  }
  if (!survey || survey.length == 0) return { survey, message: "not found" };
  return { survey, message: "success" };
}

export async function updateSurvey(id: number, name: string) {
  const session = await auth();
  if (!session?.user) return { survey: null, message: "unauthenticated" };

  const survey = await db
    .update(surveyTable)
    .set({ name })
    .where(and(eq(surveyTable.id, id), eq(surveyTable.userId, session?.user?.id!)))
    .returning();
  if (!survey || survey.length == 0) return { survey, message: "not found" };
  return { survey, message: "success" };
}

export async function deleteSurvey(id: number) {
  const session = await auth();
  if (!session?.user) return { survey: null, message: "unauthenticated" };

  const survey = await db
    .delete(surveyTable)
    .where(and(eq(surveyTable.id, id), eq(surveyTable.userId, session?.user?.id!)))
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

export async function createQuestion(questionText: string, surveyId: number) {
  const session = await auth();
  if (!session?.user) return { question: null, message: "unauthenticated" };

  if (!(await isAuthorized(surveyId, session?.user))) {
    return { question: null, message: "unauthorized" };
  }

  const question = await db.insert(questionTable).values({ questionText, surveyId }).returning();
  if (!question || question.length == 0) return { question, message: "internal error" };

  return { question, message: "success" };
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

async function isAuthorized(surveyId: number, user: any) {
  const survey = await db.select().from(surveyTable).where(eq(surveyTable.id, surveyId));
  if (survey.length > 0 && survey[0].userId !== user.id) {
    return false;
  }
  return true;
}
