import { getUsers } from "@/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const GET = auth(async (req) => {
  if (req.auth) {
    const adminMail = "dimlight488@gmail.com";
    if (req.auth?.user?.email !== adminMail) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    const users = await getUsers();
    return NextResponse.json({ users }, { status: 200 });
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 });
}) as any; // TODO: Fix `auth()` return type
