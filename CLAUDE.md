# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## WealthWave Project Overview

WealthWave is an AI-powered wealth mindset music generator that transforms daily activities into wealth-building experiences through custom-generated music designed to reprogram minds for success.

## Tech Stack & Architecture

### Core Technologies
- **Next.js 15.4.6** with App Router
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** for styling
- **Zustand** for global state management
- **ElevenLabs API** for AI music generation
- **Radix UI** for accessible component primitives
- **Framer Motion** for animations

### Project Structure
```
wealthwave/
├── app/                      # Next.js App Router
│   ├── api/generate-music/  # Music generation API endpoint
│   ├── share/[id]/          # Dynamic share pages
│   └── page.tsx             # Main application page
├── components/              # React components
│   ├── music-player.tsx    # Audio player component
│   └── scenario-card.tsx   # Wealth scenario cards
├── lib/                     # Core utilities
│   ├── scenarios.ts        # Wealth scenario definitions
│   ├── store.ts           # Zustand store
│   ├── storage.ts         # Local storage management
│   ├── share.ts           # Sharing functionality
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # Utility functions
└── public/                 # Static assets
```

## Development Commands

```bash
# Install dependencies (using bun)
bun install

# Run development server
bun dev

# Build for production
bun build

# Start production server
bun start

# Run linting
bun lint
```

## Environment Configuration

Required environment variables in `.env.local`:
```
# Required
ELEVENLABS_API_KEY=your_api_key_here  # Required for music generation

# Optional - for cloud storage
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id  
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://your-custom-domain.com

# App branding
NEXT_PUBLIC_APP_NAME=WealthWave
NEXT_PUBLIC_APP_DESCRIPTION='AI-powered wealth mindset music generator'
```

## Key Implementation Details

### Music Generation Flow
1. User selects a wealth scenario or uses Craft Studio for custom generation
2. Frontend sends POST request to `/api/generate-music` with prompt and duration
3. API validates parameters (duration: 10-300 seconds)
4. Calls ElevenLabs Music API with custom wealth-focused prompt
5. Audio is automatically uploaded to Cloudflare R2 (if configured)
6. Returns audio buffer with optional R2 URL in headers
7. Client creates blob URL for playback and stores in IndexedDB for offline access

### State Management
- Global state managed with Zustand (`lib/store.ts`)
- Tracks music generations, current playback, and generation status
- Persists generation history to localStorage

### Sharing System
- Generates unique share IDs for each music generation
- Uses R2 URLs for permanent storage when available
- Falls back to localStorage with base64 encoding
- Dynamic share pages at `/share/[id]` route

### Storage Architecture
- **Cloudflare R2**: Permanent cloud storage with custom domain
- **IndexedDB**: Local browser storage for audio blobs
- **localStorage**: Metadata and fallback for sharing

### Path Aliases
- `@/*` resolves to project root (configured in tsconfig.json)

## API Integration

### ElevenLabs Music API
- Endpoint: `https://api.elevenlabs.io/v1/music`
- Model: `music_v1`
- Duration range: 10,000ms - 300,000ms
- Requires paid ElevenLabs account

## Features

### Wealth Scenarios
Eight predefined scenarios with specific prompts:
- Morning Mogul - Start day with titan energy
- Deal Closer - Channel inner closer
- Focus Flow - Deep work for empire building
- Victory Lap - Celebrate wins
- Night Hustle - Build while others sleep
- Abundance Meditation - Reprogram wealth consciousness
- Power Commute - Transform drive time
- Wealth Warrior - Gym session for financial gladiators

### Craft Studio
Custom music generation with fine-tuned controls:
- **Genre Selection**: Electronic, Hip Hop, Cinematic, Classical, Rock, Ambient
- **Vibe Options**: Epic, Chill, Aggressive, Uplifting, Dark, Mystical
- **Energy Levels**: Low, Moderate, High, Extreme
- **Blend Mode**: Combine custom prompts with production settings
- **Live Preview**: See generated prompt before creating music

## Design System

- **Color Scheme**: Black & gold luxury aesthetic
- **Typography**: System fonts with bold headings
- **Animations**: Smooth transitions via Framer Motion
- **Responsive**: Mobile-first design approach