import { calculateDiminishingReturn } from "./diminishingReturns";
import { calculateFeedingSignal } from "./calculateFeedingSignal";
import { DIALOGUE_COOLDOWN, selectDialogue } from "../dialogue/selectDialogue";
import { translateToAppearance } from "../creature/translateToAppearance";
import { unlockTraits } from "../creature/unlockTraits";
import { updateFoodMeaningMemory } from "../creature/updateFoodMemory";
import { createSeededRandom } from "../random/seededRandom";
import { applyAppearanceDelta, blendSignal } from "../vectors";
import type { Creature, FeedingInput, FeedingRecord } from "../../types";

export function completeFeeding(
  creature: Creature,
  input: FeedingInput,
  previousFeedings: FeedingRecord[],
): { creature: Creature; record: FeedingRecord } {
  const id = `feeding-${input.timestamp}-${previousFeedings.length + 1}`;
  const signal = calculateFeedingSignal(input.foodId, input.meaningId, input.careIntentId);
  const repeatWeight = calculateDiminishingReturn(input, previousFeedings);
  const seed = [
    creature.id,
    id,
    input.timestamp,
    input.foodId,
    input.meaningId,
    input.careIntentId,
  ].join("-");
  const rng = createSeededRandom(seed);
  const digestion = translateToAppearance(creature, signal, repeatWeight, rng);
  const updatedCreature: Creature = {
    ...creature,
    appearance: applyAppearanceDelta(creature.appearance, digestion),
    recentMemory: blendSignal(creature.recentMemory, signal, 0.45),
    longTermMemory: blendSignal(creature.longTermMemory, signal, 0.08 * repeatWeight),
    foodMemory: updateFoodMeaningMemory(creature, input),
    lastInteractionAt: input.timestamp,
    lastDigestionAt: input.timestamp,
    activeTemporaryEffects: [
      {
        id: `effect-${id}`,
        label: "進食後的核心波紋",
        until: new Date(new Date(input.timestamp).getTime() + 1000 * 60 * 30).toISOString(),
      },
    ],
  };
  updatedCreature.unlockedTraits = unlockTraits(updatedCreature);
  const newTraits = updatedCreature.unlockedTraits.filter(
    (trait) => !creature.unlockedTraits.includes(trait),
  );
  const hoursSinceLastInteraction = creature.lastInteractionAt
    ? (new Date(input.timestamp).getTime() - new Date(creature.lastInteractionAt).getTime()) /
      (1000 * 60 * 60)
    : null;
  // 用餵食前的記憶判定意圖(first_food / meaning_shift 需比對舊狀態)。
  const dialogue = selectDialogue(
    creature,
    { input, signal, repeatWeight, newTraits, hoursSinceLastInteraction },
    rng,
  );
  updatedCreature.recentDialogueIds = [
    dialogue.entryId,
    ...(creature.recentDialogueIds ?? []),
  ].slice(0, DIALOGUE_COOLDOWN + 2);
  const record: FeedingRecord = {
    ...input,
    id,
    digestion,
    dialogue: dialogue.line,
    repeatWeight,
  };

  return { creature: updatedCreature, record };
}
