import { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Share2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { theme } from '../lib/theme';

// This component will handle generating a shareable image from the results
export const ShareableImage = ({
  personality,
  userName,
  onImageGenerated,
}: {
  personality: any;
  userName: string;
  onImageGenerated: (dataUrl: string) => void;
}) => {
  const shareCardRef = useRef<HTMLDivElement>(null);

  // Generate the image when the component mounts
  useEffect(() => {
    const generateImage = async () => {
      if (shareCardRef.current) {
        try {
          // Wait for images to load
          await new Promise((resolve) => setTimeout(resolve, 500));

          const canvas = await html2canvas(shareCardRef.current, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: theme.colors.primary.dark,
            logging: false,
          });

          const dataUrl = canvas.toDataURL('image/png');
          onImageGenerated(dataUrl);
        } catch (error) {
          console.error('Error generating image:', error);
        }
      }
    };

    generateImage();
  }, [personality, userName, onImageGenerated]);

  return (
    <div
      ref={shareCardRef}
      className="share-card"
      style={{
        position: 'absolute',
        left: '-9999px', // Position off-screen while generating
        width: '1080px', // Instagram-friendly dimensions
        height: '1080px',
        padding: '40px',
        background: `linear-gradient(135deg, ${theme.colors.primary.light}, ${theme.colors.primary.dark})`,
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Logo/Branding */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          fontSize: '28px',
          fontWeight: 'bold',
          color: theme.colors.secondary.light,
        }}
      >
        Avurudu Personality Quiz
      </div>

      {/* Decorative elements */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: theme.colors.secondary.main,
          opacity: 0.2,
        }}
      ></div>

      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '40px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: theme.colors.secondary.light,
          opacity: 0.15,
        }}
      ></div>

      {/* Main content */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: theme.colors.secondary.main,
            marginBottom: '20px',
          }}
        >
          {userName} is...
        </h1>

        <h2
          style={{
            fontSize: '60px',
            fontWeight: 'bold',
            color: theme.colors.secondary.light,
            marginBottom: '30px',
          }}
        >
          {personality.title}
        </h2>
      </div>

      {/* Character image */}
      <div
        style={{
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: `8px solid ${theme.colors.secondary.main}`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          marginBottom: '40px',
        }}
      >
        <img
          src={personality.imagePath}
          alt={personality.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Description */}
      <div
        style={{
          maxWidth: '800px',
          textAlign: 'center',
          fontSize: '30px',
          lineHeight: '1.4',
          color: theme.colors.primary.contrastText,
        }}
      >
        {personality.description}
      </div>

      {/* Website URL */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          right: '30px',
          fontSize: '24px',
          fontWeight: 'bold',
          color: theme.colors.secondary.light,
        }}
      >
        www.atlas.lk
      </div>
    </div>
  );
};

// Function to update the ResultScreen component
export const updateResultScreenWithShareImage = () => {
  // This is the new implementation for the downloadImage function
  const downloadImage = (dataUrl: string, personality: any) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `avurudu-personality-${personality.title
      .replace(/\s+/g, '-')
      .toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // This is the new implementation for the handleShare function with image
  const shareImage = async (dataUrl: string, personality: any) => {
    try {
      // First try native sharing (mobile devices)
      if (navigator.share) {
        // For native sharing, we need to convert the dataUrl to a File
        const blob = await fetch(dataUrl).then((res) => res.blob());
        const file = new File([blob], 'avurudu-personality.png', {
          type: 'image/png',
        });

        await navigator.share({
          title: 'My Avurudu Personality',
          text: `I am ${personality.title}! Take the quiz to discover your Avurudu personality!`,
          url: window.location.href,
          files: [file],
        });
        return;
      }

      // Fallback - copy link and prompt to save image
      navigator.clipboard.writeText(
        `I am ${personality.title}! Take the quiz to discover your Avurudu personality! ${window.location.href}`
      );

      alert(
        'Link copied to clipboard! You can also download the image to share on social media.'
      );
      downloadImage(dataUrl, personality);
    } catch (error) {
      console.error('Error sharing:', error);
      // Final fallback - just copy link
      navigator.clipboard.writeText(
        `I am ${personality.title}! Take the quiz to discover your Avurudu personality! ${window.location.href}`
      );
      alert(
        'Link copied to clipboard! You can also download the image to share on social media.'
      );
    }
  };

  return { downloadImage, shareImage };
};
