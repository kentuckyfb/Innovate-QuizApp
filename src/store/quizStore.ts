// src/store/quizStore.ts
import { create } from 'zustand';
import { Question, QuizStep, UserInfo, PersonalityType } from '../types/quiz';
import { saveUserInfo } from '../lib/supabase';

type QuizStore = {
  step: QuizStep;
  userInfo: UserInfo | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  result: PersonalityType | null;
  
  setStep: (step: QuizStep) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  setQuestions: (questions: Question[]) => void;
  answerQuestion: (questionId: string, answerId: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  setResult: (result: PersonalityType) => void;
  resetQuiz: () => void;
};

export const useQuizStore = create<QuizStore>((set, get) => ({
  step: 'welcome',
  userInfo: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  result: null,

  setStep: (step) => set({ step }),
  
  setUserInfo: (userInfo) => set({ userInfo }),
  
  setQuestions: (questions) => set({ questions }),
  
  answerQuestion: (questionId, answerId) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: answerId,
      },
    }));
  },
  
  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },
  
  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },
  
  setResult: (result) => {
    // Just update the local state with the result
    // We no longer save to the database here
    set({ result });
  },
  
  resetQuiz: () => {
    set({
      step: 'welcome',
      currentQuestionIndex: 0,
      answers: {},
      result: null,
    });
  },
}));