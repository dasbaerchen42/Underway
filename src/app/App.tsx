import { useMemo, useState } from "react";
import { FeedingFlow } from "../components/feeding/FeedingFlow";
import { HabitatStage } from "../components/habitat/HabitatStage";
import { JournalPage } from "../components/journal/JournalPage";
import { SettingsPanel } from "../components/settings/SettingsPanel";
import { GameProvider, useGame } from "../state/gameStore";
import { calculateWorldPhase } from "../domain/time/calculateWorldPhase";

type View = "feed" | "journal" | "atlas" | "settings";

function AppShell() {
  const { state, dispatch, currentTime } = useGame();
  const [view, setView] = useState<View>("feed");
  const [draftName, setDraftName] = useState("");
  const creature = state.creatures[0];
  const phase = useMemo(() => calculateWorldPhase(new Date(currentTime)), [currentTime]);
  const visibleTraits = creature.unlockedTraits.length
    ? creature.unlockedTraits.join("、")
    : "尚未命名的細微傾向";
  const creatureName = creature.name === "未命名的牠" ? "小玻" : creature.name;

  return (
    <main
      className={`app-shell theme-${state.playerSettings.theme} ${state.playerSettings.highContrast ? "high-contrast" : ""} font-${state.playerSettings.fontScale}`}
      data-motion={state.playerSettings.animation}
    >
      <section className="stage-column" aria-label="箱庭舞台">
        <header className="topbar">
          <div>
            <p className="kicker">共鳴箱庭</p>
            <h1>霧潮溫室</h1>
            <p className="title-note">把一份食物、一段描述和一點期待交給牠。</p>
          </div>
          <div className="top-actions">
            <div className="theme-toggle" aria-label="主題切換">
              <button
                aria-pressed={state.playerSettings.theme === "clear"}
                className={state.playerSettings.theme === "clear" ? "active" : ""}
                onClick={() =>
                  dispatch({
                    type: "setSettings",
                    settings: { ...state.playerSettings, theme: "clear" },
                  })
                }
                title="清透主題"
              >
                ☼
              </button>
              <button
                aria-pressed={state.playerSettings.theme === "neon"}
                className={state.playerSettings.theme === "neon" ? "active" : ""}
                onClick={() =>
                  dispatch({
                    type: "setSettings",
                    settings: { ...state.playerSettings, theme: "neon" },
                  })
                }
                title="夜光霓虹主題"
              >
                ☾
              </button>
            </div>
            <div className="phase-pill" aria-label="當前光巡">
              <span>第 {phase.cycleNumber} 次光巡</span>
              <strong>{phase.phase}</strong>
            </div>
          </div>
        </header>
        <HabitatStage creature={creature} items={state.habitat.items} phase={phase.phase} />
      </section>

      <section className="panel-column" aria-label="操作面板">
        <section className="name-panel" aria-label="小生物名字">
          <label>
            <span>小生物名字</span>
            <input
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              placeholder={creatureName}
              maxLength={16}
            />
          </label>
          <button
            onClick={() => {
              dispatch({
                type: "renameCreature",
                creatureId: creature.id,
                name: draftName || creatureName,
              });
              setDraftName("");
            }}
          >
            改名
          </button>
        </section>

        <div className="creature-status" aria-live="polite">
          <div>
            <span>最近反應</span>
            <strong>{creature.activeTemporaryEffects[0]?.label ?? `${creatureName} 正在水裡慢慢漂浮。`}</strong>
          </div>
          <div>
            <span>觀測狀態</span>
            <strong>{visibleTraits}</strong>
          </div>
        </div>

        <nav className="tabbar" aria-label="主要分頁">
          <button className={view === "feed" ? "active" : ""} onClick={() => setView("feed")}>
            餵食
          </button>
          <button className={view === "journal" ? "active" : ""} onClick={() => setView("journal")}>
            日記
          </button>
          <button className={view === "atlas" ? "active" : ""} onClick={() => setView("atlas")}>
            觀察
          </button>
          <button
            className={view === "settings" ? "active" : ""}
            onClick={() => setView("settings")}
          >
            設定
          </button>
        </nav>

        {view === "feed" && <FeedingFlow creature={creature} />}
        {view === "journal" && <JournalPage />}
        {view === "atlas" && (
          <section className="tool-panel atlas-panel">
            <h2>觀察圖鑑</h2>
            <p>只記錄已出現的形態，不列出稀有度。</p>
            <div className="trait-grid">
              {[
                ["觸手", creature.appearance.tendrils],
                ["薄膜", creature.appearance.membrane],
                ["結晶", creature.appearance.crystals],
                ["花芽", creature.appearance.flora],
                ["小角", creature.appearance.horns],
                ["漂浮光點", creature.appearance.floatingMotes],
                ["深色核心", creature.appearance.darkCore],
              ].map(([label, value]) => (
                <div className="trait-meter" key={label}>
                  <span>{label}</span>
                  <meter min={0} max={100} value={Number(value)} />
                  <strong>{Math.round(Number(value))}</strong>
                </div>
              ))}
            </div>
          </section>
        )}
        {view === "settings" && <SettingsPanel />}

        <button
          className="touch-button"
          onClick={() => dispatch({ type: "touch", now: new Date().toISOString() })}
        >
          觸摸箱庭邊緣
        </button>
      </section>
    </main>
  );
}

export function App() {
  return (
    <GameProvider>
      <AppShell />
    </GameProvider>
  );
}
