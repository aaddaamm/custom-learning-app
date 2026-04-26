<script>
  export let currentIndex = null;
  export let itemsLength = 0;
  export let currentItem = "";
  export let mode = "flash";
  export let knownCurrent = false;
  export let currentStarred = false;
  export let choices = [];
  export let typedAnswer = "";
  export let feedback = "";
  export let onToggleStarred = () => {};
  export let onSpeak = () => {};
  export let onListenChoice = () => {};
  export let onSubmitTyped = () => {};
</script>

<div class="card practice-card">
  <div class="card-meta">
    <span
      >{currentIndex === null ? "No words here yet" : `${currentIndex + 1} / ${itemsLength}`}</span
    >
    <button
      class="btn-icon icon-button"
      type="button"
      aria-label="Star word"
      title="Star word"
      on:click={onToggleStarred}>{currentStarred ? "★" : "☆"}</button
    >
  </div>

  <button class="btn speak-button" type="button" title="Hear the word" on:click={onSpeak}>
    <span aria-hidden="true">▶</span>
    <span>Hear word</span>
  </button>

  <div class="word" aria-live="polite">{currentItem || "No words"}</div>

  <div class="mode-panel">
    {#if mode === "flash"}
      <div class="feedback">{knownCurrent ? "Known word" : "Practice this word"}</div>
    {:else if mode === "listen"}
      <div class="choices">
        {#each choices as choice (choice.id)}
          <button class="btn choice" type="button" on:click={() => onListenChoice(choice)}
            >{choice.text}</button
          >
        {/each}
      </div>
    {:else if mode === "type"}
      <form class="type-row" on:submit|preventDefault={onSubmitTyped}>
        <input
          class="input"
          bind:value={typedAnswer}
          autocomplete="off"
          autocapitalize="none"
          aria-label="Type the word"
        />
        <button class="btn" type="submit">Check</button>
      </form>
      <div class="feedback">{feedback}</div>
    {/if}
  </div>
</div>

<style>
  .practice-card {
    min-height: 390px;
    display: grid;
    gap: 18px;
    align-content: center;
    padding: clamp(22px, 4vw, 42px);
    border-radius: 32px;
    border: 3px solid var(--card-border);
    background:
      radial-gradient(circle at top left, var(--card-glow-primary), transparent 34%),
      radial-gradient(circle at bottom right, var(--card-glow-secondary), transparent 34%),
      var(--surface);
  }

  .card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--muted);
    font-weight: 950;
  }

  .icon-button {
    width: 54px;
    min-height: 54px;
    padding: 0;
    border-radius: 18px;
    color: var(--ocean);
    background: var(--surface-soft-alt);
  }

  .speak-button {
    justify-self: center;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--on-accent);
    background: linear-gradient(135deg, var(--melon), var(--pink-deep));
    border-color: transparent;
  }

  .word {
    min-height: 124px;
    display: grid;
    place-items: center;
    text-align: center;
    color: var(--ink-strong);
    font-size: clamp(3.6rem, 12vw, 8.2rem);
    line-height: 0.9;
    font-weight: 1000;
    letter-spacing: -0.08em;
  }

  .mode-panel {
    min-height: 86px;
    display: grid;
    align-content: center;
  }

  .feedback {
    text-align: center;
    color: var(--muted);
    font-weight: 950;
  }

  .choices {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .choice {
    min-height: 64px;
    background: var(--sky-soft);
    border-color: var(--choice-border);
    color: var(--ink);
  }

  .type-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
  }

  @media (max-width: 680px) {
    .choices,
    .type-row {
      grid-template-columns: 1fr;
    }

    .practice-card {
      min-height: 320px;
    }
  }
</style>
