import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { colorById, topperById } from "@/catalog";
import { useRankedTrees } from "@/store";
import { colors, radii, spacing } from "@/theme";
import type { Tree } from "@/types";

export default function DiscoverScreen() {
  const trees = useRankedTrees();

  return (
    <View style={styles.root}>
      <Text style={styles.lede}>
        Ranked by ornament count. Featured trees ship with the app so Discover works offline.
      </Text>
      <FlatList
        data={trees}
        keyExtractor={(t) => t.id}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <TreeRow tree={item} rank={index + 1} onPress={() => router.push(`/tree/${item.id}`)} />
        )}
      />
    </View>
  );
}

function TreeRow({
  tree,
  rank,
  onPress,
}: {
  tree: Tree;
  rank: number;
  onPress: () => void;
}) {
  const c = colorById(tree.color);
  const topper = topperById(tree.topper);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
      testID={`discover-row-${tree.id}`}
    >
      <Text style={styles.rank}>{rank}</Text>
      <View style={[styles.swatch, { backgroundColor: c.needle }]}>
        <Text style={styles.swatchEmoji}>{topper.emoji}</Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.title} numberOfLines={1}>
          {tree.title}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {tree.ownerName}
          {tree.featured ? " · Featured" : tree.isMine ? " · Yours" : ""}
        </Text>
      </View>
      <Text style={styles.count}>{tree.ornaments.length}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  lede: {
    color: colors.creamMuted,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  list: { padding: spacing.md, gap: spacing.sm, paddingBottom: 40 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.bgCard,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  rank: {
    color: colors.gold,
    fontWeight: "800",
    width: 28,
    fontVariant: ["tabular-nums"],
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  swatchEmoji: { fontSize: 16 },
  meta: { flex: 1 },
  title: { color: colors.cream, fontSize: 16, fontWeight: "700" },
  sub: { color: colors.creamMuted, fontSize: 13, marginTop: 2 },
  count: {
    color: colors.cream,
    fontSize: 18,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
});
