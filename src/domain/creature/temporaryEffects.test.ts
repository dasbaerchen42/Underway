import { describe, expect, it } from "vitest";
import { getActiveTemporaryEffects } from "./temporaryEffects";

describe("getActiveTemporaryEffects", () => {
  it("keeps future effects and removes expired or malformed ones", () => {
    const effects = [
      { id: "active", label: "active", until: "2026-07-10T01:00:00.000Z" },
      { id: "expired", label: "expired", until: "2026-07-09T23:00:00.000Z" },
      { id: "invalid", label: "invalid", until: "not-a-date" },
    ];

    expect(getActiveTemporaryEffects(effects, "2026-07-10T00:00:00.000Z")).toEqual([
      effects[0],
    ]);
  });
});
