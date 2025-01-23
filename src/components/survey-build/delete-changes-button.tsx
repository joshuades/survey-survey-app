"use client";

import { Button } from "@/components/ui/button";
import { useStore } from "@/store/surveysStore";

export default function DeleteChangesButton() {
  const { currentSurvey, currentChanges, setCurrentChanges, setCurrentSurvey } = useStore();

  /**
   * Retrieves the original questions from the current survey, including any deleted questions,
   * and restores their original values based on the collected updates.
   *
   * @returns {Array} An array of questions with their original values restored.
   */
  const getOriginalQuestions = () => {
    return [...(currentSurvey?.questions || []), ...currentChanges.deletedQuestions]
      .filter((q) => q.status !== "new")
      .map((q) => {
        const collectedUpdates_for_q = currentChanges.collectedUpdates.filter(
          (cu) => cu.questionId === q.id
        );
        // for each update, restore the originalValue of the question
        collectedUpdates_for_q.forEach((cu) => {
          /* eslint-disable  @typescript-eslint/no-explicit-any */
          (q as any)[cu.field] = cu.originalValue;
        });
        return q;
      });
  };

  const handleDeleteChanges = () => {
    if (!confirm("Are you sure you want to delete all survey changes?")) return;

    setCurrentSurvey({
      survey: currentSurvey?.survey || null,
      questions: getOriginalQuestions(),
    });

    setCurrentChanges({
      ...currentChanges,
      surveyId: currentSurvey?.survey?.id || null,
      collectedQuestions: [],
      deletedQuestions: [],
      collectedUpdates: [],
    });
  };

  return (
    <Button onClick={() => handleDeleteChanges()} variant={"secondary"}>
      Delete Changes
    </Button>
  );
}
