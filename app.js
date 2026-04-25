const fryWordRows = [
`the or will number
of one up no
and had other way
a by about could
to words out people
in but many my
is not then than
you what them first
that all these water
it were so been
he we some called
was when her who
for your would am
on can make its
are said like now
as there him find
with use into long
his an time down
they each has day
I which look did
at she two get
be do more come
this how write made
have their go may
from if see part`,
`over say set try
new great put kind
sound where end hand
take help does picture
only through another again
little much well change
work before large off
know line must play
place right big spell
years too even air
live means such away
me old because animal
back any turn house
give same here point
most tell why page
very boy ask letter
after follow went mother
things came men answer
our want read found
just show need study
name also land still
good around different learn
sentence form home should
man three us America
think small move world`,
`high saw important miss
every left until idea
near don't children enough
add few side eat
food while feet face
between along car watch
own might mile far
below close night Indian
country something walk real
plant seem white almost
last next sea let
school hard began above
father open grow girl
keep example took sometimes
tree begin river mountains
never life four cut
start always carry young
city those state talk
earth both once soon
eyes paper book list
light together hear song
thought got stop being
head group without leave
under often second family
story run late it's`,
`body order listen farm
music red wind pulled
color door rock draw
stand sure space voice
sun become covered seen
questions top fast cold
fish ship several cried
area across hold plan
mark today himself notice
dog during toward south
horse short five sing
birds better step war
problem best morning ground
complete however passed fall
room low vowel king
knew hours true town
since black hundred I'll
ever products against unit
piece happened pattern figure
told whole numeral certain
usually measure table field
didn't remember north travel
friends early slowly wood
easy waves money fire
heard reached map upon`,
`done decided plane filled
English contain system heat
road course behind full
half surface ran hot
ten produce round check
fly building boat object
gave ocean game am
box class force rule
finally note brought among
wait nothing understand noun
correct rest warm power
oh carefully common cannot
quickly scientists bring able
person inside explain six
became wheels dry size
shown stay though dark
minutes green language ball
strong known shape material
verb island deep special
stars week thousands heavy
front less yes fine
feel machine clear pair
fact base equation circle
inches ago yet include
street stood government built`,
`can't picked legs beside
matter simple sat gone
square cells main sky
syllables paint winter grass
perhaps mind wide million
bill love written west
felt cause length lay
suddenly rain reason weather
test exercise kept root
direction eggs interest instruments
center train arms meet
farmers blue brother third
ready wish race months
anything drop present paragraph
divided developed beautiful raised
general window store represent
energy difference job soft
subject distance edge whether
Europe heart past clothes
moon site sign flowers
region sum record shall
return summer finished teacher
believe wall discovered held
dance forest wild describe
members probably happy drive`,
`cross already hair rolled
speak instead age bear
solve phrase amount wonder
appear soil scale smiled
metal bed pounds angle
son copy although fraction
either free per Africa
ice hope broken killed
sleep spring moment melody
village case tiny bottom
factors laughed possible trip
result nation gold hole
jumped quite milk poor
snow type quiet let's
ride themselves natural fight
care temperature lot surprise
floor bright stone French
hill lead act died
pushed everyone build beat
baby method middle exactly
buy section speed remain
century lake count dress
outside iron consonant cat
everything within someone couldn't
tall dictionary sail fingers`,
`row president yourself caught
least brown control fell
catch trouble practice team
climbed cool report God
wrote cloud straight captain
shouted lost rise direct
continued sent statement ring
itself symbols stick serve
else wear party child
plains bad seeds desert
gas save suppose increase
England experiment woman history
burning engine coast cost
design alone bank maybe
joined drawing period business
foot east wire separate
law choose pay break
ears single clean uncle
glass touch visit hunting
you're information bit flow
grew express whose lady
skin mouth received students
valley yard garden human
cents equal please art
key decimal strange feeling`,
`supply guess thick major
corner silent blood observe
electric trade lie tube
insects rather spot necessary
crops compare bell weight
tone crowd fun meat
hit poem loud lifted
sand enjoy consider process
doctor elements suggested army
provide indicate thin hat
thus except position property
won't expect entered particular
cook flat fruit swim
bones seven tied terms
mall interesting rich current
board sense dollars park
modern string send sell
compound blow sight shoulder
mine famous chief industry
wasn't value Japanese wash
fit wings stream block
addition movement planets spread
belong pole rhythm cattle
safe exciting eight wife
soldiers branches science sharp`,
`company sister gun total
radio oxygen similar deal
we'll plural death determine
action various score evening
capital agreed forward hoe
factories opposite stretched rope
settled wrong experience cotton
yellow chart rose apple
isn't prepared allow details
southern pretty fear entire
truck solution workers corn
fair fresh Washington substances
printed shop Greek smell
wouldn't suffix women tools
ahead especially bought conditions
chance shoes led cows
born actually march track
level nose northern arrived
triangle afraid create located
molecules dead British sir
France sugar difficult seat
repeated adjective match division
column fig win effect
western office doesn't underline
church huge steel view`
];

