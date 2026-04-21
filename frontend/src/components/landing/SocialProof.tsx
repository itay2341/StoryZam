const quotes = [
  { q: "I cried at a song I'd heard a hundred times. Now I know why.", a: "@miradraws" },
  { q: "Storyzam turned my Spotify playlist into a diary.", a: "@leohwrites" },
  { q: "It's like Genius lyrics, but with feelings.", a: "@noah.fm" },
  { q: "The result page deserves to be a screensaver.", a: "@kylie__b" },
];

export const SocialProof = () => (
  <section className="relative px-5 py-16">
    <div className="mx-auto max-w-6xl">
      <p className="mb-8 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
        What early listeners are saying
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quotes.map((q) => (
          <figure key={q.a} className="glass-card rounded-2xl p-5">
            <blockquote className="font-display text-base leading-snug text-foreground/95">
              "{q.q}"
            </blockquote>
            <figcaption className="mt-3 text-xs text-muted-foreground">{q.a}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);
