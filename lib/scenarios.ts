import type { WealthScenario } from './types';

export const wealthScenarios: WealthScenario[] = [
  {
    id: 'morning-mogul',
    title: 'Morning Mogul',
    description:
      'Start your day with the energy of a titan. Wake up ready to conquer markets.',
    icon: '☀️',
    prompts: [
      'Epic orchestral sunrise with electric guitar, building from gentle piano to explosive drums at 120 BPM, instrumental only, motivational wealth anthem',
      'Cinematic morning energy at 110 BPM, blend of modern 808s and classical strings in D major, billionaire mindset activation music',
      'Uplifting electronic symphony with brass stabs, side-chain compression, 128 BPM corporate power vibes, fortune 500 CEO morning routine',
    ],
    duration: 180_000,
    category: 'morning',
    energy: 'high',
    gradient: 'from-amber-600 via-yellow-500 to-orange-400',
  },
  {
    id: 'deal-closer',
    title: 'Deal Closer',
    description:
      'Channel your inner closer. Music that radiates confidence and dominance.',
    icon: '🤝',
    prompts: [
      'Aggressive hip-hop beats with orchestral power chords, Wall Street warrior theme, closing million dollar deals',
      'Dark trap instrumental with triumphant brass sections, boardroom domination soundtrack, alpha negotiator energy',
      'Intense electronic rock fusion, pulsing bass with victory fanfares, unstoppable business momentum',
    ],
    duration: 120_000,
    category: 'work',
    energy: 'intense',
    gradient: 'from-emerald-700 via-green-600 to-lime-500',
  },
  {
    id: 'focus-flow',
    title: 'Focus Flow',
    description:
      'Deep work mode activated. Laser focus for building your empire.',
    icon: '🎯',
    prompts: [
      'Minimal techno at 90 BPM, subtle wealth affirmation frequencies, deep focus binaural beats for productivity, instrumental only',
      'Ambient electronic with soft rhodes piano, 85 BPM concentration enhancing tones, millionaire mindset subliminal rhythm, warm analog synths',
      'Lo-fi hip-hop beats at 75 BPM with motivational undertones, jazzy chords, vinyl crackle, study music for financial literacy',
    ],
    duration: 300_000,
    category: 'focus',
    energy: 'moderate',
    gradient: 'from-blue-700 via-indigo-600 to-purple-600',
  },
  {
    id: 'victory-lap',
    title: 'Victory Lap',
    description: 'Celebrate your wins. Music for when you crush your goals.',
    icon: '🏆',
    prompts: [
      'Triumphant orchestral celebration with EDM drops, champagne popping victory anthem, success celebration',
      'Epic trap symphony with gospel choir, wealth manifestation celebration, abundance overflow soundtrack',
      'Explosive electronic rock anthem, stadium-sized success music, millionaire milestone celebration',
    ],
    duration: 150_000,
    category: 'celebration',
    energy: 'intense',
    gradient: 'from-yellow-500 via-amber-500 to-red-500',
  },
  {
    id: 'night-hustle',
    title: 'Night Hustle',
    description:
      'When others sleep, you build. Late night empire construction vibes.',
    icon: '🌙',
    prompts: [
      'Dark ambient trap with motivational whispers, midnight grind session, building wealth while world sleeps',
      'Atmospheric electronic with deep bass, nocturnal productivity soundtrack, silent empire builder',
      'Moody synth waves with subtle percussion, late night strategy session, plotting market domination',
    ],
    duration: 240_000,
    category: 'evening',
    energy: 'moderate',
    gradient: 'from-slate-800 via-gray-700 to-zinc-600',
  },
  {
    id: 'abundance-meditation',
    title: 'Abundance Meditation',
    description: 'Reprogram your wealth consciousness. Manifest prosperity.',
    icon: '🧘',
    prompts: [
      'Ethereal ambient with wealth frequency tones, abundance meditation with soft prosperity affirmations',
      'Healing soundscape with golden ratio frequencies, money magnet meditation, financial abundance activation',
      'Cosmic electronic meditation, universal wealth consciousness, prosperity portal opening sounds',
    ],
    duration: 600_000,
    category: 'mindset',
    energy: 'calm',
    gradient: 'from-purple-700 via-pink-600 to-rose-500',
  },
  {
    id: 'power-commute',
    title: 'Power Commute',
    description: 'Transform your commute into a wealth strategy session.',
    icon: '🚗',
    prompts: [
      'Driving electronic rock with motivational speeches undertone, highway to wealth soundtrack',
      'High-energy trap with orchestral elements, commute conquest music, road to riches anthem',
      'Upbeat electronic fusion, success mindset driving music, millionaire commute transformation',
    ],
    duration: 180_000,
    category: 'work',
    energy: 'high',
    gradient: 'from-cyan-600 via-blue-500 to-indigo-500',
  },
  {
    id: 'wealth-warrior',
    title: 'Wealth Warrior',
    description:
      'Gym session for financial gladiators. Build your body and bank account.',
    icon: '💪',
    prompts: [
      'Aggressive trap metal fusion, wealth warrior workout, building physical and financial strength',
      'Intense electronic rock with motivational chants, millionaire athlete training music',
      'Heavy bass dubstep with victory drums, empire builder workout, unstoppable force training',
    ],
    duration: 150_000,
    category: 'work',
    energy: 'intense',
    gradient: 'from-red-700 via-orange-600 to-yellow-500',
  },
];
