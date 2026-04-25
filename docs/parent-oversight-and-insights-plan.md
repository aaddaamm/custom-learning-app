# Parent Oversight and Insights Plan

## Goal

Give parents or caregivers a calm admin view that answers: what was practiced, what is improving, and what needs attention. The oversight layer should help guide practice without turning the app into surveillance or a noisy dashboard.

## Principles

- Local-first by default. Learner data stays on the device unless export/import is explicitly used.
- Insights should be actionable, not exhaustive.
- Parent-facing UI can be more detailed than learner-facing UI, but should still be simple.
- Do not shame learners. Use neutral language like “needs review” instead of “failed.”
- Keep all data access behind `src/storage/learningStorage.js`.

## Parent/admin entry point

Start with a simple “Parent” or “Grown-up” area accessible from the main app.

Possible access levels:

1. No lock for early local-only development.
2. Lightweight parent gate, such as a simple math prompt.
3. Optional local PIN if the app starts holding settings that children should not change.

Avoid account systems until there is a real sync requirement.

## First dashboard scope

For each learner:

- Current active modules.
- Known count and percent per module.
- Recent practice sessions.
- Words or facts needing review.
- Starred items.
- Simple streak or consistency indicator, if incentives are enabled.

For each module:

- Total items.
- Known items.
- Learning items.
- Recent accuracy.
- Items with repeated misses.

## Insight types

### Needs review

Flag items with recent incorrect attempts or long gaps since practice.

Example rule:

- Show an item if it has 2+ recent incorrect attempts, or if it was known but has not been practiced in a configured review window.

### Ready to advance

Suggest moving to the next set or difficulty when a learner shows stable accuracy.

Example rule:

- Set accuracy is 85%+ over recent attempts and most items in the set are known.

### Practice consistency

Show practice rhythm without overemphasizing streak pressure.

Examples:

- “Practiced 3 days this week.”
- “12 words reviewed today.”
- “Short practice sessions are working well.”

## Storage/API additions

Current `saveAttempt()` records attempts but there is no read path. Add storage adapter methods before building insights:

```js
getAttempts({ learnerId, moduleId, since, limit });
getModuleSummary(learnerId, moduleId);
getReviewItems(learnerId, moduleId);
```

Potential attempt fields to add later:

- `answer` or `answer_value`
- `response_ms`
- `metadata_json`
- `session_id`

A `session_id` would let the parent view group attempts into practice sessions.

## Implementation phases

### Phase 1: Read attempts

- Add `getAttempts()` to SQLite and browser storage.
- Save browser attempts in `localStorage` so web preview can show insights too.
- Add basic parent view with recent activity.

### Phase 2: Summaries

- Add summary helpers outside React components.
- Show known/learning/starred counts per learner and module.
- Show recently missed items.

### Phase 3: Recommendations

- Add review recommendations.
- Add “ready for next set” guidance.
- Keep recommendations transparent: show why an item is recommended.

### Phase 4: Caregiver controls

- Set practice goals.
- Enable/disable incentives.
- Export/import learner data.
- Optional local parent PIN.

## Acceptance checklist

Parent oversight is useful when:

- A parent can see what each learner practiced recently.
- A parent can identify a short review list.
- Insights work in both Tauri SQLite and browser fallback.
- Learner-facing screens remain calm and uncluttered.
- No UI code reads SQLite or `localStorage` directly.
