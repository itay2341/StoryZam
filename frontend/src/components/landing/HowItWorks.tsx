import { Mic, Music2, Sparkles } from "lucide-react";

const steps = [
  { icon: Mic, title: "Listen", text: "Tap once. Storyzam picks up the song from anywhere — a café, a film, a memory." },
  { icon: Music2, title: "Detect", text: "We identify the song with confidence — title, artist, and the world it lives in." },
  { icon: Sparkles, title: "Understand", text: "Our AI reveals the story, themes, and the emotion threaded through the music." },
];

export const HowItWorks = () => (
  <section id="how-it-works" className="relative px-5 py-20">
    <div className="mx-auto max-w-6xl">
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">How it works</p>
        <h2 className="mt-3 font-display text-3xl sm:text-5xl font-semibold tracking-tight gradient-text">
          One tap. Three quiet miracles.
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="group relative glass-card rounded-3xl p-6 transition hover:-translate-y-1 hover:shadow-[0_30px_80px_-20px_hsl(270_95%_30%/0.6)]"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-brand-soft brand-border">
              <s.icon className="h-5 w-5 text-foreground" />
            </div>
            <p className="font-display text-xs uppercase tracking-[0.22em] text-muted-foreground">Step {i + 1}</p>
            <h3 className="mt-1 font-display text-2xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
