"use client";

import { Question } from "@/db";
import React from "react";
import { Button } from "../ui/button";

export default function ResultsQuestion({
  question,
  children,
}: {
  question: Question;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(question.index == 1 ? true : false);

  return (
    <li>
      <div
        className="grid cursor-pointer grid-cols-[auto,_min-content] gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative grid gap-[5px]">
          <div className="pr-[25px] pt-[10px] text-[18px] font-bold leading-none md:absolute md:-translate-x-full">
            {question.index}.
          </div>
          <div className="text-[26px] font-light">{question.questionText}</div>
        </div>
        <div className="flex flex-col justify-end pb-[10px]">
          <Button variant={"secondary"}>{isOpen ? "Close" : "Open"}</Button>
        </div>
      </div>
      {isOpen && children}
    </li>
  );
}
