"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SurveyAndQuestions } from "@/db";
import { checkForSurveyChanges } from "@/lib/utils";
import { useMyLocalStore, useStore } from "@/store/surveys";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FadeInWrapper from "../fade-in-wrapper";
import { Skeleton } from "../ui/skeleton";
import Questions from "./questions";
import SurveySubmitButton from "./survey-submit-button";

export default function SurveyBuilder({
  surveyAndQuestions,
}: {
  surveyAndQuestions: SurveyAndQuestions;
}) {
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const { questionsLocal, addQuestionLocal, clearQuestionsLocal } = useMyLocalStore();
  const { data: session } = useSession();

  const {
    currentSurvey,
    currentChanges,
    addCollectedQuestion,
    setCurrentChanges,
    setCurrentSurvey,
    resetChanges,
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

  const getNewIndex = (i: number = 0) => {
    return currentSurvey?.survey
      ? currentSurvey?.survey?.questionsCount + currentChanges.collectedQuestions.length + i + 1
      : currentChanges.collectedQuestions.length + i + 1;
  };

  const addQuestion = () => {
    if (!currentInput.trim()) {
      setInputMessage("Type something above to add a question!");
      return;
    }
    const resetSuccessful = resetChanges(currentSurvey?.survey?.id || null);
    if (resetSuccessful) {
      const collectedQuestion = {
        questionText: currentInput,
        answerType: "text",
        index: getNewIndex(),
        status: "new",
        created_at: new Date(),
        updated_at: new Date(),
      };
      addCollectedQuestion(collectedQuestion);
      if (!session?.user) addQuestionLocal(collectedQuestion);
      setCurrentInput("");
      setInputMessage("");
    }
  };

  const generateAIQuestions = async () => {
    if (!currentInput.trim()) {
      setInputMessage("Type something above to generate questions!");
      return;
    }
    setAiLoading(true);
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
            index: getNewIndex(i),
            created_at: d,
            updated_at: null,
          };
        });
        setCurrentChanges({
          ...currentChanges,
          surveyId: surveyAndQuestions?.survey?.id || null,
          collectedQuestions: [...currentChanges.collectedQuestions, ...aiQuestions],
        });
        setCurrentInput("");
        setInputMessage("");
      }
    } catch (error) {
      console.error("Failed to generate questions:", error);
    }
    setAiLoading(false);
  };

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
          {inputMessage ? <p className="mx-2 text-custom-warning">{inputMessage}</p> : ""}
          <div className="mx-2 flex justify-between gap-3">
            <Button onClick={generateAIQuestions} disabled={aiLoading}>
              Generate
            </Button>
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
