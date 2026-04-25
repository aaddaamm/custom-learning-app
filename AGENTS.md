# AGENTS.md

Guidance for coding agents working in this repository.

## Project Shape

This is a local-first React/Vite app packaged as a Tauri desktop app. The desktop app uses SQLite through `@tauri-apps/plugin-sql`.

The app is intended to support:

- multiple learners
- multiple learning modules
- per-learner module progress
- local-first persistence

## Important Files

- `index.html` - Vite entry document
- `src/main.jsx` - React app shell and practice UI
- `src/styles.css` - visual design
- `src/data/fryWords.js` - Fry 1,000 data source
- `src/modules/index.js` - module registry
- `src/storage/learningStorage.js` - storage boundary
- `src-tauri/tauri.conf.json` - Tauri app config
- `src-tauri/capabilities/default.json` - Tauri permissions, including SQL access
- `src-tauri/src/lib.rs` - Tauri plugin registration

## Working Rules

- Keep UI components behind the storage adapter. Do not call SQLite or `localStorage` directly from React components.
- Keep learner progress scoped by `learnerId`, `moduleId`, and item index.
- Keep modules registered in `src/modules/index.js`.
- Keep the app runnable with `npm run dev` for web preview.
- Keep the desktop app runnable with `npm run tauri -- dev`.
- Preserve the browser fallback storage unless intentionally replacing the development workflow.
- Keep UI copy short, kid-friendly, and calm.
- Avoid adding new dependencies unless they reduce real complexity.

## Storage Notes

`src/storage/learningStorage.js` exposes the app storage API.

In Tauri, it uses SQLite and creates:

- `learners`
- `progress`
- `attempts`
- `settings`

Outside Tauri, it falls back to `localStorage`.

Progress uses item indexes rather than item text because some learning content may contain repeated labels. The Fry 1,000 list already has repeated words.

## Module Notes

The current active module is `sightWords`.

`mathFacts` and `spelling` are planned placeholders. When implementing them, prefer adding module-specific data and behavior while preserving the shared learner/profile/progress model.

Expected module fields:

```js
{
  id,
  title,
  label,
  items,
  setSize,
  itemLabel,
  itemLabelPlural
}
```

## Verification

At minimum, run:

```bash
npm run build
```

For desktop, Tauri config, Rust, or SQLite changes, also run:

```bash
npm run tauri -- build --debug
```

Manual checks after interaction changes:

- add a learner
- switch learners
- confirm progress differs between learners
- change sight-word sets
- mark known and learning
- star and unstar words
- use flashcard mode
- use listen-and-find mode
- use type-it mode
- try known/starred/learning filters
- confirm module tabs still render on desktop and mobile widths

## Git Hygiene

Do not commit generated outputs or installed dependencies:

- `node_modules/`
- `dist/`
- `src-tauri/target/`
- `src-tauri/gen/`
