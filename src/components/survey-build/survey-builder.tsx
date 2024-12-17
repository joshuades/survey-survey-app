"use client";

import { Button } from "@/components/ui/button";
import { SurveyAndQuestions } from "@/db";
import { checkForSurveyChanges } from "@/lib/utils";
import { useMyLocalStore, useStore } from "@/store/surveysStore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FadeInWrapper from "../fade-in-wrapper";
import { Skeleton } from "../ui/skeleton";
import BuilderControlRow from "./builder-control-row";
import Questions from "./questions";
import SurveySubmitButton from "./survey-submit-button";

export default function SurveyBuilder({
  surveyAndQuestions,
}: {
  surveyAndQuestions: SurveyAndQuestions;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const { questionsLocal, clearQuestionsLocal } = useMyLocalStore();
  const { data: session } = useSession();

  const {
    currentSurvey,
    currentChanges,
    setCurrentChanges,
    setCurrentSurvey,
    setSelectedSurveyId,
  } = useStore();

  useEffect(() => {
    if (surveyAndQuestions) {
      setCurrentSurvey(surveyAndQuestions);
    }
    setSelectedSurveyId(surveyAndQuestions?.survey?.id || null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // If user logs in and there are questions in local storage, transfer them to the current changes
    if (!currentSurvey?.survey && session?.user && questionsLocal.length > 0) {
      setCurrentChanges({
        ...currentChanges,
        collectedQuestions: [...currentChanges.collectedQuestions, ...questionsLocal],
      });
      clearQuestionsLocal();
    }
  }, [isLoading]);

  useEffect(() => {
    console.log("questionsLocal:", questionsLocal);
  }, [questionsLocal]);

  const handleDeleteChanges = () => {
    if (confirm("Are you sure you want to delete all survey changes?"))
      setCurrentChanges({
        ...currentChanges,
        surveyId: surveyAndQuestions?.survey?.id || null,
        collectedQuestions: [],
        collectedDeletes: [],
      });
  };

  return (
    <div className="grid w-full gap-[60px]">
      <BuilderControlRow surveyAndQuestions={surveyAndQuestions} />

      {!isLoading ? (
        <>
          {(checkForSurveyChanges(currentSurvey?.survey?.id || null, currentChanges) ||
            (currentSurvey?.questions && currentSurvey.questions.length > 0)) && (
            <FadeInWrapper>
              <Questions />
            </FadeInWrapper>
          )}
        </>
      ) : (
        <div className="mx-2 flex flex-col gap-[25px]">
          <Skeleton className="h-[48px] w-[60vw] lg:w-[250px]" />
          <Skeleton className="h-[48px] w-[200px]" />
          <Skeleton className="h-[48px] w-[90vw] lg:w-[450px]" />
        </div>
      )}

      {!isLoading ? (
        <>
          {checkForSurveyChanges(currentSurvey?.survey?.id || null, currentChanges) && (
            <div className="mx-2 flex justify-between gap-5">
              <SurveySubmitButton />
              <Button onClick={() => handleDeleteChanges()} variant={"secondary"}>
                Delete Changes
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="mx-2 flex justify-between gap-5">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      )}
    </div>
  );
}
