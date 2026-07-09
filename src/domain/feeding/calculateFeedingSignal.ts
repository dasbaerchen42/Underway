import { careIntents } from "../../data/careIntents";
import { foods } from "../../data/foods";
import { meanings } from "../../data/meanings";
import type { FeedingSignal } from "../../types";

export function calculateFeedingSignal(
  foodId: string,
  meaningId: string,
  careIntentId: string,
): FeedingSignal {
  const food = foods.find((item) => item.id === foodId);
  const meaning = meanings.find((item) => item.id === meaningId);
  const careIntent = careIntents.find((item) => item.id === careIntentId);

  if (!food || !meaning || !careIntent) {
    throw new Error("Invalid feeding input");
  }

  return {
    sensory: food.sensory,
    emotional: meaning.emotional,
    careIntent: careIntent.vector,
  };
}
