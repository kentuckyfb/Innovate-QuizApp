// src/types/quiz.ts

export type PersonalityType =
  | 'timekeeper'
  | 'creativeSparkle'
  | 'masterChef'
  | 'gamemaster'
  | 'chillGuy'
  | 'familyConnector'
  | 'celebrationFirecracker'
  | 'knowledgeKeeper';

// The rest of your types remain the same
export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    personalityWeights: Record<PersonalityType, number>;
  }[];
}

export interface UserInfo {
  name: string;
  phone: string;
  termsAccepted: boolean;
}

export interface QuizResult {
  personalityType: PersonalityType;
  description: string;
  traits: string[];
}

// Steps in the quiz flow
export type QuizStep = 'welcome' | 'user-info' | 'quiz' | 'result';

// Question option structure
export interface QuestionOption {
  id: string;
  text: string;
  personalityWeights: Record<PersonalityType, number>;
}

// Quiz question structure
export interface Question {
  id: string;
  question: string;
  options: QuestionOption[];
}

// Personality type structure
export interface Personality {
  title: string;
  description: string;
  traits: string[];
  icon: string;
  imagePath: string;
  color: string;
}