'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/terminal-utils'

interface TerminalInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onSubmit?: () => void
  className?: string
}

export function TerminalInput({ 
  value, 
  onChange, 
  placeholder = '', 
  onSubmit,
  className 
}: TerminalInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit()
    }
  }

  return (
    <div 
      className={cn(
        'relative flex items-center border border-[var(--term-fg)] bg-[var(--term-bg)] px-3 py-2',
        isFocused && 'border-[var(--term-accent)] shadow-[0_0_10px_var(--term-glow)]',
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      <span className="text-[var(--term-accent)] mr-2">{'>'}</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-[var(--term-fg)] placeholder:text-[var(--term-dim)] font-mono uppercase tracking-wider"
        style={{ 
          background: 'transparent !important',
          border: 'none !important',
          padding: '0 !important'
        }}
      />
      {isFocused && <span className="terminal-cursor ml-1" />}
    </div>
  )
}