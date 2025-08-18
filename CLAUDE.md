# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Wealth Music Generator** - A Next.js application that generates AI-powered music tracks tailored for wealth-building and success mindsets using the ElevenLabs Music API. The app provides various pre-configured wealth scenarios and allows custom music generation.

## Tech Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with CSS variables
- **UI Components**: shadcn/ui components (New York style)
- **Package Manager**: pnpm
- **External API**: ElevenLabs Music API for audio generation
- **Deployment**: Vercel (auto-synced with v0.app)

## Essential Commands

```bash
# Development
pnpm dev        # Start development server

# Build & Production
pnpm build      # Build for production
pnpm start      # Start production server

# Code Quality
pnpm lint       # Run Next.js linter
```

## Environment Configuration

The application requires an ElevenLabs API key:

```bash
# .env.local
ELEVENLABS_API_KEY=your_api_key_here
```

**Note**: The ElevenLabs Music API requires a paid plan. Free tier will return `limited_access` errors.

## Architecture

### API Routes
- `/app/api/generate-music/route.ts` - POST endpoint that interfaces with ElevenLabs Music API
  - Accepts: `{ prompt: string, duration: number }` 
  - Returns: Audio buffer (MP3) or error response
  - Handles paid plan requirements with specific error codes

### Core Components
- `/components/wealth-music-generator.tsx` - Main UI component with:
  - Pre-configured wealth scenarios (morning motivation, focus sessions, networking, etc.)
  - Custom prompt interface
  - Audio player with advanced controls
  - Track history management
  - Duration and style selectors

### UI Components
All UI components are in `/components/ui/` using shadcn/ui patterns with Radix UI primitives.

## Development Notes

### Build Configuration
The project has relaxed build checks in `next.config.mjs`:
- ESLint errors ignored during builds
- TypeScript errors ignored during builds
- Images are unoptimized

### Path Aliases
- `@/*` maps to project root
- `@/components` for component imports
- `@/lib` for utilities

### v0.app Integration
This project auto-syncs with v0.app deployments. Changes made in v0.app are automatically pushed to this repository.

## Key Features

1. **Wealth Scenarios**: Pre-configured music generation prompts for different success-oriented activities
2. **Custom Generation**: Freeform prompt input for personalized tracks
3. **Track Management**: History of generated tracks with playback controls
4. **Duration Control**: Adjustable track length (30s to 5 minutes)
5. **Advanced Player**: Full audio controls including loop, shuffle, volume, and track navigation