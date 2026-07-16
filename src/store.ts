import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { FEATURED_TREES } from "./seed";
import type { AppState, Ornament, OrnamentKind, TopperId, Tree, TreeColorId } from "./types";

const KEY = "pinepost/v1";

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function emptyState(): AppState {
  const trees: Record<string, Tree> = {};
  for (const t of FEATURED_TREES) trees[t.id] = t;
  return {
    profileName: "",
    myTreeId: null,
    trees,
    demoUnlock: false,
  };
}

type Store = {
  state: AppState;
  ready: boolean;
  version: number;
  listeners: Set<() => void>;
};

const store: Store = {
  state: emptyState(),
  ready: false,
  version: 0,
  listeners: new Set(),
};

function emit() {
  store.version += 1;
  for (const l of store.listeners) l();
}

function subscribe(cb: () => void) {
  store.listeners.add(cb);
  return () => store.listeners.delete(cb);
}

function getVersion() {
  return store.version;
}

async function persist() {
  const { demoUnlock: _, ...rest } = store.state;
  // Keep demoUnlock in memory only? Actually persist it for QA convenience.
  await AsyncStorage.setItem(KEY, JSON.stringify(store.state));
}

export async function loadStore(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      // Re-merge featured trees so discover stays fresh if we update seeds
      const trees = { ...parsed.trees };
      for (const t of FEATURED_TREES) {
        if (!trees[t.id] || trees[t.id].featured) trees[t.id] = t;
      }
      store.state = {
        profileName: parsed.profileName ?? "",
        myTreeId: parsed.myTreeId ?? null,
        trees,
        demoUnlock: parsed.demoUnlock ?? false,
      };
    }
  } catch {
    store.state = emptyState();
  }
  store.ready = true;
  emit();
}

function setState(next: AppState) {
  store.state = next;
  emit();
  void persist();
}

export function useAppReady(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => store.ready,
    () => store.ready,
  );
}

export function useAppState(): AppState {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  return store.state;
}

export function useMyTree(): Tree | null {
  const s = useAppState();
  if (!s.myTreeId) return null;
  return s.trees[s.myTreeId] ?? null;
}

export function useTree(id: string | undefined): Tree | null {
  const s = useAppState();
  if (!id) return null;
  return s.trees[id] ?? null;
}

export function setProfileName(name: string) {
  setState({ ...store.state, profileName: name.trim() });
}

export function setDemoUnlock(on: boolean) {
  setState({ ...store.state, demoUnlock: on });
}

export function createMyTree(input: {
  ownerName: string;
  title: string;
  color: TreeColorId;
  topper: TopperId;
}): Tree {
  const id = uid("tree");
  const tree: Tree = {
    id,
    ownerName: input.ownerName.trim() || "Friend",
    title: input.title.trim() || `${input.ownerName.trim() || "My"}'s tree`,
    color: input.color,
    topper: input.topper,
    ornaments: [],
    createdAt: new Date().toISOString(),
    isMine: true,
  };
  setState({
    ...store.state,
    profileName: tree.ownerName,
    myTreeId: id,
    trees: { ...store.state.trees, [id]: tree },
  });
  return tree;
}

export function upsertTree(tree: Tree) {
  setState({
    ...store.state,
    trees: { ...store.state.trees, [tree.id]: tree },
  });
}

export function addOrnament(
  treeId: string,
  input: {
    kind: OrnamentKind;
    fromName: string;
    message: string;
    private: boolean;
    x: number;
    y: number;
  },
): Ornament | null {
  const tree = store.state.trees[treeId];
  if (!tree) return null;
  const ornament: Ornament = {
    id: uid("orn"),
    kind: input.kind,
    fromName: input.fromName.trim() || "Anonymous",
    message: input.message.trim(),
    private: input.private,
    x: input.x,
    y: input.y,
    createdAt: new Date().toISOString(),
  };
  const next: Tree = {
    ...tree,
    ornaments: [...tree.ornaments, ornament],
  };
  setState({
    ...store.state,
    trees: { ...store.state.trees, [treeId]: next },
  });
  return ornament;
}

export function randomCanopyPoint(existing: Ornament[]): { x: number; y: number } {
  // Avoid overlapping previous ornaments too hard
  for (let attempt = 0; attempt < 24; attempt++) {
    const y = 0.16 + Math.random() * 0.68;
    const spread = 0.16 + y * 0.58;
    const x = 0.5 + (Math.random() * 2 - 1) * spread * 0.5;
    const ok = existing.every((o) => {
      const dx = o.x - x;
      const dy = o.y - y;
      return dx * dx + dy * dy > 0.012;
    });
    if (ok) return { x: Math.min(0.9, Math.max(0.1, x)), y };
  }
  return { x: 0.5, y: 0.45 };
}

export function useCountdownTick(ms = 1000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}

export function rankedTrees(state: AppState): Tree[] {
  return Object.values(state.trees)
    .slice()
    .sort((a, b) => b.ornaments.length - a.ornaments.length || a.title.localeCompare(b.title));
}

export function useRankedTrees(): Tree[] {
  const s = useAppState();
  return useMemo(() => rankedTrees(s), [s]);
}

export function resetAll() {
  setState(emptyState());
}

/** Hook helpers for screens that need stable callbacks */
export function useStoreActions() {
  return useCallback(() => store.state, []);
}
