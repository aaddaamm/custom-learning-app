# Roadmap

This app should stay small, local-first, and useful for real practice sessions. GitHub issues are the source of truth for checkpoints; this file groups the next milestones.

## Planning docs

- [Module implementation plan](docs/module-implementation-plan.md)
- [Parent oversight and insights plan](docs/parent-oversight-and-insights-plan.md)
- [Student incentives plan](docs/student-incentives-plan.md) ([issue #5](https://github.com/aaddaamm/custom-learning-app/issues/5))
- [Kid-friendly styleguide](docs/kid-friendly-styleguide.md) ([issue #6](https://github.com/aaddaamm/custom-learning-app/issues/6))
- [Accessibility and quality plan](docs/accessibility-and-quality-plan.md)

## [Checkpoint 1: Stabilize the current sight-word app](https://github.com/aaddaamm/custom-learning-app/issues/1)

- Keep the existing Fry sight-word workflow reliable across web preview and Tauri.
- Add lightweight automated coverage around storage behavior and core practice flows.
- Improve learner management enough for daily use.

## [Checkpoint 2: Turn practice history into useful insight](https://github.com/aaddaamm/custom-learning-app/issues/2)

- Use saved attempts to show simple trends for each learner.
- Surface review recommendations without making the UI busy.
- Keep data local and exportable.

## [Checkpoint 3: Add the next module deliberately](https://github.com/aaddaamm/custom-learning-app/issues/3)

- Define the module data shape needed beyond sight words.
- Add one new module end to end before adding more module tabs.
- Reuse the learner/progress/storage model unless a real module requirement forces a change.

## [Checkpoint 4: Prepare for family use](https://github.com/aaddaamm/custom-learning-app/issues/4)

- Add backup/export/import.
- Harden desktop packaging and permissions.
- Do accessibility and small-screen passes.
