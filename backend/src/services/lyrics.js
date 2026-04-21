import axios from 'axios';

/**
 * Attempt to fetch lyrics for a song from various sources
 * @param {string} title - Song title
 * @param {string} artist - Artist name
 * @returns {Promise<string|null>} Lyrics or null if not found
 */
export async function fetchLyrics(title, artist) {
  try {
    // Try Genius API (you can add API key in .env if you get one)
    // For now, we'll use Gemini's knowledge to get lyrics context
    // TODO: Add actual lyrics API integration (Genius, Musixmatch, etc.)
    
    return null; // Return null for now, will be handled by Gemini
  } catch (error) {
    console.warn('Lyrics fetch failed:', error.message);
    return null;
  }
}

/**
 * Clean and format lyrics for analysis
 * @param {string} lyrics - Raw lyrics text
 * @returns {string} Cleaned lyrics
 */
export function cleanLyrics(lyrics) {
  if (!lyrics) return '';
  
  return lyrics
    .replace(/\[.*?\]/g, '') // Remove [Verse], [Chorus] tags
    .replace(/\r\n/g, '\n')   // Normalize line breaks
    .trim();
}
