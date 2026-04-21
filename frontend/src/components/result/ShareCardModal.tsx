import { Download, Share2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SongStory } from "@/types/song";

interface ShareCardModalProps {
  open: boolean;
  onClose: () => void;
  song: SongStory;
}

export function ShareCardModal({ open, onClose, song }: ShareCardModalProps) {
  const handleDownload = () => {
    // TODO: Implement card image generation and download
    console.log("Download share card for:", song.title);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${song.title} - ${song.artist}`,
          text: song.shareCardText,
          url: window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(
          `${song.shareCardText}\n\n${window.location.href}`
        );
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Error copying to clipboard:", err);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md glass-card border-brand-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl gradient-text">
            Share this story
          </DialogTitle>
        </DialogHeader>

        {/* Share Card Preview */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet/20 via-magenta/20 to-cyan/20 p-6">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={song.coverImage}
                alt={song.title}
                className="h-20 w-20 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg font-semibold truncate">
                  {song.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {song.artist}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed line-clamp-3">
              {song.shareCardText}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold">Storyzam</span>
              <span>·</span>
              <span>Uncover the beat</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 rounded-full glass-card px-4 py-3 text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-4 py-3 text-sm font-semibold text-white shadow-[0_0_30px_hsl(270_95%_60%/0.5)] hover:opacity-90 transition-opacity"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </DialogContent>
    </Dialog>
  );
}
