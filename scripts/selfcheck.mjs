#!/usr/bin/env node
/**
 * Smallest check that fails if invite codec or Christmas unlock math breaks.
 * Run: node scripts/selfcheck.mjs
 */
import { createRequire } from "node:module";
import assert from "node:assert/strict";

// Compile-free: duplicate the pure helpers inline so we don't need ts-node.
// Keep in sync with src/christmas.ts and src/invite.ts.

function holidayYear(now) {
  if (now.getMonth() === 11 && now.getDate() > 25) return now.getFullYear() + 1;
  if (now.getMonth() === 11) return now.getFullYear();
  return now.getFullYear();
}

function unlockDate(now) {
  return new Date(holidayYear(now), 11, 25, 0, 0, 0, 0);
}

function isUnlocked(now, demoUnlock = false) {
  if (demoUnlock) return true;
  return now.getTime() >= unlockDate(now).getTime();
}

assert.equal(isUnlocked(new Date(2026, 11, 25), false), true);
assert.equal(isUnlocked(new Date(2026, 11, 24, 23, 59), false), false);
assert.equal(isUnlocked(new Date(2026, 6, 1), true), true);
assert.equal(holidayYear(new Date(2026, 11, 26)), 2027);
assert.equal(holidayYear(new Date(2026, 11, 25)), 2026);

function toBase64Url(bytes) {
  const b64 = Buffer.from(bytes, "utf8").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromBase64Url(s) {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64").toString("utf8");
}

const tree = {
  id: "tree-abc",
  ownerName: "Alex",
  title: "Alex's tree",
  color: "emerald",
  topper: "star",
  ornaments: [
    {
      id: "o1",
      kind: "heart",
      fromName: "Sam",
      message: "Warm socks forever",
      private: true,
      x: 0.4,
      y: 0.5,
      createdAt: "2026-12-01T00:00:00.000Z",
    },
  ],
  createdAt: "2026-11-01T00:00:00.000Z",
};

const code = `PINE1.${toBase64Url(JSON.stringify({ v: 1, tree }))}`;
const parsed = JSON.parse(fromBase64Url(code.slice("PINE1.".length)));
assert.equal(parsed.v, 1);
assert.equal(parsed.tree.id, "tree-abc");
assert.equal(parsed.tree.ornaments[0].message, "Warm socks forever");

console.log("selfcheck ok");
