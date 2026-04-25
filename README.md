# Custom Learning App

An interactive local-first learning app for multiple kids and learning modules.

The app currently includes the Fry 1,000 sight words and supports multiple learner profiles, so each kid can have their own learning path, starred words, and progress. It is now built with React/Vite and packaged as a Tauri desktop app with SQLite storage.

## Open the App

Install dependencies:

```bash
npm install
```

Run the web development preview:

```bash
npm run dev
```

Run the desktop app in development:

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

The debug build creates a macOS app and DMG under:

```text
/Users/adam/custom-learning-app/src-tauri/target/debug/bundle/
```

## Features

- Fry 1,000 sight-word list
- Multiple learner profiles
- Per-learner progress and starred words
- Module tabs for future learning areas
- 50-word practice sets
- Flashcard mode
- Listen-and-find quiz mode
- Type-it quiz mode
- Browser speech synthesis for word pronunciation
- Known-word tracking
- Starred-word practice
- SQLite storage in the Tauri app
- Browser fallback storage during web preview

## Files

- `src/main.jsx` - React app shell and sight-word practice UI
- `src/styles.css` - layout and visual design
- `src/data/fryWords.js` - Fry 1,000 source data
- `src/modules/index.js` - module registry
- `src/storage/learningStorage.js` - SQLite storage adapter with browser fallback
- `src-tauri/` - Tauri desktop shell and SQLite plugin configuration

## Development

Run a production frontend build with:

```bash
npm run build
```

## Notes

Progress is stored in SQLite when the app runs under Tauri. When opened as a normal web preview, the storage adapter falls back to `localStorage` so the UI can still be developed quickly.

The current active module is `Sight Words`. `Math Facts` and `Spelling` are present as planned module slots so the app can grow without changing the overall navigation model.
