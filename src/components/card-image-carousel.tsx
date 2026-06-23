import { useState, useEffect, useRef } from "react";
import { resolveAssetUrl } from "@/lib/storage-service";
import { isValidImage } from "@/lib/utils";

interface CardImageCarouselProps {
  images: string[];
  title: string;
  activeColorClass?: string;
}

export function CardImageCarousel({
  images,
  title,
  activeColorClass = "bg-sky-500",
}: CardImageCarouselProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [lastInteractionTime, setLastInteractionTime] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize and filter images to exclude null, undefined, empty, and placeholders
  const validImages = (images || []).filter(isValidImage);

  // IntersectionObserver to pause autoplay when card is off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || validImages.length <= 1) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [validImages.length]);

  // Visibility API to pause autoplay when page is backgrounded / tab hidden
  useEffect(() => {
    if (validImages.length <= 1) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        setIsVisible(false);
      } else {
        // If tab becomes visible, re-check intersection state via observer
        setIsVisible(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [validImages.length]);

  // Autoplay Timer Loop
  useEffect(() => {
    if (validImages.length <= 1) return;

    // Pause autoplay when hovered or off-screen / tab hidden
    if (isHovered || !isVisible) return;

    let timer: any;
    const timeSinceInteraction = Date.now() - lastInteractionTime;

    const advanceSlide = () => {
      setCurrentIdx((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
    };

    if (timeSinceInteraction < 8000) {
      // Recovery mode: wait the remaining window, then resume 4000ms cycle
      const delay = 8000 - timeSinceInteraction;
      timer = setTimeout(() => {
        advanceSlide();
        timer = setInterval(advanceSlide, 4000);
      }, delay);
    } else {
      // Normal autoplay cycle
      timer = setInterval(advanceSlide, 4000);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(timer);
    };
  }, [validImages.length, isHovered, isVisible, lastInteractionTime]);

  if (validImages.length === 0) return null;

  if (validImages.length === 1) {
    return (
      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border/40 bg-muted mb-4 shadow-inner">
        <img
          src={resolveAssetUrl(validImages[0])}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    setLastInteractionTime(Date.now());
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
    setLastInteractionTime(Date.now());
  };

  const handleDotClick = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setCurrentIdx(idx);
    setLastInteractionTime(Date.now());
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative aspect-video w-full rounded-xl overflow-hidden border border-border/40 bg-muted mb-4 shadow-inner group/carousel select-none"
    >
      <img
        src={resolveAssetUrl(validImages[currentIdx])}
        alt={`${title} - slide ${currentIdx + 1}`}
        className="h-full w-full object-cover transition-all duration-300"
      />
      
      {/* Navigation Arrows (Visible on hover) */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition opacity-0 group-hover/carousel:opacity-100 cursor-pointer border border-white/10 z-10 text-xs font-bold font-sans"
        aria-label="Previous image"
      >
        &#8592;
      </button>
      <button
        type="button"
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition opacity-0 group-hover/carousel:opacity-100 cursor-pointer border border-white/10 z-10 text-xs font-bold font-sans"
        aria-label="Next image"
      >
        &#8594;
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1 z-10">
        {validImages.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => handleDotClick(e, idx)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              idx === currentIdx ? `${activeColorClass} w-3.5` : "w-1.5 bg-white/50 hover:bg-white"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
