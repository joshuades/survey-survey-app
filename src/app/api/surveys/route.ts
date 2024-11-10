import { createSurvey, getSurveys } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  const { surveys, message } = await getSurveys();

  if (message === "unauthenticated") {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (message === "internal error") {
    return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
  }
  return NextResponse.json({ surveys, message: "success" }, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const { name, collectedQuestions } = await req.json();
  if (!name) {
    return Response.json({ error: "Survey name not provided" }, { status: 400 });
  }
  const { survey, message } = await createSurvey(name, collectedQuestions);

  if (message === "unauthenticated") {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (message === "internal error") {
    return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
  }
  return NextResponse.json({ survey, message: "Survey created successfully" }, { status: 201 });
};
