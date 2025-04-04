// src/services/quizService.ts
import { supabase } from '../lib/supabase';
import { QuizQuestion, Personality } from '../types/quiz';

// Load questions and options from Supabase
export const loadQuizData = async (): Promise<QuizQuestion[]> => {
  try {
    // Fetch questions
    const { data: questionsData, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .order('question_number');

    if (questionsError) throw questionsError;

    // For each question, fetch its options and personality weights
    const questionsWithOptions = await Promise.all(
      (questionsData || []).map(async (question) => {
        const { data: optionsData, error: optionsError } = await supabase
          .from('options')
          .select('*')
          .eq('question_id', question.id)
          .order('option_number');

        if (optionsError) throw optionsError;

        // For each option, fetch personality weights
        const optionsWithWeights = await Promise.all(
          (optionsData || []).map(async (option) => {
            const { data: weightsData, error: weightsError } = await supabase
              .from('personality_weights')
              .select(
                `
            personality_id,
            weight,
            personalities(name)
          `
              )
              .eq('option_id', option.id);

            if (weightsError) throw weightsError;

            // Transform weights into the format needed by the quiz
            const personalityWeights: Record<string, number> = {};

            (weightsData || []).forEach((weight) => {
              if (weight.personalities?.name) {
                personalityWeights[weight.personalities.name] = weight.weight;
              }
            });

            return {
              id: option.id,
              text: option.option_text,
              personalityWeights,
            };
          })
        );

        return {
          id: question.id,
          question: question.question_text,
          options: optionsWithWeights,
        };
      })
    );

    return questionsWithOptions;
  } catch (error) {
    console.error('Error loading quiz data:', error);
    throw error;
  }
};

// Load personalities from Supabase
export const loadPersonalities = async (): Promise<
  Record<string, Personality>
> => {
  try {
    const { data, error } = await supabase.from('personalities').select('*');

    if (error) throw error;

    const personalities: Record<string, Personality> = {};

    (data || []).forEach((personality) => {
      personalities[personality.name] = {
        id: personality.id,
        name: personality.name,
        title: personality.title,
        description: personality.description,
        traits: Array.isArray(personality.traits) ? personality.traits : [],
        icon: personality.icon,
        imagePath: personality.image_path,
        color: personality.color,
      };
    });

    return personalities;
  } catch (error) {
    console.error('Error loading personalities:', error);
    throw error;
  }
};

// Load app settings from Supabase
export const loadAppSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('name', 'app_settings')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found, return default settings
        return {
          theme: {
            primaryColor: '#9c27b0',
            secondaryColor: '#f3e5f5',
            fontFamily: 'Poppins, sans-serif',
            borderRadius: 'rounded',
            buttonStyle: 'default',
          },
          title: 'Avrudu Personality Quiz',
          description: 'Discover your Avrudu personality type',
          maxQuestions: 10,
        };
      }
      throw error;
    }

    return data.value;
  } catch (error) {
    console.error('Error loading app settings:', error);
    throw error;
  }
};

// Save quiz result
export const saveQuizResult = async (userData: {
  name: string;
  phone: string;
  personalityResult: string;
}) => {
  try {
    const { error } = await supabase.from('quiz_users').insert({
      name: userData.name,
      phone: userData.phone,
      quiz_type: 'avrudu',
      personality_result: userData.personalityResult,
      created_at: new Date().toISOString(),
    });

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    throw error;
  }
};
