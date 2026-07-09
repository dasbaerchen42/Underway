import { describe, expect, it } from "vitest";
import { createCreature } from "../creature/createCreature";
import { completeFeeding } from "./completeFeeding";
import { calculateDiminishingReturn } from "./diminishingReturns";
import type { FeedingInput, FeedingRecord } from "../../types";

const baseInput: FeedingInput = {
  creatureId: "creature-1",
  foodId: "blueberry",
  meaningId: "unclear_weight",
  careIntentId: "digest",
  note: "",
  showNoteInJournal: true,
  timestamp: "2026-07-09T10:00:00.000Z",
};

describe("feeding domain", () => {
  it("keeps seeded feeding results reproducible", () => {
    const creature = createCreature("2026-07-09T00:00:00.000Z");
    const first = completeFeeding(creature, baseInput, []);
    const second = completeFeeding(creature, baseInput, []);

    expect(second.record.digestion).toEqual(first.record.digestion);
    expect(second.record.dialogue).toEqual(first.record.dialogue);
  });

  it("reduces long-term weight for repeated food and meaning", () => {
    const previous = Array.from({ length: 3 }, (_, index) => ({
      ...baseInput,
      id: `feeding-${index}`,
      timestamp: `2026-07-09T09:5${index}:00.000Z`,
      digestion: {},
      dialogue: "",
      repeatWeight: 1,
    })) satisfies FeedingRecord[];

    expect(calculateDiminishingReturn(baseInput, previous)).toBeLessThan(0.6);
  });

  it("does not invert the direction of cold and deep food", () => {
    const creature = createCreature("2026-07-09T00:00:00.000Z");
    const result = completeFeeding(creature, baseInput, []);

    expect(result.record.digestion.hueBlue).toBeGreaterThan(0);
    expect(result.creature.appearance.hueBlue).toBeGreaterThan(creature.appearance.hueBlue);
  });
});
