import type { CSSProperties } from "react";
import { deriveVisualProfile } from "../../domain/creature/deriveVisualProfile";
import type { Creature } from "../../types";

const tendrilSlots = ["outer-left", "outer-right", "inner-left", "inner-right", "side-left"];

export function CreatureView({ creature }: { creature: Creature }) {
  const appearance = creature.appearance;
  const profile = deriveVisualProfile(creature);
  const style = {
    "--appearance-glow": appearance.glow,
    "--appearance-dark-core": appearance.darkCore,
    "--creature-body": profile.bodyColor,
    "--creature-opacity": profile.bodyOpacity,
    "--jelly-wide": 1 + appearance.softness * 0.00055,
    "--jelly-narrow": 1 - appearance.softness * 0.00035,
    "--jelly-speed": `${6.2 - appearance.fluidMotion * 0.028}s`,
    "--shape-speed": `${9 - appearance.softness * 0.03}s`,
    "--tendril-speed": `${8 - appearance.fluidMotion * 0.04}s`,
    "--wet-shine": 0.18 + appearance.wetness * 0.0046,
  } as CSSProperties;
  const name = creature.name === "未命名的牠" ? "小玻" : creature.name;
  const reaction = creature.activeTemporaryEffects[0];
  const reactionType = reaction?.id.startsWith("touch-") ? "touch" : reaction ? "feeding" : "idle";

  return (
    <div
      className={`creature-wrap reaction-${reactionType}`}
      aria-label={`${name} 的觀測樣貌`}
    >
      <div className="aura-effects" aria-hidden="true">
        <div className="bubble-aura">
          {Array.from({ length: profile.bubbleCount }, (_, index) => (
            <span className="aura-bubble" key={`bubble-${index}`} />
          ))}
        </div>
        <div className="star-aura">
          {Array.from({ length: profile.starCount }, (_, index) => (
            <span className="aura-star" key={`star-${index}`} />
          ))}
        </div>
      </div>
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
        <div className="jelly-tendrils" aria-hidden="true">
          {tendrilSlots.map((slot, index) => (
            <span
              className={`jelly-tendril tendril-${slot} ${index < profile.tendrilCount ? "is-visible" : ""}`}
              key={slot}
              style={{ "--tendril-delay": `${index * -0.62}s` } as CSSProperties}
            >
              <span className="tendril-segment segment-root" />
              <span className="tendril-segment segment-middle" />
              <span className="tendril-segment segment-tip" />
            </span>
          ))}
        </div>
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
    </div>
  );
}
