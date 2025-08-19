import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function terminalClass(...classes: string[]) {
  return cn(
    'font-mono uppercase tracking-wider',
    ...classes
  )
}

export const terminalStyles = {
  panel: 'border border-[var(--term-fg)] bg-[var(--term-bg)] p-2 md:p-4',
  command: 'flex items-center gap-2 p-2 cursor-pointer hover:bg-[var(--term-dim)] hover:text-[var(--term-bg)] transition-all',
  input: 'bg-transparent border-none text-[var(--term-fg)] font-mono outline-none uppercase tracking-wider w-full',
  header: 'border-b border-[var(--term-fg)] px-2 py-1 md:px-4 md:py-2',
  text: 'text-[var(--term-fg)] font-mono uppercase tracking-wider',
  accent: 'text-[var(--term-accent)]',
  dim: 'text-[var(--term-dim)]',
  glow: 'glow-text',
  grid: 'terminal-grid',
  cursor: 'terminal-cursor',
}

export const breakpoints = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
}

export function isMobile() {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

export function formatTerminalTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
}

export function generateSessionId(): string {
  // Generate a simple timestamp-based ID
  const timestamp = Date.now().toString(36).slice(-6).toUpperCase()
  return `MOGUL_${timestamp}`
}