const words = fryWordRows.flatMap((hundred) => {
  const columns = [[], [], [], []];
  hundred.trim().split("\n").forEach((row) => {
    row.trim().split(/\s+/).forEach((word, index) => columns[index].push(word));
  });
  return columns.flat();
});

const modules = [
  {
    id: "sightWords",
    title: "Sight Words",
    label: "Fry 1,000",
    items: words,
    setSize: 50,
    itemLabel: "word",
    itemLabelPlural: "words"
  },
  {
    id: "mathFacts",
    title: "Math Facts",
    label: "Planned",
    status: "planned"
  },
  {
    id: "spelling",
    title: "Spelling",
    label: "Planned",
    status: "planned"
  }
];

const learnerStorageKey = "learningProfiles";
const activeLearnerStorageKey = "activeLearningProfileId";
const activeModuleStorageKey = "activeLearningModuleId";
const defaultLearners = [
  { id: "learner-1", name: "Learner 1" }
];

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function cleanName(name) {
  return name.trim().replace(/\s+/g, " ");
}

function loadLearners() {
  const saved = readJson(learnerStorageKey, null);
  if (Array.isArray(saved) && saved.length) {
    const learners = saved
      .filter((learner) => learner && learner.id && learner.name)
      .map((learner) => ({ id: String(learner.id), name: String(learner.name) }));
    if (learners.length) return learners;
  }
  localStorage.setItem(learnerStorageKey, JSON.stringify(defaultLearners));
  return defaultLearners;
}

function progressKey(profileId, moduleId) {
  return `learningProgress:${profileId}:${moduleId}`;
}

function setToArray(set) {
  return [...set].sort((a, b) => Number(a) - Number(b));
}

function loadLegacyIndexes(indexStorageKey, legacyStorageKey) {
  const savedIndexes = readJson(indexStorageKey, null);
  if (Array.isArray(savedIndexes)) {
    return savedIndexes.map(String);
  }

  const legacyWords = new Set(readJson(legacyStorageKey, []));
  return words
    .map((word, index) => legacyWords.has(word) ? String(index) : null)
    .filter(Boolean);
}

function loadProgress(profileId, moduleId) {
  const saved = readJson(progressKey(profileId, moduleId), null);
  if (saved) {
    return {
      known: new Set((saved.known || []).map(String)),
      starred: new Set((saved.starred || []).map(String))
    };
  }

  if (profileId === "learner-1" && moduleId === "sightWords") {
    return {
      known: new Set(loadLegacyIndexes("knownWordIndexes", "knownWords")),
      starred: new Set(loadLegacyIndexes("starredWordIndexes", "starredWords"))
    };
  }

  return { known: new Set(), starred: new Set() };
}

const state = {
  learners: loadLearners(),
  learnerId: localStorage.getItem(activeLearnerStorageKey) || "learner-1",
  moduleId: localStorage.getItem(activeModuleStorageKey) || "sightWords",
  index: 0,
  set: 0,
  mode: "flash",
  filter: "all",
  order: [...words.keys()],
  practiced: new Set(),
  known: new Set(),
  starred: new Set()
};

if (!state.learners.some((learner) => learner.id === state.learnerId)) {
  state.learnerId = state.learners[0].id;
}

