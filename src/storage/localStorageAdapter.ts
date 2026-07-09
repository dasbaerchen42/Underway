import type { GameState } from "../types";
import { migrateState } from "./migration";
import type { StorageAdapter } from "./storageAdapter";

const STORAGE_KEY = "underway:game-state";
const BACKUP_KEY = "underway:backup";

export const localStorageAdapter: StorageAdapter = {
  load() {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      return migrateState(JSON.parse(raw));
    } catch {
      return null;
    }
  },
  save(state) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },
  backup(state) {
    const backups = JSON.parse(window.localStorage.getItem(BACKUP_KEY) ?? "[]") as GameState[];
    window.localStorage.setItem(BACKUP_KEY, JSON.stringify([state, ...backups].slice(0, 3)));
  },
  clear() {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(BACKUP_KEY);
  },
};
