import type {
  OrnamentKind,
  OrnamentStyle,
  Topper,
  TopperId,
  TreeColor,
  TreeColorId,
} from "./types";

export const TREE_COLORS: TreeColor[] = [
  {
    id: "emerald",
    label: "Emerald",
    needle: "#2E8B57",
    needleDark: "#14532D",
    needleLight: "#4ADE80",
  },
  {
    id: "frost",
    label: "Frost",
    needle: "#4A7C6F",
    needleDark: "#1F3D36",
    needleLight: "#A7F3D0",
  },
  {
    id: "midnight",
    label: "Midnight",
    needle: "#1E3A5F",
    needleDark: "#0F1C2E",
    needleLight: "#60A5FA",
  },
  {
    id: "crimson",
    label: "Crimson fir",
    needle: "#7A2E2E",
    needleDark: "#3F1414",
    needleLight: "#F87171",
  },
  {
    id: "gold",
    label: "Gilded",
    needle: "#8A6B2F",
    needleDark: "#4A3814",
    needleLight: "#FBBF24",
  },
];

export const TOPPERS: Topper[] = [
  { id: "star", label: "Star", emoji: "★" },
  { id: "angel", label: "Angel", emoji: "👼" },
  { id: "bow", label: "Bow", emoji: "🎀" },
  { id: "snowflake", label: "Snowflake", emoji: "❄" },
  { id: "moon", label: "Moon", emoji: "☾" },
];

export const ORNAMENTS: OrnamentStyle[] = [
  { kind: "bauble-red", label: "Red bauble", emoji: "🔴", accent: "#C23B3B" },
  { kind: "bauble-gold", label: "Gold bauble", emoji: "🟡", accent: "#E8C547" },
  { kind: "bauble-blue", label: "Blue bauble", emoji: "🔵", accent: "#3B82F6" },
  { kind: "candy", label: "Candy cane", emoji: "🍬", accent: "#F8FAFC" },
  { kind: "heart", label: "Heart", emoji: "❤", accent: "#E85A5A" },
  { kind: "bell", label: "Bell", emoji: "🔔", accent: "#FBBF24" },
  { kind: "gift", label: "Gift", emoji: "🎁", accent: "#C23B3B" },
  { kind: "snowflake", label: "Snowflake", emoji: "❄", accent: "#EEF6F2" },
  { kind: "cookie", label: "Cookie", emoji: "🍪", accent: "#D4A574" },
  { kind: "lantern", label: "Lantern", emoji: "🏮", accent: "#F59E0B" },
];

export function colorById(id: TreeColorId): TreeColor {
  return TREE_COLORS.find((c) => c.id === id) ?? TREE_COLORS[0];
}

export function topperById(id: TopperId): Topper {
  return TOPPERS.find((t) => t.id === id) ?? TOPPERS[0];
}

export function ornamentByKind(kind: OrnamentKind): OrnamentStyle {
  return ORNAMENTS.find((o) => o.kind === kind) ?? ORNAMENTS[0];
}
