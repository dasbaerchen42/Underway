export type EmotionalVector = {
  activation: number;
  warmth: number;
  connection: number;
  boundary: number;
  clarity: number;
  release: number;
};

export type SensoryVector = {
  sweetness: number;
  coolness: number;
  warmth: number;
  moisture: number;
  dryness: number;
  lightness: number;
  depth: number;
  sharpness: number;
  softness: number;
  dormancy: number;
};

export type CareIntentVector = {
  closeness: number;
  silence: number;
  preservation: number;
  digestion: number;
  release: number;
  ritual: number;
};

export type FeedingSignal = {
  emotional: EmotionalVector;
  sensory: SensoryVector;
  careIntent: CareIntentVector;
};

export type AppearanceTraitKey =
  | "tendrils"
  | "membrane"
  | "crystals"
  | "flora"
  | "horns"
  | "floatingMotes"
  | "darkCore";

export type AppearanceState = {
  hueBlue: number;
  hueAmber: number;
  transparency: number;
  glow: number;
  softness: number;
  wetness: number;
  darkCore: number;
  fluidMotion: number;
  tendrils: number;
  membrane: number;
  crystals: number;
  flora: number;
  horns: number;
  floatingMotes: number;
};

export type LearnedAffinity = Record<AppearanceTraitKey, number>;

export type CreatureGenes = {
  absorptionStability: number;
  mutationChance: number;
  emotionalSensitivity: number;
  sensorySensitivity: number;
  conversionWeights: Record<AppearanceTraitKey, number>;
  dominantBias: AppearanceTraitKey;
  secondaryBias: AppearanceTraitKey;
};

export type MemoryState = FeedingSignal;

export type FoodMeaningMemory = {
  foodId: string;
  uses: number;
  meaningCounts: Record<string, number>;
  dominantMeaningId: string | null;
  confidence: number;
  confirmedByPlayer: boolean;
  customLabel?: string;
};

export type ResponsePreference = {
  verbal: number;
  quiet: number;
  playful: number;
  collecting: number;
  physical: number;
  ritual: number;
};

export type DialogueIntent =
  | "first_food"
  | "familiar_food"
  | "meaning_shift"
  | "silence"
  | "intense"
  | "calm_daily"
  | "preserve"
  | "release"
  | "closeness"
  | "solitude"
  | "long_absence"
  | "appearance_change"
  | "confused_accept"
  | "repeat_feeding";

export type DialogueEntry = {
  id: string;
  intent: DialogueIntent;
  line: string;
  weight?: number;
};

export type TemporaryEffect = {
  id: string;
  label: string;
  until: string;
};

export type CreatureOwnedItem = {
  id: string;
  name: string;
  sourceDate: string;
};

export type Creature = {
  id: string;
  name: string;
  bornAt: string;
  speciesSeed: string;
  individualSeed: string;
  genes: CreatureGenes;
  learnedAffinity: LearnedAffinity;
  appearance: AppearanceState;
  recentMemory: MemoryState;
  longTermMemory: MemoryState;
  foodMemory: Record<string, FoodMeaningMemory>;
  responsePreference: ResponsePreference;
  unlockedTraits: AppearanceTraitKey[];
  recentDialogueIds: string[];
  activeTemporaryEffects: TemporaryEffect[];
  inventory: CreatureOwnedItem[];
  favoriteSpots: string[];
  lastInteractionAt: string | null;
  lastDigestionAt: string | null;
};

export type Food = {
  id: string;
  name: string;
  texture: string;
  sensory: SensoryVector;
};

export type Meaning = {
  id: string;
  label: string;
  emotional: EmotionalVector;
};

export type CareIntent = {
  id: string;
  label: string;
  vector: CareIntentVector;
};

export type FeedingInput = {
  creatureId: string;
  foodId: string;
  meaningId: string;
  careIntentId: string;
  note: string;
  showNoteInJournal: boolean;
  timestamp: string;
};

export type FeedingRecord = FeedingInput & {
  id: string;
  digestion: Partial<AppearanceState>;
  dialogue: string;
  repeatWeight: number;
};

export type HabitatItem = {
  id: string;
  name: string;
  kind: string;
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
  tint: string;
  source: "starter" | "creature";
};

export type WorldEvent = {
  id: string;
  type: string;
  creatureIds: string[];
  occurredAt: string;
  sourceConditions: string[];
  narrativeLine: string;
  visualChanges: string[];
  journalPriority: number;
};

export type JournalEntry = {
  id: string;
  date: string;
  feedingIds: string[];
  summary: string;
  observations: string[];
  worldEventIds: string[];
  markdown: string;
};

export type GameState = {
  schemaVersion: number;
  creatures: Creature[];
  feedings: FeedingRecord[];
  journalEntries: JournalEntry[];
  habitat: { items: HabitatItem[]; showFurniture: boolean };
  worldEvents: WorldEvent[];
  lastVisitAt: string;
  lastSettlementDate: string;
  initialized: boolean;
};
