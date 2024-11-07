"use client";

import { randomString } from "@/lib/utils";
import { useStore } from "@/store/surveys";
import { FunctionComponent, useState } from "react";
import { Button } from "./ui/button";

const SurveySubmitButton: FunctionComponent = () => {
  const [message, setMessage] = useState("");

  const { currentSurvey, setCurrentSurvey, addSurvey, collectedQuestions, setCollectedQuestions } =
    useStore();

  const handleSubmit = async () => {
    if (!currentSurvey?.survey) {
      tryCreateSurvey();
    } else {
      tryAddQuestionsToSurvey();
    }
  };

  const tryCreateSurvey = async () => {
    const newSurveyName = randomString(); // TODO: get from user input
    const response = await fetch("/api/surveys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newSurveyName, questions: collectedQuestions }),
    });

    if (!response.ok) {
      console.error("ERROR, check api response: ", response);
      return;
    }

    const data = await response.json();
    if (response.ok) {
      const surveyWithQuestions = data.survey;
      const survey = data.survey.survey;
      setMessage(`"${survey.name}" created!`);
      addSurvey(survey);
      setCurrentSurvey(surveyWithQuestions);
      setCollectedQuestions([]);
    } else {
      setMessage(`${data.message}`);
    }
  };

  const tryAddQuestionsToSurvey = async () => {
    const surveyId = currentSurvey?.survey?.id;
    const response = await fetch(`/api/surveys/${surveyId}/questions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questions: collectedQuestions }),
    });

    if (!response.ok) {
      console.error("ERROR, check api response: ", response);
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
      setCollectedQuestions([]);
      setMessage("Questions saved.");
    } else {
      setMessage(`${data.message}`);
    }
  };

  return (
    <div className="flex gap-3">
      <Button onClick={() => handleSubmit()} disabled={!collectedQuestions}>
        {currentSurvey?.survey ? "SAVE CHANGES" : "SAVE NEW SURVEY"}
      </Button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SurveySubmitButton;
