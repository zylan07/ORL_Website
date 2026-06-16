import {
  createFileRoute,
  Link,
  notFound,
  useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Paperclip,
  Download,
  ExternalLink,
  Eye,
  Calendar,
  MapPin,
  X,
  User,
  FileText,
} from "lucide-react";
import {
  getRecord,
  formatDate,
  TYPE_META,
  useRecords,
  type Attachment,
  type RepoRecord,
} from "@/lib/repository-data";
import { resolveAssetUrl } from "@/lib/storage-service";

export const Route = createFileRoute("/record/$id")({
  loader: ({ params }) => {
    const record = getRecord(params.id);
    if (!record) throw notFound();
    return { record };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.record.title ?? "Record"} — UWARL` },
      {
        name: "description",
        content: loaderData?.record.summary ?? "Repository record",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Record not found</h1>
      <Link to="/" className="mt-4 inline-block text-primary hover:underline">
        Return home
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Could not load record</h1>
    </div>
  ),
  component: RecordDetails,
});

function RecordDetails() {
  // Re-read from store so deletions/edits propagate
  const records = useRecords();
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const loaderData = Route.useLoaderData();
  const record: RepoRecord =
    records.find((r) => r.id === id) ?? (loaderData.record as RepoRecord);
  const meta = TYPE_META[record.type];
  const [basePath, searchStr] = meta.path.split("?");
  const searchParams = searchStr
    ? Object.fromEntries(new URLSearchParams(searchStr))
    : undefined;
  const [preview, setPreview] = useState<Attachment | null>(null);
  const images = record.attachments.filter((a) => a.kind === "Image");
  const documents = record.attachments.filter((a) => a.kind !== "Image");

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <nav className="text-xs text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/" className="hover:text-accent hover:underline">
              Home
            </Link>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="text-muted-foreground/50">›</span>
            <Link
              to={basePath}
              search={searchParams}
              className="hover:text-accent hover:underline"
            >
              {meta.plural}
            </Link>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="text-muted-foreground/50">›</span>
            <span className="font-medium text-foreground">Details</span>
          </li>
        </ol>
      </nav>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => navigate({ to: basePath, search: searchParams })}
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {meta.plural}
        </button>
        <button
          onClick={() =>
            window.history.length > 1
              ? window.history.back()
              : navigate({ to: "/" })
          }
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          ← Previous page
        </button>
      </div>

      <div className="mt-3 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded bg-accent px-2 py-0.5 font-semibold text-accent-foreground">
            {meta.label}
          </span>
          {record.tags.filter(Boolean).map((t) => (
            <span
              key={t}
              className="rounded border border-border px-2 py-0.5 text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
        {record.type === "award" &&
        record.title.toLowerCase().includes("best teacher award") &&
        record.title.match(
          /\s*[\(\[]?\s*(Academic Year\s*\d{4}-\d{4}|\d{4}-\d{4})\s*[\)\]]?/i,
        ) ? (
          (() => {
            const match = record.title.match(
              /\s*[\(\[]?\s*(Academic Year\s*\d{4}-\d{4}|\d{4}-\d{4})\s*[\)\]]?/i,
            );
            const cleanTitle = record.title.replace(match![0], "").trim();
            const academicYear = match![1];
            return (
              <h1 className="mt-3 text-2xl font-bold text-foreground md:text-3xl">
                {cleanTitle}
                <span className="block text-lg font-normal text-muted-foreground mt-1">
                  {academicYear}
                </span>
              </h1>
            );
          })()
        ) : (
          <h1 className="mt-3 text-2xl font-semibold text-foreground md:text-3xl">
            {record.title}
          </h1>
        )}
      </div>

      <dl className="mt-5 grid gap-4 rounded-md border border-border bg-card p-5 md:grid-cols-3">
        <div>
          <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" /> Date
          </dt>
          <dd className="mt-1 text-sm text-foreground">
            {formatDate(record.date)}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> Organization
          </dt>
          <dd className="mt-1 text-sm text-foreground">
            {record.organization}
          </dd>
        </div>
        {record.authors && (
          <div>
            <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <User className="h-3.5 w-3.5" /> Authors
            </dt>
            <dd className="mt-1 text-sm text-foreground">{record.authors}</dd>
          </div>
        )}
        {record.place && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Place
            </dt>
            <dd className="mt-1 text-sm text-foreground">{record.place}</dd>
          </div>
        )}
        {record.code && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Code
            </dt>
            <dd className="mt-1 text-sm text-foreground">{record.code}</dd>
          </div>
        )}
        {record.duration && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Duration
            </dt>
            <dd className="mt-1 text-sm text-foreground">{record.duration}</dd>
          </div>
        )}
        {record.mode && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Mode
            </dt>
            <dd className="mt-1 text-sm text-foreground">{record.mode}</dd>
          </div>
        )}
        {record.role && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Role
            </dt>
            <dd className="mt-1 text-sm text-foreground">{record.role}</dd>
          </div>
        )}
        {record.doi && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              DOI
            </dt>
            <dd className="mt-1 text-sm text-foreground">
              <a
                className="text-accent hover:underline"
                href={`https://doi.org/${record.doi}`}
                target="_blank"
                rel="noreferrer"
              >
                {record.doi}
              </a>
            </dd>
          </div>
        )}
      </dl>

      {record.summary && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Summary
          </h2>
          <p className="mt-2 text-base leading-relaxed text-foreground">
            {record.summary}
          </p>
        </section>
      )}

      {documents.length > 0 && (
        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Paperclip className="h-4 w-4" /> Documents
          </h2>
          <ul className="mt-3 divide-y divide-border rounded-md border border-border bg-card">
            {documents.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {a.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {a.kind} · {a.size}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {a.kind === "Link" ? (
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Open Link
                    </a>
                  ) : (
                    <>
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
                      >
                        <Eye className="h-3.5 w-3.5" /> View Document
                      </a>
                      <a
                        href={resolveAssetUrl(a.url)}
                        download
                        className="inline-flex items-center gap-1.5 rounded border border-accent bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-accent/90"
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </a>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {images.length > 0 && (
        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Paperclip className="h-4 w-4" /> Photos ({images.length})
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {images.map((a) => (
              <button
                key={a.id}
                onClick={() => setPreview(a)}
                className="group block overflow-hidden rounded border border-border bg-card text-left"
              >
                <img
                  src={resolveAssetUrl(a.url)}
                  alt={a.name}
                  className="aspect-video w-full object-cover transition group-hover:opacity-90"
                  loading="lazy"
                />
                <div className="border-t border-border px-3 py-2">
                  <div className="truncate text-xs font-medium text-foreground">
                    {a.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Image · {a.size}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {record.attachments.length === 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Attachments
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No attachments for this record.
          </p>
        </section>
      )}

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-h-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-10 right-0 inline-flex items-center gap-1 rounded bg-background px-3 py-1 text-xs font-medium text-foreground hover:bg-accent"
            >
              <X className="h-3.5 w-3.5" /> Close
            </button>
            <img
              src={resolveAssetUrl(preview.url)}
              alt={preview.name}
              className="max-h-[80vh] w-auto rounded border border-border bg-background"
            />
            <div className="mt-2 text-center text-xs text-background/90">
              {preview.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
