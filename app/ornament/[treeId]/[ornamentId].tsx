import { router, Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../../../src/components/Button";
import { ornamentByKind } from "../../../src/catalog";
import { countdownParts, isUnlocked } from "../../../src/christmas";
import { useAppState, useCountdownTick, useTree } from "../../../src/store";
import { colors, radii, spacing } from "../../../src/theme";

export default function OrnamentScreen() {
  const { treeId, ornamentId } = useLocalSearchParams<{
    treeId: string;
    ornamentId: string;
  }>();
  const tree = useTree(treeId);
  const state = useAppState();
  const now = useCountdownTick();
  const unlocked = isUnlocked(now, state.demoUnlock);
  const ornament = tree?.ornaments.find((o) => o.id === ornamentId);
  const style = ornament ? ornamentByKind(ornament.kind) : null;

  if (!tree || !ornament || !style) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Ornament not found.</Text>
        <Button label="Back" onPress={() => router.back()} />
      </View>
    );
  }

  // Sealed for everyone (including the owner) until Christmas / demo unlock.
  const canRead = unlocked;

  const parts = countdownParts(now);

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ title: style.label }} />
      <View style={styles.card}>
        <Text style={styles.emoji}>{style.emoji}</Text>
        <Text style={styles.from}>From {ornament.fromName}</Text>
        {ornament.private ? <Text style={styles.privateTag}>Private</Text> : null}

        {canRead ? (
          <Text style={styles.message} testID="ornament-message">
            {ornament.message}
          </Text>
        ) : (
          <View style={styles.sealed} testID="ornament-sealed">
            <Text style={styles.sealedTitle}>Sealed until Christmas</Text>
            <Text style={styles.sealedBody}>
              {parts.done
                ? "Almost there."
                : `${parts.days}d ${parts.hours}h ${parts.minutes}m left. The note is waiting on the branch.`}
            </Text>
            <Text style={styles.sealedHint}>
              Turn on Demo unlock in Settings if you want to peek during development.
            </Text>
          </View>
        )}
      </View>
      <Button label="Back to tree" variant="secondary" block onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
  },
  emoji: { fontSize: 48 },
  from: { color: colors.cream, fontSize: 20, fontWeight: "800" },
  privateTag: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  message: {
    color: colors.cream,
    fontSize: 18,
    lineHeight: 28,
    textAlign: "center",
    marginTop: spacing.md,
  },
  sealed: {
    marginTop: spacing.md,
    alignItems: "center",
    gap: 8,
  },
  sealedTitle: { color: colors.gold, fontSize: 18, fontWeight: "800" },
  sealedBody: {
    color: colors.creamMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  sealedHint: {
    color: colors.lock,
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  missing: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: colors.bg,
  },
  missingText: { color: colors.cream, fontSize: 16 },
});
