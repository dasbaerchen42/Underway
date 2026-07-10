import { describe, expect, it } from "vitest";
import { dateKey } from "./buildJournalEntry";

describe("dateKey", () => {
  it("groups timestamps by the requested local timezone", () => {
    expect(dateKey("2026-07-09T16:30:00.000Z", "Asia/Taipei")).toBe("2026-07-10");
    expect(dateKey("2026-07-09T16:30:00.000Z", "UTC")).toBe("2026-07-09");
  });
});
