import { describe, expect, it } from "vitest";
import { migrateState } from "./migration";

describe("migrateState", () => {
  it("rejects values that are not recognizable saves", () => {
    expect(migrateState(null)).toBeNull();
    expect(migrateState({ creatures: [] })).toBeNull();
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
    expect(state?.playerSettings.theme).toBe("neon");
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

  it("derives the latest feeding echo for saves created before reactions existed", () => {
    const state = migrateState({
      creatures: [{}],
      feedings: [
        {
          id: "feeding-1",
          creatureId: "creature-1",
          foodId: "strawberry",
          meaningId: "light",
          careIntentId: "together",
          note: "",
          showNoteInJournal: true,
          timestamp: "2026-07-10T00:00:00.000Z",
          digestion: {},
          dialogue: "牠把這份味道收好了。",
          repeatWeight: 1,
        },
      ],
    });

    expect(state?.lastReaction).toMatchObject({
      kind: "feeding",
      label: "草莓的回聲",
      text: "牠把這份味道收好了。",
    });
  });
});
