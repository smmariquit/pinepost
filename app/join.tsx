import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "../src/components/Button";
import { decodeInvite } from "../src/invite";
import { upsertTree } from "../src/store";
import { colors, radii, spacing } from "../src/theme";

export default function JoinScreen() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function join(raw: string) {
    const tree = decodeInvite(raw);
    if (!tree) {
      setError("Could not read that invite. Paste a full PINE1… code.");
      return;
    }
    setError(null);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    upsertTree({ ...tree, isMine: false });
    router.replace(`/tree/${tree.id}`);
  }

  async function paste() {
    const text = await Clipboard.getStringAsync();
    if (text) {
      setCode(text.trim());
      join(text);
    }
  }

  return (
    <View style={styles.root}>
      <Text style={styles.lede}>
        Pinepost shares trees as offline invite codes. No account server, no Wi‑Fi fingerprinting.
        Paste a friend's code to hang an ornament on their fir.
      </Text>

      <TextInput
        testID="join-code"
        value={code}
        onChangeText={(t) => {
          setCode(t);
          setError(null);
        }}
        placeholder="PINE1...."
        placeholderTextColor={colors.lock}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        multiline
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button label="Paste from clipboard" variant="secondary" block onPress={paste} />
      <Button
        label="Open tree"
        block
        disabled={!code.trim()}
        onPress={() => join(code)}
        testID="join-submit"
        style={{ marginTop: spacing.sm }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  lede: {
    color: colors.creamMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  input: {
    minHeight: 120,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 16,
    color: colors.cream,
    fontSize: 13,
    fontFamily: "monospace",
    textAlignVertical: "top",
  },
  error: { color: colors.crimsonSoft, fontSize: 14 },
});
