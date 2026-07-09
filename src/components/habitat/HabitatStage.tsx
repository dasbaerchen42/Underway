import type { CSSProperties } from "react";
import { CreatureView } from "../creature/CreatureView";
import type { Creature, HabitatItem } from "../../types";

export function HabitatStage({
  creature,
  items,
  phase,
}: {
  creature: Creature;
  items: HabitatItem[];
  phase: string;
}) {
  return (
    <div className="habitat-stage" data-phase={phase}>
      <div className="aquarium-shell" aria-hidden="true">
        <div className="aqua-room">
          <span className="room-fill left-fill" />
          <span className="room-fill right-fill" />
          <span className="room-fill floor-fill" />
          <span className="room-line room-line-left" />
          <span className="room-line room-line-right" />
          <span className="room-line room-line-floor-left" />
          <span className="room-line room-line-floor-right" />
          <span className="room-line room-line-inner-left" />
          <span className="room-line room-line-inner-right" />
          <span className="wall-panel panel-a" />
          <span className="wall-panel panel-b" />
          <span className="wall-panel panel-c" />
          <span className="wall-panel panel-d" />
          <span className="wall-shelf" />
          <span className="wall-shelf small" />
        </div>
        <div className="aqua-floor">
          <span className="floor-tile tile-a" />
          <span className="floor-tile tile-b" />
          <span className="floor-tile tile-c" />
          {items.map((item) => (
            <div
              className={`furniture furniture-${item.kind}`}
              key={item.id}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                rotate: `${item.rotation}deg`,
                "--item-tint": item.tint,
              } as CSSProperties}
              title={item.name}
            >
              <span />
            </div>
          ))}
        </div>
        <div className="water-layer" />
        <span className="water-line water-line-a" />
        <span className="water-line water-line-b" />
        <span className="bubble bubble-a" />
        <span className="bubble bubble-b" />
        <span className="bubble bubble-c" />
      </div>
      <CreatureView creature={creature} />
    </div>
  );
}
