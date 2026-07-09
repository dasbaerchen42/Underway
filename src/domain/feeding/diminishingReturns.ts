import type { FeedingInput, FeedingRecord } from "../../types";

const WINDOW_HOURS = 6;

export function calculateDiminishingReturn(
  input: FeedingInput,
  feedings: FeedingRecord[],
) {
  const timestamp = new Date(input.timestamp).getTime();
  const windowMs = WINDOW_HOURS * 60 * 60 * 1000;
  const similarCount = feedings.filter((feeding) => {
    const feedingTime = new Date(feeding.timestamp).getTime();
    return (
      timestamp - feedingTime <= windowMs &&
      timestamp >= feedingTime &&
      feeding.foodId === input.foodId &&
      feeding.meaningId === input.meaningId
    );
  }).length;

  return 1 / Math.sqrt(similarCount + 1);
}
