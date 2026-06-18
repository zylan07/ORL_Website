import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import {
  Camera,
  Image as ImageIcon,
  Anchor,
  Layers,
  Calendar,
  Sparkles,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { getDatasetRecords, DATA_SEEDS, useDatasetRecords } from "@/lib/admin-store";
import { StickySectionNav } from "@/components/sticky-section-nav";
import { resolveAssetUrl } from "@/lib/storage-service";

const gallerySearchSchema = z.object({
  tab: z.string().optional(),
});

export const Route = createFileRoute("/gallery")({
  validateSearch: (search) => gallerySearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Gallery — Ocean Research Laboratory" },
      {
        name: "description",
        content:
          "Browse photos from underwater surveys, laboratory facilities, subsea testing, and academic workshops at ORL.",
      },
    ],
  }),
  component: GalleryPage,
});

// ----------------- CMS-READY DATA STRUCTURES -----------------

export interface GalleryRecord {
  id: string;
  title: string;
  category?: string; // legacy fallback
  sectionId?: string; // dynamic section mapping
  date?: string;
  description?: string;
  thumbnail?: string;
  images?: string[];
  tags?: string[];
  documents?: string[];
  featured?: boolean;
  displayOrder?: number;
}

// ----------------- DATABASES -----------------

export const GALLERY_RECORDS = getDatasetRecords("gallery-records", DATA_SEEDS["gallery-records"]) as GalleryRecord[];

// ----------------- ELEGANT THEMED PLACEHOLDER -----------------

interface PlaceholderProps {
  category: string;
  title: string;
}

function ElegantPlaceholder({ category, title }: PlaceholderProps) {
  const gradients: Record<string, string> = {
    sky: "from-blue-950/40 via-sky-900/20 to-sky-950/40 text-sky-400 border-sky-500/20",
    emerald: "from-emerald-950/40 via-emerald-900/20 to-emerald-950/40 text-emerald-400 border-emerald-500/20",
    teal: "from-teal-950/40 via-teal-900/20 to-teal-950/40 text-teal-400 border-teal-500/20",
    cyan: "from-cyan-950/40 via-cyan-900/20 to-cyan-950/40 text-cyan-400 border-cyan-500/20",
    indigo: "from-indigo-950/40 via-indigo-900/20 to-indigo-950/40 text-indigo-400 border-indigo-500/20",
    research: "from-blue-950/40 via-sky-900/20 to-sky-950/40 text-sky-400 border-sky-500/20",
    field: "from-emerald-950/40 via-emerald-900/20 to-emerald-950/40 text-emerald-400 border-emerald-500/20",
    facilities: "from-teal-950/40 via-teal-900/20 to-teal-950/40 text-teal-400 border-teal-500/20",
    events: "from-amber-950/40 via-amber-900/20 to-amber-950/40 text-amber-400 border-amber-500/20",
    internships: "from-indigo-950/40 via-indigo-900/20 to-indigo-950/40 text-indigo-400 border-indigo-500/20"
  };

  const bgGradient = gradients[category] || gradients.sky;

  return (
    <div className={`w-full h-44 rounded-lg bg-gradient-to-br ${bgGradient} border flex flex-col items-center justify-center p-4 text-center select-none overflow-hidden relative group-hover:scale-[1.01] transition duration-300`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px] opacity-40" />
      <Sparkles className="h-6 w-6 mb-2 opacity-75 animate-pulse" />
      <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">ORL Archive</span>
      <span className="text-[9px] font-semibold text-text-muted mt-1.5 leading-snug line-clamp-2 px-2">{title}</span>
    </div>
  );
}

// ----------------- MEDIA LIGHTBOX MODAL -----------------

interface MediaModalProps {
  item: GalleryRecord;
  onClose: () => void;
}

