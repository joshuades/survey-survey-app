import { type CollectedUpdate, type CurrentChanges } from "@/store/surveysStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const randomString = (length: number = 5) => {
  return Math.random().toString(36).substr(2, length);
};

export const checkForSurveyChanges = (
  currentSurveyId: number | null,
  currentChanges: CurrentChanges
) => {
  return (
    currentSurveyId == currentChanges.surveyId &&
    (currentChanges.collectedQuestions?.length > 0 ||
      currentChanges.deletedQuestions?.length > 0 ||
      currentChanges.collectedUpdates?.length > 0)
  );
};

/**
 * Updates the collected updates array with new collected updates.
 *
 * For all new collectedUpdates:
 * - Only add new collectedUpdate if it doesn't exist yet (its questionId and field).
 * - If you can find it, and its originalValue is the same as the newValue of the newCollectedUpdate, remove it.
 * - If you can find it, and its originalValue is different from the newValue of the newCollectedUpdate, update it.
 */
export const setCollectedUpdates = (
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
