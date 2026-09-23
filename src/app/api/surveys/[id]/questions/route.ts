import { createQuestions, deleteQuestions, getQuestionsForSurvey, updateQuestions } from "@/db";
import { reportIfPersistenceFailure, unauthorizedJson, withReportedHandler } from "@/lib/sentry-report";
import { NextRequest, NextResponse } from "next/server";

export const GET = withReportedHandler(
  "survey-persistence",
  "getQuestionsForSurvey",
  async (_req: NextRequest, context: { params: { id: string } }) => {
    const surveyId = context.params.id;

    const { questions, message } = await getQuestionsForSurvey(Number(surveyId));

    if (message === "unauthenticated") {
      return unauthorizedJson("GET /api/surveys/[id]/questions", "GET");
    }
    if (message === "unauthorized") {
      return Response.json({ error: "Please log in with the correct account." }, { status: 403 });
    }
    if (await reportIfPersistenceFailure(message, "getQuestionsForSurvey")) {
      return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
    }
    return NextResponse.json({ questions }, { status: 200 });
  },
  { failure: "database" }
);

export const POST = withReportedHandler(
  "survey-persistence",
  "createQuestions",
  async (req: NextRequest, context: { params: { id: string } }) => {
    const surveyId = context.params.id;

    const { questions: questionsToAdd } = await req.json();
    if (!questionsToAdd) {
      return Response.json({ error: "Questions not provided" }, { status: 400 });
    }
    const { questions, message } = await createQuestions(questionsToAdd, Number(surveyId));

    if (await reportIfPersistenceFailure(message, "createQuestions")) {
      return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
    }
    if (message === "unauthenticated") {
      return unauthorizedJson("POST /api/surveys/[id]/questions", "POST");
    }
    if (message === "unauthorized") {
      return Response.json({ error: "Please log in with the correct account." }, { status: 403 });
    }
    return NextResponse.json(
      { questions, message: "Questions created successfully" },
      { status: 201 }
    );
  },
  { failure: "database" }
);

export const DELETE = withReportedHandler(
  "survey-persistence",
  "deleteQuestions",
  async (req: NextRequest, context: { params: { id: string } }) => {
    const surveyId = context.params.id;
    const { collectedDeletes } = await req.json();
    if (!collectedDeletes) {
      return Response.json({ error: "Deletes not provided" }, { status: 400 });
    }
    const { questions, message } = await deleteQuestions(collectedDeletes, Number(surveyId));

    if (message === "unauthenticated") {
      return unauthorizedJson("DELETE /api/surveys/[id]/questions", "DELETE");
    }
    if (message === "unauthorized") {
      return Response.json({ error: "Please log in with the correct account." }, { status: 403 });
    }
    if (message === "not found") {
      return Response.json({ error: "Questions to delete not found." }, { status: 404 });
    }
    if (await reportIfPersistenceFailure(message, "deleteQuestions")) {
      return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
    }
    return NextResponse.json(
      { questions, message: "Questions deleted successfully" },
      { status: 200 }
    );
  },
  { failure: "database" }
);

export const PATCH = withReportedHandler(
  "survey-persistence",
  "updateQuestions",
  async (req: NextRequest, context: { params: { id: string } }) => {
    const surveyId = context.params.id;
    const { patchUpdates } = await req.json();
    if (!patchUpdates) {
      return Response.json({ error: "Updates not provided" }, { status: 400 });
    }
    const { message } = await updateQuestions(patchUpdates, Number(surveyId));

    if (message === "unauthenticated") {
      return unauthorizedJson("PATCH /api/surveys/[id]/questions", "PATCH");
    }
    if (message === "unauthorized") {
      return Response.json({ error: "Please log in with the correct account." }, { status: 403 });
    }
    if (message === "partial error") {
      return Response.json({ error: "Please reload the page and try again." }, { status: 500 });
    }
    if (message === "not found") {
      return Response.json({ error: "Question to update not found." }, { status: 404 });
    }
    if (await reportIfPersistenceFailure(message, "updateQuestions")) {
      return Response.json({ error: "Please reload the page and try again." }, { status: 500 });
    }
    return Response.json({ message: "Questions updated successfully" }, { status: 200 });
  },
  { failure: "database" }
);
