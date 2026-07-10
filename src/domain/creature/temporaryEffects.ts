import type { TemporaryEffect } from "../../types";

export function getActiveTemporaryEffects(
  effects: TemporaryEffect[],
  nowIso: string,
): TemporaryEffect[] {
  const now = new Date(nowIso).getTime();
  return effects.filter((effect) => {
    const until = new Date(effect.until).getTime();
    return Number.isFinite(until) && until > now;
  });
}
