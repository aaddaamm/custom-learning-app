# Kid-Friendly Styleguide

## Direction

The app should feel bright, safe, and encouraging: more “playful learning room” than “school dashboard.” Use rounded shapes, soft contrast, large touch targets, and calm celebrations.

The UI should commit to Skeleton as the shared design-system layer. Use Skeleton themes, utilities, and Svelte components where they reduce custom code, then layer the kid-friendly palette on top for app identity.

## Personality

- Warm
- Curious
- Encouraging
- Colorful
- Calm

Avoid:

- Harsh reds for mistakes
- Dense dashboards in learner mode
- Competitive language between learners
- Flashy or noisy effects that interrupt practice

## Color palette

| Token     | Hex       | Use                                    |
| --------- | --------- | -------------------------------------- |
| Banana    | `#FFD166` | Warm highlights, gentle celebration    |
| Melon     | `#FF8FA3` | Friendly accents, encouragement        |
| Bubblegum | `#FF70B8` | Special actions, playful accents       |
| Sky       | `#56CFE1` | Secondary actions, calm focus          |
| Ocean     | `#4D96FF` | Primary actions, links, selected state |
| Mint      | `#7BD88F` | Known/completed/success states         |
| Grape     | `#8E7DFF` | Progress gradients, magical accents    |
| Cream     | `#FFF7DF` | App background                         |
| Paper     | `#FFFFFF` | Cards and panels                       |
| Ink       | `#243047` | Main text                              |
| Slate     | `#66708A` | Muted text                             |

## Semantic usage

- Primary action: Ocean → Grape gradient.
- Positive progress: Mint, optionally with Sky.
- Starred/special: Banana.
- Try-again states: use neutral Slate text with warm guidance; do not use alarm red.
- Parent/admin surfaces can use quieter Paper, Cream, and Slate with small color accents.

## Shape and spacing

- Cards: large radius, about `24px-34px`.
- Buttons/inputs: rounded rectangles, about `16px-18px`.
- Touch targets: at least `44px`, preferably `48px+`.
- Use spacious layouts and avoid cramming learner controls.

## Typography

Use a readability-first stack that favors dyslexia- and low-vision-friendly fonts when they are available on the device:

```css
font-family: "Atkinson Hyperlegible", Lexend, Verdana, "Trebuchet MS", system-ui, sans-serif;
```

Preferred choices:

- **Atkinson Hyperlegible**: best default goal for readability and character distinction.
- **Lexend**: friendly, spacious, and designed to reduce visual crowding for many readers.
- **Verdana / Trebuchet MS**: widely available fallbacks with clear letterforms.

Avoid fonts that make sight words harder to recognize. Be careful with novelty fonts and single-storey letterforms if they reduce character distinction. If we later bundle fonts for offline desktop use, prefer Atkinson Hyperlegible first.

## Skeleton usage

Current Skeleton commitments:

- `@skeletonlabs/skeleton` CSS and the `seafoam` theme are imported in `src/app.css`.
- `data-theme="seafoam"` is set in `src/app.html`.
- Skeleton design tokens are aligned with the readable font stack and rounded radii.
- Skeleton utility classes are used for buttons, inputs, selects, cards, badges, and chips.
- Skeleton Svelte `Progress` is used for learner progress.

Prefer Skeleton primitives for standard UI. Keep custom CSS for the distinctive learner practice card, colorful gradients, and kid-friendly state styling.

## Components

### Practice card

- Largest visual element.
- Uses Paper background with soft colorful radial accents.
- Word text should stay very large and high contrast.

### Buttons

- Use direct verbs: “Hear word,” “Mark known,” “Try again.”
- Primary button gets the Ocean/Grape gradient.
- Avoid destructive-looking styles in learner mode.

### Progress

- Show progress with friendly counts and simple bars.
- Prefer “known,” “starred,” “in set,” and “practiced today.”
- Avoid grade-like scores in learner mode.

### Parent/admin mode

- Use the same palette but quieter.
- Make insights scannable with cards and short labels.
- Use neutral language: “needs review,” “ready to advance,” “recent practice.”

## Accessibility notes

- Do not communicate status by color alone.
- Keep visible focus rings.
- Preserve readable text contrast on gradients.
- Respect reduced-motion preferences before adding animations.
- Keep speech/listening features optional and button-triggered where possible.
- Keep tap targets at least 44px.
- Prefer plain language and consistent labels.
- Run `npm run check`, `npm run lint`, and `npm run build` before merging UI changes.
