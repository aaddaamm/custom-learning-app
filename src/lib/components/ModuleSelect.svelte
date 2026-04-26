<script>
  export let learnerName = "Learner";
  export let modules = [];
  export let progressByModuleId = {};
  export let onChooseModule = () => {};
  export let onBack = () => {};
</script>

<section class="entry-card card" aria-labelledby="module-title">
  <div class="header-row">
    <h1 id="module-title">Hi, {learnerName}!</h1>
    <button class="btn" type="button" on:click={onBack}>Back</button>
  </div>

  <p class="subtitle">Pick a learning module.</p>

  <div class="tiles" aria-label="Learning modules">
    {#each modules as module (module.id)}
      {@const knownCount = progressByModuleId[module.id]?.known?.length || 0}
      {@const totalCount = module.items?.length || 0}
      <button class="btn tile" type="button" on:click={() => onChooseModule(module.id)}>
        <span class="name">{module.title}</span>
        <span class="hint">{module.label}</span>
        <span class="hint">Known: {knownCount}/{totalCount}</span>
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

  .tiles {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .tile {
    min-height: 96px;
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

    .tiles {
      grid-template-columns: 1fr;
    }
  }
</style>
