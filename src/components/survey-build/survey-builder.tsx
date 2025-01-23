"use client";

import { Button } from "@/components/ui/button";
import { SurveyAndQuestions } from "@/db";
import { checkForSurveyChanges } from "@/lib/utils";
import { useLoadingStore } from "@/store/loadingStore";
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

  /**
   * Retrieves the original questions from the current survey, including any deleted questions,
   * and restores their original values based on the collected updates.
   *
   * @returns {Array} An array of questions with their original values restored.
   */
  const getOriginalQuestions = () => {
    return [...(currentSurvey?.questions || []), ...currentChanges.deletedQuestions]
      .filter((q) => q.status !== "new")
      .map((q) => {
        const collectedUpdates_for_q = currentChanges.collectedUpdates.filter(
          (cu) => cu.questionId === q.id
        );
        // for each update, restore the originalValue of the question
        collectedUpdates_for_q.forEach((cu) => {
          /* eslint-disable  @typescript-eslint/no-explicit-any */
          (q as any)[cu.field] = cu.originalValue;
        });
        return q;
      });
  };

  const handleDeleteChanges = () => {
    if (!confirm("Are you sure you want to delete all survey changes?")) return;

    setCurrentSurvey({
      survey: currentSurvey?.survey || null,
      questions: getOriginalQuestions(),
    });

    setCurrentChanges({
      ...currentChanges,
      surveyId: surveyAndQuestions?.survey?.id || null,
      collectedQuestions: [],
      deletedQuestions: [],
      collectedUpdates: [],
    });
  };

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
