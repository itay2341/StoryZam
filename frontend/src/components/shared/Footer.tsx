import { Sparkles } from "lucide-react";

export const Footer = () => (
  <footer className="relative z-10 mt-24 border-t border-border/50 px-5 py-10">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full glow-orb">
          <Sparkles className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
        </span>
        <span className="font-display font-semibold text-foreground">Storyzam</span>
        <span>· hear the story behind the song</span>
      </div>
      <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Storyzam. All meanings are interpretations.</p>
    </div>
  </footer>
);
