import * as Sentry from "@sentry/nextjs";

export type ProblemArea = "generate-questions" | "answer-submission" | "survey-persistence" | "auth";

type ReportOptions = {
  area: ProblemArea;
  operation: string;
  tags?: Record<string, string>;
  fingerprint?: string[];
  level?: "fatal" | "error" | "warning";
};

function asError(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) return error;
  return new Error(fallbackMessage);
}

export function openaiCallFailed(cause?: unknown) {
  const error = new Error("OpenAI call failed");
  if (cause instanceof Error) {
    error.cause = cause;
  } else if (cause != null) {
    error.cause = new Error(String(cause));
  }
  return error;
}

/**
 * Captures a server failure and waits for the event to leave the serverless isolate.
 * Swallowed API errors never reach Sentry unless this runs before the response returns.
 */
export async function reportServerProblem(error: unknown, options: ReportOptions) {
  const reported = asError(error, options.operation);
  try {
    Sentry.captureException(reported, {
      level: options.level ?? "error",
      tags: {
        area: options.area,
        operation: options.operation,
        ...options.tags,
      },
      fingerprint: options.fingerprint,
    });
    Sentry.logger.error(reported.message, {
      area: options.area,
      operation: options.operation,
    });
    await Sentry.flush(2000);
  } catch (reportError) {
    console.error("Failed to report error to Sentry:", reportError);
  }
}

export function reportClientProblem(error: unknown, options: ReportOptions) {
  const reported = asError(error, options.operation);
  Sentry.captureException(reported, {
    level: options.level ?? "error",
    tags: {
      area: options.area,
      operation: options.operation,
      runtime: "client",
      ...options.tags,
    },
    fingerprint: options.fingerprint,
  });
  Sentry.logger.error(reported.message, {
    area: options.area,
    operation: options.operation,
    runtime: "client",
  });
}

export async function reportIfPersistenceFailure(message: string, operation: string) {
  if (message !== "internal error" && message !== "partial error") return false;
  await reportServerProblem(new Error(`Survey persistence failed during ${operation}`), {
    area: "survey-persistence",
    operation,
    tags: { failure: "database", db_result: message },
    fingerprint: ["survey-persistence", operation],
  });
  return true;
}

export async function unauthorizedJson(
  route: string,
  method: string,
  body: Record<string, string> = { error: "Not authenticated" }
) {
  await reportServerProblem(new Error("Authenticated API returned 401"), {
    area: "auth",
    operation: "unauthorized",
    level: "warning",
    tags: { failure: "unauthorized", route, method },
    fingerprint: ["authenticated-api-401"],
  });
  return Response.json(body, { status: 401 });
}

export function withReportedHandler<A extends unknown[]>(
  area: ProblemArea,
  operation: string,
  handler: (...args: A) => Promise<Response>,
  tags?: Record<string, string>
) {
  return async (...args: A) => {
    try {
      return await handler(...args);
    } catch (error) {
      await reportServerProblem(error, { area, operation, tags });
      return Response.json({ error: "Something went wrong on the server" }, { status: 500 });
    }
  };
}
