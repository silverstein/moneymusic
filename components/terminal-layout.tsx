'use client'

import { useState, useEffect } from 'react'
import { cn, terminalClass, terminalStyles, formatTerminalTime, generateSessionId } from '@/lib/terminal-utils'
import { useTheme } from './theme-provider'
import { TerminalTicker } from './terminal-ticker'
import { TerminalDotPattern } from './terminal-dot-pattern'
import { TerminalCommand } from './terminal-command'

interface TerminalLayoutProps {
  children: React.ReactNode
}

export function TerminalLayout({ children }: TerminalLayoutProps) {
  const [sessionTime, setSessionTime] = useState(0)
  const [sessionId, setSessionId] = useState('MOGUL_000000')
  const { themeId, setTheme, availableThemes } = useTheme()
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showCommand, setShowCommand] = useState(false)
  
  // Generate session ID only on client
  useEffect(() => {
    setSessionId(generateSessionId())
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1000)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommand(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <div className="terminal-container">
        {/* Noise overlay for certain themes */}
        <div className="noise-overlay" />
        
        {/* Dot pattern background */}
        <TerminalDotPattern className="opacity-20 md:opacity-30" />
        
        {/* Terminal grid background */}
        <div className="terminal-grid opacity-10 md:opacity-20" />
      
      {/* Header */}
      <header className={cn(terminalStyles.header, 'relative z-50')}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4">
            <span className={cn(terminalClass('text-xs md:text-sm'), 'glow-text')}>
              WEALTHWAVE TERMINAL <span className="hidden md:inline">v2.0.0</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs">
            <span className={terminalStyles.dim}>
              SESSION: <span className={terminalStyles.accent}>{formatTerminalTime(sessionTime)}</span>
            </span>
            <span className={cn("hidden md:inline", terminalStyles.dim)}>
              ID: <span className={terminalStyles.accent}>{sessionId}</span>
            </span>
            <button
              onClick={() => setShowCommand(true)}
              className={cn(
                terminalStyles.command,
                'px-2 py-1 text-[10px] md:text-xs'
              )}
            >
              [⌘K]
            </button>
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className={cn(
                terminalStyles.command,
                'px-2 py-1 text-[10px] md:text-xs relative'
              )}
            >
              THEME
            </button>
          </div>
        </div>
        
        {/* Theme dropdown */}
        {showThemeMenu && (
          <div className="absolute top-full right-0 md:right-4 mt-1 z-50 border border-[var(--term-fg)] bg-[var(--term-bg)] min-w-[150px]">
            {Object.values(availableThemes).map(theme => (
              <button
                key={theme.id}
                onClick={() => {
                  setTheme(theme.id)
                  setShowThemeMenu(false)
                }}
                className={cn(
                  terminalStyles.command,
                  'w-full text-left text-xs',
                  themeId === theme.id && 'bg-[var(--term-accent)] text-[var(--term-bg)]'
                )}
              >
                <span className="text-[var(--term-accent)]">{'>'}</span>
                {theme.name}
              </button>
            ))}
          </div>
        )}
      </header>
      
      {/* Wealth metrics ticker */}
      <TerminalTicker />
      
      {/* Main content area */}
      <main className="terminal-main">
        {children}
      </main>
    </div>
      
      {/* Command palette */}
      <TerminalCommand open={showCommand} onOpenChange={setShowCommand} />
    </>
  )
}