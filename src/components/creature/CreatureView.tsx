import type { CSSProperties } from "react";
import type { Creature } from "../../types";

function Tendril({ position }: { position: "one" | "two" | "three" }) {
  return (
    <span className={`tendril tendril-${position}`} aria-hidden="true">
      <span className="tendril-seg">
        <span className="tendril-seg">
          <span className="tendril-seg tendril-tip" />
        </span>
      </span>
    </span>
  );
}

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
    "--tendrils": appearance.tendrils,
  } as CSSProperties;

  return (
    <div className="creature-wrap" aria-label={`${creature.name} 的外觀`}>
      <div className="creature" style={style}>
        <div className="creature-core" />
        <div className="creature-eye eye-left" />
        <div className="creature-eye eye-right" />
        {appearance.tendrils >= 18 && (
          <>
            <Tendril position="one" />
            <Tendril position="two" />
            <Tendril position="three" />
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
