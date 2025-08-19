'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Download, Pause, Play, Share2, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/terminal-utils';

interface MusicPlayerProps {
  audioUrl: string | null;
  title?: string;
  onDownload?: () => void;
  onShare?: () => void;
}

export function MusicPlayer({
  audioUrl,
  title,
  onDownload,
  onShare,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const vol = Number(e.target.value);
    audio.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!audioUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="-translate-x-1/2 fixed bottom-8 left-1/2 z-50 w-full max-w-2xl px-4"
        exit={{ opacity: 0, y: 20 }}
        initial={{ opacity: 0, y: 20 }}
      >
        <div className="terminal-player border border-[var(--term-accent)] bg-[var(--term-bg)] p-4 shadow-[0_0_20px_var(--term-accent)]">
          <audio ref={audioRef} src={audioUrl} />

          {title && (
            <div className="mb-4 border-b border-[var(--term-dim)] pb-2">
              <div className="text-xs text-[var(--term-accent)]">NOW PLAYING:</div>
              <div className="text-[var(--term-accent)] font-bold text-sm uppercase">{title}</div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                className={cn(
                  'terminal-play-btn flex h-10 w-10 items-center justify-center',
                  'border border-[var(--term-accent)] text-[var(--term-accent)]',
                  'hover:bg-[var(--term-accent)] hover:text-[var(--term-bg)]',
                  'transition-colors'
                )}
                onClick={togglePlayPause}
                style={{ padding: '0' }}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="ml-0.5 h-4 w-4" />
                )}
              </button>

              <div className="flex-1 space-y-2">
                <div className="relative h-2 w-full border border-[var(--term-dim)] bg-[var(--term-bg)]">
                  <div
                    className="absolute top-0 left-0 h-full bg-[var(--term-accent)]"
                    style={{
                      width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                    }}
                  />
                  <input
                    className="terminal-slider absolute top-0 left-0 h-2 w-full cursor-pointer"
                    max={duration || 0}
                    min="0"
                    onChange={handleSeek}
                    type="range"
                    value={currentTime}
                    style={{
                      '--track-color': 'var(--term-dim)',
                      '--thumb-color': 'var(--term-accent)',
                    } as React.CSSProperties}
                  />
                </div>
                <div className="flex justify-between text-xs text-[var(--term-fg)] pt-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="terminal-icon-btn flex h-8 w-8 items-center justify-center transition-colors"
                  onClick={toggleMute}
                  style={{ 
                    padding: '0', 
                    border: '1px solid var(--term-accent)', 
                    background: 'transparent',
                    color: 'var(--term-accent)'
                  }}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>

                <div className="relative h-1 w-20 border border-[var(--term-dim)] bg-[var(--term-bg)]">
                  <div
                    className="absolute top-0 left-0 h-full bg-[var(--term-accent)]"
                    style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                  />
                  <input
                    className="terminal-slider absolute top-0 left-0 h-1 w-full cursor-pointer"
                    max="1"
                    min="0"
                    onChange={handleVolumeChange}
                    step="0.1"
                    type="range"
                    value={isMuted ? 0 : volume}
                    style={{
                      '--track-color': 'var(--term-dim)',
                      '--thumb-color': 'var(--term-accent)',
                    } as React.CSSProperties}
                  />
                </div>

                {onShare && (
                  <button
                    className="terminal-icon-btn flex h-8 w-8 items-center justify-center transition-colors"
                    onClick={onShare}
                    title="Share"
                    style={{ 
                      padding: '0', 
                      border: '1px solid var(--term-accent)', 
                      background: 'transparent',
                      color: 'var(--term-accent)'
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                )}

                {onDownload && (
                  <button
                    className="terminal-icon-btn flex h-8 w-8 items-center justify-center transition-colors"
                    onClick={onDownload}
                    title="Download"
                    style={{ 
                      padding: '0', 
                      border: '1px solid var(--term-accent)', 
                      background: 'transparent',
                      color: 'var(--term-accent)'
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}