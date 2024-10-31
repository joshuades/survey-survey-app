import { getUsers } from "@/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const GET = auth(async (req) => {
  if (req.auth) {
    const users = await getUsers();
    return NextResponse.json({ users, message: "success" });
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 });
}) as any; // TODO: Fix `auth()` return type
