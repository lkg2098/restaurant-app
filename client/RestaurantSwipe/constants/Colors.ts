/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#F43625";
const tintColorDark = "#F43625";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    subduedText: "#595959",
    interactive: "#F43625",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#FFFFFF",
    background: "#1A1723",
    tint: tintColorDark,
    icon: "#F43625",
    subduedText: "#A6A6A6",
    interactive: "#F43625", //"#F5C341",
    tabIconDefault: "#F43625",
    tabIconSelected: tintColorDark,
  },
};
