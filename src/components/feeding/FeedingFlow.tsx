import { useMemo, useState } from "react";
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
  const latest = state.feedings[0];
  const selectedFood = useMemo(() => foods.find((food) => food.id === foodId), [foodId]);
  const creatureName = creature.name === "未命名的牠" ? "小玻" : creature.name;

  return (
    <section className="tool-panel feeding-panel">
      <div className="panel-heading">
        <div>
          <p className="kicker">餵食抽屜</p>
          <h2>把今天的一部分交給牠</h2>
        </div>
        <span className="count-chip">{state.feedings.length} 次紀錄</span>
      </div>

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
              <strong>{food.name}</strong>
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
        餵給{creatureName}
      </button>

      <div className="latest-response" aria-live="polite">
        <span>{selectedFood?.name ?? "食物"}的回聲</span>
        <p>{latest?.dialogue ?? "牠在等第一份餵食，也在等你不必說清楚的那一部分。"}</p>
      </div>
    </section>
  );
}
