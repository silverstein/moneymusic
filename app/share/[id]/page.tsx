'use client';

import { motion } from 'framer-motion';
import { DollarSign, Download, Home, Share2, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { MusicPlayer } from '@/components/music-player';
import { base64ToBlob, shareManager } from '@/lib/share';

export default function SharePage() {
  const params = useParams();
  const shareId = params.id as string;
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [track, setTrack] =
    useState<ReturnType<typeof shareManager.getSharedTrack>>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shareId) {
      const sharedTrack = shareManager.getSharedTrack(shareId);
      if (sharedTrack) {
        // Check if we have an R2 URL first
        if (sharedTrack.audioUrl) {
          setAudioUrl(sharedTrack.audioUrl);
          setTrack(sharedTrack);
        } else if (sharedTrack.audioData) {
          // Fallback to base64 data if no R2 URL
          const blob = base64ToBlob(sharedTrack.audioData);
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          setTrack(sharedTrack);
        }
      }
      setLoading(false);
    }
  }, [shareId]);

  const handleDownload = async () => {
    if (!(audioUrl && track)) return;

    try {
      // If it's an R2 URL, fetch and download
      if (audioUrl.startsWith('http')) {
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${track.title.replace(/\s+/g, '-')}-wealthwave.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Local blob URL, download directly
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = `${track.title.replace(/\s+/g, '-')}-wealthwave.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      toast.success('Track downloaded!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download track');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-zinc-400">Loading track...</p>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 font-bold text-2xl">Track Not Found</h1>
          <p className="mb-8 text-zinc-400">
            This track may have expired or been removed.
          </p>
          <Link
            className="gold-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-black transition-transform hover:scale-105"
            href="/"
          >
            <Home className="h-4 w-4" />
            Create Your Own
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid rgba(251, 191, 36, 0.2)',
          },
        }}
      />

      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 animate-pulse-slow rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 animate-pulse-slow rounded-full bg-emerald-500/10 blur-3xl delay-1000" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-12">
        <motion.header
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
        >
          <Link className="mb-8 inline-block" href="/">
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="h-8 w-8 text-amber-500" />
              <h1 className="gold-text font-bold text-4xl">WealthWave</h1>
              <TrendingUp className="h-8 w-8 text-emerald-500" />
            </div>
          </Link>
        </motion.header>

        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
        >
          <div className="glass mb-8 rounded-2xl p-8">
            <h2 className="gold-text mb-4 font-bold text-3xl">{track.title}</h2>

            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Duration</span>
                <span>{Math.floor(track.duration / 60_000)} minutes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Created</span>
                <span>{new Date(track.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Plays</span>
                <span className="font-semibold text-amber-500">
                  {track.playCount || 1}
                </span>
              </div>
            </div>

            <div className="mb-8 rounded-lg bg-zinc-900 p-4">
              <p className="mb-2 text-sm text-zinc-400">Prompt:</p>
              <p className="text-sm italic">{track.prompt}</p>
            </div>

            <div className="flex gap-4">
              <button
                className="gold-gradient flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-black transition-transform hover:scale-105"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download MP3
              </button>
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-500/50 px-6 py-3 font-semibold text-amber-500 transition-colors hover:bg-amber-500/10"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Copy Link
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="mb-4 text-zinc-400">
              Want to create your own wealth mindset music?
            </p>
            <Link
              className="inline-flex items-center gap-2 text-amber-500 transition-colors hover:text-amber-400"
              href="/"
            >
              <Home className="h-4 w-4" />
              Generate Your Track
            </Link>
          </div>
        </motion.div>
      </div>

      {audioUrl && (
        <MusicPlayer
          audioUrl={audioUrl}
          onDownload={handleDownload}
          title={track.title}
        />
      )}
    </div>
  );
}
