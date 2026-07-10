import { describe, expect, it } from "vitest";
import { createCreature } from "./createCreature";
import { deriveVisualProfile, mixAppearanceColor } from "./deriveVisualProfile";

describe("deriveVisualProfile", () => {
  it("keeps particles bounded and maps high tendril affinity to five strands", () => {
    const creature = createCreature("2026-07-10T00:00:00.000Z");
    creature.unlockedTraits = ["tendrils"];
    creature.appearance.tendrils = 92;
    creature.appearance.wetness = 100;
    creature.appearance.fluidMotion = 100;
    creature.appearance.glow = 100;
    creature.appearance.floatingMotes = 100;

    const profile = deriveVisualProfile(creature);

    expect(profile.tendrilCount).toBe(5);
    expect(profile.bubbleCount + profile.starCount).toBeLessThanOrEqual(10);
  });

  it("lets an unlocked tendril form recede without disappearing", () => {
    const creature = createCreature("2026-07-10T00:00:00.000Z");
    creature.unlockedTraits = ["tendrils"];
    creature.appearance.tendrils = 12;

    expect(deriveVisualProfile(creature).tendrilCount).toBe(2);
  });

  it("produces visibly different flat colors for cool and warm histories", () => {
    expect(mixAppearanceColor(100, 0)).not.toBe(mixAppearanceColor(0, 100));
  });
});
