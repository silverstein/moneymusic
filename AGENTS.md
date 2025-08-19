# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router pages, layout, API routes (`app/api/*`).
- `components/`: Reusable UI components (filenames kebab-case `.tsx`).
- `lib/`: Client/server helpers (storage, R2, scenarios, state).
- `public/`: Static assets.
- `scripts/`: One-off utilities (e.g., `generate-r2-credentials.js`).
- Config: `biome.jsonc`, `next.config.ts`, `tsconfig.json`, `.husky/`.

## Build, Test, and Development Commands
- Install: `bun install`
- Dev server: `bun dev` (http://localhost:3000)
- Build: `bun run build`
- Start production: `bun start`
- Lint: `bun run lint`
- Format (pre-commit runs this): `bun x ultracite format`

## Coding Style & Naming Conventions
- Language: TypeScript with strict settings (`tsconfig.json`).
- Linting: Next + ESLint (`next lint`).
- Formatting: Biome with the `ultracite` preset; 2-space indentation enforced.
- Components: PascalCase exports; filenames kebab-case (e.g., `music-player.tsx`).
- Utilities: place in `lib/` with concise names (e.g., `storage.ts`, `r2.ts`).
- Styling: Tailwind CSS 4 utilities; prefer class utilities over inline styles.

## Testing Guidelines
- No formal test suite yet. Perform manual QA for key flows:
  - Generate audio, play in player, save to library, share link, optional R2 upload.
- If adding tests, co-locate `*.test.ts(x)` near sources or under `__tests__/`; prefer Vitest + Testing Library or Playwright for e2e. Add scripts before committing.

## Commit & Pull Request Guidelines
- Commits: imperative, concise, scoped. Example: "Refactor Craft Studio prompt blending" or "Add R2 URL handling to share page".
- PRs must include:
  - Clear description and rationale; link issues.
  - UI screenshots/GIFs for visible changes.
  - Notes on env/config changes (`.env.local`).
  - Verification that `bun run lint` and `bun x ultracite format` pass.

## Security & Configuration Tips
- Secrets live in `.env.local` (see README keys: `ELEVENLABS_API_KEY`, optional R2 vars). Do not commit env files.
- Avoid committing large media; prefer R2 storage and `public/` only for small static assets.
