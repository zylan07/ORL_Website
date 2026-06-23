import seedData from "@/data/records.json";
import { supabase } from "./supabase";

export type RecordType =
  | "award"
  | "talk"
  | "workshop"
  | "publication"
  | "bos"
  | "dc"
  | "host"
  | "itec"
  | "itp"
  | "pdp"
  | "pg"
  | "coord";

export interface Attachment {
  id: string;
  name: string;
  size: string;
  kind: "PDF" | "DOC" | "Slides" | "Link" | "Image";
  url: string;
}

export interface RepoRecord {
  id: string;
  type: RecordType;
  title: string;
  date: string; // YYYY-MM-DD
  organization: string;
  summary: string;
  tags: string[];
  authors?: string;
  place?: string;
  code?: string;
  duration?: string;
  mode?: string;
  role?: string;
  doi?: string;
  subtype?: string;
  recipient?: string;
  subtitle?: string;
  attachments: Attachment[];
  showcaseImage?: string;
  showInGallery?: boolean;
  featured?: boolean;
  showcaseCategory?: "faculty" | "student";
  showcasePriority?: number;
  awardAudience?: "faculty" | "student" | "faculty-student";
  awardCategory?: string;
}

export interface CarouselImage {
  id: string;
  url: string; // Base64 or image path
  duration: number; // in seconds
  order: number;
  caption?: string;
  category?: "faculty" | "student";
}

export interface UploadedAsset {
  id: string;
  url: string; // Base64 data URL locally, Supabase later
  type: "image" | "document" | "video";
  fileName: string;
  uploadedAt: string;
  altText: string;
  category: string;
  supabaseUrl?: string;
}

export type CarouselConfig = Record<RecordType, CarouselImage[]>;

export interface PageText {
  title?: string;
  description?: string;
}

const ASSETS_KEY = "uwarl-db-assets-v1";

function getPayloadSizeKB(value: string): number {
  try {
    const bytes = new TextEncoder().encode(value).length;
    return Number((bytes / 1024).toFixed(3));
  } catch (e) {
    return Number((value.length / 1024).toFixed(3));
  }
}

function getTotalLocalStorageSizeKB(): number {
  if (typeof window === "undefined" || !window.localStorage) return 0;
  let totalBytes = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const val = localStorage.getItem(key) || "";
      totalBytes += new TextEncoder().encode(key).length + new TextEncoder().encode(val).length;
    }
  }
  return Number((totalBytes / 1024).toFixed(3));
}

export function isQuotaExceededError(error: any): boolean {
  return (
    error instanceof DOMException &&
    (error.code === 22 ||
      error.code === 1014 ||
      error.name === "QuotaExceededError" ||
      error.name === "NS_ERROR_DOM_QUOTA_REACHED")
  );
}

function preSetItemDiagnostics(key: string, value: string): void {
  const payloadSizeKB = getPayloadSizeKB(value);
  const totalLocalStorageKB = getTotalLocalStorageSizeKB();
  console.log("[LocalStorage Diagnostic - Before Write]", {
    key,
    payloadSizeKB,
    totalLocalStorageKB,
    timestamp: new Date().toISOString()
  });
}

function postSetItemFailureDiagnostics(key: string, value: string, error: any): void {
  const payloadSizeKB = getPayloadSizeKB(value);
  const totalLocalStorageKB = getTotalLocalStorageSizeKB();
  const errorName = error?.name || "UnknownError";
  const errorMessage = error?.message || String(error);
  const stack = error?.stack || "";
  console.error("[LocalStorage Diagnostic - Write Failed]", {
    key,
    payloadSizeKB,
    totalLocalStorageKB,
    errorName,
    errorMessage,
    stack
  });
}

export function getAssets(): Record<string, UploadedAsset> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ASSETS_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as Record<string, UploadedAsset>;
      } catch (err) {
        if (err instanceof SyntaxError) {
          console.error(`[LocalStorage Corruption] Corrupted JSON detected for key: ${ASSETS_KEY}`, err);
          alert(`Warning: Local storage data for '${ASSETS_KEY}' is corrupted. Falling back to empty state.`);
        }
        throw err;
      }
    }
  } catch (e) {
    console.error("Error reading assets from localStorage:", e);
  }
  return {};
}

export function saveAssets(assets: Record<string, UploadedAsset>): void {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(assets);
  preSetItemDiagnostics(ASSETS_KEY, serialized);
  try {
    localStorage.setItem(ASSETS_KEY, serialized);
  } catch (e) {
    postSetItemFailureDiagnostics(ASSETS_KEY, serialized, e);
    if (isQuotaExceededError(e)) {
      getForensicStorageMetrics().then((metrics) => {
        console.error("QUOTA_EXCEEDED_AT_FAILURE:", JSON.stringify(metrics));
      });
      alert("Local storage limit reached. Please remove some files to save space.");
    }
    throw e; // re-throw to allow test code / simulation to catch
  }
}

