'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/terminal-utils'

interface TerminalStatusProps {
  isGenerating: boolean
  status?: string
}

const GENERATION_MESSAGES = [
  'INITIALIZING WEALTH SEQUENCE...',
  'CONNECTING TO FINANCIAL MATRIX...',
  'ANALYZING MARKET FREQUENCIES...',
  'CALIBRATING WEALTH CONSCIOUSNESS...',
  'SYNCHRONIZING ABUNDANCE WAVELENGTH...',
  'GENERATING PROSPERITY PATTERNS...',
  'ENCODING SUCCESS ALGORITHMS...',
  'FINALIZING WEALTH SEQUENCE...'
]

export function TerminalStatus({ isGenerating, status }: TerminalStatusProps) {
  const [currentMessage, setCurrentMessage] = useState('')
  const [messageIndex, setMessageIndex] = useState(0)
  const [dots, setDots] = useState('')

  useEffect(() => {
    if (isGenerating) {
      const messageInterval = setInterval(() => {
        setMessageIndex(prev => (prev + 1) % GENERATION_MESSAGES.length)
      }, 2000)
      
      const dotsInterval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.')
      }, 500)
      
      return () => {
        clearInterval(messageInterval)
        clearInterval(dotsInterval)
      }
    } else {
      setMessageIndex(0)
      setDots('')
    }
  }, [isGenerating])

  useEffect(() => {
    setCurrentMessage(GENERATION_MESSAGES[messageIndex])
  }, [messageIndex])

  if (!isGenerating && !status) return null

  return (
    <div className="border border-[var(--term-accent)] bg-[var(--term-bg)] p-4 mb-4">
      <div className="flex items-start gap-2">
        <span className="text-[var(--term-accent)] animate-pulse">[SYS]</span>
        <div className="flex-1">
          <div className="text-[var(--term-fg)] font-mono text-sm">
            {isGenerating ? (
              <>
                {currentMessage}
                <span className="text-[var(--term-accent)]">{dots}</span>
              </>
            ) : (
              status || 'READY'
            )}
          </div>
          {isGenerating && (
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 flex-1 bg-[var(--term-bg)] border border-[var(--term-dim)]">
                <div 
                  className="h-full bg-[var(--term-accent)] animate-pulse"
                  style={{ 
                    width: `${((messageIndex + 1) / GENERATION_MESSAGES.length) * 100}%`,
                    transition: 'width 2s ease-out' 
                  }}
                />
              </div>
              <span className="text-[var(--term-dim)] text-xs">
                {Math.round(((messageIndex + 1) / GENERATION_MESSAGES.length) * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}