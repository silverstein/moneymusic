'use client';

import { motion } from 'framer-motion';
import { Activity, Music, Palette, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CraftStudioProps {
  onGeneratePrompt: (prompt: string) => void;
  onGenerateMusic: (prompt: string) => void;
  customPrompt?: string;
}

const genres = [
  { id: 'hip-hop', label: 'Hip-Hop', icon: '🎤' },
  { id: 'electronic', label: 'Electronic', icon: '🎹' },
  { id: 'classical', label: 'Classical', icon: '🎻' },
  { id: 'jazz', label: 'Jazz', icon: '🎷' },
  { id: 'rock', label: 'Rock', icon: '🎸' },
  { id: 'ambient', label: 'Ambient', icon: '🌊' },
];

const vibes = [
  {
    id: 'aggressive',
    label: 'Aggressive',
    color: 'from-red-600 to-orange-600',
  },
  { id: 'chill', label: 'Chill', color: 'from-blue-600 to-cyan-600' },
  {
    id: 'uplifting',
    label: 'Uplifting',
    color: 'from-yellow-500 to-amber-500',
  },
  { id: 'dark', label: 'Dark', color: 'from-gray-700 to-black' },
  { id: 'ethereal', label: 'Ethereal', color: 'from-purple-600 to-pink-600' },
];

const activities = [
  { id: 'working', label: 'Working', icon: '💼' },
  { id: 'exercising', label: 'Exercising', icon: '💪' },
  { id: 'relaxing', label: 'Relaxing', icon: '🧘' },
  { id: 'driving', label: 'Driving', icon: '🚗' },
  { id: 'studying', label: 'Studying', icon: '📚' },
  { id: 'creating', label: 'Creating', icon: '🎨' },
];

export function CraftStudio({
  onGeneratePrompt,
  onGenerateMusic,
  customPrompt,
}: CraftStudioProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedVibe, setSelectedVibe] = useState<string>('');
  const [energy, setEnergy] = useState<number>(5);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [blendWithCustom, setBlendWithCustom] = useState<boolean>(
    !!customPrompt
  );

  const generatePrompt = () => {
    if (!(selectedGenre && selectedVibe)) {
      return '';
    }

    const energyDescriptor =
      energy <= 3 ? 'low' : energy <= 6 ? 'moderate' : 'high';
    const genreLabel = genres.find((g) => g.id === selectedGenre)?.label;
    const vibeLabel = vibes
      .find((v) => v.id === selectedVibe)
      ?.label?.toLowerCase();
    const activityLabel = activities
      .find((a) => a.id === selectedActivity)
      ?.label?.toLowerCase();

    let prompt = '';

    // If blending with custom prompt, incorporate it
    if (blendWithCustom && customPrompt) {
      prompt = `Create a ${energyDescriptor} energy ${genreLabel} track with a ${vibeLabel} vibe about: "${customPrompt}".`;
    } else {
      prompt = `Create a ${energyDescriptor} energy ${genreLabel} track with a ${vibeLabel} vibe for wealth-building and success mindset.`;
    }

    if (selectedActivity) {
      prompt += ` Perfect for ${activityLabel}.`;
    }

    // Add technical details based on selections
    if (selectedGenre === 'hip-hop') {
      prompt +=
        ' Include hard-hitting 808s, trap hi-hats, and motivational energy.';
    } else if (selectedGenre === 'electronic') {
      prompt +=
        ' Feature modern synths, driving basslines, and euphoric builds.';
    } else if (selectedGenre === 'classical') {
      prompt +=
        ' Incorporate orchestral strings, brass sections, and cinematic progressions.';
    } else if (selectedGenre === 'jazz') {
      prompt +=
        ' Add sophisticated piano, smooth saxophone, and complex harmonies.';
    } else if (selectedGenre === 'rock') {
      prompt +=
        ' Include powerful guitar riffs, driving drums, and anthemic energy.';
    } else if (selectedGenre === 'ambient') {
      prompt +=
        ' Use atmospheric pads, subtle textures, and spacious soundscapes.';
    }

    // Add BPM based on energy
    const bpm = 60 + energy * 12; // 72-180 BPM range
    prompt += ` Tempo around ${bpm} BPM.`;

    return prompt;
  };

  const handleGeneratePrompt = () => {
    const prompt = generatePrompt();
    if (prompt) {
      onGeneratePrompt(prompt);
    }
  };

  const handleGenerateMusic = () => {
    const prompt = generatePrompt();
    if (prompt) {
      onGenerateMusic(prompt);
    }
  };

  const currentPrompt = generatePrompt();
  const isValid = selectedGenre && selectedVibe;

  return (
    <motion.div
      animate={{ opacity: 1, height: 'auto' }}
      className="glass space-y-6 overflow-hidden rounded-2xl p-6"
      exit={{ opacity: 0, height: 0 }}
      initial={{ opacity: 0, height: 0 }}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="gold-gradient flex h-10 w-10 items-center justify-center rounded-lg">
          <Palette className="h-5 w-5 text-black" />
        </div>
        <div className="flex-1">
          <h3 className="gold-text font-bold text-xl">Craft Your Vibe</h3>
          <p className="text-xs text-zinc-400">
            Select genre and vibe to generate
          </p>
        </div>
        {isValid && (
          <button
            className="gold-gradient flex items-center gap-2 rounded-lg px-6 py-2.5 font-bold text-black transition-transform hover:scale-105"
            onClick={handleGenerateMusic}
          >
            <Sparkles className="h-4 w-4" />
            Generate Music
          </button>
        )}
      </div>

      {/* Blend Toggle - Show if custom prompt exists */}
      {customPrompt && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              checked={blendWithCustom}
              className="h-4 w-4 accent-amber-500"
              onChange={(e) => setBlendWithCustom(e.target.checked)}
              type="checkbox"
            />
            <div className="flex-1">
              <div className="font-semibold text-amber-500 text-sm">
                Blend with your custom prompt
              </div>
              <div className="mt-0.5 text-xs text-zinc-400">
                &quot;{customPrompt.slice(0, 50)}
                {customPrompt.length > 50 ? '...' : ''}&quot;
              </div>
            </div>
          </label>
        </div>
      )}

      {/* Genre Selection */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Music className="h-4 w-4 text-amber-500" />
          <label className="font-semibold text-sm">
            Genre <span className="text-xs text-zinc-500">(Required)</span>
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
          {genres.map((genre) => (
            <button
              className={cn(
                'rounded-lg border p-3 transition-all',
                'hover:scale-105 hover:border-amber-500',
                selectedGenre === genre.id
                  ? 'border-amber-500 bg-amber-500/20 text-amber-500'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400'
              )}
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
            >
              <div className="mb-1 text-2xl">{genre.icon}</div>
              <div className="font-medium text-xs">{genre.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Vibe Selection */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <label className="font-semibold text-sm">
            Vibe <span className="text-xs text-zinc-500">(Required)</span>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {vibes.map((vibe) => (
            <button
              className={cn(
                'relative overflow-hidden rounded-lg border p-3 transition-all',
                'hover:scale-105',
                selectedVibe === vibe.id
                  ? 'border-amber-500'
                  : 'border-zinc-800'
              )}
              key={vibe.id}
              onClick={() => setSelectedVibe(vibe.id)}
            >
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-20',
                  vibe.color
                )}
              />
              <div className="relative font-medium text-sm">{vibe.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Energy Slider */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <label className="font-semibold text-sm">Energy</label>
          </div>
          <span className="font-bold text-amber-500 text-sm">{energy}/10</span>
        </div>
        <div className="relative">
          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="gold-gradient h-full transition-all"
              style={{ width: `${energy * 10}%` }}
            />
          </div>
          <input
            className="absolute inset-0 h-2 w-full cursor-pointer opacity-0"
            max="10"
            min="1"
            onChange={(e) => setEnergy(Number(e.target.value))}
            type="range"
            value={energy}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-zinc-500">
          <span>Calm</span>
          <span>Moderate</span>
          <span>Intense</span>
        </div>
      </div>

      {/* Activity Context (Optional) */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4 text-amber-500" />
          <label className="font-semibold text-sm">Activity (Optional)</label>
        </div>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
          {activities.map((activity) => (
            <button
              className={cn(
                'rounded-lg border p-2 text-center transition-all',
                'hover:scale-105 hover:border-amber-500/50',
                selectedActivity === activity.id
                  ? 'border-amber-500/50 bg-amber-500/10'
                  : 'border-zinc-800 bg-zinc-900/50'
              )}
              key={activity.id}
              onClick={() =>
                setSelectedActivity(
                  selectedActivity === activity.id ? '' : activity.id
                )
              }
            >
              <div className="mb-1 text-xl">{activity.icon}</div>
              <div className="text-xs">{activity.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Live Prompt Preview */}
      {currentPrompt && (
        <div className="border-zinc-800 border-t pt-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="font-semibold text-xs text-zinc-400">
              Generated Prompt Preview
            </label>
            <button
              className="text-amber-500 text-xs transition-colors hover:text-amber-400"
              onClick={handleGeneratePrompt}
            >
              Copy to custom field
            </button>
          </div>
          <div className="rounded-lg bg-zinc-900/50 p-3">
            <p className="text-xs text-zinc-300 italic leading-relaxed">
              {currentPrompt}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
