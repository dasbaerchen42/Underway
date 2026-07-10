import type { CSSProperties } from "react";
import type { Creature } from "../../types";

export function CreatureView({ creature }: { creature: Creature }) {
  const appearance = creature.appearance;
  const style = {
    "--blue": appearance.hueBlue,
    "--amber": appearance.hueAmber,
    "--transparency": appearance.transparency,
    "--glow": appearance.glow,
    "--softness": appearance.softness,
    "--wetness": appearance.wetness,
    "--dark-core": appearance.darkCore,
    "--fluid-motion": appearance.fluidMotion,
  } as CSSProperties;
  const name = creature.name === "未命名的牠" ? "小玻" : creature.name;
  const reaction = creature.activeTemporaryEffects[0];
  const reactionType = reaction?.id.startsWith("touch-") ? "touch" : reaction ? "feeding" : "idle";

  return (
    <div
      className={`creature-wrap reaction-${reactionType}`}
      aria-label={`${name} 的觀測樣貌`}
    >
      <div className="creature" key={reaction?.id ?? "idle"} style={style}>
        <div className="creature-core">
          <span />
        </div>
        <div className="face-rig" aria-hidden="true">
          <span className="creature-brow brow-left" />
          <span className="creature-brow brow-right" />
          <span className="creature-eye eye-left" />
          <span className="creature-eye eye-right" />
        </div>
        {appearance.tendrils >= 18 && (
          <>
            <span className="tendril tendril-one" />
            <span className="tendril tendril-two" />
            <span className="tendril tendril-three" />
          </>
        )}
        {appearance.membrane >= 18 && <span className="membrane" />}
        {appearance.crystals >= 22 && (
          <>
            <span className="crystal crystal-one" />
            <span className="crystal crystal-two" />
          </>
        )}
        {appearance.flora >= 22 && (
          <>
            <span className="flora flora-one" />
            <span className="flora flora-two" />
          </>
        )}
        {appearance.horns >= 26 && (
          <>
            <span className="horn horn-left" />
            <span className="horn horn-right" />
          </>
        )}
      </div>
      {appearance.floatingMotes >= 18 && (
        <div className="motes" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      )}
    </div>
  );
}
