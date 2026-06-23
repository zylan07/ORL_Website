import { isValidImage } from "./utils";

export function normalizeImages(record: any): string[] {
  if (!record) return [];

  const rawList: any[] = [];

  // Gather potential images in prioritized order
  if (Array.isArray(record.images)) {
    rawList.push(...record.images);
  }
  if (record.imageUrl) {
    rawList.push(record.imageUrl);
  }
  if (record.thumbnail) {
    rawList.push(record.thumbnail);
  }
  if (record.image) {
    rawList.push(record.image);
  }

  // Filter, clean, and deduplicate
  const cleanedList: string[] = [];
  for (const item of rawList) {
    if (item === null || item === undefined) continue;
    const trimmed = String(item).trim();
    if (
      trimmed === "" ||
      trimmed === "null" ||
      trimmed === "undefined" ||
      trimmed === "#" ||
      trimmed === "—"
    ) {
      continue;
    }
    if (!isValidImage(trimmed)) {
      continue;
    }
    if (!cleanedList.includes(trimmed)) {
      cleanedList.push(trimmed);
    }
  }

  return cleanedList;
}
