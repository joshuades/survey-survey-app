import { deleteSurvey, getSurveyById, updateSurvey } from "@/db";
import { reportIfPersistenceFailure, unauthorizedJson, withReportedHandler } from "@/lib/sentry-report";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  id: string;
};

export const GET = withReportedHandler(
  "survey-persistence",
  "getSurveyById",
  async (_req: NextRequest, context: { params: Params }) => {
    const id = context.params.id;

    const { survey, message } = await getSurveyById(Number(id));

    if (message === "unauthenticated") {
      return unauthorizedJson("GET /api/surveys/[id]", "GET");
    }
    if (message === "unauthorized") {
      return Response.json({ error: "Please log in with the correct account." }, { status: 403 });
    }
    if (message === "not found") {
      return Response.json({ error: "Survey not found" }, { status: 404 });
    }
    if (await reportIfPersistenceFailure(message, "getSurveyById")) {
      return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
    }
    return NextResponse.json({ survey }, { status: 200 });
  },
  { failure: "database" }
);

export const DELETE = withReportedHandler(
  "survey-persistence",
  "deleteSurvey",
  async (_req: NextRequest, context: { params: Params }) => {
    const id = context.params.id;

    const { survey, message } = await deleteSurvey(Number(id));

    if (message === "unauthenticated") {
      return unauthorizedJson("DELETE /api/surveys/[id]", "DELETE");
    }
    if (message === "not found") {
      return Response.json(
        { error: "Survey not found. Try again with a different account." },
        { status: 404 }
      );
    }
    if (await reportIfPersistenceFailure(message, "deleteSurvey")) {
      return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
    }
    return NextResponse.json({ survey, message: "Survey deleted successfully" }, { status: 200 });
  },
  { failure: "database" }
);

export const PATCH = withReportedHandler(
  "survey-persistence",
  "updateSurvey",
  async (req: NextRequest, context: { params: { id: string } }) => {
    const id = context.params.id;

    const { patchUpdate } = await req.json();
    if (!patchUpdate) {
      return Response.json({ error: "Update information not provided" }, { status: 400 });
    }
    const { survey, message } = await updateSurvey(patchUpdate, Number(id));

    if (message === "unauthenticated") {
      return unauthorizedJson("PATCH /api/surveys/[id]", "PATCH");
    }
    if (message === "unauthorized") {
      return Response.json({ error: "Please log in with the correct account." }, { status: 403 });
    }
    if (message === "not found") {
      return Response.json({ error: "Survey not found" }, { status: 404 });
    }
    if (await reportIfPersistenceFailure(message, "updateSurvey")) {
      return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
    }
    return NextResponse.json({ survey, message: "Survey updated successfully" }, { status: 200 });
  },
  { failure: "database" }
);
