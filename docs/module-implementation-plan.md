# Module Implementation Plan

## Goal

Make it easy to add learning modules without weakening the current learner/profile/progress model. A module should define content and practice behavior; shared UI and storage should continue to handle learners, progress, attempts, and settings.

## Principles

- Add module tabs only when a module is usable end to end.
- Keep progress scoped by `learnerId`, `moduleId`, and item index or stable item id.
- Keep React components behind `src/storage/learningStorage.js`.
- Keep module-specific logic isolated enough that Sight Words does not become the template for every subject.
- Prefer small module contracts over large abstractions until two modules prove the shape.

## Proposed module contract

Start with a plain object registry in `src/modules/index.js`, then grow it only as needed:

```js
{
  id: "sightWords",
  title: "Sight Words",
  label: "Fry 1,000",
  items: [],
  setSize: 50,
  itemType: "word",
  practiceModes: ["flash", "listen", "type"],
  getPrompt(item, context),
  checkAnswer(item, answer, context),
  getChoices(item, items, context)
}
```

For the next module, it is acceptable to implement only the fields actually needed. The goal is to discover the right interface rather than overbuilding it.

## Storage needs

Current storage is enough for basic modules:

- `learners`
- `progress`
- `attempts`
- `settings`

Likely additions before richer modules:

- Store attempt metadata as JSON, such as typed answer, response time, prompt variant, or difficulty.
- Add a lightweight `module_settings` concept if a learner needs per-module options such as math range or spelling list.
- Consider stable item ids for generated content, especially math facts, where an item may be generated from `{ operation, left, right }` instead of read from a static list.

## Suggested implementation phases

### Phase 1: Extract reusable practice shell

- Keep learner selection, progress summary, filters, and navigation in a shared shell.
- Move sight-word card behavior into module-specific helpers or components.
- Keep current Sight Words behavior unchanged.

### Phase 2: Add a real second module

Recommended first candidate: Math Facts.

Why Math Facts first:

- Items can be generated locally.
- Correctness is deterministic.
- It exercises the module system differently than sight words.

Initial Math Facts scope:

- Addition facts from 0-10.
- Practice mode: type answer.
- Progress tracks known facts by generated item id, such as `add:3:4`.
- Attempts store correctness and answer.

### Phase 3: Generalize only after two modules work

After Sight Words and Math Facts both work:

- Normalize module item access.
- Define shared practice mode names.
- Decide whether module components live in `src/modules/<moduleId>/`.
- Document the final module authoring shape.

## Acceptance checklist

A new module is ready when:

- It appears in the module registry.
- It has at least one usable practice mode.
- Progress is learner-specific and module-specific.
- Attempts are saved through the storage adapter.
- `npm run build` passes.
- Sight Words still works without regressions.
