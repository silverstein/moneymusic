export type TerminalTheme = {
  id: string
  name: string
  description: string
  colors: {
    bg: string
    fg: string
    accent: string
    dim: string
    grid: string
    error: string
    success: string
    warning: string
    info: string
    glow: string
    scanline: string
    cursor: string
  }
  effects: {
    crt: boolean
    scanlines: boolean
    glow: boolean
    noise: boolean
  }
}

export const TERMINAL_THEMES: Record<string, TerminalTheme> = {
  bloomberg: {
    id: 'bloomberg',
    name: 'BLOOMBERG',
    description: 'Classic financial terminal',
    colors: {
      bg: '#000000',
      fg: '#FFA500',
      accent: '#FFD700',
      dim: '#806000',
      grid: '#0F0F0F',
      error: '#FF4444',
      success: '#00FF00',
      warning: '#FFFF00',
      info: '#00FFFF',
      glow: 'rgba(255, 165, 0, 0.5)',
      scanline: 'rgba(255, 165, 0, 0.03)',
      cursor: '#FFA500'
    },
    effects: {
      crt: true,
      scanlines: true,
      glow: true,
      noise: false
    }
  },
  matrix: {
    id: 'matrix',
    name: 'MATRIX',
    description: 'Follow the white rabbit',
    colors: {
      bg: '#000000',
      fg: '#00FF00',
      accent: '#00FF00',
      dim: '#008000',
      grid: '#001100',
      error: '#FF0000',
      success: '#00FF00',
      warning: '#FFFF00',
      info: '#00FFFF',
      glow: 'rgba(0, 255, 0, 0.6)',
      scanline: 'rgba(0, 255, 0, 0.02)',
      cursor: '#00FF00'
    },
    effects: {
      crt: true,
      scanlines: true,
      glow: true,
      noise: true
    }
  },
  ibm3278: {
    id: 'ibm3278',
    name: 'IBM 3278',
    description: 'Mainframe terminal classic',
    colors: {
      bg: '#0A2E0A',
      fg: '#00FF00',
      accent: '#00FF00',
      dim: '#00AA00',
      grid: '#0F3F0F',
      error: '#FF0000',
      success: '#00FF00',
      warning: '#FFFF00',
      info: '#00FFFF',
      glow: 'rgba(0, 255, 0, 0.4)',
      scanline: 'rgba(0, 255, 0, 0.03)',
      cursor: '#00FF00'
    },
    effects: {
      crt: true,
      scanlines: true,
      glow: false,
      noise: false
    }
  },
  amber: {
    id: 'amber',
    name: 'AMBER CRT',
    description: 'Warm phosphor glow',
    colors: {
      bg: '#1A0F00',
      fg: '#FFAA00',
      accent: '#FFC840',
      dim: '#AA7700',
      grid: '#2A1F00',
      error: '#FF0000',
      success: '#00FF00',
      warning: '#FFFF00',
      info: '#00AAFF',
      glow: 'rgba(255, 170, 0, 0.5)',
      scanline: 'rgba(255, 170, 0, 0.03)',
      cursor: '#FFAA00'
    },
    effects: {
      crt: true,
      scanlines: true,
      glow: true,
      noise: false
    }
  },
  hacker: {
    id: 'hacker',
    name: 'HACKER',
    description: 'Pure terminal essence',
    colors: {
      bg: '#000000',
      fg: '#00FF00',
      accent: '#00FF00',
      dim: '#006600',
      grid: '#001100',
      error: '#FF0000',
      success: '#00FF00',
      warning: '#FFFF00',
      info: '#0088FF',
      glow: 'rgba(0, 255, 0, 0.8)',
      scanline: 'rgba(0, 255, 0, 0.01)',
      cursor: '#00FF00'
    },
    effects: {
      crt: false,
      scanlines: false,
      glow: true,
      noise: false
    }
  },
  synthwave: {
    id: 'synthwave',
    name: 'SYNTHWAVE',
    description: 'Cyberpunk trader mode',
    colors: {
      bg: '#0A0014',
      fg: '#FF00FF',
      accent: '#00FFFF',
      dim: '#8800AA',
      grid: '#1A0033',
      error: '#FF0066',
      success: '#00FF99',
      warning: '#FFFF00',
      info: '#00AAFF',
      glow: 'rgba(255, 0, 255, 0.6)',
      scanline: 'rgba(255, 0, 255, 0.02)',
      cursor: '#00FFFF'
    },
    effects: {
      crt: true,
      scanlines: true,
      glow: true,
      noise: true
    }
  },
  paper: {
    id: 'paper',
    name: 'PAPER',
    description: 'Light mode for psychopaths',
    colors: {
      bg: '#FFFFF8',
      fg: '#000000',
      accent: '#0000FF',
      dim: '#666666',
      grid: '#DDDDDD',
      error: '#CC0000',
      success: '#008800',
      warning: '#CC8800',
      info: '#0066CC',
      glow: 'rgba(0, 0, 0, 0.1)',
      scanline: 'rgba(0, 0, 0, 0.01)',
      cursor: '#000000'
    },
    effects: {
      crt: false,
      scanlines: false,
      glow: false,
      noise: false
    }
  },
  blood: {
    id: 'blood',
    name: 'BLOOD',
    description: 'Bear market mode',
    colors: {
      bg: '#000000',
      fg: '#FF0000',
      accent: '#FF6666',
      dim: '#880000',
      grid: '#1A0000',
      error: '#FFFFFF',
      success: '#00FF00',
      warning: '#FFAA00',
      info: '#FF8888',
      glow: 'rgba(255, 0, 0, 0.6)',
      scanline: 'rgba(255, 0, 0, 0.02)',
      cursor: '#FF0000'
    },
    effects: {
      crt: true,
      scanlines: true,
      glow: true,
      noise: false
    }
  }
}

export const DEFAULT_THEME = 'bloomberg'