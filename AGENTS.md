# AGENTS.md

Guidance for coding agents in this repo.

## App shape

- Local-first SvelteKit app styled with Skeleton/Tailwind and packaged with Tauri.
- Desktop persistence uses SQLite via `@tauri-apps/plugin-sql`.
- Web preview must keep using the storage adapter's `localStorage` fallback.
- Current active module: `sightWords` in `src/modules/index.js`.

## Core boundaries

- Svelte routes/components must use `src/storage/learningStorage.js`; do not call SQLite or `localStorage` directly from UI code.
- Browser-only storage and speech APIs belong behind `onMount`, event handlers, or browser guards.
- Learner progress is scoped by `learnerId`, `moduleId`, and item index. Do not key progress by item text; Fry words include duplicates.
- New learning modules belong in `src/modules/index.js` and should fit the existing learner/profile/progress model.
- Keep UI copy short, kid-friendly, and calm.
- Commit to Skeleton for standard UI: prefer Skeleton utilities/components for buttons, inputs, selects, cards, badges, and progress before adding custom CSS.
- Preserve accessibility defaults: semantic controls, labels for inputs/icon buttons, visible focus, and no color-only status.
- Prefer the readability-first font stack in `src/app.css`; Atkinson Hyperlegible and Lexend are preferred when available.
- Avoid new dependencies unless they remove real complexity.

## Important files

- `src/routes/+page.svelte` - app shell and practice UI
- `src/app.css` - Skeleton/Tailwind imports, style tokens, visual design
- `src/storage/learningStorage.js` - SQLite/browser storage boundary
- `src/modules/index.js` - module registry
- `src/data/fryWords.js` - Fry word data
- `src-tauri/tauri.conf.json` - Tauri config; frontend build output is `../build`
- `src-tauri/capabilities/default.json` - desktop permissions, including SQL access
- `eslint.config.js`, `.prettierrc` - linting and formatting defaults

## Verification

- Run `npm run format`, `npm run check`, `npm run lint`, and `npm run build` for UI/storage changes.
- Also run `npm run tauri -- build --debug` after Tauri, Rust, SQLite, or permission changes.
- Manual smoke check interaction changes: learner add/switch, per-learner progress, set changes, known/learning/starred filters, flash/listen/type modes, and mobile-width layout.

## Git hygiene

Do not commit generated outputs or installed dependencies: `node_modules/`, `dist/`, `build/`, `.svelte-kit/`, `src-tauri/target/`, `src-tauri/gen/`, `.pi-lens/`.
