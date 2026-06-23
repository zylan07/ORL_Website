import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import {
  BookOpen,
  Presentation,
  Book,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  ExternalLink,
  Download,
  FileText,
} from "lucide-react";
import { useRecords, formatDate, type RepoRecord } from "@/lib/repository-data";
import { StickySectionNav } from "@/components/sticky-section-nav";
import { parseDateSafe } from "@/lib/utils";
import { PageHero } from "@/components/page-hero";
import { useSiteSettings, useDatasetRecords, DATA_SEEDS } from "@/lib/admin-store";
import { resolveAssetUrl } from "@/lib/storage-service";

const publicationsSearchSchema = z.object({
  tab: z.enum(["journals", "conferences", "books"]).optional(),
});

export const Route = createFileRoute("/publications")({
  validateSearch: (search) => publicationsSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Publications — Ocean Research Laboratory" },
      {
        name: "description",
        content:
          "Peer-reviewed journal articles, conference papers, and books by ORL members.",
      },
    ],
  }),
  component: PublicationsPage,
});

function renderAttachments(r: RepoRecord) {
  if (!r.attachments || r.attachments.length === 0) return null;
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {r.attachments.map((att) => (
        <a
          key={att.id}
          href={att.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[9px] font-semibold text-secondary-foreground hover:bg-primary/20 hover:text-primary transition"
        >
          <Paperclip className="h-2.5 w-2.5" />
          {att.name} ({att.size})
        </a>
      ))}
    </div>
  );
}

