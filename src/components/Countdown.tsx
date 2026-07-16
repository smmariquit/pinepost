import { StyleSheet, Text, View } from "react-native";
import { countdownParts } from "../christmas";
import { colors, radii, spacing } from "../theme";

export function Countdown({ now, unlocked }: { now: Date; unlocked: boolean }) {
  if (unlocked) {
    return (
      <View style={styles.wrap} testID="countdown-unlocked">
        <Text style={styles.headline}>Messages are open</Text>
        <Text style={styles.sub}>Christmas Day. Tap any ornament to read.</Text>
      </View>
    );
  }

  const p = countdownParts(now);
  return (
    <View style={styles.wrap} testID="countdown">
      <Text style={styles.eyebrow}>Opens Christmas Day</Text>
      <View style={styles.row}>
        <Unit value={p.days} label="days" />
        <Unit value={p.hours} label="hrs" />
        <Unit value={p.minutes} label="min" />
        <Unit value={p.seconds} label="sec" />
      </View>
    </View>
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.unit}>
      <Text style={styles.value}>{String(value).padStart(2, "0")}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.bgCard,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headline: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: "800",
  },
  sub: {
    color: colors.creamMuted,
    fontSize: 14,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  unit: {
    minWidth: 58,
    alignItems: "center",
    backgroundColor: colors.bgElevated,
    borderRadius: radii.md,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  value: {
    color: colors.cream,
    fontSize: 22,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  label: {
    color: colors.creamMuted,
    fontSize: 11,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
