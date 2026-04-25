# AGENTS.md

Guidance for coding agents working in this repository.

## Project Shape

This is a static browser app. There is no package manager, framework, bundler, or build step.

Primary files:

- `index.html`
- `styles.css`
- `app.js`

## Working Rules

- Keep the app usable by opening `index.html` directly from the filesystem.
- Do not add a build system unless the user asks for one.
- Keep dependencies at zero unless a feature clearly requires otherwise.
- Prefer plain JavaScript, HTML, and CSS that are easy for a parent or teacher to inspect.
- Preserve browser-local progress behavior unless intentionally changing storage.
- Keep UI copy kid-friendly, short, and calm.

## Data Notes

The Fry sight-word list lives in `app.js` as readable source rows and is flattened at runtime.

Progress is tracked by word index rather than word text because the Fry 1,000 source includes repeated words.

## Verification

At minimum, run:

```bash
node --check app.js
```

When changing interactions, manually open `index.html` and test:

- changing word sets
- flashcard next/previous
- marking known words
- starring words
- listen-and-find mode
- type-it mode
- known/starred filters
