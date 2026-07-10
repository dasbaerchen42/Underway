import { describe, expect, it } from "vitest";
import { createCreature } from "./createCreature";
import { resolveTouch, type TouchOutcome } from "./resolveTouch";

function outcomeCounts(creature: ReturnType<typeof createCreature>) {
  const counts: Record<TouchOutcome, number> = { accept: 0, retreat: 0, still: 0, tendril: 0 };
  for (let index = 0; index < 300; index += 1) {
    const iso = new Date(Date.UTC(2026, 6, 10, 0, 0, index)).toISOString();
    counts[resolveTouch(creature, "body", iso).outcome] += 1;
  }
  return counts;
}

describe("resolveTouch", () => {
  it("is reproducible for the same moment and zone", () => {
    const creature = createCreature("2026-07-01T00:00:00.000Z");
    const first = resolveTouch(creature, "head", "2026-07-10T10:00:00.000Z");
    const second = resolveTouch(creature, "head", "2026-07-10T10:00:00.000Z");
    expect(second).toEqual(first);
  });

  it("never guarantees acceptance", () => {
    const creature = createCreature("2026-07-01T00:00:00.000Z");
    const counts = outcomeCounts(creature);
    expect(counts.accept).toBeLessThan(300);
    expect(counts.accept + counts.retreat + counts.still + counts.tendril).toBe(300);
  });

  it("retreats more often when boundary is high and connection low", () => {
    const warm = createCreature("2026-07-01T00:00:00.000Z");
    warm.recentMemory.emotional.connection = 1.6;
    warm.recentMemory.emotional.boundary = -0.5;

    const guarded = createCreature("2026-07-01T00:00:00.000Z");
    guarded.recentMemory.emotional.connection = -1.2;
    guarded.recentMemory.emotional.boundary = 1.8;

    expect(outcomeCounts(guarded).retreat).toBeGreaterThan(outcomeCounts(warm).retreat);
  });

  it("answers with tendrils more often at the tail once tendrils exist", () => {
    const creature = createCreature("2026-07-01T00:00:00.000Z");
    creature.unlockedTraits = ["tendrils"];
    creature.appearance.tendrils = 60;
    let tailTendril = 0;
    let headTendril = 0;
    for (let index = 0; index < 300; index += 1) {
      const iso = new Date(Date.UTC(2026, 6, 10, 1, 0, index)).toISOString();
      if (resolveTouch(creature, "tail", iso).outcome === "tendril") tailTendril += 1;
      if (resolveTouch(creature, "head", iso).outcome === "tendril") headTendril += 1;
    }
    expect(tailTendril).toBeGreaterThan(headTendril);
  });
});
