import { useRef, useState } from "react";
import { useGame } from "../../state/gameStore";

export function SettingsPanel() {
  const { state, dispatch, exportJson, importJson, resetGame, storageError } = useGame();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
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
              settings: { ...settings, fontScale: event.target.value as "small" | "normal" | "large" },
            })
          }
        >
          <option value="small">小</option>
          <option value="normal">標準</option>
          <option value="large">較大</option>
        </select>
      </label>

      <label className="select-row">
        主題
        <select
          value={settings.theme}
          onChange={(event) =>
            dispatch({
              type: "setSettings",
              settings: { ...settings, theme: event.target.value as "clear" | "neon" },
            })
          }
        >
          <option value="clear">清透</option>
          <option value="neon">夜光霓虹</option>
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
        <button type="button" onClick={resetGame}>
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
          const result = importJson(text);
          setImportMessage(result.ok ? "存檔已安全匯入。" : result.message);
          event.target.value = "";
        }}
      />
      {(importMessage || storageError) && (
        <p className="settings-message" role="status">
          {importMessage ?? storageError}
        </p>
      )}
      <p className="storage-warning">清除會移除這台裝置上的主要存檔與備份。請先匯出 JSON，避免無法復原。</p>
    </section>
  );
}
