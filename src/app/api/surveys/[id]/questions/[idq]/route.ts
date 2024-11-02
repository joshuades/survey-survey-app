import { deleteQuestion, getQuestionById, updateQuestion } from "@/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  id: string;
  idq: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET = async (req: NextRequest, context: { params: Params }) => {
  const questionId = context.params.idq;
  const { question, message } = await getQuestionById(Number(questionId));

  if (message === "unauthenticated") {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (message === "not found") {
    return Response.json({ error: "Question not found" }, { status: 404 });
  }
  return NextResponse.json({ question }, { status: 200 });
};

export const PUT = async (req: NextRequest, context: { params: Params }) => {
  const questionId = context.params.idq;
  const { text } = await req.json();
  if (!text) {
    return Response.json({ error: "Text not provided" }, { status: 400 });
  }
  const { question, message } = await updateQuestion(Number(questionId), text);

  if (message === "unauthenticated") {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (message === "not found") {
    return Response.json({ error: "Question not found" }, { status: 404 });
  }
  return NextResponse.json({ question, message: "Question updated successfully" }, { status: 200 });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DELETE = async (req: NextRequest, context: { params: Params }) => {
  const questionId = context.params.idq;
  const { question, message } = await deleteQuestion(Number(questionId));

  if (message === "unauthenticated") {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (message === "not found") {
    return Response.json({ error: "Question not found" }, { status: 404 });
  }
  return NextResponse.json({ question, message: "Question deleted successfully" }, { status: 200 });
};
