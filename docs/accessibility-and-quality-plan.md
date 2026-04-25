# Accessibility and Quality Plan

## Goals

Keep the app inclusive by default and catch regressions before they reach learners.

## Font defaults

The app uses a readability-first font stack in `src/app.css`:

```css
font-family: "Atkinson Hyperlegible", Lexend, Verdana, "Trebuchet MS", system-ui, sans-serif;
```

Atkinson Hyperlegible is the preferred target because it was designed for clear character distinction. Lexend is a strong secondary choice for reducing visual crowding. Verdana and Trebuchet MS provide broadly available fallbacks.

## Tooling

Run these before merging UI changes:

```bash
npm run format
npm run check
npm run lint
npm run build
```

For desktop, Tauri, SQLite, or permission changes, also run:

```bash
npm run tauri -- build --debug
```

## Rules and defaults

- Prettier formats JS, CSS, Markdown, JSON, and Svelte files.
- ESLint uses recommended JavaScript and Svelte rules.
- `svelte-check` catches Svelte compiler and accessibility diagnostics.
- Generated folders are ignored: `build/`, `.svelte-kit/`, `dist/`, `src-tauri/target/`.

## Accessibility expectations

- Keep visible focus rings.
- Use semantic controls before custom controls.
- Label inputs and icon-only buttons.
- Do not communicate state with color alone.
- Keep touch targets at least 44px.
- Prefer calm, plain language.
- Avoid harsh red error states in learner mode.
- Respect reduced-motion preferences before adding animation.

## Manual smoke checks

- Navigate core practice controls by keyboard.
- Confirm focus is visible on buttons, selects, inputs, and chips.
- Confirm the word card is readable at narrow widths.
- Confirm known/starred/current states are visible beyond color alone.
- Try browser zoom at 200%.
- Try the app with system font defaults when Atkinson/Lexend are unavailable.
