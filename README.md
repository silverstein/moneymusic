# WealthWave 💰🎵

AI-powered wealth mindset music generator. Transform your daily activities into wealth-building experiences with custom-generated music designed to reprogram your mind for success.

## Features

- 🎯 **8 Wealth Scenarios**: From "Morning Mogul" to "Wealth Warrior" - music for every money-making moment
- 🎵 **AI Music Generation**: Powered by ElevenLabs' cutting-edge music API
- 💎 **Luxury Design**: Black & gold aesthetic that screams success (no generic purple gradients!)
- 🎧 **Custom Player**: Built-in music player with volume control and progress tracking
- 🎨 **Craft Studio**: Fine-tune your vibe with genre, energy, and custom prompts
- ☁️ **Cloud Storage**: Permanent storage with Cloudflare R2 (optional)
- 📚 **Music Library**: Save and manage all your generated tracks
- 🔗 **Shareable Links**: Share your wealth frequencies with others
- 💾 **Local Backup**: IndexedDB storage for offline access
- ⚡ **Instant Generation**: 10 seconds to 5 minutes of wealth-focused music
- 🧠 **Mindset Programming**: Music designed to activate your millionaire mindset

## Tech Stack

- **Next.js 15.4.6**
- **TypeScript** - Type-safe development
- **Tailwind CSS v4**
- **shadcn/ui** - Component library
- **Ultracite 5.2.3** - AI-powered development assistantAI-ready formatter that helps you write and generate code faster
- **ElevenLabs Music API** - AI music generation
- **Framer Motion** - Animation library
- **Zustand** - Lightweight state management
- **Radix UI** - Accessible, unstyled component primitives
- **Lucide React** - Icons
- **Terminal UI Components** - Custom terminal-style ticker and layout components

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Create `.env.local` with your API keys:
   ```bash
   # Required
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   
   # Optional - for cloud storage
   R2_ACCOUNT_ID=your_cloudflare_account_id
   R2_ACCESS_KEY_ID=your_r2_access_key
   R2_SECRET_ACCESS_KEY=your_r2_secret_key
   R2_BUCKET_NAME=your_bucket_name
   R2_PUBLIC_URL=https://your-custom-domain.com

   # Optional - abuse mitigation
   GENERATION_SECRET=your_shared_secret
   REQUIRE_BOT_ID=false
   ```

4. Run the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Wealth Scenarios

- **Morning Mogul**: Start your day with titan energy
- **Deal Closer**: Channel your inner closer
- **Focus Flow**: Deep work for empire building
- **Victory Lap**: Celebrate your wins
- **Night Hustle**: Build while others sleep
- **Abundance Meditation**: Reprogram your wealth consciousness
- **Power Commute**: Transform your drive time
- **Wealth Warrior**: Gym session for financial gladiators

## API Requirements

- Paid ElevenLabs account required
- Music duration: 10 seconds to 5 minutes
- Supports multilingual prompts

## License

MIT - Build your wealth empire
