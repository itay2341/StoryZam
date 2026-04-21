import type { SongStory } from "@/types/song";

export const mockSongs: SongStory[] = [
  {
    id: "midnight-letters",
    title: "Midnight Letters",
    artist: "Lior Vance",
    album: "Quiet Architecture",
    year: 2022,
    genre: "Indie / Alt",
    confidence: 96,
    coverImage:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900&auto=format&fit=crop",
    shortSummary: "A late-night confession to someone who never wrote back.",
    storyExplanation:
      "Midnight Letters lives in that hour where memory becomes louder than sleep. The narrator drafts and re-drafts a message they'll never send — half apology, half elegy — turning a private silence into a quiet kind of music. It's less about the person who left and more about the version of yourself you become in their absence.",
    themes: ["heartbreak", "longing", "memory", "solitude", "acceptance"],
    emotionalTone: ["melancholic", "tender", "intimate", "hopeful"],
    interpretation:
      "Many listeners hear this as a song about closure that never arrives — the kind of love story that ends mid-sentence, leaving you to finish it alone in the dark.",
    whyItConnects:
      "It puts language to a feeling most of us only know in the body: the small, polite ache of moving on without a real ending.",
    memorableLine: "I keep writing you in a language I no longer speak.",
    shareCardText: "A late-night confession to someone who never wrote back.",
  },
  {
    id: "open-roads",
    title: "Open Roads",
    artist: "Halsea & The Nights",
    album: "Lantern",
    year: 2021,
    genre: "Anthemic Pop",
    confidence: 93,
    coverImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&auto=format&fit=crop",
    shortSummary: "The exact moment fear turns into momentum.",
    storyExplanation:
      "Open Roads is built like a sunrise — patient verses that gather light, then a chorus that just opens. It captures that strange courage you only find after burning out, when leaving stops feeling like running and starts feeling like coming home to yourself.",
    themes: ["freedom", "self-discovery", "hope", "courage", "new beginnings"],
    emotionalTone: ["uplifting", "cinematic", "defiant", "warm"],
    interpretation:
      "A common reading is that the 'road' isn't a place but a permission — to outgrow a life that fit you yesterday.",
    whyItConnects:
      "It arrives at the precise emotional pitch most people only allow themselves once or twice in a lifetime: the decision to go.",
    memorableLine: "I packed the quiet parts of me and left the rest behind.",
    shareCardText: "The exact moment fear turns into momentum.",
  },
  {
    id: "polaroid-summer",
    title: "Polaroid Summer",
    artist: "June Atlas",
    album: "Soft Rooms",
    year: 2019,
    genre: "Bedroom Indie",
    confidence: 91,
    coverImage:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop",
    shortSummary: "A love letter to a summer you didn't know was the last one.",
    storyExplanation:
      "Polaroid Summer treats nostalgia like a temperature, not a memory. The lyrics drift through small, ordinary scenes — a bike, a porch, a song through a screen door — and trust the listener to feel the weight of what's missing. It's a song about realizing, years later, that you were already inside the good part.",
    themes: ["nostalgia", "youth", "friendship", "impermanence", "tenderness"],
    emotionalTone: ["wistful", "warm", "bittersweet", "dreamy"],
    interpretation:
      "Many listeners read it as a quiet meditation on how the most defining seasons of our life rarely announce themselves.",
    whyItConnects:
      "It gives you back a feeling you'd half-forgotten — and somehow makes the forgetting itself feel beautiful.",
    memorableLine: "We were the photograph before we knew it was being taken.",
    shareCardText: "A love letter to a summer you didn't know was the last one.",
  },
];

export const getMockSongById = (id: string) => mockSongs.find((s) => s.id === id);
