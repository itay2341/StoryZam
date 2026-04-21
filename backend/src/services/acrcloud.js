import axios from 'axios';
import FormData from 'form-data';
import { config } from '../config/config.js';
import { generateSignature } from '../utils/crypto.js';

/**
 * Recognize a song from audio buffer using ACRCloud API
 * @param {Buffer} audioBuffer - Audio file buffer
 * @returns {Promise<Object>} Song information
 */
export async function recognizeSong(audioBuffer) {
  try {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const { host, accessKey, accessSecret } = config.acrcloud;
    
    // Generate signature for authentication
    const signature = generateSignature(accessKey, accessSecret, timestamp);
    
    // Create form data
    const formData = new FormData();
    formData.append('sample', audioBuffer, {
      filename: 'audio.mp3',
      contentType: 'audio/mpeg',
    });
    formData.append('access_key', accessKey);
    formData.append('data_type', 'audio');
    formData.append('signature_version', '1');
    formData.append('signature', signature);
    formData.append('sample_bytes', audioBuffer.length.toString());
    formData.append('timestamp', timestamp);
    
    // Make request to ACRCloud
    const response = await axios.post(
      `https://${host}/v1/identify`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 10000, // 10 second timeout
      }
    );
    
    const result = response.data;
    
    // Check if song was recognized
    if (result.status.code !== 0) {
      throw new Error(result.status.msg || 'Song recognition failed');
    }
    
    // Extract song information
    if (!result.metadata || !result.metadata.music || result.metadata.music.length === 0) {
      return {
        found: false,
        message: 'No song found. Try recording a clearer audio sample.',
      };
    }
    
    const music = result.metadata.music[0];
    
    // Extract detailed information
    const songInfo = {
      found: true,
      title: music.title,
      artist: music.artists ? music.artists.map(a => a.name).join(', ') : 'Unknown Artist',
      album: music.album?.name || null,
      releaseDate: music.release_date || null,
      genres: music.genres?.map(g => g.name) || [],
      label: music.label || null,
      duration: music.duration_ms ? Math.floor(music.duration_ms / 1000) : null,
      isrc: music.external_ids?.isrc || null,
      spotify: music.external_metadata?.spotify ? {
        id: music.external_metadata.spotify.track?.id,
        url: `https://open.spotify.com/track/${music.external_metadata.spotify.track?.id}`,
      } : null,
      youtube: music.external_metadata?.youtube ? {
        id: music.external_metadata.youtube.vid,
        url: `https://www.youtube.com/watch?v=${music.external_metadata.youtube.vid}`,
      } : null,
      deezer: music.external_metadata?.deezer ? {
        id: music.external_metadata.deezer.track?.id,
        url: `https://www.deezer.com/track/${music.external_metadata.deezer.track?.id}`,
      } : null,
      score: music.score, // Confidence score (0-100)
    };
    
    return songInfo;
  } catch (error) {
    console.error('ACRCloud Recognition Error:', error.message);
    
    if (error.response) {
      throw new Error(`ACRCloud API Error: ${error.response.data?.status?.msg || error.message}`);
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Recognition timeout. Please try again.');
    }
    
    throw new Error(`Song recognition failed: ${error.message}`);
  }
}
