# Custom Learning App

An interactive sight-word practice app built for local, browser-based learning.

The app currently includes the Fry 1,000 sight words and lets a learner practice in small sets with flashcards, pronunciation, quizzes, starred words, and saved progress.

## Open the App

Open `index.html` in a browser:

```text
/Users/adam/custom-learning-app/index.html
```

No build step or server is required.

## Features

- Fry 1,000 sight-word list
- 50-word practice sets
- Flashcard mode
- Listen-and-find quiz mode
- Type-it quiz mode
- Browser speech synthesis for word pronunciation
- Known-word tracking
- Starred-word practice
- Progress saved locally in the browser

## Files

- `index.html` - app markup
- `styles.css` - layout and visual design
- `app.js` - word data, practice modes, progress state, and interactions

## Development

Because this is a static app, edit the files directly and refresh the browser.

Run a quick JavaScript syntax check with:

```bash
node --check app.js
```

## Notes

Progress is stored in `localStorage` for the browser and file path where the app is opened. Clearing browser site data will reset known and starred words.
