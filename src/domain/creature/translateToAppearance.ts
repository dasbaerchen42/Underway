import type { AppearanceState, Creature, FeedingSignal } from "../../types";
import { randomBetween } from "../random/seededRandom";
import { clamp } from "../vectors";

export function translateToAppearance(
  creature: Creature,
  signal: FeedingSignal,
  repeatWeight: number,
  rng: () => number,
): Partial<AppearanceState> {
  const absorption = randomBetween(rng, 0.85, 1.15) * repeatWeight;
  const sensory = signal.sensory;
  const emotional = signal.emotional;
  const care = signal.careIntent;
  const bias = creature.genes.conversionWeights;
  const boost = randomBetween(rng, 1.05, 1.25);

  const delta: Partial<AppearanceState> = {
    hueBlue:
      (sensory.coolness * 2.2 + sensory.depth * 1.4 - sensory.warmth * 0.7) *
      absorption,
    hueAmber:
      (sensory.warmth * 2.3 + emotional.warmth * 1.8 + sensory.sweetness * 0.6) *
      absorption,
    transparency:
      (Math.max(0, -emotional.clarity) * 1.5 + sensory.lightness * 0.7) *
      absorption,
    glow:
      (emotional.connection * 1.2 + care.ritual * 0.9 + sensory.sweetness * 0.8) *
      absorption,
    softness:
      (sensory.softness * 1.8 + care.closeness * 0.8 - emotional.boundary * 0.2) *
      absorption,
    wetness: (sensory.moisture * 2 + care.digestion * 0.5) * absorption,
    darkCore:
      (sensory.depth * 1.3 + Math.max(0, -emotional.release) + sensory.dormancy) *
      absorption *
      bias.darkCore,
    fluidMotion:
      (sensory.moisture + emotional.activation * 0.6 + care.release * 0.8) *
      absorption,
    tendrils:
      (emotional.connection * 0.8 + care.closeness + sensory.moisture * 0.4) *
      absorption *
      bias.tendrils,
    membrane:
      (emotional.boundary * 0.9 + care.preservation + care.silence * 0.5) *
      absorption *
      bias.membrane,
    crystals:
      (care.preservation * 0.8 + sensory.dryness + sensory.sharpness * 0.4) *
      absorption *
      bias.crystals,
    flora:
      (sensory.sweetness * 0.4 + sensory.moisture * 0.5 + care.ritual) *
      absorption *
      bias.flora,
    horns:
      (Math.max(0, emotional.activation) * 0.7 + emotional.boundary * 0.4 + sensory.sharpness) *
      absorption *
      bias.horns,
    floatingMotes:
      (sensory.lightness + emotional.release * 0.8 + care.release) *
      absorption *
      bias.floatingMotes,
  };

  const keys = Object.keys(delta) as (keyof AppearanceState)[];
  const boostedKey = keys[Math.floor(rng() * keys.length)];
  delta[boostedKey] = (delta[boostedKey] ?? 0) * boost;

  return Object.fromEntries(
    Object.entries(delta).map(([key, value]) => [key, clamp(value, -6, 8)]),
  ) as Partial<AppearanceState>;
}
