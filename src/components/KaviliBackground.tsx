import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { theme } from '../lib/theme';
import { useBackgroundStore } from '../store/backgroundStore';

// Import kavili images
import kavili1 from '../assets/kavili-1.png';
import kavili2 from '../assets/kavili-2.png';
import kavili3 from '../assets/kavili-3.png';
import kavili4 from '../assets/kavili-4.png';

// Animation variants for different movement patterns with improved smoothness
const floatingAnimation = {
  y: {
    duration: 5,
    repeat: Infinity,
    repeatType: 'mirror' as const,
    ease: 'easeInOut' as const,
  },
  opacity: {
    duration: 4,
    repeat: Infinity,
    repeatType: 'mirror' as const,
    ease: 'easeInOut' as const,
  },
};

// KaviliElement component with truly continuous rotation
const KaviliElement = ({
  imageSrc,
  top,
  left,
  delay = 0,
  size = 20,
  rotationSpeed = 1,
  floatAmount = 8,
}) => {
  // Calculate a random starting rotation between 0-360 degrees
  const initialRotation = Math.random() * 360;

  return (
    <motion.div
      className="absolute"
      style={{
        top: `${top}%`,
        left: `${left}%`,
      }}
      initial={{ opacity: 0, rotate: initialRotation }}
      animate={{
        opacity: [0.3, 0.7, 0.3], // Increased opacity from [0.2, 0.6, 0.2]
        y: [0, floatAmount, 0],
        scale: [1, 1.06, 1],
      }}
      transition={{
        opacity: {
          ...floatingAnimation.opacity,
          delay: delay + 0.5,
        },
        scale: {
          ...floatingAnimation.opacity,
          delay: delay + 0.2,
          duration: 3 + Math.random() * 2,
        },
        y: {
          ...floatingAnimation.y,
          delay,
          duration: 4 + Math.random() * 3,
        },
      }}
    >
      {/* Add continuous rotation as a separate style with keyframes */}
      <div
        className="relative"
        style={{
          animation: `spin${Math.floor(rotationSpeed * 100)} ${
            25 - rotationSpeed * 10
          }s linear infinite`,
        }}
      >
        {/* Subtle glow effect layer */}
        <div
          className="absolute inset-0 z-0"
          style={{
            filter: `blur(2px) brightness(1.2)`,
            opacity: 0.6, // Increased glow opacity from 0.5
            transform: 'scale(1.12)',
          }}
        >
          <img
            src={imageSrc}
            alt="Kavili"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Main image */}
        <div className="relative z-10">
          <img
            src={imageSrc}
            alt="Kavili"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.4))', // Slightly increased shadow opacity
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Main Background Component
const KaviliBackground = () => {
  // Get the background seed from the store
  const { backgroundSeed } = useBackgroundStore();

  // Array of kavili images to use
  const kaviliImages = [kavili1, kavili2, kavili3, kavili4];

  // Generate a list of kavili elements optimized for mobile
  const generateKaviliElements = (seed: number) => {
    // Use the seed for predictable randomness
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // Increased from 3 to 5 elements
    const totalElements = 5;
    const elements = [];

    // Define some strategic positions that work well on mobile
    // These positions are designed to avoid the center content area
    const mobilePositions = [
      { top: 10, left: 15 },
      { top: 15, left: 85 },
      { top: 75, left: 20 },
      { top: 85, left: 80 },
      { top: 25, left: 10 },
      { top: 35, left: 88 },
      { top: 60, left: 12 },
      { top: 68, left: 90 },
    ];

    // Shuffle positions array to get random subset using seeded random
    const shuffledPositions = [...mobilePositions].sort(
      () => seededRandom(seed + 1) - 0.5
    );

    // Create kavili elements at those positions
    for (let i = 0; i < totalElements; i++) {
      const position = shuffledPositions[i] || {
        top: seededRandom(seed + i * 10) * 80 + 10,
        left: seededRandom(seed + i * 20) * 80 + 10,
      };

      // Add slight randomization to the strategic positions
      const top = position.top + (seededRandom(seed + i) * 6 - 3);
      const left = position.left + (seededRandom(seed + i * 30) * 6 - 3);

      // Select a random image from our array using seeded random
      const imageSrc =
        kaviliImages[
          Math.floor(seededRandom(seed + i * 40) * kaviliImages.length)
        ];

      // Calculate a responsive size - REDUCED SIZE RANGE
      const size = 20 + seededRandom(seed + i * 50) * 20; // 20-40px (reduced from 30-60px)

      // Generate varied animation properties
      const rotationSpeed = 0.2 + seededRandom(seed + i * 60) * 0.4; // Slower rotation for more natural look
      const floatAmount = 6 + seededRandom(seed + i * 70) * 6; // 6-12px float (reduced from 8-16px)

      elements.push({
        imageSrc,
        top,
        left,
        size,
        rotationSpeed,
        floatAmount,
        key: `kavili-${i}`,
      });
    }

    return elements;
  };

  // Create the array of kavili elements using the background seed
  const kaviliElements = useMemo(
    () => generateKaviliElements(backgroundSeed),
    [backgroundSeed]
  );

  // Generate a set of unique CSS keyframes for each rotation speed
  const generateRotationKeyframes = () => {
    let keyframes = '';

    // Create a range of rotation speeds
    const speeds = [20, 25, 30, 35, 40, 45, 50, 55, 60];

    speeds.forEach((speed) => {
      keyframes += `
        @keyframes spin${speed} {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
    });

    return keyframes;
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Add the rotation keyframes */}
      <style>{generateRotationKeyframes()}</style>

      {/* Render the kavili elements */}
      {kaviliElements.map((props, index) => (
        <KaviliElement
          key={props.key}
          imageSrc={props.imageSrc}
          top={props.top}
          left={props.left}
          size={props.size}
          rotationSpeed={props.rotationSpeed}
          floatAmount={props.floatAmount}
          delay={index * 0.4} // Greatly increased stagger for variation
        />
      ))}
    </div>
  );
};

export default KaviliBackground;