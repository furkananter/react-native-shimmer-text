import { memo, useEffect, useRef } from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { ShimmerTextProps, WebAnimationStyle, WebShimmerStyle } from "./types";
import { useShimmer } from "./useShimmer";

const DEFAULT_DURATION = 3;

/**
 * Returns a CSS-safe keyframes name that stays stable for the lifetime of the
 * component. Generating it once (rather than on every render) avoids tearing
 * down and re-injecting the `<style>` element on each re-render.
 */
function useKeyframesId(): string {
  const ref = useRef<string | null>(null);
  if (ref.current === null) {
    ref.current = `shimmer-${Math.random().toString(36).slice(2, 11)}`;
  }
  return ref.current;
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
  const { width, height, fontSize, fontWeight, gradient } = useShimmer(props);

  const keyframesId = useKeyframesId();
  const startPosition = width * 1.5;
  const endPosition = -width * 0.5;

  useEffect(() => {
    if (typeof document === "undefined") return;

    const from =
      direction === "ltr" ? `${endPosition}px 0` : `${startPosition}px 0`;
    const to =
      direction === "ltr" ? `${startPosition}px 0` : `${endPosition}px 0`;

    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-shimmer", keyframesId);
    styleEl.textContent = `@keyframes ${keyframesId} { 0% { background-position: ${from}; } 100% { background-position: ${to}; } }`;
    document.head.appendChild(styleEl);

    return () => {
      styleEl.remove();
    };
  }, [keyframesId, direction, startPosition, endPosition]);

  const animatedGradient: WebAnimationStyle = {
    animationName: keyframesId,
    animationDuration: `${duration}s`,
    animationIterationCount: "infinite",
    animationTimingFunction: "linear",
  };

  return (
    <View
      testID={testID}
      style={[styles.container, { width, height }, containerStyle]}
    >
      <View style={[styles.mask, { width, height }]}>
        <View
          style={[
            styles.gradient,
            { experimental_backgroundImage: gradient } as ViewStyle &
              WebShimmerStyle,
            animatedGradient,
            shimmerStyle,
          ]}
        />
        <Text
          style={[
            styles.label,
            { fontSize },
            style,
            { fontWeight },
            StyleSheet.absoluteFill,
            styles.transparentText,
            {
              backgroundImage: gradient,
              backgroundSize: `${width * 2}px 100%`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              animation: `${keyframesId} ${duration}s infinite linear`,
            } as TextStyle & WebShimmerStyle,
          ]}
        >
          {children}
        </Text>
      </View>
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
  transparentText: { color: "transparent", backgroundColor: "transparent" },
});
