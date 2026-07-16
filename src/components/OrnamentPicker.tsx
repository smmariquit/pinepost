import { ScrollView, StyleSheet, View } from "react-native";
import { ORNAMENTS } from "../catalog";
import type { OrnamentKind } from "../types";
import { Chip, SectionLabel } from "./Button";

export function OrnamentPicker({
  value,
  onChange,
}: {
  value: OrnamentKind;
  onChange: (k: OrnamentKind) => void;
}) {
  return (
    <View>
      <SectionLabel>Ornament</SectionLabel>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {ORNAMENTS.map((o) => (
          <Chip
            key={o.kind}
            label={o.label}
            emoji={o.emoji}
            selected={value === o.kind}
            onPress={() => onChange(o.kind)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingVertical: 4,
  },
});
