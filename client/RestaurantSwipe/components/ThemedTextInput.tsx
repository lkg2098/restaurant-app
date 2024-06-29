import { TextInput, type TextInputProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useEffect, useState } from "react";

export type ThemedTextProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  interactive?: boolean;
  subdued?: boolean;
  helpText?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "defaultBold"
    | "defaultMedium"
    | "subtitle"
    | "link";
};

export function ThemedTextInput({
  style,
  interactive,
  subdued,
  lightColor,
  darkColor,
  helpText,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const subduedColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "subduedText"
  );
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  const [focused, setFocused] = useState(false);
  const handleFocused = (value: boolean) => {
    console.log("help");
    setFocused(value);
  };

  useEffect(() => {
    console.log(focused);
  }, [focused]);

  return (
    <ThemedView style={styles.container}>
      <TextInput
        placeholderTextColor={subduedColor}
        onFocus={() => handleFocused(true)}
        onBlur={() => handleFocused(false)}
        style={[{ backgroundColor, color }, styles.textInput, style]}
        {...rest}
      />
      {helpText && focused && (
        <ThemedText style={styles.instructions} subdued>
          {helpText}
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", alignItems: "center" },
  textInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 8,
    lineHeight: 20,
    padding: 12,
    width: "100%",
  },
  instructions: {
    width: "65%",
  },
});
