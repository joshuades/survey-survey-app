import { deleteSurvey, getSurveyById, updateSurvey } from "@/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  id: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET = async (req: NextRequest, context: { params: Params }) => {
  const id = context.params.id;

  const { survey, message } = await getSurveyById(Number(id));

  if (message === "unauthenticated") {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (message === "not found") {
    return Response.json({ error: "Survey not found" }, { status: 404 });
  }
  return NextResponse.json({ survey, message: "success" }, { status: 200 });
};

export const PUT = async (req: NextRequest, context: { params: Params }) => {
  const id = context.params.id;

  const { name } = await req.json();
  if (!name) {
    return Response.json({ error: "Name not provided" }, { status: 400 });
  }
  const { survey, message } = await updateSurvey(Number(id), name);

  if (message === "unauthenticated") {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (message === "not found") {
    return Response.json({ error: "Survey not found" }, { status: 404 });
  }
  return NextResponse.json({ survey, message: "Survey updated successfully" }, { status: 200 });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DELETE = async (req: NextRequest, context: { params: Params }) => {
  const id = context.params.id;

  const { survey, message } = await deleteSurvey(Number(id));

  if (message === "unauthenticated") {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (message === "not found") {
    return Response.json({ error: "Survey not found" }, { status: 404 });
  }
  return NextResponse.json({ survey, message: "Survey deleted successfully" }, { status: 200 });
};
