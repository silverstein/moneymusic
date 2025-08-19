'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/terminal-utils'
import { WealthScenario } from '@/lib/types'

interface TerminalScenarioGridProps {
  scenarios: WealthScenario[]
  onSelect: (scenario: WealthScenario) => void
  isGenerating: boolean
}

export function TerminalScenarioGrid({ scenarios, onSelect, isGenerating }: TerminalScenarioGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Create ticker-style codes for scenarios
  const getTickerCode = (id: string): string => {
    const codes: Record<string, string> = {
      'morning-mogul': 'MGUL',
      'deal-closer': 'DLCL',
      'focus-flow': 'FLOW',
      'victory-lap': 'VCTR',
      'night-hustle': 'HSTL',
      'abundance-meditation': 'ABND',
      'power-commute': 'CMUT',
      'wealth-warrior': 'WARR'
    }
    return codes[id] || id.substring(0, 4).toUpperCase()
  }

  return (
    <div className="mb-8 border border-[var(--term-fg)] bg-[var(--term-bg)] overflow-x-auto">
      {/* Desktop table view */}
      <div className="hidden md:block min-w-[600px]">
        <div className="grid grid-cols-[200px_80px_1fr] border-b border-[var(--term-fg)]">
          <div className="p-2 text-xs text-[var(--term-accent)] border-r border-[var(--term-dim)]">SCENARIO</div>
          <div className="p-2 text-xs text-[var(--term-accent)] border-r border-[var(--term-dim)]">TIME</div>
          <div className="p-2 text-xs text-[var(--term-accent)]">DESCRIPTION</div>
        </div>
        {scenarios.map((scenario, index) => (
          <button
            key={scenario.id}
            onClick={() => !isGenerating && onSelect(scenario)}
            onMouseEnter={() => setHoveredIndex(index)}
            disabled={isGenerating}
            className={cn(
              'w-full grid grid-cols-[200px_80px_1fr] text-left transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'border-b border-[var(--term-dim)]',
              hoveredIndex === index ? 'bg-[var(--term-accent)] text-[var(--term-bg)]' : 'hover:bg-[var(--term-dim)] hover:text-[var(--term-bg)]'
            )}
            style={{ background: hoveredIndex === index ? 'var(--term-accent)' : 'transparent', border: 'none', padding: '0' }}
          >
            <div className="p-2 text-xs border-r border-[var(--term-dim)] truncate">
              [{getTickerCode(scenario.id)}] {scenario.title.toUpperCase()}
            </div>
            <div className="p-2 text-xs border-r border-[var(--term-dim)]">
              {(scenario.duration / 60000)}MIN
            </div>
            <div className="p-2 text-xs truncate">
              {scenario.description.toUpperCase()}
            </div>
          </button>
        ))}
      </div>

      {/* Mobile list view */}
      <div className="md:hidden">
        {scenarios.map((scenario, index) => (
          <button
            key={scenario.id}
            onClick={() => !isGenerating && onSelect(scenario)}
            disabled={isGenerating}
            className={cn(
              'w-full p-3 text-left transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'border-b border-[var(--term-dim)]',
              ''
            )}
            style={{ background: 'transparent', border: 'none' }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold">[{getTickerCode(scenario.id)}]</span>
              <span className="text-xs">{(scenario.duration / 60000)}MIN</span>
            </div>
            <div className="text-sm font-semibold mb-1">{scenario.title.toUpperCase()}</div>
            <div className="text-xs text-[var(--term-dim)]">{scenario.description}</div>
          </button>
        ))}
      </div>

      <div className="p-2 text-[var(--term-dim)] text-xs text-center border-t border-[var(--term-dim)]">
        [CLICK/TAP TO SELECT A SCENARIO]
      </div>
    </div>
  )
}