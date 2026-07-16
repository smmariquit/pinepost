import { Pressable, StyleSheet, Text, View, type PressableProps } from "react-native";
import { colors, radii, spacing } from "../theme";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type Props = PressableProps & {
  label: string;
  variant?: Variant;
  block?: boolean;
};

const variantStyle: Record<Variant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.gold, fg: colors.bg },
  secondary: { bg: colors.bgCard, fg: colors.cream, border: colors.border },
  ghost: { bg: "transparent", fg: colors.creamMuted },
  danger: { bg: colors.crimson, fg: colors.cream },
};

export function Button({ label, variant = "primary", block, disabled, style, ...rest }: Props) {
  const v = variantStyle[variant];
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        block && styles.block,
        {
          backgroundColor: v.bg,
          borderColor: v.border ?? "transparent",
          borderWidth: v.border ? 1 : 0,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
        },
        style as object,
      ]}
      {...rest}
    >
      <Text style={[styles.label, { color: v.fg }]}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  emoji,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  emoji?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        selected && styles.chipSelected,
      ]}
    >
      {emoji ? <Text style={styles.chipEmoji}>{emoji}</Text> : null}
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  block: {
    alignSelf: "stretch",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.forest,
    borderColor: colors.gold,
  },
  chipEmoji: {
    fontSize: 14,
  },
  chipLabel: {
    color: colors.creamMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  chipLabelSelected: {
    color: colors.cream,
  },
  section: {
    marginBottom: spacing.sm,
  },
  sectionText: {
    color: colors.creamMuted,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
});
