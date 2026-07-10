import { dialogueLines } from "../../data/dialogues";
import { foods } from "../../data/foods";
import type { Creature, FeedingInput } from "../../types";

export function selectDialogue(
  creature: Creature,
  input: FeedingInput,
  rng: () => number,
  recentDialogues: string[] = [],
) {
  const food = foods.find((item) => item.id === input.foodId);
  const memory = creature.foodMemory[input.foodId];
  const familiarOffset = memory && memory.uses > 2 ? 4 : 0;
  const availableLines = dialogueLines.filter(
    (line) => !recentDialogues.slice(0, 4).some((dialogue) => dialogue.startsWith(line)),
  );
  const pool = availableLines.length > 0 ? availableLines : dialogueLines;
  const index = Math.floor(rng() * pool.length + familiarOffset) % pool.length;
  return `${pool[index]}${food ? `（${food.name}的痕跡留了下來。）` : ""}`;
}
