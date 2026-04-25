# Custom Learning App

An interactive learning app built for local, browser-based practice.

The app currently includes the Fry 1,000 sight words and supports multiple learner profiles, so each kid can have their own learning path, starred words, and progress.

## Open the App

Open `index.html` in a browser:

```text
/Users/adam/custom-learning-app/index.html
```

No build step or server is required.

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
- Progress saved locally in the browser by learner and module

## Files

- `index.html` - app markup
- `styles.css` - layout and visual design
- `app.js` - module data, learner profiles, practice modes, progress state, and interactions

## Development

Because this is a static app, edit the files directly and refresh the browser.

Run a quick JavaScript syntax check with:

```bash
node --check app.js
```

## Notes

Progress is stored in `localStorage` for the browser and file path where the app is opened. Clearing browser site data will reset learners, known words, and starred words.

The current active module is `Sight Words`. `Math Facts` and `Spelling` are present as planned module slots so the app can grow without changing the overall navigation model.
