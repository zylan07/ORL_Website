import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Calendar, MapPin, User, Paperclip, FileText, ExternalLink, Eye, Download, X } from "lucide-react";
import { u as useRecords, B as Route, C as TYPE_META, f as formatDate, r as resolveAssetUrl } from "./router-ScoMlXed.js";
import "@tanstack/react-query";
import "zod";
function RecordDetails() {
  const records = useRecords();
  const {
    id
  } = Route.useParams();
  const navigate = useNavigate();
  const loaderData = Route.useLoaderData();
  const record = records.find((r) => r.id === id) ?? loaderData.record;
  const meta = TYPE_META[record.type];
  const [basePath, searchStr] = meta.path.split("?");
  const searchParams = searchStr ? Object.fromEntries(new URLSearchParams(searchStr)) : void 0;
  const [preview, setPreview] = useState(null);
  const images = record.attachments.filter((a) => a.kind === "Image");
  const documents = record.attachments.filter((a) => a.kind !== "Image");
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-6 py-8", children: [
    /* @__PURE__ */ jsx("nav", { className: "text-xs text-muted-foreground", "aria-label": "Breadcrumb", children: /* @__PURE__ */ jsxs("ol", { className: "flex flex-wrap items-center gap-1.5", children: [
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-accent hover:underline", children: "Home" }) }),
      /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground/50", children: "›" }),
        /* @__PURE__ */ jsx(Link, { to: basePath, search: searchParams, className: "hover:text-accent hover:underline", children: meta.plural })
      ] }),
      /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground/50", children: "›" }),
        /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: "Details" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
        to: basePath,
        search: searchParams
      }), className: "inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Back to ",
        meta.plural
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => window.history.length > 1 ? window.history.back() : navigate({
        to: "/"
      }), className: "inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground", children: "← Previous page" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 border-b border-border pb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 text-xs", children: [
        /* @__PURE__ */ jsx("span", { className: "rounded bg-accent px-2 py-0.5 font-semibold text-accent-foreground", children: meta.label }),
        record.tags.filter(Boolean).map((t) => /* @__PURE__ */ jsx("span", { className: "rounded border border-border px-2 py-0.5 text-muted-foreground", children: t }, t))
      ] }),
      record.type === "award" && record.title.toLowerCase().includes("best teacher award") && record.title.match(/\s*[\(\[]?\s*(Academic Year\s*\d{4}-\d{4}|\d{4}-\d{4})\s*[\)\]]?/i) ? (() => {
        const match = record.title.match(/\s*[\(\[]?\s*(Academic Year\s*\d{4}-\d{4}|\d{4}-\d{4})\s*[\)\]]?/i);
        const cleanTitle = record.title.replace(match[0], "").trim();
        const academicYear = match[1];
        return /* @__PURE__ */ jsxs("h1", { className: "mt-3 text-2xl font-bold text-foreground md:text-3xl", children: [
          cleanTitle,
          /* @__PURE__ */ jsx("span", { className: "block text-lg font-normal text-muted-foreground mt-1", children: academicYear })
        ] });
      })() : /* @__PURE__ */ jsx("h1", { className: "mt-3 text-2xl font-semibold text-foreground md:text-3xl", children: record.title })
    ] }),
    /* @__PURE__ */ jsxs("dl", { className: "mt-5 grid gap-4 rounded-md border border-border bg-card p-5 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("dt", { className: "flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5" }),
          " Date"
        ] }),
        /* @__PURE__ */ jsx("dd", { className: "mt-1 text-sm text-foreground", children: formatDate(record.date) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("dt", { className: "flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5" }),
          " Organization"
        ] }),
        /* @__PURE__ */ jsx("dd", { className: "mt-1 text-sm text-foreground", children: record.organization })
      ] }),
      record.authors && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("dt", { className: "flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground", children: [
          /* @__PURE__ */ jsx(User, { className: "h-3.5 w-3.5" }),
          " Authors"
        ] }),
        /* @__PURE__ */ jsx("dd", { className: "mt-1 text-sm text-foreground", children: record.authors })
      ] }),
      record.place && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("dt", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: "Place" }),
        /* @__PURE__ */ jsx("dd", { className: "mt-1 text-sm text-foreground", children: record.place })
      ] }),
      record.code && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("dt", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: "Code" }),
        /* @__PURE__ */ jsx("dd", { className: "mt-1 text-sm text-foreground", children: record.code })
      ] }),
      record.duration && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("dt", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: "Duration" }),
        /* @__PURE__ */ jsx("dd", { className: "mt-1 text-sm text-foreground", children: record.duration })
      ] }),
      record.mode && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("dt", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: "Mode" }),
        /* @__PURE__ */ jsx("dd", { className: "mt-1 text-sm text-foreground", children: record.mode })
      ] }),
      record.role && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("dt", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: "Role" }),
        /* @__PURE__ */ jsx("dd", { className: "mt-1 text-sm text-foreground", children: record.role })
      ] }),
      record.doi && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("dt", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: "DOI" }),
        /* @__PURE__ */ jsx("dd", { className: "mt-1 text-sm text-foreground", children: /* @__PURE__ */ jsx("a", { className: "text-accent hover:underline", href: `https://doi.org/${record.doi}`, target: "_blank", rel: "noreferrer", children: record.doi }) })
      ] })
    ] }),
    record.summary && /* @__PURE__ */ jsxs("section", { className: "mt-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold uppercase tracking-wide text-muted-foreground", children: "Summary" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-base leading-relaxed text-foreground", children: record.summary })
    ] }),
    documents.length > 0 && /* @__PURE__ */ jsxs("section", { className: "mt-8", children: [
      /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Paperclip, { className: "h-4 w-4" }),
        " Documents"
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "mt-3 divide-y divide-border rounded-md border border-border bg-card", children: documents.map((a) => /* @__PURE__ */ jsxs("li", { className: "flex flex-wrap items-center justify-between gap-3 px-4 py-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-foreground", children: a.name }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
              a.kind,
              " · ",
              a.size
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2", children: a.kind === "Link" ? /* @__PURE__ */ jsxs("a", { href: a.url, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1.5 rounded border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent", children: [
          /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" }),
          " Open Link"
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("a", { href: a.url, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1.5 rounded border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent", children: [
            /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" }),
            " View Document"
          ] }),
          /* @__PURE__ */ jsxs("a", { href: resolveAssetUrl(a.url), download: true, className: "inline-flex items-center gap-1.5 rounded border border-accent bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-accent/90", children: [
            /* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }),
            " Download"
          ] })
        ] }) })
      ] }, a.id)) })
    ] }),
    images.length > 0 && /* @__PURE__ */ jsxs("section", { className: "mt-8", children: [
      /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Paperclip, { className: "h-4 w-4" }),
        " Photos (",
        images.length,
        ")"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3", children: images.map((a) => /* @__PURE__ */ jsxs("button", { onClick: () => setPreview(a), className: "group block overflow-hidden rounded border border-border bg-card text-left", children: [
        /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(a.url), alt: a.name, className: "aspect-video w-full object-cover transition group-hover:opacity-90", loading: "lazy" }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-border px-3 py-2", children: [
          /* @__PURE__ */ jsx("div", { className: "truncate text-xs font-medium text-foreground", children: a.name }),
          /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
            "Image · ",
            a.size
          ] })
        ] })
      ] }, a.id)) })
    ] }),
    record.attachments.length === 0 && /* @__PURE__ */ jsxs("section", { className: "mt-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold uppercase tracking-wide text-muted-foreground", children: "Attachments" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "No attachments for this record." })
    ] }),
    preview && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4", onClick: () => setPreview(null), children: /* @__PURE__ */ jsxs("div", { className: "relative max-h-full max-w-4xl", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => setPreview(null), className: "absolute -top-10 right-0 inline-flex items-center gap-1 rounded bg-background px-3 py-1 text-xs font-medium text-foreground hover:bg-accent", children: [
        /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" }),
        " Close"
      ] }),
      /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(preview.url), alt: preview.name, className: "max-h-[80vh] w-auto rounded border border-border bg-background" }),
      /* @__PURE__ */ jsx("div", { className: "mt-2 text-center text-xs text-background/90", children: preview.name })
    ] }) })
  ] });
}
export {
  RecordDetails as component
};
