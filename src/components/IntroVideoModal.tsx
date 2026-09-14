import React, { useRef, useState, useEffect } from 'react';
import { IntroVideoSettings } from '../types';
import { Volume2, VolumeX, ArrowRight, Play } from 'lucide-react';

interface IntroVideoModalProps {
  settings: IntroVideoSettings;
  isOpen: boolean;
  onClose: () => void;
}

export const IntroVideoModal: React.FC<IntroVideoModalProps> = ({
  settings,
  isOpen,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(settings.autoCloseSeconds || 6);

  useEffect(() => {
    if (!isOpen) return;

    let timer: any = null;
    const duration = settings.autoCloseSeconds || 6;
    let elapsed = 0;

    timer = setInterval(() => {
      elapsed += 0.1;
      const left = Math.max(0, Math.ceil(duration - elapsed));
      setRemainingTime(left);
      setProgress(Math.min(100, (elapsed / duration) * 100));

      if (elapsed >= duration) {
        clearInterval(timer);
        onClose();
      }
    }, 100);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, settings.autoCloseSeconds, onClose]);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // In case autoplay fails
      });
    }
  }, [isOpen]);

  if (!isOpen || !settings.enabled) return null;

  return (
    <div
      id="intro-video-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-700"
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        src={settings.videoUrl}
        autoPlay
        playsInline
        muted={isMuted}
        onEnded={onClose}
        className="absolute inset-0 w-full h-full object-cover opacity-85"
      />

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center text-white flex flex-col items-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold tracking-widest uppercase mb-6 backdrop-blur-md animate-pulse">
          <span>Official Store Intro</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>Venus Chowk, Okara</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-white mb-4 drop-shadow-2xl">
          {settings.title || 'ABID GARMENTS'}
        </h1>

        <p className="text-sm sm:text-lg text-zinc-200 font-light max-w-lg mb-8 leading-relaxed drop-shadow">
          {settings.subtitle || 'Excellence in Men’s Traditional Fabrics, Pure Boski & Designer Wear'}
        </p>

        {/* Progress Bar & Countdown */}
        <div className="w-full max-w-xs mb-8 flex flex-col items-center gap-2">
          <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="bg-gradient-to-r from-amber-400 to-amber-600 h-full transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-zinc-400 font-medium tracking-wide">
            Entering store in {remainingTime}s...
          </span>
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-4">
          <button
            id="intro-unmute-btn"
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.muted = !isMuted;
                setIsMuted(!isMuted);
              }
            }}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {settings.allowSkip && (
            <button
              id="intro-skip-btn"
              onClick={onClose}
              className="group flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-sm tracking-wide shadow-xl hover:shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Enter Abid Garments</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
