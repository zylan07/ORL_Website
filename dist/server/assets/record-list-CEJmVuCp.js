import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useDeferredValue, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, ExternalLink, Paperclip } from "lucide-react";
import { r as resolveAssetUrl, u as useRecords, J as usePageText, K as useCarousel, L as searchRecords, f as formatDate } from "./router-ScoMlXed.js";
function ShowcaseCard({
  title,
  icon,
  items,
  accent,
  aspectRatio = "16/9"
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % items.length);
    }, 5e3);
    return () => clearInterval(timer);
  }, [items, activeIdx]);
  if (items.length === 0) {
    return null;
  }
  const currentItem = items[activeIdx];
  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + items.length) % items.length);
  };
  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % items.length);
  };
  const isGold = accent === "gold";
  const borderClass = isGold ? "border-amber-500/20 dark:border-amber-500/30" : "border-cyan-500/20 dark:border-cyan-500/30";
  const textAccentClass = isGold ? "text-amber-500 dark:text-amber-400" : "text-cyan-500 dark:text-cyan-400";
  const bgAccentClass = isGold ? "bg-amber-500 dark:bg-amber-400" : "bg-cyan-500 dark:bg-cyan-400";
  const glowClass = isGold ? "shadow-[0_4px_24px_rgba(217,119,6,0.08)] hover:shadow-[0_8px_32px_rgba(217,119,6,0.18)]" : "shadow-[0_4px_24px_rgba(6,182,212,0.08)] hover:shadow-[0_8px_32px_rgba(6,182,212,0.18)]";
  const aspectClass = aspectRatio === "4/3" ? "aspect-4/3" : "aspect-16/9";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `ocean-glass rounded-2xl p-5 border ${borderClass} ${glowClass} flex flex-col justify-between transition-all duration-500 h-full`,
      children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xl", role: "img", "aria-label": title, children: icon }),
            /* @__PURE__ */ jsx("h2", { className: `text-lg font-bold tracking-wide ${textAccentClass}`, children: title })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full rounded-xl overflow-hidden bg-black/60 border border-border/40 shadow-inner group", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `w-full ${aspectClass} overflow-hidden flex items-center justify-center`,
                children: items.map((item, idx) => /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: resolveAssetUrl(item.image),
                    alt: `${item.recipient} - ${item.title}`,
                    className: `absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out ${idx === activeIdx ? "opacity-100" : "opacity-0 pointer-events-none"}`
                  },
                  item.id
                ))
              }
            ),
            items.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handlePrev,
                  className: "absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full p-1.5 bg-black/40 hover:bg-black/60 text-white transition-all opacity-0 group-hover:opacity-100 duration-300 z-10 focus:outline-none",
                  "aria-label": "Previous slide",
                  children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4.5 w-4.5" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleNext,
                  className: "absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1.5 bg-black/40 hover:bg-black/60 text-white transition-all opacity-0 group-hover:opacity-100 duration-300 z-10 focus:outline-none",
                  "aria-label": "Next slide",
                  children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4.5 w-4.5" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 text-center min-h-[110px] flex flex-col justify-start px-2", children: [
            /* @__PURE__ */ jsx("div", { className: "font-extrabold text-foreground text-base leading-snug tracking-wide", children: currentItem.recipient }),
            /* @__PURE__ */ jsx("div", { className: `text-sm font-bold mt-1.5 ${textAccentClass} italic`, children: currentItem.title }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-text-secondary mt-1 font-semibold", children: currentItem.organization }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-text-muted mt-0.5 font-medium", children: currentItem.date })
          ] })
        ] }),
        items.length > 1 && /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-2 mt-2 pt-2", children: items.map((_, idx) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveIdx(idx),
            className: `h-2 rounded-full transition-all duration-300 ${idx === activeIdx ? `w-5.5 ${bgAccentClass}` : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"}`,
            "aria-label": `Go to slide ${idx + 1}`
          },
          idx
        )) })
      ]
    }
  );
}
function ShowcaseGallery({
  leftTitle,
  leftIcon,
  leftItems,
  leftAccent,
  rightTitle,
  rightIcon,
  rightItems,
  rightAccent,
  aspectRatio = "16/9"
}) {
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2 w-full mb-8", children: [
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      ShowcaseCard,
      {
        title: leftTitle,
        icon: leftIcon,
        items: leftItems,
        accent: leftAccent,
        aspectRatio
      }
    ) }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      ShowcaseCard,
      {
        title: rightTitle,
        icon: rightIcon,
        items: rightItems,
        accent: rightAccent,
        aspectRatio
      }
    ) })
  ] });
}
const PAGE_SIZE = 25;
const getDateLabel = (records, type) => {
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
  const precisionsCount = (hasYear ? 1 : 0) + (hasMonthYear ? 1 : 0) + (hasFullDate ? 1 : 0);
  if (precisionsCount > 1) {
    return "Period";
  }
  if (hasYear) return "Year";
  if (hasMonthYear) return "Month & Year";
  if (hasFullDate) return "Date";
  return "Date";
};
const getSectionAccentClass = (type) => {
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
function RecordList({ type, subtype, breadcrumb }) {
  const records = useRecords();
  const { title, description } = usePageText(type);
  const images = useCarousel(type);
  const [q, setQ] = useState("");
  const deferredQ = useDeferredValue(q);
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const [activeIdx, setActiveIdx] = useState(0);
  const showcaseGalleryData = useMemo(() => {
    if (type !== "award") return { faculty: [], student: [] };
    const mapped = images.map((img) => {
      const parts = (img.caption || "").split("\n");
      const recipient = parts[0] || "—";
      const title2 = parts[1] || "";
      const organization = parts[2] || "";
      const date = parts[3] || "";
      const category = img.category || (img.order % 2 === 0 ? "student" : "faculty");
      return {
        id: img.id,
        image: resolveAssetUrl(img.url),
        recipient,
        title: title2,
        organization,
        date,
        category,
        priority: img.order
      };
    });
    const sorted = [...mapped].sort((a, b) => a.priority - b.priority);
    const faculty = sorted.filter((item) => item.category === "faculty");
    const student = sorted.filter((item) => item.category === "student");
    return { faculty, student };
  }, [images, type]);
  useEffect(() => {
    if (images.length <= 1) return;
    const currentImg = images[activeIdx];
    const durationMs = (currentImg?.duration || 5) * 1e3;
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
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = results.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const crumbs = breadcrumb ?? [title];
  const renderAttachments = (r) => {
    if (!r.attachments || r.attachments.length === 0) return null;
    return /* @__PURE__ */ jsx("div", { className: "mt-1.5 flex flex-wrap gap-1", children: r.attachments.map((att) => /* @__PURE__ */ jsxs(
      "a",
      {
        href: att.url,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-secondary-foreground hover:bg-primary/20 hover:text-primary transition",
        children: [
          /* @__PURE__ */ jsx(Paperclip, { className: "h-2.5 w-2.5" }),
          att.name,
          " (",
          att.size,
          ")"
        ]
      },
      att.id
    )) });
  };
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
            "DOI"
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
          "DOI"
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
          "Role"
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
          "No. of Students"
        ];
      case "coord":
        return ["Period", "Programme Title", "Code", "Duration", "Mode"];
      default:
        return [dateLabel, "Title", "Organization"];
    }
  }, [type, subtype, records]);
  const renderRowCells = (r) => {
    switch (type) {
      case "award":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-sm text-text-muted tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-sm text-foreground", children: [
            (() => {
              const isBestTeacher = r.title.toLowerCase().includes("best teacher award");
              if (isBestTeacher) {
                const yearMatch = r.title.match(
                  /\s*[([]?\s*(Academic Year\s*\d{4}-\d{4}|\d{4}-\d{4})\s*[)]]?/i
                );
                if (yearMatch) {
                  const cleanTitle = r.title.replace(yearMatch[0], "").trim();
                  const academicYear = yearMatch[1];
                  return /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "font-bold text-foreground leading-snug", children: cleanTitle }),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "text-sm font-semibold mt-1 tracking-wide award-academic-year",
                        children: academicYear
                      }
                    )
                  ] });
                }
              }
              return /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: r.title });
            })(),
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-text-secondary", children: r.organization }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-text-secondary", children: r.recipient || "—" })
        ] });
      case "talk":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-sm text-text-muted tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-sm font-medium text-foreground", children: [
            /* @__PURE__ */ jsx("div", { className: "font-bold text-foreground leading-snug", children: r.title }),
            r.subtitle && /* @__PURE__ */ jsx(
              "div",
              {
                className: `text-sm ${getSectionAccentClass("talk")} font-semibold mt-1 tracking-wide`,
                children: r.subtitle
              }
            ),
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-text-secondary", children: r.organization }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-text-secondary", children: r.place || "—" })
        ] });
      case "workshop":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-sm font-medium text-foreground", children: [
            r.title,
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.organization }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.duration || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.mode || "—" })
        ] });
      case "publication":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-sm font-semibold text-foreground", children: [
            r.title,
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground italic", children: r.authors || "—" }),
          subtype === "Book" ? /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.organization }) : subtype === "Conference" ? /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.organization }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.organization }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.doi ? /* @__PURE__ */ jsxs(
              "a",
              {
                href: r.doi.startsWith("http") ? r.doi : `https://doi.org/${r.doi}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "inline-flex items-center gap-0.5 text-primary hover:underline",
                children: [
                  r.doi,
                  " ",
                  /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3 inline" })
                ]
              }
            ) : "—" })
          ] })
        ] });
      case "bos":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-sm font-medium text-foreground", children: [
            r.title,
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.organization }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-xs text-muted-foreground max-w-sm whitespace-normal leading-relaxed", children: r.summary || "—" })
        ] });
      case "dc":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-sm text-text-muted tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-sm font-medium text-foreground", children: [
            r.title,
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-text-secondary", children: r.organization })
        ] });
      case "host":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-sm font-medium text-foreground", children: [
            r.title,
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.organization }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.duration || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.role || "—" })
        ] });
      case "itec":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-sm font-medium text-foreground", children: [
            r.title,
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.duration || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.role || "—" })
        ] });
      case "itp":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-sm font-medium text-foreground", children: [
            r.title,
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.duration || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.role || "—" })
        ] });
      case "pdp":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-sm font-medium text-foreground", children: [
            r.title,
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground font-mono", children: r.code || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.duration || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.mode || "—" })
        ] });
      case "pg":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-sm font-semibold text-foreground", children: [
            r.title,
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground font-mono", children: r.code || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.organization || "—" }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: [
            "Semester ",
            r.duration || "—"
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground tabular-nums", children: r.mode || "—" })
        ] });
      case "coord":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-sm font-medium text-foreground", children: [
            r.title,
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground font-mono", children: r.code || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.duration || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.mode || "—" })
        ] });
      default:
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-sm text-muted-foreground tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-sm font-medium text-foreground", children: [
            r.title,
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-sm text-muted-foreground", children: r.organization })
        ] });
    }
  };
  const pageClassMap = {
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
    coord: "page-technical-training"
  };
  const pageClass = pageClassMap[type] || "";
  return /* @__PURE__ */ jsxs("div", { className: `mx-auto max-w-6xl px-6 py-8 ${pageClass}`, children: [
    /* @__PURE__ */ jsx(
      "nav",
      {
        className: "text-xs text-muted-foreground mb-4",
        "aria-label": "Breadcrumb",
        children: /* @__PURE__ */ jsxs("ol", { className: "flex flex-wrap items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-primary hover:underline", children: "Home" }) }),
          crumbs.map((c, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground/50", children: "›" }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: i === crumbs.length - 1 ? "font-medium text-foreground" : "",
                children: c
              }
            )
          ] }, i))
        ] })
      }
    ),
    images.length > 0 && type !== "award" && /* @__PURE__ */ jsxs("div", { className: "relative w-full h-48 sm:h-64 md:h-72 overflow-hidden rounded-md border border-border bg-black mb-6", children: [
      images.map((img, idx) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === activeIdx ? "opacity-100" : "opacity-0 pointer-events-none"}`,
          children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: resolveAssetUrl(img.url),
                alt: img.caption || `Carousel slide ${idx + 1}`,
                className: "w-full h-full object-cover opacity-80"
              }
            ),
            img.caption && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-primary", children: "Showcase" }),
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold md:text-base", children: img.caption })
            ] })
          ]
        },
        img.id
      )),
      images.length > 1 && /* @__PURE__ */ jsx("div", { className: "absolute right-4 bottom-4 flex gap-1.5 z-10", children: images.map((_, idx) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveIdx(idx),
          className: `h-1.5 rounded-full transition-all ${idx === activeIdx ? "w-4 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"}`,
          "aria-label": `Go to slide ${idx + 1}`
        },
        idx
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border-b border-border pb-4", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold text-foreground", children: [
        title,
        " ",
        /* @__PURE__ */ jsxs("span", { className: "font-normal text-muted-foreground", children: [
          "(",
          results.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-1.5 max-w-3xl text-sm text-muted-foreground", children: description })
    ] }),
    type === "award" && (showcaseGalleryData.faculty.length > 0 || showcaseGalleryData.student.length > 0) && /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      ShowcaseGallery,
      {
        leftTitle: "Faculty Awards",
        leftIcon: "🏆",
        leftItems: showcaseGalleryData.faculty,
        leftAccent: "gold",
        rightTitle: "Student Awards",
        rightIcon: "🎖️",
        rightItems: showcaseGalleryData.student,
        rightAccent: "cyan",
        aspectRatio: "16/9"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("label", { className: "relative w-full max-w-md", children: [
        /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: q,
            onChange: (e) => {
              setQ(e.target.value);
              setPage(1);
            },
            placeholder: "Search by title, organization, institution, year (2025, 2025-03, 2025-03-12)…",
            className: "w-full rounded border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition-all"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setSortDesc((s) => !s),
          className: "inline-flex items-center gap-1.5 rounded border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors",
          children: [
            /* @__PURE__ */ jsx(ArrowUpDown, { className: "h-3.5 w-3.5" }),
            "Sort by Date (",
            sortDesc ? "Newest first" : "Oldest first",
            ")"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 orl-table-container", children: /* @__PURE__ */ jsxs("table", { className: "orl-table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: tableHeaders.map((hdr) => /* @__PURE__ */ jsx("th", { children: hdr }, hdr)) }) }),
      /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-border", children: [
        paged.map((r) => /* @__PURE__ */ jsx(
          "tr",
          {
            children: renderRowCells(r)
          },
          r.id
        )),
        paged.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
          "td",
          {
            colSpan: tableHeaders.length,
            className: "px-4 py-10 text-center text-sm text-text-muted",
            children: "No records match your search filter."
          }
        ) })
      ] })
    ] }) }),
    totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "Showing ",
        (safePage - 1) * PAGE_SIZE + 1,
        "–",
        Math.min(safePage * PAGE_SIZE, results.length),
        " of ",
        results.length
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setPage((p) => Math.max(1, p - 1)),
            disabled: safePage === 1,
            className: "inline-flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1 disabled:opacity-40 hover:bg-accent transition",
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { className: "h-3.5 w-3.5" }),
              " Prev"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "px-2 tabular-nums", children: [
          "Page ",
          safePage,
          " / ",
          totalPages
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
            disabled: safePage === totalPages,
            className: "inline-flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1 disabled:opacity-40 hover:bg-accent transition",
            children: [
              "Next ",
              /* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5" })
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  RecordList as R
};
