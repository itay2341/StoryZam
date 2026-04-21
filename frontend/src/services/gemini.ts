import type { SongStory } from "@/types/song";
import type { RecognizedSong } from "@/services/recognition";
import { getLastRecognitionResult } from "@/services/recognition";

/**
 * Transform backend analysis to frontend SongStory format.
 * 
 * Note: The backend returns a different structure (story, meaning, impact, style, facts)
 * than what the frontend expects (shortSummary, themes, emotionalTone, etc.).
 * This function does a best-effort transformation.
 * 
 * For optimal results, consider updating the backend to match the frontend schema.
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

  // Transform backend structure to frontend structure
  // This is a best-effort transformation. For better results, update the backend
  // to return the exact structure the frontend expects.
  
  // Extract themes from genres and style (simple extraction)
  const genres = result.song.genres || [];
  const themes = extractThemes(structured.story + " " + structured.meaning);
  
  // Extract emotional tones from the text
  const emotionalTone = extractEmotionalTone(structured.meaning + " " + structured.style);
  
  // Create a memorable line from the meaning
  const memorableLine = extractMemorableLine(structured.meaning);
  
  return {
    id: `${song.title}-${song.artist}`.toLowerCase().replace(/\s+/g, "-"),
    title: song.title,
    artist: song.artist,
    album: song.album,
    year: song.year,
    genre: genres[0] || result.song.genres?.[0],
    confidence: song.confidence,
    coverImage: song.coverImage ?? "",
    
    // Transform backend fields to frontend fields
    shortSummary: truncate(structured.meaning, 100),
    storyExplanation: structured.story,
    themes: themes,
    emotionalTone: emotionalTone,
    interpretation: structured.meaning,
    whyItConnects: structured.impact,
    memorableLine: memorableLine,
    shareCardText: truncate(structured.meaning, 80),
  };
}

// Helper functions for text extraction and transformation

function extractThemes(text: string): string[] {
  // Common theme keywords to look for
  const themeKeywords = [
    'love', 'heartbreak', 'loss', 'hope', 'freedom', 'nostalgia',
    'longing', 'memory', 'youth', 'rebellion', 'identity', 'pain',
    'joy', 'solitude', 'friendship', 'courage', 'struggle', 'triumph'
  ];
  
  const found = themeKeywords.filter(theme => 
    text.toLowerCase().includes(theme)
  ).slice(0, 6);
  
  return found.length > 0 ? found : ['music', 'emotion', 'expression'];
}

function extractEmotionalTone(text: string): string[] {
  // Common emotional tone keywords
  const toneKeywords = [
    'melancholic', 'hopeful', 'joyful', 'sad', 'uplifting', 'dark',
    'energetic', 'calm', 'intense', 'tender', 'angry', 'peaceful',
    'wistful', 'defiant', 'dreamy', 'intimate', 'warm', 'cinematic'
  ];
  
  const found = toneKeywords.filter(tone => 
    text.toLowerCase().includes(tone)
  ).slice(0, 5);
  
  return found.length > 0 ? found : ['emotional', 'expressive', 'moving'];
}

function extractMemorableLine(text: string): string {
  // Try to extract the first impactful sentence
  const sentences = text.split(/[.!?]/).map(s => s.trim()).filter(s => s.length > 20);
  return sentences[0] || text.substring(0, 100);
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}
