import { createAnswers } from "@/db";
import { reportServerProblem, withReportedHandler } from "@/lib/sentry-report";
import { NextRequest, NextResponse } from "next/server";

export const POST = withReportedHandler(
  "answer-submission",
  "createAnswers",
  async (req: NextRequest, context: { params: { id: string } }) => {
    const surveyId = context.params.id;

    const { collectedAnswers, collectedAnswerer } = await req.json();
    if (!collectedAnswers) {
      return Response.json({ error: "Answers not provided" }, { status: 400 });
    }
    const { answers, message } = await createAnswers(
      collectedAnswers,
      Number(surveyId),
      collectedAnswerer
    );

    if (message === "internal error") {
      await reportServerProblem(new Error("Answer submission failed"), {
        area: "answer-submission",
        operation: "createAnswers",
        tags: { failure: "database" },
        fingerprint: ["answer-submission", "createAnswers"],
      });
      return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
    }

    return NextResponse.json({ answers, message: "Answers created successfully" }, { status: 201 });
  },
  { failure: "database" }
);
