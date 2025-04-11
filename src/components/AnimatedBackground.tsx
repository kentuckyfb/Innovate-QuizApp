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
        delay,
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
  // Define a single color for all icons - using yellow from the theme
  const iconColor = theme.colors.secondary.main;
  const iconGlowColor = theme.colors.secondary.light;

  // Create an array of icon data - distributed across the screen with varied sizes
  const icons = [
    // Left side - Sun moved lower
    {
      Icon: Sun,
      top: 20,
      left: 8,
      size: 36,
      color: iconColor,
      glowColor: iconGlowColor,
      rotationSpeed: 0.5,
      floatAmount: 15,
    },
    
    // Middle area - top
    {
      Icon: Sparkles,
      top: 12,
      left: 52,
      size: 18,
      color: iconColor,
      glowColor: iconGlowColor,
      rotationSpeed: 1.2,
      floatAmount: 10,
    },
    
    // Right side - top
    {
      Icon: Gift,
      top: 15,
      left: 88,
      size: 30,
      color: iconColor,
      glowColor: iconGlowColor,
      rotationSpeed: 0.9,
      floatAmount: 13,
    },
    
    // Left side - bottom
    {
      Icon: Sparkles,
      top: 80,
      left: 12,
      size: 24,
      color: iconColor,
      glowColor: iconGlowColor,
      rotationSpeed: 0.7,
      floatAmount: 12,
    },
    
    // Middle area - bottom
    {
      Icon: Sun,
      top: 72,
      left: 65,
      size: 22,
      color: iconColor,
      glowColor: iconGlowColor,
      rotationSpeed: 0.6,
      floatAmount: 8,
    },
    
    // Right side - bottom
    {
      Icon: Gift,
      top: 85,
      left: 85,
      size: 16,
      color: iconColor,
      glowColor: iconGlowColor,
      rotationSpeed: 1.1,
      floatAmount: 9,
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