import { Mic, Square } from "lucide-react";

interface Props {
  recording: boolean;
  onClick: () => void;
}

export const MicOrb = ({ recording, onClick }: Props) => (
  <button
    onClick={onClick}
    aria-label={recording ? "Stop recording" : "Start recording"}
    className="relative inline-flex h-44 w-44 sm:h-52 sm:w-52 items-center justify-center rounded-full transition active:scale-95"
  >
    {/* Outer pulse rings */}
    <span className="pulse-ring" />
    <span className="pulse-ring" style={{ animationDelay: "0.7s" }} />
    <span className="pulse-ring" style={{ animationDelay: "1.4s" }} />
    {/* Glow halo */}
    <span className="absolute inset-2 rounded-full bg-gradient-brand opacity-60 blur-2xl" aria-hidden />
    {/* Core orb */}
    <span className="relative z-10 inline-flex h-32 w-32 sm:h-36 sm:w-36 items-center justify-center rounded-full glow-orb shadow-[inset_0_0_40px_hsl(0_0%_100%/0.25)] transition group-hover:scale-105">
      {recording ? (
        <Square className="h-9 w-9 fill-white text-white" />
      ) : (
        <Mic className="h-12 w-12 text-white" strokeWidth={2} />
      )}
    </span>
  </button>
);
