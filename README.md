# Espanolo

Self-hosted Spanish grammar learning platform with multi-user accounts, lessons, spaced review, XP, streaks, badges, challenges, mini games, rankings, and AI image prompt planning.

The main learning flow now has two equal pillars:

- `Path`: a guided A1 map with category nodes, teach/example sections, vocabulary previews, active recall, and checkpoint quizzes.
- `Words`: grouped vocabulary decks with image cards, recognition practice, typing recall, XP, and spaced review scheduling.

## Product Roadmap

The long-term curriculum and implementation plan live in `docs/`:

- [Spanish Learning Roadmap](docs/spanish-learning-roadmap.md): learner journey from near-zero Spanish to advanced maintenance.
- [Curriculum Map](docs/curriculum-map.md): CEFR units, lesson standards, checkpoints, and content scope.
- [Implementation Plan](docs/implementation-plan.md): milestones and the next concrete build steps.

## Stack

- Node 20
- React + Vite
- Express API/server
- PostgreSQL + Prisma
- Tailwind CSS

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a PostgreSQL database and user. On this machine, the intended local values are:

   ```bash
   su - postgres -c "psql -d postgres -c \"CREATE USER espanolo WITH PASSWORD 'change-me';\""
   su - postgres -c "createdb -O espanolo espanolo"
   ```

3. Copy `.env.example` to `.env` and set:

   ```bash
   DATABASE_URL="postgresql://espanolo:change-me@127.0.0.1:5432/espanolo?schema=public"
   SESSION_SECRET="replace-with-a-long-random-secret"
   PORT=5180
   SEED_ADMIN_EMAIL="admin@espanolo.local"
   SEED_ADMIN_PASSWORD="change-me"
   ```

4. Generate Prisma, create tables, and seed content:

   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. Start development mode:

   ```bash
   npm run dev
   ```

   Open `http://localhost:5180`.

## Production

Build the frontend and run the single Node server:

```bash
npm run build
NODE_ENV=production npm start
```

The server binds to `0.0.0.0:${PORT}` and is ready to sit behind a reverse proxy. Ports already observed in use on this host include `3000`, `3001`, `5174`, and `8765`, so the default app port is `5180`.

## Seed Accounts

- Admin: `admin@espanolo.local` / value of `SEED_ADMIN_PASSWORD`
- Demo learner: `ana@example.local` / `demo1234`

Change these for a real deployment.

## Pronunciation Audio

Vocabulary cards include a listen button that streams real external pronunciation clips through the local server. The resolver checks SpanishDict first and LEO second, caches resolved source URLs in memory, and serves the selected MP3 through `/api/pronunciation/audio?text=...`. Browser TTS is not used.

## AI Assets

See [asset.md](asset.md) for detailed 4x4 and 5x5 image-sheet prompts. The app does not generate images itself; those prompts are intended for external AI image generation and later import.

See [asset-vocabulary.md](asset-vocabulary.md) for the next batch of vocabulary-focused image prompts.

See [asset-roadmap.md](asset-roadmap.md) for future A2/B1 asset needs and the image-to-question alignment rules.

Generated WebP sheets live in `images/` and are served from `/images/...`. Lessons, words, and exercises reference cropped cells with `imageKey` values in this format:

```text
sheet-slug:cell-number
```

Examples: `food-and-ordering:17`, `travel-and-survival:8`, `emotions-and-states:3`.

Current image sheets include classroom, daily actions, emotions, food, grammar scenes, places, rewards, travel, fruit/produce, clothing, home objects, city transport, weather/time, people/family, body/health, numbers/colors, nature/animals, and mini-game UI rewards.

Run the asset audit before committing curriculum or quiz image changes:

```bash
npm run assets:audit
```

The audit validates referenced `imageKey` values and warns when non-content artwork appears in active exercises.
