<script>
  export let learnerName = "Learner";
  export let moduleTitle = "";
  export let storageLabel = "";
</script>

<div class="learner-card">
  <small>Active learner</small>
  <strong>{learnerName}</strong>
  <span>{moduleTitle} · {storageLabel}</span>
</div>

<style>
  .learner-card {
    display: grid;
    gap: 5px;
    padding: 18px;
    border-radius: 24px;
    background: linear-gradient(135deg, var(--learner-glow-primary), var(--learner-glow-secondary));
  }

  .learner-card strong {
    color: var(--ink-strong);
    font-size: 1.2rem;
    font-weight: 1000;
  }

  .learner-card small,
  .learner-card span {
    color: var(--muted);
    font-size: 0.8rem;
    font-weight: 900;
  }
</style>
