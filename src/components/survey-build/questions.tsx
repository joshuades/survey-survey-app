"use client";

import { useStore } from "@/store/surveysStore";
import { FC, useMemo } from "react";
import BuilderQuestion from "./builder-question";

interface QuestionsProps {
  sortOrder: "ASC" | "DESC";
}

const Questions: FC<QuestionsProps> = ({ sortOrder }) => {
  const { currentSurvey } = useStore();

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
      {sortedQuestions.map((question) => (
        <BuilderQuestion question={question} key={question.id} />
      ))}
    </ul>
  );
};

export default Questions;
