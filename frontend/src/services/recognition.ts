import { API_ENDPOINTS } from "@/config/api";

export interface RecognizedSong {
  title: string;
  artist: string;
  album?: string;
  year?: number;
  confidence: number;
  coverImage?: string;
}

interface BackendRecognitionResponse {
  success: boolean;
  found: boolean;
  song: {
    title: string;
    artist: string;
    album?: string;
    releaseDate?: string;
    genres?: string[];
    duration?: number;
    spotify?: { id: string; url: string };
    youtube?: { id: string; url: string };
    score: number;
  };
  analysis?: {
    success: boolean;
    songTitle: string;
    artist: string;
    structured: {
      en: {
        shortSummary: string;
        storyExplanation: string;
        themes: string[];
        emotionalTone: string[];
        interpretation: string;
        whyItConnects: string;
        memorableLine: string;
        shareCardText: string;
      };
      he: {
        shortSummary: string;
        storyExplanation: string;
        themes: string[];
        emotionalTone: string[];
        interpretation: string;
        whyItConnects: string;
        memorableLine: string;
        shareCardText: string;
      };
    };
    generatedAt: string;
  };
  timestamp: string;
}

// Cache the last recognition result for use by analyzeSongMeaning
let lastRecognitionResult: BackendRecognitionResponse | null = null;

export function getLastRecognitionResult(): BackendRecognitionResponse | null {
  return lastRecognitionResult;
}

/**
 * Recognize a song from audio using the Storyzam backend.
 * Calls ACRCloud + Gemini AI for full song recognition and analysis.
 */
export async function recognizeSong(audio: Blob): Promise<RecognizedSong> {
  const formData = new FormData();
  formData.append('audio', audio, 'recording.mp3');

  const response = await fetch(API_ENDPOINTS.recognize, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Song recognition failed');
  }

  const result: BackendRecognitionResponse = await response.json();

  if (!result.success || !result.found) {
    throw new Error('Song not found. Try recording a clearer audio sample.');
  }

  // Cache the full result for analysis
  lastRecognitionResult = result;

  // Extract year from releaseDate if available
  const year = result.song.releaseDate
    ? new Date(result.song.releaseDate).getFullYear()
    : undefined;

  // Use a placeholder cover image (could be enhanced with Spotify API later)
  const coverImage = result.song.spotify?.url
    ? `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900&auto=format&fit=crop`
    : `https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop`;

  return {
    title: result.song.title,
    artist: result.song.artist,
    album: result.song.album,
    year,
    confidence: result.song.score,
    coverImage,
  };
}
