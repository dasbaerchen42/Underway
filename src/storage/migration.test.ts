import { describe, expect, it } from "vitest";
import { migrateState } from "./migration";

describe("migrateState", () => {
  it("rejects values that are not recognizable saves", () => {
    expect(migrateState(null)).toBeNull();
    expect(migrateState({ creatures: [] })).toBeNull();
    expect(migrateState("save")).toBeNull();
  });

  it("repairs partial saves and resets session initialization", () => {
    const state = migrateState({
      creatures: [{}],
      feedings: [],
      playerSettings: { theme: "neon", fontScale: "large" },
      initialized: true,
      lastVisitAt: "2026-07-09T16:30:00.000Z",
    });

    expect(state).not.toBeNull();
    expect(state?.creatures).toHaveLength(1);
    expect(state?.creatures[0].appearance).toBeDefined();
    expect(state?.creatures[0].recentDialogueIds).toEqual([]);
    expect(state?.initialized).toBe(false);
    expect(state?.habitat.items.length).toBeGreaterThan(0);
  });

  it("drops malformed records instead of passing them into the UI", () => {
    const state = migrateState({
      creatures: [{}],
      feedings: [{ id: "broken" }],
      worldEvents: [{ id: "broken" }],
    });

    expect(state?.feedings).toEqual([]);
    expect(state?.worldEvents).toEqual([]);
    expect(state?.journalEntries).toHaveLength(1);
  });

  it("keeps valid creature fields while backfilling missing ones", () => {
    const state = migrateState({
      creatures: [
        {
          name: "小玻",
          appearance: { hueBlue: 42, tendrils: "not-a-number" },
          unlockedTraits: ["tendrils", "not-a-trait"],
          recentDialogueIds: ["calm-1", 42, "calm-2"],
        },
      ],
      feedings: [],
    });

    const creature = state?.creatures[0];
    expect(creature?.name).toBe("小玻");
    expect(creature?.appearance.hueBlue).toBe(42);
    expect(creature?.appearance.tendrils).toBe(8);
    expect(creature?.unlockedTraits).toEqual(["tendrils"]);
    expect(creature?.recentDialogueIds).toEqual(["calm-1", "calm-2"]);
  });

  it("ignores settings fields that no longer exist", () => {
    const state = migrateState({
      creatures: [{}],
      feedings: [],
      playerSettings: { theme: "neon", highContrast: true, fontScale: "large" },
    });
    expect(state).not.toBeNull();
    expect("playerSettings" in (state ?? {})).toBe(false);
  });
});
