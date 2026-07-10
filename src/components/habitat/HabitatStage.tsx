import type { CSSProperties } from "react";
import { CreatureView } from "../creature/CreatureView";
import type { Creature, HabitatItem } from "../../types";

const WALL_KINDS = new Set(["curtain"]);
const FLOOR_TOP = 52;
const FLOOR_BOTTOM = 84;

// y 越大越靠近觀察者：縮放放大、z-index 提前，物件底部錨定在 y(接地)。
function floorDepth(y: number) {
  return Math.min(1, Math.max(0, (y - FLOOR_TOP) / (FLOOR_BOTTOM - FLOOR_TOP)));
}

export function HabitatStage({
  creature,
  items,
  phase,
  showFurniture,
  onToggleFurniture,
}: {
  creature: Creature;
  items: HabitatItem[];
  phase: string;
  showFurniture: boolean;
  onToggleFurniture: () => void;
}) {
  return (
    <div className="habitat-stage" data-phase={phase}>
      <div className="back-wall" />
      <div className="greenhouse-frame" />
      <div className="floor-plane" />
      {showFurniture &&
        items.map((item) => {
          const isWall = WALL_KINDS.has(item.kind);
          const depth = floorDepth(item.y);
          const style = {
            left: `${item.x}%`,
            top: `${item.y}%`,
            rotate: `${item.rotation}deg`,
            zIndex: isWall ? 1 : Math.round(item.y),
            transform: isWall
              ? "translate(-50%, -50%)"
              : `translate(-50%, -100%) scale(${(0.72 + depth * 0.5).toFixed(3)})`,
            transformOrigin: "50% 100%",
            "--item-tint": item.tint,
            "--depth": depth,
          } as CSSProperties;
          return (
            <div
              className={`furniture furniture-${item.kind}`}
              key={item.id}
              style={style}
              title={item.name}
            >
              <span />
            </div>
          );
        })}
      <CreatureView creature={creature} />
      <div className="glass-layer" aria-hidden="true">
        <span className="glass-sheen" />
        <span className="glass-drops" />
        <span className="glass-fog" />
      </div>
      <button
        className="furniture-toggle"
        onClick={onToggleFurniture}
        type="button"
        aria-pressed={!showFurniture}
      >
        {showFurniture ? "隱藏家具" : "顯示家具"}
      </button>
    </div>
  );
}
