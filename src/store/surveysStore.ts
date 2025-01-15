import { Question, Survey, SurveyAndQuestions } from "@/db";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CurrentChanges {
  surveyId: number | null;
  collectedQuestions: CollectedQuestion[];
  collectedDeletes: Question[];
}

export interface CollectedQuestion {
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
  setNewQuestion: (newQuestion: string) => void;
  setAllSurveys: (allSurveys: Survey[]) => void;
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
  setNewQuestion: (newQuestion: string) => set({ newQuestion }),
  setAllSurveys: (allSurveys: Survey[]) => set({ allSurveys }),
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
  questionsLocal: Question[];
  setQuestionsLocal: (questionsLocal: Question[]) => void;
}

// Zustand store with persistence
export const useMyLocalStore = create<MyLocalStore>()(
  persist(
    (set) => ({
      questionsLocal: [],
      setQuestionsLocal: (questionsLocal: Question[]) => set({ questionsLocal }),
    }),
    {
      name: "survey-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
