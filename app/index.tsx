import { Link, Redirect, router } from "expo-router";
import { Pressable, ScrollView, Share, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../src/components/Button";
import { Countdown } from "../src/components/Countdown";
import { Snow } from "../src/components/Snow";
import { TreeCanvas } from "../src/components/TreeCanvas";
import { isUnlocked } from "../src/christmas";
import { encodeInvite } from "../src/invite";
import { useAppState, useCountdownTick, useMyTree } from "../src/store";
import { colors, spacing } from "../src/theme";
import type { Ornament } from "../src/types";

export default function HomeScreen() {
  const myTree = useMyTree();
  const state = useAppState();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const now = useCountdownTick();
  const unlocked = isUnlocked(now, state.demoUnlock);

  if (!myTree) {
    return <Redirect href="/create" />;
  }

  const treeWidth = Math.min(340, width - 32);

  async function shareTree() {
    const code = encodeInvite(myTree!);
    await Share.share({
      message: `Decorate my Pinepost tree "${myTree!.title}" and leave a Christmas message.\n\nInvite code:\n${code}\n\nOpen Pinepost → Join a tree → paste the code.`,
    });
  }

  function openOrnament(o: Ornament) {
    router.push(`/ornament/${myTree!.id}/${o.id}`);
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="home-screen">
      <Snow height={720} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 28 }]}>
        <View style={styles.brandRow}>
          <Text style={styles.brand}>Pinepost</Text>
          <Pressable onPress={() => router.push("/settings")} hitSlop={12}>
            <Text style={styles.settingsLink}>Settings</Text>
          </Pressable>
        </View>
        <Text style={styles.title}>{myTree.title}</Text>
        <Text style={styles.meta}>
          {myTree.ownerName} · {myTree.ornaments.length} ornament
          {myTree.ornaments.length === 1 ? "" : "s"}
        </Text>

        <View style={styles.countdownWrap}>
          <Countdown now={now} unlocked={unlocked} />
        </View>

        <TreeCanvas
          tree={myTree}
          width={treeWidth}
          height={treeWidth * 1.3}
          locked={!unlocked}
          onOrnamentPress={openOrnament}
        />

        <View style={styles.actions}>
          <Button label="Share invite" block onPress={shareTree} testID="share-invite" />
          <Button
            label="Decorate my tree"
            variant="secondary"
            block
            onPress={() => router.push(`/decorate/${myTree.id}`)}
          />
          <View style={styles.row}>
            <Button
              label="Discover"
              variant="ghost"
              onPress={() => router.push("/discover")}
              style={styles.half}
            />
            <Button
              label="Join tree"
              variant="ghost"
              onPress={() => router.push("/join")}
              style={styles.half}
            />
          </View>
        </View>

        <Link href="/discover" asChild>
          <Pressable>
            <Text style={styles.footerHint}>
              Messages stay sealed until Christmas Day. Friends hang ornaments on your fir; you hang
              some on theirs.
            </Text>
          </Pressable>
        </Link>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  brand: {
    color: colors.gold,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  settingsLink: {
    color: colors.creamMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    color: colors.cream,
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  meta: {
    color: colors.creamMuted,
    fontSize: 15,
    marginTop: -8,
  },
  countdownWrap: {
    marginTop: spacing.sm,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  half: {
    flex: 1,
  },
  footerHint: {
    color: colors.lock,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
});
