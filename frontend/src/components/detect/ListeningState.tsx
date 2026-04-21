import { useEffect, useState } from "react";

const stages = [
  "Listening to the room…",
  "Matching the song…",
  "Reading between the lyrics…",
  "Crafting your Storyzam…",
];

interface Props {
  onDone: () => void;
  duration?: number; // ms
}

export const ListeningState = ({ onDone, duration = 4200 }: Props) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const stepMs = duration / stages.length;
    const interval = setInterval(() => {
      setStage((s) => Math.min(s + 1, stages.length - 1));
    }, stepMs);
    const finish = setTimeout(onDone, duration);
    return () => { clearInterval(interval); clearTimeout(finish); };
  }, [duration, onDone]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-background/80 backdrop-blur-2xl">
      <div className="aurora" aria-hidden><div className="aurora-cyan" /></div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-10 inline-flex h-44 w-44 items-center justify-center">
          <span className="pulse-ring" />
          <span className="pulse-ring" style={{ animationDelay: "0.6s" }} />
          <span className="pulse-ring" style={{ animationDelay: "1.2s" }} />
          <span className="absolute inset-3 rounded-full bg-gradient-brand opacity-50 blur-2xl" />
          <span className="relative inline-flex h-24 w-24 items-center justify-center rounded-full glow-orb">
            <span className="flex items-end gap-1 h-10">
              {[0,1,2,3,4].map((i) => (
                <span key={i} className="wave-bar" style={{ animationDelay: `${i * 0.12}s`, height: 32 }} />
              ))}
            </span>
          </span>
        </div>

        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Storyzam</p>
        <p key={stage} className="mt-3 font-display text-2xl sm:text-3xl shimmer-text animate-fade-in-up">
          {stages[stage]}
        </p>

        <div className="mt-8 h-1 w-56 overflow-hidden rounded-full bg-secondary/60">
          <div
            className="h-full bg-gradient-brand transition-[width] duration-500 ease-out"
            style={{ width: `${((stage + 1) / stages.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
