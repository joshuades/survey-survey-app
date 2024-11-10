import { Survey, SurveysWithQuestions } from "@/db";
import { create } from "zustand";

export interface SurveyState {
  currentSurvey: SurveysWithQuestions | null;
  currentChanges: CurrentChanges;
  newQuestion: string;
  allSurveys: Survey[];
  selectedSurveyId: number | null;
}

export interface CurrentChanges {
  surveyId: number | null;
  collectedQuestions: CollectedQuestion[];
  collectedDeletes: CollectedDelete[];
}

export interface CollectedQuestion {
  questionText: string;
  answerType: string;
  index: number;
  status: string;
  updated_at: Date | null;
  created_at: Date;
}

export interface CollectedDelete {
  questionId: number;
}

export interface SurveyActions {
  setCurrentSurvey: (survey: SurveysWithQuestions) => void;
  setCurrentChanges: (currentChanges: CurrentChanges) => void;
  resetChanges: (currentSurveyId: number | null) => boolean;
  addCollectedQuestion: (question: CollectedQuestion) => void;
  addCollectedDelete: (collectedDelete: CollectedDelete) => void;
  setNewQuestion: (newQuestion: string) => void;
  setAllSurveys: (allSurveys: Survey[]) => void;
  addSurvey: (survey: Survey) => void;
  removeSurvey: (surveyId: number) => void;
  toggleSelectedSurveyId: (selectedSurveyId: number | null) => void;
}

export const useStore = create<SurveyState & SurveyActions>()((set) => ({
  currentSurvey: null,
  currentChanges: { surveyId: null, collectedQuestions: [], collectedDeletes: [] },
  newQuestion: "",
  allSurveys: [],
  selectedSurveyId: null,
  setCurrentSurvey: (survey: SurveysWithQuestions) => set({ currentSurvey: survey }),
  setCurrentChanges: (currentChanges: CurrentChanges) => set({ currentChanges }),
  resetChanges: (currentSurveyId: number | null) => {
    set((state) => ({
      currentChanges:
        state.currentChanges.surveyId === currentSurveyId
          ? { ...state.currentChanges }
          : { surveyId: currentSurveyId, collectedQuestions: [], collectedDeletes: [] },
    }));
    return true;
  },
  addCollectedQuestion: (question: CollectedQuestion) =>
    set((state) => ({
      currentChanges: {
        ...state.currentChanges,
        collectedQuestions: [...state.currentChanges.collectedQuestions, question],
      },
    })),
  addCollectedDelete: (collectedDelete: CollectedDelete) =>
    set((state) => ({
      currentChanges: {
        ...state.currentChanges,
        collectedDeletes: [...state.currentChanges.collectedDeletes, collectedDelete],
      },
    })),
  setNewQuestion: (newQuestion: string) => set({ newQuestion }),
  setAllSurveys: (allSurveys: Survey[]) => set({ allSurveys }),
  addSurvey: (survey: Survey) => set((state) => ({ allSurveys: [...state.allSurveys, survey] })),
  removeSurvey: (surveyId: number) =>
    set((state) => ({ allSurveys: state.allSurveys.filter((survey) => survey.id !== surveyId) })),
  toggleSelectedSurveyId: (surveyId: number | null) =>
    set((state) => ({ selectedSurveyId: state.selectedSurveyId === surveyId ? null : surveyId })),
}));
