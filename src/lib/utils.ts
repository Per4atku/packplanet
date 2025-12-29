import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format file size in bytes to human-readable string (in Russian)
 * @param bytes - File size in bytes
 * @returns Formatted string like "384 КБ" or "1.5 МБ"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Б";

  const k = 1024;
  const sizes = ["Б", "КБ", "МБ", "ГБ"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const value = bytes / Math.pow(k, i);
  const formatted = i === 0 ? value : value.toFixed(0);

  return `${formatted} ${sizes[i]}`;
}
