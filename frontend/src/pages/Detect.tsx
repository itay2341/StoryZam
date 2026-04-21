import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { AuroraBackground } from "@/components/shared/AuroraBackground";
import { AudioWaveVisualizer } from "@/components/shared/AudioWaveVisualizer";
import { MicOrb } from "@/components/detect/MicOrb";
import { ListeningState } from "@/components/detect/ListeningState";
import { recognizeSong } from "@/services/recognition";
import { analyzeSongMeaning } from "@/services/gemini";
import { mockSongs } from "@/data/mockSongs";
import { toast } from "sonner";

const Detect = () => {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const timerRef = useRef<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const navigate = useNavigate();

  const startTimer = () => {
    setSeconds(0);
    timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
  };
  const stopTimer = () => { if (timerRef.current) window.clearInterval(timerRef.current); };

  const handleToggle = async () => {
    if (recording) {
      // Stop recording
      setRecording(false);
      stopTimer();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          stream.getTracks().forEach(track => track.stop());
          runAnalysis(audioBlob);
        };

        mediaRecorder.start();
        setRecording(true);
        startTimer();
      } catch (err) {
        toast.error("Could not access microphone. Please check permissions.");
        console.error("Microphone access error:", err);
      }
    }
  };

  const handleCancel = () => {
    setRecording(false);
    stopTimer();
    setSeconds(0);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    audioChunksRef.current = [];
  };

  const runAnalysis = async (audioBlob: Blob) => {
    setAnalyzing(true);
    try {
      const recognized = await recognizeSong(audioBlob);
      // Try Gemini analysis; fall back to mock content if unavailable.
      try {
        const story = await analyzeSongMeaning(recognized);
        // stash in sessionStorage for result page
        sessionStorage.setItem(`storyzam:${story.id}`, JSON.stringify(story));
        navigate(`/result/${story.id}`);
      } catch (err: any) {
        const msg = err?.message ?? "";
        if (msg.includes("Rate")) toast.error("We're a bit busy. Try again in a moment.");
        else if (msg.includes("credits")) toast.error("AI credits exhausted. Add more in Settings → Workspace.");
        else toast.message("Showing a featured story while we connect…");
        const fallback = mockSongs.find((s) => s.title === recognized.title) ?? mockSongs[0];
        navigate(`/result/${fallback.id}`);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    runAnalysis(file);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AuroraBackground />
      <Navbar />

      <main className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pt-10 pb-20 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Storyzam</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl font-semibold tracking-tight gradient-text">
          {recording ? "Listening…" : "Ready when you are."}
        </h1>
        <p className="mt-4 max-w-md text-sm text-muted-foreground">
          {recording
            ? "Hold the song up to your phone. Storyzam will catch it."
            : "Tap the orb to identify a song and reveal what it really means."}
        </p>

        <div className="my-12">
          <MicOrb recording={recording} onClick={handleToggle} />
        </div>

        <div className="flex h-16 items-center">
          {recording ? (
            <div className="flex flex-col items-center gap-2">
              <AudioWaveVisualizer bars={32} />
              <p className="font-mono text-sm text-muted-foreground">{mm}:{ss}</p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Or upload an audio clip below.</p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {recording ? (
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 rounded-full glass-card px-5 py-2.5 text-sm text-foreground/80 hover:text-foreground"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
          ) : (
            <>
              <button
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full glass-card px-5 py-2.5 text-sm text-foreground/90 hover:text-foreground"
              >
                <Upload className="h-4 w-4" /> Upload audio
              </button>
              <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={handleUpload} />
            </>
          )}
        </div>
      </main>

      {analyzing && <ListeningState onDone={() => { /* navigation handled in runAnalysis */ }} duration={4200} />}
    </div>
  );
};

export default Detect;
