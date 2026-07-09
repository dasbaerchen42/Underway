import type { WorldEvent } from "../../types";

export function processOfflineTime(
  lastVisitAt: string,
  nowIso: string,
  creatureId: string,
): WorldEvent[] {
  const elapsedHours =
    (new Date(nowIso).getTime() - new Date(lastVisitAt).getTime()) / (1000 * 60 * 60);
  if (elapsedHours < 3) {
    return [];
  }

  const count = Math.min(3, Math.floor(elapsedHours / 12) + 1);
  return Array.from({ length: count }, (_, index) => ({
    id: `offline-${nowIso}-${index}`,
    type: "offline_trace",
    creatureIds: [creatureId],
    occurredAt: nowIso,
    sourceConditions: [`離線約 ${Math.round(elapsedHours)} 小時`],
    narrativeLine: [
      "牠把小燈推近了睡墊，像替霧留了一個位置。",
      "瓶子旁多了一點水痕，沒有任何催促的意思。",
      "地墊的邊角被折起來，下面藏著一顆小小光點。",
    ][index],
    visualChanges: ["箱庭物件位置留下生活痕跡"],
    journalPriority: 1,
  }));
}
