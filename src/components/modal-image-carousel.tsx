import { useState, useEffect } from "react";
import { resolveAssetUrl } from "@/lib/storage-service";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ModalImageCarouselProps {
  images: string[];
  title: string;
  themeColor?: string;
}

export function ModalImageCarousel({ images, title, themeColor = "cyan" }: ModalImageCarouselProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  if (!images || images.length === 0) return null;

  const themeColors: Record<string, string> = {
    amber: "bg-amber-500 hover:bg-amber-400 text-amber-950",
    teal: "bg-teal-500 hover:bg-teal-400 text-teal-950",
    cyan: "bg-cyan-500 hover:bg-cyan-400 text-cyan-950",
  };
  const activeColor = themeColors[themeColor] || "bg-cyan-500 text-cyan-950";

  const themeBorderColors: Record<string, string> = {
    amber: "border-amber-500",
    teal: "border-teal-500",
    cyan: "border-cyan-500",
  };
  const activeBorderColor = themeBorderColors[themeColor] || "border-cyan-500";

  return (
    <div className="space-y-3 font-sans select-none">
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border bg-muted shadow-lg group/modal-carousel">
        <img
          src={resolveAssetUrl(images[currentIdx])}
          alt={`${title} - slide ${currentIdx + 1}`}
          className="h-full w-full object-cover transition-all duration-300"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition border border-white/10 cursor-pointer z-10"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition border border-white/10 cursor-pointer z-10"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            
            {/* Indicators */}
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIdx ? `w-4 ${activeColor.split(" ")[0]}` : "w-1.5 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            
            {/* Counter */}
            <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 text-white text-[10px] font-mono tracking-wider border border-white/10">
              {currentIdx + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      
      {/* Thumbnail strip if 2+ images */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 bg-muted transition cursor-pointer ${
                idx === currentIdx ? `${activeBorderColor} scale-95` : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={resolveAssetUrl(img)} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
