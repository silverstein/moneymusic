'use client'

import { useEffect, useState } from 'react'
import { cn, terminalStyles } from '@/lib/terminal-utils'

interface TickerItem {
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  color?: 'success' | 'error' | 'warning' | 'info'
}

const WEALTH_METRICS: TickerItem[] = [
  { label: 'MINDSET INDEX', value: '87.4%', trend: 'up', color: 'success' },
  { label: 'FOCUS LEVEL', value: '92.1', trend: 'up', color: 'info' },
  { label: 'MOGUL MODE', value: 'ACTIVE', color: 'warning' },
  { label: 'DAILY STREAK', value: '7', trend: 'up', color: 'success' },
  { label: 'WEALTH FREQUENCY', value: '432Hz', color: 'info' },
  { label: 'EMPIRE STATUS', value: 'BUILDING', color: 'warning' },
  { label: 'GRIND LEVEL', value: 'MAXIMUM', trend: 'up', color: 'success' },
  { label: 'MARKET SENTIMENT', value: 'BULLISH', trend: 'up', color: 'success' },
]

export function TerminalTicker() {
  const [offset, setOffset] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setOffset(prev => prev - 1)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const getColorClass = (color?: string) => {
    switch (color) {
      case 'success': return 'text-[var(--term-success)]'
      case 'error': return 'text-[var(--term-error)]'
      case 'warning': return 'text-[var(--term-warning)]'
      case 'info': return 'text-[var(--term-info)]'
      default: return 'text-[var(--term-fg)]'
    }
  }

  const getTrendSymbol = (trend?: string) => {
    switch (trend) {
      case 'up': return '↑'
      case 'down': return '↓'
      default: return '='
    }
  }

  if (!mounted) {
    return (
      <div className="relative overflow-hidden h-6 border-y border-[var(--term-dim)] bg-[var(--term-bg)]" />
    )
  }

  return (
    <div className="relative overflow-hidden h-6 border-y border-[var(--term-dim)] bg-[var(--term-bg)]">
      <div 
        className="absolute whitespace-nowrap flex items-center gap-8 h-full"
        style={{ transform: `translateX(${offset}px)` }}
      >
        {[...WEALTH_METRICS, ...WEALTH_METRICS, ...WEALTH_METRICS].map((item, i) => (
          <span key={i} className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
            <span className={terminalStyles.dim}>{item.label}:</span>
            <span className={cn('font-bold', getColorClass(item.color))}>
              {item.value}
            </span>
            {item.trend && (
              <span className={cn(
                'text-sm',
                item.trend === 'up' ? 'text-[var(--term-success)]' : 
                item.trend === 'down' ? 'text-[var(--term-error)]' : 
                'text-[var(--term-dim)]'
              )}>
                {getTrendSymbol(item.trend)}
              </span>
            )}
            <span className={terminalStyles.dim}>|</span>
          </span>
        ))}
      </div>
    </div>
  )
}