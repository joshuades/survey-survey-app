import { create } from "zustand";

interface LoadingState {
  isRouting: boolean;
  setIsRouting: (isRouting: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isRouting: false,
  setIsRouting: (isRouting) => set({ isRouting }),
}));
