import { SurveysWithQuestions } from "@/db";
import { CurrentChanges } from "@/store/surveys";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const randomString = (length: number = 5) => {
  return Math.random().toString(36).substr(2, length);
};

export const checkForSurveyChanges = (
  currentSurvey: SurveysWithQuestions | null,
  currentChanges: CurrentChanges
) => {
  return (
    currentChanges.collectedQuestions?.length > 0 &&
    currentSurvey?.survey?.id == currentChanges.surveyId
  );
};
