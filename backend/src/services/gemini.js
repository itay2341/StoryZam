import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/config.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

/**
 * Analyze a song and generate its story, meaning, and context
 * @param {Object} songInfo - Song information from recognition
 * @returns {Promise<Object>} Song analysis
 */
export async function analyzeSong(songInfo) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    
    const prompt = `Analyze the song "${songInfo.title}" by ${songInfo.artist}.

Please provide a comprehensive analysis including:

1. **Story Behind the Song**: The history, inspiration, and circumstances that led to the creation of this song. Include any known stories about its writing, recording, or release.

2. **Meaning and Themes**: What the song is about, its main themes, and the message the artist was trying to convey.

3. **Cultural Impact**: How the song was received, its influence on music or culture, and any significant achievements or milestones.

4. **Musical Style and Tone**: Describe the musical characteristics, genre, mood, and emotional tone of the song.

5. **Interesting Facts**: Any notable trivia, covers, samples, or interesting details about the song.

${songInfo.album ? `The song is from the album "${songInfo.album}".` : ''}
${songInfo.releaseDate ? `It was released on ${songInfo.releaseDate}.` : ''}
${songInfo.genres && songInfo.genres.length > 0 ? `Genres: ${songInfo.genres.join(', ')}.` : ''}

Please provide detailed, engaging, and well-researched information. If some information is not available or you're uncertain, please state that clearly. Format the response in a clear, readable way with proper sections.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response to extract sections
    const analysis = parseAnalysisText(text);
    
    return {
      success: true,
      songTitle: songInfo.title,
      artist: songInfo.artist,
      analysis: text,
      structured: analysis,
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
 * Parse the analysis text into structured sections
 * @param {string} text - Raw analysis text
 * @returns {Object} Structured analysis
 */
function parseAnalysisText(text) {
  const sections = {
    story: '',
    meaning: '',
    impact: '',
    style: '',
    facts: '',
  };
  
  // Try to extract sections based on common patterns
  const storyMatch = text.match(/(?:\*\*)?Story Behind.*?(?:\*\*)?\s*:?\s*([\s\S]*?)(?=(?:\*\*)?Meaning|$)/i);
  const meaningMatch = text.match(/(?:\*\*)?Meaning.*?(?:\*\*)?\s*:?\s*([\s\S]*?)(?=(?:\*\*)?Cultural|Musical|$)/i);
  const impactMatch = text.match(/(?:\*\*)?Cultural Impact.*?(?:\*\*)?\s*:?\s*([\s\S]*?)(?=(?:\*\*)?Musical|Interesting|$)/i);
  const styleMatch = text.match(/(?:\*\*)?Musical.*?(?:\*\*)?\s*:?\s*([\s\S]*?)(?=(?:\*\*)?Interesting|$)/i);
  const factsMatch = text.match(/(?:\*\*)?Interesting.*?(?:\*\*)?\s*:?\s*([\s\S]*?)$/i);
  
  if (storyMatch) sections.story = storyMatch[1].trim();
  if (meaningMatch) sections.meaning = meaningMatch[1].trim();
  if (impactMatch) sections.impact = impactMatch[1].trim();
  if (styleMatch) sections.style = styleMatch[1].trim();
  if (factsMatch) sections.facts = factsMatch[1].trim();
  
  return sections;
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
