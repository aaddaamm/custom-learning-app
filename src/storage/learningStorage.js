const databaseUrl = "sqlite:learning.db";
const attemptsStorageKey = "learningAttempts";
const defaultAttemptsLimit = 50;

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

function normalizeAttempt(attempt) {
  if (!attempt?.learnerId || !attempt?.moduleId || !Number.isInteger(attempt?.itemIndex)) {
    return null;
  }

  return {
    id: String(attempt.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`),
    learnerId: String(attempt.learnerId),
    moduleId: String(attempt.moduleId),
    itemIndex: Number(attempt.itemIndex),
    mode: String(attempt.mode || "unknown"),
    correct: Boolean(attempt.correct),
    createdAt: String(attempt.createdAt || new Date().toISOString())
  };
}

function clampAttemptsLimit(limit) {
  if (!Number.isFinite(limit)) return defaultAttemptsLimit;
  return Math.max(1, Math.min(500, Math.floor(limit)));
}

function normalizeAttempts(attempts) {
  if (!Array.isArray(attempts)) return [];

  return attempts
    .map(normalizeAttempt)
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function summarizeProgress(progress, itemCount = null) {
  const nextProgress = normalizeProgress(progress);
  const knownCount = nextProgress.known.length;

  return {
    knownCount,
    starredCount: nextProgress.starred.length,
    learningCount: Number.isFinite(itemCount) ? Math.max(0, Number(itemCount) - knownCount) : null
  };
}

function summarizeAttempts(attempts) {
  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter((attempt) => attempt.correct).length;

  return {
    totalAttempts,
    correctAttempts,
    incorrectAttempts: Math.max(0, totalAttempts - correctAttempts),
    recentAccuracy: totalAttempts ? Math.round((correctAttempts / totalAttempts) * 100) : null
  };
}

export async function createLearningStorage() {
  if (window.__TAURI_INTERNALS__) {
    try {
      return await createSqliteStorage();
    } catch (error) {
      console.error("SQLite storage failed; using browser fallback.", error);
    }
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
      await db.execute("INSERT OR REPLACE INTO settings (key, value) VALUES ($1, $2)", [
        key,
        value
      ]);
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
    },
    async getAttempts({ learnerId, moduleId, since = null, limit = defaultAttemptsLimit } = {}) {
      if (!learnerId || !moduleId) return [];

      const params = [learnerId, moduleId];
      let query = `
        SELECT id, learner_id, module_id, item_index, mode, correct, created_at
        FROM attempts
        WHERE learner_id = $1 AND module_id = $2
      `;

      if (since) {
        query += " AND created_at >= $3";
        params.push(String(since));
      }

      const limitParam = clampAttemptsLimit(limit);
      query += ` ORDER BY datetime(created_at) DESC LIMIT $${params.length + 1}`;
      params.push(limitParam);

      const rows = await db.select(query, params);
      return rows.map((row) => ({
        id: String(row.id),
        learnerId: String(row.learner_id),
        moduleId: String(row.module_id),
        itemIndex: Number(row.item_index),
        mode: String(row.mode),
        correct: Boolean(row.correct),
        createdAt: String(row.created_at)
      }));
    },
    async getModuleSummary(learnerId, moduleId, { itemCount = null, since = null, limit } = {}) {
      if (!learnerId || !moduleId) {
        return {
          knownCount: 0,
          starredCount: 0,
          learningCount: Number.isFinite(itemCount) ? Number(itemCount) : null,
          totalAttempts: 0,
          correctAttempts: 0,
          incorrectAttempts: 0,
          recentAccuracy: null
        };
      }

      const [progress, attempts] = await Promise.all([
        this.getProgress(learnerId, moduleId),
        this.getAttempts({ learnerId, moduleId, since, limit })
      ]);

      return {
        ...summarizeProgress(progress, itemCount),
        ...summarizeAttempts(attempts)
      };
    }
  };
}

function createBrowserStorage() {
  const memory = {
    learners: [],
    progress: new Map(),
    settings: new Map(),
    attempts: []
  };

  return {
    label: "Browser fallback",
    async getLearners() {
      const savedLearners = readJson("learningProfiles", null);
      return savedLearners || memory.learners;
    },
    async saveLearner(learner) {
      const learners = readJson("learningProfiles", memory.learners);
      const next = learners.filter((item) => item.id !== learner.id);
      next.push(learner);
      memory.learners = next;
      try {
        localStorage.setItem("learningProfiles", JSON.stringify(next));
      } catch (error) {
        console.error("Browser storage failed to save learner.", error);
      }
    },
    async getSetting(key) {
      try {
        return localStorage.getItem(key) || memory.settings.get(key) || null;
      } catch {
        return memory.settings.get(key) || null;
      }
    },
    async saveSetting(key, value) {
      memory.settings.set(key, value);
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error("Browser storage failed to save setting.", error);
      }
    },
    async getProgress(learnerId, moduleId) {
      const key = progressKey(learnerId, moduleId);
      return normalizeProgress(readJson(key, memory.progress.get(key)));
    },
    async saveProgress(learnerId, moduleId, progress) {
      const key = progressKey(learnerId, moduleId);
      const next = normalizeProgress(progress);
      memory.progress.set(key, next);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch (error) {
        console.error("Browser storage failed to save progress.", error);
      }
    },
    async saveAttempt(attempt) {
      const nextAttempt = normalizeAttempt(attempt);
      if (!nextAttempt) return;

      const attempts = normalizeAttempts(readJson(attemptsStorageKey, memory.attempts));
      const nextAttempts = [nextAttempt, ...attempts];
      memory.attempts = nextAttempts;

      try {
        localStorage.setItem(attemptsStorageKey, JSON.stringify(nextAttempts));
      } catch (error) {
        console.error("Browser storage failed to save attempt.", error);
      }
    },
    async getAttempts({ learnerId, moduleId, since = null, limit = defaultAttemptsLimit } = {}) {
      if (!learnerId || !moduleId) return [];

      const attempts = normalizeAttempts(readJson(attemptsStorageKey, memory.attempts));
      memory.attempts = attempts;

      const filtered = attempts
        .filter((attempt) => attempt.learnerId === learnerId && attempt.moduleId === moduleId)
        .filter((attempt) => (since ? new Date(attempt.createdAt) >= new Date(since) : true));

      return filtered.slice(0, clampAttemptsLimit(limit));
    },
    async getModuleSummary(learnerId, moduleId, { itemCount = null, since = null, limit } = {}) {
      if (!learnerId || !moduleId) {
        return {
          knownCount: 0,
          starredCount: 0,
          learningCount: Number.isFinite(itemCount) ? Number(itemCount) : null,
          totalAttempts: 0,
          correctAttempts: 0,
          incorrectAttempts: 0,
          recentAccuracy: null
        };
      }

      const [progress, attempts] = await Promise.all([
        this.getProgress(learnerId, moduleId),
        this.getAttempts({ learnerId, moduleId, since, limit })
      ]);

      return {
        ...summarizeProgress(progress, itemCount),
        ...summarizeAttempts(attempts)
      };
    }
  };
}
