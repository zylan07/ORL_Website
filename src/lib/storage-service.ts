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
  showcaseCategory?: "faculty" | "student";
  showcasePriority?: number;
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
  type: "image" | "document";
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

export function getAssets(): Record<string, UploadedAsset> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ASSETS_KEY);
    if (raw) return JSON.parse(raw) as Record<string, UploadedAsset>;
  } catch (e) {
    console.error("Error reading assets from localStorage:", e);
  }
  return {};
}

export function saveAssets(assets: Record<string, UploadedAsset>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
  } catch (e) {
    console.error("Error saving assets to localStorage:", e);
    alert("Local storage limit reached. Please remove some files to save space.");
  }
}

const SUPABASE_ASSETS_CACHE_KEY = "uwarl-supabase-assets-cache";

export function getSupabaseAssetsCache(): Record<string, { url: string }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SUPABASE_ASSETS_CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading Supabase assets cache:", e);
  }
  return {};
}

export function saveSupabaseAssetsCache(cache: Record<string, { url: string }>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SUPABASE_ASSETS_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error("Error saving Supabase assets cache:", e);
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
      localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
    }
  } catch (e) {
    console.error("Error cleaning up orphan assets:", e);
  }
}

export const AVATAR_FALLBACK = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><defs><linearGradient id='a1' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%231e293b'/><stop offset='100%' stop-color='%230f172a'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23a1)'/><circle cx='50' cy='35' r='20' fill='%2364748b'/><path d='M20 80 c0-20 15-25 30-25 s30 5 30 25 z' fill='%2364748b'/></svg>";

export const IMAGE_FALLBACK = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><defs><linearGradient id='g5' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%230f172a'/><stop offset='100%' stop-color='%231e293b'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g5)'/><g transform='translate(400, 270)' text-anchor='middle'><circle cx='0' cy='0' r='40' fill='%23ffffff' fill-opacity='0.03' stroke='%23475569' stroke-width='2'/><path d='M-10-10 h20 v20 h-20 z' stroke='%23475569' stroke-width='2' fill='none'/><text x='0' y='70' font-family='Inter, sans-serif' font-size='16' fill='%2364748b'>Asset Preview Unavailable</text></g></svg>";

if (typeof window !== "undefined") {
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

const pendingAssetQueries = new Set<string>();

export function resolveAssetUrl(idOrUrl: string | null | undefined, type: "avatar" | "image" = "image"): string {
  const fallback = type === "avatar" ? AVATAR_FALLBACK : IMAGE_FALLBACK;
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
              type: data.metadata && typeof data.metadata === "object" ? (data.metadata as any).asset_type || type : type,
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
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export function readPdfAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > 2 * 1024 * 1024) {
      reject(new Error("PDF file size exceeds 2MB limit. Please upload a smaller PDF."));
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
  type: "image" | "document",
  category = "",
  altText = ""
): Promise<string> {
  const id = `asset_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  let url = "";
  if (type === "image") {
    url = await compressImage(file);
  } else {
    url = await readPdfAsBase64(file);
  }

  const asset: UploadedAsset = {
    id,
    url,
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

        // Convert base64 back to Blob
        const parts = url.split(";base64,");
        const mimeType = parts[0].split(":")[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        const blob = new Blob([uInt8Array], { type: mimeType });

        const { error: uploadErr } = await supabase.storage
          .from(bucket)
          .upload(filePath, blob, {
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

        // Store the Supabase URL in local asset registry, but KEEP local Base64 intact for safety (Correction 2)
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
  if (isBrowser) {
    try {
      const raw = localStorage.getItem(RECORDS_KEY);
      if (raw) return JSON.parse(raw) as RepoRecord[];
    } catch (e) {
      console.error("Error reading records from localStorage:", e);
    }
  }
  // Fallback to seed records parsed from spreadsheets
  return (seedData as unknown as RepoRecord[]).map((r) => ({
    ...r,
    attachments: r.attachments ?? [],
    tags: (r.tags ?? []).filter(Boolean),
  }));
}

export function saveRecords(records: RepoRecord[]): void {
  if (isBrowser) {
    try {
      localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
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
    } catch (e) {
      console.error("Error saving records to localStorage:", e);
      alert(
        "Local storage limit reached. Please delete some records or attachments to free up space.",
      );
    }
  }
}

export function getCarouselConfig(): CarouselConfig {
  if (isBrowser) {
    try {
      const raw = localStorage.getItem(CAROUSEL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CarouselConfig;
        // Merge missing categories to prevent undefined errors if categories grow
        const merged = { ...DEFAULT_CAROUSEL_CONFIG };
        for (const type of Object.keys(parsed) as RecordType[]) {
          merged[type] = parsed[type] || [];
        }
        return merged;
      }
    } catch (e) {
      console.error("Error reading carousel config from localStorage:", e);
    }
  }
  return DEFAULT_CAROUSEL_CONFIG;
}

export function saveCarouselConfig(config: CarouselConfig): void {
  if (isBrowser) {
    try {
      localStorage.setItem(CAROUSEL_KEY, JSON.stringify(config));
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
    } catch (e) {
      console.error("Error saving carousel config to localStorage:", e);
      alert(
        "Local storage limit reached. Please reduce the number of images or delete older items to free up space.",
      );
    }
  }
}

export function getPageTexts(): Record<string, PageText> {
  if (isBrowser) {
    try {
      const raw = localStorage.getItem(PAGE_TEXT_KEY);
      if (raw) return JSON.parse(raw) as Record<string, PageText>;
    } catch (e) {
      console.error("Error reading page text overrides from localStorage:", e);
    }
  }
  return {};
}

export function savePageTexts(pageTextMap: Record<string, PageText>): void {
  if (isBrowser) {
    try {
      localStorage.setItem(PAGE_TEXT_KEY, JSON.stringify(pageTextMap));

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
    } catch (e) {
      console.error("Error saving page text overrides to localStorage:", e);
    }
  }
}
