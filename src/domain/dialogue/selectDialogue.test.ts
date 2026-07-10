import { describe, expect, it } from "vitest";
import { createCreature } from "../creature/createCreature";
import { calculateFeedingSignal } from "../feeding/calculateFeedingSignal";
import { resolveDialogueIntent, selectDialogue, type DialogueContext } from "./selectDialogue";
import type { FeedingInput } from "../../types";

function buildContext(overrides?: Partial<DialogueContext>): DialogueContext {
  const input: FeedingInput = {
    creatureId: "creature-1",
    foodId: "strawberry",
    meaningId: "ordinary",
    careIntentId: "together",
    note: "",
    showNoteInJournal: true,
    timestamp: "2026-07-10T10:00:00.000Z",
  };
  return {
    input,
    signal: calculateFeedingSignal(input.foodId, input.meaningId, input.careIntentId),
    repeatWeight: 1,
    newTraits: [],
    hoursSinceLastInteraction: 1,
    ...overrides,
  };
}

describe("dialogue intent", () => {
  it("uses first_food for a food never fed before", () => {
    const creature = createCreature("2026-07-01T00:00:00.000Z");
    expect(resolveDialogueIntent(creature, buildContext())).toBe("first_food");
  });

  it("prioritizes long absence over everything else", () => {
    const creature = createCreature("2026-07-01T00:00:00.000Z");
    const context = buildContext({ hoursSinceLastInteraction: 72 });
    expect(resolveDialogueIntent(creature, context)).toBe("long_absence");
  });

  it("notices a newly unlocked trait", () => {
    const creature = createCreature("2026-07-01T00:00:00.000Z");
    const context = buildContext({ newTraits: ["tendrils"] });
    expect(resolveDialogueIntent(creature, context)).toBe("appearance_change");
  });
});

describe("dialogue cooldown", () => {
  it("avoids recently used lines while fresh ones remain", () => {
    const creature = createCreature("2026-07-01T00:00:00.000Z");
    const context = buildContext();
    const used: string[] = [];
    for (let index = 0; index < 5; index += 1) {
      const result = selectDialogue(
        { ...creature, recentDialogueIds: used },
        context,
        () => 0.01,
      );
      expect(used).not.toContain(result.entryId);
      used.push(result.entryId);
    }
  });
});
