import type { GameState } from "../types";

export type StorageAdapter = {
  load(): GameState | null;
  save(state: GameState): void;
  backup(state: GameState): void;
  clear(): void;
};
