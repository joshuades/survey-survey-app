"use client";

import { type Question } from "@/db";
import MovingQuestionWrapper from "./moving-question-wrapper";
import QuestionDeleteButton from "./question-delete-button";
import QuestionMoveButtons from "./question-move-buttons";

interface BuilderQuestionProps {
  question: Question;
  onMoveQuestionClick: (direction: "up" | "down", question: Question) => void;
  dndOn: boolean;
}

const BuilderQuestion: React.FC<BuilderQuestionProps> = ({
  question,
  onMoveQuestionClick,
  dndOn,
}) => {
  const className = "grid grid-cols-[auto,_min-content] gap-2";

  return (
    <MovingQuestionWrapper
      className={className}
      key={question.id}
      dndOn={dndOn}
      reorderValue={question}
    >
      <div className="relative grid cursor-grab gap-[5px]">
        <div className="pr-[25px] pt-[12px] text-[18px] font-bold leading-none md:absolute md:-translate-x-full">
          {question.index}.
        </div>
        {question.questionText}{" "}
        {["new"].includes(question.status) && (
          <span className="text-sm font-semibold uppercase">{question.status}</span>
        )}
      </div>
      <div className="flex flex-col justify-end gap-[15px] pb-[10px]">
        <QuestionMoveButtons question={question} onMoveQuestionClick={onMoveQuestionClick} />
        <QuestionDeleteButton question={question} />
      </div>
    </MovingQuestionWrapper>
  );
};

export default BuilderQuestion;
