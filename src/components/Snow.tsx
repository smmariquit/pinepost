import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View, type ViewStyle } from "react-native";
import { colors } from "../theme";

type Flake = { id: number; left: number; size: number; duration: number; delay: number; drift: number };

const FLAKES: Flake[] = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: (i * 37) % 100,
  size: 2 + (i % 4),
  duration: 7000 + (i % 7) * 900,
  delay: (i % 9) * 400,
  drift: ((i % 5) - 2) * 18,
}));

function Snowflake({ flake, height }: { flake: Flake; height: number }) {
  const y = useRef(new Animated.Value(-20)).current;
  const x = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fall = Animated.loop(
      Animated.sequence([
        Animated.delay(flake.delay),
        Animated.timing(y, {
          toValue: height + 40,
          duration: flake.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(y, { toValue: -20, duration: 0, useNativeDriver: true }),
      ]),
    );
    const drift = Animated.loop(
      Animated.sequence([
        Animated.timing(x, {
          toValue: flake.drift,
          duration: flake.duration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(x, {
          toValue: 0,
          duration: flake.duration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    fall.start();
    drift.start();
    return () => {
      fall.stop();
      drift.stop();
    };
  }, [flake, height, x, y]);

  return (
    <Animated.View
      style={[
        styles.flake,
        {
          left: `${flake.left}%`,
          width: flake.size,
          height: flake.size,
          borderRadius: flake.size,
          opacity: 0.35 + (flake.id % 5) * 0.1,
          transform: [{ translateY: y }, { translateX: x }],
        },
      ]}
    />
  );
}

export function Snow({ height = 640, style }: { height?: number; style?: ViewStyle }) {
  return (
    <View pointerEvents="none" style={[styles.wrap, { height }, style]}>
      {FLAKES.map((f) => (
        <Snowflake key={f.id} flake={f} height={height} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
  },
  flake: {
    position: "absolute",
    top: 0,
    backgroundColor: colors.snow,
  },
});
