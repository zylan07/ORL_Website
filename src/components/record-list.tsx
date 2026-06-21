import { useMemo, useState, useDeferredValue, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  ExternalLink,
  Download,
  FileText,
} from "lucide-react";
import {
  searchRecords,
  formatDate,
  TYPE_META,
  usePageText,
  useRecords,
  useCarousel,
  type RecordType,
  type RepoRecord,
} from "@/lib/repository-data";
import { ShowcaseGallery, ShowcaseCard } from "./showcase-gallery";
import { resolveAssetUrl } from "@/lib/storage-service";

function getAutomaticAwardCategory(
  title: string,
  recipient?: string,
): "faculty" | "student" {
  const t = title.toLowerCase();
  const r = (recipient || "").toLowerCase();

  // Student awards indicators
  if (
    t.includes("student") ||
    t.includes("scholar") ||
    t.includes("poster") ||
    t.includes("hackathon") ||
    t.includes("competition") ||
    t.includes("project") ||
    r.includes("student") ||
    r.includes("scholar") ||
    r.includes("team") ||
    r.includes("swathi") ||
    t.includes("oral presenter") ||
    t.includes("participant")
  ) {
    return "student";
  }

  // Faculty awards indicators
  if (
    t.includes("teacher") ||
    t.includes("faculty") ||
    t.includes("research excellence") ||
    t.includes("recognition") ||
    t.includes("society") ||
    t.includes("auditor") ||
    t.includes("fellow") ||
    t.includes("dignitary") ||
    t.includes("distinguished") ||
    r.includes("dr.") ||
    r.includes("prof.")
  ) {
    return "faculty";
  }

  return "faculty";
}

interface Props {
  type: RecordType;
  subtype?: string;
  breadcrumb?: string[];
  hideHeader?: boolean;
}

const PAGE_SIZE = 25;

const getDateLabel = (records: RepoRecord[], type: RecordType): string => {
  const typeRecords = records.filter((r) => r.type === type);
  if (typeRecords.length === 0) {
    if (type === "publication" || type === "pg") return "Year";
    return "Date";
  }

  let hasYear = false;
  let hasMonthYear = false;
  let hasFullDate = false;

  for (const r of typeRecords) {
    if (!r.date) continue;
    const trimStr = r.date.trim();
    if (/^\d{4}$/.test(trimStr)) {
      hasYear = true;
    } else if (/^\d{4}-\d{2}$/.test(trimStr)) {
      hasMonthYear = true;
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(trimStr)) {
      hasFullDate = true;
    } else {
      hasFullDate = true;
    }
  }

  const precisionsCount =
    (hasYear ? 1 : 0) + (hasMonthYear ? 1 : 0) + (hasFullDate ? 1 : 0);
  if (precisionsCount > 1) {
    return "Period";
  }
  if (hasYear) return "Year";
  if (hasMonthYear) return "Month & Year";
  if (hasFullDate) return "Date";

  return "Date";
};

const getSectionAccentClass = (type: RecordType): string => {
  switch (type) {
    case "award":
      return "text-amber-500 dark:text-amber-400";
    case "talk":
      return "text-sky-500 dark:text-sky-400";
    case "workshop":
      return "text-cyan-500 dark:text-cyan-400";
    case "publication":
      return "text-indigo-500 dark:text-indigo-400";
    case "bos":
      return "text-slate-500 dark:text-slate-400";
    case "dc":
      return "text-indigo-500 dark:text-indigo-400";
    case "host":
    case "itec":
    case "itp":
    case "pdp":
    case "coord":
      return "text-teal-500 dark:text-teal-400";
    case "pg":
      return "text-blue-500 dark:text-blue-400";
    default:
      return "text-sky-500 dark:text-sky-400";
  }
};

