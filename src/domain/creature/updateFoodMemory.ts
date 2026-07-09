import type { Creature, FeedingInput } from "../../types";

export function updateFoodMeaningMemory(creature: Creature, input: FeedingInput) {
  const current = creature.foodMemory[input.foodId] ?? {
    foodId: input.foodId,
    uses: 0,
    meaningCounts: {},
    dominantMeaningId: null,
    confidence: 0,
    confirmedByPlayer: false,
  };
  const meaningCounts = {
    ...current.meaningCounts,
    [input.meaningId]: (current.meaningCounts[input.meaningId] ?? 0) + 1,
  };
  const uses = current.uses + 1;
  const dominantMeaningId = Object.entries(meaningCounts).sort((a, b) => b[1] - a[1])[0][0];
  return {
    ...creature.foodMemory,
    [input.foodId]: {
      ...current,
      uses,
      meaningCounts,
      dominantMeaningId,
      confidence: Math.min(1, meaningCounts[dominantMeaningId] / Math.max(3, uses)),
    },
  };
}
