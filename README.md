# react-native-shimmer-text

![Demo](https://github.com/user-attachments/assets/070c68ba-05cb-40bf-91e0-213bd52f97ca)

<div align="center">

**💡 Building a full mobile app?**

Check out [**Ship Mobile Fast**](https://shipmobilefast.com) - The #1 React Native Expo boilerplate to build and ship mobile apps in days, not weeks.

[<img src="https://shipmobilefast.s3.us-east-1.amazonaws.com/hero/1.png" width="400" alt="Ship Mobile Fast" />](https://shipmobilefast.com)

_Authentication • Payments • AI Integration • And More!_

</div>

---

<p align="center">
  <a href="https://www.npmjs.com/package/react-native-shimmer-text">
    <img src="https://img.shields.io/npm/v/react-native-shimmer-text?style=flat-square" alt="NPM version" />
  </a>
  <a href="https://www.npmjs.com/package/react-native-shimmer-text">
    <img src="https://img.shields.io/npm/dm/react-native-shimmer-text?style=flat-square" alt="NPM downloads" />
  </a>
  <a href="/LICENSE">
    <img src="https://img.shields.io/npm/l/react-native-shimmer-text?style=flat-square" alt="License" />
  </a>
</p>

Cross-platform shimmer text component for React Native (iOS, Android, Web) with customizable animations and theme support.

## ✨ Features

- Cross-platform support (iOS, Android, Web)
- Customizable duration, direction, colors
- Theme-aware (light/dark mode)
- Predefined sizes (xs to 9xl)
- Smooth animations with react-native-reanimated

## 📦 Installation

```bash
npm install react-native-shimmer-text
expo install react-native-reanimated @react-native-masked-view/masked-view
```

## 🚀 Usage

```tsx
import ShimmerText from "react-native-shimmer-text";

export default function Example() {
  return (
    <ShimmerText size="lg" duration={3} direction="ltr">
      Thinking...
    </ShimmerText>
  );
}
```

## ⚙️ Props

| Prop             | Type                                              | Default     | Description                       |
| ---------------- | ------------------------------------------------- | ----------- | --------------------------------- |
| `children`       | `string`                                          | `undefined` | Text content                      |
| `style`          | `TextStyle`                                       | `undefined` | Text styles                       |
| `shimmerStyle`   | `ViewStyle` or `WebShimmerStyle`                  | `undefined` | Shimmer effect styles             |
| `containerStyle` | `ViewStyle`                                       | `undefined` | Container styles                  |
| `duration`       | `number`                                          | `3`         | Animation duration (seconds)      |
| `bold`           | `boolean`                                         | `true`      | Bold text                         |
| `highlightWidth` | `number`                                          | `undefined` | Shimmer width percentage (0-100)  |
| `direction`      | `'ltr'` or `'rtl'`                                | `'ltr'`     | Animation direction               |
| `angle`          | `number`                                          | `100`       | Gradient angle (degrees)          |
| `size`           | `TextSize`                                        | `'md'`      | Text size (`'xs'` to `'9xl'`)     |
| `colors`         | `{ light?: ShimmerColors, dark?: ShimmerColors }` | `undefined` | Theme colors                      |
| `width`          | `number`                                          | `undefined` | Custom width                      |
| `height`         | `number`                                          | `undefined` | Custom height                     |
| `testID`         | `string`                                          | `undefined` | Test identifier for the container |

### `TextSize`

`'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '7xl' | '9xl'`

### `ShimmerColors`

```ts
interface ShimmerColors {
  text: string;
  shimmer: {
    start: string;
    middle: string;
    end: string;
  };
}
```

## 🎨 Custom Colors

```tsx
const customColors = {
  light: {
    text: "#333333",
    shimmer: { start: "#e0e0e0", middle: "#f5f5f5", end: "#e0e0e0" },
  },
  dark: {
    text: "#cccccc",
    shimmer: { start: "#424242", middle: "#616161", end: "#424242" },
  },
};

<ShimmerText size="2xl" colors={customColors}>
  Custom Colors
</ShimmerText>;
```

## License

MIT
