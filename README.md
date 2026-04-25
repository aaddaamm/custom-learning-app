# Custom Learning App

A local-first learning app for multiple kids and multiple learning modules.

The first active module is **Sight Words**, using the Fry 1,000 word list. Each learner has their own known words, starred words, and practice history. The app is built with SvelteKit, Skeleton/Tailwind, and Tauri, and stores durable desktop data in SQLite.

## Current Stack

- SvelteKit for the UI and routing
- Skeleton/Tailwind for design-system utilities, theme tokens, and Svelte components
- Vite for local web development and frontend builds
- Tauri for the desktop app shell
- SQLite through `@tauri-apps/plugin-sql`
- Browser `localStorage` fallback when running outside Tauri

## Getting Started

Install dependencies:

```bash
npm install
```

Run the web preview:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:1420/
```

Run the Tauri desktop app in development:

```bash
npm run tauri -- dev
```

Build the frontend:

```bash
npm run build
```

SvelteKit static output is written to:

```text
build/
```

Build the desktop app:

```bash
npm run tauri -- build
```

Build a faster debug desktop bundle:

```bash
npm run tauri -- build --debug
```

Debug desktop bundles are created under:

```text
src-tauri/target/debug/bundle/
```

## Features

- Multiple learner profiles
- Per-learner progress
- Per-learner starred words
- Fry 1,000 sight-word module
- 50-word practice sets
- Flashcard mode
- Listen-and-find mode
- Type-it mode
- Browser speech synthesis
- SQLite storage in the Tauri desktop app
- Browser fallback storage for quick web preview
- Kid-friendly colorful palette and style tokens layered on Skeleton in `src/app.css`

## Project Layout

- `src/app.html` - SvelteKit HTML shell
- `src/routes/+layout.svelte` - global CSS import
- `src/routes/+page.svelte` - app shell and current practice UI
- `src/app.css` - Skeleton/Tailwind imports, color tokens, and application styling
- `src/data/fryWords.js` - Fry 1,000 source rows and flattened word list
- `src/modules/index.js` - module registry
- `src/storage/learningStorage.js` - storage adapter for SQLite and browser fallback
- `svelte.config.js` - SvelteKit static adapter config
- `src-tauri/` - Tauri desktop app, Rust entry points, permissions, and bundling config

## Storage Model

UI code should talk to `src/storage/learningStorage.js`, not directly to SQLite or `localStorage`.

In Tauri, the storage adapter creates these SQLite tables:

- `learners`
- `progress`
- `attempts`
- `settings`

The web preview uses the same adapter API but stores data in `localStorage`. This keeps browser development fast while preserving SQLite as the real desktop storage path.

Progress is stored by learner, module, and item index. The app uses item indexes instead of word text because the Fry list contains repeated words.

## Module Model

Modules are registered in `src/modules/index.js`.

The active module shape is:

```js
{
  id: "sightWords",
  title: "Sight Words",
  label: "Fry 1,000",
  items: fryWords,
  setSize: 50
}
```

Future modules should fit the same navigation model: learner-scoped progress, module-scoped attempts, and small practice sets. Planned module work is tracked in GitHub issues rather than placeholder UI tabs.

## Roadmap

See `ROADMAP.md`. GitHub issues track the concrete checkpoints.

Planning docs:

- `docs/module-implementation-plan.md`
- `docs/parent-oversight-and-insights-plan.md`
- `docs/student-incentives-plan.md`
- `docs/kid-friendly-styleguide.md`
- `docs/accessibility-and-quality-plan.md`

## Verification

Before committing UI or storage changes, run:

```bash
npm run format
npm run check
npm run lint
npm run build
```

For Tauri or SQLite changes, also run:

```bash
npm run tauri -- build --debug
```

## Git

Build outputs and dependency folders are ignored:

- `node_modules/`
- `dist/`
- `build/`
- `.svelte-kit/`
- `src-tauri/target/`
- `src-tauri/gen/`
