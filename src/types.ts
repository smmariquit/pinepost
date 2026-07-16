export type TreeColorId =
  | "emerald"
  | "frost"
  | "midnight"
  | "crimson"
  | "gold";

export type TopperId = "star" | "angel" | "bow" | "snowflake" | "moon";

export type OrnamentKind =
  | "bauble-red"
  | "bauble-gold"
  | "bauble-blue"
  | "candy"
  | "heart"
  | "bell"
  | "gift"
  | "snowflake"
  | "cookie"
  | "lantern";

export type TreeColor = {
  id: TreeColorId;
  label: string;
  needle: string;
  needleDark: string;
  needleLight: string;
};

export type Topper = {
  id: TopperId;
  label: string;
  emoji: string;
};

export type OrnamentStyle = {
  kind: OrnamentKind;
  label: string;
  emoji: string;
  accent: string;
};

export type Ornament = {
  id: string;
  kind: OrnamentKind;
  fromName: string;
  message: string;
  private: boolean;
  x: number; // 0..1 relative on canopy
  y: number; // 0..1 relative on canopy
  createdAt: string; // ISO
};

export type Tree = {
  id: string;
  ownerName: string;
  title: string;
  color: TreeColorId;
  topper: TopperId;
  ornaments: Ornament[];
  createdAt: string;
  isMine: boolean;
  featured?: boolean;
};

export type AppState = {
  profileName: string;
  myTreeId: string | null;
  trees: Record<string, Tree>;
  demoUnlock: boolean;
};