function MediaModal({ item, onClose }: MediaModalProps) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const sections = useDatasetRecords("gallery-sections", DATA_SEEDS["gallery-sections"]);
  const sectionName = useMemo(() => {
    const s = sections.find((x) => x.id === item.sectionId);
    return s ? s.name : "Archive Record";
  }, [sections, item.sectionId]);

  const imagesList = useMemo(() => {
    const list: string[] = [];
    if (item.thumbnail) list.push(item.thumbnail);
    if (item.images && item.images.length > 0) {
      item.images.forEach(img => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list;
  }, [item]);

  const hasMultiple = imagesList.length > 1;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImgIdx((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImgIdx((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasMultiple) {
        setActiveImgIdx((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight" && hasMultiple) {
        setActiveImgIdx((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, hasMultiple, imagesList.length]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl text-foreground scrollbar-thin md:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 bg-secondary text-text-muted hover:text-foreground transition cursor-pointer hover:bg-secondary/80 border border-border/45 z-10"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2.5 pr-8 font-sans">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-5xs font-bold uppercase tracking-wider bg-secondary border border-border/45 text-text-secondary">
            {sectionName}
          </span>
          <h3 className="text-lg font-black leading-snug text-foreground">
            {item.title}
          </h3>
          {item.date && (
            <p className="text-3xs font-mono text-text-muted">
              Date: {item.date}
            </p>
          )}
        </div>

        {/* Big Image Viewer / Lightbox */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted flex items-center justify-center">
          {imagesList.length > 0 ? (
            <>
              <img
                src={resolveAssetUrl(imagesList[activeImgIdx])}
                alt={`${item.title} - Image ${activeImgIdx + 1}`}
                className="max-h-full max-w-full object-contain select-none transition duration-300"
                loading="lazy"
              />

              {/* Prev / Next controls */}
              {hasMultiple && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition cursor-pointer border border-white/10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition cursor-pointer border border-white/10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Counter indicator */}
              {hasMultiple && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-black/60 text-white text-[10px] font-mono border border-white/10 select-none">
                  {activeImgIdx + 1} / {imagesList.length}
                </div>
              )}
            </>
          ) : (
            /* Image absent: Show themed elegant fallback inside lightbox */
            <div className="w-full h-full bg-gradient-to-br from-indigo-950/50 via-slate-900 to-indigo-950/50 flex flex-col items-center justify-center text-center p-6 select-none text-indigo-400">
              <Sparkles className="h-10 w-10 mb-2 opacity-70 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-text-muted">No Media Uploaded</span>
              <p className="text-[10px] text-text-muted mt-2 max-w-xs leading-relaxed">
                Images will appear here automatically once uploaded through the Admin Panel.
              </p>
            </div>
          )}
        </div>

        {/* Thumbnail row for lightbox */}
        {hasMultiple && (
          <div className="flex justify-center gap-2 overflow-x-auto py-1 scrollbar-thin">
            {imagesList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIdx(idx)}
                className={`h-12 w-20 rounded-md overflow-hidden border transition shrink-0 cursor-pointer ${
                  activeImgIdx === idx ? "border-cyan-500 ring-2 ring-cyan-500/20" : "border-border/60 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={resolveAssetUrl(img)} alt="thumbnail" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}

        {/* Modal Description / Details */}
        <div className="space-y-4 pt-4 border-t border-border/40 font-sans text-xs">
          {item.description && (
            <div>
              <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Description</span>
              <p className="text-text-secondary leading-relaxed font-normal mt-0.5">{item.description}</p>
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Metadata Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="text-4xs font-mono font-bold bg-secondary text-text-secondary border border-border/40 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.documents && item.documents.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold font-bold">Associated Documents</span>
              <div className="flex flex-col gap-1">
                {item.documents.map((doc, docIdx) => (
                  <a
                    key={docIdx}
                    href={resolveAssetUrl(doc)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-500 font-bold hover:underline"
                  >
                    View Document {docIdx + 1} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const STATIC_GALLERY_RECORDS = GALLERY_RECORDS;

// ----------------- MAIN GALLERY COMPONENT -----------------

function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState<GalleryRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  // Shadow GALLERY_RECORDS reactively
  const GALLERY_RECORDS = useDatasetRecords("gallery-records", STATIC_GALLERY_RECORDS) as GalleryRecord[];
  
  // Shadow dynamic gallery sections
  const sections = useDatasetRecords("gallery-sections", DATA_SEEDS["gallery-sections"]);

  const sortedSections = useMemo(() => {
    return [...sections].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [sections]);

  const { tab } = Route.useSearch();

  useEffect(() => {
    if (tab) {
      const el = document.getElementById(tab);
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [tab]);

  // Smooth scroll helper (resets filters if target is hidden)
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (!el) {
      setSearchQuery("");
      setSelectedCategory("all");
      setSelectedYear("all");
      setTimeout(() => {
        const resetEl = document.getElementById(id);
        resetEl?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openDetail = (item: GalleryRecord) => {
    setSelectedItem(item);
  };

  const closeDetail = () => {
    setSelectedItem(null);
  };

  // Dynamically extract all available years from dates in gallery database
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    GALLERY_RECORDS.forEach((rec) => {
      if (rec.date) {
        const match = rec.date.match(/\b\d{4}\b/);
        if (match) {
          years.add(match[0]);
        }
      }
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [GALLERY_RECORDS]);

  // Filtered gallery records based on combined search, category, and year selection
  const filteredRecords = useMemo(() => {
    let list = GALLERY_RECORDS;

    // 1. Global Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (rec) =>
          rec.title.toLowerCase().includes(q) ||
          (rec.category && rec.category.toLowerCase().includes(q)) ||
          (rec.description && rec.description.toLowerCase().includes(q)) ||
          (rec.tags && rec.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // 2. Section ID Dropdown (holds selected category)
    if (selectedCategory !== "all") {
      list = list.filter((rec) => rec.sectionId === selectedCategory);
    }

    // 3. Year Dropdown
    if (selectedYear !== "all") {
      list = list.filter((rec) => {
        if (!rec.date) return false;
        const match = rec.date.match(/\b\d{4}\b/);
        return match ? match[0] === selectedYear : false;
      });
    }

    return list;
  }, [GALLERY_RECORDS, searchQuery, selectedCategory, selectedYear]);

  // Dynamic navigation items based on sortedSections
  const navItems = useMemo(() => {
    const icons = [ImageIcon, Anchor, Layers, Calendar, Sparkles];
    const themes = ["sky", "emerald", "teal", "cyan", "indigo"] as const;
    return sortedSections.map((sec, idx) => {
      const count = GALLERY_RECORDS.filter(r => r.sectionId === sec.id).length;
      return {
        label: sec.name,
        id: sec.id,
        icon: icons[idx % icons.length],
        count,
        theme: themes[idx % themes.length]
      };
    });
  }, [sortedSections, GALLERY_RECORDS]);

  // Check if any matches exist at all
  const hasMatches = filteredRecords.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 transition-colors duration-300">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950/20 via-background to-background py-16 px-6 border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(255,255,255,0))]" />
        <div className="mx-auto max-w-5xl text-center space-y-6 relative z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-5xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/25">
            ORL Media Center
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl font-sans">
            Photo Gallery
          </h1>
          <p className="mx-auto max-w-xl text-xs font-semibold text-cyan-500 uppercase tracking-widest leading-relaxed">
            Professional media archive of subsea deployments, trials, and research
          </p>
        </div>
      </section>

      <StickySectionNav items={navItems} />
 
      {/* 3. Search & Filters Bar */}
      <section className="sticky top-[104px] z-20 w-full border-b border-border bg-background/85 backdrop-blur-md px-6 py-4 shadow-xs">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center gap-4">
          
          {/* Global Search */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search by title, keywords, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full text-xs rounded-xl border border-border bg-card/50 outline-none focus:border-cyan-500/50 transition font-sans"
            />
          </div>

          {/* Combined Filters */}
          <div className="flex gap-2 w-full sm:w-auto">
            {/* Category/Section Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-card/65 border border-border rounded-xl px-3 py-2 outline-none focus:border-cyan-500/50 cursor-pointer w-full sm:w-40 font-sans"
            >
              <option value="all">All Categories</option>
              {sortedSections.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            {/* Year Select */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-xs bg-card/65 border border-border rounded-xl px-3 py-2 outline-none focus:border-cyan-500/50 cursor-pointer w-full sm:w-28 font-mono"
            >
              <option value="all">All Years</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-5xl px-6 mt-12 space-y-16">
        
        {/* Render sections dynamically */}
        {sortedSections.map((sec, idx) => {
          const sectionRecs = filteredRecords
            .filter(r => r.sectionId === sec.id)
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

          if (sectionRecs.length === 0) return null;

          const themes = ["sky", "emerald", "teal", "cyan", "indigo"] as const;
          const theme = themes[idx % themes.length];
          
          const textAccent = 
            theme === "sky" ? "text-sky-500" :
            theme === "emerald" ? "text-emerald-500" :
            theme === "teal" ? "text-teal-500" :
            theme === "cyan" ? "text-cyan-500" :
            "text-indigo-500";

          const borderThemeClass = 
            theme === "sky" ? "border-sky-500/20 hover:border-sky-500/35" :
            theme === "emerald" ? "border-emerald-500/20 hover:border-emerald-500/35" :
            theme === "teal" ? "border-teal-500/20 hover:border-teal-500/35" :
            theme === "cyan" ? "border-cyan-500/20 hover:border-cyan-500/35" :
            "border-indigo-500/20 hover:border-indigo-500/35";

          return (
            <section key={sec.id} id={sec.id} className="scroll-mt-28 space-y-6">
              <div className={`border-b border-border/25 pb-2 flex items-center justify-between`}>
                <h2 className="text-xl font-bold tracking-tight text-foreground font-sans">
                  {sec.name}
                </h2>
                <span className={`text-xs font-mono font-bold ${textAccent}`}>
                  {sectionRecs.length} {sectionRecs.length === 1 ? "Record" : "Records"}
                </span>
              </div>
              
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {sectionRecs.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => openDetail(rec)}
                    className={`rounded-xl border border-border bg-card p-4 transition duration-300 hover:scale-[1.02] cursor-pointer hover:shadow-xs select-none group ${borderThemeClass}`}
                  >
                    <div className="relative mb-3 rounded-lg overflow-hidden border border-border bg-muted">
                      {rec.thumbnail ? (
                        <img
                          src={resolveAssetUrl(rec.thumbnail)}
                          alt={rec.title}
                          className="w-full h-44 object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <ElegantPlaceholder category={theme} title={rec.title} />
                      )}
                    </div>
                    <div className="space-y-1.5 font-sans">
                      <div className="flex items-center justify-between">
                        <span className={`text-5xs font-bold uppercase tracking-wider ${textAccent}`}>
                          {sec.name}
                        </span>
                        {rec.date && (
                          <span className="text-[10px] text-text-muted font-mono">{rec.date}</span>
                        )}
                      </div>
                      <h3 className="text-xs font-bold text-foreground leading-snug truncate">
                        {rec.title}
                      </h3>
                      {rec.description && (
                        <p className="text-3xs text-text-secondary leading-relaxed line-clamp-2">
                          {rec.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* Global Empty State */}
        {!hasMatches && (
          <div className="text-center py-16 rounded-xl border border-dashed border-border/80 bg-card max-w-xl mx-auto space-y-4 shadow-sm select-none font-sans">
            <Camera className="h-8 w-8 text-text-muted mx-auto animate-pulse" />
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              {GALLERY_RECORDS.length === 0 ? "No records available." : "No Archive Matches"}
            </h3>
            <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
              {GALLERY_RECORDS.length === 0
                ? "No records available in the gallery archive."
                : "No photo records or internship cards matched your current search filters. Please adjust your text query or dropdown selections."}
            </p>
          </div>
        )}
      </div>

      {/* 4. Reusable Media Lightbox Modal */}
      {selectedItem && (
        <MediaModal
          item={selectedItem}
          onClose={closeDetail}
        />
      )}
    </div>
  );
}
