import express from 'express';
import { upload } from '../middleware/upload.js';
import {
  recognizeAndAnalyze,
  recognizeOnly,
  healthCheck,
} from '../controllers/songController.js';

const router = express.Router();

/**
 * POST /api/songs/recognize
 * Main endpoint - Recognize song and get full analysis
 * 
 * Request: multipart/form-data with 'audio' field
 * Response: {
 *   success: boolean,
 *   found: boolean,
 *   song: { title, artist, album, ... },
 *   analysis: { analysis, structured, ... }
 * }
 */
router.post('/recognize', upload.single('audio'), recognizeAndAnalyze);

/**
 * POST /api/songs/identify
 * Quick endpoint - Recognize song with brief summary (faster)
 * 
 * Request: multipart/form-data with 'audio' field
 * Response: {
 *   success: boolean,
 *   found: boolean,
 *   song: { title, artist, album, ... },
 *   summary: string
 * }
 */
router.post('/identify', upload.single('audio'), recognizeOnly);

/**
 * GET /api/songs/health
 * Check if all services are configured correctly
 */
router.get('/health', healthCheck);

export default router;
