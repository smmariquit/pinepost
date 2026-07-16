import { Link, Redirect, router } from "expo-router";
import { Pressable, ScrollView, Share, Text, View, useWindowDimensions } from "react-native";
import { Button } from "@/components/Button";
import { Countdown } from "@/components/Countdown";
import { Snow } from "@/components/Snow";
import { TreeCanvas } from "@/components/TreeCanvas";
import { isUnlocked } from "@/christmas";
import { encodeInvite } from "@/invite";
import { useAppState, useCountdownTick, useMyTree } from "@/store";
import { colors, spacing } from "@/theme";
import type { Ornament } from "@/types";

export default function HomeScreen() {
  const myTree = useMyTree();
  const state = useAppState();
  const { width } = useWindowDimensions();
  const now = useCountdownTick();
  const unlocked = isUnlocked(now, state.demoUnlock);

  if (!myTree) {
    return <Redirect href="/create" />;
  }

  const tree = myTree;
  const treeWidth = Math.min(340, width - 32);

  async function shareTree() {
    const code = encodeInvite(tree);
    await Share.share({
      message: `Decorate my Pinepost tree "${tree.title}" and leave a Christmas message.\n\nInvite code:\n${code}\n\nOpen Pinepost → Join a tree → paste the code.`,
    });
  }

  function openOrnament(o: Ornament) {
    router.push(`/ornament/${tree.id}/${o.id}`);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }} testID="home-screen">
      <Snow height={720} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.xxl,
          gap: spacing.md,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: spacing.sm,
          }}
        >
          <Text
            style={{
              color: colors.gold,
              fontSize: 15,
              fontWeight: "800",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Pinepost
          </Text>
          <Link href="/settings" asChild>
            <Pressable hitSlop={12}>
              <Text style={{ color: colors.creamMuted, fontSize: 14, fontWeight: "600" }}>Settings</Text>
            </Pressable>
          </Link>
        </View>

        <Text
          style={{
            color: colors.cream,
            fontSize: 32,
            fontWeight: "800",
            letterSpacing: -0.5,
          }}
        >
          {tree.title}
        </Text>
        <Text style={{ color: colors.creamMuted, fontSize: 15, marginTop: -8 }}>
          {tree.ownerName} · {tree.ornaments.length} ornament
          {tree.ornaments.length === 1 ? "" : "s"}
        </Text>

        <Countdown now={now} unlocked={unlocked} />

        <TreeCanvas
          tree={tree}
          width={treeWidth}
          height={treeWidth * 1.3}
          locked={!unlocked}
          onOrnamentPress={openOrnament}
        />

        <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
          <Button label="Share invite" block onPress={shareTree} testID="share-invite" />
          <Link href={`/decorate/${tree.id}`} asChild>
            <Button label="Decorate my tree" variant="secondary" block />
          </Link>
          <View style={{ flexDirection: "row", gap: spacing.sm }}>
            <Link href="/discover" asChild>
              <Button label="Discover" variant="ghost" style={{ flex: 1 }} />
            </Link>
            <Link href="/join" asChild>
              <Button label="Join tree" variant="ghost" style={{ flex: 1 }} />
            </Link>
          </View>
        </View>

        <Text
          style={{
            color: colors.lock,
            fontSize: 13,
            lineHeight: 19,
            textAlign: "center",
            marginTop: spacing.sm,
            paddingHorizontal: spacing.md,
          }}
        >
          Messages stay sealed until Christmas Day. Friends hang ornaments on your fir; you hang some
          on theirs.
        </Text>
      </ScrollView>
    </View>
  );
}
