import type { Creature } from "../../types";

// 把外觀數值轉成畫面上的粒子與部件數量,讓身體隨長期變化「長出」更多細節。
export type CreatureVisualProfile = {
  moteCount: number;
  tendrilCount: number;
};

function particleCount(score: number) {
  if (score < 24) return 0;
  if (score < 45) return 2;
  if (score < 68) return 4;
  return 6;
}

export function deriveVisualProfile(creature: Creature): CreatureVisualProfile {
  const appearance = creature.appearance;
  const moteScore = appearance.glow * 0.58 + appearance.floatingMotes * 0.42;

  const hasTendrils =
    creature.unlockedTraits.includes("tendrils") || appearance.tendrils >= 18;
  let tendrilCount = 0;
  if (hasTendrils) {
    tendrilCount = appearance.tendrils < 45 ? 2 : 3;
  }

  return {
    moteCount: particleCount(moteScore),
    tendrilCount,
  };
}
