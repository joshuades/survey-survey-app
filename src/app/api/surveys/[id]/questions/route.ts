import { createQuestions, deleteQuestions, getQuestionsForSurvey } from "@/db";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET = async (req: NextRequest, context: { params: { id: string } }) => {
  const surveyId = context.params.id;

  const { questions, message } = await getQuestionsForSurvey(Number(surveyId));

  if (message === "unauthenticated") {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (message === "unauthorized") {
    return Response.json({ error: "Please log in with the correct account." }, { status: 403 });
  }
  return NextResponse.json({ questions }, { status: 200 });
};

export const POST = async (req: NextRequest, context: { params: { id: string } }) => {
  const surveyId = context.params.id;

  const { collectedQuestions } = await req.json();
  if (!collectedQuestions) {
    return Response.json({ error: "Questions not provided" }, { status: 400 });
  }
  const { questions, message } = await createQuestions(collectedQuestions, Number(surveyId));

  if (message === "internal error") {
    return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
  }
  if (message === "unauthenticated") {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (message === "unauthorized") {
    return Response.json({ error: "Please log in with the correct account." }, { status: 403 });
  }
  return NextResponse.json(
    { questions, message: "Questions created successfully" },
    { status: 201 }
  );
};

export const DELETE = async (req: NextRequest, context: { params: { id: string } }) => {
  const surveyId = context.params.id;
  const { collectedDeletes } = await req.json();
  if (!collectedDeletes) {
    return Response.json({ error: "Deletes not provided" }, { status: 400 });
  }
  const { message } = await deleteQuestions(collectedDeletes, Number(surveyId));

  if (message === "unauthenticated") {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (message === "unauthorized") {
    return Response.json({ error: "Please log in with the correct account." }, { status: 403 });
  }
  if (message === "not found") {
    return Response.json({ error: "Something went wrong with DELETE" }, { status: 404 });
  }
  return NextResponse.json({ message: "Questions deleted successfully" }, { status: 200 });
};
