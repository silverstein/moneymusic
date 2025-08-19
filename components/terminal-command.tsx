'use client'

import { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { cn, terminalClass, terminalStyles } from '@/lib/terminal-utils'
import { useMusicStore } from '@/lib/store'
import { wealthScenarios } from '@/lib/scenarios'
import { useTheme } from './theme-provider'

interface TerminalCommandProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TerminalCommand({ open, onOpenChange }: TerminalCommandProps) {
  const [search, setSearch] = useState('')
  const { isGenerating, setIsGenerating, setAudioUrl, addGeneration } = useMusicStore()
  const { setTheme, availableThemes } = useTheme()

  const handleCommand = async (command: string) => {
    onOpenChange(false)
    setSearch('')
    
    if (command.startsWith('theme:')) {
      const themeId = command.replace('theme:', '')
      setTheme(themeId)
      return
    }
    
    if (command.startsWith('generate:')) {
      const scenarioId = command.replace('generate:', '')
      const scenario = wealthScenarios.find(s => s.id === scenarioId)
      if (scenario && !isGenerating) {
        // TODO: Trigger music generation through parent component
        console.log('Generate music for:', scenario.title)
      }
      return
    }
    
    switch (command) {
      case 'help':
        console.log('WEALTHWAVE TERMINAL COMMANDS')
        console.log('============================')
        console.log('GENERATE <scenario> - Generate wealth music')
        console.log('THEME <theme> - Change terminal theme')
        console.log('CLEAR - Clear generation history')
        console.log('EXPORT - Export all tracks')
        break
      case 'clear':
        // TODO: Clear generations through parent component
        console.log('Clear generation history')
        break
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div 
        className="fixed inset-0" 
        onClick={() => onOpenChange(false)}
      />
      <Command
        className={cn(
          'relative max-w-2xl w-full max-h-[500px] overflow-hidden',
          'border-2 border-[var(--term-fg)] bg-[var(--term-bg)]',
          'shadow-[0_0_20px_var(--term-glow)]'
        )}
      >
        <div className={cn(terminalStyles.header, 'flex items-center gap-2')}>
          <span className={terminalStyles.accent}>{'>'}</span>
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="ENTER COMMAND..."
            className={cn(
              terminalStyles.input,
              'flex-1 placeholder:text-[var(--term-dim)]'
            )}
            autoFocus
          />
          <span className="terminal-cursor" />
        </div>
        
        <Command.List className="overflow-y-auto max-h-[400px] p-2">
          <Command.Empty className={cn(terminalStyles.text, terminalStyles.dim, 'p-4 text-center')}>
            NO MATCHING COMMANDS
          </Command.Empty>
          
          <Command.Group heading="GENERATION" className="mb-4">
            <div className={cn(terminalStyles.dim, 'px-2 py-1 text-xs mb-1')}>
              GENERATION COMMANDS
            </div>
            {wealthScenarios.map(scenario => (
              <Command.Item
                key={scenario.id}
                value={`generate ${scenario.id} ${scenario.title} ${scenario.description}`}
                onSelect={() => handleCommand(`generate:${scenario.id}`)}
                className={cn(terminalStyles.command, 'mx-2 flex items-center gap-2')}
                disabled={isGenerating}
              >
                <span className={terminalStyles.accent}>GEN</span>
                <span className={terminalStyles.text}>{scenario.id.toUpperCase().replace('-', '_')}</span>
                <span className={terminalStyles.dim}>- {scenario.title}</span>
              </Command.Item>
            ))}
          </Command.Group>
          
          <Command.Group heading="THEMES" className="mb-4">
            <div className={cn(terminalStyles.dim, 'px-2 py-1 text-xs mb-1')}>
              TERMINAL THEMES
            </div>
            {Object.values(availableThemes).map(theme => (
              <Command.Item
                key={theme.id}
                value={`theme ${theme.name} ${theme.description}`}
                onSelect={() => handleCommand(`theme:${theme.id}`)}
                className={cn(terminalStyles.command, 'mx-2 flex items-center gap-2')}
              >
                <span className={terminalStyles.accent}>THM</span>
                <span className={terminalStyles.text}>{theme.name}</span>
                <span className={terminalStyles.dim}>- {theme.description}</span>
              </Command.Item>
            ))}
          </Command.Group>
          
          <Command.Group heading="SYSTEM" className="mb-4">
            <div className={cn(terminalStyles.dim, 'px-2 py-1 text-xs mb-1')}>
              SYSTEM COMMANDS
            </div>
            <Command.Item
              value="help"
              onSelect={() => handleCommand('help')}
              className={cn(terminalStyles.command, 'mx-2')}
            >
              <span className={terminalStyles.accent}>SYS</span>
              <span className={terminalStyles.text}>HELP</span>
              <span className={terminalStyles.dim}>- Show commands</span>
            </Command.Item>
            <Command.Item
              value="clear history"
              onSelect={() => handleCommand('clear')}
              className={cn(terminalStyles.command, 'mx-2')}
            >
              <span className={terminalStyles.accent}>SYS</span>
              <span className={terminalStyles.text}>CLEAR</span>
              <span className={terminalStyles.dim}>- Clear generation history</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
        
        <div className={cn(terminalStyles.header, 'text-xs flex justify-between')}>
          <span className={terminalStyles.dim}>
            [↑↓] NAVIGATE [ENTER] SELECT [ESC] CANCEL
          </span>
          <span className={terminalStyles.dim}>
            CTRL+K TO TOGGLE
          </span>
        </div>
      </Command>
    </div>
  )
}