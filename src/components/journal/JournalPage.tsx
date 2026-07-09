import { foods } from "../../data/foods";
import { meanings } from "../../data/meanings";
import { useGame } from "../../state/gameStore";

export function JournalPage() {
  const { state, exportMarkdown } = useGame();

  return (
    <section className="tool-panel journal-panel">
      <div className="panel-heading">
        <div>
          <p className="kicker">每日觀察</p>
          <h2>日記</h2>
        </div>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(exportMarkdown())}
        >
          複製 Markdown
        </button>
      </div>
      <div className="journal-list">
        {state.journalEntries.map((entry) => (
          <details className="journal-entry" key={entry.id} open={entry === state.journalEntries[0]}>
            <summary>
              <span>{entry.date}</span>
              <strong>{entry.feedingIds.length} 次餵食</strong>
            </summary>
            <p>{entry.summary}</p>
            <ul>
              {entry.observations.map((observation) => (
                <li key={observation}>{observation}</li>
              ))}
            </ul>
            <div className="feeding-detail">
              {entry.feedingIds.map((id) => {
                const feeding = state.feedings.find((item) => item.id === id);
                if (!feeding) {
                  return null;
                }
                const food = foods.find((item) => item.id === feeding.foodId)?.name;
                const meaning = meanings.find((item) => item.id === feeding.meaningId)?.label;
                return (
                  <article key={id}>
                    <span>
                      {new Date(feeding.timestamp).toLocaleTimeString("zh-TW", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <strong>{food}</strong>
                    <p>{meaning}</p>
                    {feeding.showNoteInJournal && feeding.note && <em>{feeding.note}</em>}
                  </article>
                );
              })}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
