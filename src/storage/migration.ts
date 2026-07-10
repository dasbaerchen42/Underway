import { starterHabitatItems } from "../data/habitatItems";
import { createCreature } from "../domain/creature/createCreature";
import { buildJournalEntry, dateKey } from "../domain/journal/buildJournalEntry";
import { baseAppearance, zeroSignal } from "../domain/vectors";
import type {
  AppearanceState,
  AppearanceTraitKey,
  Creature,
  FeedingRecord,
  GameState,
  HabitatItem,
  WorldEvent,
} from "../types";

export const CURRENT_SCHEMA_VERSION = 3;

const traitKeys: AppearanceTraitKey[] = [
  "tendrils",
  "membrane",
  "crystals",
  "flora",
  "horns",
  "floatingMotes",
  "darkCore",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isIsoDate(value: unknown): value is string {
  return isString(value) && Number.isFinite(new Date(value).getTime());
}

function finiteNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeNumberRecord<T extends object>(value: unknown, fallback: T): T {
  const candidate = isRecord(value) ? value : {};
  return Object.fromEntries(
    Object.entries(fallback as Record<string, number>).map(([key, defaultValue]) => [
      key,
      finiteNumber(candidate[key], defaultValue),
    ]),
  ) as T;
}

function normalizeCreature(value: unknown, index: number, now: string): Creature | null {
  if (!isRecord(value)) {
    return null;
  }
  const fallback = createCreature(isIsoDate(value.bornAt) ? value.bornAt : now);
  const id = isString(value.id) && value.id.trim() ? value.id : `creature-${index + 1}`;
  const genes = isRecord(value.genes) ? value.genes : {};
  const preferences = isRecord(value.responsePreference) ? value.responsePreference : {};

  return {
    ...fallback,
    id,
    name: isString(value.name) && value.name.trim() ? value.name.slice(0, 16) : fallback.name,
    bornAt: isIsoDate(value.bornAt) ? value.bornAt : fallback.bornAt,
    speciesSeed: isString(value.speciesSeed) ? value.speciesSeed : fallback.speciesSeed,
    individualSeed: isString(value.individualSeed)
      ? value.individualSeed
      : fallback.individualSeed,
    genes: {
      ...fallback.genes,
      absorptionStability: finiteNumber(
        genes.absorptionStability,
        fallback.genes.absorptionStability,
      ),
      mutationChance: finiteNumber(genes.mutationChance, fallback.genes.mutationChance),
      emotionalSensitivity: finiteNumber(
        genes.emotionalSensitivity,
        fallback.genes.emotionalSensitivity,
      ),
      sensorySensitivity: finiteNumber(
        genes.sensorySensitivity,
        fallback.genes.sensorySensitivity,
      ),
      conversionWeights: normalizeNumberRecord(
        genes.conversionWeights,
        fallback.genes.conversionWeights,
      ),
      dominantBias: traitKeys.includes(genes.dominantBias as AppearanceTraitKey)
        ? (genes.dominantBias as AppearanceTraitKey)
        : fallback.genes.dominantBias,
      secondaryBias: traitKeys.includes(genes.secondaryBias as AppearanceTraitKey)
        ? (genes.secondaryBias as AppearanceTraitKey)
        : fallback.genes.secondaryBias,
    },
    learnedAffinity: normalizeNumberRecord(value.learnedAffinity, fallback.learnedAffinity),
    appearance: normalizeNumberRecord(value.appearance, baseAppearance()) as AppearanceState,
    recentMemory: {
      emotional: normalizeNumberRecord(
        isRecord(value.recentMemory) ? value.recentMemory.emotional : null,
        zeroSignal().emotional,
      ),
      sensory: normalizeNumberRecord(
        isRecord(value.recentMemory) ? value.recentMemory.sensory : null,
        zeroSignal().sensory,
      ),
      careIntent: normalizeNumberRecord(
        isRecord(value.recentMemory) ? value.recentMemory.careIntent : null,
        zeroSignal().careIntent,
      ),
    },
    longTermMemory: {
      emotional: normalizeNumberRecord(
        isRecord(value.longTermMemory) ? value.longTermMemory.emotional : null,
        zeroSignal().emotional,
      ),
      sensory: normalizeNumberRecord(
        isRecord(value.longTermMemory) ? value.longTermMemory.sensory : null,
        zeroSignal().sensory,
      ),
      careIntent: normalizeNumberRecord(
        isRecord(value.longTermMemory) ? value.longTermMemory.careIntent : null,
        zeroSignal().careIntent,
      ),
    },
    foodMemory: isRecord(value.foodMemory) ? (value.foodMemory as Creature["foodMemory"]) : {},
    unlockedTraits: Array.isArray(value.unlockedTraits)
      ? value.unlockedTraits.filter((trait): trait is AppearanceTraitKey =>
          traitKeys.includes(trait as AppearanceTraitKey),
        )
      : [],
    recentDialogueIds: Array.isArray(value.recentDialogueIds)
      ? value.recentDialogueIds.filter(isString).slice(0, 12)
      : [],
    activeTemporaryEffects: Array.isArray(value.activeTemporaryEffects)
      ? value.activeTemporaryEffects.filter(
          (effect): effect is Creature["activeTemporaryEffects"][number] =>
            isRecord(effect) &&
            isString(effect.id) &&
            isString(effect.label) &&
            isIsoDate(effect.until),
        )
      : [],
    inventory: Array.isArray(value.inventory)
      ? (value.inventory.filter(isRecord) as Creature["inventory"])
      : [],
    favoriteSpots: Array.isArray(value.favoriteSpots)
      ? value.favoriteSpots.filter(isString)
      : fallback.favoriteSpots,
    lastInteractionAt: isIsoDate(value.lastInteractionAt) ? value.lastInteractionAt : null,
    lastDigestionAt: isIsoDate(value.lastDigestionAt) ? value.lastDigestionAt : null,
    responsePreference: {
      verbal: finiteNumber(preferences.verbal, fallback.responsePreference.verbal),
      quiet: finiteNumber(preferences.quiet, fallback.responsePreference.quiet),
      playful: finiteNumber(preferences.playful, fallback.responsePreference.playful),
      collecting: finiteNumber(preferences.collecting, fallback.responsePreference.collecting),
      physical: finiteNumber(preferences.physical, fallback.responsePreference.physical),
      ritual: finiteNumber(preferences.ritual, fallback.responsePreference.ritual),
    },
  };
}

function normalizeFeeding(value: unknown, index: number): FeedingRecord | null {
  if (!isRecord(value) || !isIsoDate(value.timestamp)) {
    return null;
  }
  if (
    !isString(value.creatureId) ||
    !isString(value.foodId) ||
    !isString(value.meaningId) ||
    !isString(value.careIntentId)
  ) {
    return null;
  }
  const digestionSource = isRecord(value.digestion) ? value.digestion : {};
  const digestion = Object.fromEntries(
    Object.keys(baseAppearance()).flatMap((key) =>
      typeof digestionSource[key] === "number" && Number.isFinite(digestionSource[key])
        ? [[key, digestionSource[key]]]
        : [],
    ),
  );
  return {
    creatureId: value.creatureId,
    foodId: value.foodId,
    meaningId: value.meaningId,
    careIntentId: value.careIntentId,
    note: isString(value.note) ? value.note.slice(0, 500) : "",
    showNoteInJournal: value.showNoteInJournal !== false,
    timestamp: value.timestamp,
    id: isString(value.id) ? value.id : `feeding-imported-${index}`,
    digestion,
    dialogue: isString(value.dialogue) ? value.dialogue : "牠安靜地收下了。",
    repeatWeight: finiteNumber(value.repeatWeight, 1),
  };
}

function normalizeWorldEvent(value: unknown, index: number): WorldEvent | null {
  if (!isRecord(value) || !isIsoDate(value.occurredAt)) {
    return null;
  }
  return {
    id: isString(value.id) ? value.id : `event-imported-${index}`,
    type: isString(value.type) ? value.type : "imported_trace",
    creatureIds: Array.isArray(value.creatureIds) ? value.creatureIds.filter(isString) : [],
    occurredAt: value.occurredAt,
    sourceConditions: Array.isArray(value.sourceConditions)
      ? value.sourceConditions.filter(isString)
      : [],
    narrativeLine: isString(value.narrativeLine)
      ? value.narrativeLine
      : "箱庭留下了一道安靜的痕跡。",
    visualChanges: Array.isArray(value.visualChanges)
      ? value.visualChanges.filter(isString)
      : [],
    journalPriority: finiteNumber(value.journalPriority, 1),
  };
}

function normalizeHabitatItem(value: unknown, index: number): HabitatItem | null {
  if (!isRecord(value) || !isString(value.kind)) {
    return null;
  }
  const rotation = [0, 90, 180, 270].includes(value.rotation as number)
    ? (value.rotation as HabitatItem["rotation"])
    : 0;
  return {
    id: isString(value.id) ? value.id : `item-imported-${index}`,
    name: isString(value.name) ? value.name : "留下的物件",
    kind: value.kind,
    x: finiteNumber(value.x, 50),
    y: finiteNumber(value.y, 50),
    rotation,
    tint: isString(value.tint) ? value.tint : "#C9D8DC",
    source: value.source === "creature" ? "creature" : "starter",
  };
}

export function migrateState(value: unknown): GameState | null {
  if (!isRecord(value)) {
    return null;
  }
  if (!Array.isArray(value.creatures) || !Array.isArray(value.feedings)) {
    return null;
  }
  const now = isIsoDate(value.lastVisitAt) ? value.lastVisitAt : new Date().toISOString();
  const creatures = value.creatures
    .map((creature, index) => normalizeCreature(creature, index, now))
    .filter((creature): creature is Creature => creature !== null);
  if (creatures.length === 0) {
    creatures.push(createCreature(now));
  }
  const settings = isRecord(value.playerSettings) ? value.playerSettings : {};
  const habitat = isRecord(value.habitat) ? value.habitat : {};
  const habitatItems = Array.isArray(habitat.items)
    ? habitat.items
        .map(normalizeHabitatItem)
        .filter((item): item is HabitatItem => item !== null)
    : [];
  const feedings = value.feedings
    .map(normalizeFeeding)
    .filter((feeding): feeding is FeedingRecord => feeding !== null);
  const worldEvents = Array.isArray(value.worldEvents)
    ? value.worldEvents
        .map(normalizeWorldEvent)
        .filter((event): event is WorldEvent => event !== null)
    : [];
  const journalDates = new Set([
    ...feedings.map((feeding) => dateKey(feeding.timestamp)),
    ...worldEvents.map((event) => dateKey(event.occurredAt)),
    dateKey(now),
  ]);

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    playerSettings: {
      animation: settings.animation === "reduced" ? "reduced" : "full",
      fontScale: settings.fontScale === "large" ? "large" : "normal",
      theme: settings.theme === "neon" ? "neon" : "night",
      highContrast: settings.highContrast === true,
    },
    creatures,
    feedings,
    journalEntries: [...journalDates]
      .sort((a, b) => b.localeCompare(a))
      .map((date) => buildJournalEntry(date, feedings, worldEvents)),
    habitat: { items: habitatItems.length > 0 ? habitatItems : starterHabitatItems },
    worldEvents,
    lastVisitAt: now,
    lastSettlementDate: isString(value.lastSettlementDate)
      ? value.lastSettlementDate
      : dateKey(now),
    // initialized 是 session 範圍的旗標:讀進來的存檔一律重新結算離線時間。
    initialized: false,
  };
}
