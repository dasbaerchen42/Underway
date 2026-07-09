import type { AppearanceTraitKey, Creature } from "../../types";

const thresholds: Array<[AppearanceTraitKey, number]> = [
  ["tendrils", 30],
  ["membrane", 30],
  ["crystals", 28],
  ["flora", 28],
  ["horns", 34],
  ["floatingMotes", 32],
  ["darkCore", 38],
];

export function unlockTraits(creature: Creature): AppearanceTraitKey[] {
  const unlocked = new Set(creature.unlockedTraits);
  for (const [trait, threshold] of thresholds) {
    if (creature.appearance[trait] >= threshold) {
      unlocked.add(trait);
    }
  }
  return [...unlocked];
}
