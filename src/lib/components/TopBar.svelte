<script>
  export let knownCount = 0;
  export let headingId = "app-title";
  export let lessonHeading = "Sight Words Lesson";
</script>

<div class="topbar">
  <div>
    <img
      class="wordmark"
      src="/branding/brightsteps-wordmark.svg"
      alt="BrightSteps"
      width="320"
      height="92"
    />
    <p class="kicker badge">Small steps, big learning</p>
    <h1 id={headingId}>{lessonHeading}</h1>
  </div>

  <div class="meter" aria-label="Known words count">
    <span>{knownCount}</span>
    <span>known</span>
  </div>
</div>

<style>
  .topbar {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .wordmark {
    display: block;
    width: min(100%, 320px);
    height: auto;
    margin-bottom: 8px;
  }

  .kicker {
    margin: 0 0 4px;
    color: var(--ink-strong);
    font-size: 0.86rem;
    font-weight: 950;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .kicker.badge {
    border: 1px solid var(--badge-border);
    background: var(--badge-bg);
  }

  h1 {
    margin: 0;
    color: var(--ink-strong);
    font-size: clamp(2.1rem, 5vw, 4.8rem);
    line-height: 0.95;
    letter-spacing: -0.05em;
  }

  .meter {
    width: 104px;
    height: 104px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    background:
      linear-gradient(var(--surface), var(--surface)) padding-box,
      conic-gradient(var(--mint), var(--sky), var(--grape), var(--pink-deep), var(--mint))
        border-box;
    border: 8px solid transparent;
    color: var(--ink-strong);
  }

  .meter span {
    display: block;
    text-align: center;
    font-weight: 950;
    line-height: 1;
  }

  .meter span:first-child {
    color: var(--ink-strong);
    font-size: 1.8rem;
  }

  .meter span:last-child {
    color: var(--muted);
    font-size: 0.78rem;
    margin-top: -4px;
  }

  @media (max-width: 680px) {
    .topbar {
      grid-template-columns: 1fr;
    }

    .wordmark {
      width: min(100%, 280px);
    }

    .meter {
      width: 84px;
      height: 84px;
      border-width: 6px;
    }
  }
</style>
