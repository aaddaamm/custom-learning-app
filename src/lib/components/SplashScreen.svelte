<script>
  export let learners = [];
  export let onSelectLearner = () => {};
  export let onOpenParent = () => {};
</script>

<section class="entry-card card" aria-labelledby="welcome-title">
  <img
    class="wordmark"
    src="/branding/brightsteps-wordmark.svg"
    alt="BrightSteps"
    width="320"
    height="92"
  />
  <h1 id="welcome-title">Who is practicing today?</h1>
  <p class="subtitle">Pick your tile to start.</p>

  <div class="tiles" aria-label="Learner tiles">
    {#if learners.length}
      {#each learners as learner (learner.id)}
        <button class="btn tile" type="button" on:click={() => onSelectLearner(learner.id)}>
          <span class="name">{learner.name}</span>
          <span class="hint">Start</span>
        </button>
      {/each}
    {:else}
      <p class="empty">No learners yet. Use the parent button below.</p>
    {/if}
  </div>

  <button class="btn parent-btn" type="button" on:click={onOpenParent}>Parent setup</button>
</section>

<style>
  .entry-card {
    width: min(760px, 100%);
    margin: 0 auto;
    padding: 24px;
    border-radius: 32px;
    display: grid;
    gap: 14px;
  }

  .wordmark {
    width: min(100%, 320px);
    height: auto;
    margin: 0 auto;
  }

  h1 {
    margin: 0;
    text-align: center;
    color: var(--ink-strong);
    font-size: clamp(1.8rem, 4vw, 2.8rem);
  }

  .subtitle {
    margin: 0;
    text-align: center;
    color: var(--muted);
    font-weight: 800;
  }

  .tiles {
    margin-top: 8px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .tile {
    min-height: 88px;
    display: grid;
    place-items: center;
    gap: 4px;
    border-radius: 20px;
    background: linear-gradient(135deg, var(--surface), var(--surface-soft));
  }

  .name {
    font-size: 1.15rem;
    font-weight: 950;
    color: var(--ink-strong);
  }

  .hint {
    font-size: 0.75rem;
    font-weight: 900;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .empty {
    grid-column: 1 / -1;
    margin: 0;
    min-height: 88px;
    display: grid;
    place-items: center;
    text-align: center;
    color: var(--muted);
    font-weight: 850;
    border: 2px dashed var(--line);
    border-radius: 18px;
    padding: 10px;
  }

  .parent-btn {
    margin-top: 16px;
    justify-self: center;
    min-width: 180px;
  }

  @media (max-width: 680px) {
    .entry-card {
      border-radius: 24px;
      padding: 18px;
    }

    .tiles {
      grid-template-columns: 1fr;
    }
  }
</style>
