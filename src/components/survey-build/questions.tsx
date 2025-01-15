"use client";

import { Question } from "@/db";
import { useStore } from "@/store/surveysStore";
import { FC, useMemo } from "react";
import { Button } from "../ui/button";

interface QuestionsProps {
  sortOrder: "ASC" | "DESC";
}

const Questions: FC<QuestionsProps> = ({ sortOrder }) => {
  const { currentSurvey, setCurrentSurvey, currentChanges, setCurrentChanges } = useStore();

  const handleDeleteQuestion = (question: Question): void => {
    // delete from currentSurvey
    setCurrentSurvey({
      ...currentSurvey,
      survey: currentSurvey?.survey || null,
      questions: currentSurvey?.questions?.filter((q) => q.id !== question.id) || [],
    });
    // if new, remove question from collectedQuestions
    if (question.status == "new") {
      setCurrentChanges({
        ...currentChanges,
        surveyId: currentSurvey?.survey?.id || null,
        collectedQuestions: currentChanges.collectedQuestions.filter(
          (q) => q.questionId !== question.id
        ),
      });
    }
    // if question was already saved in db ("active"), put question in collectedDeletes
    else if (question.status == "active") {
      if (!currentSurvey?.survey?.id) {
        console.error("currentSurvey.survey.id not defined");
        return;
      }
      setCurrentChanges({
        ...currentChanges,
        surveyId: currentSurvey?.survey?.id,
        collectedDeletes: [...currentChanges.collectedDeletes, question],
      });
    }
  };

  const sortedQuestions = useMemo(() => {
    const allQuestions = [...(currentSurvey?.questions || [])];

    return allQuestions.sort((a, b) => {
      // Primary sort by index
      const primaryComparison = sortOrder === "ASC" ? a.index - b.index : b.index - a.index;
      if (primaryComparison !== 0) {
        return primaryComparison;
      }
      // If indexes are the same, sort by created_at
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      return sortOrder === "ASC" ? dateA - dateB : dateB - dateA;
    });
  }, [currentSurvey?.questions, sortOrder]);

  return (
    <ul className="mx-2 flex flex-col gap-[25px] text-[32px] font-light">
      {sortedQuestions.map((question, i) => (
        <li
          key={new Date(question.created_at).getTime() + i}
          className="grid grid-cols-[auto,_min-content] gap-2"
        >
          <div className="relative grid gap-[5px]">
            <div className="pr-[25px] pt-[12px] text-[18px] font-bold leading-none md:absolute md:-translate-x-full">
              {sortOrder === "ASC" ? i + 1 : sortedQuestions.length - i}.
            </div>
            {question.questionText}{" "}
            {["new"].includes(question.status) && (
              <span className="text-sm font-semibold uppercase">{question.status}</span>
            )}
          </div>
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
