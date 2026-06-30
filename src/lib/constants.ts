import { AuthorityContact } from "./types";

export const CATEGORY_EMOJIS: Record<string, string> = {
  POTHOLE: "🕳️",
  GARBAGE: "🗑️",
  ROAD_DAMAGE: "🚧",
  DRAINAGE: "🌊",
  WATER_LEAK: "💧",
  STREETLIGHT: "💡",
  TRAFFIC_SIGNAL: "🚥",
  OTHER: "⚠️",
};

export const STATUS_COLORS: Record<string, string> = {
  FRESH: "bg-red-500",
  WIP: "bg-yellow-400",
  SOLVED: "bg-emerald-500",
};

export const AUTHORITY_CONTACTS: AuthorityContact[] = [
  { id: "c1", dept: "BBMP", name: "BBMP Control Room", phone: "1533", email: "contactusbbmp@gmail.com" },
  { id: "c2", dept: "BWSSB", name: "BWSSB Helpline", phone: "1916", email: "callcenter@bwssb.gov.in" },
  { id: "c3", dept: "BESCOM", name: "BESCOM Helpline", phone: "1912", email: "helplinebescom@gmail.com" },
  { id: "c4", dept: "BTP", name: "Traffic Police", phone: "112", email: "btp.bcp@karnataka.gov.in" },
  { id: "c5", dept: "FIRE", name: "Fire Department", phone: "101", email: "fire@karnataka.gov.in" },
  { id: "c6", dept: "POLICE", name: "City Police", phone: "100", email: "police@karnataka.gov.in" },
];

export const BADGES = [
  "First Report",
  "Pothole Slayer",
  "Neighborhood Watch",
  "Verified Reporter",
  "Civic Hero",
  "City Guardian",
];

export const AVATARS = ["🦖", "🐯", "🔥", "🐘", "🦚", "🦁"];

export const DEFAULT_CENTER: [number, number] = [12.9719, 77.6412];

export const LEVELS = [
  { level: 1, xpNeeded: 0, title: "Rookie" },
  { level: 2, xpNeeded: 600, title: "Scout" },
  { level: 3, xpNeeded: 1500, title: "Watcher" },
  { level: 4, xpNeeded: 3000, title: "Guardian" },
  { level: 5, xpNeeded: 5000, title: "Hero" },
];
