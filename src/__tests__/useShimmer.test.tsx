import { renderHook } from "@testing-library/react-native";
import { defaultShimmerColors } from "../colors";
import { useShimmer } from "../useShimmer";

const mockUseColorScheme = jest.fn(
  (): "light" | "dark" | null | undefined => "light",
);
jest.mock("react-native/Libraries/Utilities/useColorScheme", () => ({
  default: mockUseColorScheme,
}));

beforeEach(() => {
  mockUseColorScheme.mockReturnValue("light");
});

describe("useShimmer", () => {
  describe("dimensions", () => {
    it("derives font size and height from the size token", () => {
      const { result } = renderHook(() =>
        useShimmer({ children: "Hi", size: "lg" }),
      );
      expect(result.current.fontSize).toBe(18);
      expect(result.current.height).toBe(28);
    });

    it("enforces a minimum width for short text", () => {
      const { result } = renderHook(() => useShimmer({ children: "Hi" }));
      // 2 chars * 16 * 0.6 = 19.2 -> clamped up to the 100px minimum
      expect(result.current.width).toBe(100);
    });

    it("scales width with text length", () => {
      const { result } = renderHook(() =>
        useShimmer({ children: "x".repeat(50) }),
      );
      // 50 * 16 * 0.6 = 480
      expect(result.current.width).toBe(480);
    });

    it("honours explicit width and height overrides", () => {
      const { result } = renderHook(() =>
        useShimmer({ children: "Hi", width: 321, height: 99 }),
      );
      expect(result.current.width).toBe(321);
      expect(result.current.height).toBe(99);
    });

    it("lets style.fontSize override the size token", () => {
      const { result } = renderHook(() =>
        useShimmer({ children: "Hello", size: "md", style: { fontSize: 40 } }),
      );
      expect(result.current.fontSize).toBe(40);
      // width recomputes from the larger font: 5 * 40 * 0.6 = 120
      expect(result.current.width).toBe(120);
    });
  });

  describe("font weight", () => {
    it("defaults to bold", () => {
      const { result } = renderHook(() => useShimmer({ children: "Hi" }));
      expect(result.current.fontWeight).toBe("bold");
    });

    it("becomes normal when bold is false", () => {
      const { result } = renderHook(() =>
        useShimmer({ children: "Hi", bold: false }),
      );
      expect(result.current.fontWeight).toBe("normal");
    });

    it("falls back to style.fontWeight when bold is unset", () => {
      const { result } = renderHook(() =>
        useShimmer({ children: "Hi", style: { fontWeight: "300" } }),
      );
      expect(result.current.fontWeight).toBe("300");
    });

    it("prefers an explicit bold over style.fontWeight", () => {
      const { result } = renderHook(() =>
        useShimmer({
          children: "Hi",
          bold: true,
          style: { fontWeight: "300" },
        }),
      );
      expect(result.current.fontWeight).toBe("bold");
    });
  });

  describe("gradient stops", () => {
    it("uses the default 46%/54% band when highlightWidth is unset", () => {
      const { result } = renderHook(() => useShimmer({ children: "Hi" }));
      expect(result.current.gradient).toContain("46%");
      expect(result.current.gradient).toContain("54%");
    });

    it("centres the band around 50% for a given highlightWidth", () => {
      const { result } = renderHook(() =>
        useShimmer({ children: "Hi", highlightWidth: 50 }),
      );
      expect(result.current.gradient).toContain("25%");
      expect(result.current.gradient).toContain("75%");
    });

    it("expands to 0%/100% at the maximum highlightWidth", () => {
      const { result } = renderHook(() =>
        useShimmer({ children: "Hi", highlightWidth: 100 }),
      );
      expect(result.current.gradient).toContain("0%");
      expect(result.current.gradient).toContain("100%");
    });

    it("clamps highlightWidth above 100", () => {
      const { result } = renderHook(() =>
        useShimmer({ children: "Hi", highlightWidth: 150 }),
      );
      expect(result.current.gradient).toContain("0%");
      expect(result.current.gradient).toContain("100%");
    });

    it("clamps negative highlightWidth to 0", () => {
      const { result } = renderHook(() =>
        useShimmer({ children: "Hi", highlightWidth: -10 }),
      );
      // both stops collapse to 50%
      expect(result.current.gradient).toContain("50%");
      expect(result.current.gradient).not.toContain("46%");
    });

    it("embeds the requested angle", () => {
      const { result } = renderHook(() =>
        useShimmer({ children: "Hi", angle: 45 }),
      );
      expect(result.current.gradient).toContain("linear-gradient(45deg");
    });
  });

  describe("colours", () => {
    it("uses light theme colours by default", () => {
      const { result } = renderHook(() => useShimmer({ children: "Hi" }));
      expect(result.current.textColor).toBe(defaultShimmerColors.light.text);
      expect(result.current.gradient).toContain(
        defaultShimmerColors.light.shimmer.middle,
      );
    });

    it("switches to dark theme colours", () => {
      mockUseColorScheme.mockReturnValue("dark");
      const { result } = renderHook(() => useShimmer({ children: "Hi" }));
      expect(result.current.textColor).toBe(defaultShimmerColors.dark.text);
      expect(result.current.gradient).toContain(
        defaultShimmerColors.dark.shimmer.start,
      );
    });

    it("falls back to light theme when the scheme is null", () => {
      mockUseColorScheme.mockReturnValue(null);
      const { result } = renderHook(() => useShimmer({ children: "Hi" }));
      expect(result.current.textColor).toBe(defaultShimmerColors.light.text);
    });

    it("keeps default shimmer stops when only text is overridden", () => {
      const { result } = renderHook(() =>
        useShimmer({ children: "Hi", colors: { light: { text: "#ff0000" } } }),
      );
      expect(result.current.textColor).toBe("#ff0000");
      expect(result.current.gradient).toContain(
        defaultShimmerColors.light.shimmer.start,
      );
    });

    it("deep-merges a partial shimmer override", () => {
      const { result } = renderHook(() =>
        useShimmer({
          children: "Hi",
          colors: { light: { shimmer: { start: "#abcabc" } } },
        }),
      );
      // overridden stop is applied...
      expect(result.current.gradient).toContain("#abcabc");
      // ...while the untouched stops keep their defaults
      expect(result.current.gradient).toContain(
        defaultShimmerColors.light.shimmer.middle,
      );
      expect(result.current.gradient).toContain(
        defaultShimmerColors.light.shimmer.end,
      );
    });
  });
});
