import type { SongStory } from "@/types/song";
import type { RecognizedSong } from "@/services/recognition";
import { getLastRecognitionResult } from "@/services/recognition";

/**
 * Create a SongStory object from backend recognition result.
 * The backend now returns bilingual analysis (English and Hebrew).
 */
export async function analyzeSongMeaning(
  song: RecognizedSong,
  _lyricsOrContext?: string,
): Promise<SongStory> {
  // Get the cached recognition result from the backend
  const result = getLastRecognitionResult();
  
  if (!result?.analysis) {
    throw new Error("No analysis data available. Recognition may have failed.");
  }

  const { analysis } = result;
  const { structured } = analysis;

  // The backend now returns bilingual data with 'en' and 'he' keys
  return {
    id: `${song.title}-${song.artist}`.toLowerCase().replace(/\s+/g, "-"),
    title: song.title,
    artist: song.artist,
    album: song.album,
    year: song.year,
    genre: result.song.genres?.[0],
    confidence: song.confidence,
    coverImage: song.coverImage ?? "",
    
    // English version (default)
    shortSummary: structured.en.shortSummary,
    storyExplanation: structured.en.storyExplanation,
    themes: structured.en.themes,
    emotionalTone: structured.en.emotionalTone,
    interpretation: structured.en.interpretation,
    whyItConnects: structured.en.whyItConnects,
    memorableLine: structured.en.memorableLine,
    shareCardText: structured.en.shareCardText,
    
    // Hebrew version
    he: {
      shortSummary: structured.he.shortSummary,
      storyExplanation: structured.he.storyExplanation,
      themes: structured.he.themes,
      emotionalTone: structured.he.emotionalTone,
      interpretation: structured.he.interpretation,
      whyItConnects: structured.he.whyItConnects,
      memorableLine: structured.he.memorableLine,
      shareCardText: structured.he.shareCardText,
    },
  };
}

