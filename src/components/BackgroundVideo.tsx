import React, { useRef, useEffect } from 'react';
import { BackgroundVideoSettings } from '../types';

interface BackgroundVideoProps {
  settings: BackgroundVideoSettings;
  onUpdateSettings: (newSettings: Partial<BackgroundVideoSettings>) => void;
  isDarkMode: boolean;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  settings,
  isDarkMode,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideoMode = settings.mode === 'video' && settings.enabled;

  useEffect(() => {
    if (videoRef.current) {
      if (isVideoMode) {
        videoRef.current.playbackRate = settings.playbackSpeed || 1;
        videoRef.current.muted = settings.muted;
        videoRef.current.loop = settings.loop;
        videoRef.current
          .play()
          .catch(() => {
            // Autoplay policy fallback
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
            }
          });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVideoMode, settings.videoUrl, settings.playbackSpeed, settings.muted, settings.loop]);

  return (
    <div
      id="background-ambient-container"
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
    >
      {isVideoMode && settings.videoUrl ? (
        <>
          {/* Active Animated Video Element */}
          <video
            ref={videoRef}
            src="https://res.cloudinary.com/vktnybku/video/upload/v1789476285/ai-generations_minimax-h3_9b9fad85-d318-496d-81a1-15924201a628-9sqUmP.mp4"
            autoPlay
            playsInline
            muted={settings.muted}
            loop={settings.loop}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: settings.opacity }}
          />

          {/* When makeBackgroundInvisible is false, subtle backdrop tint is applied.
              When true, background is 100% invisible so animation video is crystal clear */}
          {!settings.makeBackgroundInvisible && (
            <div
              className={`absolute inset-0 transition-colors duration-500 ${
                isDarkMode ? 'bg-zinc-950/70' : 'bg-slate-50/70'
              }`}
            />
          )}
        </>
      ) : (
        /* OPTION 1: DEFAULT LUXURY FABRIC BOUTIQUE BACKGROUND */
        <div
          id="default-background-pattern"
          className={`absolute inset-0 w-full h-full transition-colors duration-500 ${
            isDarkMode ? 'bg-zinc-950' : 'bg-stone-50'
          }`}
        >
          {/* Subtle Luxury Textile Weave Geometric Grid */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.06] dark:opacity-[0.14]"
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
            viewBox="0 0 60 60"
          >
            <path
              d="M30 0l30 30-30 30L0 30zM0 0h60v60H0z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle cx="30" cy="30" r="4" fill="currentColor" opacity="0.5" />
          </svg>

          {/* Soft Ambient Gold/Amber Radial Glows */}
          <div
            className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full filter blur-[140px] pointer-events-none transition-opacity duration-700 ${
              isDarkMode ? 'bg-amber-500/10' : 'bg-amber-200/30'
            }`}
          />
          <div
            className={`absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full filter blur-[130px] pointer-events-none transition-opacity duration-700 ${
              isDarkMode ? 'bg-yellow-600/5' : 'bg-amber-100/40'
            }`}
          />
        </div>
      )}
    </div>
  );
};
