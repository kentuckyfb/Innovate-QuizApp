// src/components/WelcomeScreen.tsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import { useBackgroundStore } from '../store/backgroundStore';
// Import the image directly
import image2 from '../assets/2.png';
import { theme } from '../lib/theme';

export function WelcomeScreen() {
  const setStep = useQuizStore((state) => state.setStep);
  const { resetBackgroundSeed } = useBackgroundStore();

  // Reset background seed when welcome screen mounts
  useEffect(() => {
    resetBackgroundSeed();
  }, [resetBackgroundSeed]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Text shadow style for Jockey One font with darker purple shadow
  const textShadowStyle = {
    textShadow: `4px 4px 0px rgba(51, 0, 51, 1)`, // Darker purple shadow
    fontFamily: "'Jockey One', sans-serif",
    letterSpacing: '1px',
    textTransform: 'uppercase',
  };

  const buttonShadowStyle = {
    textShadow: `2px 2px 0px rgba(51, 0, 51, 1)`, // Darker purple shadow
    boxShadow: `4px 4px 0px rgba(51, 0, 51, 1)`, // Darker purple shadow
    fontFamily: "'Jockey One', sans-serif",
    letterSpacing: '1px',
    textTransform: 'uppercase',
  };

  // Personality style with text shadow and font family
  const personalityStyle = {
    textShadow: `3px 3px 0px rgba(51, 0, 51, 1)`, // Using rgba
    fontFamily: "'Jockey One', sans-serif",
    letterSpacing: '1px',
    textTransform: 'uppercase',
  };

  // Handler to navigate to user info step
  const handleStartQuiz = () => {
    setStep('userInfo');
  };

  return (
    <>
      {/* Add Google Font import in a style tag */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Jockey+One&display=swap');
      `}</style>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full flex flex-col justify-center items-center text-center py-3"
        style={{ 
          height: '100%',
          maxHeight: '100vh',
          overflow: 'hidden'
        }}
      >
        <div className="w-full max-w-md mx-auto px-4 flex flex-col justify-between" style={{ height: 'auto' }}>
          {/* Main content container */}
          <div className="flex flex-col items-center">
            {/* Hero image with animations - Fixed for responsive design */}
            <motion.div
              variants={itemVariants}
              className="relative mb-4 w-full mx-auto"
              style={{ 
                maxWidth: '85%',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-lg opacity-20 blur-md"
                style={{ 
                  backgroundColor: 'rgb(174, 0, 116)', // RGB for primary.dark
                  maxHeight: '100%'
                }}
                animate={{
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'mirror',
                }}
              />

              <motion.img
                src={image2}
                alt="Avrudu Greatness Level Up"
                className="relative z-10 rounded-xl shadow-lg"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '30vh',
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
                animate={{
                  scale: [1, 1.01, 1],
                  rotate: [0, 0.5, 0, -0.5, 0],
                }}
                transition={{
                  scale: {
                    duration: 5,
                    repeat: Infinity,
                    repeatType: 'mirror',
                  },
                  rotate: {
                    duration: 6,
                    repeat: Infinity,
                    repeatType: 'mirror',
                  },
                }}
              />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mb-3 leading-tight"
              style={{ color: 'rgb(255, 255, 255)' }} // RGB for primary.contrastText
            >
              {/* "Unlock Your" text */}
              <span 
                className="text-sm sm:text-base md:text-lg font-medium block mb-1"
                style={{ 
                  fontFamily: 'Arame, sans-serif',
                  fontWeight: 'bold'
                }}
              >
                Unlock Your 
              </span>

              <span
                style={{
                  ...personalityStyle,
                  color: 'rgb(251, 192, 45)', // RGB for secondary.main
                  fontSize: 'clamp(1rem, 5vw, 2.5rem)',
                  display: 'inline-block',
                  position: 'relative',
                  transform: 'translateY(2px)',
                  fontFamily: 'Arame, sans-serif',
                  fontWeight: 'bold',
                }}
              >
                INNOVATE
              </span>{' '}
              {/* Sinhala text */}
              <span
                className="font-bold"
                style={{
                  fontSize: 'clamp(1.25rem, 5vw, 2.5rem)',
                }}
              >
                අවුරුදු{' '}
              </span>
              {' '}
              {/* "PERSONALITY" text */}
              <span
                style={{
                  ...personalityStyle,
                  color: 'rgb(251, 192, 45)', // RGB for secondary.main
                  fontSize: 'clamp(1rem, 5vw, 2.5rem)',
                  display: 'inline-block',
                  position: 'relative',
                  transform: 'translateY(2px)',
                  fontFamily: 'Arame, sans-serif',
                  fontWeight: 'bold',
                }}
              >
                PERSONALITY
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base mb-5 max-w-sm mx-auto"
              style={{ color: 'rgb(255, 255, 255)' }} // RGB for primary.contrastText
            >
              Find out which Sinhala & Tamil New Year personality matches your
              vibe!
            </motion.p>
          </div>

          {/* Button with subtle animation */}
          <motion.div
            variants={itemVariants}
            className="relative inline-block self-center mb-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartQuiz}
              className="relative px-6 py-3 rounded-full font-semibold shadow-lg z-10 text-sm md:text-base"
              style={{
                backgroundColor: 'rgb(251, 192, 45)', // RGB for secondary.main
                color: 'rgb(255, 255, 255)', // RGB for primary.contrastText
                ...buttonShadowStyle,
                fontFamily: 'Arame, sans-serif',
                fontWeight: 'bold',
              }}
              animate={{
                boxShadow: [
                  `4px 4px 0px rgba(51, 0, 51, 1), 0px 0px 0px rgba(251, 192, 45, 0)`,
                  `4px 4px 0px rgba(51, 0, 51, 1), 0px 0px 15px rgba(251, 192, 45, 0.6)`,
                  `4px 4px 0px rgba(51, 0, 51, 1), 0px 0px 0px rgba(251, 192, 45, 0)`,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'mirror',
              }}
            >
              READY TO PLAY?
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}