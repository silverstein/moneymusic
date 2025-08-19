import { create } from 'zustand';
import type { MusicGeneration } from './types';

interface MusicStore {
  generations: MusicGeneration[];
  currentGeneration: MusicGeneration | null;
  isGenerating: boolean;
  audioUrl: string | null;

  addGeneration: (generation: MusicGeneration) => void;
  updateGeneration: (id: string, updates: Partial<MusicGeneration>) => void;
  setCurrentGeneration: (generation: MusicGeneration | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setAudioUrl: (url: string | null) => void;
  clearGenerations: () => void;
}

export const useMusicStore = create<MusicStore>((set) => ({
  generations: [],
  currentGeneration: null,
  isGenerating: false,
  audioUrl: null,

  addGeneration: (generation) =>
    set((state) => ({
      generations: [generation, ...state.generations],
    })),

  updateGeneration: (id, updates) =>
    set((state) => ({
      generations: state.generations.map((gen) =>
        gen.id === id ? { ...gen, ...updates } : gen
      ),
    })),

  setCurrentGeneration: (generation) => set({ currentGeneration: generation }),

  setIsGenerating: (isGenerating) => set({ isGenerating }),

  setAudioUrl: (url) => set({ audioUrl: url }),

  clearGenerations: () =>
    set({ generations: [], currentGeneration: null, audioUrl: null }),
}));
