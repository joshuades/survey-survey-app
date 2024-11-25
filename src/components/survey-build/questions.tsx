"use client";

import { Question } from "@/db";
import { checkForSurveyChanges } from "@/lib/utils";
import { CollectedQuestion, useStore } from "@/store/surveys";
import { FC } from "react";
import { Button } from "../ui/button";

const Questions: FC = () => {
  const {
    currentSurvey,
    setCurrentSurvey,
    currentChanges,
    setCurrentChanges,
    resetChanges,
    addCollectedDelete,
  } = useStore();

  const handleDeleteQuestion = (question: Question): void => {
    // if question not new, remove from currentSurvey
    setCurrentSurvey({
      ...currentSurvey,
      survey: currentSurvey?.survey || null,
      questions: currentSurvey?.questions?.filter((q) => q.id !== question.id) || [],
    });
    const resetSuccessful = resetChanges(currentSurvey?.survey?.id || null);
    if (resetSuccessful) {
      addCollectedDelete({ questionId: question.id });
      console.log("Current changes AFTER:", currentChanges);
    }
  };

  const handleDeleteNewQuestion = (question: CollectedQuestion): void => {
    setCurrentChanges({
      ...currentChanges,
      surveyId: currentSurvey?.survey?.id || null,
      collectedQuestions: currentChanges.collectedQuestions.filter(
        (q) => new Date(q.created_at).getTime() !== new Date(question.created_at).getTime()
      ),
    });
  };

  return (
    <ul className="mx-2 flex flex-col gap-[25px] text-[32px] font-light">
      {[
        ...(checkForSurveyChanges(currentSurvey?.survey?.id || null, currentChanges)
          ? [...currentChanges.collectedQuestions].reverse()
          : []),
      ].map((question, i) => (
        <li
          key={new Date(question.created_at).getTime() + i}
          className="grid md:grid-cols-[auto,_min-content] md:gap-2"
        >
          <div>
            {question.questionText} <span className="text-sm font-semibold uppercase">new</span>
          </div>
          <div className="flex justify-end pr-[10px] md:flex-col md:pb-[10px] md:pr-0">
            <Button variant={"secondary"} onClick={() => handleDeleteNewQuestion(question)}>
              Del
            </Button>
          </div>
        </li>
      ))}
      {[...(currentSurvey?.questions || [])].map((question, i) => (
        <li
          key={new Date(question.created_at).getTime() + i}
          className="grid grid-cols-[auto,_min-content] gap-2"
        >
          <div>{question.questionText}</div>
          <div className="flex flex-col justify-end pb-[10px]">
            <Button variant={"secondary"} onClick={() => handleDeleteQuestion(question)}>
              Del
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Questions;
