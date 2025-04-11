import { useQuizStore } from './store/quizStore';
import { WelcomeScreen } from './components/WelcomeScreen';
import { UserInfoForm } from './components/UserInfoForm';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import setupViewportHeightFix from './utils/viewport';
import { theme } from './lib/theme';
import AnimatedBackground from './components/AnimatedBackground';
import PatternBackground from './components/PatternBackground';
import KaviliBackground from './components/KaviliBackground';

import logo from './assets/logo.png';

// Define quiz steps for better type safety
enum QuizStep {
  WELCOME = 'welcome',
  USER_INFO = 'userInfo',
  QUIZ = 'quiz',
  RESULT = 'result',
}

function App() {
  const step = useQuizStore((state) => state.step);
  // Check if we're on the welcome screen
  const isWelcomeScreen = step === QuizStep.WELCOME;

  useEffect(() => {
    // Fix viewport height issues on mobile
    setTimeout(() => setupViewportHeightFix(), 0);

    let animationFrameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      animationFrameId = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        document.documentElement.style.setProperty('--mouse-x', x.toString());
        document.documentElement.style.setProperty('--mouse-y', y.toString());
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Add theme-color meta tag to prevent browser UI from turning purple
  useEffect(() => {
    // Set browser theme color to white
    const metaThemeColor = document.createElement('meta');
    metaThemeColor.name = 'theme-color';
    metaThemeColor.content = '#ffffff'; // White color for browser UI
    document.head.appendChild(metaThemeColor);

    // For iOS Safari
    const metaAppleCapable = document.createElement('meta');
    metaAppleCapable.name = 'apple-mobile-web-app-capable';
    metaAppleCapable.content = 'yes';
    document.head.appendChild(metaAppleCapable);

    const metaAppleStatusBar = document.createElement('meta');
    metaAppleStatusBar.name = 'apple-mobile-web-app-status-bar-style';
    metaAppleStatusBar.content = 'black-translucent';
    document.head.appendChild(metaAppleStatusBar);

    return () => {
      // Cleanup
      document.head.removeChild(metaThemeColor);
      document.head.removeChild(metaAppleCapable);
      document.head.removeChild(metaAppleStatusBar);
    };
  }, []);

  // Shadow style for Jockey One font with darker purple shadow
  const personalityStyle = {
    textShadow: `4px 4px 0px #330033`, // Darker purple shadow
    fontFamily: "'Jockey One', sans-serif",
    letterSpacing: '1px',
    textTransform: 'uppercase',
  };

  return (
    <>
      {/* Add Google Font import in a style tag */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Jockey+One&display=swap');
      `}</style>

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

        {/* Add the new KaviliBackground component */}
        <KaviliBackground />

        {/* Header with Logo and Title */}
        <header className="w-full flex-shrink-0 flex flex-col items-center justify-center px-4 relative z-20 mt-8 sm:mt-10 md:mt-12">
          {/* Logo - Always visible on all screens */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 sm:mb-4"
          >
            <img
              src={logo}
              alt="Company Logo"
              className="h-12 sm:h-16 md:h-18 w-auto" // Smaller logo with responsive sizing
            />
          </motion.div>

          {/* Title - Only show when NOT on welcome screen */}
          {!isWelcomeScreen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold text-center relative" // Smaller text on mobile
                style={{ color: theme.colors.primary.contrastText }}
              >
                {/* Sinhala text - keep original font */}
                <span className="font-bold">අවුරුදු </span>
                {/* Apply Jockey One only to "Personality" with shadow and larger size */}
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
                  PERSONALITY
                </span>{' '}
                {/* Keep original font for "Quiz" */}
                <span className="font-bold">Quiz</span>
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
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full overflow-y-auto relative z-20">
          <div className="min-h-full w-full max-w-4xl mx-auto flex items-center justify-center py-2 sm:py-3 md:py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full px-4 sm:px-5 md:px-6" // Adjusted horizontal padding
              >
                {step === QuizStep.WELCOME && <WelcomeScreen />}
                {step === QuizStep.USER_INFO && <UserInfoForm />}
                {step === QuizStep.QUIZ && <QuizScreen />}
                {step === QuizStep.RESULT && <ResultScreen />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Footer - Improved responsive spacing */}
        <footer className="w-full flex-shrink-0 h-8 sm:h-9 md:h-10 flex items-center justify-center px-4 relative z-20 mb-8 sm:mb-10 md:mb-12">
          <p
            className="text-xs md:text-sm"
            style={{ color: theme.colors.secondary.light }}
          >
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;