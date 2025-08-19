'use client'

import { cn } from '@/lib/terminal-utils'

export function AsciiDivider({ type = 'single' }: { type?: 'single' | 'double' | 'thick' | 'dashed' }) {
  const getPattern = (length: number) => {
    switch(type) {
      case 'single': return '─'.repeat(length)
      case 'double': return '═'.repeat(length)
      case 'thick': return '━'.repeat(length)
      case 'dashed': return '- '.repeat(Math.floor(length/2))
      default: return '─'.repeat(length)
    }
  }
  
  return (
    <>
      {/* Desktop version */}
      <div className={cn('hidden md:block text-[var(--term-dim)] text-xs my-4 overflow-hidden whitespace-nowrap text-center')}>
        {getPattern(80)}
      </div>
      {/* Mobile version */}
      <div className={cn('md:hidden text-[var(--term-dim)] text-xs my-2 overflow-hidden text-center')}>
        {getPattern(30)}
      </div>
    </>
  )
}

export function AsciiBox({ children, title }: { children: React.ReactNode, title?: string }) {
  return (
    <div className="my-4">
      <pre className="text-[var(--term-fg)] text-xs leading-none">
{`┌${'─'.repeat(78)}┐`}
{title && `│ ${title.padEnd(76)} │`}
{`├${'─'.repeat(78)}┤`}
      </pre>
      <div className="px-2">{children}</div>
      <pre className="text-[var(--term-fg)] text-xs leading-none">
{`└${'─'.repeat(78)}┘`}
      </pre>
    </div>
  )
}

export function AsciiLogo() {
  return (
    <>
      {/* Desktop ASCII art */}
      <div className="hidden md:block">
        <pre className="text-[var(--term-accent)] text-xs leading-none text-center">
{`
██╗    ██╗███████╗ █████╗ ██╗  ████████╗██╗  ██╗██╗    ██╗ █████╗ ██╗   ██╗███████╗
██║    ██║██╔════╝██╔══██╗██║  ╚══██╔══╝██║  ██║██║    ██║██╔══██╗██║   ██║██╔════╝
██║ █╗ ██║█████╗  ███████║██║     ██║   ███████║██║ █╗ ██║███████║██║   ██║█████╗  
██║███╗██║██╔══╝  ██╔══██║██║     ██║   ██╔══██║██║███╗██║██╔══██║╚██╗ ██╔╝██╔══╝  
╚███╔███╔╝███████╗██║  ██║███████╗██║   ██║  ██║╚███╔███╔╝██║  ██║ ╚████╔╝ ███████╗
 ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝   ╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝  ╚═══╝  ╚══════╝
`}
        </pre>
      </div>
      
      {/* Mobile ASCII version - properly sized */}
      <div className="md:hidden">
        <pre className="text-[var(--term-accent)] text-[10px] leading-tight text-center">
{`
██╗    ██╗███████╗ █████╗ ██╗  ████████╗██╗  ██╗
██║ █╗ ██║█████╗  ███████║██║     ██║   ███████║
██║███╗██║██╔══╝  ██╔══██║██║     ██║   ██╔══██║
╚███╔███╔╝███████╗██║  ██║███████╗██║   ██║  ██║

██╗    ██╗ █████╗ ██╗   ██╗███████╗
██║ █╗ ██║██╔══██╗██║   ██║██╔════╝
██║███╗██║███████║██║   ██║█████╗  
╚███╔███╔╝██╔══██║╚██╗ ██╔╝██╔══╝  
 ╚══╝╚══╝ ██║  ██║ ╚████╔╝ ███████╗
          ╚═╝  ╚═╝  ╚═══╝  ╚══════╝
`}
        </pre>
      </div>
    </>
  )
}

export function AsciiTable({ headers, rows }: { headers: string[], rows: string[][] }) {
  const colWidths = headers.map((h, i) => 
    Math.max(h.length, ...rows.map(r => r[i]?.length || 0)) + 2
  )
  
  const separator = `+${colWidths.map(w => '─'.repeat(w)).join('+')}+`
  const headerRow = `│${headers.map((h, i) => ` ${h.padEnd(colWidths[i] - 1)}│`).join('')}`
  const dataRows = rows.map(row => 
    `│${row.map((cell, i) => ` ${cell.padEnd(colWidths[i] - 1)}│`).join('')}`
  )
  
  return (
    <pre className="text-[var(--term-fg)] text-xs overflow-x-auto">
{separator}
{headerRow}
{separator}
{dataRows.join('\n')}
{separator}
    </pre>
  )
}