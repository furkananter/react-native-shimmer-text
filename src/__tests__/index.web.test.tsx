import { render, screen } from "@testing-library/react-native";
import ShimmerText from "../index.web";

type StyleObject = Record<string, unknown>;

/** Flattens a react-native style prop (object | array | nested) into one list. */
function flattenStyle(style: unknown): StyleObject[] {
  if (Array.isArray(style)) {
    return style.flatMap(flattenStyle);
  }
  return style ? [style as StyleObject] : [];
}

describe("ShimmerText (web)", () => {
  afterEach(() => {
    document
      .querySelectorAll("style[data-shimmer]")
      .forEach((el) => el.remove());
  });

  describe("rendering", () => {
    it("renders the provided text", () => {
      render(<ShimmerText>Web Shimmer</ShimmerText>);
      expect(screen.getByText("Web Shimmer")).toBeTruthy();
    });

    it("applies the testID to the container", () => {
      render(<ShimmerText testID="shimmer-web">Hi</ShimmerText>);
      expect(screen.getByTestId("shimmer-web")).toBeTruthy();
    });

    it("paints the text with the background-clip gradient technique", () => {
      render(<ShimmerText>Clip</ShimmerText>);
      const styles = flattenStyle(screen.getByText("Clip").props.style);
      const clip = styles.find((s) => s.WebkitBackgroundClip === "text");
      expect(clip).toBeDefined();
      expect(clip?.backgroundImage).toContain("linear-gradient(");
    });

    it("reflects the duration in the text animation shorthand", () => {
      render(<ShimmerText duration={7}>Timed</ShimmerText>);
      const styles = flattenStyle(screen.getByText("Timed").props.style);
      const animated = styles.find((s) => typeof s.animation === "string");
      expect(animated?.animation).toContain("7s");
    });
  });

  describe("keyframe injection", () => {
    it("injects a @keyframes <style> element into the document head", () => {
      render(<ShimmerText>Animate</ShimmerText>);
      const styleEl = document.querySelector("style[data-shimmer]");
      expect(styleEl).not.toBeNull();
      expect(styleEl?.textContent).toContain("@keyframes shimmer-");
      expect(styleEl?.textContent).toContain("background-position");
    });

    it("keeps a single stable keyframes id across re-renders", () => {
      const { rerender } = render(
        <ShimmerText duration={3}>Stable</ShimmerText>,
      );
      const first = document
        .querySelector("style[data-shimmer]")
        ?.getAttribute("data-shimmer");
      expect(first).toBeTruthy();

      // A re-render with different props must NOT tear down / re-create the
      // <style> element (the previous implementation regenerated the id on
      // every render).
      rerender(<ShimmerText duration={5}>Stable</ShimmerText>);

      const elements = document.querySelectorAll("style[data-shimmer]");
      expect(elements).toHaveLength(1);
      expect(elements[0].getAttribute("data-shimmer")).toBe(first);
    });

    it("removes the injected style on unmount", () => {
      const { unmount } = render(<ShimmerText>Cleanup</ShimmerText>);
      expect(document.querySelector("style[data-shimmer]")).not.toBeNull();
      unmount();
      expect(document.querySelector("style[data-shimmer]")).toBeNull();
    });

    it("animates left-to-right by default", () => {
      // width 200 -> start 300px, end -100px
      render(
        <ShimmerText direction="ltr" width={200}>
          LTR
        </ShimmerText>,
      );
      const css = document.querySelector("style[data-shimmer]")?.textContent;
      expect(css).toContain("0% { background-position: -100px 0; }");
      expect(css).toContain("100% { background-position: 300px 0; }");
    });

    it("reverses the keyframes for rtl", () => {
      render(
        <ShimmerText direction="rtl" width={200}>
          RTL
        </ShimmerText>,
      );
      const css = document.querySelector("style[data-shimmer]")?.textContent;
      expect(css).toContain("0% { background-position: 300px 0; }");
      expect(css).toContain("100% { background-position: -100px 0; }");
    });
  });
});
