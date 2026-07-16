import type { Ornament, Tree } from "./types";

function oid(prefix: string, n: number): string {
  return `${prefix}-o${n}`;
}

function place(i: number, total: number): { x: number; y: number } {
  // Scatter ornaments in a triangular canopy band
  const row = Math.floor(i / 3);
  const col = i % 3;
  const y = 0.18 + (row / Math.max(1, Math.ceil(total / 3))) * 0.62;
  const spread = 0.18 + y * 0.55;
  const x = 0.5 + (col - 1) * spread * 0.55 + ((i % 2) * 0.04 - 0.02);
  return { x: Math.min(0.88, Math.max(0.12, x)), y: Math.min(0.88, Math.max(0.12, y)) };
}

function makeOrnaments(
  prefix: string,
  entries: Array<{
    kind: Ornament["kind"];
    fromName: string;
    message: string;
    private?: boolean;
  }>,
): Ornament[] {
  return entries.map((e, i) => {
    const { x, y } = place(i, entries.length);
    return {
      id: oid(prefix, i + 1),
      kind: e.kind,
      fromName: e.fromName,
      message: e.message,
      private: e.private ?? false,
      x,
      y,
      createdAt: new Date(2025, 11, 1 + i).toISOString(),
    };
  });
}

/** Seeded “famous” trees for Discover. Offline, no network. */
export const FEATURED_TREES: Tree[] = [
  {
    id: "feat-north-star",
    ownerName: "North Star Desk",
    title: "Letters to the Pole",
    color: "frost",
    topper: "star",
    isMine: false,
    featured: true,
    createdAt: "2025-11-20T00:00:00.000Z",
    ornaments: makeOrnaments("feat-north-star", [
      {
        kind: "bauble-gold",
        fromName: "Anya",
        message: "May your cocoa stay hot and your socks stay mismatched in the best way.",
      },
      {
        kind: "cookie",
        fromName: "Theo",
        message: "Saved you the corner piece. Don't tell the elves.",
        private: true,
      },
      {
        kind: "bell",
        fromName: "Mira",
        message: "Ring once for joy, twice for rest, thrice for one more cookie.",
      },
      {
        kind: "snowflake",
        fromName: "Jules",
        message: "Your quiet kindness is the loudest light on this tree.",
      },
    ]),
  },
  {
    id: "feat-city-lights",
    ownerName: "City Library",
    title: "Stacks & Sparkle",
    color: "midnight",
    topper: "moon",
    isMine: false,
    featured: true,
    createdAt: "2025-11-22T00:00:00.000Z",
    ornaments: makeOrnaments("feat-city-lights", [
      {
        kind: "lantern",
        fromName: "Reader #42",
        message: "Thanks for the warm corner by the window. Best chapter of my year.",
      },
      {
        kind: "bauble-blue",
        fromName: "Sam",
        message: "Returned late, forgiven early. Happy holidays.",
      },
      {
        kind: "gift",
        fromName: "Pat",
        message: "A book is a tree that grew stories. This one grew friends.",
        private: true,
      },
    ]),
  },
  {
    id: "feat-bakery",
    ownerName: "Oven & Needle",
    title: "Cinnamon Rush",
    color: "gold",
    topper: "bow",
    isMine: false,
    featured: true,
    createdAt: "2025-11-25T00:00:00.000Z",
    ornaments: makeOrnaments("feat-bakery", [
      {
        kind: "cookie",
        fromName: "Regular",
        message: "Your gingerbread rebuilt my Tuesday.",
      },
      {
        kind: "candy",
        fromName: "Lee",
        message: "Save me a candy cane. I'll tip in carols.",
      },
      {
        kind: "heart",
        fromName: "Nia",
        message: "The shop smells like home. That's the gift.",
        private: true,
      },
      {
        kind: "bauble-red",
        fromName: "Omar",
        message: "Flour on your apron = festive couture.",
      },
      {
        kind: "bell",
        fromName: "Kit",
        message: "May every oven timer be perfectly on time.",
      },
    ]),
  },
  {
    id: "feat-studio",
    ownerName: "Night Shift Radio",
    title: "After-Midnight Tree",
    color: "crimson",
    topper: "angel",
    isMine: false,
    featured: true,
    createdAt: "2025-11-28T00:00:00.000Z",
    ornaments: makeOrnaments("feat-studio", [
      {
        kind: "bauble-red",
        fromName: "Caller",
        message: "Your 2am playlist got me through finals.",
      },
      {
        kind: "snowflake",
        fromName: "DJ Sparrow",
        message: "Dedicated to everyone still awake with hope.",
        private: true,
      },
      {
        kind: "lantern",
        fromName: "Night nurse",
        message: "Thanks for the soft songs on hard shifts.",
      },
    ]),
  },
];
