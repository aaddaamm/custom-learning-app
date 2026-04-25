export function cleanLearnerName(name) {
  return name.trim().replace(/\s+/g, " ");
}

export function makeLearnerId(name, existingIds = []) {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "learner";

  let id = base;
  let counter = 2;
  while (existingIds.includes(id)) {
    id = `${base}-${counter}`;
    counter += 1;
  }

  return id;
}

export function getSetIndexes(setNumber, setSize, itemCount, filter, known, starred) {
  const start = setNumber * setSize;

  return Array.from({ length: setSize }, (_, offset) => start + offset)
    .filter((index) => index < itemCount)
    .filter((index) => {
      const key = String(index);
      if (filter === "known") return known.has(key);
      if (filter === "learning") return !known.has(key);
      if (filter === "starred") return starred.has(key);
      return true;
    });
}

export function chooseDistractors(index, indexesInSet, moduleItems) {
  const indexes = indexesInSet.filter((nextIndex) => nextIndex !== index);
  const nextChoices = [index, ...indexes.sort(() => Math.random() - 0.5).slice(0, 3)];

  return nextChoices.sort(() => Math.random() - 0.5).map((nextIndex) => moduleItems[nextIndex]);
}
