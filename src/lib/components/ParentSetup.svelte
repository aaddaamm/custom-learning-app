<script>
  export let learners = [];
  export let newLearnerName = "";
  export let onAddLearner = () => {};
  export let onBack = () => {};
  export let onStartLearner = () => {};
</script>

<section class="entry-card card" aria-labelledby="parent-title">
  <div class="header-row">
    <h1 id="parent-title">Parent setup</h1>
    <button class="btn" type="button" on:click={onBack}>Done</button>
  </div>

  <p class="subtitle">Add each kid, then pick a tile to start practice.</p>

  <form class="add-row" on:submit|preventDefault={onAddLearner}>
    <label>
      Learner name
      <input
        class="input"
        bind:value={newLearnerName}
        placeholder="Add learner"
        aria-label="Learner name"
      />
    </label>
    <button class="btn primary" type="submit">Add learner</button>
  </form>

  <div class="tiles" aria-label="Learner tiles">
    {#each learners as learner (learner.id)}
      <button class="btn tile" type="button" on:click={() => onStartLearner(learner.id)}>
        <span class="name">{learner.name}</span>
        <span class="hint">Start as this learner</span>
      </button>
    {/each}
  </div>
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

  .header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  h1 {
    margin: 0;
    color: var(--ink-strong);
    font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  }

  .subtitle {
    margin: 0;
    color: var(--muted);
    font-weight: 800;
  }

  .add-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
    align-items: end;
  }

  .tiles {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .tile {
    min-height: 84px;
    display: grid;
    place-items: center;
    gap: 4px;
    border-radius: 18px;
    background: linear-gradient(135deg, var(--surface), var(--surface-soft));
  }

  .name {
    font-size: 1.08rem;
    font-weight: 950;
    color: var(--ink-strong);
  }

  .hint {
    font-size: 0.74rem;
    font-weight: 900;
    color: var(--muted);
  }

  @media (max-width: 680px) {
    .entry-card {
      border-radius: 24px;
      padding: 18px;
    }

    .add-row,
    .tiles {
      grid-template-columns: 1fr;
    }
  }
</style>
