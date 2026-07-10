import { describe, expect, it } from "vitest";
import { createCreature } from "./createCreature";
import { deriveVisualProfile } from "./deriveVisualProfile";

describe("deriveVisualProfile", () => {
  it("keeps a fresh creature free of particles and tendrils", () => {
    const creature = createCreature("2026-07-01T00:00:00.000Z");
    expect(deriveVisualProfile(creature)).toEqual({ moteCount: 0, tendrilCount: 0 });
  });

  it("scales motes with glow and floating motes", () => {
    const creature = createCreature("2026-07-01T00:00:00.000Z");
    creature.appearance.glow = 80;
    creature.appearance.floatingMotes = 70;
    expect(deriveVisualProfile(creature).moteCount).toBe(6);
  });

  it("grows tendril count with the tendril value", () => {
    const creature = createCreature("2026-07-01T00:00:00.000Z");
    creature.appearance.tendrils = 20;
    expect(deriveVisualProfile(creature).tendrilCount).toBe(2);
    creature.appearance.tendrils = 60;
    expect(deriveVisualProfile(creature).tendrilCount).toBe(3);
  });
});
