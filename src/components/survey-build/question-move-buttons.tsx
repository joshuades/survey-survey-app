"use client";

import { Question } from "@/db";
import { Button } from "../ui/button";

export default function QuestionMoveButtons({
  question,
  onMoveQuestionClick,
}: {
  question: Question;
  onMoveQuestionClick: (direction: "up" | "down", question: Question) => void;
}) {
  return (
    <div className="flex flex-col items-end gap-[15px]">
      <Button variant={"secondary"} onClick={() => onMoveQuestionClick("up", question)}>
        ↑
      </Button>
      <Button variant={"secondary"} onClick={() => onMoveQuestionClick("down", question)}>
        ↓
      </Button>
    </div>
  );
}
