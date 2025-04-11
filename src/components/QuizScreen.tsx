import { AnimatePresence, motion } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { theme } from '../lib/theme';

const questions = [
  {
    id: '1',
    question: 'How do you get ready for Avurudu?',
    options: [
      {
        id: '1c',
        text: 'Bake, cook, fry - whatever it takes for those perfect treats 🍩',
        personalityWeights: {
          masterChef: 3,
          familyConnector: 2,
          creativeSparkle: 1,
          celebrationFirecracker: 1,
          gamemaster: 0,
          timekeeper: 1,
          knowledgeKeeper: 1,
          harmonyKeeper: 0,
        },
      },
      {
        id: '1a',
        text: 'I plan everything around Nekath – gotta stay on schedule ⏳',
        personalityWeights: {
          timekeeper: 3,
          knowledgeKeeper: 2,
          gamemaster: 1,
          celebrationFirecracker: 1,
          familyConnector: 1,
          masterChef: 1,
          creativeSparkle: 0,
          harmonyKeeper: 0,
        },
      },
      {
        id: '1d',
        text: "Fun's in my blood - setting up games for the whole crew 🎯",
        personalityWeights: {
          gamemaster: 3,
          celebrationFirecracker: 2,
          harmonyKeeper: 1,
          knowledgeKeeper: 1,
          familyConnector: 1,
          masterChef: 0,
          creativeSparkle: 1,
          timekeeper: 0,
        },
      },
      {
        id: '1b',
        text: "House glow-up, I'm bringing the decor energy 🎨",
        personalityWeights: {
          creativeSparkle: 3,
          celebrationFirecracker: 2,
          familyConnector: 1,
          gamemaster: 1,
          timekeeper: 0,
          knowledgeKeeper: 0,
          masterChef: 1,
          harmonyKeeper: 1,
        },
      },
    ],
  },
  {
    id: '2',
    question: "What's your Avurudu fit?",
    options: [
      {
        id: '2d',
        text: "Comfy, because I'm about to win every game 🏃‍♀️",
        personalityWeights: {
          gamemaster: 3,
          celebrationFirecracker: 2,
          harmonyKeeper: 1,
          familyConnector: 1,
          timekeeper: 0,
          knowledgeKeeper: 0,
          masterChef: 0,
          creativeSparkle: 1,
        },
      },
      {
        id: '2b',
        text: "Vivid colors, I'm giving full TikTok aesthetic 🌈",
        personalityWeights: {
          creativeSparkle: 3,
          celebrationFirecracker: 2,
          familyConnector: 1,
          gamemaster: 1,
          timekeeper: 0,
          knowledgeKeeper: 0,
          masterChef: 0,
          harmonyKeeper: 1,
        },
      },
      {
        id: '2c',
        text: 'Casual but sleek - no effort, all vibes 😎',
        personalityWeights: {
          harmonyKeeper: 3,
          familyConnector: 2,
          gamemaster: 1,
          creativeSparkle: 1,
          celebrationFirecracker: 1,
          timekeeper: 0,
          knowledgeKeeper: 0,
          masterChef: 0,
        },
      },
      {
        id: '2a',
        text: 'Keep it classic - Traditional, the true Avurudu drip 🧑‍🎤',
        personalityWeights: {
          knowledgeKeeper: 2,
          creativeSparkle: 3,
          celebrationFirecracker: 2,
          harmonyKeeper: 1,
          timekeeper: 1,
          gamemaster: 0,
          masterChef: 0,
          familyConnector: 1,
        },
      },
    ],
  },
  {
    id: '3',
    question: 'How do you handle Avurudu meals?',
    options: [
      {
        id: '3d',
        text: "Only here for the feast, no cooking involved 😆",
        personalityWeights: {
          harmonyKeeper: 3,
          celebrationFirecracker: 2,
          familyConnector: 1,
          masterChef: 0,
          timekeeper: 0,
          knowledgeKeeper: 0,
          gamemaster: 1,
          creativeSparkle: 0,
        },
      },
      {
        id: '3c',
        text: 'Making extra for the squad - sharing is caring 🤝',
        personalityWeights: {
          familyConnector: 3,
          masterChef: 2,
          harmonyKeeper: 2,
          celebrationFirecracker: 1,
          gamemaster: 0,
          timekeeper: 0,
          knowledgeKeeper: 0,
          creativeSparkle: 1,
        },
      },
      {
        id: '3a',
        text: 'Stick to the classics - everything gotta be authentic 📝',
        personalityWeights: {
          knowledgeKeeper: 3,
          timekeeper: 2,
          masterChef: 2,
          familyConnector: 1,
          creativeSparkle: 1,
          gamemaster: 0,
          harmonyKeeper: 0,
          celebrationFirecracker: 0,
        },
      },
      {
        id: '3b',
        text: "Plate it like it's food art - Instagrammable vibes 🍽️",
        personalityWeights: {
          creativeSparkle: 3,
          masterChef: 2,
          celebrationFirecracker: 1,
          familyConnector: 1,
          gamemaster: 0,
          timekeeper: 0,
          knowledgeKeeper: 1,
          harmonyKeeper: 0,
        },
      },
    ],
  },
  {
    id: '4',
    question: 'Your role in the Avurudu squad?',
    options: [
      {
        id: '4c',
        text: 'The glue - making sure everyone is mingling',
        personalityWeights: {
          familyConnector: 3,
          harmonyKeeper: 2,
          celebrationFirecracker: 2,
          creativeSparkle: 1,
          gamemaster: 1,
          timekeeper: 0,
          knowledgeKeeper: 0,
          masterChef: 0,
        },
      },
      {
        id: '4a',
        text: 'The folklore fanatic – history is my game 📖',
        personalityWeights: {
          knowledgeKeeper: 3,
          timekeeper: 2,
          celebrationFirecracker: 1,
          harmonyKeeper: 1,
          familyConnector: 1,
          masterChef: 0,
          gamemaster: 0,
          creativeSparkle: 1,
        },
      },
      {
        id: '4d',
        text: 'The hype master - keeping the energy high🔥',
        personalityWeights: {
          celebrationFirecracker: 3,
          gamemaster: 2,
          familyConnector: 1,
          harmonyKeeper: 1,
          knowledgeKeeper: 0,
          timekeeper: 0,
          masterChef: 0,
          creativeSparkle: 1,
        },
      },
      {
        id: '4b',
        text: 'The food enthusiast - making sure every dish is perfect 🍛',
        personalityWeights: {
          masterChef: 3,
          familyConnector: 2,
          celebrationFirecracker: 1,
          harmonyKeeper: 1,
          knowledgeKeeper: 1,
          timekeeper: 1,
          gamemaster: 0,
          creativeSparkle: 1,
        },
      },
    ],
  },
  {
    id: '5',
    question: 'Your favorite Avurudu moment?',
    options: [
      {
        id: '5c',
        text: "Family time, that's where real joy is 💖",
        personalityWeights: {
          familyConnector: 3,
          harmonyKeeper: 2,
          celebrationFirecracker: 1,
          timekeeper: 0,
          knowledgeKeeper: 1,
          gamemaster: 0,
          masterChef: 1,
          creativeSparkle: 1,
        },
      },
      {
        id: '5d',
        text: 'The competition - bringing my A-game to every challenge 🏅',
        personalityWeights: {
          gamemaster: 3,
          celebrationFirecracker: 2,
          harmonyKeeper: 1,
          familyConnector: 0,
          timekeeper: 1,
          knowledgeKeeper: 0,
          masterChef: 0,
          creativeSparkle: 0,
        },
      },
      {
        id: '5b',
        text: 'The vibes - decor, color, and everything Insta-worthy 🌸',
        personalityWeights: {
          creativeSparkle: 3,
          celebrationFirecracker: 2,
          harmonyKeeper: 1,
          familyConnector: 1,
          gamemaster: 0,
          timekeeper: 0,
          knowledgeKeeper: 0,
          masterChef: 1,
        },
      },
      {
        id: '5a',
        text: 'Tuning into traditions – staying woke to the customs 📚',
        personalityWeights: {
          knowledgeKeeper: 3,
          timekeeper: 2,
          celebrationFirecracker: 1,
          harmonyKeeper: 1,
          familyConnector: 1,
          masterChef: 0,
          gamemaster: 0,
          creativeSparkle: 1,
        },
      },
    ],
  },
];



