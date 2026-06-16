import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { Handshake, Building2, Wrench, Activity, Users, Cpu, Compass, Layers, Info, Search, ChevronRight, X, Calendar, ExternalLink } from "lucide-react";
import { a as useDatasetRecords, l as TECHNICAL_SUPPORT_SERVICES, D as DATA_SEEDS, r as resolveAssetUrl } from "./router-ScoMlXed.js";
import { S as StickySectionNav } from "./sticky-section-nav-ay_A8ZSs.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "zod";
const serviceIcons = {
  "srv-1": Layers,
  "srv-2": Compass,
  "srv-3": Cpu,
  "srv-4": Users
};
function UnifiedDetailModal({
  item,
  themeColor,
  onClose
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  if (!item) return null;
  const hasGallery = !!(item.images && item.images.length > 0 || item.thumbnail);
  const galleryImages = [...item.thumbnail ? [item.thumbnail] : [], ...item.images || []].filter((v, i, self) => self.indexOf(v) === i);
  const hasDocs = !!(item.documents && item.documents.length > 0);
  const themeClasses = {
    emerald: {
      text: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    },
    teal: {
      text: "text-teal-500",
      bg: "bg-teal-500/10",
      border: "border-teal-500/20"
    },
    sky: {
      text: "text-sky-500",
      bg: "bg-sky-500/10",
      border: "border-sky-500/20"
    },
    amber: {
      text: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    }
  };
  const currentTheme = themeClasses[themeColor] || {
    text: "text-cyan-500",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20"
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300 animate-fade-in", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl text-foreground scrollbar-thin md:p-8 space-y-6", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsx("button", { onClick: onClose, className: "absolute top-4 right-4 rounded-full p-2 bg-secondary text-text-muted hover:text-foreground transition cursor-pointer hover:bg-secondary/80 border border-border/45", "aria-label": "Close modal", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2 pr-8 font-sans", children: [
      /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-5xs font-bold uppercase tracking-wider border ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border}`, children: item.researchFocus ? "Memorandum of Understanding" : item.purpose ? "Consultancy Activity" : "Partner Institution" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-black leading-snug text-foreground", children: item.organization || item.name || item.title || item.institution }),
      item.date && /* @__PURE__ */ jsxs("p", { className: "text-3xs font-mono text-text-muted flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
        " Date: ",
        item.date
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-5 border-t border-border/40 pt-4 font-sans text-xs", children: [
      item.researchFocus && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Research Focus Area" }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground leading-relaxed block mt-0.5", children: item.researchFocus })
      ] }),
      item.location && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Location" }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground leading-relaxed block mt-0.5", children: item.location })
      ] }),
      item.participants && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Participants / Cohorts" }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground leading-relaxed block mt-0.5", children: item.participants })
      ] }),
      item.purpose && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Activity Purpose" }),
        /* @__PURE__ */ jsx("p", { className: "text-text-secondary leading-relaxed font-normal mt-0.5", children: item.purpose })
      ] }),
      item.equipment && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Equipment" }),
        /* @__PURE__ */ jsx("p", { className: "text-text-secondary leading-relaxed font-normal mt-0.5", children: item.equipment })
      ] }),
      item.notes && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Historical Notes" }),
        /* @__PURE__ */ jsx("p", { className: "text-text-secondary leading-relaxed font-normal mt-0.5", children: item.notes })
      ] }),
      hasDocs && /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 pt-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Associated Documents" }),
        item.documents.map((doc, idx) => /* @__PURE__ */ jsxs("a", { href: resolveAssetUrl(doc), target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1.5 text-xs text-cyan-500 font-bold hover:underline mt-1", children: [
          "View Document ",
          idx + 1,
          " ",
          /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" })
        ] }, idx))
      ] }),
      hasGallery && galleryImages.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-4 border-t border-border/40", children: [
        /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Uploaded Photo Records" }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 grid-cols-1 sm:grid-cols-2 mt-2", children: galleryImages.map((img, idx) => /* @__PURE__ */ jsx("div", { className: "relative aspect-square overflow-hidden rounded-lg border border-border/40 bg-muted", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(img), alt: `Record photo ${idx + 1}`, className: "h-full w-full object-cover", loading: "lazy" }) }, idx)) })
      ] })
    ] })
  ] }) });
}
function CollaborationsPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState("emerald");
  const [searchQuery, setSearchQuery] = useState("");
  const mouRecords = useDatasetRecords("collaborations-mous", DATA_SEEDS["collaborations-mous"]);
  const consultancyInstitutions = useDatasetRecords("collaborations-institutions", DATA_SEEDS["collaborations-institutions"]);
  const consultancyActivities = useDatasetRecords("collaborations-activities", DATA_SEEDS["collaborations-activities"]);
  const openDetail = (item, theme) => {
    setSelectedItem(item);
    setSelectedTheme(theme);
  };
  const closeDetail = () => {
    setSelectedItem(null);
  };
  useMemo(() => {
    return [{
      label: "MoUs",
      count: mouRecords.length,
      theme: "emerald",
      sectionId: "mous",
      icon: Handshake
    }, {
      label: "Partner Institutions",
      count: consultancyInstitutions.length,
      theme: "sky",
      sectionId: "institutions",
      icon: Building2
    }, {
      label: "Technical Support Services",
      count: TECHNICAL_SUPPORT_SERVICES.length,
      theme: "teal",
      sectionId: "services",
      icon: Wrench
    }, {
      label: "Consultancy Activities",
      count: consultancyActivities.length,
      theme: "amber",
      sectionId: "activities",
      icon: Activity
    }];
  }, [mouRecords, consultancyInstitutions, consultancyActivities]);
  const filteredInstitutions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return consultancyInstitutions;
    return consultancyInstitutions.filter((inst) => (inst.name || inst.title || "").toLowerCase().includes(q) || (inst.location || "").toLowerCase().includes(q));
  }, [searchQuery, consultancyInstitutions]);
  const navItems = [{
    label: "MoUs",
    id: "mous",
    icon: Handshake,
    count: mouRecords.length,
    theme: "emerald"
  }, {
    label: "Technical Support",
    id: "services",
    icon: Wrench,
    count: TECHNICAL_SUPPORT_SERVICES.length,
    theme: "teal"
  }, {
    label: "Partner Institutions",
    id: "institutions",
    icon: Building2,
    count: filteredInstitutions.length,
    theme: "indigo"
  }, {
    label: "Consultancy Activities",
    id: "activities",
    icon: Activity,
    count: consultancyActivities.length,
    theme: "cyan"
  }];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground pb-20 transition-colors duration-300", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-gradient-to-b from-blue-950/20 via-background to-background py-16 px-6 border-b border-border/40", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(255,255,255,0))]" }),
      /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl text-center space-y-6 relative z-10", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-5xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/25", children: "ORL Partnerships" }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl font-sans", children: "Collaborations & Consultancy" }),
        /* @__PURE__ */ jsx("p", { className: "mx-auto max-w-xl text-xs font-semibold text-cyan-500 uppercase tracking-widest leading-relaxed", children: '"Alone we can do so little; together we can do so much"' }),
        /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-2xl border-l-2 border-border/60 pl-4 py-1.5 text-left bg-secondary/20 rounded-r-lg", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary leading-relaxed font-sans italic font-medium", children: '"We as a team are looking forward and willing to collaborate with research institute / organization / college / individual who shares equal interest and wishes to achieve high goals in underwater related fields."' }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(StickySectionNav, { items: navItems }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-6 mt-12 space-y-16", children: [
      /* @__PURE__ */ jsxs("section", { id: "mous", className: "scroll-mt-24 space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border/40 pb-4 text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-emerald-500", children: "Scientific Accords" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Memorandums of Understanding (MoU)" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-6 max-w-xl mx-auto py-4", children: mouRecords.map((mou, index) => {
          const year = mou.date ? mou.date.match(/\b\d{4}\b/)?.[0] || mou.date : "N/A";
          return /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col items-center", children: [
            index > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center my-2 select-none", children: [
              /* @__PURE__ */ jsx("div", { className: "w-0.5 h-8 bg-emerald-500/30" }),
              /* @__PURE__ */ jsx("span", { className: "text-emerald-500 font-bold text-xs", children: "↓" }),
              /* @__PURE__ */ jsx("div", { className: "w-0.5 h-8 bg-emerald-500/30" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 select-none", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/25 ring-4 ring-emerald-500/5", children: year }),
              /* @__PURE__ */ jsx("span", { className: "text-emerald-500 font-bold text-xs", children: "↓" })
            ] }),
            /* @__PURE__ */ jsxs("div", { onClick: () => openDetail(mou, "emerald"), className: "w-full rounded-xl border border-border bg-card p-5 hover:border-emerald-500/35 hover:shadow-xs hover:bg-emerald-500/5 transition duration-300 cursor-pointer text-center group select-none relative", children: [
              /* @__PURE__ */ jsx("span", { className: "absolute -top-2.5 left-1/2 -translate-x-1/2 text-5xs font-mono font-bold text-emerald-500 bg-background px-2 border border-emerald-500/20 rounded", children: "Active Accord" }),
              /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground text-xs leading-relaxed group-hover:text-emerald-500 transition-colors", children: mou.organization }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-text-secondary mt-1.5 max-w-md mx-auto leading-relaxed", children: [
                "Scope: ",
                mou.researchFocus
              ] }),
              /* @__PURE__ */ jsx("span", { className: "inline-block mt-3 text-5xs font-bold uppercase tracking-wider text-emerald-500 hover:underline", children: "View Scope & Notes" })
            ] })
          ] }, mou.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "services", className: "scroll-mt-24 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border/40 pb-4 text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-teal-500", children: "Resource Sharing" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Technical Support Services" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 grid-cols-2 sm:grid-cols-4", children: TECHNICAL_SUPPORT_SERVICES.map((srv) => {
          const IconComp = serviceIcons[srv.id] || Info;
          return /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card/60 hover:scale-[1.02] hover:border-teal-500/25 transition duration-300 flex flex-col items-center justify-center text-center gap-3 select-none hover:shadow-xs", children: [
            /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 shrink-0 shadow-xs", children: /* @__PURE__ */ jsx(IconComp, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-xs leading-snug font-sans max-w-[150px]", children: srv.title })
          ] }, srv.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "institutions", className: "scroll-mt-24 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-sky-500", children: "Collaboration Consortium" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Partner Institutions" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" }),
            /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search institutions...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none w-44 focus:border-sky-500/50 transition font-sans" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3", children: [
          filteredInstitutions.map((inst) => /* @__PURE__ */ jsxs("div", { onClick: () => openDetail(inst, "sky"), className: "p-4 rounded-xl border border-border bg-card/60 hover:border-sky-500/25 hover:shadow-xs transition duration-300 cursor-pointer flex items-center gap-3 group select-none", children: [
            /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full bg-gradient-to-br from-sky-500/10 to-sky-600/20 border border-sky-500/20 flex items-center justify-center text-sky-500 shrink-0 font-bold font-mono text-xs select-none", children: (inst.name || inst.title || "").charAt(0) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-0.5 min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-xs leading-snug group-hover:text-sky-500 transition-colors truncate", children: inst.name || inst.title }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-text-secondary leading-none", children: inst.location })
            ] })
          ] }, inst.id)),
          filteredInstitutions.length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-full text-center text-text-muted text-xs py-6", children: "No partner institutions match the active search." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "activities", className: "scroll-mt-24 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border/40 pb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-amber-500", children: "Consultancy Operations" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Recent Consultancy Activities" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-6 grid-cols-1", children: consultancyActivities.map((act) => /* @__PURE__ */ jsxs("div", { onClick: () => openDetail(act, "amber"), className: "p-6 rounded-2xl border border-border bg-card hover:border-amber-500/35 hover:shadow-md transition duration-300 flex flex-col md:flex-row gap-5 justify-between items-start cursor-pointer select-none group", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-3 flex-1 font-sans", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-5xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/25 uppercase font-mono tracking-wider", children: "Consultancy support" }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded bg-secondary text-text-secondary text-5xs font-mono font-bold border border-border/40", children: [
                "Date: ",
                act.date
              ] }),
              /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-5xs font-bold border border-amber-500/20", children: "Data Collection" })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "font-black text-foreground text-sm leading-tight group-hover:text-amber-500 transition-colors", children: act.institution }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-2 border-t border-border/40 text-xs", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Cohort Participants" }),
                /* @__PURE__ */ jsx("p", { className: "text-foreground font-semibold mt-0.5", children: act.participants })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Purpose" }),
                /* @__PURE__ */ jsx("p", { className: "text-text-secondary font-medium leading-relaxed mt-0.5", children: act.purpose })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 text-4xs font-black uppercase tracking-wider rounded border border-amber-500/20 bg-amber-500/5 group-hover:bg-amber-500/10 text-amber-500 transition cursor-pointer self-end md:self-center", children: [
            "View details ",
            /* @__PURE__ */ jsx(ChevronRight, { className: "h-3 w-3" })
          ] })
        ] }, act.id)) })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "pt-4 font-sans", children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-indigo-950/20 via-background to-background p-6 md:p-8 space-y-5", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_bottom_right,rgba(16,185,129,0.08),rgba(255,255,255,0))]" }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 space-y-4", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-5xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 uppercase font-mono tracking-wider", children: "Consortium Invitation" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-foreground", children: "Collaboration Opportunities" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3.5 text-xs leading-relaxed text-text-secondary font-medium", children: [
            /* @__PURE__ */ jsx("p", { children: '"We extend our help to Research Institute by providing technical support, the utilization of lab facilities, underwater equipment hiring, technical and manpower support for data collection and data processing."' }),
            /* @__PURE__ */ jsx("p", { className: "border-t border-border/40 pt-3.5", children: '"We as a team are looking forward and willing to collaborate with research institute/organization/college/individual who shares equal interest and wishes to achieve high goals in Underwater related fields"' })
          ] })
        ] })
      ] }) })
    ] }),
    selectedItem && /* @__PURE__ */ jsx(UnifiedDetailModal, { item: selectedItem, themeColor: selectedTheme, onClose: closeDetail })
  ] });
}
export {
  CollaborationsPage as component
};
