// import "@/lib/config";
import { auth } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { survey as surveyTable, users } from "./schema";

export const db = drizzle({ client: sql, casing: "snake_case" });

// SURVEY FUNCTIONS

export type Survey = {
  id: number;
  name: string;
  updated_at: Date | null;
  created_at: Date;
  deleted_at: Date | null;
};

export async function createSurvey(name: string) {
  const session = await auth();
  if (!session?.user) return { survey: null, message: "unauthenticated" };

  const survey = await db.insert(surveyTable).values({ name }).returning();
  return { survey, message: "success" };
}

export async function getSurveys() {
  const session = await auth();
  if (!session?.user) return { surveys: [], message: "unauthenticated" };

  const surveys = await db.select().from(surveyTable);
  return { surveys, message: "success" };
}

export async function getSurveyById(id: number) {
  const session = await auth();
  if (!session?.user) return { survey: null, message: "unauthenticated" };

  const survey = await db.select().from(surveyTable).where(eq(surveyTable.id, id));
  return { survey, message: "success" };
}

export async function updateSurvey(id: number, name: string) {
  const session = await auth();
  if (!session?.user) return { survey: null, message: "unauthenticated" };

  const survey = await db
    .update(surveyTable)
    .set({ name })
    .where(eq(surveyTable.id, id))
    .returning();
  return { survey, message: "success" };
}

export async function deleteSurvey(id: number) {
  const session = await auth();
  if (!session?.user) return { survey: null, message: "unauthenticated" };

  const survey = await db.delete(surveyTable).where(eq(surveyTable.id, id)).returning();
  return { survey, message: "success" };
}


export const getUsers = async () => {
  const selectResult = await db.select().from(users);
  return selectResult;
};
