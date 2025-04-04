import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Sparkles, Gift } from 'lucide-react';
import { theme } from '../lib/theme';

// Animation variants for different movement patterns
const floatingAnimation = {
  y: {
    duration: 4,
    repeat: Infinity,
    repeatType: 'mirror' as const,
    ease: 'easeInOut' as const,
  },
  rotate: {
    duration: 12,
    repeat: Infinity,
    ease: 'linear' as const,
  },
  opacity: {
    duration: 3,
    repeat: Infinity,
    repeatType: 'mirror' as const,
    ease: 'easeInOut' as const,
  },
};

// IconElement component with animation capabilities
const IconElement = ({
  Icon,
  top,
  left,
  delay = 0,
  size = 24,
  color,
  rotationSpeed = 1,
  floatAmount = 10,
  glowColor,
}) => (
  <motion.div
    className="absolute"
    style={{
      top: `${top}%`,
      left: `${left}%`,
      color,
    }}
    initial={{ opacity: 0 }}
    animate={{
      opacity: [0.1, 0.35, 0.1], // Pulsing opacity animation
      y: [0, floatAmount, 0],
      rotate: [0, 360 * rotationSpeed],
      scale: [1, 1.05, 1], // Subtle scale animation for enhanced glow effect
    }}
    transition={{
      opacity: {
        ...floatingAnimation.opacity,
        delay: delay + 0.2,
      },
      scale: {
        ...floatingAnimation.opacity,
        delay: delay,
        duration: 2.5,
      },
      y: {
        ...floatingAnimation.y,
        delay,
      },
      rotate: {
        ...floatingAnimation.rotate,
        duration: 12 / rotationSpeed,
        delay,
      },
    }}
  >
    <div className="relative">
      {/* Glow effect layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          filter: `blur(4px) brightness(1.2)`,
          opacity: 0.8,
          transform: 'scale(1.2)',
          color: glowColor || color,
        }}
      >
        <Icon size={size} strokeWidth={2} />
      </div>

      {/* Main icon */}
      <div className="relative z-10">
        <Icon
          size={size}
          strokeWidth={1.5}
          style={{
            filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.4))',
          }}
        />
      </div>
    </div>
  </motion.div>
);

// Main Background Component
const AnimatedBackground = () => {
  // Create an array of icon data - REDUCED from 25 to 8 icons
  const icons = [
    // Strategic corner placements
    {
      Icon: Sun,
      top: 5,
      left: 10,
      size: 32,
      color: theme.colors.secondary.light,
      glowColor: theme.colors.secondary.main,
      rotationSpeed: 0.5,
      floatAmount: 15,
    },

    // A few strategically placed elements that won't interfere with content
    {
      Icon: Sparkles,
      top: 48,
      left: 5,
      size: 22,
      color: theme.colors.primary.main,
      glowColor: theme.colors.primary.light,
      rotationSpeed: 1.2,
      floatAmount: 10,
    },

    {
      Icon: Gift,
      top: 65,
      left: 2,
      size: 26,
      color: theme.colors.primary.light,
      glowColor: theme.colors.primary.main,
      rotationSpeed: 0.9,
      floatAmount: 13,
    },
  ];

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {icons.map((iconProps, index) => (
        <IconElement
          key={`icon-${index}`}
          {...iconProps}
          delay={index * 0.2} // Increased stagger delay for better distribution
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
