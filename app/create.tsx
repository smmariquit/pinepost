import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Button, Chip, SectionLabel } from "../src/components/Button";
import { TreeSwatch } from "../src/components/TreeCanvas";
import { TOPPERS, TREE_COLORS } from "../src/catalog";
import { createMyTree, useAppState } from "../src/store";
import { colors, radii, spacing } from "../src/theme";
import type { TopperId, TreeColorId } from "../src/types";
import * as Haptics from "expo-haptics";

export default function CreateScreen() {
  const state = useAppState();
  const [name, setName] = useState(state.profileName || "");
  const [title, setTitle] = useState("");
  const [color, setColor] = useState<TreeColorId>("emerald");
  const [topper, setTopper] = useState<TopperId>("star");

  function submit() {
    if (!name.trim()) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    createMyTree({
      ownerName: name,
      title: title || `${name.trim()}'s tree`,
      color,
      topper,
    });
    router.replace("/");
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.lede}>
          Grow a fir, share the invite, collect sealed notes until Christmas Day.
        </Text>

        <View style={styles.preview}>
          <TreeSwatch color={color} topper={topper} size={120} />
        </View>

        <SectionLabel>Your name</SectionLabel>
        <TextInput
          testID="create-name"
          value={name}
          onChangeText={setName}
          placeholder="Alex"
          placeholderTextColor={colors.lock}
          style={styles.input}
          autoCapitalize="words"
        />

        <SectionLabel>Tree title</SectionLabel>
        <TextInput
          testID="create-title"
          value={title}
          onChangeText={setTitle}
          placeholder="Optional. Defaults to your name."
          placeholderTextColor={colors.lock}
          style={styles.input}
        />

        <SectionLabel>Needle color</SectionLabel>
        <View style={styles.chips}>
          {TREE_COLORS.map((c) => (
            <Chip
              key={c.id}
              label={c.label}
              selected={color === c.id}
              onPress={() => setColor(c.id)}
            />
          ))}
        </View>

        <SectionLabel>Topper</SectionLabel>
        <View style={styles.chips}>
          {TOPPERS.map((t) => (
            <Chip
              key={t.id}
              label={t.label}
              emoji={t.emoji}
              selected={topper === t.id}
              onPress={() => setTopper(t.id)}
            />
          ))}
        </View>

        <Button
          label="Plant tree"
          block
          onPress={submit}
          disabled={!name.trim()}
          testID="create-submit"
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
    paddingBottom: 48,
  },
  lede: {
    color: colors.creamMuted,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  preview: {
    alignItems: "center",
    marginVertical: spacing.md,
  },
  input: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.cream,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: spacing.md,
  },
});
