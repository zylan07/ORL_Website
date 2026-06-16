import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { T as TEAM_MEMBERS, c as RESEARCH_SCHOLARS, d as PROJECT_STAFF, e as PHD_GRADUATES, U as UG_STUDENTS, g as UG_ALUMNI, h as PG_ALUMNI, a as useDatasetRecords, i as TECHNICAL_DISCUSSIONS, I as INTERNSHIPS, r as resolveAssetUrl } from "./router-ScoMlXed.js";
import { S as StickySectionNav } from "./sticky-section-nav-ay_A8ZSs.js";
import { GraduationCap, Users, Briefcase, Award, Sparkles, Search, Clock, ChevronRight, X, ExternalLink } from "lucide-react";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "zod";
function PersonAvatar({
  imageUrl,
  name,
  themeColor
}) {
  if (imageUrl) {
    return /* @__PURE__ */ jsx("div", { className: "relative aspect-square w-16 h-16 rounded-full overflow-hidden border border-border/40 bg-muted shrink-0 shadow-xs", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(imageUrl), alt: name, className: "h-full w-full object-cover" }) });
  }
  const gradients = {
    indigo: "from-indigo-500/20 to-indigo-600/35 text-indigo-500 border-indigo-500/20",
    sky: "from-sky-500/20 to-sky-600/35 text-sky-500 border-sky-500/20",
    teal: "from-teal-500/20 to-teal-600/35 text-teal-500 border-teal-500/20",
    emerald: "from-emerald-500/20 to-emerald-600/35 text-emerald-500 border-emerald-500/20",
    blue: "from-blue-500/20 to-blue-600/35 text-blue-500 border-blue-500/20",
    cyan: "from-cyan-500/20 to-cyan-600/35 text-cyan-500 border-cyan-500/20",
    amber: "from-amber-500/20 to-amber-600/35 text-amber-500 border-amber-500/20"
  };
  const gradientClass = gradients[themeColor] || "from-secondary to-muted text-text-muted border-border/40";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return /* @__PURE__ */ jsx("div", { className: `relative aspect-square w-16 h-16 rounded-full flex items-center justify-center text-sm font-black border tracking-wide bg-gradient-to-br select-none ${gradientClass}`, children: initials });
}
function PersonDetailModal({
  item,
  themeColor,
  onClose
}) {
  if (!item) return null;
  const hasGallery = !!(item.galleryImages && item.galleryImages.length > 0 || item.imageUrl);
  const galleryImages = [...item.imageUrl ? [item.imageUrl] : [], ...item.galleryImages || []].filter((v, i, self) => self.indexOf(v) === i);
  const showFacultyDetails = !!(item.department || item.institution || item.designation);
  const showProjectDetails = !!(item.associatedProjects && item.associatedProjects.length > 0 || item.projectRoles && item.projectRoles.length > 0);
  const showScholarDetails = !!(item.mode || item.status || item.role || item.associatedProject);
  const showPhDDetails = !!(item.researchArea || item.graduationDate);
  const showDiscussionDetails = !!(item.participants || item.summary);
  const themeColors = {
    indigo: {
      text: "text-indigo-500",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20"
    },
    sky: {
      text: "text-sky-500",
      bg: "bg-sky-500/10",
      border: "border-sky-500/20"
    },
    teal: {
      text: "text-teal-500",
      bg: "bg-teal-500/10",
      border: "border-teal-500/20"
    },
    emerald: {
      text: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    },
    blue: {
      text: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    cyan: {
      text: "text-cyan-500",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20"
    },
    amber: {
      text: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    }
  };
  const currentTheme = themeColors[themeColor] || {
    text: "text-cyan-500",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20"
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs transition-opacity duration-300", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl text-foreground scrollbar-thin md:p-8 space-y-6", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsx("button", { onClick: onClose, className: "absolute top-4 right-4 rounded-full p-2 bg-secondary text-text-muted hover:text-foreground transition cursor-pointer hover:bg-secondary/80 border border-border/45", "aria-label": "Close modal", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 pr-8", children: [
      /* @__PURE__ */ jsx(PersonAvatar, { imageUrl: item.imageUrl, name: item.name || item.title, themeColor }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1 mt-1", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-black leading-snug font-sans text-foreground", children: item.name || item.title }),
        item.designation && /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary font-medium font-sans", children: item.designation }),
        item.status && /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-5xs font-bold uppercase tracking-wider border ${item.status === "Completed" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : item.status === "Thesis Submitted" ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"}`, children: item.status })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      showFacultyDetails && /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-4 border-t border-border/40 font-sans", children: [
        /* @__PURE__ */ jsx("h4", { className: `text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`, children: "Institution Profile" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-1", children: [
          item.department && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Department" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground leading-relaxed", children: item.department })
          ] }),
          item.institution && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Institution" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground leading-relaxed", children: item.institution })
          ] })
        ] })
      ] }),
      (item.specialization || item.orcid || item.googleScholar || item.cvId || item.qualification || item.researchArea || item.researchInterests) && /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-4 border-t border-border/40 font-sans", children: [
        /* @__PURE__ */ jsx("h4", { className: `text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`, children: "Academic & Research Profile" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-1", children: [
          item.qualification && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Qualification" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground leading-relaxed", children: item.qualification })
          ] }),
          item.specialization && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Specialization" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground leading-relaxed", children: item.specialization })
          ] }),
          item.researchArea && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Research Area" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground leading-relaxed", children: item.researchArea })
          ] }),
          item.researchInterests && /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Research Interests" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground leading-relaxed", children: item.researchInterests })
          ] }),
          item.orcid && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold font-mono", children: "ORCID" }),
            /* @__PURE__ */ jsx("a", { href: `https://orcid.org/${item.orcid}`, target: "_blank", rel: "noreferrer", className: "font-mono text-cyan-500 hover:underline", children: item.orcid })
          ] }),
          item.googleScholar && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Google Scholar" }),
            /* @__PURE__ */ jsx("a", { href: item.googleScholar, target: "_blank", rel: "noreferrer", className: "text-cyan-500 hover:underline break-all", children: "Scholar Profile →" })
          ] }),
          item.cvId && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: item.topic ? "Internship Certificate" : "Curriculum Vitae" }),
            /* @__PURE__ */ jsxs("a", { href: resolveAssetUrl(item.cvId), target: "_blank", rel: "noreferrer", className: "text-cyan-500 hover:underline font-bold", children: [
              item.topic ? "Download Certificate PDF" : "Download CV PDF",
              " →"
            ] })
          ] })
        ] })
      ] }),
      (item.email || item.phone) && item.role === "faculty" && /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-4 border-t border-border/40 font-sans", children: [
        /* @__PURE__ */ jsx("h4", { className: `text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`, children: "Contact Details" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-1 font-mono", children: [
          item.email && /* @__PURE__ */ jsxs("div", { className: "col-span-2 sm:col-span-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold font-sans", children: "Email Address" }),
            /* @__PURE__ */ jsx("a", { href: `mailto:${item.email}`, className: "font-semibold text-cyan-500 hover:underline break-all", children: item.email })
          ] }),
          item.phone && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold font-sans", children: "Telephone / Extension" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: item.phone })
          ] })
        ] })
      ] }),
      showScholarDetails && /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-4 border-t border-border/40 font-sans", children: [
        /* @__PURE__ */ jsx("h4", { className: `text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`, children: "Scholar Registry" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-1", children: [
          item.mode && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Study Mode" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: item.mode })
          ] }),
          item.role && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Deployment Role" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: item.role })
          ] }),
          item.associatedProject && /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Project Affiliation" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: item.associatedProject })
          ] })
        ] })
      ] }),
      showPhDDetails && /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-4 border-t border-border/40 font-sans", children: [
        /* @__PURE__ */ jsx("h4", { className: `text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`, children: "Doctoral Thesis" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-1", children: [
          item.researchArea && /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Research Domain" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground leading-relaxed", children: item.researchArea })
          ] }),
          item.graduationDate && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Conferment Date" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: item.graduationDate })
          ] })
        ] })
      ] }),
      item.topic && /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-4 border-t border-border/40 font-sans", children: [
        /* @__PURE__ */ jsx("h4", { className: `text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`, children: "Internship Registry" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-xs mt-1", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Assigned Task / Topic" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground leading-relaxed", children: item.topic })
          ] }),
          item.duration && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Deployment Duration" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: item.duration })
          ] })
        ] })
      ] }),
      showProjectDetails && /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-4 border-t border-border/40 font-sans", children: [
        /* @__PURE__ */ jsx("h4", { className: `text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`, children: "Lab Consortium Roles" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 mt-1 text-xs", children: [
          item.projectRoles && item.projectRoles.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Consortium Title" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5 mt-1", children: item.projectRoles.map((role, rIdx) => /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 text-5xs font-bold font-mono rounded ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border}`, children: role }, rIdx)) })
          ] }),
          item.associatedProjects && item.associatedProjects.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Supervised Projects" }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-1.5 mt-1", children: item.associatedProjects.map((proj, pIdx) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-text-secondary leading-snug", children: [
              /* @__PURE__ */ jsx("span", { className: `h-1.5 w-1.5 rounded-full mt-1 shrink-0 bg-cyan-500` }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: proj })
            ] }, pIdx)) })
          ] })
        ] })
      ] }),
      showDiscussionDetails && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-4 border-t border-border/40 font-sans", children: [
        /* @__PURE__ */ jsx("h4", { className: `text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`, children: "Discussion Records" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-xs mt-1", children: [
          item.participants && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Participants / Cohorts" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground leading-relaxed", children: item.participants })
          ] }),
          item.summary && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Session Summary" }),
            /* @__PURE__ */ jsx("p", { className: "text-text-secondary leading-relaxed font-normal mt-1", children: item.summary })
          ] })
        ] })
      ] }),
      item.bio && /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-4 border-t border-border/40", children: [
        /* @__PURE__ */ jsx("h4", { className: `text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`, children: "Biography / Synopsis" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary leading-relaxed font-sans mt-1", children: item.bio })
      ] }),
      item.link && /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-4 border-t border-border/40 font-sans", children: [
        /* @__PURE__ */ jsx("h4", { className: `text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`, children: "Reference Links" }),
        /* @__PURE__ */ jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxs("a", { href: item.link, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1.5 text-xs text-cyan-500 font-bold hover:underline", children: [
          "View Academic Profile ",
          /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" })
        ] }) })
      ] }),
      hasGallery && galleryImages.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-4 border-t border-border/40 font-sans", children: [
        /* @__PURE__ */ jsx("h4", { className: `text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`, children: "Uploaded Photo Records" }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 grid-cols-1 sm:grid-cols-2 mt-2", children: galleryImages.map((img, index) => /* @__PURE__ */ jsx("div", { className: "relative aspect-square overflow-hidden rounded-lg border border-border/40 bg-muted", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(img), alt: `Photo record ${index + 1}`, className: "h-full w-full object-cover" }) }, index)) })
      ] })
    ] })
  ] }) });
}
const STATIC_TEAM_MEMBERS = TEAM_MEMBERS;
const STATIC_RESEARCH_SCHOLARS = RESEARCH_SCHOLARS;
const STATIC_PROJECT_STAFF = PROJECT_STAFF;
const STATIC_PHD_GRADUATES = PHD_GRADUATES;
const STATIC_UG_STUDENTS = UG_STUDENTS;
const STATIC_UG_ALUMNI = UG_ALUMNI;
const STATIC_PG_ALUMNI = PG_ALUMNI;
const STATIC_INTERNSHIPS = INTERNSHIPS;
function PeoplePage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState("cyan");
  const openDetail = (item, theme) => {
    setSelectedItem(item);
    setSelectedTheme(theme);
  };
  const closeDetail = () => {
    setSelectedItem(null);
  };
  const staticMembers = useMemo(() => [...STATIC_TEAM_MEMBERS.map((m) => ({
    ...m,
    role: "faculty",
    title: m.name
  })), ...STATIC_RESEARCH_SCHOLARS.map((m) => ({
    ...m,
    role: "scholar",
    title: m.name
  })), ...STATIC_PROJECT_STAFF.map((m) => ({
    ...m,
    role: "staff",
    title: m.name
  })), ...STATIC_PHD_GRADUATES.map((m) => ({
    ...m,
    role: "phd",
    title: m.name
  })), ...STATIC_UG_STUDENTS.map((m) => ({
    ...m,
    role: "student",
    title: m.name
  })), ...STATIC_UG_ALUMNI.map((m) => ({
    ...m,
    role: "alumni",
    title: m.name
  })), ...STATIC_PG_ALUMNI.map((m) => ({
    ...m,
    role: "alumni",
    title: m.name,
    programme: m.programme
  }))], []);
  const allMembers = useDatasetRecords("people-members", staticMembers);
  const INTERNSHIPS2 = useDatasetRecords("people-internships", STATIC_INTERNSHIPS);
  const TEAM_MEMBERS2 = useMemo(() => {
    return allMembers.filter((m) => m.role === "faculty").map((m) => ({
      id: m.id,
      role: "faculty",
      name: m.title || m.name || "",
      designation: m.designation || "",
      department: m.department || "",
      institution: m.institution || "",
      projectRoles: m.projectRoles || [],
      associatedProjects: m.associatedProjects || [],
      imageUrl: m.thumbnail || m.imageUrl || null,
      link: m.link || "",
      bio: m.bio || "",
      qualification: m.qualification || "",
      specialization: m.specialization || "",
      researchArea: m.researchArea || "",
      researchInterests: m.researchInterests || "",
      email: m.email || "",
      phone: m.phone || "",
      orcid: m.orcid || "",
      googleScholar: m.googleScholar || "",
      cvId: m.cvId || ""
    }));
  }, [allMembers]);
  const RESEARCH_SCHOLARS2 = useMemo(() => {
    return allMembers.filter((m) => m.role === "scholar" || m.role === "scholars").map((m) => ({
      id: m.id,
      name: m.title || m.name || "",
      mode: m.mode || "Full Time",
      status: m.status || "Active",
      role: m.role_in_project || m.designation || m.role || "",
      associatedProject: m.associatedProject || "",
      imageUrl: m.thumbnail || m.imageUrl || null,
      link: m.link || ""
    }));
  }, [allMembers]);
  const PROJECT_STAFF2 = useMemo(() => {
    return allMembers.filter((m) => m.role === "staff").map((m) => ({
      id: m.id,
      name: m.title || m.name || "",
      role: m.role || m.designation || "",
      project: m.project || m.associatedProject || "",
      imageUrl: m.thumbnail || m.imageUrl || null,
      link: m.link || ""
    }));
  }, [allMembers]);
  const PHD_GRADUATES2 = useMemo(() => {
    return allMembers.filter((m) => m.role === "phd").map((m) => ({
      id: m.id,
      name: m.title || m.name || "",
      researchArea: m.researchArea || "",
      graduationDate: m.graduationDate || "",
      status: "Completed",
      imageUrl: m.thumbnail || m.imageUrl || null,
      link: m.link || ""
    }));
  }, [allMembers]);
  const UG_STUDENTS2 = useMemo(() => {
    return allMembers.filter((m) => m.role === "student").map((m) => ({
      id: m.id,
      name: m.title || m.name || "",
      status: "Current Student",
      imageUrl: m.thumbnail || m.imageUrl || null
    }));
  }, [allMembers]);
  const UG_ALUMNI2 = useMemo(() => {
    return allMembers.filter((m) => m.role === "alumni" && !m.programme).map((m) => ({
      id: m.id,
      name: m.title || m.name || "",
      imageUrl: m.thumbnail || m.imageUrl || null,
      link: m.link || ""
    }));
  }, [allMembers]);
  const PG_ALUMNI2 = useMemo(() => {
    return allMembers.filter((m) => m.role === "alumni" && m.programme).map((m) => ({
      id: m.id,
      name: m.title || m.name || "",
      programme: m.programme || "",
      imageUrl: m.thumbnail || m.imageUrl || null,
      link: m.link || ""
    }));
  }, [allMembers]);
  useMemo(() => {
    return [{
      label: "Team Members",
      count: TEAM_MEMBERS2.length,
      icon: GraduationCap,
      theme: "indigo",
      id: "faculty"
    }, {
      label: "Research Scholars",
      count: RESEARCH_SCHOLARS2.length,
      icon: Users,
      theme: "sky",
      id: "scholars"
    }, {
      label: "Project Staff",
      count: PROJECT_STAFF2.length,
      icon: Briefcase,
      theme: "teal",
      id: "staff"
    }, {
      label: "PhD Graduates",
      count: PHD_GRADUATES2.length,
      icon: Award,
      theme: "emerald",
      id: "phd"
    }, {
      label: "UG Alumni",
      count: UG_ALUMNI2.length,
      icon: Users,
      theme: "blue",
      id: "ug-alumni"
    }, {
      label: "PG Alumni",
      count: PG_ALUMNI2.length,
      icon: Users,
      theme: "blue",
      id: "pg-alumni"
    }, {
      label: "Interns",
      count: INTERNSHIPS2.length,
      icon: Sparkles,
      theme: "cyan",
      id: "interns"
    }];
  }, [TEAM_MEMBERS2, RESEARCH_SCHOLARS2, PROJECT_STAFF2, PHD_GRADUATES2, UG_ALUMNI2, PG_ALUMNI2, INTERNSHIPS2]);
  const navItems = useMemo(() => [{
    label: "Faculty",
    id: "faculty",
    count: TEAM_MEMBERS2.length,
    theme: "indigo"
  }, {
    label: "Research Scholars",
    id: "scholars",
    count: RESEARCH_SCHOLARS2.length,
    theme: "sky"
  }, {
    label: "Project Staff",
    id: "staff",
    count: PROJECT_STAFF2.length,
    theme: "teal"
  }, {
    label: "PhD Graduates",
    id: "phd",
    count: PHD_GRADUATES2.length,
    theme: "emerald"
  }, {
    label: "Current Students",
    id: "ug-students",
    count: UG_STUDENTS2.length,
    theme: "blue"
  }, {
    label: "UG Alumni",
    id: "ug-alumni",
    count: UG_ALUMNI2.length,
    theme: "blue"
  }, {
    label: "PG Alumni",
    id: "pg-alumni",
    count: PG_ALUMNI2.length,
    theme: "indigo"
  }, {
    label: "Internships",
    id: "interns",
    count: INTERNSHIPS2.length,
    theme: "cyan"
  }], [TEAM_MEMBERS2, RESEARCH_SCHOLARS2, PROJECT_STAFF2, PHD_GRADUATES2, UG_STUDENTS2, UG_ALUMNI2, PG_ALUMNI2, INTERNSHIPS2]);
  const [facultySearch, setFacultySearch] = useState("");
  const [scholarSearch, setScholarSearch] = useState("");
  const [scholarStatusFilter, setScholarStatusFilter] = useState("All");
  const [ugAlumniSearch, setUgAlumniSearch] = useState("");
  const [pgAlumniSearch, setPgAlumniSearch] = useState("");
  const [internSearch, setInternSearch] = useState("");
  const [internSortField, setInternSortField] = useState(null);
  const [internSortOrder, setInternSortOrder] = useState("asc");
  const [discussionSearch, setDiscussionSearch] = useState("");
  const filteredFaculty = useMemo(() => {
    return TEAM_MEMBERS2.filter((fac) => String(fac.name ?? "").toLowerCase().includes(facultySearch.toLowerCase().trim()));
  }, [facultySearch]);
  const filteredScholars = useMemo(() => {
    return RESEARCH_SCHOLARS2.filter((sch) => {
      const matchesSearch = String(sch.name ?? "").toLowerCase().includes(scholarSearch.toLowerCase().trim());
      const matchesStatus = scholarStatusFilter === "All" || sch.status === scholarStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [scholarSearch, scholarStatusFilter]);
  const filteredUgAlumni = useMemo(() => {
    return UG_ALUMNI2.filter((al) => String(al.name ?? "").toLowerCase().includes(ugAlumniSearch.toLowerCase().trim()));
  }, [ugAlumniSearch]);
  const filteredPgAlumni = useMemo(() => {
    return PG_ALUMNI2.filter((al) => String(al.name ?? "").toLowerCase().includes(pgAlumniSearch.toLowerCase().trim()));
  }, [pgAlumniSearch]);
  const processedInternships = useMemo(() => {
    let list = [...INTERNSHIPS2];
    if (internSearch.trim()) {
      const q = internSearch.toLowerCase().trim();
      list = list.filter((i) => String(i.name ?? "").toLowerCase().includes(q) || String(i.institution ?? "").toLowerCase().includes(q) || String(i.topic ?? "").toLowerCase().includes(q));
    }
    if (internSortField) {
      list.sort((a, b) => {
        let valA = "";
        let valB = "";
        if (internSortField === "name") {
          valA = String(a.name ?? "").toLowerCase();
          valB = String(b.name ?? "").toLowerCase();
        } else if (internSortField === "institution") {
          valA = String(a.institution ?? "").toLowerCase();
          valB = String(b.institution ?? "").toLowerCase();
        } else if (internSortField === "topic") {
          valA = String(a.topic ?? "").toLowerCase();
          valB = String(b.topic ?? "").toLowerCase();
        } else if (internSortField === "duration") {
          valA = String(a.duration ?? "").toLowerCase();
          valB = String(b.duration ?? "").toLowerCase();
        }
        if (valA < valB) return internSortOrder === "asc" ? -1 : 1;
        if (valA > valB) return internSortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return list;
  }, [internSearch, internSortField, internSortOrder]);
  const handleInternSort = (field) => {
    if (internSortField === field) {
      setInternSortOrder(internSortOrder === "asc" ? "desc" : "asc");
    } else {
      setInternSortField(field);
      setInternSortOrder("asc");
    }
  };
  const filteredDiscussions = useMemo(() => {
    return TECHNICAL_DISCUSSIONS.filter((disc) => String(disc.title ?? "").toLowerCase().includes(discussionSearch.toLowerCase().trim()));
  }, [discussionSearch]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground pb-20 transition-colors duration-300 page-people", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-gradient-to-b from-blue-950/20 via-background to-background py-16 px-6 border-b border-border/40", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(255,255,255,0))]" }),
      /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl text-center space-y-6 relative z-10", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-5xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/25", children: "ORL Research Personnel" }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl font-sans", children: "People" }),
        /* @__PURE__ */ jsx("p", { className: "mx-auto max-w-xl text-xs font-semibold text-cyan-500 uppercase tracking-widest leading-relaxed", children: "The bigger the dream, the more important the team." }),
        /* @__PURE__ */ jsx("p", { className: "mx-auto max-w-2xl text-xs text-text-secondary leading-relaxed font-sans", children: "Meet the faculty, research scholars, project engineers, and student cohorts driving underwater acoustic telemetry, subsea vehicle designs, and optical communication trials." })
      ] })
    ] }),
    /* @__PURE__ */ jsx(StickySectionNav, { items: navItems }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl px-6 mt-12 space-y-16", children: [
      /* @__PURE__ */ jsxs("section", { id: "faculty", className: "scroll-mt-24 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-indigo-500", children: "Principal Mentors" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Team Members" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" }),
            /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search faculty...", value: facultySearch, onChange: (e) => setFacultySearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none w-44 focus:border-indigo-500/50 transition" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
          filteredFaculty.map((member) => /* @__PURE__ */ jsxs("div", { onClick: () => openDetail(member, "indigo"), className: "p-5 rounded-2xl border border-border bg-card/60 hover:border-indigo-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 cursor-pointer flex items-start gap-4 group select-none", children: [
            /* @__PURE__ */ jsx(PersonAvatar, { imageUrl: member.imageUrl, name: member.name, themeColor: "indigo" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1 mt-0.5 min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-xs leading-snug group-hover:text-indigo-500 transition-colors truncate", children: member.name }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-text-secondary font-medium font-sans truncate", children: member.designation }),
              /* @__PURE__ */ jsx("p", { className: "text-5xs text-text-muted font-sans font-medium truncate uppercase tracking-wider", children: member.institution })
            ] })
          ] }, member.id)),
          filteredFaculty.length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-2 text-center text-text-muted text-xs py-6", children: "No faculty members found." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "scholars", className: "scroll-mt-24 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-sky-500", children: "Doctoral Cohorts" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Research Scholars" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" }),
              /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search scholars...", value: scholarSearch, onChange: (e) => setScholarSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none w-40 focus:border-sky-500/50 transition" })
            ] }),
            /* @__PURE__ */ jsxs("select", { value: scholarStatusFilter, onChange: (e) => setScholarStatusFilter(e.target.value), className: "text-xs bg-card/50 border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-sky-500/50 cursor-pointer", children: [
              /* @__PURE__ */ jsx("option", { value: "All", children: "All Status" }),
              /* @__PURE__ */ jsx("option", { value: "Thesis Submitted", children: "Thesis Submitted" }),
              /* @__PURE__ */ jsx("option", { value: "Active", children: "Active Candidate" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2 md:grid-cols-4", children: [
          filteredScholars.map((scholar) => /* @__PURE__ */ jsxs("div", { onClick: () => openDetail(scholar, "sky"), className: "p-5 rounded-2xl border border-border bg-card/60 hover:border-sky-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 cursor-pointer flex flex-col justify-between group select-none text-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center space-y-3", children: [
              /* @__PURE__ */ jsx(PersonAvatar, { imageUrl: scholar.imageUrl, name: scholar.name, themeColor: "sky" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-xs leading-tight group-hover:text-sky-500 transition-colors truncate max-w-full", children: scholar.name }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-text-muted mt-1 block font-semibold", children: scholar.mode })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 border-t border-border/20 pt-2 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded text-5xs font-bold border uppercase tracking-wider ${scholar.status === "Thesis Submitted" ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"}`, children: scholar.status }) })
          ] }, scholar.id)),
          filteredScholars.length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-4 text-center text-text-muted text-xs py-6", children: "No scholars found." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "staff", className: "scroll-mt-24 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border/40 pb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-teal-500", children: "Deployments" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Project Staff" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: PROJECT_STAFF2.map((staff) => /* @__PURE__ */ jsxs("div", { onClick: () => openDetail(staff, "teal"), className: "p-5 rounded-2xl border border-border bg-card/60 hover:border-teal-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 cursor-pointer flex items-center gap-4 group select-none", children: [
          /* @__PURE__ */ jsx(PersonAvatar, { imageUrl: staff.imageUrl, name: staff.name, themeColor: "teal" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1 min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-xs leading-snug group-hover:text-teal-500 transition-colors truncate", children: staff.name }),
            /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-5xs font-bold bg-teal-500/10 text-teal-500 border border-teal-500/25 uppercase font-mono tracking-wider", children: staff.role })
          ] })
        ] }, staff.id)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "phd", className: "scroll-mt-24 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border/40 pb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-emerald-500", children: "Thesis Alumni" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Graduated Doctoral Scholars" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "relative pl-6 md:pl-8 border-l border-border/85 space-y-6 ml-2 md:ml-4 py-2", children: PHD_GRADUATES2.map((grad) => /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsx("span", { className: "absolute -left-[31px] md:-left-[39px] top-1.5 h-4.5 w-4.5 rounded-full border border-emerald-500 bg-background flex items-center justify-center ring-4 ring-emerald-500/10 transition duration-300 shrink-0", children: /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-500" }) }),
          /* @__PURE__ */ jsxs("div", { onClick: () => openDetail(grad, "emerald"), className: "rounded-2xl border border-border bg-card p-5 hover:border-emerald-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 select-none", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold text-emerald-500 uppercase tracking-wider", children: grad.name }),
              /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground text-xs leading-relaxed group-hover:text-emerald-500 transition-colors", children: grad.researchArea })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-5xs font-mono font-bold bg-secondary text-text-secondary border border-border/40 px-2.5 py-0.5 rounded", children: [
                "Graduated: ",
                grad.graduationDate.split(":")[1]?.trim() || grad.graduationDate
              ] }),
              /* @__PURE__ */ jsx("span", { className: "rounded px-2.5 py-0.5 text-5xs font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-500 border border-emerald-500/20", children: grad.status })
            ] })
          ] })
        ] }, grad.id)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "ug-students", className: "scroll-mt-24 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border/40 pb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-blue-500", children: "Current UG Members" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Undergraduate Students" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 md:grid-cols-4", children: UG_STUDENTS2.map((student) => /* @__PURE__ */ jsxs("div", { onClick: () => openDetail(student, "blue"), className: "p-5 rounded-2xl border border-border bg-card/60 hover:border-blue-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 cursor-pointer flex flex-col items-center gap-3 text-center group select-none", children: [
          /* @__PURE__ */ jsx(PersonAvatar, { imageUrl: student.imageUrl, name: student.name, themeColor: "blue" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-xs leading-tight group-hover:text-blue-500 transition-colors", children: student.name }),
            /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-5xs font-bold border border-blue-500/20 bg-blue-500/5 text-blue-500 mt-1 uppercase font-mono tracking-wider", children: student.status })
          ] })
        ] }, student.id)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "ug-alumni", className: "scroll-mt-24 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-blue-500", children: "Undergraduate Alumni" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Graduated Project Students (UG)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" }),
            /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search UG alumni...", value: ugAlumniSearch, onChange: (e) => setUgAlumniSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none w-44 focus:border-blue-500/50 transition" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "orl-table-container max-h-[350px]", children: /* @__PURE__ */ jsxs("table", { className: "orl-table", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "w-16 text-center", children: "Sl No" }),
            /* @__PURE__ */ jsx("th", { children: "Student Name" }),
            /* @__PURE__ */ jsx("th", { className: "text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-border/40", children: [
            filteredUgAlumni.map((al, idx) => /* @__PURE__ */ jsxs("tr", { onClick: () => openDetail(al, "blue"), className: "cursor-pointer", children: [
              /* @__PURE__ */ jsx("td", { className: "text-center font-mono", children: idx + 1 }),
              /* @__PURE__ */ jsx("td", { className: "font-semibold text-foreground leading-snug", children: al.name }),
              /* @__PURE__ */ jsx("td", { className: "text-right text-5xs font-mono font-bold text-blue-500", children: "View Profile" })
            ] }, al.id)),
            filteredUgAlumni.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 3, className: "p-8 text-center text-text-muted", children: "No UG project students match the search text." }) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "pg-alumni", className: "scroll-mt-24 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-blue-500", children: "Postgraduate Alumni" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Graduated Project Students (PG)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" }),
            /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search PG alumni...", value: pgAlumniSearch, onChange: (e) => setPgAlumniSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none w-44 focus:border-blue-500/50 transition" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "orl-table-container max-h-[350px]", children: /* @__PURE__ */ jsxs("table", { className: "orl-table", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "w-16 text-center", children: "Sl No" }),
            /* @__PURE__ */ jsx("th", { children: "Name" }),
            /* @__PURE__ */ jsx("th", { children: "Programme" }),
            /* @__PURE__ */ jsx("th", { className: "text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-border/40", children: [
            filteredPgAlumni.map((al, idx) => /* @__PURE__ */ jsxs("tr", { onClick: () => openDetail(al, "blue"), className: "cursor-pointer", children: [
              /* @__PURE__ */ jsx("td", { className: "text-center font-mono", children: idx + 1 }),
              /* @__PURE__ */ jsx("td", { className: "font-semibold text-foreground leading-snug", children: al.name }),
              /* @__PURE__ */ jsx("td", { className: "text-text-secondary", children: al.programme }),
              /* @__PURE__ */ jsx("td", { className: "text-right text-5xs font-mono font-bold text-blue-500", children: "View Profile" })
            ] }, al.id)),
            filteredPgAlumni.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 4, className: "p-8 text-center text-text-muted", children: "No PG project students match the search text." }) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "interns", className: "scroll-mt-24 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-cyan-500", children: "Deployment Logs" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Internship Section" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" }),
            /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search intern name, college, topic...", value: internSearch, onChange: (e) => setInternSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none w-52 focus:border-cyan-500/50 transition font-sans animate-fade-in" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "orl-table-container max-h-[500px]", children: /* @__PURE__ */ jsxs("table", { className: "orl-table", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "w-14 text-center", children: "Sl No" }),
            /* @__PURE__ */ jsx("th", { className: "cursor-pointer hover:bg-secondary/80 transition-colors", onClick: () => handleInternSort("name"), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
              "Name",
              internSortField === "name" && /* @__PURE__ */ jsx("span", { className: "text-cyan-500", children: internSortOrder === "asc" ? "▲" : "▼" })
            ] }) }),
            /* @__PURE__ */ jsx("th", { className: "cursor-pointer hover:bg-secondary/80 transition-colors", onClick: () => handleInternSort("institution"), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
              "Institution",
              internSortField === "institution" && /* @__PURE__ */ jsx("span", { className: "text-cyan-500", children: internSortOrder === "asc" ? "▲" : "▼" })
            ] }) }),
            /* @__PURE__ */ jsx("th", { className: "w-44 cursor-pointer hover:bg-secondary/80 transition-colors", onClick: () => handleInternSort("duration"), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
              "Duration",
              internSortField === "duration" && /* @__PURE__ */ jsx("span", { className: "text-cyan-500", children: internSortOrder === "asc" ? "▲" : "▼" })
            ] }) })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-border/40", children: [
            processedInternships.map((intern, idx) => /* @__PURE__ */ jsxs("tr", { onClick: () => openDetail(intern, "cyan"), className: "cursor-pointer", children: [
              /* @__PURE__ */ jsx("td", { className: "text-center font-mono", children: idx + 1 }),
              /* @__PURE__ */ jsx("td", { className: "font-semibold text-foreground leading-snug", children: intern.name }),
              /* @__PURE__ */ jsx("td", { className: "text-text-secondary leading-normal", children: intern.institution }),
              /* @__PURE__ */ jsx("td", { className: "font-mono text-[11px]", children: intern.duration })
            ] }, intern.id)),
            processedInternships.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 4, className: "p-8 text-center text-text-muted", children: "No internship records found matching the active search." }) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "discussions", className: "scroll-mt-24 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-amber-500", children: "Scientific Colloquia" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Technical Discussions" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" }),
            /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search discussions...", value: discussionSearch, onChange: (e) => setDiscussionSearch(e.target.value), className: "pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none w-44 focus:border-amber-500/50 transition" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          filteredDiscussions.map((disc) => /* @__PURE__ */ jsxs("div", { onClick: () => openDetail(disc, "amber"), className: "p-5 rounded-2xl border border-border bg-card/60 hover:border-amber-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 cursor-pointer flex flex-col sm:flex-row gap-4 justify-between items-start group select-none", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-5xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/25 uppercase font-mono tracking-wider", children: "Technical Meeting" }),
                /* @__PURE__ */ jsxs("span", { className: "text-5xs text-text-muted font-mono flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                  " ",
                  disc.date.split("on")[1]?.trim() || disc.date
                ] })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-xs leading-snug group-hover:text-amber-500 transition-colors", children: disc.title }),
              disc.summary && /* @__PURE__ */ jsx("p", { className: "text-4xs text-text-secondary leading-relaxed font-sans line-clamp-2", children: disc.summary })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-5xs font-bold uppercase tracking-wider text-amber-500 shrink-0 self-end sm:self-center opacity-0 group-hover:opacity-100 transition-opacity", children: [
              "View Details ",
              /* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5" })
            ] })
          ] }, disc.id)),
          filteredDiscussions.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center text-text-muted text-xs py-8", children: "No technical discussions found." })
        ] })
      ] })
    ] }),
    selectedItem && /* @__PURE__ */ jsx(PersonDetailModal, { item: selectedItem, themeColor: selectedTheme, onClose: closeDetail })
  ] });
}
export {
  PeoplePage as component
};
