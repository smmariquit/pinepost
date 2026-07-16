import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { Button } from "../../src/components/Button";
import { OrnamentPicker } from "../../src/components/OrnamentPicker";
import { TreeCanvas } from "../../src/components/TreeCanvas";
import { addOrnament, randomCanopyPoint, useAppState, useTree } from "../../src/store";
import { colors, radii, spacing } from "../../src/theme";
import type { OrnamentKind } from "../../src/types";

export default function DecorateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tree = useTree(id);
  const state = useAppState();
  const [kind, setKind] = useState<OrnamentKind>("bauble-red");
  const [fromName, setFromName] = useState(state.profileName || "");
  const [message, setMessage] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [previewPoint, setPreviewPoint] = useState(() =>
    tree ? randomCanopyPoint(tree.ornaments) : { x: 0.5, y: 0.4 },
  );

  const previewTree = useMemo(() => {
    if (!tree) return null;
    return {
      ...tree,
      ornaments: [
        ...tree.ornaments,
        {
          id: "preview",
          kind,
          fromName: fromName || "You",
          message,
          private: isPrivate,
          x: previewPoint.x,
          y: previewPoint.y,
          createdAt: new Date().toISOString(),
        },
      ],
    };
  }, [tree, kind, fromName, message, isPrivate, previewPoint]);

  if (!tree || !previewTree) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Tree not found.</Text>
        <Button label="Go home" onPress={() => router.replace("/")} />
      </View>
    );
  }

  function reshuffle() {
    setPreviewPoint(randomCanopyPoint(tree!.ornaments));
  }

  function submit() {
    if (!message.trim()) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addOrnament(tree!.id, {
      kind,
      fromName,
      message,
      private: isPrivate,
      x: previewPoint.x,
      y: previewPoint.y,
    });
    router.replace(`/tree/${tree!.id}`);
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.lede}>
          Hang something on {tree.ownerName}'s tree. The note stays sealed until Christmas.
        </Text>

        <Pressable onPress={reshuffle}>
          <TreeCanvas tree={previewTree} width={280} height={360} showLocks={false} highlightId="preview" />
          <Text style={styles.tapHint}>Tap the tree to move the ornament</Text>
        </Pressable>

        <OrnamentPicker value={kind} onChange={setKind} />

        <Text style={styles.label}>From</Text>
        <TextInput
          testID="decorate-from"
          value={fromName}
          onChangeText={setFromName}
          placeholder="Your name"
          placeholderTextColor={colors.lock}
          style={styles.input}
        />

        <Text style={styles.label}>Message</Text>
        <TextInput
          testID="decorate-message"
          value={message}
          onChangeText={setMessage}
          placeholder="Something warm, short, and true."
          placeholderTextColor={colors.lock}
          style={[styles.input, styles.area]}
          multiline
          maxLength={280}
        />
        <Text style={styles.counter}>{message.length}/280</Text>

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchTitle}>Private message</Text>
            <Text style={styles.switchSub}>Only the tree owner sees the text after unlock.</Text>
          </View>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
            trackColor={{ false: colors.border, true: colors.forest }}
            thumbColor={isPrivate ? colors.gold : colors.creamMuted}
          />
        </View>

        <Button
          label="Hang ornament"
          block
          disabled={!message.trim()}
          onPress={submit}
          testID="decorate-submit"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, gap: spacing.sm, paddingBottom: 48 },
  lede: { color: colors.creamMuted, fontSize: 15, lineHeight: 22, marginBottom: 8 },
  tapHint: {
    color: colors.lock,
    fontSize: 12,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  label: {
    color: colors.creamMuted,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: spacing.sm,
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
  },
  area: { minHeight: 110, textAlignVertical: "top" },
  counter: { color: colors.lock, fontSize: 12, alignSelf: "flex-end" },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.bgCard,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.sm,
  },
  switchTitle: { color: colors.cream, fontSize: 15, fontWeight: "700" },
  switchSub: { color: colors.creamMuted, fontSize: 13, marginTop: 2 },
  missing: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: colors.bg,
  },
  missingText: { color: colors.cream, fontSize: 16 },
});
