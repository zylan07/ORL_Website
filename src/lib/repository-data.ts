import { useSyncExternalStore } from "react";
import { parseDateSafe } from "./utils";
import { supabase } from "./supabase";
import {
  getRecords,
  saveRecords,
  getCarouselConfig,
  saveCarouselConfig,
  getPageTexts,
  savePageTexts,
  type RecordType,
  type RepoRecord,
  type Attachment,
  type CarouselImage,
  type PageText,
} from "./storage-service";

export type { RecordType, RepoRecord, Attachment, CarouselImage };
export { getCarouselConfig, saveCarouselConfig };

export interface PageMeta {
  label: string;
  plural: string;
  path: string;
  description: string;
}

export const TYPE_META: Record<RecordType, PageMeta> = {
  award: {
    label: "Award",
    plural: "Awards & Recognition",
    path: "/awards",
    description:
      "Honors, awards, and recognitions received by laboratory faculty, scholars and students.",
  },
  talk: {
    label: "Invited Talk",
    plural: "Invited Talks",
    path: "/legacy/talks",
    description:
      "Invited lectures, keynotes, and session chair engagements at academic and industry venues.",
  },
  workshop: {
    label: "Workshop",
    plural: "Workshops",
    path: "/legacy/workshops",
    description:
      "Workshops, tutorials, and short courses organized, hosted, or chaired by laboratory members.",
  },
  publication: {
    label: "Publication",
    plural: "Publications",
    path: "/publications",
    description:
      "Peer-reviewed journal articles, conference papers, and books authored by laboratory members.",
  },
  bos: {
    label: "Board of Studies",
    plural: "Board of Studies",
    path: "/legacy/bos",
    description:
      "Board of studies memberships and academic governance roles held by laboratory faculty.",
  },
  dc: {
    label: "Research Supervision",
    plural: "Research Supervision",
    path: "/legacy/research-supervision",
    description:
      "Research supervision, doctoral committee participations, research advisory panels, and PhD evaluations.",
  },
  host: {
    label: "Host Institution",
    plural: "Host Institution",
    path: "/technical-training?tab=host",
    description:
      "Programmes conducted as visiting faculty or resource person at host institutions.",
  },
  itec: {
    label: "ITEC Programme",
    plural: "ITEC Programmes",
    path: "/technical-training?tab=itec",
    description:
      "Indian Technical and Economic Cooperation (ITEC) programmes delivered to international participants.",
  },
  itp: {
    label: "ITP Programme",
    plural: "ITP Programmes",
    path: "/technical-training?tab=itp",
    description:
      "Industrial Training Programmes conducted for engineering students and industry participants.",
  },
  pdp: {
    label: "PDP as Resource Person",
    plural: "PDP as Resource Person",
    path: "/technical-training?tab=pdp",
    description:
      "Professional Development Programmes conducted as resource person.",
  },
  pg: {
    label: "PG Course",
    plural: "PG Courses",
    path: "/legacy/pg",
    description:
      "Post Graduate (M.Tech VLSI & Embedded Systems) courses taught and subjects coordinated by laboratory faculty.",
  },
  coord: {
    label: "PDP as Coordinator",
    plural: "PDP as Coordinator",
    path: "/technical-training?tab=coordinator",
    description:
      "Professional Development Programmes coordinated and managed by laboratory faculty.",
  },
};

// ------------- react reactive state bindings -------------

let recordsCache: RepoRecord[] = getRecords();
const recordsListeners = new Set<() => void>();

export function triggerRecordsUpdate() {
  recordsCache = getRecords();
  for (const cb of recordsListeners) cb();
}

export function updateRecordsCache(records: RepoRecord[]) {
  recordsCache = records;
  for (const cb of recordsListeners) cb();
}

function subscribeRecords(cb: () => void) {
  recordsListeners.add(cb);
  return () => recordsListeners.delete(cb);
}

export function useRecords(): RepoRecord[] {
  return useSyncExternalStore(
    subscribeRecords,
    () => recordsCache,
    () => recordsCache,
  );
}

export function getAllRecords(): RepoRecord[] {
  return recordsCache;
}

export function getRecord(id: string): RepoRecord | undefined {
  return recordsCache.find((r) => r.id === id);
}

export function createRecord(input: Omit<RepoRecord, "id">): RepoRecord {
  const id = `${input.type}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const rec: RepoRecord = {
    ...input,
    id,
    attachments: input.attachments ?? [],
    tags: input.tags ?? [],
  };
  const current = getRecords();
  const updated = [rec, ...current];
  saveRecords(updated);
  triggerRecordsUpdate();
  return rec;
}

export function updateRecord(id: string, patch: Partial<RepoRecord>) {
  const current = getRecords();
  const updated = current.map((r) =>
    r.id === id ? { ...r, ...patch, id: r.id } : r,
  );
  saveRecords(updated);
  triggerRecordsUpdate();
}

export function deleteRecord(id: string) {
  const current = getRecords();
  const updated = current.filter((r) => r.id !== id);
  saveRecords(updated);
  triggerRecordsUpdate();

  if (supabase) {
    (async () => {
      try {
        const { error } = await supabase
          .from("records")
          .delete()
          .eq("record_key", id);
        if (error) throw error;
      } catch (err: any) {
        console.warn(`Background record deletion in Supabase failed for ${id}. running in offline fallback.`, err.message || err);
      }
    })();
  }
}

export function addAttachment(recordId: string, att: Omit<Attachment, "id">) {
  const id = `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
  const current = getRecords();
  const updated = current.map((r) =>
    r.id === recordId
      ? { ...r, attachments: [...r.attachments, { ...att, id }] }
      : r,
  );
  saveRecords(updated);
  triggerRecordsUpdate();
}

