import { Question } from "@/db";
import { type CollectedUpdate, type CurrentChanges } from "@/store/surveysStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const randomString = (length: number = 5) => {
  return Math.random().toString(36).substr(2, length);
};

/**
 * Generates a unique access link ID based on the current date and time.
 *
 * The format of the generated ID is `0MMxx-0DDxx-0SSxx`.
 *
 * @returns {string} A unique access link ID.
 */
export const generateAccessLinkId = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return `0${d.getMonth()}${randomString(2)}-0${d.getDate()}${randomString(2)}-0${d.getSeconds()}${randomString(2)}`;
};

/**
 * Generates a formatted date string based on the provided date object and style.
 *
 * @returns A formatted date string.
 */
export const makeDateString = (date: Date, style: string = "short") => {
  switch (style) {
    case "short":
      return (
        date.toLocaleString("en-US", { day: "numeric" }) +
        ". " +
        date.toLocaleString("en-US", { month: "short" })
      );
  }
};
/**
 * Calculates a new index based on the current number of questions in the survey.
 *
 * @param {number} [i=0] An optional increment to add to the new index.
 * @returns {number} The new index for the survey question.
 */
export const getNewQuestionIndex = (questions: Question[], i: number = 0) => {
  return questions ? questions.length + i + 1 : i + 1;
};

/**
 * Generates a temporary ID by concatenating a given prefix with a random number.
 *
 * @param {string} prefix The prefix to be used.
 * @returns {number} The generated temporary ID.
 */
export const generateTmpId = (prefix: string) => {
  return Number(prefix + Math.random().toString().slice(2));
};

/**
 * Checks if there are any changes in the survey.
 *
 * @returns A boolean indicating whether there are any changes in the survey.
 */
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

/* ******* ANIMATIONS ******* */

export const springTransition = {
  type: "spring",
  damping: 20,
  stiffness: 300,
};
