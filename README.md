# Custom Learning App

A local-first learning app for multiple kids and multiple learning modules.

The first active module is **Sight Words**, using the Fry 1,000 word list. Each learner has their own known words, starred words, and practice history. The app is built with React and Vite, packaged with Tauri, and stores durable desktop data in SQLite.

## Current Stack

- React for the UI
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
- Planned module slots for Math Facts and Spelling

## Project Layout

- `index.html` - Vite entry document
- `src/main.jsx` - React app shell and current practice UI
- `src/styles.css` - application styling
- `src/data/fryWords.js` - Fry 1,000 source rows and flattened word list
- `src/modules/index.js` - module registry
- `src/storage/learningStorage.js` - storage adapter for SQLite and browser fallback
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
  setSize: 50,
  itemLabel: "word",
  itemLabelPlural: "words"
}
```

Future modules should fit the same navigation model: learner-scoped progress, module-scoped attempts, and small practice sets.

## Verification

Before committing UI or storage changes, run:

```bash
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
- `src-tauri/target/`
- `src-tauri/gen/`
