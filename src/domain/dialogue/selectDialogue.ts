import { dialogueLines } from "../../data/dialogues";
import { foods } from "../../data/foods";
import type { Creature, FeedingInput } from "../../types";

export function selectDialogue(
  creature: Creature,
  input: FeedingInput,
  rng: () => number,
) {
  const food = foods.find((item) => item.id === input.foodId);
  const memory = creature.foodMemory[input.foodId];
  const familiarOffset = memory && memory.uses > 2 ? 4 : 0;
  const index = Math.floor(rng() * dialogueLines.length + familiarOffset) % dialogueLines.length;
  return `${dialogueLines[index]}${food ? `（${food.name}的痕跡留了下來。）` : ""}`;
}
