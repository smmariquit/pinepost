import { router, Stack, useLocalSearchParams } from "expo-router";
import { Share, StyleSheet, Text, View, useWindowDimensions, ScrollView } from "react-native";
import { Button } from "@/components/Button";
import { Countdown } from "@/components/Countdown";
import { Snow } from "@/components/Snow";
import { TreeCanvas } from "@/components/TreeCanvas";
import { isUnlocked } from "@/christmas";
import { encodeInvite } from "@/invite";
import { useAppState, useCountdownTick, useTree } from "@/store";
import { colors, spacing } from "@/theme";
import type { Ornament } from "@/types";

export default function TreeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tree = useTree(id);
  const state = useAppState();
  const now = useCountdownTick();
  const unlocked = isUnlocked(now, state.demoUnlock);
  const { width } = useWindowDimensions();
  const treeWidth = Math.min(340, width - 32);

  if (!tree) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Tree not found.</Text>
        <Button label="Go home" onPress={() => router.replace("/")} />
      </View>
    );
  }

  function openOrnament(o: Ornament) {
    router.push(`/ornament/${tree!.id}/${o.id}`);
  }

  async function share() {
    const code = encodeInvite(tree!);
    await Share.share({
      message: `Decorate "${tree!.title}" on Pinepost:\n\n${code}`,
    });
  }

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ title: tree.title }} />
      <Snow height={700} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <Text style={styles.meta}>
          {tree.ownerName} · {tree.ornaments.length} ornaments
          {tree.featured ? " · Featured" : ""}
        </Text>
        <Countdown now={now} unlocked={unlocked} />
        <TreeCanvas
          tree={tree}
          width={treeWidth}
          height={treeWidth * 1.3}
          locked={!unlocked}
          onOrnamentPress={openOrnament}
        />
        <View style={styles.actions}>
          <Button
            label="Hang an ornament"
            block
            onPress={() => router.push(`/decorate/${tree.id}`)}
            testID="tree-decorate"
          />
          <Button label="Share invite" variant="secondary" block onPress={share} />
          {!tree.isMine ? (
            <Button label="Back to my tree" variant="ghost" block onPress={() => router.replace("/")} />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: 40,
  },
  meta: { color: colors.creamMuted, fontSize: 15, textAlign: "center" },
  actions: { gap: spacing.sm },
  missing: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: colors.bg,
  },
  missingText: { color: colors.cream, fontSize: 16 },
});
