import { useMemo } from "react";
import { TextStyle, useColorScheme } from "react-native";
import { defaultShimmerColors } from "./colors";
import { ShimmerTextProps, textSizes } from "./types";

export interface ShimmerConfig {
  /** Resolved container width in px. */
  width: number;
  /** Resolved container height in px. */
  height: number;
  /** Resolved font size in px. */
  fontSize: number;
  /** Resolved font weight. */
  fontWeight: TextStyle["fontWeight"];
  /** Solid colour used to render the mask text on native. */
  textColor: string;
  /** Ready-to-use CSS `linear-gradient(...)` string. */
  gradient: string;
}

const DEFAULT_ANGLE = 100;
const DEFAULT_SIZE = "md";
/** Gradient stops used when `highlightWidth` is not provided. */
const DEFAULT_START_STOP = 46;
const DEFAULT_END_STOP = 54;
/** Heuristic average glyph aspect ratio used to estimate width from length. */
const GLYPH_WIDTH_RATIO = 0.6;
const MIN_WIDTH = 100;
const LINE_HEIGHT_RATIO = 1.2;

/**
 * Computes every derived value the shimmer renderers need (colours, gradient
 * string, dimensions, font size/weight). Shared by the native and web entry
 * points so the two implementations can never drift apart. The result is
 * memoised against the inputs that actually affect it.
 */
export function useShimmer(props: ShimmerTextProps): ShimmerConfig {
  const {
    children,
    style,
    bold,
    highlightWidth,
    angle = DEFAULT_ANGLE,
    width,
    height,
    size = DEFAULT_SIZE,
    colors,
  } = props;

  const scheme: "light" | "dark" =
    useColorScheme() === "dark" ? "dark" : "light";
  const styleFontSize = style?.fontSize;
  const styleFontWeight = style?.fontWeight;
  const textLength = children?.length ?? 0;

  return useMemo(() => {
    const themeDefaults = defaultShimmerColors[scheme];
    const override = colors?.[scheme];
    const textColor = override?.text ?? themeDefaults.text;
    // Deep-merge the shimmer colours so a partial override (e.g. only `start`)
    // keeps the remaining default stops instead of dropping them.
    const shimmer = { ...themeDefaults.shimmer, ...override?.shimmer };

    const sizeConfig = textSizes[size] ?? textSizes[DEFAULT_SIZE];
    const fontSize = styleFontSize ?? sizeConfig.fontSize;

    const fontWeight: TextStyle["fontWeight"] =
      bold === undefined
        ? (styleFontWeight ?? "bold")
        : bold
          ? "bold"
          : "normal";

    const resolvedWidth =
      width ?? Math.max(textLength * fontSize * GLYPH_WIDTH_RATIO, MIN_WIDTH);
    const resolvedHeight =
      height ?? sizeConfig.height ?? fontSize * LINE_HEIGHT_RATIO;

    const clamped = Math.max(0, Math.min(100, highlightWidth ?? NaN));
    const hasHighlight = Number.isFinite(clamped);
    const startStop = hasHighlight ? 50 - clamped / 2 : DEFAULT_START_STOP;
    const endStop = hasHighlight ? 50 + clamped / 2 : DEFAULT_END_STOP;

    const gradient = `linear-gradient(${angle}deg, ${shimmer.start} ${startStop}%, ${shimmer.middle} 50%, ${shimmer.end} ${endStop}%)`;

    return {
      width: resolvedWidth,
      height: resolvedHeight,
      fontSize,
      fontWeight,
      textColor,
      gradient,
    };
  }, [
    scheme,
    colors,
    size,
    styleFontSize,
    styleFontWeight,
    bold,
    width,
    height,
    textLength,
    highlightWidth,
    angle,
  ]);
}
