import { fryWords } from "../data/fryWords.js";
import SightWordsPracticeCard from "./sightWords/SightWordsPracticeCard.svelte";

export const modules = [
  {
    id: "sightWords",
    title: "Sight Words",
    label: "Fry 1,000",
    items: fryWords,
    setSize: 50,
    practiceCard: SightWordsPracticeCard
  }
];
