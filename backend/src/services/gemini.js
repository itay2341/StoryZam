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
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-pro'
    });
    
    const prompt = `You are a music critic and cultural analyst with access to comprehensive music databases. Analyze the song "${songInfo.title}" by ${songInfo.artist} with deep insight and passion.

${songInfo.album ? `Album: "${songInfo.album}"` : ''}
${songInfo.releaseDate ? `Released: ${songInfo.releaseDate}` : ''}
${songInfo.genres && songInfo.genres.length > 0 ? `Genres: ${songInfo.genres.join(', ')}` : ''}

CRITICAL TASK: You need to provide analysis based on the ACTUAL LYRICS of this song.
Use your knowledge base to recall or reference the complete lyrics for "${songInfo.title}" by ${songInfo.artist}.
If you know this song, include specific lyrical references, quotes, and patterns in your analysis.

ANALYSIS REQUIREMENTS:
1. Reference the song's ACTUAL lyrics in your analysis (if you know them)
2. Look for wordplay, repetition, metaphors, and poetic devices in the lyrics
3. Quote specific memorable lines or phrases from the song
4. Consider cultural, religious, or historical context
5. Identify what makes this song unique or memorable based on the actual words
6. Be specific about artistic choices in the lyrics and their impact
7. If the song is in Hebrew, Arabic, or another language, analyze how the language itself contributes to meaning
8. Find connections between the title, chorus, verses, and themes
9. Explain why certain words or phrases repeat and what they mean
10. If lyrics are in a non-English language, provide context for English speakers while preserving the nuances

You MUST respond with ONLY a valid JSON object (no markdown, no code blocks, no explanations). Use this exact structure with BOTH English and Hebrew translations:

{
  "en": {
    "shortSummary": "One poetic, evocative sentence (12-16 words) that captures the song's essence and feeling",
    "storyExplanation": "2-4 sentences about the story behind the song. Include: Why was it written? What inspired it? What was happening in the artist's life or the world? Be specific with details, not generic.",
    "themes": ["theme1", "theme2", "theme3"],  // 3-6 single-word lowercase themes that are SPECIFIC to this song
    "emotionalTone": ["tone1", "tone2", "tone3"],  // 3-5 precise mood descriptors that capture THIS song's unique feeling
    "interpretation": "2-3 sentences explaining what the song means. Include: What do the lyrics say? What patterns or wordplay exist? What is the deeper message? Be specific about the actual content.",
    "whyItConnects": "2-3 sentences explaining why people connect with this song. Include: What universal emotion does it tap into? What makes it relatable? What cultural or personal significance does it have?",
    "memorableLine": "One powerful, quotable sentence about THIS specific song - something insightful that reveals what makes it special. Not generic - make it about the unique artistic choices or meaning in THIS song.",
    "shareCardText": "A punchy, intriguing one-liner (60-80 chars) that makes someone want to listen. Be poetic and specific, not generic."
  },
  "he": {
    "shortSummary": "משפט פואטי ומעורר רגש (12-16 מילים) שתופס את המהות והתחושה של השיר",
    "storyExplanation": "2-4 משפטים על הסיפור מאחורי השיר. כלול: למה נכתב? מה היווה השראה? מה קרה בחיי האמן או בעולם? היה ספציפי עם פרטים, לא כללי.",
    "themes": ["נושא1", "נושא2", "נושא3"],  // 3-6 מילים בודדות באותיות קטנות שספציפיות לשיר הזה
    "emotionalTone": ["גוון1", "גוון2", "גוון3"],  // 3-5 תיאורי מצב רוח מדויקים שתופסים את התחושה הייחודית של השיר
    "interpretation": "2-3 משפטים שמסבירים מה השיר אומר. כלול: מה המילים אומרות? אילו דפוסים או משחקי מילים קיימים? מה המסר העמוק? היה ספציפי לגבי התוכן האמיתי.",
    "whyItConnects": "2-3 משפטים שמסבירים למה אנשים מתחברים לשיר הזה. כלול: איזו רגש אוניברסלי השיר נוגע? מה עושה אותו רלוונטי? איזו משמעות תרבותית או אישית יש לו?",
    "memorableLine": "משפט אחד חזק וציטוטי על השיר הספציפי הזה - משהו מעמיק שמגלה מה עושה אותו מיוחד. לא כללי - עשה אותו על הבחירות האמנותיות הייחודיות או המשמעות בשיר הזה.",
    "shareCardText": "שורה אחת נוקבת ומסקרנת (60-80 תווים) שגורמת למישהו לרצות להקשיב. היה פואטי וספציפי, לא כללי."
  }
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
      // Validate that both 'en' and 'he' keys exist
      if (!structured.en || !structured.he) {
        throw new Error('Missing language keys in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON response:', text);
      // Fallback to basic structure if JSON parsing fails
      const fallback = {
        shortSummary: `${songInfo.title} by ${songInfo.artist}`,
        storyExplanation: `A song that showcases ${songInfo.artist}'s unique artistic vision.`,
        themes: ['music', 'emotion', 'expression'],
        emotionalTone: ['expressive', 'moving'],
        interpretation: `${songInfo.title} explores themes that resonate with listeners.`,
        whyItConnects: 'This song resonates with listeners through its authentic expression and emotional depth.',
        memorableLine: `${songInfo.title} captures something profound in its musical and lyrical composition.`,
        shareCardText: `${songInfo.title} - ${songInfo.artist}`
      };
      structured = {
        en: fallback,
        he: {
          shortSummary: `${songInfo.title} מאת ${songInfo.artist}`,
          storyExplanation: `שיר המציג את החזון האמנותי הייחודי של ${songInfo.artist}.`,
          themes: ['מוזיקה', 'רגש', 'ביטוי'],
          emotionalTone: ['מבעה', 'מרגש'],
          interpretation: `${songInfo.title} חוקר נושאים שמהדהדים עם מאזינים.`,
          whyItConnects: 'השיר הזה מהדהד עם מאזינים דרך הביטוי האותנטי והעומק הרגשי שלו.',
          memorableLine: `${songInfo.title} לוכד משהו עמוק בהרכב המוזיקלי והמילולי שלו.`,
          shareCardText: `${songInfo.title} - ${songInfo.artist}`
        }
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
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash'
    });
    
    const prompt = `Search for information about "${songInfo.title}" by ${songInfo.artist} and write a brief 2-3 sentence summary about what the song is about and why it's notable.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Quick Summary Error:', error.message);
    return `${songInfo.title} by ${songInfo.artist}`;
  }
}
