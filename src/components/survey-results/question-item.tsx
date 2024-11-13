"use client";

import { Question } from "@/db";
import React from "react";
import { Button } from "../ui/button";

export default function QuestionItem({
  question,
  i,
  children,
}: {
  question: Question;
  i: number;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(i == 0 ? true : false);

  return (
    <li>
      <div
        className="grid cursor-pointer grid-cols-[auto,_min-content] gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="text-[26px] font-light">
          {i + 1}. {question.questionText}
        </div>
        <div className="flex flex-col justify-end pb-[10px]">
          <Button variant={"secondary"}>{isOpen ? "Close" : "Open"}</Button>
        </div>
      </div>
      {isOpen && children}
    </li>
  );
}
