import { useRef, useState } from "react";
import { useGame } from "../../state/gameStore";

export function SettingsPanel() {
  const { state, dispatch, exportJson, importJson, resetGame, storageError } = useGame();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const creature = state.creatures[0];

  return (
    <section className="tool-panel settings-panel">
      <div className="panel-heading">
        <div>
          <p className="kicker">資料與顯示</p>
          <h2>設定</h2>
        </div>
        <span>{storageError ?? "自動儲存中"}</span>
      </div>

      <label className="select-row">
        牠的名字
        <input
          className="name-input"
          defaultValue={creature.name}
          maxLength={16}
          onBlur={(event) =>
            dispatch({
              type: "renameCreature",
              creatureId: creature.id,
              name: event.target.value,
            })
          }
          type="text"
        />
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
          setImportMessage(result.ok ? "已匯入存檔。" : result.message);
          event.target.value = "";
        }}
      />
      {importMessage && <p className="storage-warning">{importMessage}</p>}
      <p className="storage-warning">清除瀏覽器資料可能遺失存檔；匯出 JSON 可保留完整狀態。</p>
    </section>
  );
}
