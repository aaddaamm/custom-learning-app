<script>
  import { Progress } from "@skeletonlabs/skeleton-svelte";
  import { onMount } from "svelte";
  import ActiveLearnerCard from "$lib/components/ActiveLearnerCard.svelte";
  import ParentSetup from "$lib/components/ParentSetup.svelte";
  import PracticeCard from "$lib/components/PracticeCard.svelte";
  import PracticeControls from "$lib/components/PracticeControls.svelte";
  import SplashScreen from "$lib/components/SplashScreen.svelte";
  import SummaryCards from "$lib/components/SummaryCards.svelte";
  import TopBar from "$lib/components/TopBar.svelte";
  import WordGrid from "$lib/components/WordGrid.svelte";
  import {
    chooseDistractors,
    cleanLearnerName,
    getSetIndexes,
    makeLearnerId
  } from "$lib/utils/practice.js";
  import { modules } from "../modules/index.js";
  import { createLearningStorage } from "../storage/learningStorage.js";

  let storage = null;
  let storageLabel = "Loading";
  let storageError = "";
  let screen = "splash";
  let learners = [];
  let learnerId = "";
  let moduleId = "sightWords";
  let progress = { known: [], starred: [] };
  let practiced = [];
  let setNumber = 0;
  let mode = "flash";
  let filter = "all";
  let currentOffset = 0;
  let order = [...(modules.find((module) => module.id === moduleId)?.items || []).keys()];
  let newLearnerName = "";
  let typedAnswer = "";
  let feedback = "";

  $: activeModule = modules.find((module) => module.id === moduleId) || modules[0];
  $: activeLearner = learners.find((learner) => learner.id === learnerId) || learners[0];
  $: items = activeModule.items || [];
  $: known = new Set(progress.known.map(String));
  $: starred = new Set(progress.starred.map(String));
  $: totalSets = Math.ceil(items.length / activeModule.setSize);
  $: progressPercent = items.length ? Math.round((known.size / items.length) * 100) : 0;
  $: setIndexes = getSetIndexes(
    setNumber,
    activeModule.setSize,
    items.length,
    filter,
    known,
    starred
  );
  $: visibleIndexes = order.filter((index) => setIndexes.includes(index));
  $: currentIndex = visibleIndexes.length
    ? visibleIndexes[Math.min(currentOffset, visibleIndexes.length - 1)]
    : null;
  $: currentItem = currentIndex === null ? "" : items[currentIndex];
  $: currentKey = currentIndex === null ? "" : String(currentIndex);
  $: choices =
    mode === "listen" && currentIndex !== null
      ? chooseDistractors(currentIndex, setIndexes, items)
      : [];

  onMount(async () => {
    try {
      const nextStorage = await createLearningStorage();
      const savedLearners = await nextStorage.getLearners();
      const nextLearners = savedLearners;

      const savedLearnerId = await nextStorage.getSetting("activeLearnerId");
      const savedModuleId = await nextStorage.getSetting("activeModuleId");

      storage = nextStorage;
      storageLabel = nextStorage.label;
      storageError = "";
      learners = nextLearners;
      learnerId = nextLearners.some((learner) => learner.id === savedLearnerId)
        ? savedLearnerId
        : nextLearners[0]?.id || "";
      moduleId = modules.some((module) => module.id === savedModuleId)
        ? savedModuleId
        : "sightWords";
      screen = nextLearners.length ? "splash" : "parent";

      await loadProgress();
    } catch (error) {
      console.error("Learning storage failed to start.", error);
      storageLabel = "Unsaved";
      storageError = "Progress is not saving right now.";
      order = [...items.keys()];
      screen = "parent";
    }
  });

  $: if (storage && learnerId && moduleId) {
    loadProgressForSelection(learnerId, moduleId);
  }

  $: if (currentIndex !== null && !practiced.includes(String(currentIndex))) {
    practiced = [...practiced, String(currentIndex)];
  }

  $: if (mode || currentItem) {
    typedAnswer = "";
    feedback = "";
    if (mode === "listen" && currentItem) window.setTimeout(() => speak(currentItem), 180);
  }

  let lastProgressKey = "";
  async function loadProgressForSelection(nextLearnerId, nextModuleId) {
    const key = `${nextLearnerId}:${nextModuleId}`;
    if (key === lastProgressKey) return;
    lastProgressKey = key;
    await loadProgress();
  }

  async function loadProgress() {
    if (!storage || !learnerId) return;
    const savedProgress = await storage.getProgress(learnerId, moduleId);
    progress = savedProgress;
    practiced = [];
    currentOffset = 0;
    setNumber = 0;
    order = [...items.keys()];
    await storage.saveSetting("activeLearnerId", learnerId);
    await storage.saveSetting("activeModuleId", moduleId);
  }

  function speak(text) {
    if (!text || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.72;
    utterance.pitch = 1.08;
    window.speechSynthesis.speak(utterance);
  }

  async function saveProgress(nextKnown, nextStarred) {
    const nextProgress = {
      known: [...nextKnown].sort((a, b) => Number(a) - Number(b)),
      starred: [...nextStarred].sort((a, b) => Number(a) - Number(b))
    };
    progress = nextProgress;
    await storage?.saveProgress(learnerId, moduleId, nextProgress);
  }

  async function setKnown(index, isKnown, attemptMode = null) {
    if (index === null) return;
    const nextKnown = new Set(known);
    if (isKnown) nextKnown.add(String(index));
    else nextKnown.delete(String(index));
    await saveProgress(nextKnown, starred);
    if (attemptMode) {
      await storage?.saveAttempt({
        learnerId,
        moduleId,
        itemIndex: index,
        mode: attemptMode,
        correct: isKnown
      });
    }
  }

  async function recordAttempt(index, correct, attemptMode) {
    if (correct) {
      await setKnown(index, true, attemptMode);
      return;
    }
    feedback = "Try again";
    await storage?.saveAttempt({
      learnerId,
      moduleId,
      itemIndex: index,
      mode: attemptMode,
      correct: false
    });
  }

  async function toggleKnown() {
    if (currentIndex === null) return;
    await setKnown(currentIndex, !known.has(currentKey));
  }

  async function toggleStarred() {
    if (currentIndex === null) return;
    const nextStarred = new Set(starred);
    if (nextStarred.has(currentKey)) nextStarred.delete(currentKey);
    else nextStarred.add(currentKey);
    await saveProgress(known, nextStarred);
  }

  function resetCurrentOffset() {
    currentOffset = 0;
  }

  function move(delta) {
    if (!visibleIndexes.length) return;
    currentOffset = (currentOffset + delta + visibleIndexes.length) % visibleIndexes.length;
  }

  function shuffleCurrentSet() {
    const shuffledVisible = [...visibleIndexes].sort(() => Math.random() - 0.5);
    const visibleSet = new Set(visibleIndexes);
    const rest = order.filter((index) => !visibleSet.has(index));
    order = [...shuffledVisible, ...rest];
    resetCurrentOffset();
  }

  function selectIndex(index) {
    currentOffset = Math.max(0, visibleIndexes.indexOf(index));
  }

  function openParentSetup() {
    screen = "parent";
  }

  function openSplash() {
    screen = "splash";
  }

  function startPracticeForLearner(nextLearnerId) {
    learnerId = nextLearnerId;
    screen = "practice";
  }

  async function addLearner() {
    const cleaned = cleanLearnerName(newLearnerName);
    if (!cleaned || !storage) return;

    const learner = {
      id: makeLearnerId(
        cleaned,
        learners.map((learner) => learner.id)
      ),
      name: cleaned
    };

    await storage.saveLearner(learner);
    learners = [...learners, learner];
    learnerId = learner.id;
    newLearnerName = "";
  }

  async function submitTypedAnswer() {
    const correct = typedAnswer.trim().toLowerCase() === currentItem.toLowerCase();
    feedback = correct ? "Correct" : "Try again";
    await recordAttempt(currentIndex, correct, "type");
  }
</script>

<svelte:head>
  <title>BrightSteps</title>
</svelte:head>

{#if screen === "practice"}
  <main class="app">
    <section class="practice card" aria-labelledby="app-title">
      <TopBar knownCount={known.size} headingId="app-title" />

      {#if storageError}
        <p class="storage-alert" role="status">{storageError}</p>
      {/if}

      <PracticeControls
        bind:setNumber
        {totalSets}
        setSize={activeModule.setSize}
        itemCount={items.length}
        bind:mode
        bind:filter
        onSetChange={resetCurrentOffset}
        onFilterChange={resetCurrentOffset}
      />

      <PracticeCard
        {currentIndex}
        itemsLength={items.length}
        {currentItem}
        {mode}
        knownCurrent={known.has(currentKey)}
        currentStarred={starred.has(currentKey)}
        {choices}
        bind:typedAnswer
        {feedback}
        onToggleStarred={toggleStarred}
        onSpeak={() => speak(currentItem)}
        onListenChoice={(choice) => recordAttempt(currentIndex, choice === currentItem, "listen")}
        onSubmitTyped={submitTypedAnswer}
      />
      <div class="actions">
        <button class="btn" type="button" on:click={() => move(-1)}>Previous</button>
        <button class="btn" type="button" on:click={shuffleCurrentSet}>Shuffle</button>
        <button class="btn primary" type="button" on:click={toggleKnown}
          >{known.has(currentKey) ? "Mark learning" : "Mark known"}</button
        >
        <button class="btn" type="button" on:click={() => move(1)}>Next</button>
      </div>
    </section>

    <aside class="sidebar card" aria-label="Learning path progress">
      <ActiveLearnerCard
        learnerName={activeLearner?.name || "Learner"}
        moduleTitle={activeModule.title}
        {storageLabel}
      />
      <SummaryCards
        practicedCount={practiced.length}
        starredCount={starred.size}
        inSetCount={visibleIndexes.length}
      />
      <Progress value={progressPercent} min={0} max={100} aria-label="Known words progress">
        <Progress.Track class="progress-track">
          <Progress.Range class="progress-range"></Progress.Range>
        </Progress.Track>
      </Progress>
      <WordGrid {setIndexes} {items} {currentIndex} {known} {starred} onSelectIndex={selectIndex} />
    </aside>
  </main>
{:else}
  <main class="entry-shell">
    {#if storageError}
      <p class="storage-alert" role="status">{storageError}</p>
    {/if}

    {#if screen === "parent"}
      <ParentSetup
        {learners}
        bind:newLearnerName
        onAddLearner={addLearner}
        onBack={openSplash}
        onStartLearner={startPracticeForLearner}
      />
    {:else}
      <SplashScreen
        {learners}
        onSelectLearner={startPracticeForLearner}
        onOpenParent={openParentSetup}
      />
    {/if}
  </main>
{/if}