const SUPABASE_ASSETS_CACHE_KEY = "uwarl-supabase-assets-cache";

export function getSupabaseAssetsCache(): Record<string, { url: string }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SUPABASE_ASSETS_CACHE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (err) {
        if (err instanceof SyntaxError) {
          console.error(`[LocalStorage Corruption] Corrupted JSON detected for key: ${SUPABASE_ASSETS_CACHE_KEY}`, err);
          alert(`Warning: Local storage data for '${SUPABASE_ASSETS_CACHE_KEY}' is corrupted. Falling back to empty state.`);
        }
        throw err;
      }
    }
  } catch (e) {
    console.error("Error reading Supabase assets cache:", e);
  }
  return {};
}

export function saveSupabaseAssetsCache(cache: Record<string, { url: string }>) {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(cache);
  preSetItemDiagnostics(SUPABASE_ASSETS_CACHE_KEY, serialized);
  try {
    localStorage.setItem(SUPABASE_ASSETS_CACHE_KEY, serialized);
  } catch (e) {
    postSetItemFailureDiagnostics(SUPABASE_ASSETS_CACHE_KEY, serialized, e);
  }
}

export function cleanupOrphanAssets(): void {
  if (typeof window === "undefined") return;
  try {
    const assets = getAssets();
    const assetIds = Object.keys(assets);
    if (assetIds.length === 0) return;

    const referencedIds = new Set<string>();
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("uwarl-") && key !== ASSETS_KEY) {
        const val = localStorage.getItem(key);
        if (val) {
          for (const id of assetIds) {
            if (val.includes(id)) {
              referencedIds.add(id);
            }
          }
        }
      }
    }

    let changed = false;
    for (const id of assetIds) {
      if (!referencedIds.has(id)) {
        delete assets[id];
        changed = true;
      }
    }

    if (changed) {
      const serialized = JSON.stringify(assets);
      preSetItemDiagnostics(ASSETS_KEY, serialized);
      try {
        localStorage.setItem(ASSETS_KEY, serialized);
      } catch (e) {
        postSetItemFailureDiagnostics(ASSETS_KEY, serialized, e);
      }
    }
  } catch (e) {
    console.error("Error cleaning up orphan assets:", e);
  }
}

export const AVATAR_FALLBACK = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><defs><linearGradient id='a1' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%231e293b'/><stop offset='100%' stop-color='%230f172a'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23a1)'/><circle cx='50' cy='35' r='20' fill='%2364748b'/><path d='M20 80 c0-20 15-25 30-25 s30 5 30 25 z' fill='%2364748b'/></svg>";

export const IMAGE_FALLBACK = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><defs><linearGradient id='g5' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%230f172a'/><stop offset='100%' stop-color='%231e293b'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g5)'/><g transform='translate(400, 270)' text-anchor='middle'><circle cx='0' cy='0' r='40' fill='%23ffffff' fill-opacity='0.03' stroke='%23475569' stroke-width='2'/><path d='M-10-10 h20 v20 h-20 z' stroke='%23475569' stroke-width='2' fill='none'/><text x='0' y='70' font-family='Inter, sans-serif' font-size='16' fill='%2364748b'>Asset Preview Unavailable</text></g></svg>";

if (typeof window !== "undefined") {
  // Purge legacy Base64 asset strings from localStorage to prevent quota errors
  setTimeout(() => {
    try {
      const assets = getAssets();
      let changed = false;
      for (const key of Object.keys(assets)) {
        const asset = assets[key];
        if (asset.url && asset.url.startsWith("data:")) {
          asset.url = asset.supabaseUrl || "";
          changed = true;
        }
      }
      if (changed) {
        const serialized = JSON.stringify(assets);
        preSetItemDiagnostics(ASSETS_KEY, serialized);
        try {
          localStorage.setItem(ASSETS_KEY, serialized);
          console.log("Purged legacy base64 data from local asset registry.");
        } catch (e) {
          postSetItemFailureDiagnostics(ASSETS_KEY, serialized, e);
        }
      }
    } catch (e) {
      console.error("Error purging legacy base64 assets:", e);
    }
  }, 100);

  window.addEventListener(
    "error",
    (e) => {
      const target = e.target as HTMLImageElement;
      if (target && target.tagName === "IMG") {
        if (target.src !== AVATAR_FALLBACK && target.src !== IMAGE_FALLBACK) {
          const isAvatar =
            target.className.includes("rounded-full") ||
            (target.alt && (
              target.alt.toLowerCase().includes("profile") ||
              target.alt.toLowerCase().includes("contact") ||
              target.alt.toLowerCase().includes("member") ||
              target.alt.toLowerCase().includes("scholar") ||
              target.alt.toLowerCase().includes("faculty")
            ));
          target.src = isAvatar ? AVATAR_FALLBACK : IMAGE_FALLBACK;
        }
      }
    },
    true
  );
}

