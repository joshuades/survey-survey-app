"use client";

import { Question } from "@/db";
import { setCollectedUpdates } from "@/lib/utils";
import { useMyLocalStore, useStore } from "@/store/surveysStore";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";

export default function QuestionMoveButtons({ question }: { question: Question }) {
  const { currentSurvey, setCurrentSurvey, currentChanges, setCurrentChanges } = useStore();
  const { setQuestionsLocal } = useMyLocalStore();
  const { data: session } = useSession();

  const handleUpdateIndex = (direction: "up" | "down", questionA: Question): void => {
    const allQuestions = [...(currentSurvey?.questions || [])];
    const index = questionA.index;
    const newIndex = direction === "up" ? index + 1 : index - 1;

    if (newIndex <= 0 || newIndex > allQuestions.length) {
      console.log("Cannot move question outside of bounds");
      return;
    }

    const questionB = allQuestions.find((q) => q.index === newIndex);

    if (!questionB) {
      console.error("Could not find question with index (to switch with): ", newIndex);
      return;
    }

    // switch questions
    const updatedQuestions = allQuestions.map((q) => {
      if (q.index === index) {
        return { ...q, index: newIndex };
      }
      if (q.index === newIndex) {
        return { ...q, index: index };
      }
      return q;
    });

    setCurrentSurvey({
      ...currentSurvey,
      survey: currentSurvey?.survey || null,
      questions: updatedQuestions,
    });

    if (!session?.user) {
      setQuestionsLocal(updatedQuestions);
    }

    // save changes to state
    const newCollectedUpdates = [
      {
        questionId: questionA.id,
        field: "index",
        newValue: newIndex,
        originalValue: index,
        questionStatus: questionA.status,
        collected_at: new Date(),
      },
      {
        questionId: questionB.id,
        field: "index",
        newValue: index,
        originalValue: newIndex,
        questionStatus: questionB.status,
        collected_at: new Date(),
      },
    ];

    setCurrentChanges({
      ...currentChanges,
      collectedUpdates: setCollectedUpdates(currentChanges.collectedUpdates, newCollectedUpdates),
    });
  };

  return (
    <div className="flex flex-col items-end gap-[15px]">
      <Button variant={"secondary"} onClick={() => handleUpdateIndex("up", question)}>
        ↑
      </Button>
      <Button variant={"secondary"} onClick={() => handleUpdateIndex("down", question)}>
        ↓
      </Button>
    </div>
  );
}