export function QuizScreen() {
  const {
    currentQuestionIndex,
    answers,
    answerQuestion,
    nextQuestion,
    setQuestions,
    setStep,
    setResult,
  } = useQuizStore();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    setQuestions(questions);
  }, [setQuestions]);

  const currentQuestion = questions[currentQuestionIndex];

  // Reset states when question changes - ensure nothing is pre-highlighted
  useEffect(() => {
    // Only set selected option if user has already answered this question
    if (answers[currentQuestion?.id]) {
      setSelectedOption(answers[currentQuestion?.id]);
      setHasAnswered(true);
    } else {
      // Clear any selection for a new question
      setSelectedOption(null);
      setHasAnswered(false);
    }
    setIsTransitioning(false);
  }, [currentQuestionIndex, answers, currentQuestion?.id]);

  const handleAnswer = (optionId: string) => {
    // If already transitioning or already answered this question, do nothing
    if (isTransitioning || hasAnswered) return;

    // Immediately update local state
    setSelectedOption(optionId);

    // Update answer locked status
    setHasAnswered(true);

    // Also update the global state immediately
    answerQuestion(currentQuestion.id, optionId);

    // Immediately lock further interactions
    setIsTransitioning(true);

    // Small delay for animation before transitioning to next question
    setTimeout(() => {
      if (currentQuestionIndex === questions.length - 1) {
        // Calculate result
        const personalityScores = Object.keys(
          questions[0].options[0].personalityWeights
        ).reduce(
          (acc, personality) => ({ ...acc, [personality]: 0 }),
          {} as Record<string, number>
        );

        // Use updated answers from the store to calculate results
        Object.entries(answers).forEach(([questionId, answerId]) => {
          const question = questions.find((q) => q.id === questionId);
          const option = question?.options.find((o) => o.id === answerId);

          if (option) {
            Object.entries(option.personalityWeights).forEach(
              ([personality, weight]) => {
                personalityScores[personality] += weight;
              }
            );
          }
        });

        // Find the highest score
        let maxScore = -1;
        let result = '';

        // First find the max score
        Object.entries(personalityScores).forEach(([personality, score]) => {
          if (score > maxScore) {
            maxScore = score;
          }
        });

        // Then find all personalities with that score
        const topPersonalities = Object.entries(personalityScores)
          .filter(([_, score]) => score === maxScore)
          .map(([personality]) => personality);

        // If there's a tie, pick one randomly to ensure diversity
        if (topPersonalities.length > 1) {
          result =
            topPersonalities[
              Math.floor(Math.random() * topPersonalities.length)
            ];
        } else {
          result = topPersonalities[0];
        }

        setResult(result as any);
        setStep('result');
      } else {
        nextQuestion();
      }
    }, 800); // Single timeout with slightly longer delay
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const questionVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const optionVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
    hover: {
      scale: 1.02,
      backgroundColor: 'rgba(251, 192, 45, 0.25)',
      borderColor: theme.colors.secondary.main,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-lg mx-auto px-4 flex flex-col"
          style={{
            height: 'auto',
            maxHeight: 'calc(100vh - 200px)', // Reduced max height to avoid overflow
            marginTop: '1rem',
            marginBottom: '1rem',
            overflowY: 'visible', // Changed from auto to visible to prevent the yellow overscroll
          }}
        >
          {/* Progress bar and question count */}
          <div className="mb-4 flex-shrink-0">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{
                  width: `${(currentQuestionIndex / questions.length) * 100}%`,
                }}
                animate={{
                  width: `${
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  }%`,
                }}
                className="h-2 rounded-full transition-all duration-500"
                style={{ backgroundColor: theme.colors.secondary.dark }}
              />
            </div>
            <p
              className="text-xs mt-1 text-center font-medium"
              style={{ color: theme.colors.secondary.main }}
            >
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>

          {/* Question card */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl p-4 shadow-md mb-4 border-2 flex-shrink-0"
            style={{ borderColor: theme.colors.secondary.light }}
          >
            <motion.h2
              variants={questionVariants}
              className="text-lg sm:text-xl font-bold text-center"
              style={{ color: theme.colors.primary.dark }}
            >
              {currentQuestion.question}
            </motion.h2>
          </motion.div>

          {/* Options container with proper spacing */}
          <div className="space-y-3 flex-grow mb-4">
            {currentQuestion.options.map((option, i) => (
              <motion.button
                key={option.id}
                custom={i}
                variants={optionVariants}
                whileHover={
                  !hasAnswered && !isTransitioning ? 'hover' : undefined
                }
                whileTap={!hasAnswered && !isTransitioning ? 'tap' : undefined}
                onClick={() => handleAnswer(option.id)}
                disabled={isTransitioning || hasAnswered}
                className={cn(
                  'w-full p-2 sm:p-3 text-left rounded-lg transition-all duration-300',
                  'hover:shadow-md border-2 flex items-center',
                  'bg-white border-transparent',
                  (isTransitioning || hasAnswered) &&
                    selectedOption !== option.id
                    ? 'opacity-70'
                    : 'opacity-100'
                )}
                style={{
                  borderColor:
                    selectedOption === option.id
                      ? theme.colors.secondary.dark
                      : 'transparent',
                  backgroundColor:
                    selectedOption === option.id
                      ? 'rgba(251, 192, 45, 0.3)'
                      : 'white',
                  marginBottom: '0.75rem', // Added extra margin to ensure spacing when hovering
                  cursor:
                    isTransitioning || hasAnswered ? 'default' : 'pointer',
                }}
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: selectedOption === option.id ? 1 : 0 }}
                  className="w-2 h-2 sm:w-3 sm:h-3 mr-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: theme.colors.primary.main }}
                />
                <span
                  className="text-xs sm:text-sm"
                  style={{ 
                    color: selectedOption === option.id 
                      ? theme.colors.text.light 
                      : theme.colors.primary.dark 
                  }}
                >
                  {option.text}
                </span>

                {selectedOption === option.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                    style={{ color: theme.colors.secondary.dark }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}