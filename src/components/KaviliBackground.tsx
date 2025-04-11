import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { theme } from '../lib/theme';
import { useBackgroundStore } from '../store/backgroundStore';

// Import kavili images - removed kavili3
import kavili1 from '../assets/kavili-1.png';
import kavili2 from '../assets/kavili-2.png';

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

  // Array of kavili images - removed kavili3
  const kaviliImages = [kavili1, kavili2];

  // Generate a list of kavili elements with equal distribution
  const generateKaviliElements = (seed: number) => {
    // Use the seed for predictable randomness
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // Total 4 elements (2 of each image type)
    const totalElements = 4;
    const elements = [];

    // Define strategic positions with 2 at top and 2 at bottom
    // Staying away from the center to avoid overlap with central image
    const strategicPositions = [
      // Top positions
      { top: 15, left: 25 },  // Top-left
      { top: 12, left: 75 },  // Top-right
      
      // Bottom positions
      { top: 85, left: 30 },  // Bottom-left
      { top: 88, left: 70 },  // Bottom-right
    ];

    // Shuffle positions array to get random subset using seeded random
    const shuffledPositions = [...strategicPositions].sort(
      () => seededRandom(seed + 1) - 0.5
    );
    
    // Create elements with equal distribution of images
    for (let i = 0; i < totalElements; i++) {
      const position = shuffledPositions[i] || {
        top: seededRandom(seed + i * 10) * 80 + 10,
        left: seededRandom(seed + i * 20) * 80 + 10,
      };

      // Add slight randomization to the strategic positions
      const top = position.top + (seededRandom(seed + i) * 6 - 3);
      const left = position.left + (seededRandom(seed + i * 30) * 6 - 3);

      // Determine image index to ensure equal distribution
      // For 4 elements total (2 of each image type)
      const imageIndex = Math.floor(i / 2);

      // Calculate a responsive size - slightly larger sizes for better visibility
      const size = 22 + seededRandom(seed + i * 50) * 22; // 22-44px

      // Generate varied animation properties
      const rotationSpeed = 0.2 + seededRandom(seed + i * 60) * 0.4; // Slower rotation for more natural look
      const floatAmount = 6 + seededRandom(seed + i * 70) * 6; // 6-12px float

      elements.push({
        imageSrc: kaviliImages[imageIndex],
        top,
        left,
        size,
        rotationSpeed,
        floatAmount,
        key: `kavili-${i}`,
      });
    }

    // Shuffle the array once more to randomize positions while maintaining equal distribution
    return elements.sort(() => seededRandom(seed + 100) - 0.5);
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
          delay={index * 0.4} // Stagger for variation
        />
      ))}
    </div>
  );
};

export default KaviliBackground;