if (!modules.some((module) => module.id === state.moduleId && module.items)) {
  state.moduleId = "sightWords";
}

const els = {
  learnerSelect: document.querySelector("#learner-select"),
  learnerForm: document.querySelector("#learner-form"),
  learnerName: document.querySelector("#learner-name"),
  moduleTabs: document.querySelector("#module-tabs"),
  activeLearnerName: document.querySelector("#active-learner-name"),
  activeModuleName: document.querySelector("#active-module-name"),
  setSelect: document.querySelector("#set-select"),
  modeSelect: document.querySelector("#mode-select"),
  filterSelect: document.querySelector("#filter-select"),
  wordDisplay: document.querySelector("#word-display"),
  wordPosition: document.querySelector("#word-position"),
  starBtn: document.querySelector("#star-btn"),
  speakBtn: document.querySelector("#speak-btn"),
  modePanel: document.querySelector("#mode-panel"),
  prevBtn: document.querySelector("#prev-btn"),
  nextBtn: document.querySelector("#next-btn"),
  shuffleBtn: document.querySelector("#shuffle-btn"),
  knownBtn: document.querySelector("#known-btn"),
  knownCount: document.querySelector("#known-count"),
  sessionCount: document.querySelector("#session-count"),
  starredCount: document.querySelector("#starred-count"),
  setCount: document.querySelector("#set-count"),
  progressBar: document.querySelector("#progress-bar"),
  wordGrid: document.querySelector("#word-grid")
};

function currentLearner() {
  return state.learners.find((learner) => learner.id === state.learnerId) || state.learners[0];
}

function currentModule() {
  return modules.find((module) => module.id === state.moduleId) || modules[0];
}

function moduleItems() {
  return currentModule().items || [];
}

function saveProgress() {
  localStorage.setItem(progressKey(state.learnerId, state.moduleId), JSON.stringify({
    known: setToArray(state.known),
    starred: setToArray(state.starred)
  }));
  localStorage.setItem(activeLearnerStorageKey, state.learnerId);
  localStorage.setItem(activeModuleStorageKey, state.moduleId);
}

function saveLearners() {
  localStorage.setItem(learnerStorageKey, JSON.stringify(state.learners));
  localStorage.setItem(activeLearnerStorageKey, state.learnerId);
}

function loadCurrentProgress() {
  const progress = loadProgress(state.learnerId, state.moduleId);
  state.known = progress.known;
  state.starred = progress.starred;
  state.practiced = new Set();
}

function renderLearners() {
  els.learnerSelect.replaceChildren();
  state.learners.forEach((learner) => {
    const option = document.createElement("option");
    option.value = learner.id;
    option.textContent = learner.name;
    els.learnerSelect.append(option);
  });
  els.learnerSelect.value = state.learnerId;
  els.activeLearnerName.textContent = currentLearner().name;
}

function renderModules() {
  els.moduleTabs.replaceChildren();
  modules.forEach((module) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "module-tab";
    button.classList.toggle("active", module.id === state.moduleId);
    button.classList.toggle("planned", module.status === "planned");
    button.disabled = module.status === "planned";
    button.innerHTML = `<strong>${module.title}</strong><small>${module.label}</small>`;
    button.addEventListener("click", () => switchModule(module.id));
    els.moduleTabs.append(button);
  });
  els.activeModuleName.textContent = currentModule().title;
}

function populateSets() {
  const module = currentModule();
  const items = moduleItems();
  els.setSelect.replaceChildren();
  for (let i = 0; i < Math.ceil(items.length / module.setSize); i += 1) {
    const option = document.createElement("option");
    option.value = String(i);
    const start = i * module.setSize + 1;
    const end = Math.min((i + 1) * module.setSize, items.length);
    option.textContent = `${module.itemLabelPlural[0].toUpperCase()}${module.itemLabelPlural.slice(1)} ${start}-${end}`;
    els.setSelect.append(option);
  }
  els.setSelect.value = String(state.set);
}

