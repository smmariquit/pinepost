import type { Tree } from "./types";

/** Compact invite payload: base64url JSON of a tree (no isMine flag). */
export type InvitePayload = {
  v: 1;
  tree: Omit<Tree, "isMine">;
};

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): string {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function encodeInvite(tree: Tree): string {
  const payload: InvitePayload = {
    v: 1,
    tree: {
      id: tree.id,
      ownerName: tree.ownerName,
      title: tree.title,
      color: tree.color,
      topper: tree.topper,
      ornaments: tree.ornaments,
      createdAt: tree.createdAt,
      featured: tree.featured,
    },
  };
  return `PINE1.${toBase64Url(JSON.stringify(payload))}`;
}

export function decodeInvite(raw: string): Tree | null {
  const trimmed = raw.trim();
  let code = trimmed;
  if (trimmed.startsWith("pinepost://join/")) {
    code = decodeURIComponent(trimmed.slice("pinepost://join/".length));
  } else if (trimmed.includes("PINE1.")) {
    code = trimmed.slice(trimmed.indexOf("PINE1."));
  }
  // Strip wrapping whitespace / accidental newlines inside pasted shares
  code = code.replace(/\s+/g, "");
  if (!code.startsWith("PINE1.")) return null;
  try {
    const json = fromBase64Url(code.slice("PINE1.".length));
    const payload = JSON.parse(json) as InvitePayload;
    if (payload.v !== 1 || !payload.tree?.id) return null;
    return { ...payload.tree, isMine: false };
  } catch {
    return null;
  }
}

export function shortCode(treeId: string): string {
  return treeId.slice(0, 8).toUpperCase();
}
