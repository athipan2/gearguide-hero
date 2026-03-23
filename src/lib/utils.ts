import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parses a price string (e.g., "฿8,500") into a number.
 * Removes currency symbols and commas.
 */
export const parseThaiPrice = (priceStr: string | null | undefined): number => {
  if (!priceStr) return 0;
  const match = priceStr.replace(/,/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};
