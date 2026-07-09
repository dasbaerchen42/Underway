import type {
  AppearanceState,
  CareIntentVector,
  EmotionalVector,
  FeedingSignal,
  SensoryVector,
} from "../types";

export const zeroEmotional = (): EmotionalVector => ({
  activation: 0,
  warmth: 0,
  connection: 0,
  boundary: 0,
  clarity: 0,
  release: 0,
});

export const zeroSensory = (): SensoryVector => ({
  sweetness: 0,
  coolness: 0,
  warmth: 0,
  moisture: 0,
  dryness: 0,
  lightness: 0,
  depth: 0,
  sharpness: 0,
  softness: 0,
  dormancy: 0,
});

export const zeroCareIntent = (): CareIntentVector => ({
  closeness: 0,
  silence: 0,
  preservation: 0,
  digestion: 0,
  release: 0,
  ritual: 0,
});

export const zeroSignal = (): FeedingSignal => ({
  emotional: zeroEmotional(),
  sensory: zeroSensory(),
  careIntent: zeroCareIntent(),
});

export const baseAppearance = (): AppearanceState => ({
  hueBlue: 22,
  hueAmber: 12,
  transparency: 18,
  glow: 18,
  softness: 54,
  wetness: 34,
  darkCore: 18,
  fluidMotion: 26,
  tendrils: 8,
  membrane: 12,
  crystals: 0,
  flora: 0,
  horns: 0,
  floatingMotes: 10,
});

export function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function blendSignal(
  current: FeedingSignal,
  incoming: FeedingSignal,
  weight: number,
): FeedingSignal {
  const blend = (a: number, b: number) => a * (1 - weight) + b * weight;
  return {
    emotional: {
      activation: blend(current.emotional.activation, incoming.emotional.activation),
      warmth: blend(current.emotional.warmth, incoming.emotional.warmth),
      connection: blend(current.emotional.connection, incoming.emotional.connection),
      boundary: blend(current.emotional.boundary, incoming.emotional.boundary),
      clarity: blend(current.emotional.clarity, incoming.emotional.clarity),
      release: blend(current.emotional.release, incoming.emotional.release),
    },
    sensory: {
      sweetness: blend(current.sensory.sweetness, incoming.sensory.sweetness),
      coolness: blend(current.sensory.coolness, incoming.sensory.coolness),
      warmth: blend(current.sensory.warmth, incoming.sensory.warmth),
      moisture: blend(current.sensory.moisture, incoming.sensory.moisture),
      dryness: blend(current.sensory.dryness, incoming.sensory.dryness),
      lightness: blend(current.sensory.lightness, incoming.sensory.lightness),
      depth: blend(current.sensory.depth, incoming.sensory.depth),
      sharpness: blend(current.sensory.sharpness, incoming.sensory.sharpness),
      softness: blend(current.sensory.softness, incoming.sensory.softness),
      dormancy: blend(current.sensory.dormancy, incoming.sensory.dormancy),
    },
    careIntent: {
      closeness: blend(current.careIntent.closeness, incoming.careIntent.closeness),
      silence: blend(current.careIntent.silence, incoming.careIntent.silence),
      preservation: blend(current.careIntent.preservation, incoming.careIntent.preservation),
      digestion: blend(current.careIntent.digestion, incoming.careIntent.digestion),
      release: blend(current.careIntent.release, incoming.careIntent.release),
      ritual: blend(current.careIntent.ritual, incoming.careIntent.ritual),
    },
  };
}

export function applyAppearanceDelta(
  appearance: AppearanceState,
  delta: Partial<AppearanceState>,
): AppearanceState {
  return Object.fromEntries(
    Object.entries(appearance).map(([key, value]) => [
      key,
      clamp(value + (delta[key as keyof AppearanceState] ?? 0)),
    ]),
  ) as AppearanceState;
}
