import { describe, expect, it } from "vitest";
import { dialogueLines } from "../../data/dialogues";
import { createCreature } from "../creature/createCreature";
import { selectDialogue } from "./selectDialogue";

describe("selectDialogue", () => {
  it("avoids repeating one of the four latest lines when alternatives exist", () => {
    const creature = createCreature("2026-07-10T00:00:00.000Z");
    const dialogue = selectDialogue(
      creature,
      {
        creatureId: creature.id,
        foodId: "strawberry",
        meaningId: "light",
        careIntentId: "together",
        note: "",
        showNoteInJournal: true,
        timestamp: "2026-07-10T00:00:00.000Z",
      },
      () => 0,
      [dialogueLines[0]],
    );

    expect(dialogue.startsWith(dialogueLines[0])).toBe(false);
  });
});
