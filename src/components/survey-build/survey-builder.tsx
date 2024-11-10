"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SurveysWithQuestions } from "@/db";
import { checkForSurveyChanges } from "@/lib/utils";
import { useStore } from "@/store/surveys";
import { useEffect, useState } from "react";
import FadeInWrapper from "../fade-in-wrapper";
import { Skeleton } from "../ui/skeleton";
import Questions from "./questions";
import SurveySubmitButton from "./survey-submit-button";

export default function SurveyBuilder({ survey }: { survey: SurveysWithQuestions }) {
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState("");

  const {
    currentSurvey,
    currentChanges,
    addCollectedQuestion,
    setCurrentChanges,
    setCurrentSurvey,
    resetChanges,
  } = useStore();

  useEffect(() => {
    if (survey) {
      setCurrentSurvey(survey);
    }
    setIsLoading(false);
  }, []);

  const addQuestion = () => {
    if (!currentInput.trim()) {
      setInputMessage("Type something above to add a question!");
      return;
    }
    const collectedQuestion = {
      id: 0, // 0 for all new questions
      questionText: currentInput,
      answerType: "text",
      created_at: new Date(),
      updated_at: new Date(),
    };
    const resetSuccessful = resetChanges(currentSurvey?.survey?.id || null);
    if (resetSuccessful) {
      addCollectedQuestion(collectedQuestion);
      setCurrentInput("");
      setInputMessage("");
    }
  };

  const generateAIQuestions = async () => {
    if (!currentInput.trim()) {
      setInputMessage("Type something above to generate questions!");
      return;
    }

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentInput }),
      });
      const data = await response.json();
      if (data.questionTexts) {
        console.log("Generated questions:", data.questionTexts);
        const aiQuestions = data.questionTexts?.map((text: string, i: number) => {
          const d = new Date();
          d.setSeconds(d.getSeconds() + i);
          return {
            id: 0,
            questionText: text,
            answerType: "text",
            created_at: d,
            updated_at: null,
          };
        });

        setCurrentChanges({
          ...currentChanges,
          surveyId: survey?.survey?.id || null,
          collectedQuestions: [...currentChanges.collectedQuestions, ...aiQuestions],
        });

        setCurrentInput("");
        setInputMessage("");
      }
    } catch (error) {
      console.error("Failed to generate questions:", error);
    }
  };

  const handleDeleteChanges = () => {
    if (confirm("Are you sure you want to delete all survey changes?"))
      setCurrentChanges({
        ...currentChanges,
        surveyId: survey?.survey?.id || null,
        collectedQuestions: [],
        collectedDeletes: [],
      });
  };

  return (
    <div className="grid w-full gap-[60px]">
      <FadeInWrapper delay={0.2}>
        <div className="grid gap-[15px] align-baseline">
          <p className="mx-2">
            {checkForSurveyChanges(currentSurvey?.survey?.id || null, currentChanges) ||
            currentSurvey?.survey?.id != null
              ? "What else do you want to ask about?"
              : "What is your survey about?"}
          </p>
          <Input
            placeholder=""
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className="mx-auto h-[60px] max-w-[96vw] text-[36px] font-bold"
          />
          {inputMessage ? <p className="text-custom-warning mx-2">{inputMessage}</p> : ""}
          <div className="mx-2 flex justify-between gap-3">
            <Button onClick={generateAIQuestions}>Generate</Button>
            <Button onClick={addQuestion}>Add Question</Button>
          </div>
        </div>
      </FadeInWrapper>
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
