import { deleteUser, getUsers } from "@/db";
import { auth } from "@/lib/auth";
import { reportServerProblem, unauthorizedJson } from "@/lib/sentry-report";
import { NextRequest, NextResponse } from "next/server";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const GET = auth(async (req) => {
  try {
    if (req.auth) {
      const adminMail = process.env.ADMIN_EMAIL;
      if (req.auth?.user?.email !== adminMail) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
      }
      const users = await getUsers();
      return NextResponse.json({ users }, { status: 200 });
    }

    return unauthorizedJson("GET /api/users", "GET", { message: "Not authenticated" });
  } catch (error) {
    await reportServerProblem(error, {
      area: "auth",
      operation: "getUsers",
      tags: { failure: "authjs" },
    });
    return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
  }
}) as any;

export const DELETE = async (req: NextRequest) => {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return Response.json({ error: "User ID not provided" }, { status: 400 });
    }
    const { message } = await deleteUser(userId);

    if (message === "unauthenticated") {
      return unauthorizedJson("DELETE /api/users", "DELETE");
    }
    if (message === "unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }
    if (message === "user not found") {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    if (message === "internal error") {
      await reportServerProblem(new Error("Account deletion failed"), {
        area: "auth",
        operation: "deleteUser",
        tags: { failure: "database" },
      });
      return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
    }
    return Response.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    await reportServerProblem(error, {
      area: "auth",
      operation: "deleteUser",
      tags: { failure: "database" },
    });
    return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
  }
};
