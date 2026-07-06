# Repository Guidelines

## Project Structure & Module Organization

Espanolo is a self-hosted Spanish learning app with a React/Vite frontend and an Express API. Frontend code lives in `src/`: `App.jsx` contains the main UI, `main.jsx` mounts React, and `styles.css` holds Tailwind styling. Server code lives in `server/`, with routes in `server/index.js` and testable learning logic in `server/learning-core.js`. Database schema, migrations, and seed scripts are in `prisma/`. Generated lesson artwork is stored in `images/` and served at `/images/...`; static public assets live in `public/`. Planning notes and image prompts are kept in `asset.md`, `asset-vocabulary.md`, and `TODO.md`.

## Build, Test, and Development Commands

- `npm install`: install Node dependencies.
- `npm run dev`: start the Express/Vite development server on `PORT` or `5180`.
- `npm run build`: build the frontend with Vite for production.
- `npm start`: run the production Node server; build first.
- `npm test`: run Node’s built-in test runner.
- `npm run db:generate`: regenerate Prisma client after schema changes.
- `npm run db:push`: sync the Prisma schema to a local database.
- `npm run db:migrate`: create and apply a development migration.
- `npm run db:seed`: seed base app data; use specific seed scripts only when updating those content areas.

## Coding Style & Naming Conventions

Use JavaScript with CommonJS on the server and React components on the client. Follow the existing two-space indentation, double quotes, semicolons, and `camelCase` names. React components use `PascalCase`; constants use `UPPER_SNAKE_CASE` only for true configuration constants. Keep scheduling, answer evaluation, and normalization behavior in `server/learning-core.js` so it stays easy to test.

## Testing Guidelines

Tests use `node:test` and `node:assert/strict`. Place server unit tests beside covered code using `*.test.js`, as in `server/learning-core.test.js`. Add focused tests for answer evaluation, spaced-review scheduling, and logic that changes XP, streaks, or progress. Run `npm test` before submitting changes.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries such as `Improve mini-game round flow` and `Expand learning loop content and review flow`. Keep commits focused on behavior changed. Pull requests should include a short description, test results, database migration or seed notes when applicable, and screenshots or recordings for UI changes.

## Security & Configuration Tips

Copy `.env.example` to `.env` and set `DATABASE_URL`, `SESSION_SECRET`, `PORT`, and seed admin credentials. Do not commit `.env`, real secrets, production credentials, or private user data. When changing authentication, cookies, or pronunciation proxying, verify behavior in both development and production modes.
