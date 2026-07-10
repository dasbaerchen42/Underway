import type { CSSProperties } from "react";
import { deriveVisualProfile } from "../../domain/creature/deriveVisualProfile";
import type { Creature } from "../../types";

const tendrilSlots = ["one", "two", "three"] as const;

export function CreatureView({ creature }: { creature: Creature }) {
  const appearance = creature.appearance;
  const profile = deriveVisualProfile(creature);
  const style = {
    "--blue": appearance.hueBlue,
    "--amber": appearance.hueAmber,
    "--transparency": appearance.transparency,
    "--glow": appearance.glow,
    "--softness": appearance.softness,
    "--wetness": appearance.wetness,
    "--dark-core": appearance.darkCore,
    "--fluid-motion": appearance.fluidMotion,
    "--tendrils": appearance.tendrils,
  } as CSSProperties;
  const reaction = creature.activeTemporaryEffects[0];
  const reactionType = reaction?.id.startsWith("touch-") ? "touch" : reaction ? "feeding" : "idle";

  return (
    <div
      className={`creature-wrap reaction-${reactionType}`}
      aria-label={`${creature.name} 的外觀`}
    >
      <div className="creature" key={reaction?.id ?? "idle"} style={style}>
        <div className="creature-core" />
        <div className="face-rig" aria-hidden="true">
          <span className="creature-brow brow-left" />
          <span className="creature-brow brow-right" />
          <span className="creature-eye eye-left" />
          <span className="creature-eye eye-right" />
        </div>
        {tendrilSlots.slice(0, profile.tendrilCount).map((slot) => (
          <span className={`tendril tendril-${slot}`} key={slot} aria-hidden="true" />
        ))}
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
      {profile.moteCount > 0 && (
        <div className="motes" aria-hidden="true">
          {Array.from({ length: profile.moteCount }, (_, index) => (
            <span key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
