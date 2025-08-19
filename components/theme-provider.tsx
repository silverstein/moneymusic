'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { TERMINAL_THEMES, DEFAULT_THEME, type TerminalTheme } from '@/lib/themes'

type ThemeContextType = {
  theme: TerminalTheme
  themeId: string
  setTheme: (themeId: string) => void
  availableThemes: typeof TERMINAL_THEMES
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState(DEFAULT_THEME)
  const theme = TERMINAL_THEMES[themeId] || TERMINAL_THEMES[DEFAULT_THEME]

  useEffect(() => {
    const savedTheme = localStorage.getItem('terminal-theme')
    if (savedTheme && TERMINAL_THEMES[savedTheme]) {
      setThemeId(savedTheme)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    
    root.style.setProperty('--term-bg', theme.colors.bg)
    root.style.setProperty('--term-fg', theme.colors.fg)
    root.style.setProperty('--term-accent', theme.colors.accent)
    root.style.setProperty('--term-dim', theme.colors.dim)
    root.style.setProperty('--term-grid', theme.colors.grid)
    root.style.setProperty('--term-error', theme.colors.error)
    root.style.setProperty('--term-success', theme.colors.success)
    root.style.setProperty('--term-warning', theme.colors.warning)
    root.style.setProperty('--term-info', theme.colors.info)
    root.style.setProperty('--term-glow', theme.colors.glow)
    root.style.setProperty('--term-scanline', theme.colors.scanline)
    root.style.setProperty('--term-cursor', theme.colors.cursor)
    
    root.setAttribute('data-theme', themeId)
    root.setAttribute('data-crt', theme.effects.crt ? 'true' : 'false')
    root.setAttribute('data-scanlines', theme.effects.scanlines ? 'true' : 'false')
    root.setAttribute('data-glow', theme.effects.glow ? 'true' : 'false')
    root.setAttribute('data-noise', theme.effects.noise ? 'true' : 'false')
  }, [theme, themeId])

  const handleSetTheme = (newThemeId: string) => {
    if (TERMINAL_THEMES[newThemeId]) {
      setThemeId(newThemeId)
      localStorage.setItem('terminal-theme', newThemeId)
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeId,
        setTheme: handleSetTheme,
        availableThemes: TERMINAL_THEMES
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}