const databaseUrl = "sqlite:learning.db";

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function progressKey(learnerId, moduleId) {
  return `learningProgress:${learnerId}:${moduleId}`;
}

function normalizeProgress(progress) {
  return {
    known: (progress?.known || []).map(String),
    starred: (progress?.starred || []).map(String)
  };
}

export async function createLearningStorage() {
  if (window.__TAURI_INTERNALS__) {
    return createSqliteStorage();
  }
  return createBrowserStorage();
}

async function createSqliteStorage() {
  const Database = await import("@tauri-apps/plugin-sql");
  const db = await Database.default.load(databaseUrl);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS learners (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS progress (
      learner_id TEXT NOT NULL,
      module_id TEXT NOT NULL,
      known_indexes TEXT NOT NULL DEFAULT '[]',
      starred_indexes TEXT NOT NULL DEFAULT '[]',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (learner_id, module_id)
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS attempts (
      id TEXT PRIMARY KEY,
      learner_id TEXT NOT NULL,
      module_id TEXT NOT NULL,
      item_index INTEGER NOT NULL,
      mode TEXT NOT NULL,
      correct INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);

  return {
    label: "SQLite",
    async getLearners() {
      return db.select("SELECT id, name FROM learners ORDER BY created_at ASC");
    },
    async saveLearner(learner) {
      await db.execute(
        "INSERT OR REPLACE INTO learners (id, name, created_at) VALUES ($1, $2, COALESCE((SELECT created_at FROM learners WHERE id = $1), CURRENT_TIMESTAMP))",
        [learner.id, learner.name]
      );
    },
    async getSetting(key) {
      const rows = await db.select("SELECT value FROM settings WHERE key = $1", [key]);
      return rows[0]?.value || null;
    },
    async saveSetting(key, value) {
      await db.execute("INSERT OR REPLACE INTO settings (key, value) VALUES ($1, $2)", [key, value]);
    },
    async getProgress(learnerId, moduleId) {
      const rows = await db.select(
        "SELECT known_indexes, starred_indexes FROM progress WHERE learner_id = $1 AND module_id = $2",
        [learnerId, moduleId]
      );
      if (!rows.length) return { known: [], starred: [] };
      return {
        known: JSON.parse(rows[0].known_indexes || "[]"),
        starred: JSON.parse(rows[0].starred_indexes || "[]")
      };
    },
    async saveProgress(learnerId, moduleId, progress) {
      const next = normalizeProgress(progress);
      await db.execute(
        `INSERT OR REPLACE INTO progress
          (learner_id, module_id, known_indexes, starred_indexes, updated_at)
          VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
        [learnerId, moduleId, JSON.stringify(next.known), JSON.stringify(next.starred)]
      );
    },
    async saveAttempt(attempt) {
      await db.execute(
        `INSERT INTO attempts (id, learner_id, module_id, item_index, mode, correct, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
        [
          `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          attempt.learnerId,
          attempt.moduleId,
          attempt.itemIndex,
          attempt.mode,
          attempt.correct ? 1 : 0
        ]
      );
    }
  };
}

function createBrowserStorage() {
  return {
    label: "Browser fallback",
    async getLearners() {
      return readJson("learningProfiles", []);
    },
    async saveLearner(learner) {
      const learners = readJson("learningProfiles", []);
      const next = learners.filter((item) => item.id !== learner.id);
      next.push(learner);
      localStorage.setItem("learningProfiles", JSON.stringify(next));
    },
    async getSetting(key) {
      return localStorage.getItem(key);
    },
    async saveSetting(key, value) {
      localStorage.setItem(key, value);
    },
    async getProgress(learnerId, moduleId) {
      return normalizeProgress(readJson(progressKey(learnerId, moduleId), null));
    },
    async saveProgress(learnerId, moduleId, progress) {
      localStorage.setItem(progressKey(learnerId, moduleId), JSON.stringify(normalizeProgress(progress)));
    },
    async saveAttempt() {}
  };
}
