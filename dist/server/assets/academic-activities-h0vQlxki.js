import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { GraduationCap, MessagesSquare, Presentation, ClipboardList, Search, ArrowUpDown, ChevronLeft, ChevronRight, Paperclip } from "lucide-react";
import { A as Route, u as useRecords, f as formatDate, r as resolveAssetUrl } from "./router-ScoMlXed.js";
import { S as StickySectionNav } from "./sticky-section-nav-ay_A8ZSs.js";
import "@tanstack/react-query";
import "zod";
function renderAttachments(r) {
  if (!r.attachments || r.attachments.length === 0) return null;
  return /* @__PURE__ */ jsx("div", { className: "mt-1.5 flex flex-wrap gap-1", children: r.attachments.map((att) => /* @__PURE__ */ jsxs("a", { href: resolveAssetUrl(att.url), target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[9px] font-semibold text-secondary-foreground hover:bg-primary/20 hover:text-primary transition", children: [
    /* @__PURE__ */ jsx(Paperclip, { className: "h-2.5 w-2.5" }),
    att.name,
    " (",
    att.size,
    ")"
  ] }, att.id)) });
}
function AcademicTable({
  title,
  id,
  items,
  headers,
  accentClass,
  borderClass,
  icon: Icon,
  renderRow
}) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  useEffect(() => {
    setPage(1);
  }, [items]);
  const pagedItems = items.slice((page - 1) * pageSize, page * pageSize);
  return /* @__PURE__ */ jsxs("div", { id, className: `scroll-mt-28 rounded-xl border border-border bg-card p-6 shadow-sm hover:${borderClass} transition-all duration-300`, children: [
    /* @__PURE__ */ jsxs("div", { className: `border-b ${borderClass} pb-3 flex items-center justify-between`, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Icon, { className: `h-5 w-5 ${accentClass}` }),
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold tracking-tight text-foreground", children: title })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: `text-xs font-semibold px-2 py-0.5 rounded bg-secondary/80 ${accentClass} font-mono border ${borderClass}`, children: [
        items.length,
        " records"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 orl-table-container", children: /* @__PURE__ */ jsxs("table", { className: "orl-table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: headers.map((h) => /* @__PURE__ */ jsx("th", { children: h }, h)) }) }),
      /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-border", children: [
        pagedItems.map((item) => /* @__PURE__ */ jsx("tr", { children: renderRow(item) }, item.id)),
        pagedItems.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: headers.length, className: "px-4 py-10 text-center text-xs text-text-muted", children: "No records match the current filters." }) })
      ] })
    ] }) }),
    totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground pt-1", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "Showing ",
        (page - 1) * pageSize + 1,
        "–",
        Math.min(page * pageSize, items.length),
        " of ",
        items.length
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1, className: "inline-flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1 disabled:opacity-40 hover:bg-accent hover:text-accent-foreground transition cursor-pointer select-none", children: [
          /* @__PURE__ */ jsx(ChevronLeft, { className: "h-3.5 w-3.5" }),
          " Prev"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "px-2 tabular-nums", children: [
          "Page ",
          page,
          " / ",
          totalPages
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page === totalPages, className: "inline-flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1 disabled:opacity-40 hover:bg-accent hover:text-accent-foreground transition cursor-pointer select-none", children: [
          "Next ",
          /* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5" })
        ] })
      ] })
    ] })
  ] });
}
function AcademicActivitiesPage() {
  const {
    tab
  } = Route.useSearch();
  const records = useRecords();
  const [q, setQ] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  useEffect(() => {
    if (tab) {
      let targetId = tab;
      if (tab === "dc") targetId = "supervision";
      const el = document.getElementById(targetId);
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({
            behavior: "smooth"
          });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [tab]);
  const rawActivities = useMemo(() => {
    return records.filter((r) => ["dc", "talk", "workshop", "bos"].includes(r.type));
  }, [records]);
  const filteredActivities = useMemo(() => {
    const query = q.trim().toLowerCase();
    let result = rawActivities;
    if (query) {
      result = rawActivities.filter((r) => {
        const haystack = [r.title, r.organization ?? "", r.place ?? "", r.summary ?? ""].join(" ").toLowerCase();
        return haystack.includes(query);
      });
    }
    return sortDesc ? [...result].sort((a, b) => b.date.localeCompare(a.date)) : [...result].sort((a, b) => a.date.localeCompare(b.date));
  }, [rawActivities, q, sortDesc]);
  const dcItems = useMemo(() => filteredActivities.filter((r) => r.type === "dc"), [filteredActivities]);
  const talkItems = useMemo(() => filteredActivities.filter((r) => r.type === "talk"), [filteredActivities]);
  const workshopItems = useMemo(() => filteredActivities.filter((r) => r.type === "workshop"), [filteredActivities]);
  const bosItems = useMemo(() => filteredActivities.filter((r) => r.type === "bos"), [filteredActivities]);
  const rawDcCount = useMemo(() => rawActivities.filter((r) => r.type === "dc").length, [rawActivities]);
  const rawTalkCount = useMemo(() => rawActivities.filter((r) => r.type === "talk").length, [rawActivities]);
  const rawWorkshopCount = useMemo(() => rawActivities.filter((r) => r.type === "workshop").length, [rawActivities]);
  const rawBosCount = useMemo(() => rawActivities.filter((r) => r.type === "bos").length, [rawActivities]);
  const navItems = useMemo(() => [{
    label: "Doctoral Committee",
    id: "dc",
    icon: GraduationCap,
    count: rawDcCount,
    theme: "indigo"
  }, {
    label: "Invited Talks",
    id: "talks",
    icon: MessagesSquare,
    count: rawTalkCount,
    theme: "sky"
  }, {
    label: "Workshops",
    id: "workshops",
    icon: Presentation,
    count: rawWorkshopCount,
    theme: "cyan"
  }, {
    label: "Board of Studies",
    id: "bos",
    icon: ClipboardList,
    count: rawBosCount,
    theme: "emerald"
  }], [rawDcCount, rawTalkCount, rawWorkshopCount, rawBosCount]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground pb-16 transition-colors duration-300 page-academic-activities", children: [
    /* @__PURE__ */ jsx(StickySectionNav, { items: navItems }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-6 mt-10 space-y-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center max-w-3xl mx-auto space-y-4", children: [
        /* @__PURE__ */ jsx("nav", { className: "text-3xs text-text-muted justify-center flex mb-2", "aria-label": "Breadcrumb", children: /* @__PURE__ */ jsxs("ol", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-accent transition-colors", children: "Home" }) }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { children: "›" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-text-secondary", children: "Academic Activities" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl", children: "Academic Activities" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-text-secondary leading-relaxed font-sans", children: "Explore doctoral research guidance, academic committee memberships, invited presentations, keynotes, workshops, and educational governance roles managed by ORL members." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-border bg-secondary/20 max-w-6xl mx-auto", children: [
        /* @__PURE__ */ jsxs("label", { className: "relative w-full max-w-md", children: [
          /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search by candidate, role, talk title or institution...", className: "w-full rounded border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition-all" })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setSortDesc((s) => !s), className: "inline-flex items-center gap-1.5 rounded border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer select-none", children: [
          /* @__PURE__ */ jsx(ArrowUpDown, { className: "h-3.5 w-3.5" }),
          "Sort by Date (",
          sortDesc ? "Newest first" : "Oldest first",
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-12", children: [
        /* @__PURE__ */ jsx(AcademicTable, { title: "Research Supervision (PhD Guidance)", id: "dc", items: dcItems, icon: GraduationCap, accentClass: "text-indigo-600 dark:text-indigo-400", borderClass: "border-indigo-500/20", headers: ["Period", "Research Scholar / Committee Detail", "Institution"], renderRow: (r) => /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-xs text-muted-foreground tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-xs font-medium text-foreground", children: [
            r.title,
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-xs text-muted-foreground", children: r.organization })
        ] }) }),
        /* @__PURE__ */ jsx(AcademicTable, { title: "Invited Talks & Lectures", id: "talks", items: talkItems, icon: MessagesSquare, accentClass: "text-sky-600 dark:text-sky-400", borderClass: "border-sky-500/20", headers: ["Date", "Title of the Talk", "Venue", "Place"], renderRow: (r) => /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-xs text-muted-foreground tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-xs font-medium text-foreground leading-snug", children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold text-foreground", children: r.title }),
            r.subtitle && /* @__PURE__ */ jsx("div", { className: "text-3xs text-sky-600 dark:text-sky-400 font-semibold mt-1 tracking-wide uppercase", children: r.subtitle }),
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-xs text-muted-foreground", children: r.organization }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-xs text-muted-foreground", children: r.place || "—" })
        ] }) }),
        /* @__PURE__ */ jsx(AcademicTable, { title: "Workshops, Seminars & Tutorials", id: "workshops", items: workshopItems, icon: Presentation, accentClass: "text-cyan-600 dark:text-cyan-400", borderClass: "border-cyan-500/20", headers: ["Period", "Workshop Title", "Host / Organizing Body", "Duration", "Mode"], renderRow: (r) => /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-xs text-muted-foreground tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-xs font-semibold text-foreground leading-snug", children: [
            r.title,
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-xs text-muted-foreground", children: r.organization }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-xs text-muted-foreground", children: r.duration || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-xs text-muted-foreground", children: r.mode || "—" })
        ] }) }),
        /* @__PURE__ */ jsx(AcademicTable, { title: "Board of Studies & Governance", id: "bos", items: bosItems, icon: ClipboardList, accentClass: "text-emerald-600 dark:text-emerald-400", borderClass: "border-emerald-500/20", headers: ["Period", "Role & Academic Body", "Institution / University", "Details Summary"], renderRow: (r) => /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-xs text-muted-foreground tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-xs font-semibold text-foreground leading-snug", children: [
            r.title,
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-xs text-muted-foreground", children: r.organization }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-xs text-muted-foreground max-w-sm whitespace-normal leading-relaxed", children: r.summary || "—" })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  AcademicActivitiesPage as component
};
