import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Ellipse, G, Path, Polygon, Rect } from "react-native-svg";
import { colorById, ornamentByKind, topperById } from "../catalog";
import { colors } from "../theme";
import type { Ornament, TopperId, Tree, TreeColorId } from "../types";

type Props = {
  tree: Tree;
  width?: number;
  height?: number;
  onOrnamentPress?: (ornament: Ornament) => void;
  highlightId?: string | null;
  showLocks?: boolean;
  locked?: boolean;
};

const CANOPY = { x: 0.12, y: 0.12, w: 0.76, h: 0.68 };

export function TreeCanvas({
  tree,
  width = 320,
  height = 420,
  onOrnamentPress,
  highlightId,
  showLocks = true,
  locked = true,
}: Props) {
  const c = colorById(tree.color);
  const topper = topperById(tree.topper);

  return (
    <View style={[styles.wrap, { width, height }]} testID="tree-canvas">
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* soft ground glow */}
        <Ellipse
          cx={width * 0.5}
          cy={height * 0.92}
          rx={width * 0.32}
          ry={height * 0.045}
          fill={c.needleDark}
          opacity={0.55}
        />

        {/* trunk */}
        <Rect
          x={width * 0.46}
          y={height * 0.72}
          width={width * 0.08}
          height={height * 0.18}
          rx={4}
          fill={colors.trunk}
        />
        <Rect
          x={width * 0.48}
          y={height * 0.72}
          width={width * 0.025}
          height={height * 0.18}
          fill={colors.trunkDark}
          opacity={0.45}
        />

        {/* layered fir */}
        <FirLayer
          width={width}
          height={height}
          top={0.48}
          spread={0.42}
          fill={c.needleDark}
        />
        <FirLayer
          width={width}
          height={height}
          top={0.34}
          spread={0.34}
          fill={c.needle}
        />
        <FirLayer
          width={width}
          height={height}
          top={0.22}
          spread={0.24}
          fill={c.needleLight}
          opacity={0.92}
        />

        {/* garland hint */}
        <Path
          d={`M ${width * 0.28} ${height * 0.42} Q ${width * 0.5} ${height * 0.5} ${width * 0.72} ${height * 0.4}`}
          stroke={colors.gold}
          strokeWidth={2}
          fill="none"
          opacity={0.35}
        />
        <Path
          d={`M ${width * 0.24} ${height * 0.58} Q ${width * 0.5} ${height * 0.66} ${width * 0.76} ${height * 0.56}`}
          stroke={colors.crimsonSoft}
          strokeWidth={2}
          fill="none"
          opacity={0.3}
        />

        <TopperMark
          id={tree.topper}
          cx={width * 0.5}
          cy={height * 0.14}
          size={width * 0.08}
          label={topper.emoji}
        />
      </Svg>

      {/* ornaments as pressable overlays in canopy space */}
      {tree.ornaments.map((o) => {
        const style = ornamentByKind(o.kind);
        const left = (CANOPY.x + o.x * CANOPY.w) * width - 18;
        const top = (CANOPY.y + o.y * CANOPY.h) * height - 18;
        const lit = highlightId === o.id;
        return (
          <Pressable
            key={o.id}
            testID={`ornament-${o.id}`}
            onPress={() => onOrnamentPress?.(o)}
            style={[
              styles.ornament,
              {
                left,
                top,
                borderColor: lit ? colors.gold : "transparent",
                backgroundColor: lit ? "rgba(232,197,71,0.2)" : "rgba(11,31,23,0.35)",
              },
            ]}
          >
            <Text style={styles.ornamentEmoji}>{style.emoji}</Text>
            {showLocks && locked ? (
              <View style={styles.lockDot}>
                <Text style={styles.lockText}>🔒</Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

function FirLayer({
  width,
  height,
  top,
  spread,
  fill,
  opacity = 1,
}: {
  width: number;
  height: number;
  top: number;
  spread: number;
  fill: string;
  opacity?: number;
}) {
  const cx = width * 0.5;
  const ty = height * top;
  const by = height * (top + 0.28);
  const half = width * spread;
  const d = `M ${cx} ${ty} L ${cx + half} ${by} L ${cx - half} ${by} Z`;
  return <Path d={d} fill={fill} opacity={opacity} />;
}

function TopperMark({
  id,
  cx,
  cy,
  size,
  label,
}: {
  id: TopperId;
  cx: number;
  cy: number;
  size: number;
  label: string;
}) {
  if (id === "star") {
    const r = size;
    const points = starPoints(cx, cy, 5, r, r * 0.45);
    return <Polygon points={points} fill={colors.star} />;
  }
  if (id === "moon") {
    return (
      <G>
        <Circle cx={cx} cy={cy} r={size * 0.7} fill={colors.cream} />
        <Circle cx={cx + size * 0.28} cy={cy - size * 0.1} r={size * 0.55} fill={colors.bg} />
      </G>
    );
  }
  if (id === "snowflake") {
    return (
      <G stroke={colors.snow} strokeWidth={2} strokeLinecap="round">
        <Path d={`M ${cx} ${cy - size} L ${cx} ${cy + size}`} />
        <Path d={`M ${cx - size} ${cy} L ${cx + size} ${cy}`} />
        <Path d={`M ${cx - size * 0.7} ${cy - size * 0.7} L ${cx + size * 0.7} ${cy + size * 0.7}`} />
        <Path d={`M ${cx + size * 0.7} ${cy - size * 0.7} L ${cx - size * 0.7} ${cy + size * 0.7}`} />
      </G>
    );
  }
  // angel / bow: text glyph via overlay would be cleaner; draw a small circle badge
  return (
    <G>
      <Circle cx={cx} cy={cy} r={size * 0.75} fill={colors.gold} />
      <Circle cx={cx} cy={cy} r={size * 0.45} fill={colors.bg} opacity={0.25} />
    </G>
  );
}

function starPoints(cx: number, cy: number, spikes: number, outer: number, inner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / spikes) * i - Math.PI / 2;
    pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
  }
  return pts.join(" ");
}

/** Preview swatch for create flow */
export function TreeSwatch({ color, topper, size = 72 }: { color: TreeColorId; topper: TopperId; size?: number }) {
  const fake: Tree = {
    id: "swatch",
    ownerName: "",
    title: "",
    color,
    topper,
    ornaments: [],
    createdAt: "",
    isMine: true,
  };
  return <TreeCanvas tree={fake} width={size} height={size * 1.25} showLocks={false} />;
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    alignSelf: "center",
  },
  ornament: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  ornamentEmoji: {
    fontSize: 18,
  },
  lockDot: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  lockText: {
    fontSize: 9,
  },
});
