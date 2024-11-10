"use client";

import { checkForSurveyChanges, randomString } from "@/lib/utils";
import { CollectedDelete, CollectedQuestion, useStore } from "@/store/surveys";
import { useRouter } from "next/navigation";
import { FunctionComponent, useState } from "react";
import { Button } from "./ui/button";

const SurveySubmitButton: FunctionComponent = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(false);
      return;
    }

    const data = await response.json();
    if (response.ok) {
      const survey = data.survey.survey;
      addSurvey(survey);
      router.push(`/builder/${survey.id}`, { scroll: true });
      setCurrentChanges({
        ...currentChanges,
        surveyId: survey.id || null,
        collectedQuestions: [],
      });
    } else {
      setErrorMessage(`${data.message}`);
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
      setIsLoading(false);
      return;
    }

    const data = await response.json();
    if (response.ok) {
      const newQuestions = data.questions;
      if (currentSurvey)
        setCurrentSurvey({
          ...currentSurvey,
          questions: [...currentSurvey.questions, ...newQuestions],
        });
    } else {
      setErrorMessage(`${data.message}`);
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
      setIsLoading(false);
      return;
    } else {
      const data = await response.json();
      setErrorMessage(`${data.message}`);
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
      const return1 = await tryAddQuestionsToDb(currentChanges.collectedQuestions);
      console.log("return1", return1);
    }
    if (currentChanges.collectedDeletes?.length > 0) {
      const return2 = await tryDeleteQuestionsFromDb(currentChanges.collectedDeletes);
      console.log("return2", return2);
    }

    console.log("currentChanges BEFORE reset", currentChanges);

    setCurrentChanges({ ...currentChanges, collectedQuestions: [], collectedDeletes: [] });
    console.log("currentChanges AFTER reset", currentChanges);

    setIsLoading(false);
  };

  return (
    <div className="flex gap-3">
      <Button
        onClick={() => handleSubmit()}
        disabled={
          !checkForSurveyChanges(currentSurvey?.survey?.id || null, currentChanges) || isLoading
        }
      >
        {currentSurvey?.survey ? "SAVE CHANGES" : "SAVE NEW SURVEY"}
      </Button>
      {errorMessage && <p className="color-custom-warning">{errorMessage}</p>}
    </div>
  );
};

export default SurveySubmitButton;
