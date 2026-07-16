import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { loadStore, useAppReady } from "../src/store";
import { colors } from "../src/theme";

export default function RootLayout() {
  const ready = useAppReady();

  useEffect(() => {
    void loadStore();
  }, []);

  if (!ready) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.gold} size="large" />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.cream,
          headerTitleStyle: { fontWeight: "700" },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: "fade_from_bottom",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="create" options={{ title: "Grow your tree" }} />
        <Stack.Screen name="tree/[id]" options={{ title: "Tree" }} />
        <Stack.Screen name="decorate/[id]" options={{ title: "Hang an ornament" }} />
        <Stack.Screen name="ornament/[treeId]/[ornamentId]" options={{ title: "Message" }} />
        <Stack.Screen name="discover" options={{ title: "Top trees" }} />
        <Stack.Screen name="join" options={{ title: "Join a tree" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  boot: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
});
