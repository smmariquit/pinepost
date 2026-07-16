import { router } from "expo-router";
import { Alert, StyleSheet, Switch, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { holidayYear, unlockDate } from "@/christmas";
import { resetAll, setDemoUnlock, useAppState } from "@/store";
import { colors, radii, spacing } from "@/theme";

export default function SettingsScreen() {
  const state = useAppState();
  const unlock = unlockDate();

  function confirmReset() {
    Alert.alert(
      "Reset Pinepost?",
      "Deletes your tree and imported invites. Featured trees come back.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetAll();
            router.replace("/create");
          },
        },
      ],
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Christmas unlock</Text>
        <Text style={styles.cardBody}>
          Messages open at local midnight on {unlock.toDateString()} (holiday year {holidayYear()}).
        </Text>
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>Demo unlock</Text>
          <Text style={styles.rowSub}>
            Read sealed messages early. For screenshots and development only.
          </Text>
        </View>
        <Switch
          testID="demo-unlock"
          value={state.demoUnlock}
          onValueChange={setDemoUnlock}
          trackColor={{ false: colors.border, true: colors.forest }}
          thumbColor={state.demoUnlock ? colors.gold : colors.creamMuted}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Privacy</Text>
        <Text style={styles.cardBody}>
          Trees and messages live on this device. Invite codes carry a snapshot of the tree you
          share. Pinepost does not collect Wi‑Fi BSSIDs, SSID lists, or phone identifiers for
          "location accuracy."
        </Text>
      </View>

      {state.profileName ? (
        <Text style={styles.profile}>Signed in as {state.profileName} (local only)</Text>
      ) : null}

      <Button label="Reset all data" variant="danger" block onPress={confirmReset} />
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
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 8,
  },
  cardTitle: { color: colors.gold, fontSize: 14, fontWeight: "800", letterSpacing: 0.5 },
  cardBody: { color: colors.creamMuted, fontSize: 14, lineHeight: 21 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.bgCard,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  rowTitle: { color: colors.cream, fontSize: 16, fontWeight: "700" },
  rowSub: { color: colors.creamMuted, fontSize: 13, marginTop: 4, lineHeight: 18 },
  profile: { color: colors.lock, fontSize: 13, textAlign: "center" },
});
