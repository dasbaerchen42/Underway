import { describe, expect, it } from "vitest";
import { starterHabitatItems } from "../../data/habitatItems";
import { createCreature } from "../creature/createCreature";
import { processOfflineTime } from "./processOfflineTime";
import type { FeedingRecord } from "../../types";

const LAST_VISIT = "2026-07-01T20:00:00.000Z";

function fruitFeeding(): FeedingRecord {
  return {
    id: "feeding-1",
    creatureId: "creature-1",
    foodId: "strawberry",
    meaningId: "ordinary",
    careIntentId: "together",
    note: "",
    showNoteInJournal: true,
    timestamp: "2026-07-01T19:00:00.000Z",
    digestion: {},
    dialogue: "",
    repeatWeight: 1,
  };
}

describe("offline events", () => {
  it("stays silent for short absences", () => {
    const creature = createCreature(LAST_VISIT);
    const result = processOfflineTime(
      LAST_VISIT,
      "2026-07-01T21:30:00.000Z",
      creature,
      starterHabitatItems,
      [],
    );
    expect(result.events).toHaveLength(0);
    expect(result.items).toBe(starterHabitatItems);
  });

  it("caps events at three even after months away", () => {
    const creature = createCreature(LAST_VISIT);
    const result = processOfflineTime(
      LAST_VISIT,
      "2026-10-01T20:00:00.000Z",
      creature,
      starterHabitatItems,
      [fruitFeeding()],
    );
    expect(result.events.length).toBeLessThanOrEqual(3);
    expect(result.events.length).toBeGreaterThan(0);
  });

  it("moves the lamp near the bed only after tendrils unlock", () => {
    const nowIso = "2026-07-03T20:00:00.000Z";
    const lamp = starterHabitatItems.find((item) => item.kind === "lamp")!;
    const bed = starterHabitatItems.find((item) => item.kind === "bed")!;

    const plain = createCreature(LAST_VISIT);
    const before = processOfflineTime(LAST_VISIT, nowIso, plain, starterHabitatItems, []);
    expect(before.events.map((event) => event.type)).not.toContain("tendril_lamp");

    const tendrily = { ...plain, unlockedTraits: ["tendrils" as const] };
    const after = processOfflineTime(LAST_VISIT, nowIso, tendrily, starterHabitatItems, []);
    expect(after.events.map((event) => event.type)).toContain("tendril_lamp");
    const movedLamp = after.items.find((item) => item.kind === "lamp")!;
    expect(movedLamp.x).not.toBe(lamp.x);
    expect(Math.abs(movedLamp.x - bed.x)).toBeLessThanOrEqual(10);
  });

  it("keeps results reproducible for the same absence", () => {
    const creature = { ...createCreature(LAST_VISIT), unlockedTraits: ["tendrils" as const] };
    const nowIso = "2026-07-05T08:00:00.000Z";
    const first = processOfflineTime(LAST_VISIT, nowIso, creature, starterHabitatItems, []);
    const second = processOfflineTime(LAST_VISIT, nowIso, creature, starterHabitatItems, []);
    expect(second.events).toEqual(first.events);
    expect(second.items).toEqual(first.items);
  });

  it("only buries a fruit core when fruit was fed recently", () => {
    const creature = createCreature(LAST_VISIT);
    const nowIso = "2026-07-03T20:00:00.000Z";
    const without = processOfflineTime(LAST_VISIT, nowIso, creature, starterHabitatItems, []);
    expect(without.events.map((event) => event.type)).not.toContain("fruit_core_pot");

    const withFruit = processOfflineTime(LAST_VISIT, nowIso, creature, starterHabitatItems, [
      fruitFeeding(),
    ]);
    expect(withFruit.events.map((event) => event.type)).toContain("fruit_core_pot");
  });
});
