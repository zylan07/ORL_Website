import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { Image, Anchor, Layers, Calendar, Sparkles, Search, Camera, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { a as useDatasetRecords, j as Route, r as resolveAssetUrl, G as GALLERY_RECORDS } from "./router-ScoMlXed.js";
import { S as StickySectionNav } from "./sticky-section-nav-ay_A8ZSs.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "zod";
function ElegantPlaceholder({
  category,
  title
}) {
  const gradients = {
    research: "from-blue-950/40 via-sky-900/20 to-sky-950/40 text-sky-400 border-sky-500/20",
    field: "from-emerald-950/40 via-emerald-900/20 to-emerald-950/40 text-emerald-400 border-emerald-500/20",
    facilities: "from-teal-950/40 via-teal-900/20 to-teal-950/40 text-teal-400 border-teal-500/20",
    events: "from-amber-950/40 via-amber-900/20 to-amber-950/40 text-amber-400 border-amber-500/20",
    internships: "from-indigo-950/40 via-indigo-900/20 to-indigo-950/40 text-indigo-400 border-indigo-500/20"
  };
  const bgGradient = gradients[category] || gradients.research;
  return /* @__PURE__ */ jsxs("div", { className: `w-full h-44 rounded-lg bg-gradient-to-br ${bgGradient} border flex flex-col items-center justify-center p-4 text-center select-none overflow-hidden relative group-hover:scale-[1.01] transition duration-300`, children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px] opacity-40" }),
    /* @__PURE__ */ jsx(Sparkles, { className: "h-6 w-6 mb-2 opacity-75 animate-pulse" }),
    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono uppercase tracking-widest opacity-60", children: "ORL Archive" }),
    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-semibold text-text-muted mt-1.5 leading-snug line-clamp-2 px-2", children: title })
  ] });
}
function MediaModal({
  item,
  onClose
}) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const imagesList = useMemo(() => {
    const list = [];
    if (item.thumbnail) list.push(item.thumbnail);
    if (item.images && item.images.length > 0) {
      item.images.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list;
  }, [item]);
  const hasMultiple = imagesList.length > 1;
  const handlePrev = (e) => {
    e?.stopPropagation();
    setActiveImgIdx((prev) => prev === 0 ? imagesList.length - 1 : prev - 1);
  };
  const handleNext = (e) => {
    e?.stopPropagation();
    setActiveImgIdx((prev) => prev === imagesList.length - 1 ? 0 : prev + 1);
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasMultiple) {
        setActiveImgIdx((prev) => prev === 0 ? imagesList.length - 1 : prev - 1);
      } else if (e.key === "ArrowRight" && hasMultiple) {
        setActiveImgIdx((prev) => prev === imagesList.length - 1 ? 0 : prev + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, hasMultiple, imagesList.length]);
  const categoryLabels = {
    research: "Research Activity",
    field: "Field Activity",
    facilities: "Laboratory Infrastructure",
    events: "Event & Workshop",
    internships: "Internship Showcase"
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity duration-300 animate-fade-in", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl text-foreground scrollbar-thin md:p-8 space-y-6", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsx("button", { onClick: onClose, className: "absolute top-4 right-4 rounded-full p-2 bg-secondary text-text-muted hover:text-foreground transition cursor-pointer hover:bg-secondary/80 border border-border/45 z-10", "aria-label": "Close modal", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2.5 pr-8 font-sans", children: [
      /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-5xs font-bold uppercase tracking-wider bg-secondary border border-border/45 text-text-secondary", children: categoryLabels[item.category] || "Archive Record" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-black leading-snug text-foreground", children: item.title }),
      item.date && /* @__PURE__ */ jsxs("p", { className: "text-3xs font-mono text-text-muted", children: [
        "Date: ",
        item.date
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted flex items-center justify-center", children: imagesList.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(imagesList[activeImgIdx]), alt: `${item.title} - Image ${activeImgIdx + 1}`, className: "max-h-full max-w-full object-contain select-none transition duration-300", loading: "lazy" }),
      hasMultiple && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("button", { onClick: handlePrev, className: "absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition cursor-pointer border border-white/10", "aria-label": "Previous image", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx("button", { onClick: handleNext, className: "absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition cursor-pointer border border-white/10", "aria-label": "Next image", children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-5 w-5" }) })
      ] }),
      hasMultiple && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-black/60 text-white text-[10px] font-mono border border-white/10 select-none", children: [
        activeImgIdx + 1,
        " / ",
        imagesList.length
      ] })
    ] }) : (
      /* Image absent: Show themed elegant fallback inside lightbox */
      /* @__PURE__ */ jsxs("div", { className: "w-full h-full bg-gradient-to-br from-indigo-950/50 via-slate-900 to-indigo-950/50 flex flex-col items-center justify-center text-center p-6 select-none text-indigo-400", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "h-10 w-10 mb-2 opacity-70 animate-pulse" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-mono uppercase tracking-widest text-text-muted", children: "No Media Uploaded" }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-text-muted mt-2 max-w-xs leading-relaxed", children: "Images will appear here automatically once uploaded through the Admin Panel." })
      ] })
    ) }),
    hasMultiple && /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-2 overflow-x-auto py-1 scrollbar-thin", children: imagesList.map((img, idx) => /* @__PURE__ */ jsx("button", { onClick: () => setActiveImgIdx(idx), className: `h-12 w-20 rounded-md overflow-hidden border transition shrink-0 cursor-pointer ${activeImgIdx === idx ? "border-cyan-500 ring-2 ring-cyan-500/20" : "border-border/60 opacity-60 hover:opacity-100"}`, children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(img), alt: "thumbnail", className: "h-full w-full object-cover", loading: "lazy" }) }, idx)) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-4 border-t border-border/40 font-sans text-xs", children: [
      item.description && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Description" }),
        /* @__PURE__ */ jsx("p", { className: "text-text-secondary leading-relaxed font-normal mt-0.5", children: item.description })
      ] }),
      item.tags && item.tags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Metadata Tags" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: item.tags.map((tag, tIdx) => /* @__PURE__ */ jsx("span", { className: "text-4xs font-mono font-bold bg-secondary text-text-secondary border border-border/40 px-2 py-0.5 rounded", children: tag }, tIdx)) })
      ] }),
      item.documents && item.documents.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold font-bold", children: "Associated Documents" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1", children: item.documents.map((doc, docIdx) => /* @__PURE__ */ jsxs("a", { href: resolveAssetUrl(doc), target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1.5 text-xs text-cyan-500 font-bold hover:underline", children: [
          "View Document ",
          docIdx + 1,
          " ",
          /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" })
        ] }, docIdx)) })
      ] })
    ] })
  ] }) });
}
const STATIC_GALLERY_RECORDS = GALLERY_RECORDS;
function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const GALLERY_RECORDS2 = useDatasetRecords("gallery-records", STATIC_GALLERY_RECORDS);
  const {
    tab
  } = Route.useSearch();
  useEffect(() => {
    if (tab) {
      const el = document.getElementById(tab);
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [tab]);
  const openDetail = (item) => {
    setSelectedItem(item);
  };
  const closeDetail = () => {
    setSelectedItem(null);
  };
  const availableYears = useMemo(() => {
    const years = /* @__PURE__ */ new Set();
    GALLERY_RECORDS2.forEach((rec) => {
      if (rec.date) {
        const match = rec.date.match(/\b\d{4}\b/);
        if (match) {
          years.add(match[0]);
        }
      }
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, []);
  const filteredRecords = useMemo(() => {
    let list = GALLERY_RECORDS2;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((rec) => rec.title.toLowerCase().includes(q) || rec.category.toLowerCase().includes(q) || rec.description && rec.description.toLowerCase().includes(q) || rec.tags && rec.tags.some((t) => t.toLowerCase().includes(q)));
    }
    if (selectedCategory !== "all") {
      list = list.filter((rec) => rec.category === selectedCategory);
    }
    if (selectedYear !== "all") {
      list = list.filter((rec) => {
        if (!rec.date) return false;
        const match = rec.date.match(/\b\d{4}\b/);
        return match ? match[0] === selectedYear : false;
      });
    }
    return list;
  }, [searchQuery, selectedCategory, selectedYear]);
  const categoriesList = useMemo(() => {
    return [{
      id: "research",
      label: "Research Activities",
      theme: "research",
      icon: Image
    }, {
      id: "field",
      label: "Field Activities",
      theme: "field",
      icon: Anchor
    }, {
      id: "facilities",
      label: "Facilities",
      theme: "facilities",
      icon: Layers
    }, {
      id: "events",
      label: "Events & Workshops",
      theme: "events",
      icon: Calendar
    }, {
      id: "internships",
      label: "Internships",
      theme: "internships",
      icon: Sparkles
    }];
  }, []);
  const researchRecs = useMemo(() => filteredRecords.filter((r) => r.category === "research"), [filteredRecords]);
  const fieldRecs = useMemo(() => filteredRecords.filter((r) => r.category === "field"), [filteredRecords]);
  const facilitiesRecs = useMemo(() => filteredRecords.filter((r) => r.category === "facilities"), [filteredRecords]);
  const eventsRecs = useMemo(() => filteredRecords.filter((r) => r.category === "events"), [filteredRecords]);
  const internshipsRecs = useMemo(() => filteredRecords.filter((r) => r.category === "internships"), [filteredRecords]);
  const hasMatches = filteredRecords.length > 0;
  const navItems = useMemo(() => [{
    label: "Research",
    id: "research",
    icon: Image,
    count: GALLERY_RECORDS2.filter((r) => r.category === "research").length,
    theme: "sky"
  }, {
    label: "Field Activities",
    id: "field",
    icon: Anchor,
    count: GALLERY_RECORDS2.filter((r) => r.category === "field").length,
    theme: "emerald"
  }, {
    label: "Facilities",
    id: "facilities",
    icon: Layers,
    count: GALLERY_RECORDS2.filter((r) => r.category === "facilities").length,
    theme: "teal"
  }, {
    label: "Events",
    id: "events",
    icon: Calendar,
    count: GALLERY_RECORDS2.filter((r) => r.category === "events").length,
    theme: "cyan"
  }, {
    label: "Internships",
    id: "internships",
    icon: Sparkles,
    count: GALLERY_RECORDS2.filter((r) => r.category === "internships").length,
    theme: "indigo"
  }], [GALLERY_RECORDS2]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground pb-20 transition-colors duration-300", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-gradient-to-b from-blue-950/20 via-background to-background py-16 px-6 border-b border-border/40", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(255,255,255,0))]" }),
      /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl text-center space-y-6 relative z-10", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-5xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/25", children: "ORL Media Center" }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl font-sans", children: "Photo Gallery" }),
        /* @__PURE__ */ jsx("p", { className: "mx-auto max-w-xl text-xs font-semibold text-cyan-500 uppercase tracking-widest leading-relaxed", children: "Professional media archive of subsea deployments, trials, and research" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(StickySectionNav, { items: navItems }),
    /* @__PURE__ */ jsx("section", { className: "sticky top-[104px] z-20 w-full border-b border-border bg-background/85 backdrop-blur-md px-6 py-4 shadow-xs", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl flex flex-col sm:flex-row items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:flex-1", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" }),
        /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search by title, keywords, tags...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-9 pr-4 py-2 w-full text-xs rounded-xl border border-border bg-card/50 outline-none focus:border-cyan-500/50 transition font-sans" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 w-full sm:w-auto", children: [
        /* @__PURE__ */ jsxs("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "text-xs bg-card/65 border border-border rounded-xl px-3 py-2 outline-none focus:border-cyan-500/50 cursor-pointer w-full sm:w-40 font-sans", children: [
          /* @__PURE__ */ jsx("option", { value: "all", children: "All Categories" }),
          categoriesList.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.label }, c.id))
        ] }),
        /* @__PURE__ */ jsxs("select", { value: selectedYear, onChange: (e) => setSelectedYear(e.target.value), className: "text-xs bg-card/65 border border-border rounded-xl px-3 py-2 outline-none focus:border-cyan-500/50 cursor-pointer w-full sm:w-28 font-mono", children: [
          /* @__PURE__ */ jsx("option", { value: "all", children: "All Years" }),
          availableYears.map((yr) => /* @__PURE__ */ jsx("option", { value: yr, children: yr }, yr))
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl px-6 mt-12 space-y-16", children: [
      researchRecs.length > 0 && /* @__PURE__ */ jsxs("section", { id: "research", className: "scroll-mt-28 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-sky-500/20 pb-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground font-sans", children: "Research Activities" }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-mono font-bold text-sky-600 dark:text-sky-400", children: [
            researchRecs.length,
            " ",
            researchRecs.length === 1 ? "Record" : "Records"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3", children: researchRecs.map((rec) => /* @__PURE__ */ jsxs("div", { onClick: () => openDetail(rec), className: "rounded-xl border border-border bg-card p-4 hover:border-sky-500/35 transition duration-300 hover:scale-[1.02] cursor-pointer hover:shadow-xs select-none group", children: [
          /* @__PURE__ */ jsx("div", { className: "relative mb-3 rounded-lg overflow-hidden border border-border bg-muted", children: rec.thumbnail ? /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(rec.thumbnail), alt: rec.title, className: "w-full h-44 object-cover", loading: "lazy" }) : /* @__PURE__ */ jsx(ElegantPlaceholder, { category: "research", title: rec.title }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 font-sans", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-5xs font-bold uppercase tracking-wider text-sky-500", children: "Research" }),
              rec.date && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-text-muted font-mono", children: rec.date })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-foreground leading-snug truncate", children: rec.title }),
            rec.description && /* @__PURE__ */ jsx("p", { className: "text-3xs text-text-secondary leading-relaxed line-clamp-2", children: rec.description })
          ] })
        ] }, rec.id)) })
      ] }),
      fieldRecs.length > 0 && /* @__PURE__ */ jsxs("section", { id: "field", className: "scroll-mt-28 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-emerald-500/20 pb-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground font-sans", children: "Field Activities" }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400", children: [
            fieldRecs.length,
            " ",
            fieldRecs.length === 1 ? "Record" : "Records"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3", children: fieldRecs.map((rec) => /* @__PURE__ */ jsxs("div", { onClick: () => openDetail(rec), className: "rounded-xl border border-border bg-card p-4 hover:border-emerald-500/35 transition duration-300 hover:scale-[1.02] cursor-pointer hover:shadow-xs select-none group", children: [
          /* @__PURE__ */ jsx("div", { className: "relative mb-3 rounded-lg overflow-hidden border border-border bg-muted", children: rec.thumbnail ? /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(rec.thumbnail), alt: rec.title, className: "w-full h-44 object-cover", loading: "lazy" }) : /* @__PURE__ */ jsx(ElegantPlaceholder, { category: "field", title: rec.title }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 font-sans", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-5xs font-bold uppercase tracking-wider text-emerald-500", children: "Field Testing" }),
              rec.date && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-text-muted font-mono", children: rec.date })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-foreground leading-snug truncate", children: rec.title }),
            rec.description && /* @__PURE__ */ jsx("p", { className: "text-3xs text-text-secondary leading-relaxed line-clamp-2", children: rec.description })
          ] })
        ] }, rec.id)) })
      ] }),
      facilitiesRecs.length > 0 && /* @__PURE__ */ jsxs("section", { id: "facilities", className: "scroll-mt-28 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-teal-500/20 pb-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground font-sans", children: "Laboratory Infrastructure" }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-mono font-bold text-teal-600 dark:text-teal-400", children: [
            facilitiesRecs.length,
            " ",
            facilitiesRecs.length === 1 ? "Record" : "Records"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3", children: facilitiesRecs.map((rec) => /* @__PURE__ */ jsxs("div", { onClick: () => openDetail(rec), className: "rounded-xl border border-border bg-card p-4 hover:border-teal-500/35 transition duration-300 hover:scale-[1.02] cursor-pointer hover:shadow-xs select-none group", children: [
          /* @__PURE__ */ jsx("div", { className: "relative mb-3 rounded-lg overflow-hidden border border-border bg-muted", children: rec.thumbnail ? /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(rec.thumbnail), alt: rec.title, className: "w-full h-44 object-cover", loading: "lazy" }) : /* @__PURE__ */ jsx(ElegantPlaceholder, { category: "facilities", title: rec.title }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 font-sans", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-5xs font-bold uppercase tracking-wider text-teal-500", children: "Facilities" }),
              rec.date && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-text-muted font-mono", children: rec.date })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-foreground leading-snug truncate", children: rec.title }),
            rec.description && /* @__PURE__ */ jsx("p", { className: "text-3xs text-text-secondary leading-relaxed line-clamp-2", children: rec.description })
          ] })
        ] }, rec.id)) })
      ] }),
      eventsRecs.length > 0 && /* @__PURE__ */ jsxs("section", { id: "events", className: "scroll-mt-28 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-amber-500/20 pb-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground font-sans", children: "Events & Workshops" }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-mono font-bold text-amber-600 dark:text-amber-400", children: [
            eventsRecs.length,
            " ",
            eventsRecs.length === 1 ? "Record" : "Records"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3", children: eventsRecs.map((rec) => /* @__PURE__ */ jsxs("div", { onClick: () => openDetail(rec), className: "rounded-xl border border-border bg-card p-4 hover:border-amber-500/35 transition duration-300 hover:scale-[1.02] cursor-pointer hover:shadow-xs select-none group", children: [
          /* @__PURE__ */ jsx("div", { className: "relative mb-3 rounded-lg overflow-hidden border border-border bg-muted", children: rec.thumbnail ? /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(rec.thumbnail), alt: rec.title, className: "w-full h-44 object-cover", loading: "lazy" }) : /* @__PURE__ */ jsx(ElegantPlaceholder, { category: "events", title: rec.title }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 font-sans", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-5xs font-bold uppercase tracking-wider text-amber-500", children: "Events" }),
              rec.date && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-text-muted font-mono", children: rec.date })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-foreground leading-snug truncate", children: rec.title }),
            rec.description && /* @__PURE__ */ jsx("p", { className: "text-3xs text-text-secondary leading-relaxed line-clamp-2", children: rec.description })
          ] })
        ] }, rec.id)) })
      ] }),
      internshipsRecs.length > 0 && /* @__PURE__ */ jsxs("section", { id: "internships", className: "scroll-mt-28 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-indigo-500/20 pb-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground font-sans", children: "Internships" }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400", children: [
            internshipsRecs.length,
            " ",
            internshipsRecs.length === 1 ? "Record" : "Records"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3", children: internshipsRecs.map((rec) => /* @__PURE__ */ jsxs("div", { onClick: () => openDetail(rec), className: "rounded-xl border border-border bg-card p-4 hover:border-indigo-500/35 transition duration-300 hover:scale-[1.02] cursor-pointer hover:shadow-xs select-none group animate-fade-in", children: [
          /* @__PURE__ */ jsx("div", { className: "relative mb-3 rounded-lg overflow-hidden border border-border bg-muted", children: rec.thumbnail ? /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(rec.thumbnail), alt: rec.title, className: "w-full h-44 object-cover", loading: "lazy" }) : /* @__PURE__ */ jsx(ElegantPlaceholder, { category: "internships", title: rec.title }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 font-sans", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-5xs font-bold uppercase tracking-wider text-indigo-500", children: "Internship" }),
              rec.date && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-text-muted font-mono", children: rec.date })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-foreground leading-snug line-clamp-1", children: rec.title }),
            rec.description && /* @__PURE__ */ jsx("p", { className: "text-3xs text-text-secondary leading-relaxed line-clamp-2", children: rec.description })
          ] })
        ] }, rec.id)) })
      ] }),
      !hasMatches && /* @__PURE__ */ jsxs("div", { className: "text-center py-16 rounded-xl border border-dashed border-border/80 bg-card max-w-xl mx-auto space-y-4 shadow-sm select-none font-sans", children: [
        /* @__PURE__ */ jsx(Camera, { className: "h-8 w-8 text-text-muted mx-auto animate-pulse" }),
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-foreground uppercase tracking-wider", children: "No Archive Matches" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary max-w-sm mx-auto leading-relaxed", children: "No photo records or internship cards matched your current search filters. Please adjust your text query or dropdown selections." })
      ] })
    ] }),
    selectedItem && /* @__PURE__ */ jsx(MediaModal, { item: selectedItem, onClose: closeDetail })
  ] });
}
export {
  GalleryPage as component
};
