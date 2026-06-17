import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  Building2,
  Globe,
  Briefcase,
  Library,
  Award,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { useRecords, formatDate, type RepoRecord } from "@/lib/repository-data";
import { parseDateSafe } from "@/lib/utils";
import { StickySectionNav } from "@/components/sticky-section-nav";
import { resolveAssetUrl } from "@/lib/storage-service";

const technicalTrainingSearchSchema = z.object({
  tab: z.enum(["host", "itec", "itp", "pdp", "coordinator", "pg"]).optional(),
});

export const Route = createFileRoute("/technical-training")({
  validateSearch: (search) => technicalTrainingSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Technical Training & PG Courses — Ocean Research Laboratory" },
      {
        name: "description",
        content:
          "Professional development programmes, ITEC activities, industrial training, PG courses, and host institution engagements at ORL.",
      },
    ],
  }),
  component: TechnicalTrainingPage,
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

function TrainingTable({
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

function TechnicalTrainingPage() {
  const { tab } = Route.useSearch();
  const records = useRecords();

  const [q, setQ] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    if (tab) {
      let targetId: string = tab;
      if (tab === "coordinator") targetId = "coord";
      const el = document.getElementById(targetId);
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [tab]);

  const rawTraining = useMemo(() => {
    return records.filter((r) =>
      ["host", "itec", "itp", "pdp", "coord", "pg"].includes(r.type),
    );
  }, [records]);

  const filteredTraining = useMemo(() => {
    const query = q.trim().toLowerCase();
    let result = rawTraining;
    if (query) {
      result = rawTraining.filter((r) => {
        const haystack = [
          r.title,
          r.organization ?? "",
          r.code ?? "",
          r.role ?? "",
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      });
    }
    return sortDesc
      ? [...result].sort((a, b) => parseDateSafe(b.date).getTime() - parseDateSafe(a.date).getTime())
      : [...result].sort((a, b) => parseDateSafe(a.date).getTime() - parseDateSafe(b.date).getTime());
  }, [rawTraining, q, sortDesc]);

  // Derived counts for filtered items
  const hostItems = useMemo(
    () => filteredTraining.filter((r) => r.type === "host"),
    [filteredTraining],
  );
  const itecItems = useMemo(
    () => filteredTraining.filter((r) => r.type === "itec"),
    [filteredTraining],
  );
  const itpItems = useMemo(
    () => filteredTraining.filter((r) => r.type === "itp"),
    [filteredTraining],
  );
  const pdpItems = useMemo(
    () => filteredTraining.filter((r) => r.type === "pdp"),
    [filteredTraining],
  );
  const coordItems = useMemo(
    () => filteredTraining.filter((r) => r.type === "coord"),
    [filteredTraining],
  );
  const pgItems = useMemo(
    () => filteredTraining.filter((r) => r.type === "pg"),
    [filteredTraining],
  );

  // Raw counts for nav indicators (always derived from full dataset)
  const rawHostCount = useMemo(
    () => rawTraining.filter((r) => r.type === "host").length,
    [rawTraining],
  );
  const rawItecCount = useMemo(
    () => rawTraining.filter((r) => r.type === "itec").length,
    [rawTraining],
  );
  const rawItpCount = useMemo(
    () => rawTraining.filter((r) => r.type === "itp").length,
    [rawTraining],
  );
  const rawPdpCount = useMemo(
    () => rawTraining.filter((r) => r.type === "pdp").length,
    [rawTraining],
  );
  const rawCoordCount = useMemo(
    () => rawTraining.filter((r) => r.type === "coord").length,
    [rawTraining],
  );
  const rawPgCount = useMemo(
    () => rawTraining.filter((r) => r.type === "pg").length,
    [rawTraining],
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
    { label: "Host Programmes", id: "host", icon: Building2, count: rawHostCount, theme: "teal" as const },
    { label: "ITEC", id: "itec", icon: Globe, count: rawItecCount, theme: "teal" as const },
    { label: "ITP", id: "itp", icon: Briefcase, count: rawItpCount, theme: "teal" as const },
    { label: "PDP", id: "pdp", icon: Library, count: rawPdpCount, theme: "teal" as const },
    { label: "PG Programmes", id: "pg", icon: BookOpen, count: rawPgCount, theme: "indigo" as const },
    { label: "Coordinatorships", id: "coord", icon: Award, count: rawCoordCount, theme: "teal" as const }
  ], [rawHostCount, rawItecCount, rawItpCount, rawPdpCount, rawPgCount, rawCoordCount]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 transition-colors duration-300 page-technical-training">
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
                  Technical Training
                </span>
              </li>
            </ol>
          </nav>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Technical Training & Courses
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed font-sans">
            Capacity building, professional training programmes, international
            technical delegations, and post-graduate engineering courses taught
            and coordinated by the laboratory faculty.
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
              placeholder="Search by programme title, code, role or organization..."
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
          {/* HOST */}
          <TrainingTable
            title="Host Institution Sessions"
            id="host"
            items={hostItems}
            icon={Building2}
            accentClass="text-teal-600 dark:text-teal-400"
            borderClass="border-teal-500/20"
            headers={[
              "Period",
              "Programme Title",
              "Host Institution",
              "Duration",
              "Role",
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
                <td className="px-4 py-3 align-top text-xs text-muted-foreground">
                  {r.duration || "—"}
                </td>
                <td className="px-4 py-3 align-top text-xs text-muted-foreground">
                  {r.role || "—"}
                </td>
              </>
            )}
          />

          {/* ITEC */}
          <TrainingTable
            title="ITEC Programmes"
            id="itec"
            items={itecItems}
            icon={Globe}
            accentClass="text-teal-600 dark:text-teal-400"
            borderClass="border-teal-500/20"
            headers={["Period", "Programme Title", "Duration", "Role"]}
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
                  {r.duration || "—"}
                </td>
                <td className="px-4 py-3 align-top text-xs text-muted-foreground">
                  {r.role || "—"}
                </td>
              </>
            )}
          />

          {/* ITP */}
          <TrainingTable
            title="ITP Programmes"
            id="itp"
            items={itpItems}
            icon={Briefcase}
            accentClass="text-teal-600 dark:text-teal-400"
            borderClass="border-teal-500/20"
            headers={["Period", "Programme Title", "Duration", "Role"]}
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
                  {r.duration || "—"}
                </td>
                <td className="px-4 py-3 align-top text-xs text-muted-foreground">
                  {r.role || "—"}
                </td>
              </>
            )}
          />

          {/* PDP RESOURCE */}
          <TrainingTable
            title="PDP as Resource Person"
            id="pdp"
            items={pdpItems}
            icon={Library}
            accentClass="text-teal-600 dark:text-teal-400"
            borderClass="border-teal-500/20"
            headers={["Period", "Programme Title", "Code", "Duration", "Mode"]}
            renderRow={(r) => (
              <>
                <td className="whitespace-nowrap px-4 py-3 align-top text-xs text-muted-foreground tabular-nums">
                  {formatDate(r.date)}
                </td>
                <td className="px-4 py-3 align-top text-xs font-medium text-foreground">
                  {r.title}
                  {renderAttachments(r)}
                </td>
                <td className="px-4 py-3 align-top text-xs text-muted-foreground font-mono">
                  {r.code || "—"}
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

          {/* PDP COORDINATOR */}
          <TrainingTable
            title="PDP as Coordinator"
            id="coord"
            items={coordItems}
            icon={Award}
            accentClass="text-teal-600 dark:text-teal-400"
            borderClass="border-teal-500/20"
            headers={["Period", "Programme Title", "Code", "Duration", "Mode"]}
            renderRow={(r) => (
              <>
                <td className="whitespace-nowrap px-4 py-3 align-top text-xs text-muted-foreground tabular-nums">
                  {formatDate(r.date)}
                </td>
                <td className="px-4 py-3 align-top text-xs font-medium text-foreground">
                  {r.title}
                  {renderAttachments(r)}
                </td>
                <td className="px-4 py-3 align-top text-xs text-muted-foreground font-mono">
                  {r.code || "—"}
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

          {/* PG COURSES */}
          <TrainingTable
            title="Post Graduate Courses (M.Tech)"
            id="pg"
            items={pgItems}
            icon={GraduationCap}
            accentClass="text-indigo-600 dark:text-indigo-400"
            borderClass="border-indigo-500/20"
            headers={[
              "Year",
              "Subject Name",
              "Subject Code",
              "Programme",
              "Semester",
              "No. of Students",
            ]}
            renderRow={(r) => (
              <>
                <td className="whitespace-nowrap px-4 py-3 align-top text-xs text-muted-foreground tabular-nums">
                  {formatDate(r.date)}
                </td>
                <td className="px-4 py-3 align-top text-xs font-semibold text-foreground">
                  {r.title}
                  {renderAttachments(r)}
                </td>
                <td className="px-4 py-3 align-top text-xs text-muted-foreground font-mono">
                  {r.code || "—"}
                </td>
                <td className="px-4 py-3 align-top text-xs text-muted-foreground">
                  {r.organization || "—"}
                </td>
                <td className="px-4 py-3 align-top text-xs text-muted-foreground">
                  Semester {r.duration || "—"}
                </td>
                <td className="px-4 py-3 align-top text-xs text-muted-foreground tabular-nums">
                  {r.mode || "—"}
                </td>
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}
