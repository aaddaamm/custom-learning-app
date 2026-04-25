import { fryWords } from "../data/fryWords.js";

export const modules = [
  {
    id: "sightWords",
    title: "Sight Words",
    label: "Fry 1,000",
    items: fryWords,
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
