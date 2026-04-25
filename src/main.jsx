import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { modules } from "./modules/index.js";
import { createLearningStorage } from "./storage/learningStorage.js";
import "./styles.css";

const defaultLearner = { id: "learner-1", name: "Learner 1" };

function cleanName(name) {
  return name.trim().replace(/\s+/g, " ");
}

function makeLearnerId(name, learners) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "learner";
  let id = base;
  let counter = 2;
  while (learners.some((learner) => learner.id === id)) {
    id = `${base}-${counter}`;
    counter += 1;
  }
  return id;
}

function speak(text) {
  if (!text || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.72;
  utterance.pitch = 1.08;
  window.speechSynthesis.speak(utterance);
}

function App() {
  const [storage, setStorage] = useState(null);
  const [storageLabel, setStorageLabel] = useState("Loading");
  const [learners, setLearners] = useState([defaultLearner]);
  const [learnerId, setLearnerId] = useState(defaultLearner.id);
  const [moduleId, setModuleId] = useState("sightWords");
  const [progress, setProgress] = useState({ known: [], starred: [] });
  const [practiced, setPracticed] = useState(new Set());
  const [setNumber, setSetNumber] = useState(0);
  const [mode, setMode] = useState("flash");
  const [filter, setFilter] = useState("all");
  const [currentOffset, setCurrentOffset] = useState(0);
  const [order, setOrder] = useState([]);
  const [newLearnerName, setNewLearnerName] = useState("");

  const activeModule = modules.find((module) => module.id === moduleId) || modules[0];
  const activeLearner = learners.find((learner) => learner.id === learnerId) || learners[0];
  const items = activeModule.items || [];
  const known = useMemo(() => new Set(progress.known.map(String)), [progress.known]);
  const starred = useMemo(() => new Set(progress.starred.map(String)), [progress.starred]);

  useEffect(() => {
    let active = true;
    async function boot() {
      const nextStorage = await createLearningStorage();
      const savedLearners = await nextStorage.getLearners();
      const nextLearners = savedLearners.length ? savedLearners : [defaultLearner];
      if (!savedLearners.length) await nextStorage.saveLearner(defaultLearner);
      const savedLearnerId = await nextStorage.getSetting("activeLearnerId");
      const savedModuleId = await nextStorage.getSetting("activeModuleId");
      if (!active) return;
      setStorage(nextStorage);
      setStorageLabel(nextStorage.label);
      setLearners(nextLearners);
      setLearnerId(nextLearners.some((learner) => learner.id === savedLearnerId) ? savedLearnerId : nextLearners[0].id);
      setModuleId(modules.some((module) => module.id === savedModuleId && module.items) ? savedModuleId : "sightWords");
    }
    boot();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!storage) return;
    let active = true;
    async function loadProgress() {
      const savedProgress = await storage.getProgress(learnerId, moduleId);
      if (!active) return;
      setProgress(savedProgress);
      setPracticed(new Set());
      setCurrentOffset(0);
      setSetNumber(0);
      setOrder([...items.keys()]);
      await storage.saveSetting("activeLearnerId", learnerId);
      await storage.saveSetting("activeModuleId", moduleId);
    }
    loadProgress();
    return () => {
      active = false;
    };
  }, [storage, learnerId, moduleId, items.length]);

  const setIndexes = useMemo(() => {
    const start = setNumber * activeModule.setSize;
    return Array.from({ length: activeModule.setSize }, (_, offset) => start + offset)
      .filter((index) => index < items.length)
      .filter((index) => {
        const key = String(index);
        if (filter === "known") return known.has(key);
        if (filter === "learning") return !known.has(key);
        if (filter === "starred") return starred.has(key);
        return true;
      });
  }, [activeModule.setSize, filter, items.length, known, setNumber, starred]);

  const visibleIndexes = useMemo(() => {
    return order.filter((index) => setIndexes.includes(index));
  }, [order, setIndexes]);

  const currentIndex = visibleIndexes.length ? visibleIndexes[Math.min(currentOffset, visibleIndexes.length - 1)] : null;
  const currentItem = currentIndex === null ? "" : items[currentIndex];
  const currentKey = currentIndex === null ? "" : String(currentIndex);

  useEffect(() => {
    if (currentIndex === null) return;
    setPracticed((previous) => new Set(previous).add(String(currentIndex)));
  }, [currentIndex]);

  async function saveProgress(nextKnown, nextStarred) {
    const nextProgress = {
      known: [...nextKnown].sort((a, b) => Number(a) - Number(b)),
      starred: [...nextStarred].sort((a, b) => Number(a) - Number(b))
    };
    setProgress(nextProgress);
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

  function move(delta) {
    if (!visibleIndexes.length) return;
    setCurrentOffset((current) => (current + delta + visibleIndexes.length) % visibleIndexes.length);
  }

  function shuffleCurrentSet() {
    const shuffledVisible = [...visibleIndexes].sort(() => Math.random() - 0.5);
    const visibleSet = new Set(visibleIndexes);
    const rest = order.filter((index) => !visibleSet.has(index));
    setOrder([...shuffledVisible, ...rest]);
    setCurrentOffset(0);
  }

  async function addLearner(event) {
    event.preventDefault();
    const cleaned = cleanName(newLearnerName);
    if (!cleaned || !storage) return;
    const learner = { id: makeLearnerId(cleaned, learners), name: cleaned };
    await storage.saveLearner(learner);
    setLearners((current) => [...current, learner]);
    setLearnerId(learner.id);
    setNewLearnerName("");
  }

  function chooseDistractors() {
    const indexes = setIndexes.filter((index) => index !== currentIndex);
    const choices = [currentIndex, ...indexes.sort(() => Math.random() - 0.5).slice(0, 3)];
    return choices.sort(() => Math.random() - 0.5).map((index) => items[index]);
  }

  const totalSets = Math.ceil(items.length / activeModule.setSize);
  const progressPercent = items.length ? Math.round((known.size / items.length) * 100) : 0;

  return (
    <main className="app">
      <section className="practice" aria-labelledby="app-title">
        <div className="topbar">
          <div>
            <p className="kicker">Custom Learning</p>
            <h1 id="app-title">Learning path</h1>
          </div>
          <div className="meter" aria-label="Practice progress">
            <span>{known.size}</span>
            <span>known</span>
          </div>
        </div>

        <div className="learner-panel" aria-label="Learner profiles">
          <label>
            Learner
            <select value={learnerId} onChange={(event) => setLearnerId(event.target.value)}>
              {learners.map((learner) => (
                <option key={learner.id} value={learner.id}>{learner.name}</option>
              ))}
            </select>
          </label>
          <form className="learner-form" onSubmit={addLearner}>
            <input value={newLearnerName} onChange={(event) => setNewLearnerName(event.target.value)} placeholder="Add learner" aria-label="Learner name" />
            <button type="submit">Add</button>
          </form>
        </div>

        <div className="module-tabs" aria-label="Learning modules">
          {modules.map((module) => (
            <button
              key={module.id}
              type="button"
              className={`module-tab ${module.id === moduleId ? "active" : ""} ${module.status === "planned" ? "planned" : ""}`}
              disabled={module.status === "planned"}
              onClick={() => setModuleId(module.id)}
            >
              <strong>{module.title}</strong>
              <small>{module.label}</small>
            </button>
          ))}
        </div>

        <div className="controls" aria-label="Practice settings">
          <label>
            Set
            <select value={setNumber} onChange={(event) => { setSetNumber(Number(event.target.value)); setCurrentOffset(0); }}>
              {Array.from({ length: totalSets }, (_, index) => {
                const start = index * activeModule.setSize + 1;
                const end = Math.min((index + 1) * activeModule.setSize, items.length);
                return <option key={index} value={index}>Words {start}-{end}</option>;
              })}
            </select>
          </label>
          <label>
            Mode
            <select value={mode} onChange={(event) => setMode(event.target.value)}>
              <option value="flash">Flashcards</option>
              <option value="listen">Listen & find</option>
              <option value="type">Type it</option>
            </select>
          </label>
          <label>
            Practice
            <select value={filter} onChange={(event) => { setFilter(event.target.value); setCurrentOffset(0); }}>
              <option value="all">All words</option>
              <option value="learning">Still learning</option>
              <option value="known">Known words</option>
              <option value="starred">Starred words</option>
            </select>
          </label>
        </div>

        <SightWordCard
          mode={mode}
          word={currentItem}
          wordPosition={currentIndex === null ? "No words here yet" : `${currentIndex + 1} / ${items.length}`}
          isKnown={known.has(currentKey)}
          isStarred={starred.has(currentKey)}
          choices={mode === "listen" && currentIndex !== null ? chooseDistractors() : []}
          onSpeak={() => speak(currentItem)}
          onToggleStarred={toggleStarred}
          onChoice={(choice) => recordAttempt(currentIndex, choice === currentItem, "listen")}
          onTyped={(correct) => recordAttempt(currentIndex, correct, "type")}
        />

        <div className="actions">
          <button type="button" onClick={() => move(-1)}>Previous</button>
          <button type="button" onClick={shuffleCurrentSet}>Shuffle</button>
          <button className="primary" type="button" onClick={toggleKnown}>{known.has(currentKey) ? "Mark learning" : "Mark known"}</button>
          <button type="button" onClick={() => move(1)}>Next</button>
        </div>
      </section>

      <aside className="sidebar" aria-label="Learning path progress">
        <div className="learner-card">
          <small>Active learner</small>
          <strong>{activeLearner?.name || "Learner"}</strong>
          <span>{activeModule.title} · {storageLabel}</span>
        </div>
        <div className="summary">
          <div><span>{practiced.size}</span><small>today</small></div>
          <div><span>{starred.size}</span><small>starred</small></div>
          <div><span>{visibleIndexes.length}</span><small>in set</small></div>
        </div>
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="word-grid">
          {setIndexes.map((index) => {
            const key = String(index);
            return (
              <button
                key={index}
                type="button"
                className={`chip ${index === currentIndex ? "active" : ""} ${known.has(key) ? "known" : ""} ${starred.has(key) ? "starred" : ""}`}
                onClick={() => setCurrentOffset(Math.max(0, visibleIndexes.indexOf(index)))}
              >
                {items[index]}
              </button>
            );
          })}
        </div>
      </aside>
    </main>
  );
}

function SightWordCard({ mode, word, wordPosition, isKnown, isStarred, choices, onSpeak, onToggleStarred, onChoice, onTyped }) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setAnswer("");
    setFeedback("");
    if (mode === "listen" && word) window.setTimeout(onSpeak, 180);
  }, [mode, word]);

  function submitAnswer(event) {
    event.preventDefault();
    const correct = answer.trim().toLowerCase() === word.toLowerCase();
    setFeedback(correct ? "Correct" : "Try again");
    onTyped(correct);
  }

  return (
    <div className="card">
      <div className="card-meta">
        <span>{wordPosition}</span>
        <button className="icon-button" type="button" aria-label="Star word" title="Star word" onClick={onToggleStarred}>{isStarred ? "★" : "☆"}</button>
      </div>
      <button className="speak-button" type="button" title="Hear the word" onClick={onSpeak}>
        <span aria-hidden="true">▶</span>
        <span>Hear word</span>
      </button>
      <div className="word" aria-live="polite">{word || "No words"}</div>
      <div className="mode-panel">
        {mode === "flash" && <div className="feedback">{isKnown ? "Known word" : "Practice this word"}</div>}
        {mode === "listen" && (
          <div className="choices">
            {choices.map((choice) => <button key={choice} className="choice" type="button" onClick={() => onChoice(choice)}>{choice}</button>)}
          </div>
        )}
        {mode === "type" && (
          <>
            <form className="type-row" onSubmit={submitAnswer}>
              <input value={answer} onChange={(event) => setAnswer(event.target.value)} autoComplete="off" autoCapitalize="none" aria-label="Type the word" />
              <button type="submit">Check</button>
            </form>
            <div className="feedback">{feedback}</div>
          </>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
