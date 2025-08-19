'use client'

import { useEffect, useState } from 'react'
import { cn, terminalStyles } from '@/lib/terminal-utils'
import { useMusicStore } from '@/lib/store'

interface DayData {
  date: Date
  count: number
  intensity: 0 | 1 | 2 | 3 | 4
}

export function TerminalContributionGraph() {
  const { generations } = useMusicStore()
  const [graphData, setGraphData] = useState<DayData[]>([])
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null)

  useEffect(() => {
    const today = new Date()
    const days: DayData[] = []
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const dayGenerations = generations.filter(g => {
        const genDate = new Date(g.createdAt)
        genDate.setHours(0, 0, 0, 0)
        return genDate.getTime() === date.getTime()
      })
      
      const count = dayGenerations.length
      const intensity = count === 0 ? 0 : 
                       count === 1 ? 1 :
                       count <= 3 ? 2 :
                       count <= 5 ? 3 : 4
      
      days.push({ date, count, intensity })
    }
    
    setGraphData(days)
  }, [generations])

  const weeks: DayData[][] = []
  for (let i = 0; i < graphData.length; i += 7) {
    weeks.push(graphData.slice(i, i + 7))
  }

  const getIntensityClass = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-[var(--term-grid)]'
      case 1: return 'bg-[var(--term-dim)] opacity-40'
      case 2: return 'bg-[var(--term-accent)] opacity-40'
      case 3: return 'bg-[var(--term-accent)] opacity-70'
      case 4: return 'bg-[var(--term-accent)]'
      default: return 'bg-[var(--term-grid)]'
    }
  }

  const monthLabels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className={cn(terminalStyles.panel, 'p-4')}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={cn(terminalStyles.text, 'text-sm font-bold')}>
          WEALTH BUILDING ACTIVITY
        </h3>
        <span className={cn(terminalStyles.dim, 'text-xs')}>
          365 DAY HISTORY
        </span>
      </div>
      
      <div className="relative">
        {hoveredDay && (
          <div className={cn(
            'absolute z-50 p-2 text-xs',
            'border border-[var(--term-fg)] bg-[var(--term-bg)]',
            'shadow-[0_0_10px_var(--term-glow)]',
            'pointer-events-none',
            'bottom-full mb-2'
          )}>
            <div className={terminalStyles.text}>
              {hoveredDay.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
            </div>
            <div className={terminalStyles.accent}>
              {hoveredDay.count} GENERATION{hoveredDay.count !== 1 ? 'S' : ''}
            </div>
          </div>
        )}
        
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 pr-2">
            {dayLabels.map((day, i) => (
              <div key={i} className={cn(terminalStyles.dim, 'text-[10px] h-3 flex items-center')}>
                {i % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>
          
          <div className="flex gap-1 overflow-x-auto">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={cn(
                      'w-3 h-3 cursor-pointer transition-all',
                      getIntensityClass(day.intensity),
                      'hover:ring-1 hover:ring-[var(--term-fg)]'
                    )}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4">
          <span className={cn(terminalStyles.dim, 'text-xs')}>LESS</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={cn('w-3 h-3', getIntensityClass(i))}
              />
            ))}
          </div>
          <span className={cn(terminalStyles.dim, 'text-xs')}>MORE</span>
        </div>
      </div>
    </div>
  )
}