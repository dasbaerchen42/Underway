import { useRef, useState, type CSSProperties } from "react";
import { CreatureView } from "../creature/CreatureView";
import type { TouchZone } from "../../domain/creature/resolveTouch";
import type { Creature, HabitatItem } from "../../types";

const WALL_KINDS = new Set(["curtain"]);
const FLOOR_TOP = 52;
const FLOOR_BOTTOM = 84;

// y 越大越靠近觀察者：縮放放大、z-index 提前，物件底部錨定在 y(接地)。
function floorDepth(y: number) {
  return Math.min(1, Math.max(0, (y - FLOOR_TOP) / (FLOOR_BOTTOM - FLOOR_TOP)));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

// 拖曳限制：地板物件留在地板帶，牆掛物件留在牆面。
function clampToArea(kind: string, x: number, y: number) {
  if (WALL_KINDS.has(kind)) {
    return { x: clamp(x, 10, 90), y: clamp(y, 5, 26) };
  }
  return { x: clamp(x, 8, 92), y: clamp(y, FLOOR_TOP + 4, FLOOR_BOTTOM) };
}

export function HabitatStage({
  creature,
  items,
  phase,
  showFurniture,
  onToggleFurniture,
  onTouch,
  onMoveItem,
}: {
  creature: Creature;
  items: HabitatItem[];
  phase: string;
  showFurniture: boolean;
  onToggleFurniture: () => void;
  onTouch: (zone: TouchZone) => void;
  onMoveItem: (id: string, x: number, y: number) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);

  const toStagePercent = (clientX: number, clientY: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) {
      return null;
    }
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  };

  return (
    <div className="habitat-stage" data-phase={phase} ref={stageRef}>
      <div className="back-wall" />
      <div className="greenhouse-frame" />
      <div className="floor-plane" />
      {showFurniture &&
        items.map((item) => {
          const isDragging = drag?.id === item.id;
          const x = isDragging ? drag.x : item.x;
          const y = isDragging ? drag.y : item.y;
          const isWall = WALL_KINDS.has(item.kind);
          const depth = floorDepth(y);
          const style = {
            left: `${x}%`,
            top: `${y}%`,
            rotate: `${item.rotation}deg`,
            zIndex: isWall ? 1 : Math.round(y),
            transform: isWall
              ? "translate(-50%, -50%)"
              : `translate(-50%, -100%) scale(${(0.72 + depth * 0.5).toFixed(3)})`,
            transformOrigin: "50% 100%",
            "--item-tint": item.tint,
            "--depth": depth,
          } as CSSProperties;
          return (
            <div
              className={`furniture furniture-${item.kind} ${isDragging ? "dragging" : ""}`}
              key={item.id}
              style={style}
              title={item.name}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                setDrag({ id: item.id, x: item.x, y: item.y });
              }}
              onPointerMove={(event) => {
                if (drag?.id !== item.id) {
                  return;
                }
                const point = toStagePercent(event.clientX, event.clientY);
                if (!point) {
                  return;
                }
                const next = clampToArea(item.kind, point.x, point.y);
                setDrag({ id: item.id, ...next });
              }}
              onPointerUp={() => {
                if (drag?.id === item.id) {
                  onMoveItem(item.id, drag.x, drag.y);
                }
                setDrag(null);
              }}
              onPointerCancel={() => setDrag(null)}
            >
              <span />
            </div>
          );
        })}
      <CreatureView creature={creature} onTouch={onTouch} />
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
