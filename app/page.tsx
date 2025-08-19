'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  DollarSign,
  Library,
  Loader2,
  Palette,
  Play,
  Share2,
  Sparkles,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { CraftStudio } from '@/components/craft-studio';
import { MusicPlayer } from '@/components/music-player';
import { ScenarioCard } from '@/components/scenario-card';
import { TerminalLayout } from '@/components/terminal-layout';
import { TerminalContributionGraph } from '@/components/terminal-contribution-graph';
import { AsciiDivider, AsciiLogo } from '@/components/terminal-ascii';
import { TerminalInput } from '@/components/terminal-input';
import { TerminalStatus } from '@/components/terminal-status';
import { TerminalScenarioGrid } from '@/components/terminal-scenario-grid';
import { wealthScenarios } from '@/lib/scenarios';
import { shareManager } from '@/lib/share';
import { indexedDBManager, storageManager } from '@/lib/storage';
import { useMusicStore } from '@/lib/store';
import type { MusicGeneration, WealthScenario } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function Home() {
  const [selectedScenario, setSelectedScenario] =
    useState<WealthScenario | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const [showCraftStudio, setShowCraftStudio] = useState(false);
  const [savedGenerations, setSavedGenerations] = useState<MusicGeneration[]>(
    []
  );
  const {
    isGenerating,
    audioUrl,
    setIsGenerating,
    setAudioUrl,
    addGeneration,
    updateGeneration,
  } = useMusicStore();

  // Load saved generations on mount
  useEffect(() => {
    const generations = storageManager.getGenerations();
    setSavedGenerations(generations);
  }, []);

  const generateMusic = async (scenario?: WealthScenario) => {
    const prompt = scenario
      ? scenario.prompts[Math.floor(Math.random() * scenario.prompts.length)]
      : customPrompt;

    if (!prompt) {
      toast.error('Please select a scenario or enter a custom prompt');
      return;
    }

    const generation: MusicGeneration = {
      id: Date.now().toString(),
      prompt,
      scenarioId: scenario?.id,
      status: 'generating',
      duration: scenario?.duration || 60_000,
      createdAt: new Date(),
      title: scenario?.title || 'Custom Generation',
    };

    addGeneration(generation);
    setIsGenerating(true);
    setAudioUrl(null);

    try {
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          duration: generation.duration,
        }),
      });

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        // Handle error response
        if (contentType?.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate music');
        }
        throw new Error(`Failed to generate music: ${response.statusText}`);
      }

      // Handle successful audio response
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      // Check if R2 URL is available
      const r2Url = response.headers.get('X-R2-URL');
      if (r2Url) {
        console.log('Using R2 URL:', r2Url);
        // Store R2 URL for permanent access
        generation.audioUrl = r2Url;
      }

      // Save to IndexedDB as backup
      await indexedDBManager.saveAudio(generation.id, blob);

      const completedGeneration = {
        ...generation,
        status: 'completed' as const,
        audioUrl,
      };

      updateGeneration(generation.id, completedGeneration);
      storageManager.saveGeneration(completedGeneration);

      // Update saved generations list
      setSavedGenerations((prev) => [
        completedGeneration,
        ...prev.filter((g) => g.id !== generation.id),
      ]);

      setAudioUrl(audioUrl);
      toast.success('Music generated and saved!');
    } catch (error) {
      console.error('Generation error:', error);
      updateGeneration(generation.id, {
        status: 'failed',
        error:
          error instanceof Error ? error.message : 'Failed to generate music',
      });
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to generate music. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;

    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `wealthwave-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Music downloaded!');
  };

  const loadSavedGeneration = async (generation: MusicGeneration) => {
    try {
      const blob = await indexedDBManager.getAudio(generation.id);
      if (blob) {
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setSelectedScenario(null);
        toast.success(`Loaded: ${generation.title}`);
      } else {
        toast.error('Audio file not found');
      }
    } catch (error) {
      console.error('Error loading audio:', error);
      toast.error('Failed to load audio');
    }
  };

  const deleteSavedGeneration = async (id: string) => {
    storageManager.deleteGeneration(id);
    setSavedGenerations((prev) => prev.filter((g) => g.id !== id));
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    toast.success('Generation deleted');
  };

  const handleShare = async () => {
    if (!audioUrl) return;

    try {
      // Get the current generation's blob from the URL
      const response = await fetch(audioUrl);
      const blob = await response.blob();

      // Find the current generation metadata
      const currentGen = savedGenerations[0]; // Most recent
      if (!currentGen) {
        toast.error('No track to share');
        return;
      }

      // Pass the R2 URL if it exists (for permanent storage)
      const r2Url = currentGen.audioUrl?.startsWith('http') ? currentGen.audioUrl : undefined;
      const shareUrl = await shareManager.createShareableLink(currentGen, blob, r2Url);

      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to create share link');
    }
  };

  const shareGeneration = async (generation: MusicGeneration) => {
    try {
      const blob = await indexedDBManager.getAudio(generation.id);
      if (!blob) {
        toast.error('Audio not found');
        return;
      }

      // Pass the R2 URL if it exists (for permanent storage)
      const r2Url = generation.audioUrl?.startsWith('http') ? generation.audioUrl : undefined;
      const shareUrl = await shareManager.createShareableLink(generation, blob, r2Url);
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to create share link');
    }
  };

  return (
    <TerminalLayout>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--term-bg)',
            color: 'var(--term-fg)',
            border: '1px solid var(--term-accent)',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            fontSize: '12px',
          },
        }}
      />

      <div className="container relative z-10 mx-auto px-4 py-8">
        <div className="mb-16 text-center">
          <AsciiLogo />
          <AsciiDivider type="double" />
          <p className="mx-auto max-w-2xl text-sm text-[var(--term-dim)]">
            GENERATE MUSIC THAT TUNES YOUR MIND FOR WEALTH
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <TerminalStatus isGenerating={isGenerating} />
          
          <div className="border border-[var(--term-fg)] bg-[var(--term-bg)] p-4">
            <div className="mb-2 text-xs text-[var(--term-dim)]">COMMAND INPUT:</div>
            <div className="flex flex-col gap-4 md:flex-row">
              <TerminalInput
                value={customPrompt}
                onChange={setCustomPrompt}
                placeholder="DESCRIBE YOUR WEALTH-BUILDING VIBE..."
                onSubmit={() => customPrompt && !isGenerating && generateMusic()}
                className="flex-1"
              />
              <button
                className="flex items-center gap-2 px-6 py-2 border border-[var(--term-accent)] text-[var(--term-accent)] hover:bg-[var(--term-accent)] hover:text-[var(--term-bg)] transition-colors disabled:opacity-50"
                disabled={isGenerating || !customPrompt}
                onClick={() => generateMusic()}
                style={{ background: 'transparent' }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    GENERATING...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    GENERATE
                  </>
                )}
              </button>
              <button
                className="flex items-center gap-2 px-6 py-2 border border-[var(--term-dim)] text-[var(--term-dim)] hover:border-[var(--term-fg)] hover:text-[var(--term-fg)] transition-colors"
                onClick={() => setShowLibrary(!showLibrary)}
                style={{ background: 'transparent' }}
              >
                <Library className="h-4 w-4" />
                LIBRARY [{savedGenerations.length}]
              </button>
            </div>
          </div>

          {/* Craft Studio Toggle */}
          <div className="mx-auto max-w-4xl">
            <button
              className={cn(
                'w-full rounded-xl px-6 py-3 font-semibold transition-all',
                'flex items-center justify-center gap-2 border-2 border-dashed',
                showCraftStudio
                  ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                  : 'border-zinc-700 text-zinc-400 hover:border-amber-500/50 hover:text-amber-500'
              )}
              onClick={() => setShowCraftStudio(!showCraftStudio)}
            >
              <Palette className="h-4 w-4" />
              {showCraftStudio ? 'Close Craft Studio' : 'Open Craft Studio'}
            </button>
          </div>

          {/* Craft Studio Panel */}
          <AnimatePresence>
            {showCraftStudio && (
              <div className="mx-auto max-w-4xl">
                <CraftStudio
                  customPrompt={customPrompt}
                  onGenerateMusic={(prompt) => {
                    setCustomPrompt(prompt);
                    const scenario: WealthScenario = {
                      id: 'craft-studio',
                      title: 'Crafted Vibe',
                      description: 'Your custom-crafted wealth frequency',
                      icon: '🎨',
                      prompts: [prompt],
                      duration: 180_000,
                      category: 'custom',
                      energy: 'moderate',
                      gradient: 'from-amber-600 via-yellow-500 to-orange-400',
                    };
                    generateMusic(scenario);
                  }}
                  onGeneratePrompt={(prompt) => {
                    setCustomPrompt(prompt);
                    toast.success('Prompt applied to custom field!');
                  }}
                />
              </div>
            )}
          </AnimatePresence>
        </div>

        {showLibrary && savedGenerations.length > 0 && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-12 max-w-4xl"
            initial={{ opacity: 0, y: -20 }}
          >
            <div className="border border-[var(--term-accent)] bg-[var(--term-bg)] p-4">
              <h3 className="text-[var(--term-accent)] mb-4 font-bold text-lg uppercase">Your Library</h3>
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {savedGenerations.map((gen) => (
                  <div
                    className="flex items-center justify-between border border-[var(--term-dim)] p-3 transition-colors hover:border-[var(--term-accent)] hover:shadow-[0_0_5px_var(--term-accent)]"
                    key={gen.id}
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--term-fg)] uppercase">{gen.title}</h4>
                      <p className="text-xs text-[var(--term-dim)]">
                        {new Date(gen.createdAt).toLocaleDateString()} •{' '}
                        {Math.floor(gen.duration / 60_000)}min
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="h-8 w-8 flex items-center justify-center border border-[var(--term-accent)] text-[var(--term-accent)] bg-transparent hover:bg-[var(--term-accent)] hover:text-[var(--term-bg)] transition-colors"
                        onClick={() => loadSavedGeneration(gen)}
                        title="Play"
                      >
                        <Play className="h-4 w-4 ml-0.5 flex-shrink-0" />
                      </button>
                      <button
                        className="h-8 w-8 flex items-center justify-center border border-[var(--term-accent)] text-[var(--term-accent)] bg-transparent hover:bg-[var(--term-accent)] hover:text-[var(--term-bg)] transition-colors"
                        onClick={() => shareGeneration(gen)}
                        title="Share"
                      >
                        <Share2 className="h-4 w-4 flex-shrink-0" />
                      </button>
                      <button
                        className="h-8 w-8 flex items-center justify-center border border-[var(--term-error)] text-[var(--term-error)] bg-transparent hover:bg-[var(--term-error)] hover:text-[var(--term-bg)] transition-colors"
                        onClick={() => deleteSavedGeneration(gen.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 flex-shrink-0" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div className="mb-4">
          <AsciiDivider type="double" />
          <h2 className="mb-2 text-center text-lg text-[var(--term-accent)]">WEALTH SCENARIOS</h2>
          <p className="text-center text-xs text-[var(--term-dim)]">CHOOSE YOUR MONEY-MAKING MOMENT</p>
          <AsciiDivider type="single" />
        </div>

        <TerminalScenarioGrid
          scenarios={wealthScenarios}
          onSelect={(scenario) => {
            setSelectedScenario(scenario);
            generateMusic(scenario);
          }}
          isGenerating={isGenerating}
        />

        {audioUrl && (
          <MusicPlayer
            audioUrl={audioUrl}
            onDownload={handleDownload}
            onShare={handleShare}
            title={selectedScenario?.title || 'Custom Generation'}
          />
        )}

        {isGenerating && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              animate={{ scale: 1, opacity: 1 }}
              className="glass max-w-md rounded-2xl p-8 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
            >
              <div className="mb-4">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-amber-500" />
              </div>
              <h3 className="gold-text mb-2 font-bold text-xl">
                Manifesting Your Wealth Frequency
              </h3>
              <p className="text-zinc-400">
                AI is composing your millionaire mindset soundtrack...
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </TerminalLayout>
  );
}
