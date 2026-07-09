import { foods } from "../../data/foods";
import { meanings } from "../../data/meanings";
import type { FeedingRecord, JournalEntry, WorldEvent } from "../../types";

export function dateKey(iso: string) {
  return iso.slice(0, 10);
}

export function buildJournalEntry(
  date: string,
  feedings: FeedingRecord[],
  worldEvents: WorldEvent[],
): JournalEntry {
  const dayFeedings = feedings.filter((feeding) => dateKey(feeding.timestamp) === date);
  const dayEvents = worldEvents.filter((event) => dateKey(event.occurredAt) === date);
  const foodCounts = new Map<string, number>();
  for (const feeding of dayFeedings) {
    foodCounts.set(feeding.foodId, (foodCounts.get(feeding.foodId) ?? 0) + 1);
  }
  const mainFoodId = [...foodCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const mainFood = foods.find((food) => food.id === mainFoodId)?.name ?? "沒有特定食物";
  const firstMeaning = meanings.find((meaning) => meaning.id === dayFeedings[0]?.meaningId)?.label;
  const observations =
    dayFeedings.length === 0
      ? ["箱庭自己維持著安靜的光。"]
      : [
          `今天主要留下的是${mainFood}的氣味。`,
          firstMeaning ? `第一筆紀錄靠近「${firstMeaning}」。` : "沒有明確分類的紀錄。",
        ];
  const eventLines = dayEvents.map((event) => event.narrativeLine);
  const summary =
    dayFeedings.length > 0
      ? `牠收下了 ${dayFeedings.length} 次餵食，沒有把任何一份變成評分，只讓痕跡慢慢沉下去。`
      : "今天沒有新的餵食，但箱庭仍留有自己的呼吸。";
  const detailLines = dayFeedings.map((feeding) => {
    const food = foods.find((item) => item.id === feeding.foodId)?.name ?? feeding.foodId;
    const meaning = meanings.find((item) => item.id === feeding.meaningId)?.label ?? feeding.meaningId;
    const time = new Date(feeding.timestamp).toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `- ${time} ${food}｜${meaning}`;
  });
  const markdown = [
    `# ${date} 觀察日記`,
    "",
    summary,
    "",
    ...observations.map((line) => `- ${line}`),
    ...eventLines.map((line) => `- ${line}`),
    "",
    "## 詳細餵食",
    ...(detailLines.length > 0 ? detailLines : ["- 今日沒有餵食紀錄。"]),
  ].join("\n");

  return {
    id: `journal-${date}`,
    date,
    feedingIds: dayFeedings.map((feeding) => feeding.id),
    summary,
    observations: [...observations, ...eventLines],
    worldEventIds: dayEvents.map((event) => event.id),
    markdown,
  };
}
