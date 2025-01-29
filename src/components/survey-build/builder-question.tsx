"use client";

import { type Question } from "@/db";
import { springTransition } from "@/lib/utils";
import { Reorder } from "framer-motion";
import QuestionDeleteButton from "./question-delete-button";
import QuestionMoveButtons from "./question-move-buttons";

interface BuilderQuestionProps {
  question: Question;
  onMoveQuestionClick: (direction: "up" | "down", question: Question) => void;
}

const BuilderQuestion: React.FC<BuilderQuestionProps> = ({ question, onMoveQuestionClick }) => {
  return (
    <Reorder.Item
      key={question.id}
      value={question}
      layout
      transition={springTransition}
      className="grid grid-cols-[auto,_min-content] gap-2"
    >
      <div className="relative grid gap-[5px]">
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
    </Reorder.Item>
  );
};

export default BuilderQuestion;
