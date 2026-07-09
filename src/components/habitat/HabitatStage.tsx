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
      <div className="greenhouse-frame" />
      <div className="floor-plane" />
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
      <CreatureView creature={creature} />
    </div>
  );
}
