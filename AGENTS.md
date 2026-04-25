# AGENTS.md

Guidance for coding agents working in this repository.

## Project Shape

This is a local-first React/Vite app packaged with Tauri. The desktop app uses SQLite through the Tauri SQL plugin.

Primary files:

- `index.html`
- `src/main.jsx`
- `src/styles.css`
- `src/data/fryWords.js`
- `src/modules/index.js`
- `src/storage/learningStorage.js`
- `src-tauri/`

## Working Rules

- Keep the app runnable with `npm run dev` for web preview and `npm run tauri -- dev` for desktop development.
- Do not bypass the storage adapter from UI components.
- Prefer plain JavaScript, HTML, and CSS that are easy for a parent or teacher to inspect.
- Preserve browser-local progress behavior unless intentionally changing storage.
- Keep UI copy kid-friendly, short, and calm.
- Keep learner progress scoped by learner and module.
- Keep modules registered in `src/modules/index.js` so new learning areas can share the same navigation and profile system.

## Data Notes

The Fry sight-word list lives in `src/data/fryWords.js` as readable source rows and is flattened at runtime.

Progress is tracked by word index rather than word text because the Fry 1,000 source includes repeated words.

The Tauri app stores learners, progress, attempts, and settings in SQLite. The web preview falls back to `localStorage`.

## Verification

At minimum, run:

```bash
npm run build
```

For desktop storage changes, also run:

```bash
npm run tauri -- build --debug
```

When changing interactions, manually open `index.html` and test:

- changing word sets
- flashcard next/previous
- marking known words
- starring words
- listen-and-find mode
- type-it mode
- known/starred filters
- adding and switching learners
- confirming progress differs between learners
- module tabs remain stable on desktop and mobile
