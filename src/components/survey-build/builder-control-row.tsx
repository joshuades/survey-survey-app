"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Question } from "@/db";
import { checkForSurveyChanges } from "@/lib/utils";
import { useMyLocalStore, useStore } from "@/store/surveysStore";
import { useSession } from "next-auth/react";
import { useState } from "react";
import FadeInWrapper from "../fade-in-wrapper";

export default function BuilderControlRow() {
  const [currentInput, setCurrentInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const { questionsLocal, setQuestionsLocal } = useMyLocalStore();
  const { data: session } = useSession();

  const { currentSurvey, setCurrentSurvey, currentChanges, setCurrentChanges } = useStore();

  const getNewIndex = (i: number = 0) => {
    return currentSurvey?.questions ? currentSurvey?.questions?.length + i + 1 : i + 1;
  };

  const generateTmpId = (prefix: string) => {
    return Number(prefix + Math.random().toString().slice(2));
  };

  const addQuestions = (questionTexts: string[]) => {
    const newQuestions = questionTexts?.map((text: string, i: number) => {
      const d = new Date();
      d.setSeconds(d.getSeconds() + i);
      return {
        id: generateTmpId("9999"),
        surveyId: generateTmpId("9999"),
        questionText: text,
        answerType: "text",
        index: getNewIndex(i),
        status: "new",
        created_at: d,
        updated_at: null,
        deleted_at: null,
      };
    });

    setCurrentSurvey({
      ...currentSurvey,
      survey: currentSurvey?.survey
        ? {
            ...currentSurvey?.survey,
          }
        : null,
      questions: [...(currentSurvey?.questions || []), ...newQuestions],
    });

    setCurrentChanges({
      ...currentChanges,
      surveyId: currentSurvey?.survey?.id || null,
      collectedQuestions: [
        ...currentChanges.collectedQuestions,
        ...newQuestions.map((q: Question) => ({ questionId: q.id })),
      ],
    });

    // add questions to local storage
    if (!session?.user) {
      setQuestionsLocal([...questionsLocal, ...newQuestions]);
      console.log("Added questions to local storage");
    } else {
      console.log("session.user exits:", session?.user);
    }

    setCurrentInput("");
    setInputMessage("");
  };

  const handleAddQuestion = () => {
    if (!currentInput.trim()) {
      setInputMessage("Type something above to add a question!");
      return;
    }
    addQuestions([currentInput]);
  };

  const handleGenerateQuestions = async () => {
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
      if (data.questionTexts) addQuestions(data.questionTexts);
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
          <Button onClick={handleGenerateQuestions} disabled={aiLoading}>
            Generate
          </Button>
          <Button onClick={handleAddQuestion}>Add Question</Button>
        </div>
      </div>
    </FadeInWrapper>
  );
}
