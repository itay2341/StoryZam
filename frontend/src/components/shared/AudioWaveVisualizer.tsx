import { useEffect, useState } from "react";

interface Props {
  bars?: number;
  active?: boolean;
  className?: string;
  height?: number;
}

export const AudioWaveVisualizer = ({ bars = 28, active = true, className = "", height = 56 }: Props) => {
  const [seeds] = useState(() => Array.from({ length: bars }, () => Math.random()));
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setTick((t) => t + 1), 140);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div className={`flex items-center justify-center gap-[3px] ${className}`} style={{ height }} aria-hidden>
      {seeds.map((seed, i) => {
        const base = 0.25 + ((Math.sin(tick * 0.6 + i * 0.5 + seed * 6) + 1) / 2) * 0.75;
        const h = active ? base * height : height * 0.18;
        return (
          <span
            key={i}
            className="rounded-full bg-gradient-brand"
            style={{
              width: 3,
              height: h,
              transition: "height 140ms cubic-bezier(0.22,1,0.36,1)",
              opacity: active ? 0.9 : 0.4,
            }}
          />
        );
      })}
    </div>
  );
};
