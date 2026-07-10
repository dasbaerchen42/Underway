import { useRef } from "react";
import { useGame } from "../../state/gameStore";
import { migrateState } from "../../storage/migration";

export function SettingsPanel() {
  const { state, dispatch, exportJson } = useGame();
  const fileRef = useRef<HTMLInputElement>(null);
  const settings = state.playerSettings;

  return (
    <section className="tool-panel settings-panel">
      <div className="panel-heading">
        <div>
          <p className="kicker">資料與顯示</p>
          <h2>設定</h2>
        </div>
        <span>自動儲存中</span>
      </div>

      <label className="select-row">
        動畫強度
        <select
          value={settings.animation}
          onChange={(event) =>
            dispatch({
              type: "setSettings",
              settings: { ...settings, animation: event.target.value as "full" | "reduced" },
            })
          }
        >
          <option value="full">完整</option>
          <option value="reduced">減少</option>
        </select>
      </label>

      <label className="select-row">
        字體大小
        <select
          value={settings.fontScale}
          onChange={(event) =>
            dispatch({
              type: "setSettings",
              settings: { ...settings, fontScale: event.target.value as "normal" | "large" },
            })
          }
        >
          <option value="normal">標準</option>
          <option value="large">較大</option>
        </select>
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={settings.highContrast}
          onChange={(event) =>
            dispatch({
              type: "setSettings",
              settings: { ...settings, highContrast: event.target.checked },
            })
          }
        />
        高對比模式
      </label>

      <div className="settings-actions">
        <button type="button" onClick={() => navigator.clipboard.writeText(exportJson())}>
          複製存檔 JSON
        </button>
        <button type="button" onClick={() => fileRef.current?.click()}>
          匯入 JSON
        </button>
        <button type="button" onClick={() => dispatch({ type: "clear", now: new Date().toISOString() })}>
          清除存檔
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        hidden
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }
          const text = await file.text();
          const migrated = migrateState(JSON.parse(text));
          if (migrated) {
            dispatch({ type: "import", state: migrated });
          }
        }}
      />
      <p className="storage-warning">清除瀏覽器資料可能遺失存檔；匯出 JSON 可保留完整狀態。</p>
    </section>
  );
}
