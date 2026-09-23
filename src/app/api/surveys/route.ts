import { createSurvey, getSurveys } from "@/db";
import { reportIfPersistenceFailure, unauthorizedJson, withReportedHandler } from "@/lib/sentry-report";
import { NextRequest, NextResponse } from "next/server";

export const GET = withReportedHandler(
  "survey-persistence",
  "getSurveys",
  async () => {
    const { surveys, message } = await getSurveys();

    if (message === "unauthenticated") {
      return unauthorizedJson("GET /api/surveys", "GET");
    }
    if (await reportIfPersistenceFailure(message, "getSurveys")) {
      return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
    }
    return NextResponse.json({ surveys, message: "success" }, { status: 200 });
  },
  { failure: "database" }
);

export const POST = withReportedHandler(
  "survey-persistence",
  "createSurvey",
  async (req: NextRequest) => {
    const { name, questions } = await req.json();
    if (!name) {
      return Response.json({ error: "Survey name not provided" }, { status: 400 });
    }
    const { survey, message } = await createSurvey(name, questions);

    if (message === "unauthenticated") {
      return unauthorizedJson("POST /api/surveys", "POST");
    }
    if (await reportIfPersistenceFailure(message, "createSurvey")) {
      return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
    }
    return NextResponse.json({ survey, message: "Survey created successfully" }, { status: 201 });
  },
  { failure: "database" }
);
