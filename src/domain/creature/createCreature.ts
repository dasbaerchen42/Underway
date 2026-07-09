import type {
  AppearanceTraitKey,
  Creature,
  CreatureGenes,
  LearnedAffinity,
  ResponsePreference,
} from "../../types";
import { baseAppearance, zeroSignal } from "../vectors";

const traitKeys: AppearanceTraitKey[] = [
  "tendrils",
  "membrane",
  "crystals",
  "flora",
  "horns",
  "floatingMotes",
  "darkCore",
];

export function createDefaultGenes(): CreatureGenes {
  return {
    absorptionStability: 0.88,
    mutationChance: 0.03,
    emotionalSensitivity: 1,
    sensorySensitivity: 1,
    conversionWeights: {
      tendrils: 1.08,
      membrane: 1,
      crystals: 0.92,
      flora: 0.95,
      horns: 0.84,
      floatingMotes: 1.05,
      darkCore: 0.98,
    },
    dominantBias: "membrane",
    secondaryBias: "floatingMotes",
  };
}

export function createDefaultAffinity(): LearnedAffinity {
  return Object.fromEntries(traitKeys.map((trait) => [trait, 1])) as LearnedAffinity;
}

export function createDefaultResponsePreference(): ResponsePreference {
  return {
    verbal: 0.7,
    quiet: 1.2,
    playful: 0.6,
    collecting: 0.8,
    physical: 0.5,
    ritual: 0.9,
  };
}

export function createCreature(now = new Date().toISOString()): Creature {
  return {
    id: "creature-1",
    name: "未命名的牠",
    bornAt: now,
    speciesSeed: "mist-greenhouse",
    individualSeed: "first-soft-body",
    genes: createDefaultGenes(),
    learnedAffinity: createDefaultAffinity(),
    appearance: baseAppearance(),
    recentMemory: zeroSignal(),
    longTermMemory: zeroSignal(),
    foodMemory: {},
    responsePreference: createDefaultResponsePreference(),
    unlockedTraits: [],
    activeTemporaryEffects: [],
    inventory: [],
    favoriteSpots: ["窗邊霧光", "地墊邊緣"],
    lastInteractionAt: null,
    lastDigestionAt: null,
  };
}
