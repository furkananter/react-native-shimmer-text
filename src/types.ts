import { TextStyle, ViewStyle } from "react-native";

/**
 * Extra style properties used on the **web** target for the CSS
 * `background-clip: text` shimmer technique. These are valid on
 * react-native-web but are not part of React Native's `ViewStyle`/`TextStyle`.
 */
export interface WebShimmerStyle {
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundRepeat?: string;
  backgroundPosition?: string;
  backgroundClip?: string;
  WebkitBackgroundClip?: string;
  animation?: string;
  animationName?: string;
  animationDuration?: string;
  animationIterationCount?: number | "infinite";
  animationTimingFunction?: string;
  experimental_backgroundImage?: string;
}

/** `ViewStyle` augmented with the web CSS animation properties. */
export interface WebAnimationStyle extends ViewStyle {
  animationName?: string;
  animationDuration?: string;
  animationIterationCount?: number | "infinite";
  animationTimingFunction?: string;
}

/**
 * Style augmentation for the **native** target. `experimental_backgroundImage`
 * and the CSS keyframe animation props are supported by React Native's
 * New Architecture renderer.
 */
export type NativeShimmerStyle = ViewStyle & {
  experimental_backgroundImage?: string;
  animationName?:
    | string
    | Record<string, { transform?: { translateX: string }[] }>;
  animationDuration?: string;
  animationIterationCount?: number | "infinite";
  animationTimingFunction?: string;
};

export type TextSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "7xl"
  | "9xl";

export interface ShimmerColors {
  text: string;
  shimmer: {
    start: string;
    middle: string;
    end: string;
  };
}

export interface ShimmerTextProps {
  /** Text content to render with the shimmer effect. */
  children?: string;
  /** Custom text styles (merged with the resolved size/weight). */
  style?: TextStyle;
  /** Styles applied to the animated shimmer/gradient layer. */
  shimmerStyle?: ViewStyle | WebShimmerStyle;
  /** Styles applied to the outer container. */
  containerStyle?: ViewStyle;
  /** Animation duration in seconds. @default 3 */
  duration?: number;
  /** Render the text in bold. @default true */
  bold?: boolean;
  /** Width of the bright highlight band as a percentage (0–100). */
  highlightWidth?: number;
  /** Animation direction. @default "ltr" */
  direction?: "ltr" | "rtl";
  /** Gradient angle in degrees. @default 100 */
  angle?: number;
  /** Predefined text size token. @default "md" */
  size?: TextSize;
  /** Per-theme colour overrides (deep-merged with the defaults). */
  colors?: {
    light?: Partial<ShimmerColors>;
    dark?: Partial<ShimmerColors>;
  };
  /** Explicit width in px (otherwise estimated from the text). */
  width?: number;
  /** Explicit height in px (otherwise derived from the size). */
  height?: number;
  /** Test identifier applied to the outer container. */
  testID?: string;
}

export const textSizes: Record<
  TextSize,
  { fontSize: number; height?: number }
> = {
  xs: { fontSize: 12, height: 16 },
  sm: { fontSize: 14, height: 20 },
  md: { fontSize: 16, height: 24 },
  lg: { fontSize: 18, height: 28 },
  xl: { fontSize: 20, height: 32 },
  "2xl": { fontSize: 24, height: 36 },
  "3xl": { fontSize: 30, height: 42 },
  "4xl": { fontSize: 36, height: 50 },
  "5xl": { fontSize: 48, height: 64 },
  "7xl": { fontSize: 72, height: 90 },
  "9xl": { fontSize: 128, height: 150 },
};
