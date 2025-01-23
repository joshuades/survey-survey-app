"use client";

import { Question } from "@/db";
import { CollectedUpdate, useStore } from "@/store/surveysStore";
import { Button } from "../ui/button";

/**
 * Updates the collected updates array with new collected updates.
 *
 * For all new collectedUpdates:
 * - Only add new collectedUpdate if it doesn't exist yet (its questionId and field).
 * - If you can find it, and its originalValue is the same as the newValue of the newCollectedUpdate, remove it.
 * - If you can find it, and its originalValue is different from the newValue of the newCollectedUpdate, update it.
 */
const setCollectedUpdates = (
  collectedUpdates: CollectedUpdate[],
  newCollectedUpdates: CollectedUpdate[]
): CollectedUpdate[] => {
  newCollectedUpdates.forEach((newCollectedUpdate) => {
    collectedUpdates =
      collectedUpdates.find(
        (cu) =>
          cu.questionId === newCollectedUpdate.questionId && cu.field === newCollectedUpdate.field
      ) === undefined
        ? [...collectedUpdates, newCollectedUpdate]
        : collectedUpdates
            .map((cu) =>
              cu.questionId === newCollectedUpdate.questionId &&
              cu.field === newCollectedUpdate.field
                ? cu.originalValue === newCollectedUpdate.newValue
                  ? null
                  : {
                      ...cu,
                      newValue: newCollectedUpdate.newValue,
                      updated_at: newCollectedUpdate.collected_at,
                    }
                : cu
            )

            .filter((cu) => cu !== null);
  });
  return collectedUpdates;
};

export default function QuestionMoveButtons({ question }: { question: Question }) {
  const { currentSurvey, setCurrentSurvey, currentChanges, setCurrentChanges } = useStore();

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
