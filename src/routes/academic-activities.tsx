import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  GraduationCap,
  MessagesSquare,
  Presentation,
  ClipboardList,
} from "lucide-react";
import { useRecords, formatDate, type RepoRecord } from "@/lib/repository-data";
import { parseDateSafe } from "@/lib/utils";
import { StickySectionNav } from "@/components/sticky-section-nav";
import { resolveAssetUrl } from "@/lib/storage-service";

const academicActivitiesSearchSchema = z.object({
  tab: z.enum(["dc", "talks", "workshops", "bos"]).optional(),
});

export const Route = createFileRoute("/academic-activities")({
  validateSearch: (search) => {
    const res = academicActivitiesSearchSchema.safeParse(search);
    return res.success ? res.data : {};
  },
  head: () => ({
    meta: [
      { title: "Academic Activities — Ocean Research Laboratory" },
      {
        name: "description",
        content:
          "Explore doctoral research supervision, invited academic talks, workshops, and board of studies governance at ORL.",
      },
    ],
  }),
  component: AcademicActivitiesPage,
});

function renderAttachments(r: RepoRecord) {
  if (!r.attachments || r.attachments.length === 0) return null;
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {r.attachments.map((att) => (
        <a
          key={att.id}
          href={resolveAssetUrl(att.url)}
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

function AcademicTable({
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
          <h2 className="text-lg font-bold tracking-tight text-foreground">
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
                  No records match the current filters.
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

function AcademicActivitiesPage() {
  const { tab } = Route.useSearch();
  const records = useRecords();

  const [q, setQ] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    if (tab) {
      let targetId: string = tab;
      if (tab === "dc") targetId = "supervision";
      const el = document.getElementById(targetId);
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [tab]);

  const rawActivities = useMemo(() => {
    return records.filter((r) =>
      ["dc", "talk", "workshop", "bos"].includes(r.type),
    );
  }, [records]);

  const filteredActivities = useMemo(() => {
    const query = q.trim().toLowerCase();
    let result = rawActivities;
    if (query) {
      result = rawActivities.filter((r) => {
        const haystack = [
          r.title,
          r.organization ?? "",
          r.place ?? "",
          r.summary ?? "",
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      });
    }
    return sortDesc
      ? [...result].sort((a, b) => parseDateSafe(b.date).getTime() - parseDateSafe(a.date).getTime())
      : [...result].sort((a, b) => parseDateSafe(a.date).getTime() - parseDateSafe(b.date).getTime());
  }, [rawActivities, q, sortDesc]);

  // Derived counts for filtered items
  const dcItems = useMemo(
    () => filteredActivities.filter((r) => r.type === "dc"),
    [filteredActivities],
  );
  const talkItems = useMemo(
    () => filteredActivities.filter((r) => r.type === "talk"),
    [filteredActivities],
  );
  const workshopItems = useMemo(
    () => filteredActivities.filter((r) => r.type === "workshop"),
    [filteredActivities],
  );
  const bosItems = useMemo(
    () => filteredActivities.filter((r) => r.type === "bos"),
    [filteredActivities],
  );

  // Raw counts for nav indicators (always derived from full dataset)
  const rawDcCount = useMemo(
    () => rawActivities.filter((r) => r.type === "dc").length,
    [rawActivities],
  );
  const rawTalkCount = useMemo(
    () => rawActivities.filter((r) => r.type === "talk").length,
    [rawActivities],
  );
  const rawWorkshopCount = useMemo(
    () => rawActivities.filter((r) => r.type === "workshop").length,
    [rawActivities],
  );
  const rawBosCount = useMemo(
    () => rawActivities.filter((r) => r.type === "bos").length,
    [rawActivities],
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
    { label: "Doctoral Committee", id: "dc", icon: GraduationCap, count: rawDcCount, theme: "indigo" as const },
    { label: "Invited Talks", id: "talks", icon: MessagesSquare, count: rawTalkCount, theme: "sky" as const },
    { label: "Workshops", id: "workshops", icon: Presentation, count: rawWorkshopCount, theme: "cyan" as const },
    { label: "Board of Studies", id: "bos", icon: ClipboardList, count: rawBosCount, theme: "emerald" as const }
  ], [rawDcCount, rawTalkCount, rawWorkshopCount, rawBosCount]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 transition-colors duration-300 page-academic-activities">
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
                  Academic Activities
                </span>
              </li>
            </ol>
          </nav>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Academic Activities
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed font-sans">
            Explore doctoral research guidance, academic committee memberships,
            invited presentations, keynotes, workshops, and educational
            governance roles managed by ORL members.
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
              placeholder="Search by candidate, role, talk title or institution..."
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
          {/* RESEARCH SUPERVISION */}
          <AcademicTable
            title="Research Supervision (PhD Guidance)"
            id="dc"
            items={dcItems}
            icon={GraduationCap}
            accentClass="text-indigo-600 dark:text-indigo-400"
            borderClass="border-indigo-500/20"
            headers={[
              "Period",
              "Research Scholar / Committee Detail",
              "Institution",
            ]}
            renderRow={(r) => (
              <>
                <td className="whitespace-nowrap px-4 py-3 align-top text-xs text-muted-foreground tabular-nums">
                  {formatDate(r.date)}
                </td>
                <td className="px-4 py-3 align-top text-xs font-medium text-foreground">
                  {r.title}
                  {renderAttachments(r)}
                </td>
                <td className="px-4 py-3 align-top text-xs text-muted-foreground">
                  {r.organization}
                </td>
              </>
            )}
          />

          {/* INVITED TALKS */}
          <AcademicTable
            title="Invited Talks & Lectures"
            id="talks"
            items={talkItems}
            icon={MessagesSquare}
            accentClass="text-sky-600 dark:text-sky-400"
            borderClass="border-sky-500/20"
            headers={["Date", "Title of the Talk", "Venue", "Place"]}
            renderRow={(r) => (
              <>
                <td className="whitespace-nowrap px-4 py-3 align-top text-xs text-muted-foreground tabular-nums">
                  {formatDate(r.date)}
                </td>
                <td className="px-4 py-3 align-top text-xs font-medium text-foreground leading-snug">
                  <div className="font-semibold text-foreground">{r.title}</div>
                  {r.subtitle && (
                    <div className="text-3xs text-sky-600 dark:text-sky-400 font-semibold mt-1 tracking-wide uppercase">
                      {r.subtitle}
                    </div>
                  )}
                  {renderAttachments(r)}
                </td>
                <td className="px-4 py-3 align-top text-xs text-muted-foreground">
                  {r.organization}
                </td>
                <td className="px-4 py-3 align-top text-xs text-muted-foreground">
                  {r.place || "—"}
                </td>
              </>
            )}
          />

          {/* WORKSHOPS */}
          <AcademicTable
            title="Workshops, Seminars & Tutorials"
            id="workshops"
            items={workshopItems}
            icon={Presentation}
            accentClass="text-cyan-600 dark:text-cyan-400"
            borderClass="border-cyan-500/20"
            headers={[
              "Period",
              "Workshop Title",
              "Host / Organizing Body",
              "Duration",
              "Mode",
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
                <td className="px-4 py-3 align-top text-xs text-muted-foreground">
                  {r.organization}
                </td>
                <td className="px-4 py-3 align-top text-xs text-muted-foreground">
                  {r.duration || "—"}
                </td>
                <td className="px-4 py-3 align-top text-xs text-muted-foreground">
                  {r.mode || "—"}
                </td>
              </>
            )}
          />

          {/* BOARD OF STUDIES */}
          <AcademicTable
            title="Board of Studies & Governance"
            id="bos"
            items={bosItems}
            icon={ClipboardList}
            accentClass="text-emerald-600 dark:text-emerald-400"
            borderClass="border-emerald-500/20"
            headers={[
              "Period",
              "Role & Academic Body",
              "Institution / University",
              "Details Summary",
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
                <td className="px-4 py-3 align-top text-xs text-muted-foreground">
                  {r.organization}
                </td>
                <td className="px-4 py-3 align-top text-xs text-muted-foreground max-w-sm whitespace-normal leading-relaxed">
                  {r.summary || "—"}
                </td>
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}
