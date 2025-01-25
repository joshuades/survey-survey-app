"use client";

import { Question, SurveyAndQuestions } from "@/db";
import { checkForSurveyChanges } from "@/lib/utils";
import { useLoadingStore } from "@/store/loadingStore";
import { QuestionPointer, useMyLocalStore, useStore } from "@/store/surveysStore";
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
    setupBuilderState(surveyAndQuestions);
    setIsLoadingQuestions(false);
    setIsRouting(false);
  }, []);

  useEffect(() => {
    const user_logged_in_with_new_questions =
      !currentSurvey?.survey && session?.user && questionsLocal.length > 0;
    if (user_logged_in_with_new_questions) {
      transferQuestionsBackupToSurvey();
    }
  }, [isLoadingQuestions]);

  /**
   * Initializes the zustand state for the survey builder component.
   *
   * @param {SurveyAndQuestions} surveyAndQuestions The survey and its associated questions.
   * @returns {void}
   */
  const setupBuilderState = (surveyAndQuestions: SurveyAndQuestions) => {
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
    if (!session?.user || currentSurvey?.survey) {
      setQuestionsLocal([]);
    }
  };

  /**
   * Transfers questions from the local state to the current survey and updates the current changes.
   *
   * @usecase New questions must have been added to local storage while the user was not logged in.
   *
   * @returns {void}
   */
  const transferQuestionsBackupToSurvey = () => {
    setCurrentSurvey({
      survey: null,
      questions: [...(currentSurvey?.questions || []), ...questionsLocal],
    });
    setCurrentChanges({
      ...currentChanges,
      collectedQuestions: [
        ...currentChanges.collectedQuestions,
        ...questionsLocal.map((q: Question): QuestionPointer => {
          return { questionId: q.id };
        }),
      ],
    });
    setQuestionsLocal([]);
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
          <div className="relative mx-2 flex flex-wrap justify-between gap-[40px_5px]">
            <SurveySubmitButton />
            {currentSurvey?.survey &&
              checkForSurveyChanges(currentSurvey?.survey?.id, currentChanges) && (
                <DeleteChangesButton />
              )}
          </div>
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
