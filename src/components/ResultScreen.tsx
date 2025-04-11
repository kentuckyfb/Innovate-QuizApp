// src/components/ResultScreen.tsx
import { motion } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';

import { ShareableImage } from './ShareableImage';
import {
  Share2,
  RotateCcw,
  Download,
  Clock,
  UtensilsCrossed,
  Trophy,
  Music,
  Sparkles,
  Users,
  Shirt,
  Coffee,
  Heart,
  Flame,
  Target,
  Palette,
  BookOpen,
} from 'lucide-react';
import { useEffect } from 'react';

// Remove image imports and use public URLs instead
import { theme } from '../lib/theme';

// Updated personality types with public folder image paths
const personalityDetails = {
  timekeeper: {
    title: 'The Timekeeper ⏳ ',
    description:
      "Timing is everything for you. When it's Nekath time, you're there—no stress, just hitting every ritual right on the dot.",
    icon: Clock,
    imagePath: '/personalities/The-Timekeeper.png',
    color: 'purple-800',
  },
  creativeSparkle: {
    title: 'The Creative Spark 🎨 ',
    description:
      "You're the reason everything looks so good. Decor, vibes, the whole aesthetic—Avurudu's your canvas. Your artistic touch transforms ordinary spaces into magical settings for celebrations.",
    icon: Palette,
    imagePath: '/personalities/The-Creative-Spark.png',
    color: 'purple-700',
  },
  masterChef: {
    title: 'The Master Chef 🍛 ',
    description:
      "Did someone say Gordon Ramsay? The kitchen is your kingdom. You make sure everyone's fed—and it always tastes like magic.",
    icon: UtensilsCrossed,
    imagePath: '/personalities/The-Master-chef.png',
    color: 'purple-600',
  },
  gamemaster: {
    title: 'The Game Master 🎯 ',
    description:
      "You bring the hype! From Kotta Pora to Olinda Keliya, no one's sitting out on your watch. Your competitive spirit and organization skills make traditional games the highlight of every celebration.",
    icon: Target,
    imagePath: '/personalities/The-Game-Master.png',
    color: 'purple-700',
  },
  harmonyKeeper: {
    title: 'Just A Chill Guy ☮️ ',
    description:
      "You're just here to vibe. No stress, no drama—just good times. You keep everything low-key, you're just a chill guy like that.",
    icon: Sparkles,
    imagePath: '/personalities/The-Chill-Guy.jpeg',
    color: 'purple-900',
  },
  familyConnector: {
    title: 'The Family Connector ❤️ ',
    description:
      "You're the glue that holds the fam together. Whether it's vibing, planning, or just spreading love, you keep the crew tight and make Avurudu feel real.",
    icon: Heart,
    imagePath: '/personalities/The-Family-Connector.png',
    color: 'purple-600',
  },
  celebrationFirecracker: {
    title: 'The Celebration Firecracker 🔥 ',
    description:
      "You're the party's heart. You keep the energy high and the good times rolling all day long. Your enthusiasm and joy are contagious, making Avurudu celebrations vibrant and unforgettable.",
    icon: Flame,
    imagePath: '/personalities/The-Celebration-Firecracker.png',
    color: 'purple-500',
  },
  knowledgeKeeper: {
    title: 'The Knowledge Keeper 📚 ',
    description:
      "When people have questions, you've got answers, you're the squad's walking encyclopedia.",
    icon: BookOpen,
    imagePath: '/personalities/Knowledge-keeper.png',
    color: 'purple-800',
  },
};