export function RecordList({ type, subtype, breadcrumb, hideHeader }: Props) {
  // force update when global store updates
  const records = useRecords();
  const meta = TYPE_META[type];
  const { title, description } = usePageText(type);
  const images = useCarousel(type);

  const [q, setQ] = useState("");
  const deferredQ = useDeferredValue(q);
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const [activeIdx, setActiveIdx] = useState(0);

  // Compute items for the dual showcase gallery from awards records directly
  const showcaseGalleryData = useMemo(() => {
    if (type !== "award") return { faculty: [], student: [] };

    const mapAwardToShowcaseItem = (r: RepoRecord) => {
      let imgUrl = "";
      if (r.showcaseImage) {
        imgUrl = resolveAssetUrl(r.showcaseImage);
      } else {
        const audience = r.awardAudience || r.showcaseCategory || "faculty";
        if (audience === "student") {
          imgUrl = "/images/student_award.png";
        } else {
          imgUrl = "/images/faculty_award.png";
        }
      }

      return {
        id: r.id,
        image: imgUrl,
        recipient: r.recipient || "—",
        title: r.title,
        organization: r.organization || "",
        date: r.date || "",
        priority: r.showcasePriority || 0,
      };
    };

    // Filter awards by Audience category - Enforce showcaseImage only
    const facultyAwards = records.filter((r) => {
      if (r.type !== "award") return false;
      if (!r.showcaseImage) return false;
      const audience = r.awardAudience || r.showcaseCategory || "faculty";
      return audience === "faculty" || audience === "faculty-student";
    });

    const studentAwards = records.filter((r) => {
      if (r.type !== "award") return false;
      if (!r.showcaseImage) return false;
      const audience = r.awardAudience || r.showcaseCategory || "faculty";
      return audience === "student" || audience === "faculty-student";
    });

    const faculty = facultyAwards.map(mapAwardToShowcaseItem).sort((a, b) => a.priority - b.priority);
    const student = studentAwards.map(mapAwardToShowcaseItem).sort((a, b) => a.priority - b.priority);

    // Fallback if both are empty to keep default entries visible
    if (faculty.length === 0 && student.length === 0) {
      return {
        faculty: [
          {
            id: "award-default-1",
            image: "/images/faculty_award.png",
            recipient: "Dr. S. Sakthivel Murugan",
            title: "Best Teacher Award (Academic Year 2023-2024)",
            organization: "SSN College of Engineering",
            date: "2024",
            priority: 1
          }
        ],
        student: [
          {
            id: "award-default-2",
            image: "/images/student_award.png",
            recipient: "S. Swathi",
            title: "Best Poster Presentation Award",
            organization: "IISF 2016",
            date: "2016",
            priority: 1
          }
        ]
      };
    }

    return { faculty, student };
  }, [records, type]);

  // Auto-rotating Carousel logic with configurable per-image duration
  useEffect(() => {
    if (images.length <= 1) return;
    const currentImg = images[activeIdx];
    const durationMs = (currentImg?.duration || 5) * 1000;
    const timer = setTimeout(() => {
      setActiveIdx((prev) => (prev + 1) % images.length);
    }, durationMs);
    return () => clearTimeout(timer);
  }, [images, activeIdx]);

  const results = useMemo(() => {
    let list = searchRecords(type, deferredQ);
    if (subtype) {
      list = list.filter((r) => r.subtype === subtype);
    }
    return sortDesc ? list : [...list].reverse();
  }, [type, subtype, deferredQ, sortDesc]);

  const sectionRecords = useMemo(() => {
    let list = records.filter((r) => r.type === type);
    if (subtype) {
      list = list.filter((r) => r.subtype === subtype);
    }
    return list;
  }, [records, type, subtype]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = results.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const crumbs = breadcrumb ?? [title];

  // Helper to render inline attachments under Title
  const renderAttachments = (r: RepoRecord) => {
    if (!r.attachments || r.attachments.length === 0) return null;
    return (
      <div className="mt-1.5 flex flex-wrap gap-1">
        {r.attachments.map((att) => (
          <a
            key={att.id}
            href={att.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-secondary-foreground hover:bg-primary/20 hover:text-primary transition"
          >
            <Paperclip className="h-2.5 w-2.5" />
            {att.name} ({att.size})
          </a>
        ))}
      </div>
    );
  };

  // Dynamic Column Mapping per Category
  const tableHeaders = useMemo(() => {
    const dateLabel = getDateLabel(records, type);
    switch (type) {
      case "award":
        return ["Year", "Award / Recognition", "Awarded By", "Recipient"];
      case "talk":
        return ["Date", "Title of the Talk", "Venue", "Place"];
      case "workshop":
        return [dateLabel, "Workshop Title", "Host / Code", "Duration", "Mode"];
      case "publication":
        if (subtype === "Journal") {
          return [
            "Year",
            "Title of the Paper",
            "Authors",
            "Journal Name",
            "DOI",
          ];
        } else if (subtype === "Conference") {
          return ["Year", "Title of the Paper", "Authors", "Conference Name"];
        } else if (subtype === "Book") {
          return ["Year", "Book / Chapter Title", "Authors", "Publisher"];
        }
        return [
          dateLabel,
          "Publication Title",
          "Authors",
          "Venue / Publisher",
          "DOI",
        ];
      case "bos":
        return [dateLabel, "Role", "Category", "Details"];
      case "dc":
        return ["Period", "Research Scholar", "Institution"];
      case "host":
        return [
          "Period",
          "Programme Title",
          "Host Institution",
          "Duration",
          "Role",
        ];
      case "itec":
        return ["Period", "Programme Title", "Duration", "Role"];
      case "itp":
        return ["Period", "Programme Title", "Duration", "Role"];
      case "pdp":
        return ["Period", "Programme Title", "Code", "Duration", "Mode"];
      case "pg":
        return [
          dateLabel,
          "Subject Name",
          "Subject Code",
          "Programme",
          "Semester",
          "No. of Students",
        ];
      case "coord":
        return ["Period", "Programme Title", "Code", "Duration", "Mode"];
      default:
        return [dateLabel, "Title", "Organization"];
    }
  }, [type, subtype, records]);

  const renderRowCells = (r: RepoRecord) => {
    switch (type) {
      case "award":
        return (
          <>
            <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-text-muted tabular-nums">
              {formatDate(r.date)}
            </td>
            <td className="px-4 py-3 align-top text-sm text-foreground">
              {(() => {
                const isBestTeacher = r.title
                  .toLowerCase()
                  .includes("best teacher award");
                if (isBestTeacher) {
                  const yearMatch = r.title.match(
                    /\s*[([]?\s*(Academic Year\s*\d{4}-\d{4}|\d{4}-\d{4})\s*[)]]?/i,
                  );
                  if (yearMatch) {
                    const cleanTitle = r.title.replace(yearMatch[0], "").trim();
                    const academicYear = yearMatch[1];
                    return (
                      <div>
                        <div className="font-bold text-foreground leading-snug">
                          {cleanTitle}
                        </div>
                        <div
                          className="text-sm font-semibold mt-1 tracking-wide award-academic-year"
                        >
                          {academicYear}
                        </div>
                      </div>
                    );
                  }
                }
                return (
                  <span className="font-medium text-foreground">{r.title}</span>
                );
              })()}
              {renderAttachments(r)}
            </td>
            <td className="px-4 py-3 align-top text-sm text-text-secondary">
              {r.organization}
            </td>
            <td className="px-4 py-3 align-top text-sm text-text-secondary">
              {r.recipient || "—"}
            </td>
          </>
        );
      case "talk":
        return (
          <>
            <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-text-muted tabular-nums">
              {formatDate(r.date)}
            </td>
            <td className="px-4 py-3 align-top text-sm font-medium text-foreground">
              <div className="font-bold text-foreground leading-snug">
                {r.title}
              </div>
              {r.subtitle && (
                <div
                  className={`text-sm ${getSectionAccentClass("talk")} font-semibold mt-1 tracking-wide`}
                >
                  {r.subtitle}
                </div>
              )}
              {renderAttachments(r)}
            </td>
            <td className="px-4 py-3 align-top text-sm text-text-secondary">
              {r.organization}
            </td>
            <td className="px-4 py-3 align-top text-sm text-text-secondary">
              {r.place || "—"}
            </td>
          </>
        );
      case "workshop":
        return (
          <>
            <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums">
              {formatDate(r.date)}
            </td>
            <td className="px-4 py-3 align-top text-sm font-medium text-foreground">
              {r.title}
              {renderAttachments(r)}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground">
              {r.organization}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground">
              {r.duration || "—"}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground">
              {r.mode || "—"}
            </td>
          </>
        );
      case "publication":
        return (
          <>
            <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums">
              {formatDate(r.date)}
            </td>
            <td className="px-4 py-3 align-top text-sm font-semibold text-foreground">
              {r.title}
              {renderAttachments(r)}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground italic">
              {r.authors || "—"}
            </td>
            {subtype === "Book" ? (
              <td className="px-4 py-3 align-top text-sm text-muted-foreground">
                {r.organization}
              </td>
            ) : subtype === "Conference" ? (
              <td className="px-4 py-3 align-top text-sm text-muted-foreground">
                {r.organization}
              </td>
            ) : (
              <>
                <td className="px-4 py-3 align-top text-sm text-muted-foreground">
                  {r.organization}
                </td>
                <td className="px-4 py-3 align-top text-sm text-muted-foreground">
                  {r.doi ? (
                    <a
                      href={
                        r.doi.startsWith("http")
                          ? r.doi
                          : `https://doi.org/${r.doi}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 text-primary hover:underline"
                    >
                      {r.doi} <ExternalLink className="h-3 w-3 inline" />
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </>
            )}
          </>
        );
      case "bos":
        return (
          <>
            <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums">
              {formatDate(r.date)}
            </td>
            <td className="px-4 py-3 align-top text-sm font-medium text-foreground">
              {r.title}
              {renderAttachments(r)}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground">
              {r.organization}
            </td>
            <td className="px-4 py-3 align-top text-xs text-muted-foreground max-w-sm whitespace-normal leading-relaxed">
              {r.summary || "—"}
            </td>
          </>
        );
      case "dc":
        return (
          <>
            <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-text-muted tabular-nums">
              {formatDate(r.date)}
            </td>
            <td className="px-4 py-3 align-top text-sm font-medium text-foreground">
              {r.title}
              {renderAttachments(r)}
            </td>
            <td className="px-4 py-3 align-top text-sm text-text-secondary">
              {r.organization}
            </td>
          </>
        );
      case "host":
        return (
          <>
            <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums">
              {formatDate(r.date)}
            </td>
            <td className="px-4 py-3 align-top text-sm font-medium text-foreground">
              {r.title}
              {renderAttachments(r)}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground">
              {r.organization}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground">
              {r.duration || "—"}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground">
              {r.role || "—"}
            </td>
          </>
        );
      case "itec":
        return (
          <>
            <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums">
              {formatDate(r.date)}
            </td>
            <td className="px-4 py-3 align-top text-sm font-medium text-foreground">
              {r.title}
              {renderAttachments(r)}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground">
              {r.duration || "—"}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground">
              {r.role || "—"}
            </td>
          </>
        );
      case "itp":
        return (
          <>
            <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums">
              {formatDate(r.date)}
            </td>
            <td className="px-4 py-3 align-top text-sm font-medium text-foreground">
              {r.title}
              {renderAttachments(r)}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground">
              {r.duration || "—"}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground">
              {r.role || "—"}
            </td>
          </>
        );
      case "pdp":
        return (
          <>
            <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums">
              {formatDate(r.date)}
            </td>
            <td className="px-4 py-3 align-top text-sm font-medium text-foreground">
              {r.title}
              {renderAttachments(r)}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground font-mono">
              {r.code || "—"}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground">
              {r.duration || "—"}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground">
              {r.mode || "—"}
            </td>
          </>
        );
      case "pg":
        return (
          <>
            <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums">
              {formatDate(r.date)}
            </td>
            <td className="px-4 py-3 align-top text-sm font-semibold text-foreground">
              {r.title}
              {renderAttachments(r)}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground font-mono">
              {r.code || "—"}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground">
              {r.organization || "—"}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground">
              Semester {r.duration || "—"}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground tabular-nums">
              {r.mode || "—"}
            </td>
          </>
        );
      case "coord":
        return (
          <>
            <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums">
              {formatDate(r.date)}
            </td>
            <td className="px-4 py-3 align-top text-sm font-medium text-foreground">
              {r.title}
              {renderAttachments(r)}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground font-mono">
              {r.code || "—"}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground">
              {r.duration || "—"}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground">
              {r.mode || "—"}
            </td>
          </>
        );
      default:
        return (
          <>
            <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums">
              {formatDate(r.date)}
            </td>
            <td className="px-4 py-3 align-top text-sm font-medium text-foreground">
              {r.title}
              {renderAttachments(r)}
            </td>
            <td className="px-4 py-3 align-top text-sm text-muted-foreground">
              {r.organization}
            </td>
          </>
        );
    }
  };

  const pageClassMap: Record<RecordType, string> = {
    award: "page-awards",
    talk: "page-academic-activities",
    workshop: "page-academic-activities",
    publication: "page-publications",
    bos: "page-academic-activities",
    dc: "page-academic-activities",
    host: "page-technical-training",
    itec: "page-technical-training",
    itp: "page-technical-training",
    pdp: "page-technical-training",
    pg: "page-academic-activities",
    coord: "page-technical-training",
  };
  const pageClass = pageClassMap[type] || "";

  return (
    <div className={`mx-auto max-w-6xl px-6 py-8 ${pageClass}`}>
      {/* Breadcrumb Navigation */}
      <nav
        className="text-xs text-muted-foreground mb-4"
        aria-label="Breadcrumb"
      >
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/" className="hover:text-primary hover:underline">
              Home
            </Link>
          </li>
          {crumbs.map((c, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <span className="text-muted-foreground/50">›</span>
              <span
                className={
                  i === crumbs.length - 1 ? "font-medium text-foreground" : ""
                }
              >
                {c}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      {/* Image Showcase Carousel */}
      {images.length > 0 && type !== "award" && (
        <div className="relative w-full h-48 sm:h-64 md:h-72 overflow-hidden rounded-md border border-border bg-black mb-6">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === activeIdx
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <img
                src={resolveAssetUrl(img.url)}
                alt={img.caption || `Carousel slide ${idx + 1}`}
                className="w-full h-full object-cover opacity-80"
              />
              {img.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Showcase
                  </p>
                  <h3 className="text-sm font-bold md:text-base">
                    {img.caption}
                  </h3>
                </div>
              )}
            </div>
          ))}
          {images.length > 1 && (
            <div className="absolute right-4 bottom-4 flex gap-1.5 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeIdx
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Page Header */}
      {!hideHeader && (
        <div className="border-b border-border pb-4">
          <h1 className="text-2xl font-bold text-foreground">
            {title}{" "}
            <span className="font-normal text-muted-foreground">
              ({results.length})
            </span>
          </h1>
          <p className="mt-1.5 max-w-3xl text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      )}

      {/* Reusable Dual Showcase Carousels */}
      {type === "award" && (
        <div className="grid gap-6 md:grid-cols-2 w-full mt-6">
          <div>
            <ShowcaseCard
              title="Faculty Awards"
              icon="🏆"
              items={showcaseGalleryData.faculty}
              accent="gold"
              aspectRatio="16/9"
            />
          </div>
          <div>
            <ShowcaseCard
              title="Student Awards"
              icon="🎖️"
              items={showcaseGalleryData.student}
              accent="cyan"
              aspectRatio="16/9"
            />
          </div>
        </div>
      )}

      {/* Filter and Sorting Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <label className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title, organization, institution, year (2025, 2025-03, 2025-03-12)…"
            className="w-full rounded border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition-all"
          />
        </label>
        <div className="flex items-center gap-2">
          {type === "award" && (
            <>
              <button
                onClick={() => {
                  const exportData = results.map(r => ({
                    ...r,
                    date: formatDate(r.date)
                  }));
                  import("@/lib/export-helper").then(mod => {
                    mod.exportToExcel(
                      exportData,
                      [
                        { label: "Year", key: "date" },
                        { label: "Award/Recognition", key: "title" },
                        { label: "Awarded By", key: "organization" },
                        { label: "Recipient", key: "recipient" }
                      ],
                      "orl_awards"
                    );
                  });
                }}
                className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent hover:text-teal-500 transition-colors cursor-pointer select-none"
              >
                <Download className="h-3.5 w-3.5" /> Export Excel
              </button>
              <button
                onClick={() => {
                  const exportData = results.map(r => ({
                    ...r,
                    date: formatDate(r.date)
                  }));
                  import("@/lib/export-helper").then(mod => {
                    mod.exportToPdf(
                      "Awards & Recognitions",
                      exportData,
                      [
                        { label: "Year", key: "date" },
                        { label: "Award/Recognition", key: "title" },
                        { label: "Awarded By", key: "organization" },
                        { label: "Recipient", key: "recipient" }
                      ],
                      "orl_awards",
                      q
                    );
                  });
                }}
                className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent hover:text-teal-500 transition-colors cursor-pointer select-none"
              >
                <FileText className="h-3.5 w-3.5" /> Export PDF
              </button>
            </>
          )}
          <button
            onClick={() => setSortDesc((s) => !s)}
            className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer select-none"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            Sort by Date ({sortDesc ? "Newest first" : "Oldest first"})
          </button>
        </div>
      </div>

      {/* Academic Table Layout */}
      <div className="mt-4 orl-table-container">
        <table className="orl-table">
          <thead>
            <tr>
              {tableHeaders.map((hdr) => (
                <th key={hdr}>
                  {hdr}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paged.map((r) => (
              <tr
                key={r.id}
              >
                {renderRowCells(r)}
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="px-4 py-10 text-center text-sm text-text-muted font-sans"
                >
                  {sectionRecords.length === 0 ? "No records available." : "No records match your search filter."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            Showing {(safePage - 1) * PAGE_SIZE + 1}–
            {Math.min(safePage * PAGE_SIZE, results.length)} of {results.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="inline-flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1 disabled:opacity-40 hover:bg-accent transition"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <span className="px-2 tabular-nums">
              Page {safePage} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="inline-flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1 disabled:opacity-40 hover:bg-accent transition"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
