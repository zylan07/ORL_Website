import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { a as useDatasetRecords, P as PLACEHOLDER_IMAGES, r as resolveAssetUrl, D as DATA_SEEDS, E as EQUIPMENT_DATABASE } from "./router-ScoMlXed.js";
import { S as StickySectionNav } from "./sticky-section-nav-ay_A8ZSs.js";
import { FlaskConical, BookOpen, Cpu, Anchor, Users, Search, ChevronUp, ChevronDown, Shield, Compass, Layers, Activity, ChevronRight, MapPin, ArrowRight, X, ExternalLink, Sparkles } from "lucide-react";
import "@tanstack/react-query";
import "zod";
const FACILITIES_CATEGORIES = [{
  id: "underwater-platforms",
  name: "Underwater Platforms",
  icon: Compass,
  count: EQUIPMENT_DATABASE.filter((eq) => eq.category === "underwater-platforms").length,
  description: "ROVs, underwater drones and inspection systems.",
  thumbnail: PLACEHOLDER_IMAGES.facility,
  images: [PLACEHOLDER_IMAGES.facility]
}, {
  id: "acoustic-systems",
  name: "Acoustic & Survey Systems",
  icon: Anchor,
  count: EQUIPMENT_DATABASE.filter((eq) => eq.category === "acoustic-systems").length,
  description: "Sonars, hydrophones and survey instrumentation.",
  thumbnail: PLACEHOLDER_IMAGES.facility,
  images: [PLACEHOLDER_IMAGES.facility]
}, {
  id: "test-facilities",
  name: "Test Facilities",
  icon: Layers,
  count: EQUIPMENT_DATABASE.filter((eq) => eq.category === "test-facilities").length,
  description: "Indoor transparent basins, testing tanks, and soil beds.",
  thumbnail: PLACEHOLDER_IMAGES.facility,
  images: [PLACEHOLDER_IMAGES.facility]
}, {
  id: "sensors-comm",
  name: "Sensors & Communication",
  icon: Cpu,
  count: EQUIPMENT_DATABASE.filter((eq) => eq.category === "sensors-comm").length,
  description: "Inertial measurement sensors, transceivers and cameras.",
  thumbnail: PLACEHOLDER_IMAGES.facility,
  images: [PLACEHOLDER_IMAGES.facility]
}, {
  id: "field-equipment",
  name: "Field Equipment",
  icon: Activity,
  count: EQUIPMENT_DATABASE.filter((eq) => eq.category === "field-equipment").length,
  description: "Spools, winches, amplifiers and ocean safety gear.",
  thumbnail: PLACEHOLDER_IMAGES.facility,
  images: [PLACEHOLDER_IMAGES.facility]
}];
function DetailModal({
  item,
  type,
  onClose
}) {
  if (!item || !type) return null;
  const specsArray = useMemo(() => {
    if (!item.specs) return [];
    if (Array.isArray(item.specs)) return item.specs;
    if (typeof item.specs === "string") {
      try {
        const parsed = JSON.parse(item.specs);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return item.specs.split(",").map((s) => {
          const parts = s.split(":");
          return {
            label: parts[0]?.trim() || "Spec",
            value: parts.slice(1).join(":")?.trim() || ""
          };
        });
      }
    }
    return [];
  }, [item.specs]);
  const teamArray = useMemo(() => {
    if (!item.team) return [];
    if (Array.isArray(item.team)) return item.team;
    if (typeof item.team === "string") {
      try {
        const parsed = JSON.parse(item.team);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return item.team.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }
    return [];
  }, [item.team]);
  const equipmentTagsArray = useMemo(() => {
    if (!item.equipmentTags) return [];
    if (Array.isArray(item.equipmentTags)) return item.equipmentTags;
    if (typeof item.equipmentTags === "string") {
      try {
        const parsed = JSON.parse(item.equipmentTags);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return item.equipmentTags.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }
    return [];
  }, [item.equipmentTags]);
  const hasOverview = !!(item.description || item.purpose);
  const hasProjectDetails = !!(item.fundingAgency || item.amount || item.duration || item.pi || item.copi || item.role || item.location || item.date || specsArray.length > 0 || item.url);
  const hasTeam = teamArray.length > 0;
  const hasEquipment = equipmentTagsArray.length > 0;
  const hasPublications = !!(item.publicationCount && item.publicationCount > 0);
  const hasGallery = !!(item.images && item.images.length > 0 || item.thumbnail || item.image);
  const modalThumbnail = item.thumbnail || item.image;
  const galleryImages = useMemo(() => {
    const list = [];
    if (modalThumbnail) list.push(modalThumbnail);
    if (item.images && Array.isArray(item.images)) {
      item.images.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list;
  }, [modalThumbnail, item.images]);
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-cyan-500/20 bg-card p-6 shadow-2xl text-foreground scrollbar-thin md:p-8 space-y-6", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsx("button", { onClick: onClose, className: "absolute top-4 right-4 rounded-full p-2 bg-secondary text-text-muted hover:text-foreground transition cursor-pointer hover:bg-secondary/80", "aria-label": "Close modal", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3 pr-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-5xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-500 border border-cyan-500/25", children: type === "project" ? `${item.type} project` : type }),
        item.status && /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-5xs font-bold uppercase tracking-wider border ${item.status === "Ongoing" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : item.status === "Thesis Submitted" ? "bg-sky-500/10 text-sky-500 border-sky-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"}`, children: item.status }),
        item.activityType && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-5xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20", children: item.activityType })
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-foreground leading-snug font-sans", children: item.title || item.name }),
      item.scholar && /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-secondary font-medium font-sans", children: [
        "Scholar: ",
        /* @__PURE__ */ jsx("span", { className: "text-foreground", children: item.scholar })
      ] }),
      item.researchArea && /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-secondary font-medium font-sans", children: [
        "Area: ",
        /* @__PURE__ */ jsx("span", { className: "text-foreground", children: item.researchArea })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-6", children: type === "activity" ? (
      // Dedicated Field Activity modal layout
      /* @__PURE__ */ jsxs(Fragment, { children: [
        hasGallery && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4 border-t border-border/30 first:pt-0 first:border-0 font-sans", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono", children: "Gallery" }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-4 grid-cols-1 sm:grid-cols-2", children: galleryImages.map((img, index) => /* @__PURE__ */ jsx("div", { className: "relative aspect-video overflow-hidden rounded-lg border border-border/40 bg-muted", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(img), alt: `${item.title || item.name || "Activity asset"} ${index + 1}`, className: "h-full w-full object-cover" }) }, index)) })
        ] }),
        item.description && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4 border-t border-border/30", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono", children: "Overview" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary leading-relaxed font-sans", children: item.description })
        ] }),
        item.location && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4 border-t border-border/30", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono", children: "Location" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-sans text-foreground font-semibold", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-cyan-500 shrink-0" }),
            /* @__PURE__ */ jsx("span", { children: item.location })
          ] })
        ] }),
        item.date && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4 border-t border-border/30", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono", children: "Date" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-foreground font-sans", children: item.date })
        ] }),
        hasEquipment && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4 border-t border-border/30 font-sans", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono", children: "Equipment Used" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: equipmentTagsArray.map((tag, tIdx) => /* @__PURE__ */ jsx("span", { className: "text-4xs font-mono font-bold bg-indigo-500/10 text-indigo-500 px-2.5 py-1 rounded border border-indigo-500/25", children: tag }, tIdx)) })
        ] }),
        hasTeam && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4 border-t border-border/30 font-sans", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono", children: "Team Members" }),
          /* @__PURE__ */ jsx("ul", { className: "grid gap-2 sm:grid-cols-2", children: teamArray.map((member, mIdx) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-xs text-text-secondary bg-secondary/30 px-3 py-2 rounded-lg border border-border/10", children: [
            /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: member })
          ] }, mIdx)) })
        ] }),
        item.url && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4 border-t border-border/30 font-sans", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono", children: "Additional Details" }),
          /* @__PURE__ */ jsx("div", { className: "pt-1", children: /* @__PURE__ */ jsxs("a", { href: item.url, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1.5 text-xs text-cyan-500 font-bold hover:underline", children: [
            "View System Documentation ",
            /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" })
          ] }) })
        ] })
      ] })
    ) : (
      // Projects and Equipment standard layout
      /* @__PURE__ */ jsxs(Fragment, { children: [
        hasOverview && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4 border-t border-border/30 first:pt-0 first:border-0", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono", children: "Overview" }),
          item.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary leading-relaxed font-sans", children: item.description }),
          item.purpose && /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary leading-relaxed font-sans", children: item.purpose })
        ] }),
        hasProjectDetails && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4 border-t border-border/30 first:pt-0 first:border-0", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono font-bold", children: "Details" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans", children: [
            item.fundingAgency && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-5xs font-bold uppercase tracking-wider text-text-muted block", children: "Funding Agency" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: item.fundingAgency })
            ] }),
            item.amount && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-5xs font-bold uppercase tracking-wider text-text-muted block", children: "Project Cost / Grant" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: item.amount })
            ] }),
            item.duration && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-5xs font-bold uppercase tracking-wider text-text-muted block", children: "Duration" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: item.duration })
            ] }),
            item.role && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-5xs font-bold uppercase tracking-wider text-text-muted block", children: "Supervisor Role" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: item.role })
            ] }),
            item.pi && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-5xs font-bold uppercase tracking-wider text-text-muted block", children: "Principal Investigator (PI)" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: item.pi })
            ] }),
            item.copi && /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-5xs font-bold uppercase tracking-wider text-text-muted block", children: "Co-Investigator(s) (Co-PI)" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: item.copi })
            ] })
          ] }),
          specsArray.length > 0 && /* @__PURE__ */ jsxs("div", { className: "border-t border-border/20 pt-3 space-y-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs font-bold uppercase tracking-wider text-text-muted block", children: "Technical Specifications" }),
            /* @__PURE__ */ jsx("div", { className: "grid gap-2 sm:grid-cols-2", children: specsArray.map((spec, sIdx) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start text-xs border-b border-border/10 pb-1.5 pr-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-text-muted font-medium", children: spec.label }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-right", children: spec.value })
            ] }, sIdx)) })
          ] }),
          item.url && /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxs("a", { href: item.url, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1.5 text-xs text-cyan-500 font-bold hover:underline", children: [
            "View System Documentation ",
            /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" })
          ] }) })
        ] }),
        hasTeam && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4 border-t border-border/30 font-sans", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono", children: "Team Members" }),
          /* @__PURE__ */ jsx("ul", { className: "grid gap-2 sm:grid-cols-2", children: teamArray.map((member, mIdx) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-xs text-text-secondary bg-secondary/30 px-3 py-2 rounded-lg border border-border/10", children: [
            /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: member })
          ] }, mIdx)) })
        ] }),
        hasPublications && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4 border-t border-border/30 font-sans", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono", children: "Publications" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-secondary/15 rounded-xl border border-border/30", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5 text-cyan-500 animate-pulse" }),
              /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                /* @__PURE__ */ jsx("div", { className: "text-base font-black text-cyan-500 leading-none", children: item.publicationCount }),
                /* @__PURE__ */ jsx("span", { className: "text-5xs font-bold text-text-secondary uppercase tracking-wider", children: "Publications Produced" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Link, { to: "/publications", className: "inline-flex items-center gap-1.5 text-xs text-cyan-500 font-bold hover:underline", children: [
              "View Publications Catalog ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5" })
            ] })
          ] })
        ] }),
        item.documents && item.documents.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4 border-t border-border/30 font-sans", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono", children: "Associated Documents" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: item.documents.map((doc, docIdx) => /* @__PURE__ */ jsxs("a", { href: resolveAssetUrl(doc), target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1.5 text-xs text-cyan-500 font-bold hover:underline", children: [
            "View Report ",
            docIdx + 1,
            " ",
            /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" })
          ] }, docIdx)) })
        ] }),
        hasGallery && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4 border-t border-border/30 font-sans", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono", children: "Gallery" }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-4 grid-cols-1 sm:grid-cols-2", children: galleryImages.map((img, index) => /* @__PURE__ */ jsx("div", { className: "relative aspect-video overflow-hidden rounded-lg border border-border/40 bg-muted", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(img), alt: `${item.title || item.name || "Asset"} ${index + 1}`, className: "h-full w-full object-cover" }) }, index)) })
        ] })
      ] })
    ) })
  ] }) });
}
function ResearchPage() {
  const PROJECTS_DATABASE2 = useDatasetRecords("research-projects", DATA_SEEDS["research-projects"]);
  const EQUIPMENT_DATABASE2 = useDatasetRecords("research-equipment", DATA_SEEDS["research-equipment"]);
  const FIELD_ACTIVITIES_DATABASE2 = useDatasetRecords("research-activities", DATA_SEEDS["research-activities"]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [expandedProjects, setExpandedProjects] = useState({
    external: true,
    internal: false,
    student: false,
    phd: false
  });
  const toggleProjectSection = (sec) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [sec]: !prev[sec]
    }));
  };
  const [studentSearch, setStudentSearch] = useState("");
  const [studentSortField, setStudentSortField] = useState(null);
  const [studentSortOrder, setStudentSortOrder] = useState("asc");
  const processedStudentProjects = useMemo(() => {
    let list = PROJECTS_DATABASE2.filter((p) => p.type === "student");
    if (studentSearch.trim()) {
      const q = studentSearch.toLowerCase().trim();
      list = list.filter((p) => String(p.title ?? "").toLowerCase().includes(q));
    }
    if (studentSortField) {
      list.sort((a, b) => {
        let valA = "";
        let valB = "";
        if (studentSortField === "title") {
          valA = String(a.title ?? "").toLowerCase();
          valB = String(b.title ?? "").toLowerCase();
        } else if (studentSortField === "amount") {
          const parseAmount = (str) => {
            if (!str) return 0;
            const match = str.match(/[\d\.]+/);
            return match ? parseFloat(match[0]) : 0;
          };
          valA = parseAmount(a.amount);
          valB = parseAmount(b.amount);
        } else if (studentSortField === "duration") {
          valA = String(a.duration ?? "");
          valB = String(b.duration ?? "");
        } else if (studentSortField === "agency") {
          valA = String(a.fundingAgency ?? "").toLowerCase();
          valB = String(b.fundingAgency ?? "").toLowerCase();
        } else if (studentSortField === "role") {
          valA = String(a.role ?? "").toLowerCase();
          valB = String(b.role ?? "").toLowerCase();
        }
        if (valA < valB) return studentSortOrder === "asc" ? -1 : 1;
        if (valA > valB) return studentSortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return list;
  }, [studentSearch, studentSortField, studentSortOrder]);
  const handleStudentSort = (field) => {
    if (studentSortField === field) {
      setStudentSortOrder(studentSortOrder === "asc" ? "desc" : "asc");
    } else {
      setStudentSortField(field);
      setStudentSortOrder("asc");
    }
  };
  const [projectSearch, setProjectSearch] = useState("");
  const [projectAgency, setProjectAgency] = useState("All");
  const [projectStatus, setProjectStatus] = useState("All");
  const [facilitiesSearch, setFacilitiesSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("underwater-platforms");
  const [activitiesSearch, setActivitiesSearch] = useState("");
  const [activitiesYear, setActivitiesYear] = useState("All");
  const openDetail = (item, type) => {
    setSelectedItem(item);
    setSelectedType(type);
  };
  const closeDetail = () => {
    setSelectedItem(null);
    setSelectedType(null);
  };
  const agencies = useMemo(() => {
    const list = /* @__PURE__ */ new Set();
    PROJECTS_DATABASE2.forEach((p) => {
      if (p.fundingAgency) {
        if (p.fundingAgency.includes("MoES")) list.add("MoES");
        else if (p.fundingAgency.includes("DST")) list.add("DST");
        else if (p.fundingAgency.includes("TNSCST")) list.add("TNSCST");
        else if (p.fundingAgency.includes("NIOT")) list.add("NIOT");
        else if (p.fundingAgency.includes("SSNCE")) list.add("SSNCE");
        else list.add("Internal");
      }
    });
    return ["All", ...Array.from(list)];
  }, []);
  const statuses = ["All", "Ongoing", "Completed", "Coursework Completed", "Thesis Submitted"];
  const years = useMemo(() => {
    const list = /* @__PURE__ */ new Set();
    FIELD_ACTIVITIES_DATABASE2.forEach((fa) => {
      list.add(fa.year.toString());
    });
    return ["All", ...Array.from(list).sort().reverse()];
  }, []);
  const filteredProjects = useMemo(() => {
    return PROJECTS_DATABASE2.filter((p) => {
      const q = String(projectSearch ?? "").toLowerCase();
      const matchesSearch = String(p.title ?? "").toLowerCase().includes(q) || String(p.scholar ?? "").toLowerCase().includes(q) || String(p.researchArea ?? "").toLowerCase().includes(q) || String(p.fundingAgency ?? "").toLowerCase().includes(q);
      let matchesAgency = true;
      if (projectAgency !== "All") {
        if (projectAgency === "Internal") {
          matchesAgency = String(p.fundingAgency ?? "").includes("Internal") || p.fundingAgency === "SSNCE Internal Funding";
        } else {
          matchesAgency = String(p.fundingAgency ?? "").includes(projectAgency) || false;
        }
      }
      const matchesStatus = projectStatus === "All" || p.status === projectStatus;
      return matchesSearch && matchesAgency && matchesStatus;
    });
  }, [projectSearch, projectAgency, projectStatus]);
  const filteredEquipment = useMemo(() => {
    return EQUIPMENT_DATABASE2.filter((eq) => {
      const matchesCategory = eq.category === activeCategory;
      const q = String(facilitiesSearch ?? "").toLowerCase();
      const matchesSearch = String(eq.name ?? "").toLowerCase().includes(q) || String(eq.shortDescription ?? "").toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, facilitiesSearch]);
  const filteredActivities = useMemo(() => {
    return FIELD_ACTIVITIES_DATABASE2.filter((fa) => {
      const q = String(activitiesSearch ?? "").toLowerCase();
      const tagsArray = Array.isArray(fa.equipmentTags) ? fa.equipmentTags : typeof fa.equipmentTags === "string" ? fa.equipmentTags.split(",").map((t) => t.trim()).filter(Boolean) : [];
      const matchesSearch = String(fa.title ?? "").toLowerCase().includes(q) || String(fa.location ?? "").toLowerCase().includes(q) || tagsArray.some((t) => String(t ?? "").toLowerCase().includes(q));
      const matchesYear = activitiesYear === "All" || fa.year.toString() === activitiesYear;
      return matchesSearch && matchesYear;
    });
  }, [activitiesSearch, activitiesYear]);
  const groupedActivities = useMemo(() => {
    const groups = {};
    filteredActivities.forEach((fa) => {
      const yr = fa.year.toString();
      if (!groups[yr]) groups[yr] = [];
      groups[yr].push(fa);
    });
    const sortedYears = Object.keys(groups).sort((a, b) => {
      if (a === "Undated") return 1;
      if (b === "Undated") return -1;
      return b.localeCompare(a);
    });
    return {
      sortedYears,
      groups
    };
  }, [filteredActivities]);
  const navItems = [{
    label: "Funded Projects",
    id: "projects",
    icon: FlaskConical,
    count: PROJECTS_DATABASE2.filter((p) => p.type === "external" || p.type === "internal").length,
    theme: "teal"
  }, {
    label: "PhD Research",
    id: "phd-projects-header",
    icon: BookOpen,
    count: PROJECTS_DATABASE2.filter((p) => p.type === "phd").length,
    theme: "indigo"
  }, {
    label: "Facilities",
    id: "facilities",
    icon: Cpu,
    count: EQUIPMENT_DATABASE2.length,
    theme: "cyan"
  }, {
    label: "Field Activities",
    id: "field-activities",
    icon: Anchor,
    count: FIELD_ACTIVITIES_DATABASE2.length,
    theme: "emerald"
  }, {
    label: "Student Projects",
    id: "student-projects-header",
    icon: Users,
    count: PROJECTS_DATABASE2.filter((p) => p.type === "student").length,
    theme: "sky"
  }];
  const handleNavScroll = (id) => {
    if (id === "projects") {
      setExpandedProjects((prev) => ({
        ...prev,
        external: true
      }));
    } else if (id === "phd-projects-header") {
      setExpandedProjects((prev) => ({
        ...prev,
        phd: true
      }));
    } else if (id === "student-projects-header") {
      setExpandedProjects((prev) => ({
        ...prev,
        student: true
      }));
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const offset = 110;
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth"
        });
      }
    }, 100);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground pb-20 transition-colors duration-300 page-research", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-gradient-to-b from-blue-950/20 via-background to-background py-16 px-6 border-b border-border/40", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.1),rgba(255,255,255,0))]" }),
      /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl text-center space-y-4 relative z-10", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-5xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-500 border border-cyan-500/25", children: "Ocean Engineering & Applied Acoustics" }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl font-sans", children: "Research & Facilities" }),
        /* @__PURE__ */ jsx("p", { className: "mx-auto max-w-2xl text-sm text-text-secondary leading-relaxed font-sans", children: "Explore authentic research projects, advanced oceanographic testing facilities, subsea robotic platforms, and coastal deployments mapping the depths of shallow water basins." })
      ] })
    ] }),
    /* @__PURE__ */ jsx(StickySectionNav, { items: navItems, onItemClick: handleNavScroll }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl px-6 mt-12 space-y-16", children: [
      /* @__PURE__ */ jsxs("section", { id: "projects", className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-cyan-500", children: "Investigational Registry" }),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Research Projects" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-text-muted" }),
              /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search projects...", value: projectSearch, onChange: (e) => setProjectSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none focus:border-cyan-500/50 w-44 transition" })
            ] }),
            /* @__PURE__ */ jsxs("select", { value: projectAgency, onChange: (e) => setProjectAgency(e.target.value), className: "text-xs bg-card/50 border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-cyan-500/50 cursor-pointer", children: [
              /* @__PURE__ */ jsx("option", { value: "All", children: "All Agencies" }),
              agencies.filter((a) => a !== "All").map((a) => /* @__PURE__ */ jsx("option", { value: a, children: a }, a))
            ] }),
            /* @__PURE__ */ jsxs("select", { value: projectStatus, onChange: (e) => setProjectStatus(e.target.value), className: "text-xs bg-card/50 border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-cyan-500/50 cursor-pointer", children: [
              /* @__PURE__ */ jsx("option", { value: "All", children: "All Statuses" }),
              statuses.filter((s) => s !== "All").map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s }, s))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { id: "external-projects-header", className: "rounded-xl border border-border bg-card/40 overflow-hidden", children: [
            /* @__PURE__ */ jsxs("button", { onClick: () => toggleProjectSection("external"), className: "w-full flex items-center justify-between p-4 bg-secondary/15 hover:bg-secondary/30 transition text-left cursor-pointer select-none border-b border-border/40", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(FlaskConical, { className: "h-4 w-4 text-cyan-500" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-foreground uppercase tracking-wider", children: "External Funded Projects" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-5xs font-mono font-bold bg-cyan-500/10 text-cyan-500 px-2 py-0.5 rounded border border-cyan-500/25", children: [
                  filteredProjects.filter((p) => p.type === "external").length,
                  " Listed"
                ] }),
                expandedProjects.external ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4 text-text-muted" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 text-text-muted" })
              ] })
            ] }),
            expandedProjects.external && /* @__PURE__ */ jsxs("div", { className: "p-4 grid gap-4 md:grid-cols-2", children: [
              filteredProjects.filter((p) => p.type === "external").map((proj) => /* @__PURE__ */ jsxs("div", { onClick: () => openDetail(proj, "project"), className: "p-5 rounded-2xl border border-border bg-card hover:border-cyan-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 flex flex-col justify-between cursor-pointer group", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase text-text-secondary bg-secondary px-2 py-0.5 rounded border border-border/25", children: proj.fundingAgency?.split("(")[0].trim() || proj.fundingAgency }),
                    /* @__PURE__ */ jsx("span", { className: `text-5xs font-bold uppercase tracking-wide border px-2 py-0.5 rounded-sm ${proj.status === "Ongoing" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"}`, children: proj.status })
                  ] }),
                  /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground text-xs leading-snug group-hover:text-cyan-500 transition-colors", children: proj.title })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-4 border-t border-border/20 pt-3 flex items-center justify-between text-5xs font-mono text-text-muted", children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    "Grant: ",
                    /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: proj.amount })
                  ] }),
                  proj.duration && /* @__PURE__ */ jsxs("span", { children: [
                    "Period: ",
                    /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: proj.duration })
                  ] })
                ] })
              ] }, proj.id)),
              filteredProjects.filter((p) => p.type === "external").length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-2 text-center text-text-muted text-xs py-6", children: "No external projects match the active filters." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { id: "internal-projects-header", className: "rounded-xl border border-border bg-card/40 overflow-hidden", children: [
            /* @__PURE__ */ jsxs("button", { onClick: () => toggleProjectSection("internal"), className: "w-full flex items-center justify-between p-4 bg-secondary/15 hover:bg-secondary/30 transition text-left cursor-pointer select-none border-b border-border/40", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Shield, { className: "h-4 w-4 text-cyan-500" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-foreground uppercase tracking-wider", children: "Internal Funded Projects" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-5xs font-mono font-bold bg-cyan-500/10 text-cyan-500 px-2 py-0.5 rounded border border-cyan-500/25", children: [
                  filteredProjects.filter((p) => p.type === "internal").length,
                  " Listed"
                ] }),
                expandedProjects.internal ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4 text-text-muted" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 text-text-muted" })
              ] })
            ] }),
            expandedProjects.internal && /* @__PURE__ */ jsxs("div", { className: "p-4 grid gap-4 md:grid-cols-2", children: [
              filteredProjects.filter((p) => p.type === "internal").map((proj) => /* @__PURE__ */ jsxs("div", { onClick: () => openDetail(proj, "project"), className: "p-5 rounded-2xl border border-border bg-card hover:border-cyan-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 flex flex-col justify-between cursor-pointer group", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase text-text-secondary bg-secondary px-2 py-0.5 rounded border border-border/25", children: "SSN Funding" }),
                    /* @__PURE__ */ jsx("span", { className: "text-5xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-sm", children: proj.status })
                  ] }),
                  /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground text-xs leading-snug group-hover:text-cyan-500 transition-colors", children: proj.title })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-4 border-t border-border/20 pt-3 flex items-center justify-between text-5xs font-mono text-text-muted", children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    "Grant: ",
                    /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: proj.amount })
                  ] }),
                  proj.duration && /* @__PURE__ */ jsxs("span", { children: [
                    "Period: ",
                    /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: proj.duration })
                  ] })
                ] })
              ] }, proj.id)),
              filteredProjects.filter((p) => p.type === "internal").length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-2 text-center text-text-muted text-xs py-6", children: "No internal projects match the active filters." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { id: "student-projects-header", className: "rounded-xl border border-border bg-card/40 overflow-hidden", children: [
            /* @__PURE__ */ jsxs("button", { onClick: () => toggleProjectSection("student"), className: "w-full flex items-center justify-between p-4 bg-secondary/15 hover:bg-secondary/30 transition text-left cursor-pointer select-none border-b border-border/40", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Users, { className: "h-4 w-4 text-indigo-500" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-foreground uppercase tracking-wider", children: "Student Projects" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-5xs font-mono font-bold bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded border border-indigo-500/25", children: [
                  filteredProjects.filter((p) => p.type === "student").length,
                  " Listed"
                ] }),
                expandedProjects.student ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4 text-text-muted" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 text-text-muted" })
              ] })
            ] }),
            expandedProjects.student && /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
              /* @__PURE__ */ jsx("div", { className: "flex gap-2 max-w-sm", children: /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
                /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" }),
                /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search student projects by title...", value: studentSearch, onChange: (e) => setStudentSearch(e.target.value), className: "w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none transition focus:border-indigo-500/50" })
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "orl-table-container max-h-[500px]", children: /* @__PURE__ */ jsxs("table", { className: "orl-table", children: [
                /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("th", { className: "w-14 text-center", children: "Sl.No" }),
                  /* @__PURE__ */ jsx("th", { className: "cursor-pointer hover:bg-secondary/80 transition-colors", onClick: () => handleStudentSort("title"), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                    "Project Title",
                    studentSortField === "title" && /* @__PURE__ */ jsx("span", { className: "text-indigo-500", children: studentSortOrder === "asc" ? "▲" : "▼" })
                  ] }) }),
                  /* @__PURE__ */ jsx("th", { className: "w-40 cursor-pointer hover:bg-secondary/80 transition-colors", onClick: () => handleStudentSort("agency"), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                    "Funding Agency",
                    studentSortField === "agency" && /* @__PURE__ */ jsx("span", { className: "text-indigo-500", children: studentSortOrder === "asc" ? "▲" : "▼" })
                  ] }) }),
                  /* @__PURE__ */ jsx("th", { className: "w-32 cursor-pointer hover:bg-secondary/80 transition-colors", onClick: () => handleStudentSort("amount"), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                    "Amount (Lakhs)",
                    studentSortField === "amount" && /* @__PURE__ */ jsx("span", { className: "text-indigo-500", children: studentSortOrder === "asc" ? "▲" : "▼" })
                  ] }) }),
                  /* @__PURE__ */ jsx("th", { className: "w-32 cursor-pointer hover:bg-secondary/80 transition-colors", onClick: () => handleStudentSort("role"), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                    "Supervisor Role",
                    studentSortField === "role" && /* @__PURE__ */ jsx("span", { className: "text-indigo-500", children: studentSortOrder === "asc" ? "▲" : "▼" })
                  ] }) }),
                  /* @__PURE__ */ jsx("th", { className: "w-32 cursor-pointer hover:bg-secondary/80 transition-colors", onClick: () => handleStudentSort("duration"), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                    "Duration",
                    studentSortField === "duration" && /* @__PURE__ */ jsx("span", { className: "text-indigo-500", children: studentSortOrder === "asc" ? "▲" : "▼" })
                  ] }) })
                ] }) }),
                /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-border/40", children: [
                  processedStudentProjects.map((proj, idx) => /* @__PURE__ */ jsxs("tr", { onClick: () => openDetail(proj, "project"), className: "cursor-pointer", children: [
                    /* @__PURE__ */ jsx("td", { className: "text-center font-mono", children: idx + 1 }),
                    /* @__PURE__ */ jsx("td", { className: "font-semibold text-foreground leading-snug", children: proj.title }),
                    /* @__PURE__ */ jsx("td", { className: "text-text-secondary", children: proj.fundingAgency }),
                    /* @__PURE__ */ jsx("td", { className: "font-mono text-text-primary", children: proj.amount }),
                    /* @__PURE__ */ jsx("td", { className: "text-text-secondary", children: proj.role }),
                    /* @__PURE__ */ jsx("td", { className: "font-mono text-text-secondary", children: proj.duration })
                  ] }, proj.id)),
                  processedStudentProjects.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 6, className: "p-8 text-center text-text-muted", children: "No student projects match your search query." }) })
                ] })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { id: "phd-projects-header", className: "rounded-xl border border-border bg-card/40 overflow-hidden", children: [
            /* @__PURE__ */ jsxs("button", { onClick: () => toggleProjectSection("phd"), className: "w-full flex items-center justify-between p-4 bg-secondary/15 hover:bg-secondary/30 transition text-left cursor-pointer select-none border-b border-border/40", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4 text-emerald-500" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-foreground uppercase tracking-wider", children: "PhD Research Registry" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-5xs font-mono font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/25", children: [
                  filteredProjects.filter((p) => p.type === "phd").length,
                  " Listed"
                ] }),
                expandedProjects.phd ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4 text-text-muted" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 text-text-muted" })
              ] })
            ] }),
            expandedProjects.phd && /* @__PURE__ */ jsx("div", { className: "p-4 md:p-6 space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "relative pl-6 md:pl-8 border-l border-border/80 space-y-6 ml-2 md:ml-4 py-2", children: [
              filteredProjects.filter((p) => p.type === "phd").map((proj) => /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsx("span", { className: `absolute -left-[31px] md:-left-[39px] top-1.5 h-4.5 w-4.5 rounded-full border bg-card flex items-center justify-center transition duration-300 ${proj.status === "Coursework Completed" ? "border-amber-500 ring-4 ring-amber-500/10" : proj.status === "Thesis Submitted" ? "border-cyan-500 ring-4 ring-cyan-500/10" : "border-emerald-500 ring-4 ring-emerald-500/10"}`, children: /* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-full ${proj.status === "Coursework Completed" ? "bg-amber-500" : proj.status === "Thesis Submitted" ? "bg-cyan-500" : "bg-emerald-500"}` }) }),
                /* @__PURE__ */ jsxs("div", { onClick: () => openDetail(proj, "project"), className: "rounded-2xl border border-border bg-card p-5 hover:border-emerald-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold text-emerald-500 uppercase tracking-wider", children: proj.scholar }),
                    /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground text-xs leading-relaxed group-hover:text-emerald-500 transition-colors", children: proj.title || proj.researchArea }),
                    proj.researchArea && proj.title !== proj.researchArea && /* @__PURE__ */ jsx("p", { className: "text-4xs text-text-secondary leading-snug", children: proj.researchArea })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                    proj.publicationCount && /* @__PURE__ */ jsxs("span", { className: "text-5xs font-mono font-bold bg-secondary text-text-secondary border border-border/40 px-2 py-0.5 rounded", children: [
                      proj.publicationCount,
                      " Publications"
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: `rounded-sm px-2 py-0.5 text-5xs font-semibold uppercase tracking-wide border ${proj.status === "Coursework Completed" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : proj.status === "Thesis Submitted" ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"}`, children: proj.status })
                  ] })
                ] })
              ] }, proj.id)),
              filteredProjects.filter((p) => p.type === "phd").length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center text-text-muted text-xs py-4", children: "No scholars match the active filters." })
            ] }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "facilities", className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-cyan-500", children: "Infrastructure Divisions" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Laboratory Facilities" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 md:grid-cols-3", children: FACILITIES_CATEGORIES.map((cat) => {
          const IconComp = cat.icon;
          const isActive = activeCategory === cat.id;
          const catThumb = cat.thumbnail || cat.images?.[0];
          return /* @__PURE__ */ jsxs("div", { onClick: () => {
            setActiveCategory(cat.id);
            document.getElementById("equipment")?.scrollIntoView({
              behavior: "smooth"
            });
          }, className: `p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] group select-none ${isActive ? "border-cyan-500 bg-cyan-500/5 ring-1 ring-cyan-500/20" : "border-border bg-card/60 hover:border-cyan-500/35"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              catThumb && /* @__PURE__ */ jsx("div", { className: "relative aspect-video w-full overflow-hidden rounded-lg border border-border/40 mb-3 bg-secondary/50", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(catThumb), alt: cat.name, className: "h-full w-full object-cover transition duration-300 group-hover:scale-105" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("div", { className: `p-2 rounded-lg border transition ${isActive ? "bg-cyan-500/10 border-cyan-500/25" : "bg-secondary/40 border-border/40 group-hover:border-cyan-500/20"}`, children: /* @__PURE__ */ jsx(IconComp, { className: `h-4.5 w-4.5 ${isActive ? "text-cyan-500" : "text-text-secondary"}` }) }),
                /* @__PURE__ */ jsxs("span", { className: `text-5xs font-mono font-bold px-2 py-0.5 rounded border transition ${isActive ? "bg-cyan-500/15 text-cyan-500 border-cyan-500/20" : "bg-secondary text-text-secondary border-border/40"}`, children: [
                  cat.count,
                  " Systems"
                ] })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-xs leading-snug", children: cat.name }),
              /* @__PURE__ */ jsx("p", { className: "text-4xs text-text-secondary leading-relaxed font-sans", children: cat.description })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-1 text-5xs font-bold uppercase tracking-wider text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity", children: [
              "Explore Assets ",
              /* @__PURE__ */ jsx(ChevronRight, { className: "h-3 w-3" })
            ] })
          ] }, cat.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "equipment", className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-cyan-500", children: "Asset Catalog" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Equipment & Instrumentation" }),
            /* @__PURE__ */ jsxs("p", { className: "text-4xs text-text-secondary mt-1 font-sans", children: [
              "Active Group: ",
              /* @__PURE__ */ jsx("span", { className: "font-bold text-cyan-500", children: FACILITIES_CATEGORIES.find((c) => c.id === activeCategory)?.name })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-text-muted" }),
            /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search active group...", value: facilitiesSearch, onChange: (e) => setFacilitiesSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none w-44 transition focus:border-cyan-500/50" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2 md:grid-cols-3", children: [
          filteredEquipment.map((eq) => {
            const eqThumb = eq.thumbnail || eq.image;
            return /* @__PURE__ */ jsx("div", { onClick: () => openDetail(eq, "equipment"), className: "p-5 rounded-2xl border border-border bg-card hover:border-cyan-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 flex flex-col justify-between cursor-pointer group", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              eqThumb && /* @__PURE__ */ jsx("div", { className: "relative aspect-video w-full overflow-hidden rounded-md bg-secondary/50 border border-border/40", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(eqThumb), alt: eq.name, className: "h-full w-full object-cover transition duration-300 group-hover:scale-105" }) }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "inline-flex items-center text-5xs font-bold uppercase tracking-wider text-cyan-500 bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/20", children: FACILITIES_CATEGORIES.find((c) => c.id === eq.category)?.name || eq.category }),
                /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground text-xs leading-snug group-hover:text-cyan-500 transition-colors", children: eq.name })
              ] })
            ] }) }, eq.id);
          }),
          filteredEquipment.length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-3 text-center text-text-muted text-xs py-8", children: "No instrumentation systems found in this division matching your search." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "field-activities", className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-cyan-500", children: "Ocean Validation" }),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Data Collection & Field Activities" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-text-muted" }),
              /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search location/gear...", value: activitiesSearch, onChange: (e) => setActivitiesSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none w-44 transition focus:border-cyan-500/50" })
            ] }),
            /* @__PURE__ */ jsxs("select", { value: activitiesYear, onChange: (e) => setActivitiesYear(e.target.value), className: "text-xs bg-card/50 border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-cyan-500/50 cursor-pointer", children: [
              /* @__PURE__ */ jsx("option", { value: "All", children: "All Years" }),
              years.filter((y) => y !== "All").map((y) => /* @__PURE__ */ jsx("option", { value: y, children: y }, y))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8 relative pl-6 border-l border-border/80 ml-2 py-4", children: [
          groupedActivities.sortedYears.map((yr) => /* @__PURE__ */ jsxs("div", { className: "space-y-4 relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -left-[38px] top-0.5 font-mono font-black text-xs bg-background text-cyan-500 border border-cyan-500/30 px-2 py-0.5 rounded shadow-sm z-10 select-none", children: yr }),
            /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 pl-2", children: groupedActivities.groups[yr].map((activity) => {
              const actThumb = activity.thumbnail || activity.images?.[0];
              return /* @__PURE__ */ jsxs("div", { onClick: () => openDetail(activity, "activity"), className: "p-5 rounded-lg border border-border bg-card hover:border-cyan-500/30 transition duration-300 flex flex-col justify-between cursor-pointer group", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                  actThumb && /* @__PURE__ */ jsx("div", { className: "relative aspect-video w-full overflow-hidden rounded-md bg-secondary/50 border border-border/40 mb-1", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(actThumb), alt: activity.title, className: "h-full w-full object-cover transition duration-300 group-hover:scale-105" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "inline-flex items-center text-5xs font-bold uppercase tracking-wider text-cyan-500 bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/20", children: activity.activityType }),
                    /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono text-text-muted", children: activity.date })
                  ] }),
                  /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground text-xs leading-snug group-hover:text-cyan-500 transition-colors", children: activity.title }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-5xs text-text-secondary font-sans", children: [
                    /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3 text-text-muted shrink-0" }),
                    /* @__PURE__ */ jsx("span", { className: "truncate", children: activity.location })
                  ] })
                ] }),
                (() => {
                  const tagsArray = Array.isArray(activity.equipmentTags) ? activity.equipmentTags : typeof activity.equipmentTags === "string" ? activity.equipmentTags.split(",").map((t) => t.trim()).filter(Boolean) : [];
                  if (tagsArray.length === 0) return null;
                  return /* @__PURE__ */ jsx("div", { className: "mt-4 border-t border-border/20 pt-3 flex flex-wrap gap-1.5", children: tagsArray.map((tag, tIdx) => /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono bg-secondary px-2.5 py-0.5 rounded border border-border/20 text-text-secondary", children: tag }, tIdx)) });
                })()
              ] }, activity.id);
            }) })
          ] }, yr)),
          groupedActivities.sortedYears.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center text-text-muted text-xs py-8", children: "No oceanographic campaigns or surveys found matching your query." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { id: "outputs", className: "pt-6 border-t border-border", children: /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 rounded-2xl border border-blue-500/20 p-8 flex flex-col md:flex-row items-center justify-between gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 max-w-xl", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-5xs font-bold uppercase tracking-wider bg-blue-500/15 text-blue-500 border border-blue-500/30", children: "Academic Output" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground font-sans", children: "Research Publications" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary leading-relaxed font-sans", children: "Our team publishes high-impact work detailing underwater acoustics telemetry, bio-acoustics mapping, and subsea digital signal processing algorithms across peer-reviewed international channels." }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-x-12 gap-y-4 pt-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-base font-bold text-blue-500", children: "62" }),
              /* @__PURE__ */ jsx("div", { className: "text-5xs text-text-muted font-bold uppercase", children: "Journals" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-base font-bold text-blue-500", children: "97" }),
              /* @__PURE__ */ jsx("div", { className: "text-5xs text-text-muted font-bold uppercase", children: "Conferences" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-base font-bold text-blue-500", children: "10" }),
              /* @__PURE__ */ jsx("div", { className: "text-5xs text-text-muted font-bold uppercase font-sans", children: "Books / Chapters" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "shrink-0", children: /* @__PURE__ */ jsxs(Link, { to: "/publications", className: "inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase px-5 py-3.5 transition duration-300 shadow-md cursor-pointer select-none", children: [
          "Publications Catalog ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
        ] }) })
      ] }) })
    ] }),
    selectedItem && selectedType && /* @__PURE__ */ jsx(DetailModal, { item: selectedItem, type: selectedType, onClose: closeDetail })
  ] });
}
export {
  ResearchPage as component
};
