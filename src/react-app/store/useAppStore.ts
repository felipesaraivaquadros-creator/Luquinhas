import { create } from 'zustand';

interface AppState {
  currentStoryIndex: number;
  currentStoryPage: number;
  quizScore: number;
  memoryFlips: number;
  setCurrentStoryIndex: (index: number) => void;
  setCurrentStoryPage: (page: number) => void;
  resetStory: () => void;
  incrementQuizScore: () => void;
  resetQuizScore: () => void;
  incrementMemoryFlips: () => void;
  resetMemoryFlips: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentStoryIndex: 0,
  currentStoryPage: 0,
  quizScore: 0,
  memoryFlips: 0,
  setCurrentStoryIndex: (index) => set({ currentStoryIndex: index, currentStoryPage: 0 }),
  setCurrentStoryPage: (page) => set({ currentStoryPage: page }),
  resetStory: () => set({ currentStoryPage: 0 }),
  incrementQuizScore: () => set((state) => ({ quizScore: state.quizScore + 1 })),
  resetQuizScore: () => set({ quizScore: 0 }),
  incrementMemoryFlips: () => set((state) => ({ memoryFlips: state.memoryFlips + 1 })),
  resetMemoryFlips: () => set({ memoryFlips: 0 })
}));
