import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveAssetUrl } from "@/lib/storage-service";

export interface ShowcaseItem {
  id: string;
  image: string; // URL or Base64 string
  recipient: string;
  title: string;
  organization: string;
  date: string; // Year or date string
}

interface ShowcaseCardProps {
  title: string;
  icon: string;
  items: ShowcaseItem[];
  accent: "gold" | "cyan";
  aspectRatio?: "16/9" | "4/3";
  onExportExcel?: () => void;
  onExportPdf?: () => void;
}

export function ShowcaseCard({
  title,
  icon,
  items,
  accent,
  aspectRatio = "16/9",
  onExportExcel,
  onExportPdf,
}: ShowcaseCardProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Define accent styles
  const isGold = accent === "gold";

  // Custom theme classes
  const borderClass = isGold
    ? "border-amber-500/20 dark:border-amber-500/30"
    : "border-cyan-500/20 dark:border-cyan-500/30";

  const textAccentClass = isGold
    ? "text-amber-500 dark:text-amber-400"
    : "text-cyan-500 dark:text-cyan-400";

  const bgAccentClass = isGold
    ? "bg-amber-500 dark:bg-amber-400"
    : "bg-cyan-500 dark:bg-cyan-400";

  const glowClass = isGold
    ? "shadow-[0_4px_24px_rgba(217,119,6,0.08)] hover:shadow-[0_8px_32px_rgba(217,119,6,0.18)]"
    : "shadow-[0_4px_24px_rgba(6,182,212,0.08)] hover:shadow-[0_8px_32px_rgba(6,182,212,0.18)]";

  const aspectClass = aspectRatio === "4/3" ? "aspect-4/3" : "aspect-16/9";

  // Auto-rotating Carousel logic (5s rotation)
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items, activeIdx]);

  if (items.length === 0) {
    const emptyMsg = title.toLowerCase().includes("faculty") 
      ? "No faculty awards available yet." 
      : title.toLowerCase().includes("student") 
      ? "No student awards available yet." 
      : "No awards available yet.";

    return (
      <div
        className={`ocean-glass rounded-2xl p-5 border ${borderClass} ${glowClass} flex flex-col justify-between transition-all duration-500 h-full`}
      >
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl" role="img" aria-label={title}>
                {icon}
              </span>
              <h2 className={`text-lg font-bold tracking-wide ${textAccentClass}`}>
                {title}
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              {onExportExcel && (
                <button
                  onClick={onExportExcel}
                  className="inline-flex items-center gap-1 rounded border border-border bg-background/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-foreground hover:bg-accent hover:text-teal-500 transition-colors cursor-pointer select-none"
                >
                  Excel
                </button>
              )}
              {onExportPdf && (
                <button
                  onClick={onExportPdf}
                  className="inline-flex items-center gap-1 rounded border border-border bg-background/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-foreground hover:bg-accent hover:text-teal-500 transition-colors cursor-pointer select-none"
                >
                  PDF
                </button>
              )}
            </div>
          </div>

          {/* Empty State Area */}
          <div className={`relative w-full ${aspectClass} rounded-xl overflow-hidden bg-black/60 border border-border/40 shadow-inner flex flex-col items-center justify-center py-12 text-center`}>
            <span className="text-2xl mb-2">🏅</span>
            <p className="text-sm font-semibold text-muted-foreground">{emptyMsg}</p>
          </div>
        </div>
      </div>
    );
  }

  const currentItem = items[activeIdx];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % items.length);
  };

  return (
    <div
      className={`ocean-glass rounded-2xl p-5 border ${borderClass} ${glowClass} flex flex-col justify-between transition-all duration-500 h-full`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl" role="img" aria-label={title}>
              {icon}
            </span>
            <h2 className={`text-lg font-bold tracking-wide ${textAccentClass}`}>
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            {onExportExcel && (
              <button
                onClick={onExportExcel}
                className="inline-flex items-center gap-1 rounded border border-border bg-background/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-foreground hover:bg-accent hover:text-teal-500 transition-colors cursor-pointer select-none"
              >
                Excel
              </button>
            )}
            {onExportPdf && (
              <button
                onClick={onExportPdf}
                className="inline-flex items-center gap-1 rounded border border-border bg-background/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-foreground hover:bg-accent hover:text-teal-500 transition-colors cursor-pointer select-none"
              >
                PDF
              </button>
            )}
          </div>
        </div>

        {/* Carousel Image Area */}
        <div className="relative w-full rounded-xl overflow-hidden bg-black/60 border border-border/40 shadow-inner group">
          <div
            className={`w-full ${aspectClass} overflow-hidden flex items-center justify-center`}
          >
            {items.map((item, idx) => (
              <img
                key={item.id}
                src={resolveAssetUrl(item.image)}
                alt={`${item.recipient} - ${item.title}`}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out ${
                  idx === activeIdx
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              />
            ))}
          </div>

          {/* Navigation Chevrons */}
          {items.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full p-1.5 bg-black/40 hover:bg-black/60 text-white transition-all opacity-0 group-hover:opacity-100 duration-300 z-10 focus:outline-none"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1.5 bg-black/40 hover:bg-black/60 text-white transition-all opacity-0 group-hover:opacity-100 duration-300 z-10 focus:outline-none"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </>
          )}
        </div>

        {/* Caption Area */}
        <div className="mt-5 text-center min-h-[110px] flex flex-col justify-start px-2">
          <div className="font-extrabold text-foreground text-base leading-snug tracking-wide">
            {currentItem.recipient}
          </div>
          <div className={`text-sm font-bold mt-1.5 ${textAccentClass} italic`}>
            {currentItem.title}
          </div>
          <div className="text-xs text-text-secondary mt-1 font-semibold">
            {currentItem.organization}
          </div>
          <div className="text-xs text-text-muted mt-0.5 font-medium">
            {currentItem.date}
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      {items.length > 1 && (
        <div className="flex justify-center gap-2 mt-2 pt-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIdx
                  ? `w-5.5 ${bgAccentClass}`
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ShowcaseGalleryProps {
  leftTitle: string;
  leftIcon: string;
  leftItems: ShowcaseItem[];
  leftAccent: "gold" | "cyan";
  rightTitle: string;
  rightIcon: string;
  rightItems: ShowcaseItem[];
  rightAccent: "gold" | "cyan";
  aspectRatio?: "16/9" | "4/3";
}

export function ShowcaseGallery({
  leftTitle,
  leftIcon,
  leftItems,
  leftAccent,
  rightTitle,
  rightIcon,
  rightItems,
  rightAccent,
  aspectRatio = "16/9",
}: ShowcaseGalleryProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 w-full mb-8">
      <div>
        <ShowcaseCard
          title={leftTitle}
          icon={leftIcon}
          items={leftItems}
          accent={leftAccent}
          aspectRatio={aspectRatio}
        />
      </div>
      <div>
        <ShowcaseCard
          title={rightTitle}
          icon={rightIcon}
          items={rightItems}
          accent={rightAccent}
          aspectRatio={aspectRatio}
        />
      </div>
    </div>
  );
}
