import seedData from "@/data/records.json";

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

export function resolveAssetUrl(idOrUrl: string | null | undefined): string {
  if (!idOrUrl) return "";
  if (idOrUrl.startsWith("asset_")) {
    const assets = getAssets();
    return assets[idOrUrl]?.url || "";
  }
  return idOrUrl;
}

export function compressImage(file: File, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> {
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
    } catch (e) {
      console.error("Error saving page text overrides to localStorage:", e);
    }
  }
}
