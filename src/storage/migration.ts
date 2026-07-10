import type { Creature, GameState } from "../types";

export const CURRENT_SCHEMA_VERSION = 2;

export function migrateState(value: unknown): GameState | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const candidate = value as Partial<GameState>;
  if (!candidate.creatures || !candidate.feedings || !candidate.habitat) {
    return null;
  }
  return {
    ...candidate,
    // v1 -> v2:養成物新增最近台詞紀錄(對話冷卻用)。
    creatures: candidate.creatures.map((creature: Creature) => ({
      ...creature,
      recentDialogueIds: creature.recentDialogueIds ?? [],
    })),
    schemaVersion: CURRENT_SCHEMA_VERSION,
  } as GameState;
}
