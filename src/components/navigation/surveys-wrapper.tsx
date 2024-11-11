import { getSurveys } from "@/db";

import { signIn } from "@/lib/auth";
import React, { ReactElement, ReactNode } from "react";
import { Button } from "../ui/button";

export default async function SurveysWrapper({ children }: { children: ReactNode }) {
  const { surveys, message } = await getSurveys();

  if (message === "unauthenticated") {
    return (
      <div>
        <form
          action={async () => {
            "use server";
            await signIn();
          }}
          className="inline"
        >
          <Button className="text-[15px] font-normal" variant={"secondary"}>
            Sign in
          </Button>
        </form>{" "}
        to see all surveys.
      </div>
    );
  }

  return <>{React.cloneElement(children as ReactElement, { surveys: surveys })}</>;
}
