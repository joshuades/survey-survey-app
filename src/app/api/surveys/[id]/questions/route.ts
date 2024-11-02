import { createQuestion, getQuestionsForSurvey } from "@/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  id: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET = async (req: NextRequest, context: { params: Params }) => {
  const surveyId = context.params.id;

  const { questions, message } = await getQuestionsForSurvey(Number(surveyId));

  if (message === "unauthenticated") {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({ questions, message: "success" }, { status: 200 });
};

export const POST = async (req: NextRequest, context: { params: Params }) => {
  const surveyId = context.params.id;

  const { questionText } = await req.json();
  if (!questionText) {
    return Response.json({ error: "Question text not provided" }, { status: 400 });
  }
  const { question, message } = await createQuestion(questionText, Number(surveyId));

  if (message === "internal error") {
    return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
  }
  if (message === "unauthenticated") {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({ question, message: "Question created successfully" }, { status: 201 });
};