// In-memory cache for session-based object URLs (e.g., for large videos/documents before they are synced to Supabase)
const objectUrls = new Map<string, string>();

const pendingAssetQueries = new Set<string>();

export function resolveAssetUrl(idOrUrl: string | null | undefined, type: "avatar" | "image" | "video" | "document" = "image"): string {
  // 1. Check session-based in-memory object URL cache first (great for previewing newly uploaded assets)
  if (idOrUrl && typeof window !== "undefined" && objectUrls.has(idOrUrl)) {
    return objectUrls.get(idOrUrl)!;
  }

  // 2. Resolve actual type from local assets registry if possible
  let resolvedType = type;
  if (idOrUrl && idOrUrl.startsWith("asset_")) {
    const assets = getAssets();
    const localAsset = assets[idOrUrl];
    if (localAsset && localAsset.type) {
      resolvedType = localAsset.type as any;
    }
  }

  const fallback = resolvedType === "avatar" ? AVATAR_FALLBACK : resolvedType === "video" ? "" : IMAGE_FALLBACK;
  if (!idOrUrl) return fallback;
  if (idOrUrl.startsWith("asset_")) {
    // a. Check local registry
    const assets = getAssets();
    const localAsset = assets[idOrUrl];
    if (localAsset) {
      return localAsset.supabaseUrl || localAsset.url || fallback;
    }
    // b. Check Supabase asset registry cache
    const cachedAssets = getSupabaseAssetsCache();
    if (cachedAssets[idOrUrl]) {
      return cachedAssets[idOrUrl].url || fallback;
    }

    // c. Query assets table in the background if not already pending
    if (isBrowser && supabase && !pendingAssetQueries.has(idOrUrl)) {
      pendingAssetQueries.add(idOrUrl);
      (async () => {
        try {
          const { data, error } = await supabase
            .from("assets")
            .select("public_url, metadata")
            .eq("metadata->>id", idOrUrl)
            .maybeSingle();
          if (error) throw error;

          if (data && data.public_url) {
            const publicUrl = data.public_url;

            // Save in cache
            const cache = getSupabaseAssetsCache();
            cache[idOrUrl] = { url: publicUrl };
            saveSupabaseAssetsCache(cache);

            // Save in local assets
            const currentAssets = getAssets();
            currentAssets[idOrUrl] = {
              id: idOrUrl,
              url: publicUrl,
              type: data.metadata && typeof data.metadata === "object" ? (data.metadata as any).asset_type || resolvedType : resolvedType,
              fileName: data.metadata && typeof data.metadata === "object" ? (data.metadata as any).file_name || "" : "",
              uploadedAt: data.metadata && typeof data.metadata === "object" ? (data.metadata as any).uploaded_at || new Date().toISOString() : new Date().toISOString(),
              altText: data.metadata && typeof data.metadata === "object" ? (data.metadata as any).alt_text || "" : "",
              category: data.metadata && typeof data.metadata === "object" ? (data.metadata as any).category || "" : "",
              supabaseUrl: publicUrl
            };
            saveAssets(currentAssets);

            console.log(`Resolved asset URL in background for ${idOrUrl}: ${publicUrl}`);

            // Trigger global store refreshes reactively
            const { notifyAllStoreListeners } = await import("./admin-store");
            notifyAllStoreListeners();
            const { triggerRecordsUpdate } = await import("./repository-data");
            triggerRecordsUpdate();
          }
        } catch (err: any) {
          console.warn(`Background asset resolve failed for ${idOrUrl}:`, err.message || err);
        } finally {
          pendingAssetQueries.delete(idOrUrl);
        }
      })();
    }

    return fallback;
  }
  // d. Check static path or external URL
  return idOrUrl;
}

export function compressImage(file: File, maxWidth = 800, maxHeight = 800, quality = 0.65): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string); // fallback to raw Base64
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        const isPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
        const isWebp = file.type === "image/webp" || file.name.toLowerCase().endsWith(".webp");
        
        if (isPng) {
          resolve(canvas.toDataURL("image/png"));
        } else if (isWebp) {
          resolve(canvas.toDataURL("image/webp", quality));
        } else {
          resolve(canvas.toDataURL("image/jpeg", quality));
        }
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export function readFileAsBase64(file: File, type: "image" | "document" | "video"): Promise<string> {
  return new Promise((resolve, reject) => {
    const limit = type === "video" ? 15 * 1024 * 1024 : 2 * 1024 * 1024;
    const typeLabel = type === "video" ? "Video" : "Document/PDF";
    if (file.size > limit) {
      reject(new Error(`${typeLabel} file size exceeds ${(limit / (1024 * 1024)).toFixed(0)}MB limit. Please upload a smaller file.`));
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      resolve(event.target?.result as string);
    };
    reader.onerror = (err) => reject(err);
  });
}

