import { deleteQuestion, getQuestionById, updateQuestion } from "@/db";
import { reportIfPersistenceFailure, unauthorizedJson, withReportedHandler } from "@/lib/sentry-report";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  id: string;
  idq: string;
};

export const GET = withReportedHandler(
  "survey-persistence",
  "getQuestionById",
  async (_req: NextRequest, context: { params: Params }) => {
    const questionId = context.params.idq;
    const surveyId = context.params.id;
    const { question, message } = await getQuestionById(Number(questionId), Number(surveyId));

    if (message === "unauthenticated") {
      return unauthorizedJson("GET /api/surveys/[id]/questions/[idq]", "GET");
    }
    if (message === "unauthorized") {
      return Response.json({ error: "Please log in with the correct account." }, { status: 403 });
    }
    if (message === "not found") {
      return Response.json({ error: "Question not found" }, { status: 404 });
    }
    if (await reportIfPersistenceFailure(message, "getQuestionById")) {
      return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
    }
    return NextResponse.json({ question }, { status: 200 });
  },
  { failure: "database" }
);

export const PUT = withReportedHandler(
  "survey-persistence",
  "updateQuestion",
  async (req: NextRequest, context: { params: Params }) => {
    const questionId = context.params.idq;
    const surveyId = context.params.id;
    const { text } = await req.json();
    if (!text) {
      return Response.json({ error: "Text not provided" }, { status: 400 });
    }
    const { question, message } = await updateQuestion(Number(questionId), text, Number(surveyId));

    if (message === "unauthenticated") {
      return unauthorizedJson("PUT /api/surveys/[id]/questions/[idq]", "PUT");
    }
    if (message === "not found") {
      return Response.json({ error: "Question not found" }, { status: 404 });
    }
    if (message === "unauthorized") {
      return Response.json({ error: "Please log in with the correct account." }, { status: 403 });
    }
    if (await reportIfPersistenceFailure(message, "updateQuestion")) {
      return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
    }
    return NextResponse.json({ question, message: "Question updated successfully" }, { status: 200 });
  },
  { failure: "database" }
);

export const DELETE = withReportedHandler(
  "survey-persistence",
  "deleteQuestion",
  async (_req: NextRequest, context: { params: Params }) => {
    const questionId = context.params.idq;
    const surveyId = context.params.id;
    const { question, message } = await deleteQuestion(Number(questionId), Number(surveyId));

    if (message === "unauthenticated") {
      return unauthorizedJson("DELETE /api/surveys/[id]/questions/[idq]", "DELETE");
    }
    if (message === "unauthorized") {
      return Response.json({ error: "Please log in with the correct account." }, { status: 403 });
    }
    if (message === "not found") {
      return Response.json({ error: "Question not found" }, { status: 404 });
    }
    if (await reportIfPersistenceFailure(message, "deleteQuestion")) {
      return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
    }
    return NextResponse.json({ question, message: "Question deleted successfully" }, { status: 200 });
  },
  { failure: "database" }
);
