import MaskedView from "@react-native-masked-view/masked-view";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { NativeShimmerStyle, ShimmerTextProps } from "./types";
import { useShimmer } from "./useShimmer";

const DEFAULT_DURATION = 3;

/** Builds the New Architecture CSS keyframe animation for the gradient layer. */
function buildAnimation(
  duration: number,
  direction: "ltr" | "rtl",
): NativeShimmerStyle {
  const fromX = direction === "ltr" ? "-25%" : "25%";
  const toX = direction === "ltr" ? "25%" : "-25%";
  return {
    animationName: {
      from: { transform: [{ translateX: fromX }] },
      to: { transform: [{ translateX: toX }] },
    },
    animationDuration: `${duration}s`,
    animationIterationCount: "infinite",
    animationTimingFunction: "linear",
  };
}

function ShimmerTextComponent(props: ShimmerTextProps) {
  const {
    children,
    style,
    shimmerStyle,
    containerStyle,
    duration = DEFAULT_DURATION,
    direction = "ltr",
    testID,
  } = props;
  const { width, height, fontSize, fontWeight, textColor, gradient } =
    useShimmer(props);

  return (
    <View
      testID={testID}
      style={[styles.container, { width, height }, containerStyle]}
    >
      <MaskedView
        style={[styles.mask, { width, height }]}
        maskElement={
          <Text
            style={[
              styles.label,
              { color: textColor, fontSize },
              style,
              { fontWeight },
            ]}
          >
            {children ?? ""}
          </Text>
        }
      >
        <Animated.View
          style={[
            styles.gradient,
            { experimental_backgroundImage: gradient } as NativeShimmerStyle,
            buildAnimation(duration, direction),
            shimmerStyle,
          ]}
        />
      </MaskedView>
    </View>
  );
}

export const ShimmerText = memo(ShimmerTextComponent);

export default ShimmerText;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  mask: { overflow: "hidden" },
  gradient: { flex: 1, width: "300%", marginHorizontal: "-100%" },
  label: { textAlign: "center" },
});
