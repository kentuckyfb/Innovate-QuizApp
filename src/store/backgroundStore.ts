import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type BackgroundState = {
  backgroundSeed: number;
  resetBackgroundSeed: () => void;
};

export const useBackgroundStore = create<BackgroundState>()(
  persist(
    (set) => ({
      backgroundSeed: Math.random(),
      resetBackgroundSeed: () => set({ backgroundSeed: Math.random() }),
    }),
    {
      name: 'quiz-background-store',
      partialize: (state) => ({ backgroundSeed: state.backgroundSeed }),
    }
  )
);