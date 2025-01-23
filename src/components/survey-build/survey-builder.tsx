"use client";

import { SurveyAndQuestions } from "@/db";
import { checkForSurveyChanges } from "@/lib/utils";
import { useLoadingStore } from "@/store/loadingStore";
import { useMyLocalStore, useStore } from "@/store/surveysStore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FadeInWrapper from "../fade-in-wrapper";
import { Skeleton } from "../ui/skeleton";
import BuilderControlRow from "./builder-control-row";
import DeleteChangesButton from "./delete-changes-button";
import Questions from "./questions";
import SurveySubmitButton from "./survey-submit-button";

export default function SurveyBuilder({
  surveyAndQuestions,
}: {
  surveyAndQuestions: SurveyAndQuestions;
}) {
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const { questionsLocal, setQuestionsLocal } = useMyLocalStore();
  const { data: session } = useSession();
  const { setIsRouting } = useLoadingStore();

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
    setCurrentChanges({
      surveyId: surveyAndQuestions?.survey?.id || null,
      collectedQuestions: [],
      deletedQuestions: [],
      collectedUpdates: [],
    });
    setIsLoadingQuestions(false);
    setIsRouting(false);
  }, []);

  useEffect(() => {
    // If user logs in and there are questions in local storage, transfer them to the current changes
    if (!currentSurvey?.survey && session?.user && questionsLocal.length > 0) {
      setCurrentSurvey({
        survey: null,
        questions: [...(currentSurvey?.questions || []), ...questionsLocal],
      });
      setQuestionsLocal([]);
    }
  }, [isLoadingQuestions]);

  useEffect(() => {
    console.log("questionsLocal:", questionsLocal);
  }, [questionsLocal]);

  return (
    <div className="grid w-full gap-[60px]">
      <BuilderControlRow />

      {!isLoadingQuestions ? (
        <>
          {(checkForSurveyChanges(currentSurvey?.survey?.id || null, currentChanges) ||
            (currentSurvey?.questions && currentSurvey.questions.length > 0)) && (
            <FadeInWrapper>
              <Questions sortOrder="DESC" />
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

      {!isLoadingQuestions ? (
        <>
          {checkForSurveyChanges(currentSurvey?.survey?.id || null, currentChanges) && (
            <div className="relative mx-2 flex flex-wrap justify-between gap-[40px_5px]">
              <SurveySubmitButton />
              <DeleteChangesButton />
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
