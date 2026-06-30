import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateLevel(xp: number): number {
  const xpNeeded = [0, 600, 1500, 3000, 5000];
  let level = 1;
  for (let i = 0; i < xpNeeded.length; i++) {
    if (xp >= xpNeeded[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
}
