"use client";

import { type Question } from "@/db";
import useWindowSize from "@/lib/hooks";
import { SCREENS, setCollectedUpdates, sortQuestionsByIndex } from "@/lib/utils";
import { useMyLocalStore, useStore } from "@/store/surveysStore";
import { useSession } from "next-auth/react";
import { FC } from "react";
import BuilderQuestion from "./builder-question";
import MovingQuestionsWrapper from "./moving-questions-wrapper";

interface QuestionsProps {
  sortOrder: "ASC" | "DESC";
}

const Questions: FC<QuestionsProps> = ({ sortOrder }) => {
  const { currentSurvey, setCurrentSurvey, currentChanges, setCurrentChanges } = useStore();
  const { setQuestionsLocal } = useMyLocalStore();
  const { data: session } = useSession();

  const size = useWindowSize();
  const dndOn = size.width ? size?.width >= SCREENS.lg : false;

  const questions = sortQuestionsByIndex([...(currentSurvey?.questions || [])], sortOrder);

  /**
   * Switches the positions of two questions in the survey.
   *
   * The changes are saved to the current survey and the collected updates are tracked
   * for further processing.
   */
  const switchQuestions = (questionA: Question, questionB: Question) => {
    const indexA = questionA.index;
    const indexB = questionB.index;

    // switch questions
    const updatedQuestions = questions.map((q) => {
      if (q.index === indexA) {
        return { ...q, index: indexB };
      }
      if (q.index === indexB) {
        return { ...q, index: indexA };
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
        newValue: indexB,
        originalValue: indexA,
        questionStatus: questionA.status,
        collected_at: new Date(),
      },
      {
        questionId: questionB.id,
        field: "index",
        newValue: indexA,
        originalValue: indexB,
        questionStatus: questionB.status,
        collected_at: new Date(),
      },
    ];

    setCurrentChanges({
      ...currentChanges,
      collectedUpdates: setCollectedUpdates(currentChanges.collectedUpdates, newCollectedUpdates),
    });
  };

  /**
   * Reorders the questions in the current survey based on the provided reordered array.
   *
   * @param {Question[]} reorderdQuestions - The array of questions in their new order.
   *
   * This function updates the indexes of the questions in the current survey to match the new order.
   * It iterates through the reordered questions and checks if the index of each question matches
   * the expected index based on the sort order. If a mismatch is found, it finds the question with
   * the expected index and switches the two questions.
   */
  const setQuestionsOnReorder = (reorderdQuestions: Question[]) => {
    reorderdQuestions.forEach((q, i) => {
      const reorderdArrayIndex = sortOrder === "ASC" ? i + 1 : reorderdQuestions.length - i;
      if (q.index !== reorderdArrayIndex) {
        const questionB = reorderdQuestions.find((q) => q.index === reorderdArrayIndex);
        if (!questionB) {
          console.error(
            "Could not find question with index (to switch with): ",
            reorderdArrayIndex
          );
          return;
        }
        switchQuestions(q, questionB);
        return;
      }
    });
  };

  /**
   * Handles the movement of a question in the survey builder either up or down.
   *
   * @param direction The direction to move the question, either "up" or "down".
   * @param questionA The question object that is being moved.
   */
  const onMoveQuestionClick = (direction: "up" | "down", questionA: Question): void => {
    const index = questionA.index;
    const newIndex = direction === "up" ? index + 1 : index - 1;

    if (newIndex <= 0 || newIndex > questions.length) {
      console.log("Cannot move question outside of bounds");
      return;
    }

    const questionB = questions.find((q) => q.index === newIndex);

    if (!questionB) {
      console.error("Could not find question with index (to switch with): ", newIndex);
      return;
    }

    switchQuestions(questionA, questionB);
  };

  return (
    <MovingQuestionsWrapper
      reorderValues={questions}
      onReorder={setQuestionsOnReorder}
      dndOn={dndOn}
      className="mx-2 flex flex-col gap-[25px] text-[32px] font-light"
    >
      {questions.map((question) => (
        <BuilderQuestion
          question={question}
          key={question.id}
          onMoveQuestionClick={onMoveQuestionClick}
          dndOn={dndOn}
        />
      ))}
    </MovingQuestionsWrapper>
  );
};

export default Questions;
