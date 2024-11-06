import { AggregatedSurvey, Question, Survey } from "@/db";
import { create } from "zustand";

export interface SurveyState {
  survey: AggregatedSurvey | null;
  newQuestion: string;
  aiPrompt: string;
  allSurveys: Survey[];
  selectedSurveyId: number | null;
}

export interface SurveyActions {
  setSurvey: (survey: AggregatedSurvey) => void;
  addQuestionToSurvey: (question: Question) => void;
  setNewQuestion: (newQuestion: string) => void;
  setAiPrompt: (aiPrompt: string) => void;
  setAllSurveys: (allSurveys: Survey[]) => void;
  addSurvey: (survey: Survey) => void;
  removeSurvey: (surveyId: number) => void;
  toggleSelectedSurveyId: (selectedSurveyId: number) => void;
}

export const useStore = create<SurveyState & SurveyActions>()((set) => ({
  survey: null,
  newQuestion: "",
  aiPrompt: "",
  allSurveys: [],
  selectedSurveyId: null,
  setSurvey: (survey: AggregatedSurvey) => set({ survey }),
  addQuestionToSurvey: (question: Question) =>
    set((state) =>
      state.survey
        ? { survey: { ...state.survey }, questions: [...state.survey.questions, question] }
        : { survey: null, questions: [question] }
    ),
  setNewQuestion: (newQuestion: string) => set({ newQuestion }),
  setAiPrompt: (aiPrompt: string) => set({ aiPrompt }),
  setAllSurveys: (allSurveys: Survey[]) => set({ allSurveys }),
  addSurvey: (survey: Survey) => set((state) => ({ allSurveys: [...state.allSurveys, survey] })),
  removeSurvey: (surveyId: number) =>
    set((state) => ({ allSurveys: state.allSurveys.filter((survey) => survey.id !== surveyId) })),
  toggleSelectedSurveyId: (surveyId: number) =>
    set((state) => ({ selectedSurveyId: state.selectedSurveyId === surveyId ? null : surveyId })),
}));