function PublicationTable({
  title,
  id,
  items,
  headers,
  accentClass,
  borderClass,
  icon: Icon,
  renderRow,
  onExportExcel,
  onExportPdf,
}: {
  title: string;
  id: string;
  items: RepoRecord[];
  headers: string[];
  accentClass: string;
  borderClass: string;
  icon: React.ComponentType<{ className?: string }>;
  renderRow: (r: RepoRecord) => React.ReactNode;
  onExportExcel?: () => void;
  onExportPdf?: () => void;
}) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [items]);

  const pagedItems = items.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div
      id={id}
      className={`scroll-mt-28 rounded-xl border border-border bg-card p-6 shadow-sm hover:${borderClass} transition-all duration-300`}
    >
      <div
        className={`border-b ${borderClass} pb-3 flex items-center justify-between flex-wrap gap-2`}
      >
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${accentClass}`} />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {onExportExcel && (
              <button
                onClick={onExportExcel}
                className="inline-flex items-center gap-1 rounded border border-border bg-background px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground hover:bg-accent hover:text-teal-500 transition-colors cursor-pointer select-none"
              >
                <Download className="h-3 w-3" /> Excel
              </button>
            )}
            {onExportPdf && (
              <button
                onClick={onExportPdf}
                className="inline-flex items-center gap-1 rounded border border-border bg-background px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground hover:bg-accent hover:text-teal-500 transition-colors cursor-pointer select-none"
              >
                <FileText className="h-3 w-3" /> PDF
              </button>
            )}
          </div>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded bg-secondary/80 ${accentClass} font-mono border ${borderClass}`}
          >
            {items.length} records
          </span>
        </div>
      </div>

      <div className="mt-4 orl-table-container">
        <table className="orl-table">
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pagedItems.map((item) => (
              <tr
                key={item.id}
              >
                {renderRow(item)}
              </tr>
            ))}
            {pagedItems.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-4 py-10 text-center text-xs text-text-muted"
                >
                  No publications match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground pt-1">
          <span>
            Showing {(page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, items.length)} of {items.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1 disabled:opacity-40 hover:bg-accent hover:text-accent-foreground transition cursor-pointer select-none"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <span className="px-2 tabular-nums">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1 disabled:opacity-40 hover:bg-accent hover:text-accent-foreground transition cursor-pointer select-none"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PublicationCarouselCard({ group }: { group: any }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const items = group.items || [];

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col h-full rounded-xl border border-border bg-card p-4 shadow-sm hover:border-indigo-500/35 transition-all duration-300">
      <div className="border-b border-border/40 pb-2 mb-3">
        <h3 className="font-bold text-xs md:text-sm tracking-tight text-foreground line-clamp-1">{group.name}</h3>
        {group.description && (
          <p className="text-[11px] text-text-secondary leading-relaxed mt-0.5 line-clamp-2">{group.description}</p>
        )}
      </div>

      {/* Carousel display area */}
      <div className="relative rounded-lg overflow-hidden aspect-video bg-black/10 border border-border/40 select-none">
        {items.map((item: any, idx: number) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              idx === activeIdx ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            <img
              src={resolveAssetUrl(item.image)}
              alt={item.altText || item.caption || group.name}
              className="w-full h-full object-cover"
            />
            
            {/* Caption overlays */}
            {(item.caption || item.description) && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2 text-white text-left font-sans">
                {item.caption && (
                  <p className="text-[10px] md:text-xs font-bold leading-tight line-clamp-1">{item.caption}</p>
                )}
                {item.description && (
                  <p className="text-[9px] md:text-[10px] text-slate-300 leading-normal line-clamp-1 mt-0.5">{item.description}</p>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Carousel controls - arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={() => setActiveIdx((prev) => (prev - 1 + items.length) % items.length)}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full bg-black/60 text-white text-[10px] hover:bg-black/80 transition cursor-pointer select-none z-10"
              aria-label="Previous image"
            >
              ◀
            </button>
            <button
              onClick={() => setActiveIdx((prev) => (prev + 1) % items.length)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full bg-black/60 text-white text-[10px] hover:bg-black/80 transition cursor-pointer select-none z-10"
              aria-label="Next image"
            >
              ▶
            </button>
          </>
        )}
        
        {/* Carousel indicator dots */}
        {items.length > 1 && (
          <div className="absolute bottom-2 right-2 flex gap-1 z-10">
            {items.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`h-1 w-1 rounded-full transition-all ${
                  idx === activeIdx ? "w-2.5 bg-white" : "w-1 bg-white/50 hover:bg-white"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PublicationsPage() {
  const { tab } = Route.useSearch();
  const records = useRecords();
  const settings = useSiteSettings();
  
  const rawGroups = useDatasetRecords("publication-carousel-groups", DATA_SEEDS["publication-carousel-groups"]);
  const rawItems = useDatasetRecords("publication-carousel-items", DATA_SEEDS["publication-carousel-items"]);

  // Filter visible groups & sort
  const visibleGroups = useMemo(() => {
    return [...rawGroups]
      .filter(g => g.visible !== false)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [rawGroups]);

  // Associate items with groups
  const carouselData = useMemo(() => {
    return visibleGroups.map(group => {
      const items = [...rawItems]
        .filter(item => item.groupId === group.id)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      return {
        ...group,
        items
      };
    });
  }, [visibleGroups, rawItems]);

  const [q, setQ] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    if (tab) {
      const el = document.getElementById(tab);
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [tab]);

  const rawPublications = useMemo(() => {
    return records.filter((r) => r.type === "publication");
  }, [records]);

  const filteredPublications = useMemo(() => {
    const query = q.trim().toLowerCase();
    let result = rawPublications;
    if (query) {
      result = rawPublications.filter((r) => {
        const haystack = [r.title, r.organization, r.authors ?? "", r.doi ?? ""]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      });
    }
    return sortDesc
      ? [...result].sort((a, b) => parseDateSafe(b.date).getTime() - parseDateSafe(a.date).getTime())
      : [...result].sort((a, b) => parseDateSafe(a.date).getTime() - parseDateSafe(b.date).getTime());
  }, [rawPublications, q, sortDesc]);

  // Extract publication subtypes dynamically from the database records
  const subtypes = useMemo(() => {
    const set = new Set(rawPublications.map((r) => r.subtype || "Other"));
    const list = Array.from(set);
    const order = ["Journal", "Conference", "Book"];
    return list.sort((a, b) => {
      const idxA = order.indexOf(a);
      const idxB = order.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [rawPublications]);

  // Derived counts for filtered items per subtype
  const countsBySubtype = useMemo(() => {
    const counts: Record<string, number> = {};
    subtypes.forEach((sub) => {
      counts[sub] = rawPublications.filter((r) => (r.subtype || "Other") === sub).length;
    });
    return counts;
  }, [subtypes, rawPublications]);

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 110;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const navItems = useMemo(() => {
    return subtypes.map((subtype) => {
      const count = countsBySubtype[subtype] || 0;
      let label = `${subtype}s`;
      if (subtype === "Book") label = "Books / Book Chapters";
      else if (subtype === "Journal") label = "Journals";
      else if (subtype === "Conference") label = "Conferences";

      let icon = BookOpen;
      if (subtype === "Conference") icon = Presentation;
      else if (subtype === "Book") icon = Book;

      let theme: "sky" | "indigo" | "teal" | "cyan" | "violet" | "emerald" = "sky";
      if (subtype === "Journal") theme = "sky";
      else if (subtype === "Conference") theme = "indigo";
      else if (subtype === "Book") theme = "teal";

      return {
        label,
        id: subtype.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        icon,
        count,
        theme,
      };
    });
  }, [subtypes, countsBySubtype]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 transition-colors duration-300 page-publications">
      <PageHero
        title={settings.publicationsHero?.title || "Publications"}
        subtitle={settings.publicationsHero?.subtitle || "Disseminating Scientific Insights & Research Breakthroughs"}
        description={settings.publicationsHero?.description || "Explore the peer-reviewed research outputs, IEEE conference papers, book chapters, and engineering reference volumes authored by ORL faculty and researchers."}
        mediaType={settings.publicationsHero?.mediaType || "none"}
        mediaUrl={settings.publicationsHero?.mediaUrl || ""}
        mediaPosition={settings.publicationsHero?.mediaPosition || "background"}
        overlayOpacity={settings.publicationsHero?.overlayOpacity !== undefined ? settings.publicationsHero.overlayOpacity : 60}
      />

      <StickySectionNav items={navItems} />

      {/* Main Content Area */}
      <div className="mx-auto max-w-6xl px-6 mt-10 space-y-10">
        
        {/* Dynamic Publications Carousels */}
        {carouselData.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3 w-full">
            {carouselData.map(group => (
              <PublicationCarouselCard key={group.id} group={group} />
            ))}
          </div>
        )}

        {/* Global Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-border bg-secondary/20 max-w-6xl mx-auto">
          <label className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter publications by title, author, journal or publisher..."
              className="w-full rounded border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition-all"
            />
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortDesc((s) => !s)}
              className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer select-none"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              Sort by Date ({sortDesc ? "Newest first" : "Oldest first"})
            </button>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {subtypes.map((subtype) => {
            const items = filteredPublications.filter((r) => (r.subtype || "Other") === subtype);
            const id = subtype.toLowerCase().replace(/[^a-z0-9]/g, "-");
            
            let label = `${subtype} Publications`;
            if (subtype === "Book") label = "Books / Book Chapters";
            
            let icon = BookOpen;
            let accentClass = "text-sky-600 dark:text-sky-400";
            let borderClass = "border-sky-500/20";
            
            if (subtype === "Conference") {
              icon = Presentation;
              accentClass = "text-indigo-600 dark:text-indigo-400";
              borderClass = "border-indigo-500/20";
            } else if (subtype === "Book") {
              icon = Book;
              accentClass = "text-teal-600 dark:text-teal-400";
              borderClass = "border-teal-500/20";
            }

            let headers = ["Year", "Title of the Paper", "Authors", "Journal/Publisher/Venue", "DOI"];
            if (subtype === "Book") {
              headers = ["Year", "Book / Chapter Title", "Authors", "Publisher"];
            } else if (subtype === "Conference") {
              headers = ["Year", "Title of the Paper", "Authors", "Conference Name"];
            }

            // Export Excel
            const handleExportExcel = () => {
              const exportData = items.map((r) => ({
                date: formatDate(r.date),
                subtype: r.subtype || "Other",
                title: r.title,
                authors: r.authors || "—",
                organization: r.organization || "—",
                doi: r.doi || "—"
              }));
              import("@/lib/export-helper").then((mod) => {
                mod.exportToExcel(
                  exportData,
                  [
                    { label: "Year", key: "date" },
                    { label: "Subtype", key: "subtype" },
                    { label: "Title of Paper", key: "title" },
                    { label: "Authors", key: "authors" },
                    { label: "Journal/Publisher/Venue", key: "organization" },
                    { label: "DOI Reference", key: "doi" }
                  ],
                  `orl_publications_${id}`
                );
              });
            };

            // Export PDF
            const handleExportPdf = () => {
              const exportData = items.map((r) => ({
                date: formatDate(r.date),
                subtype: r.subtype || "Other",
                title: r.title,
                authors: r.authors || "—",
                organization: r.organization || "—",
                doi: r.doi || "—"
              }));
              import("@/lib/export-helper").then((mod) => {
                mod.exportToPdf(
                  `${subtype} Publications`,
                  exportData,
                  [
                    { label: "Year", key: "date" },
                    { label: "Subtype", key: "subtype" },
                    { label: "Title of Paper", key: "title" },
                    { label: "Authors", key: "authors" },
                    { label: "Journal/Publisher/Venue", key: "organization" },
                    { label: "DOI Reference", key: "doi" }
                  ],
                  `orl_publications_${id}`,
                  q
                );
              });
            };

            return (
              <PublicationTable
                key={subtype}
                title={label}
                id={id}
                items={items}
                icon={icon}
                accentClass={accentClass}
                borderClass={borderClass}
                headers={headers}
                onExportExcel={handleExportExcel}
                onExportPdf={handleExportPdf}
                renderRow={(r) => (
                  <>
                    <td className="whitespace-nowrap px-4 py-3 align-top text-xs text-muted-foreground tabular-nums">
                      {formatDate(r.date)}
                    </td>
                    <td className="px-4 py-3 align-top text-xs font-semibold text-foreground leading-snug">
                      {r.title}
                      {renderAttachments(r)}
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-muted-foreground italic max-w-xs">
                      {r.authors || "—"}
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-muted-foreground max-w-xs">
                      {r.organization || "—"}
                    </td>
                    {subtype !== "Book" && subtype !== "Conference" ? (
                      <td className="px-4 py-3 align-top text-xs text-muted-foreground whitespace-nowrap">
                        {r.doi ? (
                          <a
                            href={
                              r.doi.startsWith("http")
                                ? r.doi
                                : `https://doi.org/${r.doi}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300 hover:underline"
                          >
                            DOI Link <ExternalLink className="h-3 w-3 inline" />
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    ) : null}
                  </>
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
