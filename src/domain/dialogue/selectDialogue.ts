import { dialogueEntries } from "../../data/dialogues";
import { foods } from "../../data/foods";
import type {
  AppearanceTraitKey,
  Creature,
  DialogueEntry,
  DialogueIntent,
  FeedingInput,
  FeedingSignal,
} from "../../types";

// 相同台詞至少冷卻這麼多次互動(依規格 §12.4，保存最近台詞 ID)。
export const DIALOGUE_COOLDOWN = 8;

export type DialogueContext = {
  input: FeedingInput;
  signal: FeedingSignal;
  repeatWeight: number;
  newTraits: AppearanceTraitKey[];
  hoursSinceLastInteraction: number | null;
};

export function resolveDialogueIntent(
  creature: Creature,
  context: DialogueContext,
): DialogueIntent {
  const { input, signal, repeatWeight, newTraits, hoursSinceLastInteraction } = context;
  const memory = creature.foodMemory[input.foodId];
  const { emotional } = signal;
  const care = signal.careIntent;

  if (hoursSinceLastInteraction !== null && hoursSinceLastInteraction >= 48) {
    return "long_absence";
  }
  if (newTraits.length > 0) {
    return "appearance_change";
  }
  if (!memory || memory.uses === 0) {
    return "first_food";
  }
  if (
    memory.uses >= 3 &&
    memory.dominantMeaningId !== null &&
    memory.dominantMeaningId !== input.meaningId
  ) {
    return "meaning_shift";
  }
  if (repeatWeight <= 0.6) {
    return "repeat_feeding";
  }
  if (emotional.activation >= 1.2) {
    return "intense";
  }
  if (emotional.connection <= -0.8) {
    return "solitude";
  }
  if (emotional.connection >= 1.2) {
    return "closeness";
  }
  if (emotional.clarity <= -1.2) {
    return "confused_accept";
  }
  if (care.silence >= 1.4) {
    return "silence";
  }
  if (care.preservation >= 1.2) {
    return "preserve";
  }
  if (care.release >= 1 || care.digestion >= 1.5) {
    return "release";
  }
  if (memory.uses >= 3) {
    return "familiar_food";
  }
  return "calm_daily";
}

function pickWeighted(entries: DialogueEntry[], rng: () => number): DialogueEntry {
  const total = entries.reduce((sum, entry) => sum + (entry.weight ?? 1), 0);
  let cursor = rng() * total;
  for (const entry of entries) {
    cursor -= entry.weight ?? 1;
    if (cursor <= 0) {
      return entry;
    }
  }
  return entries[entries.length - 1];
}

function fillTemplate(line: string, creature: Creature, input: FeedingInput): string {
  const food = foods.find((item) => item.id === input.foodId);
  return line
    .replaceAll("{creatureName}", creature.name)
    .replaceAll("{foodName}", food?.name ?? "食物");
}

export function selectDialogue(
  creature: Creature,
  context: DialogueContext,
  rng: () => number,
): { line: string; entryId: string; intent: DialogueIntent } {
  const intent = resolveDialogueIntent(creature, context);
  const recent = creature.recentDialogueIds ?? [];
  const pool = dialogueEntries.filter((entry) => entry.intent === intent);
  const fresh = pool.filter((entry) => !recent.includes(entry.id));
  const candidates = fresh.length > 0 ? fresh : pool;
  const entry = pickWeighted(candidates, rng);
  return {
    line: fillTemplate(entry.line, creature, context.input),
    entryId: entry.id,
    intent,
  };
}
