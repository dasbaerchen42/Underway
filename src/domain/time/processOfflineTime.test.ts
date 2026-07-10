import { describe, expect, it } from "vitest";
import { processOfflineTime } from "./processOfflineTime";

describe("processOfflineTime", () => {
  it("never generates more than three events", () => {
    const events = processOfflineTime(
      "2026-01-01T00:00:00.000Z",
      "2026-07-10T00:00:00.000Z",
      "creature-1",
    );

    expect(events).toHaveLength(3);
  });

  it("does not punish a short absence", () => {
    expect(
      processOfflineTime(
        "2026-07-10T00:00:00.000Z",
        "2026-07-10T01:00:00.000Z",
        "creature-1",
      ),
    ).toEqual([]);
  });
});
