import { createSeededRandom } from "../random/seededRandom";
import type { Creature } from "../../types";

export type TouchZone = "head" | "body" | "tail";
export type TouchOutcome = "accept" | "retreat" | "still" | "tendril";

export type TouchResult = {
  outcome: TouchOutcome;
  line: string;
};

// 牠有邊界:願不願意被摸,由當下的靠近傾向、防衛傾向、
// 身體偏好與一點隨機決定;不保證每次都接受。
const LINES: Record<TouchOutcome, string[]> = {
  accept: [
    "牠往你的方向靠了靠，把重量交給玻璃。",
    "牠瞇了一下，身體的邊緣變軟了。",
    "牠停在你手指停過的地方，沒有離開。",
    "核心亮了一下，像一句很小的「嗯」。",
  ],
  retreat: [
    "牠往旁邊滑開了一段距離，沒有回頭。",
    "牠把身體縮小了一點，挪到比較遠的位置。",
    "這次牠想自己待著。牠輕輕退開了。",
  ],
  still: [
    "牠沒有動，只是看著你。",
    "牠停在原地，呼吸沒有改變。",
    "牠看了你一會兒，然後繼續原本的事。",
  ],
  tendril: [
    "一段觸手伸過來，在玻璃內側碰了碰你停留的位置。",
    "牠用觸手尖端輕輕點了一下，又收回去。",
    "觸手貼著玻璃劃了一小段，像在回應。",
  ],
};

export function resolveTouch(creature: Creature, zone: TouchZone, nowIso: string): TouchResult {
  const rng = createSeededRandom([creature.id, nowIso, zone].join("-"));
  const connection = creature.recentMemory.emotional.connection;
  const boundary = creature.recentMemory.emotional.boundary;
  const physical = creature.responsePreference.physical;
  const hasTendrils =
    creature.unlockedTraits.includes("tendrils") || creature.appearance.tendrils >= 18;

  // 基礎權重,再依狀態調整
  let accept = 0.34 + connection * 0.16 + physical * 0.2;
  let retreat = 0.18 + boundary * 0.2 - connection * 0.08;
  let still = 0.3 + creature.responsePreference.quiet * 0.08;
  let tendrilW = hasTendrils ? 0.16 + creature.appearance.tendrils * 0.002 : 0;

  // 部位差異:頭部較敏感、尾端較常用觸手回應
  if (zone === "head") {
    retreat += 0.08;
    accept += 0.04;
  }
  if (zone === "tail") {
    tendrilW *= 1.6;
    still += 0.04;
  }

  accept = Math.max(0.05, accept);
  retreat = Math.max(0.05, retreat);
  still = Math.max(0.05, still);
  tendrilW = Math.max(0, tendrilW);

  const total = accept + retreat + still + tendrilW;
  let cursor = rng() * total;
  const pick = (weight: number) => {
    cursor -= weight;
    return cursor <= 0;
  };
  const outcome: TouchOutcome = pick(accept)
    ? "accept"
    : pick(retreat)
      ? "retreat"
      : pick(still)
        ? "still"
        : "tendril";

  const lines = LINES[outcome];
  return { outcome, line: lines[Math.floor(rng() * lines.length)] };
}