export async function registerAsset(
  file: File,
  type: "image" | "document" | "video",
  category = "",
  altText = ""
): Promise<string> {
  // Video validations
  if (type === "video") {
    const validTypes = ["video/mp4", "video/webm"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Invalid video format. Only MP4 and WebM videos are accepted.");
    }
    const maxSize = 15 * 1024 * 1024; // 15MB
    if (file.size > maxSize) {
      throw new Error("Video file size exceeds 15MB limit. Please upload a smaller video.");
    }
  }

  const id = `asset_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  let uploadBlob: Blob = file;
  let mimeType = file.type;

  // Compress image if needed, but do not save base64 to localStorage
  if (type === "image") {
    try {
      const compressedBase64 = await compressImage(file);
      const parts = compressedBase64.split(";base64,");
      mimeType = parts[0].split(":")[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      uploadBlob = new Blob([uInt8Array], { type: mimeType });
    } catch (e) {
      console.warn("Image compression failed, using original file", e);
      uploadBlob = file;
      mimeType = file.type;
    }
  }

  // Register session object URL for immediate local preview
  if (typeof window !== "undefined") {
    const objectUrl = URL.createObjectURL(uploadBlob);
    objectUrls.set(id, objectUrl);
  }

  const asset: UploadedAsset = {
    id,
    url: "", // Never store base64 data blobs in localStorage
    type,
    fileName: file.name,
    uploadedAt: new Date().toISOString(),
    altText,
    category
  };

  const assets = getAssets();
  assets[id] = asset;
  saveAssets(assets);

  // Asynchronously upload to Supabase if client is configured
  if (supabase) {
    (async () => {
      try {
        const bucket = type === "image" ? "images" : "documents";
        const fileExt = file.name.split(".").pop() || (type === "image" ? "jpg" : "pdf");
        const filePath = `${id}.${fileExt}`;

        const { error: uploadErr } = await supabase.storage
          .from(bucket)
          .upload(filePath, uploadBlob, {
            contentType: mimeType,
            upsert: true
          });

        if (uploadErr) throw uploadErr;

        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        const publicUrl = publicUrlData.publicUrl;

        const { error: dbErr } = await supabase
          .from("assets")
          .insert({
            asset_type: type,
            bucket_name: bucket,
            file_name: file.name,
            public_url: publicUrl,
            metadata: {
              id,
              uploaded_at: asset.uploadedAt,
              alt_text: altText || "",
              category: category || ""
            }
          });

        if (dbErr) throw dbErr;

        // Store the Supabase URL in local asset registry
        const currentAssets = getAssets();
        if (currentAssets[id]) {
          currentAssets[id].supabaseUrl = publicUrl;
          saveAssets(currentAssets);
        }

        // Cache in Supabase assets cache
        const cache = getSupabaseAssetsCache();
        cache[id] = { url: publicUrl };
        saveSupabaseAssetsCache(cache);

        console.log(`Supabase upload completed for asset ${id}`);
      } catch (err: any) {
        console.warn("Background asset upload to Supabase failed. Running in offline fallback.", err.message || err);
      }
    })();
  }

  return id;
}

// STORAGE CONSTANTS
const RECORDS_KEY = "uwarl-repo-records-v3";
const CAROUSEL_KEY = "uwarl-repo-carousels-v1";
const PAGE_TEXT_KEY = "uwarl-repo-pagetext-v1";

// Default temporary placeholders
const DEFAULT_CAROUSEL_IMAGES: CarouselImage[] = [
  {
    id: "default-1",
    url: "/images/underwater_robot.png",
    duration: 5,
    order: 1,
    caption: "Autonomous Underwater Vehicle (AUV) Testing",
  },
  {
    id: "default-2",
    url: "/images/academic_seminar.png",
    duration: 5,
    order: 2,
    caption: "Marine Signal Processing Seminar",
  },
  {
    id: "default-3",
    url: "/images/laboratory_workspace.png",
    duration: 5,
    order: 3,
    caption: "Underwater Technology Laboratory Workspace",
  },
];

const DEFAULT_AWARD_CAROUSEL_IMAGES: CarouselImage[] = [
  {
    id: "award-default-1",
    url: "/images/faculty_award.png",
    duration: 5,
    order: 1,
    caption:
      "Dr. S. Sakthivel Murugan\nBest Teacher Award\nSSN College of Engineering\n2023–2024",
    category: "faculty",
  },
  {
    id: "award-default-2",
    url: "/images/student_award.png",
    duration: 5,
    order: 2,
    caption: "S. Swathi\nBest Poster Presentation Award\nCSIR New Delhi\n2018",
    category: "student",
  },
];

// Initialize default configuration for all 12 categories
const DEFAULT_CAROUSEL_CONFIG = {
  award: [...DEFAULT_AWARD_CAROUSEL_IMAGES],
  talk: [...DEFAULT_CAROUSEL_IMAGES],
  workshop: [...DEFAULT_CAROUSEL_IMAGES],
  publication: [...DEFAULT_CAROUSEL_IMAGES],
  bos: [...DEFAULT_CAROUSEL_IMAGES],
  dc: [...DEFAULT_CAROUSEL_IMAGES],
  host: [...DEFAULT_CAROUSEL_IMAGES],
  itec: [...DEFAULT_CAROUSEL_IMAGES],
  itp: [...DEFAULT_CAROUSEL_IMAGES],
  pdp: [...DEFAULT_CAROUSEL_IMAGES],
  pg: [...DEFAULT_CAROUSEL_IMAGES],
  coord: [...DEFAULT_CAROUSEL_IMAGES],
} as CarouselConfig;

// Checking for window availability for SSR safety
const isBrowser = typeof window !== "undefined";

// -------------------------------------------------------------
// CORE STORAGE INTERFACES
// -------------------------------------------------------------

export function getRecords(): RepoRecord[] {
  let records: RepoRecord[] = [];
  if (isBrowser) {
    try {
      const raw = localStorage.getItem(RECORDS_KEY);
      if (raw) {
        try {
          records = JSON.parse(raw) as RepoRecord[];
        } catch (err) {
          if (err instanceof SyntaxError) {
            console.error(`[LocalStorage Corruption] Corrupted JSON detected for key: ${RECORDS_KEY}`, err);
            alert(`Warning: Local storage data for '${RECORDS_KEY}' is corrupted. Falling back to spreadsheet defaults.`);
          }
          throw err;
        }
      }
    } catch (e) {
      console.error("Error reading records from localStorage:", e);
    }
  }
  if (!records || records.length === 0) {
    // Fallback to seed records parsed from spreadsheets
    records = (seedData as unknown as RepoRecord[]).map((r) => ({
      ...r,
      attachments: r.attachments ?? [],
      tags: (r.tags ?? []).filter(Boolean),
    }));
  }

  // Awards dynamic defaulting migration check
  return records.map((r) => {
    if (r.type === "award") {
      return {
        ...r,
        awardAudience: r.awardAudience || "faculty",
        awardCategory: r.awardCategory || "Recognition",
        showcasePriority: typeof r.showcasePriority === "number" ? r.showcasePriority : 0,
      };
    }
    return r;
  });
}

export function saveRecords(records: RepoRecord[]): void {
  if (isBrowser) {
    const serialized = JSON.stringify(records);
    preSetItemDiagnostics(RECORDS_KEY, serialized);
    try {
      localStorage.setItem(RECORDS_KEY, serialized);
      cleanupOrphanAssets();

      if (supabase) {
        (async () => {
          try {
            const rows = records.map((r) => ({
              record_key: r.id,
              data: r
            }));
            const { error } = await supabase
              .from("records")
              .upsert(rows, { onConflict: "record_key" });
            if (error) throw error;
          } catch (err: any) {
            console.warn("Background records save to Supabase failed. running in offline fallback.", err.message || err);
          }
        })();
      }
    } catch (e: any) {
      postSetItemFailureDiagnostics(RECORDS_KEY, serialized, e);
      if (isQuotaExceededError(e)) {
        alert(
          "Local storage limit reached. Please delete some records or attachments to free up space.",
        );
      }
    }
  }
}

export function getCarouselConfig(): CarouselConfig {
  if (isBrowser) {
    try {
      const raw = localStorage.getItem(CAROUSEL_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as CarouselConfig;
          // Merge missing categories to prevent undefined errors if categories grow
          const merged = { ...DEFAULT_CAROUSEL_CONFIG };
          for (const type of Object.keys(parsed) as RecordType[]) {
            merged[type] = parsed[type] || [];
          }
          return merged;
        } catch (err) {
          if (err instanceof SyntaxError) {
            console.error(`[LocalStorage Corruption] Corrupted JSON detected for key: ${CAROUSEL_KEY}`, err);
            alert(`Warning: Local storage data for '${CAROUSEL_KEY}' is corrupted. Falling back to default config.`);
          }
          throw err;
        }
      }
    } catch (e) {
      console.error("Error reading carousel config from localStorage:", e);
    }
  }
  return DEFAULT_CAROUSEL_CONFIG;
}

export function saveCarouselConfig(config: CarouselConfig): void {
  if (isBrowser) {
    const serialized = JSON.stringify(config);
    preSetItemDiagnostics(CAROUSEL_KEY, serialized);
    try {
      localStorage.setItem(CAROUSEL_KEY, serialized);
      cleanupOrphanAssets();

      if (supabase) {
        (async () => {
          try {
            const { error } = await supabase
              .from("datasets")
              .upsert({ dataset_key: "repo-carousels", data: config }, { onConflict: "dataset_key" });
            if (error) throw error;
          } catch (err: any) {
            console.warn("Background carousels save to Supabase failed.", err.message || err);
          }
        })();
      }
    } catch (e: any) {
      postSetItemFailureDiagnostics(CAROUSEL_KEY, serialized, e);
      if (isQuotaExceededError(e)) {
        alert(
          "Local storage limit reached. Please reduce the number of images or delete older items to free up space.",
        );
      }
    }
  }
}

export function getPageTexts(): Record<string, PageText> {
  if (isBrowser) {
    try {
      const raw = localStorage.getItem(PAGE_TEXT_KEY);
      if (raw) {
        try {
          return JSON.parse(raw) as Record<string, PageText>;
        } catch (err) {
          if (err instanceof SyntaxError) {
            console.error(`[LocalStorage Corruption] Corrupted JSON detected for key: ${PAGE_TEXT_KEY}`, err);
            alert(`Warning: Local storage data for '${PAGE_TEXT_KEY}' is corrupted. Falling back to empty state.`);
          }
          throw err;
        }
      }
    } catch (e) {
      console.error("Error reading page text overrides from localStorage:", e);
    }
  }
  return {};
}

export function savePageTexts(pageTextMap: Record<string, PageText>): void {
  if (isBrowser) {
    const serialized = JSON.stringify(pageTextMap);
    preSetItemDiagnostics(PAGE_TEXT_KEY, serialized);
    try {
      localStorage.setItem(PAGE_TEXT_KEY, serialized);

      if (supabase) {
        (async () => {
          try {
            const { error } = await supabase
              .from("datasets")
              .upsert({ dataset_key: "repo-pagetext", data: pageTextMap }, { onConflict: "dataset_key" });
            if (error) throw error;
          } catch (err: any) {
            console.warn("Background page texts save to Supabase failed.", err.message || err);
          }
        })();
      }
    } catch (e: any) {
      postSetItemFailureDiagnostics(PAGE_TEXT_KEY, serialized, e);
    }
  }
}

// Startup Console-Only Diagnostics Audit
export function runStartupDiagnostics(): void {
  if (typeof window === "undefined") return;
  try {
    const assets = getAssets();
    const records = getRecords();
    const assetIds = new Set(Object.keys(assets));
    const referencedIds = new Set<string>();
    
    // Gather all serialized local storage values to find references
    let allDataStr = "";
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("uwarl-") && key !== ASSETS_KEY && key !== "uwarl-supabase-assets-cache") {
        allDataStr += localStorage.getItem(key) || "";
      }
    }

    assetIds.forEach(id => {
      if (allDataStr.includes(id)) {
        referencedIds.add(id);
      }
    });

    const orphanCount = Array.from(assetIds).filter(id => !referencedIds.has(id)).length;
    const potentialRefs = allDataStr.match(/asset_[a-zA-Z0-9_]+/g) || [];
    const uniqueRefs = new Set(potentialRefs);
    const staleCount = Array.from(uniqueRefs).filter(ref => !assetIds.has(ref)).length;
    const missingUrlsCount = Array.from(referencedIds).filter(id => {
      const asset = assets[id];
      return !asset || (!asset.url && !asset.supabaseUrl);
    }).length;

    console.log("=== STARTUP LOCALSTORAGE & ASSETS DIAGNOSTICS ===");
    console.log(`- Total Assets Registered: ${assetIds.size}`);
    console.log(`- Total Referenced Assets: ${referencedIds.size}`);
    console.log(`- Orphan Asset Count (unreferenced): ${orphanCount}`);
    console.log(`- Stale Asset Reference Count (referenced but missing from registry): ${staleCount}`);
    console.log(`- Missing Asset Reference URL Count (referenced but blank URL): ${missingUrlsCount}`);
    console.log("==================================================");
  } catch (e) {
    console.error("Error running startup diagnostics:", e);
  }
}

if (typeof window !== "undefined") {
  setTimeout(() => {
    runStartupDiagnostics();
  }, 500);

  // Controlled test framework attached to window
  (window as any).__runQuotaAuditTest = async (testType: "A" | "B" | "C" | "D" | "E") => {
    console.log(`[TEST RUNNER] Running Test ${testType}...`);
    
    if (testType === "A") {
      // Force QuotaExceededError
      try {
        const error = new DOMException("The quota has been exceeded.", "QuotaExceededError");
        throw error;
      } catch (err) {
        console.log("[TEST A] Catching forced QuotaExceededError...");
        if (isQuotaExceededError(err)) {
          alert("Local storage limit reached. Please remove some files to save space.");
        } else {
          console.error("Test A Failed: isQuotaExceededError returned false for QuotaExceededError");
        }
      }
    } 
    else if (testType === "B") {
      // Force TypeError
      try {
        throw new TypeError("Cannot read properties of undefined (reading 'stringify')");
      } catch (err) {
        console.log("[TEST B] Catching forced TypeError...");
        if (isQuotaExceededError(err)) {
          alert("Error: incorrect classification of TypeError as QuotaExceededError!");
        } else {
          console.log("[TEST B SUCCESS] TypeError was correctly ignored (no quota popup).");
        }
      }
    } 
    else if (testType === "C") {
      // Force Supabase sync failure simulation
      console.log("[TEST C] Forcing Supabase sync failure simulation...");
      try {
        const error = new Error("Supabase API connection timeout");
        throw error;
      } catch (err: any) {
        console.warn("Background sync failed (simulated).", err.message);
        if (isQuotaExceededError(err)) {
          alert("Error: incorrect classification of Supabase sync failure as QuotaExceededError!");
        } else {
          console.log("[TEST C SUCCESS] Supabase sync failure was logged but did not trigger quota popup.");
        }
      }
    } 
    else if (testType === "D") {
      // Force JSON corruption
      console.log("[TEST D] Forcing JSON corruption check...");
      const corruptedKey = "uwarl-db-corrupted-test-key";
      localStorage.setItem(corruptedKey, "{invalid-json-here}");
      try {
        const raw = localStorage.getItem(corruptedKey);
        if (raw) {
          try {
            JSON.parse(raw);
          } catch (err) {
            if (err instanceof SyntaxError) {
              console.error(`[LocalStorage Corruption] Corrupted JSON detected for key: ${corruptedKey}`, err);
              alert(`Warning: Local storage data for '${corruptedKey}' is corrupted. Falling back to default.`);
            }
            throw err;
          }
        }
      } catch (err) {
        console.log("[TEST D] Caught parsing error: ", err);
      } finally {
        localStorage.removeItem(corruptedKey);
      }
    } 
    else if (testType === "E") {
      // Force unknown exception
      try {
        throw new Error("Unknown system filesystem failure");
      } catch (err) {
        console.log("[TEST E] Catching forced unknown exception...");
        if (isQuotaExceededError(err)) {
          alert("Error: incorrect classification of unknown exception as QuotaExceededError!");
        } else {
          console.log("[TEST E SUCCESS] Unknown error was logged but did not trigger quota popup.");
        }
      }
    }
  };
}

// ----------------- FORENSIC STORAGE VERIFICATION METRICS -----------------

export interface ForensicMetrics {
  localStorageSize: number;
  sessionStorageSize: number;
  indexedDbSize: number;
  cacheStorageSize: number;
  quota: number;
  usage: number;
  percentageUsed: number;
  indexedDbNames: string[];
  cacheNames: string[];
}

export async function getForensicStorageMetrics(): Promise<ForensicMetrics> {
  if (typeof window === "undefined") {
    return {
      localStorageSize: 0,
      sessionStorageSize: 0,
      indexedDbSize: 0,
      cacheStorageSize: 0,
      quota: 0,
      usage: 0,
      percentageUsed: 0,
      indexedDbNames: [],
      cacheNames: []
    };
  }

  // 1. localStorage size (in KB)
  let lsBytes = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i) || "";
    const v = localStorage.getItem(k) || "";
    lsBytes += (k.length + v.length) * 2; // UTF-16 standard
  }
  const localStorageSize = Number((lsBytes / 1024).toFixed(3));

  // 2. sessionStorage size (in KB)
  let ssBytes = 0;
  for (let i = 0; i < sessionStorage.length; i++) {
    const k = sessionStorage.key(i) || "";
    const v = sessionStorage.getItem(k) || "";
    ssBytes += (k.length + v.length) * 2;
  }
  const sessionStorageSize = Number((ssBytes / 1024).toFixed(3));

  // 3. navigator.storage.estimate
  let quota = 0;
  let usage = 0;
  let percentageUsed = 0;
  if (navigator.storage && navigator.storage.estimate) {
    const est = await navigator.storage.estimate();
    quota = est.quota || 0;
    usage = est.usage || 0;
    percentageUsed = quota ? Number(((usage / quota) * 100).toFixed(4)) : 0;
  }

  // 4. Cache Storage size (in KB)
  let cacheBytes = 0;
  let cacheNames: string[] = [];
  try {
    if (window.caches) {
      cacheNames = await caches.keys();
      for (const name of cacheNames) {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        for (const req of keys) {
          const res = await cache.match(req);
          if (res) {
            try {
              const blob = await res.clone().blob();
              cacheBytes += blob.size;
            } catch (err) {}
          }
        }
      }
    }
  } catch (e) {
    console.error("Cache storage size audit error:", e);
  }
  const cacheStorageSize = Number((cacheBytes / 1024).toFixed(3));

  // 5. IndexedDB size (in KB)
  let idbBytes = 0;
  let indexedDbNames: string[] = [];
  try {
    if (window.indexedDB && indexedDB.databases) {
      const dbs = await indexedDB.databases();
      indexedDbNames = dbs.map(d => d.name || "").filter(Boolean);
      for (const dbInfo of dbs) {
        const dbName = dbInfo.name;
        if (!dbName) continue;
        await new Promise<void>((resolveDb) => {
          const req = indexedDB.open(dbName);
          req.onsuccess = async (e: any) => {
            const db = e.target.result;
            let dbStoreBytes = 0;
            const storeNames = Array.from(db.objectStoreNames) as string[];
            if (storeNames.length > 0) {
              try {
                const transaction = db.transaction(storeNames, 'readonly');
                const promises = storeNames.map((storeName) => {
                  return new Promise<void>((resStore) => {
                    try {
                      const store = transaction.objectStore(storeName);
                      const getReq = store.getAll();
                      getReq.onsuccess = (ev: any) => {
                        const allRecords = ev.target.result;
                        try {
                          const recordStr = JSON.stringify(allRecords);
                          dbStoreBytes += new TextEncoder().encode(recordStr).length;
                        } catch (err) {}
                        resStore();
                      };
                      getReq.onerror = () => resStore();
                    } catch (err) {
                      resStore();
                    }
                  });
                });
                await Promise.all(promises);
              } catch (txErr) {}
            }
            idbBytes += dbStoreBytes;
            db.close();
            resolveDb();
          };
          req.onerror = () => resolveDb();
        });
      }
    }
  } catch (e) {
    console.error("IndexedDB size audit error:", e);
  }
  const indexedDbSize = Number((idbBytes / 1024).toFixed(3));

  return {
    localStorageSize,
    sessionStorageSize,
    indexedDbSize,
    cacheStorageSize,
    quota,
    usage,
    percentageUsed,
    indexedDbNames,
    cacheNames
  };
}

if (typeof window !== "undefined") {
  (window as any).getForensicStorageMetrics = getForensicStorageMetrics;
  
  // Run on startup
  setTimeout(async () => {
    try {
      const metrics = await getForensicStorageMetrics();
      console.log("FORENSIC_METRICS_LOG_BASE:", JSON.stringify(metrics));
      
      const keysInfo = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) || "";
        const v = localStorage.getItem(k) || "";
        const bytes = (k.length + v.length) * 2;
        keysInfo.push({ key: k, sizeKB: Number((bytes / 1024).toFixed(3)) });
      }
      console.log("FORENSIC_LOCALSTORAGE_KEYS:", JSON.stringify(keysInfo));
    } catch (e) {
      console.error("Error logging forensic baseline:", e);
    }
  }, 1000);

  (window as any).__runQuotaExceededSimulation = async () => {
    console.log("[SIMULATION] Starting QuotaExceededError simulation...");
    
    // 1. Record metrics BEFORE simulation
    const beforeMetrics = await getForensicStorageMetrics();
    console.log("SIMULATION_METRICS_BEFORE:", JSON.stringify(beforeMetrics));

    // 2. Fill localStorage to maximum capacity
    const fillerKey = "uwarl-db-quota-filler-temp";
    console.log("[SIMULATION] Filling localStorage...");
    try {
      const chunk = "B".repeat(250 * 1024); // ~500KB in bytes (250K characters, UTF-16 = 500KB)
      let fillStr = "";
      for (let i = 0; i < 30; i++) {
        fillStr += chunk;
        try {
          localStorage.setItem(fillerKey, fillStr);
        } catch (err) {
          if (isQuotaExceededError(err)) {
            console.log(`[SIMULATION] Hit localStorage limit successfully at iteration ${i} with size ~${(fillStr.length * 2 / 1024).toFixed(3)} KB`);
            break;
          }
          throw err;
        }
      }
    } catch (err) {
      console.error("[SIMULATION] Error while filling localStorage:", err);
    }

    // 3. Now try to register a new asset (which will attempt to write to localStorage via saveAssets and fail)
    console.log("[SIMULATION] Simulating image registerAsset write under full storage...");
    let caughtError: any = null;
    try {
      const currentAssets = getAssets();
      currentAssets["asset_simulated_fail"] = {
        id: "asset_simulated_fail",
        url: "",
        type: "image",
        fileName: "simulated_image.jpg",
        uploadedAt: new Date().toISOString(),
        altText: "Simulated fail",
        category: "Simulation"
      };
      saveAssets(currentAssets);
    } catch (err) {
      caughtError = err;
      console.log("[SIMULATION] Caught expected error during saveAssets:", err);
    }

    const failureMetrics = await getForensicStorageMetrics();
    console.log("QUOTA_EXCEEDED_AT_FAILURE:", JSON.stringify(failureMetrics));

    // 4. Cleanup filler key
    localStorage.removeItem(fillerKey);
    console.log("[SIMULATION] Cleaned up filler key. Total size restored.");
    const afterMetrics = await getForensicStorageMetrics();
    console.log("SIMULATION_METRICS_AFTER:", JSON.stringify(afterMetrics));
    
    return {
      before: beforeMetrics,
      failure: failureMetrics,
      after: afterMetrics
    };
  };
}