function setIndexes() {
  const module = currentModule();
  const items = moduleItems();
  const start = state.set * module.setSize;
  const indexes = [...Array(module.setSize).keys()]
    .map((offset) => start + offset)
    .filter((index) => index < items.length);
  return indexes.filter((index) => {
    const key = String(index);
    if (state.filter === "known") return state.known.has(key);
    if (state.filter === "learning") return !state.known.has(key);
    if (state.filter === "starred") return state.starred.has(key);
    return true;
  });
}

function currentIndexes() {
  const available = setIndexes();
  return state.order.filter((index) => available.includes(index));
}

function currentIndex() {
  const indexes = currentIndexes();
  if (!indexes.length) return null;
  state.index = Math.min(state.index, indexes.length - 1);
  return indexes[state.index];
}

function currentWord() {
  const index = currentIndex();
  return index === null ? "" : moduleItems()[index];
}

function speak(word = currentWord()) {
  if (!word) return;
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.rate = 0.72;
  utterance.pitch = 1.08;
  window.speechSynthesis.speak(utterance);
}

function chooseDistractors(answerIndex) {
  const indexes = setIndexes().filter((index) => index !== answerIndex);
  const shuffled = indexes.sort(() => Math.random() - 0.5).slice(0, 3);
  const choices = [answerIndex, ...shuffled].sort(() => Math.random() - 0.5);
  return choices.map((index) => moduleItems()[index]);
}

function renderMode() {
  const word = currentWord();
  els.modePanel.replaceChildren();

  if (!word) {
    const feedback = document.createElement("div");
    feedback.className = "feedback";
    feedback.textContent = "Try another set or practice filter";
    els.modePanel.append(feedback);
    return;
  }

  if (state.mode === "flash") {
    const feedback = document.createElement("div");
    feedback.className = "feedback";
    feedback.textContent = state.known.has(String(currentIndex())) ? `Known ${currentModule().itemLabel}` : `Practice this ${currentModule().itemLabel}`;
    els.modePanel.append(feedback);
    return;
  }

  if (state.mode === "listen") {
    const choices = document.createElement("div");
    choices.className = "choices";
    chooseDistractors(currentIndex()).forEach((choice) => {
      const button = document.createElement("button");
      button.className = "choice";
      button.type = "button";
      button.textContent = choice;
      button.addEventListener("click", () => {
        const right = choice === word;
        button.classList.add(right ? "correct" : "wrong");
        if (right) setKnown(currentIndex(), true);
      });
      choices.append(button);
    });
    els.modePanel.append(choices);
    window.setTimeout(() => speak(word), 180);
    return;
  }

  const row = document.createElement("form");
  row.className = "type-row";
  row.innerHTML = `
    <input id="type-answer" autocomplete="off" autocapitalize="none" aria-label="Type the word">
    <button type="submit">Check</button>
  `;
  const feedback = document.createElement("div");
  feedback.className = "feedback";
  row.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = row.querySelector("input");
    const answer = input.value.trim().toLowerCase();
    const target = word.toLowerCase();
    if (answer === target) {
      feedback.textContent = "Correct";
      setKnown(currentIndex(), true);
    } else {
      feedback.textContent = "Try again";
      input.select();
    }
  });
  els.modePanel.append(row, feedback);
}

function renderGrid() {
  els.wordGrid.replaceChildren();
  setIndexes().forEach((index) => {
    const word = moduleItems()[index];
    const key = String(index);
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = word;
    chip.classList.toggle("active", index === currentIndex());
    chip.classList.toggle("known", state.known.has(key));
    chip.classList.toggle("starred", state.starred.has(key));
    chip.addEventListener("click", () => {
      const visible = currentIndexes();
      state.index = Math.max(0, visible.indexOf(index));
      render();
    });
    els.wordGrid.append(chip);
  });
}

