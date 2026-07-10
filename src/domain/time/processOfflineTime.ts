import { FRUIT_FOOD_IDS, offlineEventDefs, type OfflineEventDef } from "../../data/offlineEvents";
import { createSeededRandom } from "../random/seededRandom";
import type { Creature, FeedingRecord, HabitatItem, WorldEvent } from "../../types";

const MAX_OFFLINE_EVENTS = 3;
const MIN_OFFLINE_HOURS = 3;
/** 離線超過這個小時數,視為跨過了一段夜 */
const NIGHT_CROSS_HOURS = 8;
/** 判定「最近」的餵食紀錄範圍 */
const RECENT_FEEDING_WINDOW = 20;

export type OfflineResult = {
  events: WorldEvent[];
  items: HabitatItem[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function isEligible(
  def: OfflineEventDef,
  creature: Creature,
  kinds: Set<string>,
  elapsedHours: number,
  recentFruit: boolean,
): boolean {
  if (def.requiredItems?.some((kind) => !kinds.has(kind))) {
    return false;
  }
  if (def.minHours !== undefined && elapsedHours < def.minHours) {
    return false;
  }
  if (def.nightCross && elapsedHours < NIGHT_CROSS_HOURS) {
    return false;
  }
  if (def.requiresTrait && !creature.unlockedTraits.includes(def.requiresTrait)) {
    return false;
  }
  if (
    def.minAppearance &&
    Object.entries(def.minAppearance).some(
      ([key, threshold]) =>
        creature.appearance[key as keyof typeof creature.appearance] < (threshold ?? 0),
    )
  ) {
    return false;
  }
  if (
    def.minPreservation !== undefined &&
    creature.longTermMemory.careIntent.preservation < def.minPreservation
  ) {
    return false;
  }
  if (
    def.minConnection !== undefined &&
    creature.longTermMemory.emotional.connection < def.minConnection
  ) {
    return false;
  }
  if (def.recentFruit && !recentFruit) {
    return false;
  }
  return true;
}

export function processOfflineTime(
  lastVisitAt: string,
  nowIso: string,
  creature: Creature,
  items: HabitatItem[],
  recentFeedings: FeedingRecord[],
): OfflineResult {
  const elapsedHours =
    (new Date(nowIso).getTime() - new Date(lastVisitAt).getTime()) / (1000 * 60 * 60);
  if (elapsedHours < MIN_OFFLINE_HOURS) {
    return { events: [], items };
  }

  // seed 綁定這次離線區間:重新整理不會重擲事件內容
  const rng = createSeededRandom([creature.id, lastVisitAt, nowIso].join("-"));
  const kinds = new Set(items.map((item) => item.kind));
  const recentFruit = recentFeedings
    .slice(0, RECENT_FEEDING_WINDOW)
    .some((feeding) => FRUIT_FOOD_IDS.includes(feeding.foodId));

  const eligible = offlineEventDefs.filter((def) =>
    isEligible(def, creature, kinds, elapsedHours, recentFruit),
  );

  // 高優先度先選;同優先度之間用 seeded random 打散
  const ranked = eligible
    .map((def) => ({ def, tiebreak: rng() }))
    .sort((a, b) => b.def.priority - a.def.priority || a.tiebreak - b.tiebreak)
    .map((entry) => entry.def);

  const count = Math.min(MAX_OFFLINE_EVENTS, Math.floor(elapsedHours / 12) + 1, ranked.length);
  const chosen = ranked.slice(0, count);

  let nextItems = items;
  const events = chosen.map((def) => {
    if (def.move) {
      const target = nextItems.find((item) => item.kind === def.move!.nearKind);
      const mover = nextItems.find((item) => item.kind === def.move!.itemKind);
      if (target && mover) {
        const x = clamp(target.x + (rng() * 16 - 8), 6, 92);
        const y = clamp(target.y + (def.move!.offsetY ?? 0) + (rng() * 8 - 4), 8, 88);
        nextItems = nextItems.map((item) => (item.id === mover.id ? { ...item, x, y } : item));
      }
    }
    return {
      id: `offline-${def.id}-${nowIso}`,
      type: def.id,
      creatureIds: [creature.id],
      occurredAt: nowIso,
      sourceConditions: [`離線約 ${Math.round(elapsedHours)} 小時`],
      narrativeLine: def.narrativeLine,
      visualChanges: [def.visualChange],
      journalPriority: def.priority,
    } satisfies WorldEvent;
  });

  return { events, items: nextItems };
}
