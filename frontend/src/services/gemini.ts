import type { SongStory } from "@/types/song";
import type { RecognizedSong } from "@/services/recognition";
import { getLastRecognitionResult } from "@/services/recognition";

/**
 * Create a SongStory object from backend recognition result.
 * The backend now returns the exact structure we need from Gemini.
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

  // The backend now returns exactly what we need!
  return {
    id: `${song.title}-${song.artist}`.toLowerCase().replace(/\s+/g, "-"),
    title: song.title,
    artist: song.artist,
    album: song.album,
    year: song.year,
    genre: result.song.genres?.[0],
    confidence: song.confidence,
    coverImage: song.coverImage ?? "",
    
    // Use the structured data directly from the backend
    shortSummary: structured.shortSummary,
    storyExplanation: structured.storyExplanation,
    themes: structured.themes,
    emotionalTone: structured.emotionalTone,
    interpretation: structured.interpretation,
    whyItConnects: structured.whyItConnects,
    memorableLine: structured.memorableLine,
    shareCardText: structured.shareCardText,
  };
}

