"use client";

import { Question } from "@/db";
import { setCollectedUpdates } from "@/lib/utils";
import { CollectedUpdate, useStore } from "@/store/surveysStore";
import { Button } from "../ui/button";

export default function QuestionDeleteButton({ question }: { question: Question }) {
  const { currentSurvey, setCurrentSurvey, currentChanges, setCurrentChanges } = useStore();

  const handleDeleteQuestion = (question: Question): void => {
    // delete from currentSurvey and decrement index of all questions after the deleted question
    const newIndexUpdates: CollectedUpdate[] = [];
    setCurrentSurvey({
      ...currentSurvey,
      survey: currentSurvey?.survey || null,
      questions: [...(currentSurvey?.questions.filter((q) => q.id !== question.id) || [])] // delete question
        .map((q) => {
          if (q.index > question.index) {
            newIndexUpdates.push({
              questionId: q.id,
              field: "index",
              newValue: q.index - 1,
              originalValue: q.index,
              questionStatus: q.status,
              collected_at: new Date(),
            }); // collect new index update
            return { ...q, index: q.index - 1 }; // update index
          }
          return q;
        }),
    });

    setCurrentChanges({
      ...currentChanges,
      surveyId: currentSurvey?.survey?.id || null,
      collectedQuestions:
        question.status == "new"
          ? currentChanges.collectedQuestions.filter((q) => q.questionId !== question.id) // remove from collectedQuestions
          : currentChanges.collectedQuestions,
      deletedQuestions:
        question.status == "active"
          ? [...currentChanges.deletedQuestions, question] // add to deletedQuestions
          : currentChanges.deletedQuestions,
      collectedUpdates: setCollectedUpdates(currentChanges.collectedUpdates, newIndexUpdates),
    });
  };

  return (
    <Button variant={"secondary"} onClick={() => handleDeleteQuestion(question)}>
      Del
    </Button>
  );
}
