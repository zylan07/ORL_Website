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
} from "lucide-react";
import { useRecords, formatDate, type RepoRecord } from "@/lib/repository-data";
import { StickySectionNav } from "@/components/sticky-section-nav";
import { parseDateSafe } from "@/lib/utils";

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
}: {
  title: string;
  id: string;
  items: RepoRecord[];
  headers: string[];
  accentClass: string;
  borderClass: string;
  icon: React.ComponentType<{ className?: string }>;
  renderRow: (r: RepoRecord) => React.ReactNode;
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
        className={`border-b ${borderClass} pb-3 flex items-center justify-between`}
      >
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${accentClass}`} />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded bg-secondary/80 ${accentClass} font-mono border ${borderClass}`}
        >
          {items.length} records
        </span>
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

function PublicationsPage() {
  const { tab } = Route.useSearch();
  const records = useRecords();

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

  // Derived counts for filtered items
  const journals = useMemo(
    () => filteredPublications.filter((r) => r.subtype === "Journal"),
    [filteredPublications],
  );
  const conferences = useMemo(
    () => filteredPublications.filter((r) => r.subtype === "Conference"),
    [filteredPublications],
  );
  const books = useMemo(
    () => filteredPublications.filter((r) => r.subtype === "Book"),
    [filteredPublications],
  );

  // Raw counts for navigation indicators (always derived from current full dataset)
  const rawJournalsCount = useMemo(
    () => rawPublications.filter((r) => r.subtype === "Journal").length,
    [rawPublications],
  );
  const rawConferencesCount = useMemo(
    () => rawPublications.filter((r) => r.subtype === "Conference").length,
    [rawPublications],
  );
  const rawBooksCount = useMemo(
    () => rawPublications.filter((r) => r.subtype === "Book").length,
    [rawPublications],
  );

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

  const navItems = useMemo(() => [
    { label: "Journals", id: "journals", icon: BookOpen, count: rawJournalsCount, theme: "sky" as const },
    { label: "Conferences", id: "conferences", icon: Presentation, count: rawConferencesCount, theme: "indigo" as const },
    { label: "Books", id: "books", icon: Book, count: rawBooksCount, theme: "teal" as const }
  ], [rawJournalsCount, rawConferencesCount, rawBooksCount]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 transition-colors duration-300 page-publications">
      <StickySectionNav items={navItems} />

      {/* Main Content Area */}
      <div className="mx-auto max-w-6xl px-6 mt-10 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <nav
            className="text-3xs text-text-muted justify-center flex mb-2"
            aria-label="Breadcrumb"
          >
            <ol className="flex items-center gap-1.5">
              <li>
                <Link to="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <span>›</span>
                <span className="font-medium text-text-secondary">
                  Publications
                </span>
              </li>
            </ol>
          </nav>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Publications
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed font-sans">
            Explore the peer-reviewed research outputs, IEEE conference papers,
            book chapters, and engineering reference volumes authored by ORL
            faculty and researchers.
          </p>
        </div>

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
          <button
            onClick={() => setSortDesc((s) => !s)}
            className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer select-none"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            Sort by Date ({sortDesc ? "Newest first" : "Oldest first"})
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {/* JOURNALS */}
          <PublicationTable
            title="Journal Publications"
            id="journals"
            items={journals}
            icon={BookOpen}
            accentClass="text-sky-600 dark:text-sky-400"
            borderClass="border-sky-500/20"
            headers={[
              "Year",
              "Title of the Paper",
              "Authors",
              "Journal Name",
              "DOI",
            ]}
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
              </>
            )}
          />

          {/* CONFERENCES */}
          <PublicationTable
            title="Conference Publications"
            id="conferences"
            items={conferences}
            icon={Presentation}
            accentClass="text-indigo-600 dark:text-indigo-400"
            borderClass="border-indigo-500/20"
            headers={[
              "Year",
              "Title of the Paper",
              "Authors",
              "Conference Name",
            ]}
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
              </>
            )}
          />

          {/* BOOKS */}
          <PublicationTable
            title="Books / Book Chapters"
            id="books"
            items={books}
            icon={Book}
            accentClass="text-teal-600 dark:text-teal-400"
            borderClass="border-teal-500/20"
            headers={["Year", "Book / Chapter Title", "Authors", "Publisher"]}
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
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}
