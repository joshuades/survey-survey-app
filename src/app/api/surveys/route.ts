import { createSurvey, getSurveys } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  const { surveys, message } = await getSurveys();

  if (message === "unauthenticated") {
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({ surveys, message: "success" }, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const { name } = await req.json();
  if (!name) {
    return Response.json({ message: "Survey name not provided" }, { status: 400 });
  }
  const { survey, message } = await createSurvey(name);

  if (message === "unauthenticated") {
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({ survey, message: "Survey created successfully" }, { status: 201 });
};
