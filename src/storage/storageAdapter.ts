import type { GameState } from "../types";

export type StorageResult =
  | { ok: true }
  | { ok: false; message: string };

export type StorageAdapter = {
  load(): GameState | null;
  save(state: GameState): StorageResult;
  backup(state: GameState): StorageResult;
  clear(): StorageResult;
};
