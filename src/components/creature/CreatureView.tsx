import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { deriveVisualProfile } from "../../domain/creature/deriveVisualProfile";
import type { TouchZone } from "../../domain/creature/resolveTouch";
import type { Creature } from "../../types";

const tendrilSlots = ["one", "two", "three"] as const;

export function CreatureView({
  creature,
  onTouch,
}: {
  creature: Creature;
  onTouch: (zone: TouchZone) => void;
}) {
  const reduced = useMemo(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    [],
  );
  const appearance = creature.appearance;
  const profile = deriveVisualProfile(creature);
  const [pos, setPos] = useState({ x: 50, y: 54 });
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const [fleeing, setFleeing] = useState(false);

  // 在觀測區裡緩慢遊走：每 9~18 秒挑一個新位置，transition 慢慢飄過去。
  useEffect(() => {
    if (reduced) {
      return;
    }
    let alive = true;
    let timer = 0;
    const wander = () => {
      if (!alive) {
        return;
      }
      setPos({ x: 28 + Math.random() * 44, y: 40 + Math.random() * 24 });
      timer = window.setTimeout(wander, 9000 + Math.random() * 9000);
    };
    timer = window.setTimeout(wander, 2500);
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [reduced]);

  // 視線游移：滑向一個方向、停一會兒，偶爾回到正面看你。
  useEffect(() => {
    if (reduced) {
      return;
    }
    let alive = true;
    let timer = 0;
    const glance = () => {
      if (!alive) {
        return;
      }
      setGaze(
        Math.random() < 0.28
          ? { x: 0, y: 0 }
          : { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 },
      );
      timer = window.setTimeout(glance, 1600 + Math.random() * 3400);
    };
    timer = window.setTimeout(glance, 1200);
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [reduced]);

  const style = {
    left: `${pos.x}%`,
    top: `${pos.y}%`,
    // 跟家具一起做深度排序：身體底部大約在中心點往下 24%
    zIndex: Math.round(pos.y + 24),
    "--blue": appearance.hueBlue,
    "--amber": appearance.hueAmber,
    "--transparency": appearance.transparency,
    "--glow": appearance.glow,
    "--softness": appearance.softness,
    "--wetness": appearance.wetness,
    "--dark-core": appearance.darkCore,
    "--fluid-motion": appearance.fluidMotion,
    "--tendrils": appearance.tendrils,
    "--gaze-x": gaze.x,
    "--gaze-y": gaze.y,
  } as CSSProperties;
  const reaction = creature.activeTemporaryEffects[0];
  const reactionType = reaction
    ? reaction.id.startsWith("touch-")
      ? reaction.id.split("-")[1]
      : "feeding"
    : "idle";

  // 被摸但今天不想:快速滑到別的地方
  const lastFlee = useRef("");
  useEffect(() => {
    if (!reaction || !reaction.id.startsWith("touch-retreat") || lastFlee.current === reaction.id) {
      return;
    }
    lastFlee.current = reaction.id;
    setFleeing(true);
    setPos((current) => ({
      x: current.x > 50 ? 28 + Math.random() * 8 : 64 + Math.random() * 8,
      y: 42 + Math.random() * 18,
    }));
    const handle = window.setTimeout(() => setFleeing(false), 2400);
    return () => window.clearTimeout(handle);
  }, [reaction]);

  const handleTouch = (event: React.MouseEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientY - box.top) / box.height;
    onTouch(ratio < 0.4 ? "head" : ratio < 0.72 ? "body" : "tail");
  };

  return (
    <div
      className={`creature-wrap reaction-${reactionType} ${fleeing ? "fleeing" : ""}`}
      style={style}
      aria-label={`${creature.name} 的外觀`}
    >
      <div className="tendril-layer" aria-hidden="true">
        {tendrilSlots.slice(0, profile.tendrilCount).map((slot) => (
          <span className={`tendril tendril-${slot}`} key={slot} />
        ))}
      </div>
      <div
        className="creature"
        key={reaction?.id ?? "idle"}
        onClick={handleTouch}
        role="button"
        tabIndex={0}
        aria-label="觸摸牠"
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onTouch("body");
          }
        }}
      >
        <div className="creature-core" />
        <div className="face-rig" aria-hidden="true">
          <span className="creature-brow brow-left" />
          <span className="creature-brow brow-right" />
          <span className="creature-eye eye-left" />
          <span className="creature-eye eye-right" />
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
