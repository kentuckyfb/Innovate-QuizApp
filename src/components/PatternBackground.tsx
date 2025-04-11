// src/components/PatternBackground.tsx
import React from 'react';
import { theme } from '../lib/theme';
import patternImage from '../assets/pattern.png';

const PatternBackground: React.FC = () => {
  return (
    <>
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl" // Reduced from w-96 h-96
          style={{
            backgroundColor: theme.colors.secondary.light,
            transform: `translate(calc(-50% + calc(var(--mouse-x, 0.5) * 40px)),
                         calc(-50% + calc(var(--mouse-y, 0.5) * 40px)))`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-20 blur-3xl" // Reduced from w-96 h-96
          style={{
            backgroundColor: theme.colors.secondary.main,
            transform: `translate(calc(50% - calc(var(--mouse-x, 0.5) * 40px)),
                         calc(50% - calc(var(--mouse-y, 0.5) * 40px)))`,
          }}
        />
      </div>

      {/* Top and Bottom White Pattern Border Only - Reduced height */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {/* Top pattern border - rotated to fix to the top */}
        <div
          className="absolute top-0 left-0 right-0 h-8" // Reduced from h-12 to h-8
          style={{
            backgroundImage: `url(${patternImage})`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%', // This maintains the aspect ratio
            backgroundPosition: 'top center',
            filter: 'brightness(0) invert(1)', // Makes the pattern white
            transform: 'scaleY(-1)', // Rotates the pattern to fix to top
          }}
        ></div>

        {/* Bottom pattern border */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8" // Reduced from h-12 to h-8
          style={{
            backgroundImage: `url(${patternImage})`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%', // This maintains the aspect ratio
            backgroundPosition: 'bottom center',
            filter: 'brightness(0) invert(1)', // Makes the pattern white
          }}
        ></div>
      </div>
    </>
  );
};

export default PatternBackground;
