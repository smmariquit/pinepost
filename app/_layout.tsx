import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { loadStore, useAppReady } from "@/store";
import { colors } from "@/theme";

export default function RootLayout() {
  const ready = useAppReady();

  useEffect(() => {
    void loadStore();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.gold} size="large" />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
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
        <Stack.Screen name="index" options={{ title: "Pinepost", headerShown: false }} />
        <Stack.Screen name="create" options={{ title: "Grow your tree" }} />
        <Stack.Screen name="tree/[id]" options={{ title: "Tree" }} />
        <Stack.Screen name="decorate/[id]" options={{ title: "Hang an ornament" }} />
        <Stack.Screen name="ornament/[treeId]/[ornamentId]" options={{ title: "Message" }} />
        <Stack.Screen name="discover" options={{ title: "Top trees" }} />
        <Stack.Screen name="join" options={{ title: "Join a tree" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
