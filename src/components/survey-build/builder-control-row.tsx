"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SurveyAndQuestions } from "@/db";
import { checkForSurveyChanges } from "@/lib/utils";
import { useMyLocalStore, useStore } from "@/store/surveys";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FadeInWrapper from "../fade-in-wrapper";

export default function BuilderControlRow({
  surveyAndQuestions,
}: {
  surveyAndQuestions: SurveyAndQuestions;
}) {
  const [currentInput, setCurrentInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const { questionsLocal, setQuestionsLocal, addQuestionLocal } = useMyLocalStore();
  const { data: session } = useSession();

  const { currentSurvey, currentChanges, addCollectedQuestion, setCurrentChanges, resetChanges } =
    useStore();

  useEffect(() => {
    console.log("questionsLocal:", questionsLocal);
  }, [questionsLocal]);

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
      if (!session?.user) {
        addQuestionLocal(collectedQuestion);
        console.log("Added question to local storage");
      } else {
        console.log("session.user exits:", session?.user);
      }
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

        if (!session?.user) {
          setQuestionsLocal([...questionsLocal, ...aiQuestions]);
        }

        setCurrentInput("");
        setInputMessage("");
      }
    } catch (error) {
      console.error("Failed to generate questions:", error);
    }
    setAiLoading(false);
  };

  return (
    <FadeInWrapper>
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
  );
}
