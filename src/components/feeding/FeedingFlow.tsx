import { useState } from "react";
import { careIntents } from "../../data/careIntents";
import { foods } from "../../data/foods";
import { meanings } from "../../data/meanings";
import { useGame } from "../../state/gameStore";
import type { Creature } from "../../types";

export function FeedingFlow({ creature }: { creature: Creature }) {
  const { state, dispatch } = useGame();
  const [foodId, setFoodId] = useState(foods[0].id);
  const [meaningId, setMeaningId] = useState(meanings[0].id);
  const [careIntentId, setCareIntentId] = useState(careIntents[0].id);
  const [note, setNote] = useState("");
  const [showNoteInJournal, setShowNoteInJournal] = useState(true);
  const [dismissedFeedingId, setDismissedFeedingId] = useState<string | null>(null);

  // 食物意義的試探確認(規格 §11.1):用滿三次、這次又是主導意義時,輕輕問一次。
  const latest = state.feedings[0];
  const latestMemory = latest ? creature.foodMemory[latest.foodId] : undefined;
  const askConfirm =
    latest &&
    latestMemory &&
    !latestMemory.confirmedByPlayer &&
    !latestMemory.namingDeclined &&
    latestMemory.uses >= 3 &&
    latestMemory.dominantMeaningId === latest.meaningId &&
    dismissedFeedingId !== latest.id;
  const latestFoodName = foods.find((food) => food.id === latest?.foodId)?.name ?? "食物";
  const dominantMeaningLabel =
    meanings.find((meaning) => meaning.id === latestMemory?.dominantMeaningId)?.label ?? "";

  return (
    <section className="tool-panel feeding-panel">
      {askConfirm && (
        <div className="memory-question" aria-live="polite">
          <p>
            今天的{latestFoodName}，也要放進「{dominantMeaningLabel}」的那個小盒子裡嗎？
          </p>
          <div className="memory-question-actions">
            <button
              type="button"
              onClick={() => dispatch({ type: "confirmFoodMeaning", foodId: latest.foodId })}
            >
              是，就是那裡
            </button>
            <button type="button" onClick={() => setDismissedFeedingId(latest.id)}>
              今天不一樣
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "declineFoodNaming", foodId: latest.foodId })}
            >
              不用替它命名
            </button>
          </div>
        </div>
      )}

      <fieldset>
        <legend>食物</legend>
        <div className="option-grid food-grid">
          {foods.map((food) => (
            <button
              key={food.id}
              className={food.id === foodId ? "selected" : ""}
              onClick={() => setFoodId(food.id)}
              type="button"
            >
              {food.name}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>描述</legend>
        <div className="option-grid">
          {meanings.map((meaning) => (
            <button
              key={meaning.id}
              className={meaning.id === meaningId ? "selected" : ""}
              onClick={() => setMeaningId(meaning.id)}
              type="button"
            >
              {meaning.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>期待</legend>
        <div className="option-grid">
          {careIntents.map((careIntent) => (
            <button
              key={careIntent.id}
              className={careIntent.id === careIntentId ? "selected" : ""}
              onClick={() => setCareIntentId(careIntent.id)}
              type="button"
            >
              {careIntent.label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="note-field">
        <span>自由文字</span>
        <textarea
          maxLength={500}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="可以留空。這段文字只保存，不做語意解析。"
        />
      </label>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={showNoteInJournal}
          onChange={(event) => setShowNoteInJournal(event.target.checked)}
        />
        顯示在日記裡
      </label>

      <button
        className="primary-action"
        onClick={() => {
          dispatch({
            type: "feed",
            input: {
              creatureId: creature.id,
              foodId,
              meaningId,
              careIntentId,
              note,
              showNoteInJournal,
              timestamp: new Date().toISOString(),
            },
          });
          setNote("");
        }}
      >
        餵給牠
      </button>
    </section>
  );
}
