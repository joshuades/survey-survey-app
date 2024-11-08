"use client";

import { checkForSurveyChanges, randomString } from "@/lib/utils";
import { useStore } from "@/store/surveys";
import { useRouter } from "next/navigation";
import { FunctionComponent, useState } from "react";
import { Button } from "./ui/button";

const SurveySubmitButton: FunctionComponent = () => {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { currentSurvey, setCurrentSurvey, addSurvey, currentChanges, setCurrentChanges } =
    useStore();

  const handleSubmit = async () => {
    if (!currentSurvey?.survey) {
      tryCreateSurvey();
    } else {
      tryAddQuestionsToSurvey();
    }
  };

  const tryCreateSurvey = async () => {
    setIsLoading(true);
    const newSurveyName = randomString(); // TODO: get from user input
    const response = await fetch("/api/surveys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newSurveyName, questions: currentChanges.collectedQuestions }),
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
        surveyId: survey.id || null,
        collectedQuestions: [],
      });
    } else {
      setMessage(`${data.message}`);
    }
    setIsLoading(false);
  };

  const tryAddQuestionsToSurvey = async () => {
    setIsLoading(true);
    const surveyId = currentSurvey?.survey?.id;
    const response = await fetch(`/api/surveys/${surveyId}/questions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questions: currentChanges.collectedQuestions }),
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
      setCurrentChanges({
        surveyId: currentSurvey?.survey?.id || null,
        collectedQuestions: [],
      });
      setMessage("Questions saved.");
    } else {
      setMessage(`${data.message}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex gap-3">
      <Button
        onClick={() => handleSubmit()}
        disabled={!checkForSurveyChanges(currentSurvey, currentChanges) || isLoading}
      >
        {currentSurvey?.survey ? "SAVE CHANGES" : "SAVE NEW SURVEY"}
      </Button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SurveySubmitButton;
