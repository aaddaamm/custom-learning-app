<script>
  export let practicedCount = 0;
  export let starredCount = 0;
  export let inSetCount = 0;
</script>

<div class="summary" aria-label="Practice summary">
  <div class="card stat"><span>{practicedCount}</span><small>today</small></div>
  <div class="card stat"><span>{starredCount}</span><small>starred</small></div>
  <div class="card stat"><span>{inSetCount}</span><small>in set</small></div>
</div>

<style>
  .summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin: 16px 0;
  }

  .stat {
    min-height: 82px;
    display: grid;
    place-items: center;
    border-radius: 22px;
    background: var(--surface);
    border: 2px solid var(--line);
  }

  .stat span,
  .stat small {
    display: block;
    font-weight: 950;
    line-height: 1;
    margin: 0;
  }

  .stat span {
    color: var(--ink-strong);
    font-size: 1.45rem;
  }

  .stat small {
    color: var(--muted);
    margin-top: -4px;
  }
</style>
