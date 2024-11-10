import { getSurveys } from "@/db";

import React, { ReactElement, ReactNode } from "react";

export default async function SurveysWrapper({ children }: { children: ReactNode }) {
  const { surveys, message } = await getSurveys();

  if (message === "unauthenticated") {
    return <p>Sign up to see all Surveys.</p>;
  }

  return <>{React.cloneElement(children as ReactElement, { surveys: surveys })}</>;
}
