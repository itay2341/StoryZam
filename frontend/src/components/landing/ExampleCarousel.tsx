import { Link } from "react-router-dom";
import { mockSongs } from "@/data/mockSongs";
import { ArrowUpRight } from "lucide-react";

export const ExampleCarousel = () => (
  <section className="relative px-5 py-20">
    <div className="mx-auto max-w-6xl">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Featured stories</p>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl font-semibold tracking-tight gradient-text">
            Songs you thought you knew.
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          Real Storyzam reflections. Tap a card to feel the song from the inside.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {mockSongs.map((song, i) => (
          <Link
            key={song.id}
            to={`/result/${song.id}`}
            className="group relative overflow-hidden rounded-3xl glass-card transition hover:-translate-y-1.5 hover:shadow-[0_30px_80px_-20px_hsl(330_90%_30%/0.6)]"
            style={{ animation: `fade-in-up 0.7s ${i * 80}ms both` }}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={song.coverImage}
                alt={`${song.title} by ${song.artist}`}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full glass-card px-2.5 py-1 text-[10px] text-foreground/90">
                {song.confidence}% match
              </div>
              <div className="absolute inset-x-5 bottom-5">
                <p className="font-display text-2xl font-semibold leading-tight">{song.title}</p>
                <p className="text-sm text-muted-foreground">{song.artist}</p>
              </div>
            </div>
            <div className="space-y-3 p-5">
              <p className="font-display text-base leading-snug text-foreground/95">
                "{song.shortSummary}"
              </p>
              <div className="flex flex-wrap gap-1.5">
                {song.themes.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 text-[10px] capitalize text-foreground/80">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1.5 pt-1 text-xs font-medium text-foreground/80 transition group-hover:text-foreground">
                Read the story <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);
