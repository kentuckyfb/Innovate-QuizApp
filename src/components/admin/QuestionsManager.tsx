// src/components/admin/QuestionsManager.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  Loader,
} from 'lucide-react';

// Types for our data
interface Question {
  id: string;
  question_number: number;
  question_text: string;
  created_at: string;
  updated_at: string;
  options: Option[];
}

interface Option {
  id: string;
  question_id: string;
  option_text: string;
  option_number: string;
  weights: PersonalityWeight[];
}

interface PersonalityWeight {
  id: string;
  option_id: string;
  personality_id: string;
  personality_name: string;
  weight: number;
}

interface Personality {
  id: string;
  name: string;
}

export function QuestionsManager() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load questions and personalities
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch personalities first
        const { data: personalitiesData, error: personalitiesError } =
          await supabase.from('personalities').select('id, name').order('name');

        if (personalitiesError) throw personalitiesError;
        setPersonalities(personalitiesData || []);

        // Fetch questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .order('question_number');

        if (questionsError) throw questionsError;

        // For each question, fetch its options
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
                const { data: weightsData, error: weightsError } =
                  await supabase
                    .from('personality_weights')
                    .select(
                      `
                id,
                option_id,
                personality_id,
                weight,
                personalities(name)
              `
                    )
                    .eq('option_id', option.id);

                if (weightsError) throw weightsError;

                // Transform the weights data
                const weights = (weightsData || []).map((weight) => ({
                  id: weight.id,
                  option_id: weight.option_id,
                  personality_id: weight.personality_id,
                  personality_name: weight.personalities?.name || '',
                  weight: weight.weight,
                }));

                return {
                  ...option,
                  weights,
                };
              })
            );

            return {
              ...question,
              options: optionsWithWeights,
            };
          })
        );

        setQuestions(questionsWithOptions);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle expanded state for a question
  const toggleExpand = (questionId: string) => {
    if (expandedQuestion === questionId) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(questionId);
    }
  };

  // Start editing a question
  const handleEdit = (question: Question) => {
    setEditingQuestion({
      ...question,
      options: [...question.options],
    });
    setExpandedQuestion(question.id);
  };

  // Handle changes to question text
  const handleQuestionTextChange = (value: string) => {
    if (!editingQuestion) return;
    setEditingQuestion({
      ...editingQuestion,
      question_text: value,
    });
  };

  // Handle changes to option text
  const handleOptionTextChange = (optionId: string, value: string) => {
    if (!editingQuestion) return;
    setEditingQuestion({
      ...editingQuestion,
      options: editingQuestion.options.map((option) =>
        option.id === optionId ? { ...option, option_text: value } : option
      ),
    });
  };

  // Handle changes to personality weight
  const handleWeightChange = (
    optionId: string,
    personalityId: string,
    value: number
  ) => {
    if (!editingQuestion) return;

    setEditingQuestion({
      ...editingQuestion,
      options: editingQuestion.options.map((option) => {
        if (option.id === optionId) {
          // Find if weight already exists
          const existingWeightIndex = option.weights.findIndex(
            (w) => w.personality_id === personalityId
          );

          let updatedWeights = [...option.weights];

          if (existingWeightIndex >= 0) {
            // Update existing weight
            updatedWeights[existingWeightIndex] = {
              ...updatedWeights[existingWeightIndex],
              weight: value,
            };
          } else {
            // Add new weight
            const personalityName =
              personalities.find((p) => p.id === personalityId)?.name || '';
            updatedWeights.push({
              id: `temp_${Date.now()}`, // Will be replaced on save
              option_id: optionId,
              personality_id: personalityId,
              personality_name: personalityName,
              weight: value,
            });
          }

          return {
            ...option,
            weights: updatedWeights,
          };
        }
        return option;
      }),
    });
  };

  // Save a question
  const handleSave = async () => {
    if (!editingQuestion) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Update the question
      const { error: questionError } = await supabase
        .from('questions')
        .update({
          question_text: editingQuestion.question_text,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingQuestion.id);

      if (questionError) throw questionError;

      // Update each option
      for (const option of editingQuestion.options) {
        const { error: optionError } = await supabase
          .from('options')
          .update({
            option_text: option.option_text,
            updated_at: new Date().toISOString(),
          })
          .eq('id', option.id);

        if (optionError) throw optionError;

        // Handle weights - this is more complex
        for (const weight of option.weights) {
          if (weight.id.startsWith('temp_')) {
            // This is a new weight, insert it
            const { error: insertError } = await supabase
              .from('personality_weights')
              .insert({
                option_id: option.id,
                personality_id: weight.personality_id,
                weight: weight.weight,
              });

            if (insertError) throw insertError;
          } else {
            // This is an existing weight, update it
            const { error: updateError } = await supabase
              .from('personality_weights')
              .update({
                weight: weight.weight,
              })
              .eq('id', weight.id);

            if (updateError) throw updateError;
          }
        }
      }

      setSuccess('Question updated successfully');

      // Refresh the questions list
      const { data: refreshedQuestion, error: refreshError } = await supabase
        .from('questions')
        .select('*')
        .eq('id', editingQuestion.id)
        .single();

      if (refreshError) throw refreshError;

      // Fetch updated options
      const { data: optionsData, error: optionsError } = await supabase
        .from('options')
        .select('*')
        .eq('question_id', editingQuestion.id)
        .order('option_number');

      if (optionsError) throw optionsError;

      // For each option, fetch personality weights
      const optionsWithWeights = await Promise.all(
        (optionsData || []).map(async (option) => {
          const { data: weightsData, error: weightsError } = await supabase
            .from('personality_weights')
            .select(
              `
            id,
            option_id,
            personality_id,
            weight,
            personalities(name)
          `
            )
            .eq('option_id', option.id);

          if (weightsError) throw weightsError;

          // Transform the weights data
          const weights = (weightsData || []).map((weight) => ({
            id: weight.id,
            option_id: weight.option_id,
            personality_id: weight.personality_id,
            personality_name: weight.personalities?.name || '',
            weight: weight.weight,
          }));

          return {
            ...option,
            weights,
          };
        })
      );

      const updatedQuestion = {
        ...refreshedQuestion,
        options: optionsWithWeights,
      };

      // Update questions list
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === updatedQuestion.id ? updatedQuestion : q
        )
      );

      // Clear editing state
      setEditingQuestion(null);
    } catch (error: any) {
      console.error('Error saving question:', error);
      setError(error.message || 'Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setError(null);
    setSuccess(null);
  };

  // Add a new question
  const handleAddQuestion = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Determine the next question number
      const nextQuestionNumber =
        questions.length > 0
          ? Math.max(...questions.map((q) => q.question_number)) + 1
          : 1;

      // Insert the new question
      const { data: newQuestion, error: questionError } = await supabase
        .from('questions')
        .insert({
          question_number: nextQuestionNumber,
          question_text: 'New Question',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (questionError) throw questionError;

      // Add default options
      const defaultOptions = [];
      for (let i = 1; i <= 4; i++) {
        const { data: option, error: optionError } = await supabase
          .from('options')
          .insert({
            question_id: newQuestion.id,
            option_text: `Option ${i}`,
            option_number: `${i}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (optionError) throw optionError;
        defaultOptions.push({ ...option, weights: [] });
      }

      // Add to questions list
      const newQuestionWithOptions = {
        ...newQuestion,
        options: defaultOptions,
      };

      setQuestions((prevQuestions) => [
        ...prevQuestions,
        newQuestionWithOptions,
      ]);
      setSuccess('New question added successfully');

      // Start editing the new question
      setEditingQuestion(newQuestionWithOptions);
      setExpandedQuestion(newQuestion.id);
    } catch (error: any) {
      console.error('Error adding question:', error);
      setError(error.message || 'Failed to add new question');
    } finally {
      setSaving(false);
    }
  };

  // Delete a question
  const handleDeleteQuestion = async (questionId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this question? This cannot be undone.'
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Delete the question (cascade should handle options and weights)
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      // Remove from questions list
      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q.id !== questionId)
      );
      setSuccess('Question deleted successfully');

      // Reset state if the deleted question was being edited
      if (editingQuestion?.id === questionId) {
        setEditingQuestion(null);
      }
      if (expandedQuestion === questionId) {
        setExpandedQuestion(null);
      }
    } catch (error: any) {
      console.error('Error deleting question:', error);
      setError(error.message || 'Failed to delete question');
    } finally {
      setLoading(false);
    }
  };

  if (loading && questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Questions</h1>
          <p className="text-gray-600">
            Edit existing questions or add new ones
          </p>
        </div>
        <button
          onClick={handleAddQuestion}
          disabled={saving || questions.length >= 10}
          className={`inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white
                     ${
                       questions.length >= 10
                         ? 'bg-gray-400 cursor-not-allowed'
                         : 'bg-purple-600 hover:bg-purple-700'
                     }`}
        >
          <Plus size={16} className="mr-2" />
          Add Question
        </button>
      </div>

      {questions.length >= 10 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Maximum of 10 questions allowed. Delete existing questions to
                add new ones.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {questions.map((question) => (
            <li key={question.id}>
              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold">
                      {question.question_number}
                    </span>
                    <h3 className="ml-3 text-lg font-medium text-gray-900 truncate">
                      {question.question_text}
                    </h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(question)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => toggleExpand(question.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                    >
                      {expandedQuestion === question.id ? (
                        <>
                          <ChevronUp size={16} className="mr-1" />
                          Hide
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} className="mr-1" />
                          View
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Expanded view or editing form */}
                {expandedQuestion === question.id && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    {editingQuestion && editingQuestion.id === question.id ? (
                      /* Editing form */
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="question-text"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Question Text
                          </label>
                          <input
                            type="text"
                            id="question-text"
                            value={editingQuestion.question_text}
                            onChange={(e) =>
                              handleQuestionTextChange(e.target.value)
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Options
                          </h4>
                          <div className="space-y-3">
                            {editingQuestion.options.map((option) => (
                              <div
                                key={option.id}
                                className="border border-gray-200 rounded-md p-4"
                              >
                                <div className="mb-3">
                                  <label
                                    htmlFor={`option-${option.id}`}
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Option {option.option_number}
                                  </label>
                                  <input
                                    type="text"
                                    id={`option-${option.id}`}
                                    value={option.option_text}
                                    onChange={(e) =>
                                      handleOptionTextChange(
                                        option.id,
                                        e.target.value
                                      )
                                    }
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                  />
                                </div>

                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                                    Personality Weights
                                  </h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {personalities.map((personality) => {
                                      const weight =
                                        option.weights.find(
                                          (w) =>
                                            w.personality_id === personality.id
                                        )?.weight || 0;
                                      return (
                                        <div
                                          key={personality.id}
                                          className="flex items-center"
                                        >
                                          <span className="text-xs text-gray-500 w-24 truncate">
                                            {personality.name}
                                          </span>
                                          <input
                                            type="number"
                                            min="0"
                                            max="3"
                                            value={weight}
                                            onChange={(e) =>
                                              handleWeightChange(
                                                option.id,
                                                personality.id,
                                                parseInt(e.target.value)
                                              )
                                            }
                                            className="ml-2 block w-16 border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <X size={16} className="mr-2" />
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                          >
                            {saving ? (
                              <>
                                <Loader
                                  size={16}
                                  className="mr-2 animate-spin"
                                />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save size={16} className="mr-2" />
                                Save Changes
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Readonly view */
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Options
                        </h4>
                        <div className="space-y-3">
                          {question.options.map((option) => (
                            <div
                              key={option.id}
                              className="border border-gray-200 rounded-md p-4"
                            >
                              <div className="mb-3">
                                <span className="text-sm font-medium text-gray-500">
                                  Option {option.option_number}
                                </span>
                                <p className="text-gray-900">
                                  {option.option_text}
                                </p>
                              </div>

                              {option.weights.length > 0 && (
                                <div>
                                  <h5 className="text-sm font-medium text-gray-500 mb-2">
                                    Personality Weights
                                  </h5>
                                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                    {option.weights
                                      .sort((a, b) => b.weight - a.weight) // Sort by weight (highest first)
                                      .filter((w) => w.weight > 0) // Only show weights > 0
                                      .map((weight) => (
                                        <div
                                          key={weight.id}
                                          className="flex items-center"
                                        >
                                          <span className="text-xs text-gray-500 truncate">
                                            {weight.personality_name}
                                          </span>
                                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                            {weight.weight}
                                          </span>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
