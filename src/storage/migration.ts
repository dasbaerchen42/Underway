import type { GameState } from "../types";

export const CURRENT_SCHEMA_VERSION = 1;

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
    schemaVersion: CURRENT_SCHEMA_VERSION,
  } as GameState;
}
