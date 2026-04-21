import { recognizeSong } from '../services/acrcloud.js';
import { analyzeSong, generateQuickSummary } from '../services/gemini.js';

/**
 * Recognize a song from uploaded audio and analyze it with Gemini
 */
export async function recognizeAndAnalyze(req, res) {
  try {
    // Check if audio file was uploaded
    if (!req.file) {
      return res.status(400).json({
        error: 'No audio file provided',
        message: 'Please upload an audio file',
      });
    }
    
    console.log(`📤 Received audio file: ${req.file.originalname} (${Math.round(req.file.size / 1024)}KB)`);
    
    // Step 1: Recognize the song using ACRCloud
    console.log('🔍 Recognizing song...');
    const songInfo = await recognizeSong(req.file.buffer);
    
    if (!songInfo.found) {
      return res.status(404).json({
        success: false,
        found: false,
        message: songInfo.message,
      });
    }
    
    console.log(`✅ Song recognized: "${songInfo.title}" by ${songInfo.artist}`);
    
    // Step 2: Analyze the song with Gemini AI
    console.log('🤖 Analyzing song with Gemini AI...');
    const analysis = await analyzeSong(songInfo);
    
    console.log('✅ Analysis complete');
    
    // Step 3: Return combined result
    return res.json({
      success: true,
      found: true,
      song: songInfo,
      analysis: analysis,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Recognition Error:', error.message);
    
    return res.status(500).json({
      success: false,
      error: 'Recognition failed',
      message: error.message,
    });
  }
}

/**
 * Health check for song recognition service
 */
export async function healthCheck(req, res) {
  try {
    // Check if required environment variables are set
    const { config } = await import('../config/config.js');
    
    const checks = {
      acrcloud: !!config.acrcloud.accessKey && !!config.acrcloud.accessSecret,
      gemini: !!config.gemini.apiKey,
    };
    
    const allHealthy = Object.values(checks).every(check => check);
    
    res.json({
      status: allHealthy ? 'healthy' : 'degraded',
      services: checks,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
}

/**
 * Quick song info (recognition only, no analysis)
 */
export async function recognizeOnly(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No audio file provided',
        message: 'Please upload an audio file',
      });
    }
    
    console.log(`📤 Received audio file: ${req.file.originalname}`);
    console.log('🔍 Recognizing song...');
    
    const songInfo = await recognizeSong(req.file.buffer);
    
    if (!songInfo.found) {
      return res.status(404).json({
        success: false,
        found: false,
        message: songInfo.message,
      });
    }
    
    console.log(`✅ Song recognized: "${songInfo.title}" by ${songInfo.artist}`);
    
    // Get a quick summary instead of full analysis
    const summary = await generateQuickSummary(songInfo);
    
    return res.json({
      success: true,
      found: true,
      song: songInfo,
      summary: summary,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Recognition Error:', error.message);
    
    return res.status(500).json({
      success: false,
      error: 'Recognition failed',
      message: error.message,
    });
  }
}
