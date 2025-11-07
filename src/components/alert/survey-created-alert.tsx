"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Survey } from "@/db";
import { useEffect, useState } from "react";
import FadeInWrapper from "../fade-in-wrapper";

const SurveyCreatedAlert = ({ survey }: { survey: Survey }) => {
  const [isCreatedRecently, setIsCreatedRecently] = useState(false);

  useEffect(() => {
    // check if survey was created just recently
    if (survey?.created_at > new Date(Date.now() - 1000 * 60 * 0.1)) {
      setIsCreatedRecently(true);
      setTimeout(() => {
        setIsCreatedRecently(false);
      }, 8000);
    }
  }, []);

  return (
    <>
      {isCreatedRecently && (
        <FadeInWrapper startOpacity={0} delay={0.2}>
          <Alert variant={"popover"}>
            <AlertTitle>
              Created Survey <span className="uppercase">&quot;{survey.name}&quot;</span>{" "}
              Successfully!
            </AlertTitle>
            <AlertDescription></AlertDescription>
          </Alert>
        </FadeInWrapper>
      )}
    </>
  );
};

export default SurveyCreatedAlert;
