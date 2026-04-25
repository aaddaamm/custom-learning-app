# Student Incentives Plan

## Goal

Encourage steady practice without making the app feel manipulative, stressful, or noisy. Incentives should reward effort, consistency, and mastery while keeping learning itself at the center.

## Principles

- Reward practice behaviors, not just correctness.
- Avoid shame, loss, countdown pressure, or public comparison.
- Keep incentives optional and parent-configurable.
- Prefer calm celebrations over flashy interruptions.
- Make rewards understandable to young learners.

## Incentive types

### Gentle progress markers

Use visual progress that already matches the learning model.

Examples:

- Set completion rings.
- “You practiced 10 words today.”
- “3 more words moved to known.”
- Calm confetti or a small badge when a set is completed.

### Badges

Badges should recognize meaningful milestones.

Examples:

- First Practice
- Five Days Practiced
- Word Explorer: 50 words practiced
- Careful Listener: 20 listen-and-find attempts
- Brave Try: practiced after mistakes
- Set Master: completed a full set

Avoid badges that imply fixed ability, such as “genius” or “perfect kid.”

### Streaks, carefully

Streaks can motivate but can also create pressure. If used:

- Count weekly consistency rather than endless daily streaks.
- Allow rest days.
- Use language like “practice days this week” instead of “don’t break your streak.”

### Unlocks

Unlocks should be cosmetic or choice-based, not required for learning.

Examples:

- Card themes.
- Friendly mascot poses.
- Celebration sounds.
- Choice of practice background.

Keep unlocks local and simple. Avoid stores, currencies, or gambling-like loops.

### Parent-set goals

Parents can define small goals:

- Practice 5 minutes.
- Review 10 items.
- Complete one set.
- Try 5 challenge items.

Learner UI should show the goal in a friendly way and celebrate completion.

## Data model

Start by deriving incentives from existing data:

- known count
- starred count
- attempts
- practiced items today

Later additions:

```js
achievements: {
  (learnerId, achievementId, awardedAt, metadata);
}

goals: {
  (learnerId, moduleId, type, target, enabled);
}
```

Achievements can be computed on the fly at first. Persist them only when the app needs “new badge” announcements or historical award dates.

## Implementation phases

### Phase 1: Effort feedback

- Add simple session-end or inline feedback.
- Celebrate attempts and practice count, not only known count.
- Use existing local state and attempts.

### Phase 2: Badges

- Define a small badge catalog.
- Compute earned badges for a learner.
- Show badges in a learner profile or parent view.

### Phase 3: Goals

- Add parent-configurable goals.
- Show one active goal in the learner UI.
- Store goals through the storage adapter.

### Phase 4: Cosmetic unlocks

- Add a few local-only themes or mascot states.
- Allow parents to disable cosmetic rewards.
- Keep defaults calm.

## Acceptance checklist

Student incentives are ready when:

- Learners get positive feedback for steady effort.
- Parents can disable or tune incentives.
- Incentives do not block practice or hide learning content.
- Rewards are derived from local learner data.
- The app remains calm at mobile and desktop sizes.
