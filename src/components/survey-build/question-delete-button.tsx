"use client";

import { Question } from "@/db";
import { useStore } from "@/store/surveysStore";
import { Button } from "../ui/button";

export default function QuestionDeleteButton({ question }: { question: Question }) {
  const { currentSurvey, setCurrentSurvey, currentChanges, setCurrentChanges } = useStore();

  const handleDeleteQuestion = (question: Question): void => {
    // delete from currentSurvey
    setCurrentSurvey({
      ...currentSurvey,
      survey: currentSurvey?.survey || null,
      questions: currentSurvey?.questions?.filter((q) => q.id !== question.id) || [],
    });
    // if new, remove question from collectedQuestions
    if (question.status == "new") {
      setCurrentChanges({
        ...currentChanges,
        surveyId: currentSurvey?.survey?.id || null,
        collectedQuestions: currentChanges.collectedQuestions.filter(
          (q) => q.questionId !== question.id
        ),
      });
    }
    // if question was already saved in db ("active"), put question in deletedQuestions
    else if (question.status == "active") {
      if (!currentSurvey?.survey?.id) {
        console.error("currentSurvey.survey.id not defined");
        return;
      }
      setCurrentChanges({
        ...currentChanges,
        surveyId: currentSurvey?.survey?.id,
        deletedQuestions: [...currentChanges.deletedQuestions, question],
      });
    }
  };

  return (
    <Button variant={"secondary"} onClick={() => handleDeleteQuestion(question)}>
      Del
    </Button>
  );
}
