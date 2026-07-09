import { describe, expect, it } from "vitest";
import { createCreature } from "./createCreature";
import { unlockTraits } from "./unlockTraits";

describe("unlockTraits", () => {
  it("unlocks structural traits at thresholds and keeps previous traits", () => {
    const creature = createCreature("2026-07-09T00:00:00.000Z");
    creature.unlockedTraits = ["membrane"];
    creature.appearance.tendrils = 31;
    creature.appearance.crystals = 29;

    expect(unlockTraits(creature)).toEqual(expect.arrayContaining(["membrane", "tendrils", "crystals"]));
  });
});