const capitalizeFirstLetter = (string: string): string => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export function ResultScreen() {
  const { result, userInfo, resetQuiz } = useQuizStore();

  // Create our own confetti effect with DOM elements and CSS animations
  useEffect(() => {
    // Create confetti elements
    const createConfetti = () => {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '1000';
      document.body.appendChild(container);

      // Colors for the confetti - include yellow and purple
      const colors = [
        theme.colors.primary.light,
        theme.colors.primary.main,
        theme.colors.primary.dark,
        theme.colors.secondary.light,
        theme.colors.secondary.main,
        theme.colors.secondary.dark,
      ];

      // Create fewer confetti pieces for better performance
      for (let i = 0; i < 30; i++) {
        // Reduced from 50 to 30
        const confetti = document.createElement('div');

        // Random size between 5px and 10px
        const size = Math.random() * 5 + 5;

        confetti.style.position = 'absolute';
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';

        // Random starting position
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = `-${size}px`;

        // Add animation
        confetti.style.animation = `
          fall ${Math.random() * 3 + 2}s linear forwards,
          sway ${Math.random() * 2 + 2}s ease-in-out infinite alternate
        `;

        // Set transform origin for better sway
        confetti.style.transformOrigin = 'center';

        container.appendChild(confetti);

        // Remove after animation completes
        setTimeout(() => {
          confetti.remove();
        }, 5000);
      }

      // Clean up the container after all confetti are gone
      setTimeout(() => {
        container.remove();
      }, 5500);
    };

    // Call once when component mounts
    createConfetti();

    // Define the animations in a style element
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fall {
        to {
          transform: translateY(100vh);
        }
      }
      
      @keyframes sway {
        from {
          transform: translateX(-5vw);
        }
        to {
          transform: translateX(5vw);
        }
      }
    `;
    document.head.appendChild(style);

    // Clean up
    return () => {
      style.remove();
    };
  }, []);

  if (!result || !userInfo) return null;

  // Add a safety check to handle undefined personality - use first personality as default if result not found
  const personality = personalityDetails[result as keyof typeof personalityDetails] || 
    personalityDetails.timekeeper;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'My Avurudu Personality',
        text: `I am ${personality.title}! Take the quiz to discover your Innovate Avurudu personality!`,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback for browsers that don't support sharing
      navigator.clipboard
        .writeText(
          `I am ${personality.title}! Take the quiz to discover your Innovate Avurudu personality! ${window.location.href}`
        )
        .then(() => {
          alert('Link copied to clipboard! Share with your friends!');
        });
    }
  };

  const downloadImage = () => {
    // Just alert for now
    alert('This feature would download a shareable image of your result.');
  };

  // Function to truncate description if too long
  const getTruncatedDescription = (text: string, maxLength = 140) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-2">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md mx-auto px-4 flex flex-col"
        style={{ maxHeight: 'calc(100vh - 140px)' }}
      >
        <motion.h1
          variants={itemVariants}
          className="text-xl sm:text-2xl font-bold mb-3 text-center"
          style={{ color: theme.colors.secondary.main }}
        >
          {capitalizeFirstLetter(userInfo.name)}, you are...
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br rounded-xl p-4 sm:p-5 mb-4 shadow-lg
                  border-2 relative overflow-hidden flex-1 flex flex-col"
          style={{
            background: `linear-gradient(to bottom right, ${theme.colors.primary.light}, ${theme.colors.primary.main})`,
            borderColor: theme.colors.secondary.light,
          }}
        >
          {/* Character image - display full image in circle */}
          <div className="mb-3 flex justify-center flex-shrink-0">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden"
                 style={{ background: theme.colors.primary.dark }}>
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: [0, -3, 0],
                }}
                transition={{
                  scale: { duration: 0.5 },
                  opacity: { duration: 0.5 },
                  y: {
                    delay: 0.5,
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  },
                }}
                src={personality.imagePath}
                alt={personality.title}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>

          <h2
            className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 relative z-10 text-center"
            style={{ color: theme.colors.secondary.light }}
          >
            {personality.title}
          </h2>

          {/* Description with max height and overflow scrolling if needed */}
          <div className="overflow-y-auto flex-1 mb-2">
            <p
              className="text-sm sm:text-base relative z-10 text-center"
              style={{ color: theme.colors.primary.contrastText }}
            >
              {getTruncatedDescription(personality.description, 200)}
            </p>
          </div>
        </motion.div>

        {/* Action buttons - updated to be centered with flex and changed grid to flex */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center space-x-4 w-full mb-2"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: theme.colors.secondary.dark,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="flex flex-col items-center justify-center gap-1 px-4 py-2 text-white
                     rounded-lg font-medium shadow-md
                     transition-all duration-300 text-xs sm:text-sm"
            style={{ backgroundColor: theme.colors.secondary.main }}
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            Share
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#e9e9e9' }}
            whileTap={{ scale: 0.95 }}
            onClick={resetQuiz}
            className="flex flex-col items-center justify-center gap-1 px-4 py-2 bg-gray-100 text-gray-700
                     rounded-lg font-medium shadow-md hover:bg-gray-200
                     transition-all duration-300 text-xs sm:text-sm"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            Retry
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}