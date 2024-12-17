import { Survey, SurveyAndQuestions } from "@/db";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

export interface CollectedAnswer {
  type: string;
  answerText?: string | null;
  answerBoolean?: boolean | null;
  questionId: number;
  created_at: Date;
}

export interface CollectedAnswerer {
  username: string;
  email?: string;
}

export interface SurveyState {
  currentSurvey: SurveyAndQuestions | null;
  currentChanges: CurrentChanges;
  newQuestion: string;
  allSurveys: Survey[];
  selectedSurveyId: number | null;
  collectedAnswers: CollectedAnswer[];
  collectedAnswerer: CollectedAnswerer;
}

export interface SurveyActions {
  setCurrentSurvey: (survey: SurveyAndQuestions) => void;
  setCurrentChanges: (currentChanges: CurrentChanges) => void;
  resetChanges: (currentSurveyId: number | null) => boolean;
  addCollectedQuestion: (question: CollectedQuestion) => void;
  addCollectedDelete: (collectedDelete: CollectedDelete) => void;
  setNewQuestion: (newQuestion: string) => void;
  setAllSurveys: (allSurveys: Survey[]) => void;
  addSurvey: (survey: Survey) => void;
  removeSurvey: (surveyId: number) => void;
  toggleSelectedSurveyId: (selectedSurveyId: number | null) => void;
  setSelectedSurveyId: (selectedSurveyId: number | null) => void;
  setCollectedAnswers: (collectedAnswers: CollectedAnswer[]) => boolean;
  setCollectedAnswerer: (collectedAnswerer: CollectedAnswerer) => void;
}

export const useStore = create<SurveyState & SurveyActions>()((set) => ({
  currentSurvey: null,
  currentChanges: { surveyId: null, collectedQuestions: [], collectedDeletes: [] },
  newQuestion: "",
  allSurveys: [],
  selectedSurveyId: null,
  collectedAnswers: [],
  collectedAnswerer: { username: "anonymous" },
  setCurrentSurvey: (survey: SurveyAndQuestions) => set({ currentSurvey: survey }),
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
  setSelectedSurveyId: (selectedSurveyId: number | null) => set({ selectedSurveyId }),
  setCollectedAnswers: (collectedAnswers: CollectedAnswer[]) => {
    set({ collectedAnswers });
    return true;
  },
  setCollectedAnswerer: (collectedAnswerer: CollectedAnswerer) => set({ collectedAnswerer }),
}));

interface MyLocalStore {
  questionsLocal: CollectedQuestion[];
  setQuestionsLocal: (questionsLocal: CollectedQuestion[]) => void;
  addQuestionLocal: (questionsLocal: CollectedQuestion) => void;
  clearQuestionsLocal: () => void;
}

// Zustand store with persistence
export const useMyLocalStore = create<MyLocalStore>()(
  persist(
    (set) => ({
      questionsLocal: [],
      setQuestionsLocal: (questionsLocal: CollectedQuestion[]) => set({ questionsLocal }),
      addQuestionLocal: (question) =>
        set((state) => ({ questionsLocal: [...state.questionsLocal, question] })),
      clearQuestionsLocal: () => set({ questionsLocal: [] }),
    }),
    {
      name: "survey-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
