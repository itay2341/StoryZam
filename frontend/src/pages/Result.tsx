import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Play, Share2, Sparkles, Languages } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { AuroraBackground } from "@/components/shared/AuroraBackground";
import { Footer } from "@/components/shared/Footer";
import { ShareCardModal } from "@/components/result/ShareCardModal";
import { getMockSongById } from "@/data/mockSongs";
import type { SongStory } from "@/types/song";

type Language = 'en' | 'he';

const toneColor = (tone: string) => {
  const map: Record<string, string> = {
    melancholic: "from-violet/30 to-violet/5",
    tender: "from-pink/30 to-pink/5",
    intimate: "from-magenta/30 to-magenta/5",
    hopeful: "from-cyan/30 to-cyan/5",
    uplifting: "from-cyan/30 to-cyan/5",
    cinematic: "from-violet/30 to-magenta/10",
    defiant: "from-magenta/30 to-magenta/5",
    warm: "from-pink/30 to-pink/5",
    wistful: "from-violet/30 to-violet/5",
    bittersweet: "from-magenta/30 to-violet/10",
    dreamy: "from-cyan/30 to-violet/10",
  };
  return map[tone.toLowerCase()] ?? "from-violet/20 to-magenta/10";
};

const Result = () => {
  const { id = "" } = useParams();
  const [song, setSong] = useState<SongStory | null>(null);
  const [share, setShare] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  // Toggle language function
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'he' : 'en');
  };

  // Get the content based on selected language
  const content = language === 'he' && song?.he ? song.he : song;

  useEffect(() => {
    const stored = sessionStorage.getItem(`storyzam:${id}`);
    if (stored) {
      try { setSong(JSON.parse(stored)); return; } catch { /* ignore */ }
    }
    const mock = getMockSongById(id);
    if (mock) setSong(mock);
  }, [id]);

  if (!song) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <AuroraBackground />
        <Navbar />
        <div className="relative z-10 mx-auto max-w-2xl px-5 py-32 text-center">
          <p className="font-display text-2xl gradient-text">Story not found.</p>
          <Link to="/" className="mt-6 inline-block rounded-full glass-card px-5 py-2.5 text-sm">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden pb-28 sm:pb-12">
      <AuroraBackground />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-4xl px-5 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/detect" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> New Storyzam
          </Link>
          {song?.he && (
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-2 rounded-full glass-card px-3 py-1.5 text-xs font-medium hover:bg-white/5 transition"
              dir={language === 'he' ? 'rtl' : 'ltr'}
            >
              <Languages className="h-3.5 w-3.5" />
              {language === 'en' ? 'עברית' : 'English'}
            </button>
          )}
        </div>

        {/* Hero */}
        <section className="grid gap-8 sm:grid-cols-[280px_1fr] sm:items-end animate-fade-in-up">
          <div className="relative mx-auto w-full max-w-[300px]">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-brand opacity-40 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl glass-card brand-border">
              <img src={song.coverImage} alt={`${song.title} cover`} className="aspect-square w-full object-cover" />
            </div>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-cyan">{song.confidence}% match · identified</p>
            <h1 className="mt-2 font-display text-5xl sm:text-6xl font-semibold leading-[1.02] tracking-tight gradient-text">
              {song.title}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {song.artist}{song.album ? ` · ${song.album}` : ""}{song.year ? ` · ${song.year}` : ""}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-2 text-sm">
                <Play className="h-4 w-4" /> Play snippet
              </button>
              <button
                onClick={() => setShare(true)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-[0_0_30px_hsl(270_95%_60%/0.5)]"
              >
                <Share2 className="h-4 w-4" /> Share this story
              </button>
            </div>
          </div>
        </section>

        {/* One-line summary */}
        <p className="mt-12 font-display text-2xl sm:text-3xl leading-snug text-foreground/95 animate-fade-in-up" dir={language === 'he' ? 'rtl' : 'ltr'}>
          "{content?.shortSummary}"
        </p>

        {/* The story */}
        <section className="mt-10 glass-card rounded-3xl p-6 sm:p-8 animate-fade-in-up" dir={language === 'he' ? 'rtl' : 'ltr'}>
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{language === 'he' ? 'הסיפור' : 'The story'}</p>
          <p className="mt-3 text-base sm:text-lg leading-relaxed text-foreground/90">
            {content?.storyExplanation}
          </p>
        </section>

        {/* Themes + tone */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="glass-card rounded-3xl p-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{language === 'he' ? 'נושאים מרכזיים' : 'Main themes'}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {content?.themes.map((t) => (
                <span key={t} className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs capitalize text-foreground/90">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-3xl p-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{language === 'he' ? 'גוון רגשי' : 'Emotional tone'}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {content?.emotionalTone.map((t) => (
                <span key={t} className={`rounded-full border border-white/10 bg-gradient-to-br ${toneColor(t)} px-3 py-1 text-xs capitalize text-foreground/95`}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Pull quote */}
        <section className="my-12 relative" dir={language === 'he' ? 'rtl' : 'ltr'}>
          <div className="absolute -inset-x-6 -inset-y-4 rounded-[2rem] bg-gradient-brand-soft blur-2xl" aria-hidden />
          <blockquote className="relative font-display text-3xl sm:text-5xl leading-tight">
            <span className="gradient-brand-text">"{content?.memorableLine}"</span>
          </blockquote>
        </section>

        {/* Why it hits + interpretation */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card rounded-3xl p-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{language === 'he' ? 'למה השיר פוגע' : 'Why this song hits'}</p>
            <p className="mt-3 text-base leading-relaxed text-foreground/90">{content?.whyItConnects}</p>
          </div>
          <div className="glass-card rounded-3xl p-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{language === 'he' ? 'פרשנות אפשרית' : 'Possible interpretation'}</p>
            <p className="mt-3 text-base leading-relaxed text-foreground/90">{content?.interpretation}</p>
          </div>
        </section>

        {/* CTAs */}
        <section className="mt-12 hidden sm:flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => setShare(true)} className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-3 text-sm font-semibold text-white shadow-[0_0_30px_hsl(270_95%_60%/0.5)]">
            <Share2 className="h-4 w-4" /> Share this story
          </button>
          <Link to="/detect" className="inline-flex items-center gap-2 rounded-full glass-card px-5 py-3 text-sm font-medium">
            <Sparkles className="h-4 w-4" /> Storyzam another song
          </Link>
        </section>
      </main>

      <Footer />

      {/* Sticky mobile bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 sm:hidden">
        <div className="mx-auto max-w-md p-4">
          <div className="glass-card flex items-center gap-2 rounded-full p-1.5">
            <button onClick={() => setShare(true)} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-white">
              <Share2 className="h-4 w-4" /> Share
            </button>
            <Link to="/detect" className="flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium">
              <Sparkles className="h-4 w-4" /> New
            </Link>
          </div>
        </div>
      </div>

      <ShareCardModal open={share} onClose={() => setShare(false)} song={song} />
    </div>
  );
};

export default Result;
