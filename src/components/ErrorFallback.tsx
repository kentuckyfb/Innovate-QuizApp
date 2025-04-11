// src/components/ErrorFallback.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '../lib/theme';
import PatternBackground from './PatternBackground';
import AnimatedBackground from './AnimatedBackground';
import KaviliBackground from './KaviliBackground';
import logo from '../assets/logo.png';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const handleReset = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  // Shadow style for Jockey One font with darker purple shadow
  const personalityStyle = {
    textShadow: `4px 4px 0px #330033`, // Darker purple shadow
    fontFamily: "'Jockey One', sans-serif",
    letterSpacing: '1px',
    textTransform: 'uppercase',
  };

  return (
    <div
      className="h-screen w-screen max-h-screen max-w-screen flex flex-col overflow-hidden"
      style={{
        background: `linear-gradient(to bottom right, ${theme.colors.primary.light}, ${theme.colors.primary.main}, ${theme.colors.primary.dark})`,
      }}
    >
      {/* Include the pattern background component */}
      <PatternBackground />

      {/* Add the AnimatedBackground component */}
      <AnimatedBackground />

      {/* Add the KaviliBackground component */}
      <KaviliBackground />

      {/* Header with Logo and Title */}
      <header className="w-full flex-shrink-0 flex flex-col items-center justify-center px-4 relative z-20 mt-8 sm:mt-10 md:mt-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 sm:mb-4"
        >
          <img
            src={logo}
            alt="Company Logo"
            className="h-12 sm:h-16 md:h-18 w-auto"
          />
        </motion.div>

        {/* Title with selective Jockey One font */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <h1
            className="text-xl sm:text-2xl md:text-3xl font-bold text-center relative"
            style={{ color: theme.colors.primary.contrastText }}
          >
            <span
              style={{
                ...personalityStyle,
                color: theme.colors.secondary.main,
                fontSize: '120%',
                display: 'inline-block',
                position: 'relative',
                transform: 'translateY(2px)',
                fontFamily: 'Arame',
                fontWeight: 'bold',
              }}
            >
              OOPS!
            </span>{' '}
            <span className="font-bold">Something Went Wrong</span>
          </h1>

          {/* Add decorative line under the title */}
          <div
            className="absolute w-full h-1 left-0 -bottom-2"
            style={{
              background: `linear-gradient(90deg, transparent, ${theme.colors.secondary.main}, transparent)`,
              boxShadow: `0 0 8px ${theme.colors.secondary.light}`,
            }}
          ></div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-y-auto relative z-20">
        <div className="min-h-full w-full max-w-4xl mx-auto flex items-center justify-center py-2 sm:py-3 md:py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mx-auto px-4"
          >
            <div 
              className="bg-white rounded-xl p-6 shadow-lg border-2"
              style={{ borderColor: theme.colors.secondary.light }}
            >
              <h2 
                className="text-xl font-bold mb-4"
                style={{ color: theme.colors.secondary.main }}
              >
                Error Encountered
              </h2>
              
              <p className="mb-4 text-gray-700">
                We encountered an unexpected issue. You can try refreshing the page to continue using the quiz.
              </p>
              
              {error && (
                <div className="bg-gray-50 p-4 rounded mb-4 border border-gray-200">
                  <p className="text-sm mb-1 font-medium text-gray-600">Error details:</p>
                  <pre className="text-xs overflow-auto max-h-32 p-2 bg-gray-100 rounded">
                    {error.toString()}
                  </pre>
                </div>
              )}
              
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: theme.colors.secondary.dark 
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="w-full mt-2 py-3 px-4 rounded-lg font-medium text-white transition-colors duration-300"
                style={{ backgroundColor: theme.colors.secondary.main }}
              >
                Return to Quiz
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full flex-shrink-0 h-8 sm:h-9 md:h-10 flex items-center justify-center px-4 relative z-20 mb-8 sm:mb-10 md:mb-12">
        <p
          className="text-xs md:text-sm"
          style={{ color: theme.colors.secondary.light }}
        >
          Atlas Axillia Co. (Pvt) Ltd. @ 2023. All rights reserved.
        </p>
      </footer>
    </div>
  );
}