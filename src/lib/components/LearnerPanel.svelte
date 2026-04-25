<script>
  import { createEventDispatcher } from "svelte";

  export let learners = [];
  export let learnerId = "";
  export let newLearnerName = "";

  const dispatch = createEventDispatcher();

  function submitAddLearner() {
    dispatch("addLearner");
  }
</script>

<div class="learner-panel">
  <label>
    Learner
    <select class="select" bind:value={learnerId}>
      {#each learners as learner (learner.id)}
        <option value={learner.id}>{learner.name}</option>
      {/each}
    </select>
  </label>

  <form class="learner-form" on:submit|preventDefault={submitAddLearner}>
    <input
      class="input"
      bind:value={newLearnerName}
      placeholder="Add learner"
      aria-label="Learner name"
    />
    <button class="btn" type="submit">Add</button>
  </form>
</div>

<style>
  .learner-panel {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }

  .learner-form {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
  }

  @media (max-width: 680px) {
    .learner-panel,
    .learner-form {
      grid-template-columns: 1fr;
    }
  }
</style>
