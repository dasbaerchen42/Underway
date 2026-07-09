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
    playerSettings: {
      animation: candidate.playerSettings?.animation ?? "full",
      fontScale: candidate.playerSettings?.fontScale ?? "normal",
      theme: candidate.playerSettings?.theme ?? "clear",
      highContrast: candidate.playerSettings?.highContrast ?? false,
    },
    schemaVersion: CURRENT_SCHEMA_VERSION,
  } as GameState;
}
