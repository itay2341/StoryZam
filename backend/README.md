# Storyzam Backend API 🎵

A powerful backend API that recognizes songs from audio files and provides detailed analysis including the story, meaning, and cultural context using AI.

## Features ✨

- **Song Recognition**: Identify songs from short audio clips (like Shazam)
- **AI-Powered Analysis**: Get detailed song stories, meanings, and context using Google Gemini AI
- **Multiple Recognition Services**: Built with ACRCloud for accurate song fingerprinting
- **Rich Metadata**: Access song information including artist, album, release date, genres, and streaming links
- **Fast & Reliable**: Optimized for quick responses with proper error handling

## Tech Stack 🛠️

- **Node.js** with Express.js
- **ACRCloud API** - Song recognition/fingerprinting
- **Google Gemini AI** - Story and meaning analysis
- **Multer** - Audio file handling

## Prerequisites 📋

Before you begin, you need to obtain API keys from:

1. **ACRCloud** (for song recognition)
   - Sign up at [https://www.acrcloud.com/](https://www.acrcloud.com/)
   - Create a project and get your Access Key and Access Secret
   - Free tier: 3,000 recognitions/month

2. **Google Gemini AI** (for song analysis)
   - Get your API key at [https://ai.google.dev/](https://ai.google.dev/)
   - Free tier available

## Installation 🚀

1. **Clone or navigate to the project directory**
   ```bash
   cd storyzam
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   copy .env.example .env
   ```

4. **Edit the `.env` file with your API keys**
   ```env
   PORT=3000
   
   # ACRCloud Configuration
   ACRCLOUD_HOST=identify-eu-west-1.acrcloud.com
   ACRCLOUD_ACCESS_KEY=your_access_key_here
   ACRCLOUD_ACCESS_SECRET=your_access_secret_here
   
   # Google Gemini API
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints 📡

### 1. Recognize and Analyze Song (Full)

**POST** `/api/songs/recognize`

Upload an audio file and get complete song information with AI-generated analysis.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `audio` field with audio file

**Response:**
```json
{
  "success": true,
  "found": true,
  "song": {
    "title": "Song Title",
    "artist": "Artist Name",
    "album": "Album Name",
    "releaseDate": "2020-01-01",
    "genres": ["Pop", "Rock"],
    "duration": 240,
    "spotify": {
      "id": "spotify_id",
      "url": "https://open.spotify.com/track/..."
    },
    "youtube": {
      "id": "youtube_id",
      "url": "https://www.youtube.com/watch?v=..."
    },
    "score": 95
  },
  "analysis": {
    "success": true,
    "songTitle": "Song Title",
    "artist": "Artist Name",
    "analysis": "Full AI-generated analysis text...",
    "structured": {
      "story": "The story behind the song...",
      "meaning": "What the song means...",
      "impact": "Cultural impact...",
      "style": "Musical style...",
      "facts": "Interesting facts..."
    },
    "generatedAt": "2024-01-01T12:00:00.000Z"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. Quick Song Identification

**POST** `/api/songs/identify`

Faster endpoint that returns song info with a brief summary (no full analysis).

**Request:** Same as `/recognize`

**Response:**
```json
{
  "success": true,
  "found": true,
  "song": { /* same as above */ },
  "summary": "Brief 2-3 sentence summary of the song",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 3. Health Check

**GET** `/api/songs/health`

Check if all services are properly configured.

**Response:**
```json
{
  "status": "healthy",
  "services": {
    "acrcloud": true,
    "gemini": true
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 4. Root Health Check

**GET** `/health`

Simple health check for the API.

## Testing the API 🧪

### Using cURL

```bash
# Test with an audio file
curl -X POST http://localhost:3000/api/songs/recognize \
  -F "audio=@path/to/your/song.mp3"

# Quick identification
curl -X POST http://localhost:3000/api/songs/identify \
  -F "audio=@path/to/your/song.mp3"

# Health check
curl http://localhost:3000/api/songs/health
```

### Using Postman

1. Create a new POST request to `http://localhost:3000/api/songs/recognize`
2. Go to Body → form-data
3. Add a key named `audio` with type `File`
4. Upload an audio file
5. Send the request

### Using JavaScript (Fetch)

```javascript
const audioFile = document.getElementById('audioInput').files[0];
const formData = new FormData();
formData.append('audio', audioFile);

const response = await fetch('http://localhost:3000/api/songs/recognize', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
console.log(result);
```

## Supported Audio Formats 🎧

- MP3 (.mp3)
- WAV (.wav)
- AAC (.aac)
- OGG (.ogg)
- FLAC (.flac)
- M4A (.m4a)

**Note:** Audio clips should be at least 5-10 seconds for best recognition results.

## Error Handling ⚠️

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request` - Invalid or missing audio file
- `404 Not Found` - Song not recognized
- `500 Internal Server Error` - Server or API errors

Example error response:
```json
{
  "success": false,
  "error": "Recognition failed",
  "message": "No song found. Try recording a clearer audio sample."
}
```

## Project Structure 📁

```
storyzam/
├── src/
│   ├── config/
│   │   └── config.js          # Environment configuration
│   ├── controllers/
│   │   └── songController.js  # Request handlers
│   ├── middleware/
│   │   └── upload.js          # File upload middleware
│   ├── routes/
│   │   └── songRoutes.js      # API routes
│   ├── services/
│   │   ├── acrcloud.js        # Song recognition service
│   │   └── gemini.js          # AI analysis service
│   ├── utils/
│   │   └── crypto.js          # Cryptographic utilities
│   └── server.js              # Main server file
├── .env                        # Environment variables (create this)
├── .env.example               # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Rate Limits & Costs 💰

### ACRCloud
- Free tier: 3,000 recognitions/month
- Paid plans start at $39/month for 20,000 recognitions

### Google Gemini AI
- Free tier: 60 requests per minute
- Check [Google AI pricing](https://ai.google.dev/pricing) for current rates

## Integrating with Your Frontend 🔌

To integrate this backend with your Lovable frontend:

1. Replace the mock `recognizeSong` function in `src/services/recognition.ts` with:

```typescript
export async function recognizeSong(audioBlob: Blob): Promise<SongInfo> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.mp3');
  
  const response = await fetch('http://localhost:3000/api/songs/recognize', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Song recognition failed');
  }
  
  const result = await response.json();
  
  if (!result.found) {
    throw new Error(result.message || 'Song not found');
  }
  
  return {
    title: result.song.title,
    artist: result.song.artist,
    analysis: result.analysis.analysis,
    // Map other fields as needed
  };
}
```

2. Update your Supabase edge function to call this backend instead of calling Gemini directly.

## Troubleshooting 🔧

### "Missing required environment variables"
- Make sure you've created a `.env` file from `.env.example`
- Verify all API keys are correctly set

### "Invalid Gemini API key"
- Check your API key at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Ensure there are no extra spaces or quotes in your `.env` file

### "ACRCloud API Error"
- Verify your ACRCloud credentials
- Check that your ACRCloud project is active
- Ensure you haven't exceeded your rate limit

### "No song found"
- Use a longer audio clip (10-15 seconds recommended)
- Ensure the audio is clear with minimal background noise
- Try a more popular/well-known song for testing

## Security Considerations 🔒

- Never commit your `.env` file to version control
- Use environment variables for all API keys
- Consider adding rate limiting for production use
- Validate and sanitize all user inputs
- Use HTTPS in production

## Future Enhancements 🚀

- [ ] Add support for more recognition services (AudD, Shazam API)
- [ ] Implement caching to reduce API calls
- [ ] Add rate limiting middleware
- [ ] Create WebSocket support for real-time recognition
- [ ] Add user authentication
- [ ] Store recognition history in database
- [ ] Add lyrics fetching
- [ ] Support for video files (extract audio)

## License 📄

MIT License - feel free to use this project for personal or commercial purposes.

## Support 💬

If you encounter any issues or have questions, please open an issue on GitHub or contact support.

---

**Made with ❤️ for music lovers**
