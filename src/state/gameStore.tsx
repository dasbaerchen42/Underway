import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { starterHabitatItems } from "../data/habitatItems";
import { createCreature } from "../domain/creature/createCreature";
import { completeFeeding } from "../domain/feeding/completeFeeding";
import { buildJournalEntry, dateKey } from "../domain/journal/buildJournalEntry";
import { processOfflineTime } from "../domain/time/processOfflineTime";
import { CURRENT_SCHEMA_VERSION } from "../storage/migration";
import { localStorageAdapter } from "../storage/localStorageAdapter";
import type { FeedingInput, GameState, JournalEntry, PlayerSettings } from "../types";

type GameAction =
  | { type: "initialize"; now: string }
  | { type: "feed"; input: FeedingInput }
  | { type: "touch"; now: string }
  | { type: "setSettings"; settings: PlayerSettings }
  | { type: "import"; state: GameState }
  | { type: "clear"; now: string };

type GameContextValue = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  exportJson: () => string;
  exportMarkdown: () => string;
};

const GameContext = createContext<GameContextValue | null>(null);

function createInitialState(now = new Date().toISOString()): GameState {
  const creature = createCreature(now);
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    playerSettings: {
      animation: "full",
      fontScale: "normal",
      highContrast: false,
    },
    creatures: [creature],
    feedings: [],
    journalEntries: [buildJournalEntry(dateKey(now), [], [])],
    habitat: { items: starterHabitatItems },
    worldEvents: [],
    lastVisitAt: now,
    lastSettlementDate: dateKey(now),
    initialized: false,
  };
}

function rebuildJournalEntries(state: GameState): JournalEntry[] {
  const dates = new Set([
    ...state.feedings.map((feeding) => dateKey(feeding.timestamp)),
    ...state.worldEvents.map((event) => dateKey(event.occurredAt)),
    dateKey(new Date().toISOString()),
  ]);
  return [...dates]
    .sort((a, b) => b.localeCompare(a))
    .map((date) => buildJournalEntry(date, state.feedings, state.worldEvents));
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "initialize": {
      if (state.initialized) {
        return state;
      }
      const offline = processOfflineTime(
        state.lastVisitAt,
        action.now,
        state.creatures[0],
        state.habitat.items,
        state.feedings,
      );
      const next = {
        ...state,
        initialized: true,
        worldEvents: [...offline.events, ...state.worldEvents],
        habitat: { items: offline.items },
        lastVisitAt: action.now,
      };
      return {
        ...next,
        journalEntries: rebuildJournalEntries(next),
      };
    }
    case "feed": {
      const creature = state.creatures.find((item) => item.id === action.input.creatureId);
      if (!creature) {
        return state;
      }
      const result = completeFeeding(creature, action.input, state.feedings);
      const next = {
        ...state,
        creatures: state.creatures.map((item) =>
          item.id === creature.id ? result.creature : item,
        ),
        feedings: [result.record, ...state.feedings],
        lastVisitAt: action.input.timestamp,
        lastSettlementDate: dateKey(action.input.timestamp),
      };
      return {
        ...next,
        journalEntries: rebuildJournalEntries(next),
      };
    }
    case "touch": {
      const creature = state.creatures[0];
      return {
        ...state,
        creatures: [
          {
            ...creature,
            lastInteractionAt: action.now,
            activeTemporaryEffects: [
              {
                id: `touch-${action.now}`,
                label: "牠把觸碰留在身體邊緣",
                until: new Date(new Date(action.now).getTime() + 1000 * 60 * 10).toISOString(),
              },
            ],
          },
        ],
        lastVisitAt: action.now,
      };
    }
    case "setSettings":
      return { ...state, playerSettings: action.settings };
    case "import":
      return { ...action.state, initialized: true };
    case "clear":
      localStorageAdapter.clear();
      return { ...createInitialState(action.now), initialized: true };
    default:
      return state;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    () => localStorageAdapter.load() ?? createInitialState(),
  );
  const didMount = useRef(false);

  useEffect(() => {
    dispatch({ type: "initialize", now: new Date().toISOString() });
  }, []);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const handle = window.setTimeout(() => {
      localStorageAdapter.backup(state);
      localStorageAdapter.save(state);
    }, 250);
    return () => window.clearTimeout(handle);
  }, [state]);

  const exportJson = useCallback(() => JSON.stringify(state, null, 2), [state]);
  const exportMarkdown = useCallback(
    () => state.journalEntries.map((entry) => entry.markdown).join("\n\n---\n\n"),
    [state.journalEntries],
  );

  const value = useMemo(
    () => ({ state, dispatch, exportJson, exportMarkdown }),
    [state, exportJson, exportMarkdown],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used inside GameProvider");
  }
  return context;
}
