# Storyzam 🎵

**Hear the song. Understand the story.**

Storyzam is a beautiful web app that goes beyond song recognition. Record or upload any song, and discover not just *what* it is, but *what it means* — the story behind the lyrics, the emotions it captures, and why it resonates with millions. Powered by AI, wrapped in a cinematic dark-mode interface designed to feel as premium as the music itself.

## Features

- **Song Recognition**: Upload or record audio to identify songs
- **AI-Powered Story Analysis**: Get detailed explanations of what songs really mean
- **Beautiful UI**: Dark mode with glassmorphism effects and gradient accents
- **Share Results**: Generate shareable cards with song stories

## Tech Stack

- **React** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   
   Create a `.env` file with:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Make sure your backend is running**
   
   The frontend expects the backend API to be available at the URL specified in `VITE_API_BASE_URL`.

## Backend Integration

### What the Frontend Expects

The frontend expects a **SongStory** object with the following structure:

```typescript
{
  id: string;
  title: string;
  artist: string;
  album?: string;
  year?: number;
  genre?: string;
  confidence: number;          // 0-100
  coverImage: string;
  
  // AI-generated story fields
  shortSummary: string;        // One poetic sentence (~14 words)
  storyExplanation: string;    // 2-4 sentences about the song's story
  themes: string[];            // 3-6 lowercase single words
  emotionalTone: string[];     // 3-5 mood descriptors
  interpretation: string;      // 1-2 sentences with hedged language
  whyItConnects: string;       // Why people connect to this song
  memorableLine: string;       // A quotable sentence
  shareCardText: string;       // Punchy one-liner for social sharing
}
```

### Actual Backend Response Structure

The Storyzam backend returns a different structure:

```typescript
{
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
    score: number;              // Confidence score
  };
  analysis: {
    success: boolean;
    songTitle: string;
    artist: string;
    analysis: string;           // Full text analysis
    structured: {
      story: string;            // The story behind the song
      meaning: string;          // What the song means
      impact: string;           // Cultural impact
      style: string;            // Musical style
      facts: string;            // Interesting facts
    };
    generatedAt: string;
  };
  timestamp: string;
}
```

### Transformation Layer

To bridge the gap between the backend's response structure and the frontend's expectations, a **transformation layer** was implemented in `src/services/gemini.ts`.

**Key Transformations:**

| Backend Field | → | Frontend Field | Transformation |
|---------------|---|----------------|----------------|
| `song.score` | → | `confidence` | Direct mapping |
| `song.releaseDate` | → | `year` | Extract year from date string |
| `structured.story` | → | `storyExplanation` | Direct mapping |
| `structured.meaning` | → | `shortSummary`, `interpretation`, `shareCardText` | Truncated/extracted from text |
| `structured.impact` | → | `whyItConnects` | Direct mapping |
| `structured.story + meaning` | → | `themes[]` | Keyword extraction (love, heartbreak, hope, etc.) |
| `structured.meaning + style` | → | `emotionalTone[]` | Keyword extraction (melancholic, hopeful, etc.) |
| `structured.meaning` | → | `memorableLine` | Extract first impactful sentence |

**Helper Functions:**
- `extractThemes()` - Scans text for common theme keywords
- `extractEmotionalTone()` - Identifies mood descriptors in text
- `extractMemorableLine()` - Extracts quotable sentences
- `truncate()` - Shortens text while preserving meaning

### API Endpoint

The frontend calls:
```
POST http://localhost:3000/api/songs/recognize
Content-Type: multipart/form-data
Body: audio file
```

This single endpoint handles both song recognition (via ACRCloud) and AI analysis (via Gemini).

### Improving the Integration

For optimal results, consider updating the backend's Gemini prompt to return the exact structure the frontend expects. This would eliminate the need for the transformation layer and provide more accurate results for fields like `themes`, `emotionalTone`, and `memorableLine`.

Example backend update:
```javascript
// In your backend's Gemini prompt, request this exact JSON structure
{
  shortSummary: "...",
  storyExplanation: "...",
  themes: ["heartbreak", "longing", "memory"],
  emotionalTone: ["melancholic", "tender", "hopeful"],
  // ... etc
}
```

## Project Structure

```
src/
├── config/
│   └── api.ts              # Backend API configuration
├── services/
│   ├── recognition.ts      # Song recognition service
│   └── gemini.ts          # AI analysis & transformation layer
├── components/
│   ├── detect/            # Recording UI components
│   ├── landing/           # Landing page components
│   ├── result/            # Result display & share modal
│   ├── shared/            # Shared components (Navbar, Footer, etc.)
│   └── ui/                # shadcn/ui components
├── pages/
│   ├── Index.tsx          # Landing page
│   ├── Detect.tsx         # Song detection page
│   ├── Result.tsx         # Song story result page
│   └── NotFound.tsx       # 404 page
├── data/
│   └── mockSongs.ts       # Mock data for demos
├── types/
│   └── song.ts            # TypeScript interfaces
└── lib/
    └── utils.ts           # Utility functions

```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000` |

## License

MIT
