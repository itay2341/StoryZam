export interface SongStory {
  id: string;
  title: string;
  artist: string;
  album?: string;
  year?: number;
  genre?: string;
  confidence: number; // 0-100
  coverImage: string;
  shortSummary: string;
  storyExplanation: string;
  themes: string[];
  emotionalTone: string[];
  interpretation: string;
  whyItConnects: string;
  memorableLine: string;
  shareCardText: string;
}
