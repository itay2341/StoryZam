import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AudioWaveVisualizer } from "@/components/shared/AudioWaveVisualizer";
import { mockSongs } from "@/data/mockSongs";

export const Hero = () => {
  const preview = mockSongs[0];
  return (
    <section className="relative overflow-hidden px-5 pt-10 pb-20 sm:pt-16 sm:pb-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full glass-card px-3 py-1.5 text-xs text-muted-foreground animate-fade-in-up">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
            Now in early access · powered by AI
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-tight animate-fade-in-up" style={{ animationDelay: "60ms" }}>
            <span className="gradient-text">Hear the song.</span>
            <br />
            <span className="gradient-brand-text">Understand the story.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "140ms" }}>
            Storyzam doesn't just tell you what's playing. It reveals what the music is really saying — the emotion, the story, the reason it moves you.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 animate-fade-in-up" style={{ animationDelay: "220ms" }}>
            <Link
              to="/detect"
              className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_hsl(270_95%_60%/0.55)] transition hover:scale-[1.03] hover:shadow-[0_0_60px_hsl(270_95%_60%/0.8)]"
            >
              Tap to Storyzam
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#how-it-works"
              className="rounded-full glass-card px-5 py-3 text-sm font-medium text-foreground/80 transition hover:text-foreground"
            >
              See how it works
            </a>
          </div>
          <div className="mt-10 flex items-center gap-4 text-xs text-muted-foreground animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <AudioWaveVisualizer bars={20} height={28} />
            <span>Identifying meaning, not just metadata.</span>
          </div>
        </div>

        {/* Floating phone-mockup result preview */}
        <div className="relative mx-auto w-full max-w-sm animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="relative animate-float">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-brand opacity-30 blur-3xl" aria-hidden />
            <div className="relative glass-card rounded-[2.25rem] p-5 brand-border">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={preview.coverImage}
                  alt={`${preview.title} cover`}
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cyan">98% match</p>
                  <h3 className="font-display text-2xl font-semibold leading-tight">{preview.title}</h3>
                  <p className="text-sm text-muted-foreground">{preview.artist}</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">The story</p>
                <p className="font-display text-lg leading-snug">
                  "{preview.shortSummary}"
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {preview.themes.slice(0, 4).map((t) => (
                    <span key={t} className="rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 text-[10px] capitalize text-foreground/80">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
