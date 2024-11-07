import { CollectedQuestion, Survey, SurveysWithQuestions } from "@/db";
import { create } from "zustand";

export interface SurveyState {
  currentSurvey: SurveysWithQuestions | null;
  collectedQuestions: CollectedQuestion[];
  newQuestion: string;
  aiPrompt: string;
  allSurveys: Survey[];
  selectedSurveyId: number | null;
}

export interface SurveyActions {
  setCurrentSurvey: (survey: SurveysWithQuestions) => void;
  setCollectedQuestions: (collectedQuestions: CollectedQuestion[]) => void;
  addCollectedQuestion: (question: CollectedQuestion) => void;
  setNewQuestion: (newQuestion: string) => void;
  setAiPrompt: (aiPrompt: string) => void;
  setAllSurveys: (allSurveys: Survey[]) => void;
  addSurvey: (survey: Survey) => void;
  removeSurvey: (surveyId: number) => void;
  toggleSelectedSurveyId: (selectedSurveyId: number) => void;
}

export const useStore = create<SurveyState & SurveyActions>()((set) => ({
  currentSurvey: null,
  collectedQuestions: [],
  newQuestion: "",
  aiPrompt: "",
  allSurveys: [],
  selectedSurveyId: null,
  setCurrentSurvey: (survey: SurveysWithQuestions) => set({ currentSurvey: survey }),
  setCollectedQuestions: (collectedQuestions: CollectedQuestion[]) => set({ collectedQuestions }),
  addCollectedQuestion: (question: CollectedQuestion) =>
    set((state) => ({ collectedQuestions: [...state.collectedQuestions, question] })),
  setNewQuestion: (newQuestion: string) => set({ newQuestion }),
  setAiPrompt: (aiPrompt: string) => set({ aiPrompt }),
  setAllSurveys: (allSurveys: Survey[]) => set({ allSurveys }),
  addSurvey: (survey: Survey) => set((state) => ({ allSurveys: [...state.allSurveys, survey] })),
  removeSurvey: (surveyId: number) =>
    set((state) => ({ allSurveys: state.allSurveys.filter((survey) => survey.id !== surveyId) })),
  toggleSelectedSurveyId: (surveyId: number) =>
    set((state) => ({ selectedSurveyId: state.selectedSurveyId === surveyId ? null : surveyId })),
}));
