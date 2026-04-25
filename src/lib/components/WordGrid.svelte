<script>
  export let setIndexes = [];
  export let items = [];
  export let currentIndex = null;
  export let known = new Set();
  export let starred = new Set();
  export let onSelectIndex = () => {};
</script>

<div class="word-grid">
  {#each setIndexes as index (index)}
    {@const key = String(index)}
    <button
      type="button"
      class={`btn chip ${index === currentIndex ? "active" : ""} ${known.has(key) ? "known" : ""} ${starred.has(key) ? "starred" : ""}`}
      on:click={() => onSelectIndex(index)}
    >
      {items[index]}
    </button>
  {/each}
</div>

<style>
  .word-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
    max-height: 460px;
    overflow: auto;
    padding-right: 4px;
  }

  .chip {
    min-height: 42px;
    justify-content: start;
    text-align: left;
    padding: 0 12px;
    background: var(--surface);
    border-radius: 16px;
    color: var(--muted);
  }

  .chip.active {
    border-color: var(--ocean);
    color: var(--ink-strong);
    background: color-mix(in srgb, var(--surface) 82%, var(--ocean));
  }

  .chip.known {
    border-color: var(--known-border);
    color: var(--known-text);
    background: var(--known-bg);
  }

  .chip.starred::after {
    content: "★";
    margin-left: auto;
    color: var(--ocean);
  }

  @media (max-width: 680px) {
    .word-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
