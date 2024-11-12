import { createAnswers } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, context: { params: { id: string } }) => {
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
    return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
  }

  return NextResponse.json({ answers, message: "Answers created successfully" }, { status: 201 });
};
