'use client';

import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';
import type { WealthScenario } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ScenarioCardProps {
  scenario: WealthScenario;
  onSelect: (scenario: WealthScenario) => void;
  isSelected?: boolean;
}

export function ScenarioCard({
  scenario,
  onSelect,
  isSelected,
}: ScenarioCardProps) {
  return (
    <motion.button
      className={cn(
        'group relative w-full overflow-hidden rounded-xl text-left transition-all duration-300',
        'glass brutalist-shadow hover:wealth-glow',
        isSelected && 'wealth-glow ring-2 ring-amber-500'
      )}
      onClick={() => onSelect(scenario)}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={cn(
          'absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20',
          `bg-gradient-to-br ${scenario.gradient}`
        )}
      />

      <div className="relative space-y-4 p-6">
        <div className="flex items-start justify-between">
          <div className="animate-float text-4xl">{scenario.icon}</div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Clock className="h-3 w-3" />
            <span>{Math.floor(scenario.duration / 60_000)}min</span>
          </div>
        </div>

        <div>
          <h3 className="gold-text mb-2 font-bold text-xl">{scenario.title}</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {scenario.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex items-center gap-1 rounded-full px-2 py-1 text-xs',
              'border border-zinc-800 bg-zinc-900'
            )}
          >
            <Zap className="h-3 w-3" />
            <span className="capitalize">{scenario.energy}</span>
          </div>
          <div
            className={cn(
              'rounded-full px-2 py-1 text-xs',
              'border border-zinc-800 bg-zinc-900 capitalize'
            )}
          >
            {scenario.category}
          </div>
        </div>
      </div>

      <div
        className={cn(
          'absolute right-0 bottom-0 left-0 h-1',
          'bg-gradient-to-r from-transparent via-amber-500 to-transparent',
          'opacity-0 transition-opacity group-hover:opacity-100'
        )}
      />
    </motion.button>
  );
}