export function removeAttachment(recordId: string, attId: string) {
  const current = getRecords();
  const updated = current.map((r) =>
    r.id === recordId
      ? { ...r, attachments: r.attachments.filter((a) => a.id !== attId) }
      : r,
  );
  saveRecords(updated);
  triggerRecordsUpdate();
}

export function resetRecords() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("uwarl-repo-records-v1");
  }
  triggerRecordsUpdate();
}

// ------------- page title & description overrides -------------

let pageTextCache = getPageTexts();
const pageTextListeners = new Set<() => void>();

function triggerPageTextUpdate() {
  pageTextCache = getPageTexts();
  for (const cb of pageTextListeners) cb();
}

export function usePageText(type: RecordType): {
  title: string;
  description: string;
} {
  const snap = useSyncExternalStore(
    (cb) => {
      pageTextListeners.add(cb);
      return () => pageTextListeners.delete(cb);
    },
    () => pageTextCache,
    () => pageTextCache,
  );
  const meta = TYPE_META[type];
  return {
    title: snap[type]?.title ?? meta.plural,
    description: snap[type]?.description ?? meta.description,
  };
}

export function setPageText(type: RecordType, patch: PageText) {
  const current = getPageTexts();
  const updated = { ...current, [type]: { ...current[type], ...patch } };
  savePageTexts(updated);
  triggerPageTextUpdate();
}

// ------------- carousel config overrides -------------

let carouselCache = getCarouselConfig();
const carouselListeners = new Set<() => void>();

function triggerCarouselUpdate() {
  carouselCache = getCarouselConfig();
  for (const cb of carouselListeners) cb();
}

export function useCarousel(type: RecordType): CarouselImage[] {
  const snap = useSyncExternalStore(
    (cb) => {
      carouselListeners.add(cb);
      return () => carouselListeners.delete(cb);
    },
    () => carouselCache,
    () => carouselCache,
  );
  return (snap[type] || []).sort((a, b) => a.order - b.order);
}

export function setCarouselImages(type: RecordType, images: CarouselImage[]) {
  const current = getCarouselConfig();
  const updated = { ...current, [type]: images };
  saveCarouselConfig(updated);
  triggerCarouselUpdate();
}

// ------------- search & date formatting -------------

export function formatDate(dateStr: string) {
  if (!dateStr) return "N/A";
  const trimStr = dateStr.trim();

  // 1. Year only (YYYY)
  if (/^\d{4}$/.test(trimStr)) {
    return trimStr;
  }

  // 2. Year + Month (YYYY-MM)
  if (/^\d{4}-\d{2}$/.test(trimStr)) {
    const [year, month] = trimStr.split("-");
    const d = new Date(Number(year), Number(month) - 1, 1);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-GB", { year: "numeric", month: "short" });
    }
    return trimStr;
  }

  // 3. Full Date (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimStr)) {
    const [year, month, day] = trimStr.split("-");
    const d = new Date(Number(year), Number(month) - 1, Number(day));
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    }
    return trimStr;
  }

  // Fallback for other formats
  return dateStr;
}

function parseTerm(term: string): { kind: "date" | "text"; value: string } {
  if (/^\d{4}$/.test(term)) return { kind: "date", value: term };
  if (/^\d{4}-\d{1,2}$/.test(term)) {
    const [y, m] = term.split("-");
    return { kind: "date", value: `${y}-${m.padStart(2, "0")}` };
  }
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(term)) {
    const [y, m, d] = term.split("-");
    return {
      kind: "date",
      value: `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`,
    };
  }
  return { kind: "text", value: term.toLowerCase() };
}

function recordHaystack(r: RepoRecord): string {
  return [
    r.title,
    r.organization,
    r.summary,
    r.authors ?? "",
    r.place ?? "",
    r.code ?? "",
    r.duration ?? "",
    r.mode ?? "",
    r.role ?? "",
    r.doi ?? "",
    r.subtype ?? "",
    r.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export function searchRecords(type: RecordType, query: string): RepoRecord[] {
  const list = recordsCache.filter((r) => r.type === type);
  const q = query.trim();
  if (!q) return [...list].sort((a, b) => parseDateSafe(b.date).getTime() - parseDateSafe(a.date).getTime());
  const terms = q.split(/\s+/).map(parseTerm);
  return list
    .filter((r) => {
      const hay = recordHaystack(r);
      return terms.every((t) => {
        if (t.kind === "date") return r.date.startsWith(t.value);
        return hay.includes(t.value);
      });
    })
    .sort((a, b) => parseDateSafe(b.date).getTime() - parseDateSafe(a.date).getTime());
}

export function recordCounts() {
  const out: Record<RecordType, number> = {
    award: 0,
    talk: 0,
    workshop: 0,
    publication: 0,
    bos: 0,
    dc: 0,
    host: 0,
    itec: 0,
    itp: 0,
    pdp: 0,
    pg: 0,
    coord: 0,
  };
  for (const r of recordsCache) {
    if (out[r.type] !== undefined) {
      out[r.type]++;
    }
  }
  return out;
}
