const PHASES = ["晨光", "日照", "暮色", "夜霧"] as const;
const WORLD_CYCLE_MINUTES = 90;

export function calculateWorldPhase(now = new Date()) {
  const minutes = now.getHours() * 60 + now.getMinutes();
  const cycleMinute = minutes % WORLD_CYCLE_MINUTES;
  const phaseIndex = Math.floor(cycleMinute / (WORLD_CYCLE_MINUTES / PHASES.length));
  const cycleNumber = Math.floor(minutes / WORLD_CYCLE_MINUTES) + 1;
  return {
    phase: PHASES[phaseIndex],
    cycleNumber,
    progress: cycleMinute / WORLD_CYCLE_MINUTES,
  };
}
