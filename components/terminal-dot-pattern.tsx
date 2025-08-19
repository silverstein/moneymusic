'use client'

import { cn } from '@/lib/terminal-utils'
import { useId } from 'react'

interface DotPatternProps {
  className?: string
  width?: number
  height?: number
  x?: number
  y?: number
  cr?: number
  fill?: string
}

export function TerminalDotPattern({
  className,
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cr = 1,
  fill = 'var(--term-grid)',
}: DotPatternProps) {
  const id = useId()

  return (
    <svg
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full',
        className
      )}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle
            id="pattern-circle"
            cx={width / 2}
            cy={height / 2}
            r={cr}
            fill={fill}
            opacity={0.3}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}