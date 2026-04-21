import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export const Navbar = () => (
  <header className="sticky top-0 z-40 w-full">
    <div className="mx-auto max-w-6xl px-5 pt-4">
      <nav className="glass-card flex items-center justify-between rounded-full px-4 py-2.5 sm:px-5 sm:py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full glow-orb">
            <Sparkles className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Storyzam
          </span>
        </Link>
        <Link
          to="/detect"
          className="rounded-full bg-gradient-brand px-4 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-[0_0_24px_hsl(270_95%_60%/0.5)] transition hover:shadow-[0_0_36px_hsl(270_95%_60%/0.7)] hover:scale-[1.03]"
        >
          Tap to Storyzam
        </Link>
      </nav>
    </div>
  </header>
);
