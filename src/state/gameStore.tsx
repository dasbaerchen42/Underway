import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { starterHabitatItems } from "../data/habitatItems";
import { createCreature } from "../domain/creature/createCreature";
import { getActiveTemporaryEffects } from "../domain/creature/temporaryEffects";
import { completeFeeding } from "../domain/feeding/completeFeeding";
import { buildJournalEntry, dateKey } from "../domain/journal/buildJournalEntry";
import { processOfflineTime } from "../domain/time/processOfflineTime";
import { CURRENT_SCHEMA_VERSION, migrateState } from "../storage/migration";
import { localStorageAdapter } from "../storage/localStorageAdapter";
import type { FeedingInput, GameState, JournalEntry, PlayerSettings } from "../types";

type GameAction =
  | { type: "initialize"; now: string }
  | { type: "tick"; now: string }
  | { type: "feed"; input: FeedingInput }
  | { type: "touch"; now: string }
  | { type: "renameCreature"; creatureId: string; name: string }
  | { type: "setSettings"; settings: PlayerSettings }
  | { type: "import"; state: GameState }
  | { type: "clear"; now: string };

type GameContextValue = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  exportJson: () => string;
  exportMarkdown: () => string;
  importJson: (text: string) => { ok: true } | { ok: false; message: string };
  resetGame: () => void;
  storageError: string | null;
  currentTime: string;
};

const GameContext = createContext<GameContextValue | null>(null);

function createInitialState(now = new Date().toISOString()): GameState {
  const creature = createCreature(now);
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    playerSettings: {
      animation: "full",
      fontScale: "normal",
      theme: "clear",
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

function rebuildJournalEntries(state: GameState, nowIso: string): JournalEntry[] {
  const dates = new Set([
    ...state.feedings.map((feeding) => dateKey(feeding.timestamp)),
    ...state.worldEvents.map((event) => dateKey(event.occurredAt)),
    dateKey(nowIso),
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
      const events = processOfflineTime(state.lastVisitAt, action.now, state.creatures[0].id);
      const next = {
        ...state,
        initialized: true,
        creatures: state.creatures.map((creature) => ({
          ...creature,
          activeTemporaryEffects: getActiveTemporaryEffects(
            creature.activeTemporaryEffects,
            action.now,
          ),
        })),
        worldEvents: [...events, ...state.worldEvents],
        lastVisitAt: action.now,
        lastSettlementDate: dateKey(action.now),
      };
      return {
        ...next,
        journalEntries: rebuildJournalEntries(next, action.now),
      };
    }
    case "tick": {
      const settlementDate = dateKey(action.now);
      const creatures = state.creatures.map((creature) => {
        const effects = getActiveTemporaryEffects(creature.activeTemporaryEffects, action.now);
        return effects.length === creature.activeTemporaryEffects.length
          ? creature
          : { ...creature, activeTemporaryEffects: effects };
      });
      const next = {
        ...state,
        creatures,
        lastSettlementDate: settlementDate,
        lastVisitAt: action.now,
      };
      return settlementDate === state.lastSettlementDate
        ? next
        : { ...next, journalEntries: rebuildJournalEntries(next, action.now) };
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
        journalEntries: rebuildJournalEntries(next, action.input.timestamp),
      };
    }
    case "touch": {
      const creature = state.creatures[0];
      return {
        ...state,
        creatures: state.creatures.map((item) =>
          item.id === creature.id
            ? {
                ...item,
                lastInteractionAt: action.now,
                activeTemporaryEffects: [
                  {
                    id: `touch-${action.now}`,
                    label: "牠把觸碰留在身體邊緣",
                    until: new Date(
                      new Date(action.now).getTime() + 1000 * 60 * 10,
                    ).toISOString(),
                  },
                  ...getActiveTemporaryEffects(item.activeTemporaryEffects, action.now),
                ].slice(0, 3),
              }
            : item,
        ),
        lastVisitAt: action.now,
      };
    }
    case "renameCreature": {
      const nextName = action.name.trim().slice(0, 16);
      if (!nextName) {
        return state;
      }
      return {
        ...state,
        creatures: state.creatures.map((creature) =>
          creature.id === action.creatureId ? { ...creature, name: nextName } : creature,
        ),
      };
    }
    case "setSettings":
      return { ...state, playerSettings: action.settings };
    case "import":
      return { ...action.state, initialized: true };
    case "clear":
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
  const [storageError, setStorageError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(() => new Date().toISOString());

  useEffect(() => {
    const now = new Date().toISOString();
    setCurrentTime(now);
    dispatch({ type: "initialize", now });
  }, []);

  useEffect(() => {
    const syncClock = () => {
      const now = new Date().toISOString();
      setCurrentTime(now);
      dispatch({ type: "tick", now });
    };
    const handle = window.setInterval(syncClock, 30_000);
    document.addEventListener("visibilitychange", syncClock);
    return () => {
      window.clearInterval(handle);
      document.removeEventListener("visibilitychange", syncClock);
    };
  }, []);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const handle = window.setTimeout(() => {
      const saveResult = localStorageAdapter.save(state);
      if (!saveResult.ok) {
        setStorageError(saveResult.message);
        return;
      }
      const backupResult = localStorageAdapter.backup(state);
      setStorageError(backupResult.ok ? null : backupResult.message);
    }, 250);
    return () => window.clearTimeout(handle);
  }, [state]);

  const exportJson = useCallback(() => JSON.stringify(state, null, 2), [state]);
  const exportMarkdown = useCallback(
    () => state.journalEntries.map((entry) => entry.markdown).join("\n\n---\n\n"),
    [state.journalEntries],
  );
  const importJson = useCallback((text: string) => {
    try {
      const migrated = migrateState(JSON.parse(text) as unknown);
      if (!migrated) {
        return { ok: false, message: "這份檔案不是可辨識的共鳴箱庭存檔。" } as const;
      }
      dispatch({ type: "import", state: migrated });
      return { ok: true } as const;
    } catch {
      return { ok: false, message: "JSON 格式有誤，原本的進度沒有變更。" } as const;
    }
  }, []);
  const resetGame = useCallback(() => {
    const result = localStorageAdapter.clear();
    if (!result.ok) {
      setStorageError(result.message);
      return;
    }
    setStorageError(null);
    dispatch({ type: "clear", now: new Date().toISOString() });
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      exportJson,
      exportMarkdown,
      importJson,
      resetGame,
      storageError,
      currentTime,
    }),
    [state, exportJson, exportMarkdown, importJson, resetGame, storageError, currentTime],
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
