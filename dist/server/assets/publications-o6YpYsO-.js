import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, Presentation, Book, Search, ArrowUpDown, ExternalLink, ChevronLeft, ChevronRight, Paperclip } from "lucide-react";
import { b as Route, u as useRecords, f as formatDate } from "./router-ScoMlXed.js";
import { S as StickySectionNav } from "./sticky-section-nav-ay_A8ZSs.js";
import "@tanstack/react-query";
import "zod";
function renderAttachments(r) {
  if (!r.attachments || r.attachments.length === 0) return null;
  return /* @__PURE__ */ jsx("div", { className: "mt-1.5 flex flex-wrap gap-1", children: r.attachments.map((att) => /* @__PURE__ */ jsxs("a", { href: att.url, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[9px] font-semibold text-secondary-foreground hover:bg-primary/20 hover:text-primary transition", children: [
    /* @__PURE__ */ jsx(Paperclip, { className: "h-2.5 w-2.5" }),
    att.name,
    " (",
    att.size,
    ")"
  ] }, att.id)) });
}
function PublicationTable({
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
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground", children: title })
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
        pagedItems.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: headers.length, className: "px-4 py-10 text-center text-xs text-text-muted", children: "No publications match the current filters." }) })
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
function PublicationsPage() {
  const {
    tab
  } = Route.useSearch();
  const records = useRecords();
  const [q, setQ] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  useEffect(() => {
    if (tab) {
      const el = document.getElementById(tab);
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
  const rawPublications = useMemo(() => {
    return records.filter((r) => r.type === "publication");
  }, [records]);
  const filteredPublications = useMemo(() => {
    const query = q.trim().toLowerCase();
    let result = rawPublications;
    if (query) {
      result = rawPublications.filter((r) => {
        const haystack = [r.title, r.organization, r.authors ?? "", r.doi ?? ""].join(" ").toLowerCase();
        return haystack.includes(query);
      });
    }
    return sortDesc ? [...result].sort((a, b) => b.date.localeCompare(a.date)) : [...result].sort((a, b) => a.date.localeCompare(b.date));
  }, [rawPublications, q, sortDesc]);
  const journals = useMemo(() => filteredPublications.filter((r) => r.subtype === "Journal"), [filteredPublications]);
  const conferences = useMemo(() => filteredPublications.filter((r) => r.subtype === "Conference"), [filteredPublications]);
  const books = useMemo(() => filteredPublications.filter((r) => r.subtype === "Book"), [filteredPublications]);
  const rawJournalsCount = useMemo(() => rawPublications.filter((r) => r.subtype === "Journal").length, [rawPublications]);
  const rawConferencesCount = useMemo(() => rawPublications.filter((r) => r.subtype === "Conference").length, [rawPublications]);
  const rawBooksCount = useMemo(() => rawPublications.filter((r) => r.subtype === "Book").length, [rawPublications]);
  const navItems = useMemo(() => [{
    label: "Journals",
    id: "journals",
    icon: BookOpen,
    count: rawJournalsCount,
    theme: "sky"
  }, {
    label: "Conferences",
    id: "conferences",
    icon: Presentation,
    count: rawConferencesCount,
    theme: "indigo"
  }, {
    label: "Books",
    id: "books",
    icon: Book,
    count: rawBooksCount,
    theme: "teal"
  }], [rawJournalsCount, rawConferencesCount, rawBooksCount]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground pb-16 transition-colors duration-300 page-publications", children: [
    /* @__PURE__ */ jsx(StickySectionNav, { items: navItems }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-6 mt-10 space-y-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center max-w-3xl mx-auto space-y-4", children: [
        /* @__PURE__ */ jsx("nav", { className: "text-3xs text-text-muted justify-center flex mb-2", "aria-label": "Breadcrumb", children: /* @__PURE__ */ jsxs("ol", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-accent transition-colors", children: "Home" }) }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { children: "›" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-text-secondary", children: "Publications" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl", children: "Publications" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-text-secondary leading-relaxed font-sans", children: "Explore the peer-reviewed research outputs, IEEE conference papers, book chapters, and engineering reference volumes authored by ORL faculty and researchers." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-border bg-secondary/20 max-w-6xl mx-auto", children: [
        /* @__PURE__ */ jsxs("label", { className: "relative w-full max-w-md", children: [
          /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: q, onChange: (e) => setQ(e.target.value), placeholder: "Filter publications by title, author, journal or publisher...", className: "w-full rounded border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition-all" })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setSortDesc((s) => !s), className: "inline-flex items-center gap-1.5 rounded border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer select-none", children: [
          /* @__PURE__ */ jsx(ArrowUpDown, { className: "h-3.5 w-3.5" }),
          "Sort by Date (",
          sortDesc ? "Newest first" : "Oldest first",
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-12", children: [
        /* @__PURE__ */ jsx(PublicationTable, { title: "Journal Publications", id: "journals", items: journals, icon: BookOpen, accentClass: "text-sky-600 dark:text-sky-400", borderClass: "border-sky-500/20", headers: ["Year", "Title of the Paper", "Authors", "Journal Name", "DOI"], renderRow: (r) => /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-xs text-muted-foreground tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-xs font-semibold text-foreground leading-snug", children: [
            r.title,
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-xs text-muted-foreground italic max-w-xs", children: r.authors || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-xs text-muted-foreground max-w-xs", children: r.organization || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-xs text-muted-foreground whitespace-nowrap", children: r.doi ? /* @__PURE__ */ jsxs("a", { href: r.doi.startsWith("http") ? r.doi : `https://doi.org/${r.doi}`, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-0.5 text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300 hover:underline", children: [
            "DOI Link ",
            /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3 inline" })
          ] }) : "—" })
        ] }) }),
        /* @__PURE__ */ jsx(PublicationTable, { title: "Conference Publications", id: "conferences", items: conferences, icon: Presentation, accentClass: "text-indigo-600 dark:text-indigo-400", borderClass: "border-indigo-500/20", headers: ["Year", "Title of the Paper", "Authors", "Conference Name"], renderRow: (r) => /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-xs text-muted-foreground tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-xs font-semibold text-foreground leading-snug", children: [
            r.title,
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-xs text-muted-foreground italic max-w-xs", children: r.authors || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-xs text-muted-foreground max-w-xs", children: r.organization || "—" })
        ] }) }),
        /* @__PURE__ */ jsx(PublicationTable, { title: "Books / Book Chapters", id: "books", items: books, icon: Book, accentClass: "text-teal-600 dark:text-teal-400", borderClass: "border-teal-500/20", headers: ["Year", "Book / Chapter Title", "Authors", "Publisher"], renderRow: (r) => /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "whitespace-nowrap px-4 py-3 align-top text-xs text-muted-foreground tabular-nums", children: formatDate(r.date) }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 align-top text-xs font-semibold text-foreground leading-snug", children: [
            r.title,
            renderAttachments(r)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-xs text-muted-foreground italic max-w-xs", children: r.authors || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 align-top text-xs text-muted-foreground max-w-xs", children: r.organization || "—" })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  PublicationsPage as component
};