function render() {
  const word = currentWord();
  const visible = currentIndexes();
  const index = currentIndex();
  const key = index === null ? "" : String(index);
  const position = index === null ? 0 : index + 1;
  const total = moduleItems().length;
  if (index !== null) state.practiced.add(key);

  els.wordDisplay.textContent = word || "No words";
  els.wordPosition.textContent = visible.length
    ? `${position} / ${total}`
    : "No words here yet";
  els.starBtn.textContent = state.starred.has(key) ? "★" : "☆";
  els.knownBtn.textContent = state.known.has(key) ? "Mark learning" : "Mark known";
  els.knownCount.textContent = state.known.size;
  els.sessionCount.textContent = state.practiced.size;
  els.starredCount.textContent = state.starred.size;
  els.setCount.textContent = visible.length;
  els.progressBar.style.width = `${Math.round((state.known.size / total) * 100)}%`;

  renderLearners();
  renderModules();
  renderMode();
  renderGrid();
}

function move(delta) {
  const visible = currentIndexes();
  if (!visible.length) return;
  state.index = (state.index + delta + visible.length) % visible.length;
  render();
}

function markKnown(skipRender = false) {
  const index = currentIndex();
  if (index === null) return;
  const key = String(index);
  if (state.known.has(key)) {
    state.known.delete(key);
  } else {
    state.known.add(key);
  }
  saveProgress();
  if (!skipRender) render();
}

function setKnown(index, isKnown) {
  if (index === null) return;
  const key = String(index);
  if (isKnown) {
    state.known.add(key);
  } else {
    state.known.delete(key);
  }
  saveProgress();
  render();
}

function shuffleCurrentSet() {
  const visible = currentIndexes();
  const shuffledVisible = [...visible].sort(() => Math.random() - 0.5);
  const visibleSet = new Set(visible);
  const rest = state.order.filter((index) => !visibleSet.has(index));
  state.order = [...shuffledVisible, ...rest];
  state.index = 0;
  render();
}

function switchLearner(learnerId) {
  if (!state.learners.some((learner) => learner.id === learnerId)) return;
  state.learnerId = learnerId;
  state.index = 0;
  state.set = 0;
  loadCurrentProgress();
  populateSets();
  saveLearners();
  render();
}

function switchModule(moduleId) {
  const module = modules.find((item) => item.id === moduleId);
  if (!module || !module.items) return;
  state.moduleId = moduleId;
  state.index = 0;
  state.set = 0;
  state.order = [...module.items.keys()];
  loadCurrentProgress();
  populateSets();
  saveProgress();
  render();
}

function addLearner(name) {
  const cleaned = cleanName(name);
  if (!cleaned) return;
  const idBase = cleaned.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "learner";
  let id = idBase;
  let counter = 2;
  while (state.learners.some((learner) => learner.id === id)) {
    id = `${idBase}-${counter}`;
    counter += 1;
  }
  state.learners.push({ id, name: cleaned });
  state.learnerId = id;
  saveLearners();
  loadCurrentProgress();
  populateSets();
  render();
}

loadCurrentProgress();
populateSets();

els.setSelect.addEventListener("change", () => {
  state.set = Number(els.setSelect.value);
  state.index = 0;
  render();
});

els.modeSelect.addEventListener("change", () => {
  state.mode = els.modeSelect.value;
  render();
});

els.filterSelect.addEventListener("change", () => {
  state.filter = els.filterSelect.value;
  state.index = 0;
  render();
});

els.learnerSelect.addEventListener("change", () => switchLearner(els.learnerSelect.value));
els.learnerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addLearner(els.learnerName.value);
  els.learnerName.value = "";
});
els.prevBtn.addEventListener("click", () => move(-1));
els.nextBtn.addEventListener("click", () => move(1));
els.shuffleBtn.addEventListener("click", shuffleCurrentSet);
els.knownBtn.addEventListener("click", () => markKnown());
els.speakBtn.addEventListener("click", () => speak());
els.starBtn.addEventListener("click", () => {
  const index = currentIndex();
  if (index === null) return;
  const key = String(index);
  if (state.starred.has(key)) {
    state.starred.delete(key);
  } else {
    state.starred.add(key);
  }
  saveProgress();
  render();
});

document.addEventListener("keydown", (event) => {
  if (["INPUT", "SELECT", "BUTTON", "TEXTAREA"].includes(event.target.tagName)) return;
  if (event.key === "ArrowRight") move(1);
  if (event.key === "ArrowLeft") move(-1);
  if (event.key === " ") {
    event.preventDefault();
    speak();
  }
});

render();
