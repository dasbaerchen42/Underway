import type { WorldEvent } from "../../types";
import { createSeededRandom } from "../random/seededRandom";

const offlineTraces = [
  ["lamp_nest", "牠把小燈推近了睡墊，像替霧留了一個位置。", "小燈靠近睡墊"],
  ["bottle_mark", "瓶子旁多了一點水痕，沒有任何催促的意思。", "瓶側留下水痕"],
  ["mat_fold", "地墊的邊角被折起來，下面藏著一顆小小光點。", "地墊邊角被折起"],
  ["window_mist", "窗邊凝了一小片霧，像牠曾安靜地看過外面。", "窗面多了一片霧痕"],
  ["stone_circle", "石頭被排成鬆鬆的小圈，中間留著一個空位。", "石頭形成小圈"],
  ["tea_shadow", "桌邊留著淡淡的茶色影子，氣味已經很輕。", "桌面留下淡色痕跡"],
  ["curtain_gap", "窗簾被撥開一條縫，水光從那裡慢慢移動。", "窗簾留下一道縫"],
  ["paper_note", "紙片換了一個方向，像是被反覆端詳過。", "紙片方向改變"],
  ["quiet_bubble", "角落聚著三顆很小的氣泡，直到你回來也沒有破。", "角落留有氣泡"],
  ["soft_path", "地面出現一道柔軟的滑行痕跡，繞過了所有家具。", "地面留下滑行痕跡"],
  ["seed_rest", "花盆旁多了一顆洗得很乾淨的果核。", "花盆旁留下果核"],
  ["shelf_glow", "矮櫃下方亮著一點微光，像被小心收進陰影裡。", "矮櫃下出現微光"],
] as const;

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
  const rng = createSeededRandom(`${creatureId}-${lastVisitAt}-${nowIso}`);
  const start = Math.floor(rng() * offlineTraces.length);
  return Array.from({ length: count }, (_, index) => {
    const [type, narrativeLine, visualChange] =
      offlineTraces[(start + index * 5) % offlineTraces.length];
    return {
      id: `offline-${nowIso}-${index}`,
      type,
      creatureIds: [creatureId],
      occurredAt: nowIso,
      sourceConditions: [`離線約 ${Math.round(elapsedHours)} 小時`],
      narrativeLine,
      visualChanges: [visualChange],
      journalPriority: 1,
    };
  });
}
