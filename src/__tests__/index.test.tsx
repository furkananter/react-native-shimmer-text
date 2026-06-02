import { render, screen } from "@testing-library/react-native";
import { defaultShimmerColors } from "../colors";
import ShimmerText from "../index";

// Mock react-native-reanimated for testing
jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: {
      View: View,
    },
  };
});

// Mock MaskedView for testing
jest.mock("@react-native-masked-view/masked-view", () => {
  const React = require("react");
  const { View } = require("react-native");

  const MockedMaskedView = React.forwardRef((props, ref) => {
    const { maskElement, children, ...otherProps } = props;
    return (
      <View ref={ref} testID="masked-view" {...otherProps}>
        <View testID="mask-element">{maskElement}</View>
        <View testID="shimmer-content">{children}</View>
      </View>
    );
  });

  return {
    __esModule: true,
    default: MockedMaskedView,
  };
});

// Mock useColorScheme
const mockUseColorScheme = jest.fn(
  (): "light" | "dark" | null | undefined => "light",
);
jest.mock("react-native/Libraries/Utilities/useColorScheme", () => ({
  default: mockUseColorScheme,
}));

describe("ShimmerText", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseColorScheme.mockReturnValue("light");
  });

  describe("Basic Rendering", () => {
    it("renders correctly with default props", () => {
      render(<ShimmerText>Hello World</ShimmerText>);

      expect(screen.getByText("Hello World")).toBeTruthy();
      expect(screen.getByTestId("masked-view")).toBeTruthy();
      expect(screen.getByTestId("mask-element")).toBeTruthy();
      expect(screen.getByTestId("shimmer-content")).toBeTruthy();
    });

    it("renders with custom text content", () => {
      const testText = "Loading...";
      render(<ShimmerText>{testText}</ShimmerText>);

      expect(screen.getByText(testText)).toBeTruthy();
    });

    it("renders empty text", () => {
      render(<ShimmerText></ShimmerText>);

      expect(screen.getByTestId("masked-view")).toBeTruthy();
    });

    it("renders with long text content", () => {
      const longText =
        "This is a very long text that should be handled properly by the shimmer component";
      render(<ShimmerText>{longText}</ShimmerText>);

      expect(screen.getByText(longText)).toBeTruthy();
    });
  });

  describe("Size Prop", () => {
    it("applies xs size", () => {
      render(<ShimmerText size="xs">Extra Small</ShimmerText>);
      expect(screen.getByText("Extra Small")).toBeTruthy();
    });

    it("applies sm size", () => {
      render(<ShimmerText size="sm">Small</ShimmerText>);
      expect(screen.getByText("Small")).toBeTruthy();
    });

    it("applies md size (default)", () => {
      render(<ShimmerText size="md">Medium</ShimmerText>);
      expect(screen.getByText("Medium")).toBeTruthy();
    });

    it("applies lg size", () => {
      render(<ShimmerText size="lg">Large</ShimmerText>);
      expect(screen.getByText("Large")).toBeTruthy();
    });

    it("applies xl size", () => {
      render(<ShimmerText size="xl">Extra Large</ShimmerText>);
      expect(screen.getByText("Extra Large")).toBeTruthy();
    });

    it("applies 2xl size", () => {
      render(<ShimmerText size="2xl">2XL</ShimmerText>);
      expect(screen.getByText("2XL")).toBeTruthy();
    });

    it("applies 3xl size", () => {
      render(<ShimmerText size="3xl">3XL</ShimmerText>);
      expect(screen.getByText("3XL")).toBeTruthy();
    });

    it("applies 4xl size", () => {
      render(<ShimmerText size="4xl">4XL</ShimmerText>);
      expect(screen.getByText("4XL")).toBeTruthy();
    });

    it("applies 5xl size", () => {
      render(<ShimmerText size="5xl">5XL</ShimmerText>);
      expect(screen.getByText("5XL")).toBeTruthy();
    });

    it("applies 7xl size", () => {
      render(<ShimmerText size="7xl">7XL</ShimmerText>);
      expect(screen.getByText("7XL")).toBeTruthy();
    });

    it("applies 9xl size", () => {
      render(<ShimmerText size="9xl">9XL</ShimmerText>);
      expect(screen.getByText("9XL")).toBeTruthy();
    });
  });

  describe("Duration Prop", () => {
    it("applies custom duration of 1 second", () => {
      render(<ShimmerText duration={1}>Fast Shimmer</ShimmerText>);
      expect(screen.getByText("Fast Shimmer")).toBeTruthy();
    });

    it("applies custom duration of 5 seconds", () => {
      render(<ShimmerText duration={5}>Slow Shimmer</ShimmerText>);
      expect(screen.getByText("Slow Shimmer")).toBeTruthy();
    });

    it("applies custom duration of 10 seconds", () => {
      render(<ShimmerText duration={10}>Very Slow</ShimmerText>);
      expect(screen.getByText("Very Slow")).toBeTruthy();
    });

    it("handles fractional duration", () => {
      render(<ShimmerText duration={0.5}>Very Fast</ShimmerText>);
      expect(screen.getByText("Very Fast")).toBeTruthy();
    });
  });

  describe("Direction Prop", () => {
    it("handles ltr direction", () => {
      render(<ShimmerText direction="ltr">Left to Right</ShimmerText>);
      expect(screen.getByText("Left to Right")).toBeTruthy();
    });

    it("handles rtl direction", () => {
      render(<ShimmerText direction="rtl">Right to Left</ShimmerText>);
      expect(screen.getByText("Right to Left")).toBeTruthy();
    });

    it("defaults to ltr when direction is not specified", () => {
      render(<ShimmerText>Default Direction</ShimmerText>);
      expect(screen.getByText("Default Direction")).toBeTruthy();
    });
  });

  describe("Bold Prop", () => {
    it("applies bold styling when bold is true (default)", () => {
      render(<ShimmerText>Bold by Default</ShimmerText>);
      expect(screen.getByText("Bold by Default")).toBeTruthy();
    });

    it("applies bold styling when explicitly set to true", () => {
      render(<ShimmerText bold={true}>Explicitly Bold</ShimmerText>);
      expect(screen.getByText("Explicitly Bold")).toBeTruthy();
    });

    it("applies normal styling when bold is false", () => {
      render(<ShimmerText bold={false}>Not Bold</ShimmerText>);
      expect(screen.getByText("Not Bold")).toBeTruthy();
    });
  });

  describe("Angle Prop", () => {
    it("applies custom angle of 45 degrees", () => {
      render(<ShimmerText angle={45}>Angled Shimmer</ShimmerText>);
      expect(screen.getByText("Angled Shimmer")).toBeTruthy();
    });

    it("applies custom angle of 180 degrees", () => {
      render(<ShimmerText angle={180}>Reverse Angle</ShimmerText>);
      expect(screen.getByText("Reverse Angle")).toBeTruthy();
    });

    it("applies custom angle of 0 degrees", () => {
      render(<ShimmerText angle={0}>Horizontal</ShimmerText>);
      expect(screen.getByText("Horizontal")).toBeTruthy();
    });

    it("applies custom angle of 90 degrees", () => {
      render(<ShimmerText angle={90}>Vertical</ShimmerText>);
      expect(screen.getByText("Vertical")).toBeTruthy();
    });

    it("defaults to 100 degrees when angle is not specified", () => {
      render(<ShimmerText>Default Angle</ShimmerText>);
      expect(screen.getByText("Default Angle")).toBeTruthy();
    });
  });

  describe("Dimensions Props", () => {
    it("applies custom width", () => {
      render(<ShimmerText width={300}>Custom Width</ShimmerText>);
      expect(screen.getByText("Custom Width")).toBeTruthy();
    });

    it("applies custom height", () => {
      render(<ShimmerText height={50}>Custom Height</ShimmerText>);
      expect(screen.getByText("Custom Height")).toBeTruthy();
    });

    it("applies both custom width and height", () => {
      render(
        <ShimmerText width={200} height={40}>
          Custom Size
        </ShimmerText>,
      );
      expect(screen.getByText("Custom Size")).toBeTruthy();
    });

    it("calculates default width based on text length", () => {
      render(<ShimmerText>Short</ShimmerText>);
      expect(screen.getByText("Short")).toBeTruthy();
    });

    it("calculates default height based on font size", () => {
      render(<ShimmerText size="lg">Height Test</ShimmerText>);
      expect(screen.getByText("Height Test")).toBeTruthy();
    });
  });

  describe("Highlight Width Prop", () => {
    it("applies highlight width of 10", () => {
      render(<ShimmerText highlightWidth={10}>Narrow Highlight</ShimmerText>);
      expect(screen.getByText("Narrow Highlight")).toBeTruthy();
    });

    it("applies highlight width of 50", () => {
      render(<ShimmerText highlightWidth={50}>Wide Highlight</ShimmerText>);
      expect(screen.getByText("Wide Highlight")).toBeTruthy();
    });

    it("applies highlight width of 80", () => {
      render(<ShimmerText highlightWidth={80}>Very Wide</ShimmerText>);
      expect(screen.getByText("Very Wide")).toBeTruthy();
    });

    it("handles highlight width of 0", () => {
      render(<ShimmerText highlightWidth={0}>No Highlight</ShimmerText>);
      expect(screen.getByText("No Highlight")).toBeTruthy();
    });

    it("handles highlight width of 100", () => {
      render(<ShimmerText highlightWidth={100}>Full Width</ShimmerText>);
      expect(screen.getByText("Full Width")).toBeTruthy();
    });

    it("clamps highlight width above 100", () => {
      render(<ShimmerText highlightWidth={150}>Clamped High</ShimmerText>);
      expect(screen.getByText("Clamped High")).toBeTruthy();
    });

    it("handles negative highlight width", () => {
      render(<ShimmerText highlightWidth={-10}>Negative</ShimmerText>);
      expect(screen.getByText("Negative")).toBeTruthy();
    });
  });

  describe("Color Scheme Support", () => {
    it("uses light theme colors when color scheme is light", () => {
      mockUseColorScheme.mockReturnValue("light");
      render(<ShimmerText>Light Theme</ShimmerText>);
      expect(screen.getByText("Light Theme")).toBeTruthy();
    });

    it("uses dark theme colors when color scheme is dark", () => {
      mockUseColorScheme.mockReturnValue("dark");
      render(<ShimmerText>Dark Theme</ShimmerText>);
      expect(screen.getByText("Dark Theme")).toBeTruthy();
    });

    it("falls back to light theme when color scheme is null", () => {
      mockUseColorScheme.mockReturnValue(null);
      render(<ShimmerText>Null Scheme</ShimmerText>);
      expect(screen.getByText("Null Scheme")).toBeTruthy();
    });
  });

  describe("Custom Colors", () => {
    it("applies custom light theme colors", () => {
      const customColors = {
        light: {
          text: "#000000",
          shimmer: {
            start: "#ffffff00",
            middle: "#ffffff80",
            end: "#ffffff00",
          },
        },
      };

      mockUseColorScheme.mockReturnValue("light");
      render(<ShimmerText colors={customColors}>Custom Light</ShimmerText>);
      expect(screen.getByText("Custom Light")).toBeTruthy();
    });

    it("applies custom dark theme colors", () => {
      const customColors = {
        dark: {
          text: "#ffffff",
          shimmer: {
            start: "#00000000",
            middle: "#00000080",
            end: "#00000000",
          },
        },
      };

      mockUseColorScheme.mockReturnValue("dark");
      render(<ShimmerText colors={customColors}>Custom Dark</ShimmerText>);
      expect(screen.getByText("Custom Dark")).toBeTruthy();
    });

    it("applies partial custom colors and merges with defaults", () => {
      const customColors = {
        light: {
          text: "#ff0000",
        },
      };

      mockUseColorScheme.mockReturnValue("light");
      render(<ShimmerText colors={customColors}>Partial Colors</ShimmerText>);
      expect(screen.getByText("Partial Colors")).toBeTruthy();
    });

    it("handles custom colors for both themes", () => {
      const customColors = {
        light: {
          text: "#000000",
          shimmer: {
            start: "#ffffff00",
            middle: "#ffffff80",
            end: "#ffffff00",
          },
        },
        dark: {
          text: "#ffffff",
          shimmer: {
            start: "#00000000",
            middle: "#00000080",
            end: "#00000000",
          },
        },
      };

      render(<ShimmerText colors={customColors}>Both Themes</ShimmerText>);
      expect(screen.getByText("Both Themes")).toBeTruthy();
    });
  });

  describe("Style Props", () => {
    it("applies custom text style", () => {
      const customStyle = {
        fontSize: 24,
        color: "#ff0000",
        fontFamily: "Arial",
      };

      render(<ShimmerText style={customStyle}>Styled Text</ShimmerText>);
      expect(screen.getByText("Styled Text")).toBeTruthy();
    });

    it("applies custom container style", () => {
      const customContainerStyle = {
        backgroundColor: "#f0f0f0",
        padding: 10,
        borderRadius: 5,
      };

      render(
        <ShimmerText containerStyle={customContainerStyle}>
          Container Style
        </ShimmerText>,
      );
      expect(screen.getByText("Container Style")).toBeTruthy();
    });

    it("applies custom shimmer style", () => {
      const customShimmerStyle = {
        opacity: 0.5,
        borderRadius: 10,
      };

      render(
        <ShimmerText shimmerStyle={customShimmerStyle}>
          Shimmer Style
        </ShimmerText>,
      );
      expect(screen.getByText("Shimmer Style")).toBeTruthy();
    });

    it("applies all custom styles together", () => {
      const textStyle = { fontSize: 20 };
      const containerStyle = { padding: 5 };
      const shimmerStyle = { opacity: 0.8 };

      render(
        <ShimmerText
          style={textStyle}
          containerStyle={containerStyle}
          shimmerStyle={shimmerStyle}
        >
          All Styles
        </ShimmerText>,
      );
      expect(screen.getByText("All Styles")).toBeTruthy();
    });
  });

  describe("Complex Prop Combinations", () => {
    it("handles all props together", () => {
      const customColors = {
        light: {
          text: "#333333",
          shimmer: {
            start: "#ffffff00",
            middle: "#ffffff",
            end: "#ffffff00",
          },
        },
      };

      render(
        <ShimmerText
          size="xl"
          duration={2}
          bold={false}
          highlightWidth={60}
          direction="rtl"
          angle={45}
          width={250}
          height={50}
          colors={customColors}
          style={{ textDecorationLine: "underline" }}
          containerStyle={{ backgroundColor: "#f5f5f5" }}
          shimmerStyle={{ opacity: 0.9 }}
        >
          Complex Configuration
        </ShimmerText>,
      );
      expect(screen.getByText("Complex Configuration")).toBeTruthy();
    });

    it("handles edge case combinations", () => {
      render(
        <ShimmerText
          size="xs"
          duration={0.1}
          highlightWidth={0}
          width={10}
          height={5}
          angle={360}
        >
          Edge Cases
        </ShimmerText>,
      );
      expect(screen.getByText("Edge Cases")).toBeTruthy();
    });

    it("handles maximum value combinations", () => {
      render(
        <ShimmerText
          size="9xl"
          duration={100}
          highlightWidth={100}
          width={1000}
          height={200}
          angle={360}
        >
          Max Values
        </ShimmerText>,
      );
      expect(screen.getByText("Max Values")).toBeTruthy();
    });
  });

  describe("Text Length Variations", () => {
    it("handles single character", () => {
      render(<ShimmerText>A</ShimmerText>);
      expect(screen.getByText("A")).toBeTruthy();
    });

    it("handles very long text", () => {
      const veryLongText =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
      render(<ShimmerText>{veryLongText}</ShimmerText>);
      expect(screen.getByText(veryLongText)).toBeTruthy();
    });

    it("handles text with special characters", () => {
      const specialText = "!@#$%^&*()_+-=[]{}|;:,.<>?`~";
      render(<ShimmerText>{specialText}</ShimmerText>);
      expect(screen.getByText(specialText)).toBeTruthy();
    });

    it("handles text with unicode characters", () => {
      const unicodeText = "🎉🚀💖✨🌟 Unicode Test 中文 العربية ñoñó";
      render(<ShimmerText>{unicodeText}</ShimmerText>);
      expect(screen.getByText(unicodeText)).toBeTruthy();
    });

    it("handles text with numbers", () => {
      const numericText = "1234567890 Mixed 987654321";
      render(<ShimmerText>{numericText}</ShimmerText>);
      expect(screen.getByText(numericText)).toBeTruthy();
    });
  });

  describe("Component Structure", () => {
    it("maintains correct component hierarchy", () => {
      render(<ShimmerText>Hierarchy Test</ShimmerText>);

      const maskedView = screen.getByTestId("masked-view");
      const maskElement = screen.getByTestId("mask-element");
      const shimmerContent = screen.getByTestId("shimmer-content");

      expect(maskedView).toBeTruthy();
      expect(maskElement).toBeTruthy();
      expect(shimmerContent).toBeTruthy();
    });

    it("renders text inside mask element", () => {
      render(<ShimmerText>Mask Content</ShimmerText>);

      expect(screen.getByTestId("mask-element")).toBeTruthy();
      expect(screen.getByText("Mask Content")).toBeTruthy();
    });
  });

  describe("Default Values", () => {
    it("uses correct default duration", () => {
      render(<ShimmerText>Default Duration</ShimmerText>);
      expect(screen.getByText("Default Duration")).toBeTruthy();
    });

    it("uses correct default bold value", () => {
      render(<ShimmerText>Default Bold</ShimmerText>);
      expect(screen.getByText("Default Bold")).toBeTruthy();
    });

    it("uses correct default direction", () => {
      render(<ShimmerText>Default Direction</ShimmerText>);
      expect(screen.getByText("Default Direction")).toBeTruthy();
    });

    it("uses correct default angle", () => {
      render(<ShimmerText>Default Angle</ShimmerText>);
      expect(screen.getByText("Default Angle")).toBeTruthy();
    });

    it("uses correct default size", () => {
      render(<ShimmerText>Default Size</ShimmerText>);
      expect(screen.getByText("Default Size")).toBeTruthy();
    });
  });

  describe("Resolved Styles", () => {
    it("applies the testID to the container", () => {
      render(<ShimmerText testID="native-shimmer">Hi</ShimmerText>);
      expect(screen.getByTestId("native-shimmer")).toBeTruthy();
    });

    it("renders the mask text bold by default", () => {
      render(<ShimmerText>Bold</ShimmerText>);
      expect(screen.getByText("Bold")).toHaveStyle({ fontWeight: "bold" });
    });

    it("renders the mask text with normal weight when bold is false", () => {
      render(<ShimmerText bold={false}>Normal</ShimmerText>);
      expect(screen.getByText("Normal")).toHaveStyle({ fontWeight: "normal" });
    });

    it("uses the light theme text colour for the mask", () => {
      mockUseColorScheme.mockReturnValue("light");
      render(<ShimmerText>Masked</ShimmerText>);
      expect(screen.getByText("Masked")).toHaveStyle({
        color: defaultShimmerColors.light.text,
      });
    });

    it("applies the resolved font size from the size token", () => {
      render(<ShimmerText size="xl">Sized</ShimmerText>);
      expect(screen.getByText("Sized")).toHaveStyle({ fontSize: 20 });
    });
  });
});
