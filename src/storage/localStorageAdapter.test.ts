import { afterEach, describe, expect, it, vi } from "vitest";
import { migrateState } from "./migration";
import { localStorageAdapter } from "./localStorageAdapter";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

afterEach(() => vi.unstubAllGlobals());

describe("localStorageAdapter", () => {
  it("replaces a corrupted backup without blocking the main save", () => {
    const storage = new MemoryStorage();
    vi.stubGlobal("window", { localStorage: storage });
    const state = migrateState({ creatures: [{}], feedings: [] });
    if (!state) {
      throw new Error("Expected a valid fixture");
    }
    storage.setItem("underway:backup", "{");

    expect(localStorageAdapter.save(state)).toEqual({ ok: true });
    expect(localStorageAdapter.backup(state)).toEqual({ ok: true });
    expect(JSON.parse(storage.getItem("underway:backup") ?? "[]")).toHaveLength(1);
    expect(localStorageAdapter.load()?.creatures).toHaveLength(1);
  });

  it("restores the newest valid backup when the main save is corrupted", () => {
    const storage = new MemoryStorage();
    vi.stubGlobal("window", { localStorage: storage });
    const state = migrateState({ creatures: [{ name: "備份中的名字" }], feedings: [] });
    if (!state) {
      throw new Error("Expected a valid fixture");
    }
    storage.setItem("underway:game-state", "{");
    storage.setItem("underway:backup", JSON.stringify([state]));

    expect(localStorageAdapter.load()?.creatures[0].name).toBe("備份中的名字");
  });
});
