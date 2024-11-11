"use client";

import { checkForSurveyChanges, randomString } from "@/lib/utils";
import { CollectedDelete, CollectedQuestion, useStore } from "@/store/surveys";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FunctionComponent, useState } from "react";
import { Button } from "../ui/button";

const SurveySubmitButton: FunctionComponent = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const { currentSurvey, setCurrentSurvey, addSurvey, currentChanges, setCurrentChanges } =
    useStore();

  const tryCreateSurveyInDb = async (name: string, collectedQuestions: CollectedQuestion[]) => {
    const response = await fetch("/api/surveys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, collectedQuestions }),
    });

    if (!response.ok) {
      console.error("ERROR, check api response: ", response);
      setErrorMessage(`${response.statusText}`);
      setIsLoading(false);
      return;
    } else {
      const data = await response.json();

      const survey = data.survey.survey;
      addSurvey(survey);
      router.push(`/builder/${survey.id}`, { scroll: true });
      setCurrentChanges({
        ...currentChanges,
        surveyId: survey.id || null,
        collectedQuestions: [],
      });
    }
  };

  const tryAddQuestionsToDb = async (collectedQuestions: CollectedQuestion[]) => {
    const surveyId = currentSurvey?.survey?.id;
    const response = await fetch(`/api/surveys/${surveyId}/questions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ collectedQuestions }),
    });

    if (!response.ok) {
      console.error("ERROR, check api response: ", response);
      setErrorMessage(`${response.statusText}`);
      setIsLoading(false);
      return;
    } else {
      const data = await response.json();
      const newQuestions = data.questions;
      setCurrentSurvey({
        survey: currentSurvey?.survey || null,
        questions: [...(currentSurvey?.questions || []), ...newQuestions],
      });
    }
  };

  const tryDeleteQuestionsFromDb = async (collectedDeletes: CollectedDelete[]) => {
    const surveyId = currentSurvey?.survey?.id;
    const response = await fetch(`/api/surveys/${surveyId}/questions/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ collectedDeletes }),
    });

    if (!response.ok) {
      console.error("ERROR, check api response: ", response);
      setErrorMessage(`${response.statusText}`);
      setIsLoading(false);
      return;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // if no survey, create new survey
    if (!currentSurvey?.survey) {
      const newSurveyName = randomString(); // TODO: get from user input
      tryCreateSurveyInDb(newSurveyName, currentChanges.collectedQuestions);
      setIsLoading(false);
      return;
    }
    // if questions, add to db
    if (currentChanges.collectedQuestions?.length > 0) {
      tryAddQuestionsToDb(currentChanges.collectedQuestions);
    }
    if (currentChanges.collectedDeletes?.length > 0) {
      tryDeleteQuestionsFromDb(currentChanges.collectedDeletes);
    }
    setCurrentChanges({ ...currentChanges, collectedQuestions: [], collectedDeletes: [] });
    setIsLoading(false);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {!session?.user?.email ? (
        <Button disabled>SAVE & SHARE</Button>
      ) : (
        <Button
          onClick={() => handleSubmit()}
          disabled={
            !checkForSurveyChanges(currentSurvey?.survey?.id || null, currentChanges) || isLoading
          }
        >
          {currentSurvey?.survey ? "SAVE CHANGES" : "SAVE NEW SURVEY"}
        </Button>
      )}
      {!session?.user?.email && <div> (Sign in to save your survey)</div>}
      {errorMessage && (
        <p className="flex flex-col justify-end text-custom-warning">{errorMessage}</p>
      )}
    </div>
  );
};

export default SurveySubmitButton;
