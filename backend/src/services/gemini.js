import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/config.js';
import { fetchLyrics, cleanLyrics } from './lyrics.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

/**
 * Analyze a song and generate its story, meaning, and context
 * @param {Object} songInfo - Song information from recognition
 * @returns {Promise<Object>} Song analysis
 */
export async function analyzeSong(songInfo) {
  try {
    // Try to fetch lyrics
    const lyrics = await fetchLyrics(songInfo.title, songInfo.artist);
    const cleanedLyrics = cleanLyrics(lyrics);
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-pro'
    });
    
    const lyricsSection = cleanedLyrics 
      ? `\n\nLYRICS:\n${cleanedLyrics}\n\nAnalyze these lyrics deeply - look for patterns, repetitions, wordplay, metaphors, and linguistic beauty.`
      : `\n\nNote: Lyrics not available. Please use your knowledge of this song's lyrics and meaning to provide analysis. If you know the lyrics, reference specific lines, phrases, or patterns.`;
    
    const prompt = `You are a music critic and cultural analyst. Analyze the song "${songInfo.title}" by ${songInfo.artist} with deep insight and passion.

${songInfo.album ? `Album: "${songInfo.album}"` : ''}
${songInfo.releaseDate ? `Released: ${songInfo.releaseDate}` : ''}
${songInfo.genres && songInfo.genres.length > 0 ? `Genres: ${songInfo.genres.join(', ')}` : ''}${lyricsSection}

IMPORTANT INSTRUCTIONS:
1. Research the song's lyrics, language, and linguistic patterns
2. Look for wordplay, repetition, metaphors, and poetic devices
3. Consider cultural, religious, or historical context
4. Identify what makes this song unique or memorable
5. Be specific about artistic choices and their impact
6. If the song is in Hebrew, Arabic, or another language, analyze how the language itself contributes to meaning
7. Find connections between the title, lyrics, and themes
8. Explain why certain words or phrases repeat and what they mean
9. If you know specific lyrics, quote or reference them to support your analysis

You MUST respond with ONLY a valid JSON object (no markdown, no code blocks, no explanations). Use this exact structure:

{
  "shortSummary": "One poetic, evocative sentence (12-16 words) that captures the song's essence and feeling",
  "storyExplanation": "2-4 sentences about the story behind the song. Include: Why was it written? What inspired it? What was happening in the artist's life or the world? Be specific with details, not generic.",
  "themes": ["theme1", "theme2", "theme3"],  // 3-6 single-word lowercase themes that are SPECIFIC to this song
  "emotionalTone": ["tone1", "tone2", "tone3"],  // 3-5 precise mood descriptors that capture THIS song's unique feeling
  "interpretation": "2-3 sentences explaining what the song means. Include: What do the lyrics say? What patterns or wordplay exist? What is the deeper message? Be specific about the actual content.",
  "whyItConnects": "2-3 sentences explaining why people connect with this song. Include: What universal emotion does it tap into? What makes it relatable? What cultural or personal significance does it have?",
  "memorableLine": "One powerful, quotable sentence about THIS specific song - something insightful that reveals what makes it special. Not generic - make it about the unique artistic choices or meaning in THIS song.",
  "shareCardText": "A punchy, intriguing one-liner (60-80 chars) that makes someone want to listen. Be poetic and specific, not generic."
}

QUALITY STANDARDS:
- NO generic statements like "this is a powerful song" - be SPECIFIC
- Include actual details about lyrics, language, or patterns when possible
- Make interpretations based on real cultural/historical context
- The memorableLine should be insightful and unique to THIS song
- Themes should be specific (e.g., "faith" not just "emotion", "tradition" not just "culture")
- Write like a passionate music critic who loves this song

Example of BAD generic response: "This powerful song explores deep emotions"
Example of GOOD specific response: "The triple repetition of 'Amen' transforms a prayer's ending into a desperate plea for meaning"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up response - remove markdown code blocks if present
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Parse the JSON response
    let structured;
    try {
      structured = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON response:', text);
      // Fallback to basic structure if JSON parsing fails
      structured = {
        shortSummary: `${songInfo.title} by ${songInfo.artist}`,
        storyExplanation: `A song that showcases ${songInfo.artist}'s unique artistic vision.`,
        themes: ['music', 'emotion', 'expression'],
        emotionalTone: ['expressive', 'moving'],
        interpretation: `${songInfo.title} explores themes that resonate with listeners.`,
        whyItConnects: 'This song resonates with listeners through its authentic expression and emotional depth.',
        memorableLine: `${songInfo.title} captures something profound in its musical and lyrical composition.`,
        shareCardText: `${songInfo.title} - ${songInfo.artist}`
      };
    }
    
    return {
      success: true,
      songTitle: songInfo.title,
      artist: songInfo.artist,
      structured: structured,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Gemini Analysis Error:', error.message);
    
    if (error.message?.includes('API_KEY')) {
      throw new Error('Invalid Gemini API key. Please check your configuration.');
    }
    
    throw new Error(`Song analysis failed: ${error.message}`);
  }
}



/**
 * Generate a quick summary of a song
 * @param {Object} songInfo - Song information
 * @returns {Promise<string>} Brief summary
 */
export async function generateQuickSummary(songInfo) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `Write a brief 2-3 sentence summary about the song "${songInfo.title}" by ${songInfo.artist}. Focus on what the song is about and why it's notable.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Quick Summary Error:', error.message);
    return `${songInfo.title} by ${songInfo.artist}`;
  }
}
