import type { GameState } from "../types";
import { migrateState } from "./migration";
import type { StorageAdapter } from "./storageAdapter";

const STORAGE_KEY = "underway:game-state";
const BACKUP_KEY = "underway:backup";

function loadBackups(): GameState[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(BACKUP_KEY) ?? "[]") as unknown;
    return Array.isArray(parsed)
      ? parsed.map(migrateState).filter((item): item is GameState => item !== null)
      : [];
  } catch {
    return [];
  }
}

export const localStorageAdapter: StorageAdapter = {
  load() {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return loadBackups()[0] ?? null;
    }
    try {
      return migrateState(JSON.parse(raw)) ?? loadBackups()[0] ?? null;
    } catch {
      return loadBackups()[0] ?? null;
    }
  },
  save(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return { ok: true };
    } catch {
      return { ok: false, message: "無法儲存進度，瀏覽器空間可能不足。" };
    }
  },
  backup(state) {
    try {
      const raw = window.localStorage.getItem(BACKUP_KEY);
      let backups: GameState[] = [];
      if (raw) {
        backups = loadBackups();
      }
      window.localStorage.setItem(BACKUP_KEY, JSON.stringify([state, ...backups].slice(0, 3)));
      return { ok: true };
    } catch {
      return { ok: false, message: "主要進度已儲存，但無法更新備份。" };
    }
  },
  clear() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(BACKUP_KEY);
      return { ok: true };
    } catch {
      return { ok: false, message: "無法清除瀏覽器中的舊存檔。" };
    }
  },
};
