import type { Creature } from "../../types";
import { clamp } from "../vectors";

export type CreatureVisualProfile = {
  bodyColor: string;
  bodyOpacity: number;
  bubbleCount: number;
  starCount: number;
  tendrilCount: number;
};

function particleCount(score: number) {
  if (score < 24) return 0;
  if (score < 45) return 2;
  if (score < 68) return 4;
  return 6;
}

function mixChannel(base: number, cool: number, warm: number, coolWeight: number, warmWeight: number) {
  return Math.round((base + cool * coolWeight + warm * warmWeight) / (1 + coolWeight + warmWeight));
}

export function mixAppearanceColor(hueBlue: number, hueAmber: number) {
  const coolWeight = (clamp(hueBlue) / 100) * 0.9;
  const warmWeight = (clamp(hueAmber) / 100) * 0.9;
  const base = [190, 229, 224] as const;
  const cool = [111, 174, 255] as const;
  const warm = [255, 165, 154] as const;
  const red = mixChannel(base[0], cool[0], warm[0], coolWeight, warmWeight);
  const green = mixChannel(base[1], cool[1], warm[1], coolWeight, warmWeight);
  const blue = mixChannel(base[2], cool[2], warm[2], coolWeight, warmWeight);
  return `rgb(${red} ${green} ${blue})`;
}

export function deriveVisualProfile(creature: Creature): CreatureVisualProfile {
  const appearance = creature.appearance;
  const bubbleScore = appearance.wetness * 0.62 + appearance.fluidMotion * 0.38;
  const starScore = appearance.glow * 0.58 + appearance.floatingMotes * 0.42;
  let bubbleCount = particleCount(bubbleScore);
  let starCount = particleCount(starScore);
  while (bubbleCount + starCount > 10) {
    if (bubbleCount > starCount) bubbleCount -= 1;
    else starCount -= 1;
  }

  const hasTendrils =
    creature.unlockedTraits.includes("tendrils") || appearance.tendrils >= 18;
  let tendrilCount = 0;
  if (hasTendrils) {
    if (appearance.tendrils < 40) tendrilCount = 2;
    else if (appearance.tendrils < 60) tendrilCount = 3;
    else if (appearance.tendrils < 80) tendrilCount = 4;
    else tendrilCount = 5;
  }

  return {
    bodyColor: mixAppearanceColor(appearance.hueBlue, appearance.hueAmber),
    bodyOpacity: clamp(0.96 - appearance.transparency * 0.0021, 0.74, 0.96),
    bubbleCount,
    starCount,
    tendrilCount,
  };
}
