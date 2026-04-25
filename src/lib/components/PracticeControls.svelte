<script>
  export let setNumber = 0;
  export let totalSets = 0;
  export let setSize = 0;
  export let itemCount = 0;
  export let mode = "flash";
  export let filter = "all";
  export let onSetChange = () => {};
  export let onFilterChange = () => {};
</script>

<div class="controls">
  <label>
    Set
    <select class="select" bind:value={setNumber} on:change={onSetChange}>
      {#each Array.from({ length: totalSets }, (_, index) => index) as index (index)}
        <option value={index}
          >Words {index * setSize + 1}-{Math.min((index + 1) * setSize, itemCount)}</option
        >
      {/each}
    </select>
  </label>

  <label>
    Mode
    <select class="select" bind:value={mode}>
      <option value="flash">Flashcards</option>
      <option value="listen">Listen &amp; find</option>
      <option value="type">Type it</option>
    </select>
  </label>

  <label>
    Practice
    <select class="select" bind:value={filter} on:change={onFilterChange}>
      <option value="all">All words</option>
      <option value="learning">Still learning</option>
      <option value="known">Known words</option>
      <option value="starred">Starred words</option>
    </select>
  </label>
</div>

<style>
  .controls {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 18px;
  }

  @media (max-width: 680px) {
    .controls {
      grid-template-columns: 1fr;
    }
  }
</style>
