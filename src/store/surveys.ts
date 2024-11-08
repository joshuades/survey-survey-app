import { CollectedQuestion, Survey, SurveysWithQuestions } from "@/db";
import { create } from "zustand";

export interface SurveyState {
  currentSurvey: SurveysWithQuestions | null;
  currentChanges: CurrentChanges;
  newQuestion: string;
  aiPrompt: string;
  allSurveys: Survey[];
  selectedSurveyId: number | null;
}

export interface CurrentChanges {
  surveyId: number | null;
  collectedQuestions: CollectedQuestion[];
}

export interface SurveyActions {
  setCurrentSurvey: (survey: SurveysWithQuestions) => void;
  setCurrentChanges: (currentChanges: CurrentChanges) => void;
  addCollectedQuestion: (question: CollectedQuestion, surveyId: number | null) => void;
  setNewQuestion: (newQuestion: string) => void;
  setAiPrompt: (aiPrompt: string) => void;
  setAllSurveys: (allSurveys: Survey[]) => void;
  addSurvey: (survey: Survey) => void;
  removeSurvey: (surveyId: number) => void;
  toggleSelectedSurveyId: (selectedSurveyId: number) => void;
}

export const useStore = create<SurveyState & SurveyActions>()((set) => ({
  currentSurvey: null,
  currentChanges: { surveyId: null, collectedQuestions: [] },
  newQuestion: "",
  aiPrompt: "",
  allSurveys: [],
  selectedSurveyId: null,
  setCurrentSurvey: (survey: SurveysWithQuestions) => set({ currentSurvey: survey }),
  setCurrentChanges: (currentChanges: CurrentChanges) => set({ currentChanges }),
  addCollectedQuestion: (question: CollectedQuestion, newSurveyId: number | null) =>
    set((state) => ({
      currentChanges: {
        surveyId: newSurveyId,
        collectedQuestions:
          state.currentChanges.surveyId === newSurveyId
            ? [...state.currentChanges.collectedQuestions, question]
            : [question],
      },
    })),
  setNewQuestion: (newQuestion: string) => set({ newQuestion }),
  setAiPrompt: (aiPrompt: string) => set({ aiPrompt }),
  setAllSurveys: (allSurveys: Survey[]) => set({ allSurveys }),
  addSurvey: (survey: Survey) => set((state) => ({ allSurveys: [...state.allSurveys, survey] })),
  removeSurvey: (surveyId: number) =>
    set((state) => ({ allSurveys: state.allSurveys.filter((survey) => survey.id !== surveyId) })),
  toggleSelectedSurveyId: (surveyId: number) =>
    set((state) => ({ selectedSurveyId: state.selectedSurveyId === surveyId ? null : surveyId })),
}));
