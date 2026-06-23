import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDateSafe(dateStr: string | null | undefined): Date {
  if (!dateStr) return new Date(0);
  
  const str = String(dateStr).trim().toLowerCase();
  if (!str || str === "n/a" || str === "null" || str === "undefined") {
    return new Date(0);
  }

  // 1. Standard ISO Match (YYYY-MM-DD)
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
  }

  // 2. YYYY-MM
  const yyyyMmMatch = str.match(/^(\d{4})-(\d{2})$/);
  if (yyyyMmMatch) {
    return new Date(parseInt(yyyyMmMatch[1]), parseInt(yyyyMmMatch[2]) - 1, 1);
  }

  // 3. DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    return new Date(parseInt(dmyMatch[3]), parseInt(dmyMatch[2]) - 1, parseInt(dmyMatch[1]));
  }

  // 4. YYYY only
  const yearMatch = str.match(/^(\d{4})$/);
  if (yearMatch) {
    return new Date(parseInt(yearMatch[1]), 0, 1);
  }

  // Split range structures like "15/12/2025 to 13/01/2026" or "15/12/2025 - 13/01/2026"
  const rangeParts = str.split(/\s+to\s+|\s*-\s*/);
  if (rangeParts.length > 1) {
    const firstPartDate = parseDateSafe(rangeParts[0]);
    if (firstPartDate.getTime() !== 0) {
      return firstPartDate;
    }
  }

  // Generic extraction: Year first
  const yearMatchGen = str.match(/\b(19|20)\d{2}\b/);
  const year = yearMatchGen ? parseInt(yearMatchGen[0]) : 1970;

  const months = [
    "jan", "feb", "mar", "apr", "may", "jun", 
    "jul", "aug", "sep", "oct", "nov", "dec"
  ];
  
  let month = 0;
  for (let i = 0; i < months.length; i++) {
    if (str.includes(months[i])) {
      month = i;
      break;
    }
  }

  let day = 1;
  const dayMatch = str.replace(year.toString(), "").match(/\b([1-9]|[12]\d|3[01])\b/);
  if (dayMatch) {
    day = parseInt(dayMatch[0]);
  }

  return new Date(year, month, day);
}

export function isValidImage(url: string | null | undefined): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (
    trimmed === "" ||
    trimmed === "null" ||
    trimmed === "undefined" ||
    trimmed === "—" ||
    trimmed === "#"
  ) {
    return false;
  }
  
  const lower = trimmed.toLowerCase();
  if (
    lower.includes("placeholder") ||
    lower.includes("preview unavailable") ||
    lower.includes("avatar_fallback") ||
    lower.includes("fallback") ||
    lower.startsWith("<svg") ||
    lower.startsWith("data:image/svg+xml")
  ) {
    return false;
  }
  return true;
}

export function hasContent(val: any): boolean {
  if (val === null || val === undefined) return false;
  if (typeof val === "string") {
    const trimmed = val.trim();
    return trimmed !== "" && trimmed !== "null" && trimmed !== "undefined" && trimmed !== "—";
  }
  if (Array.isArray(val)) return val.length > 0;
  return true;
}


