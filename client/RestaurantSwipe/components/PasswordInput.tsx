import {
  TextInput,
  type TextInputProps,
  StyleSheet,
  Pressable,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ThemedText } from "./ThemedText";

export type ThemedTextProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  subdued?: boolean;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "defaultBold"
    | "defaultMedium"
    | "subtitle"
    | "link";
};

export function PasswordInput({
  style,
  subdued,
  lightColor,
  darkColor,
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

  const [hidden, setHidden] = useState(true);

  const toggleHidden = () => {
    setHidden(!hidden);
  };

  useEffect(() => {
    console.log(hidden);
  }, [hidden]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[{ backgroundColor, color }, styles.border, style]}>
        <TextInput
          placeholderTextColor={subduedColor}
          secureTextEntry={hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[{ backgroundColor, color }, styles.textInput]}
          {...rest}
        />
        <Pressable onPress={() => toggleHidden()} style={styles.hideButton}>
          <Ionicons name={hidden ? "eye" : "eye-off"} size={16} />
        </Pressable>
      </ThemedView>
      {focused && (
        <ThemedText style={styles.instructions} subdued>
          Must be 8 or more characters and contain at least 1 uppercase letter
          and 1 number
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  textInput: {
    fontSize: 16,
    lineHeight: 20,
    height: "100%",
    width: "90%",
    padding: 12,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  border: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 20,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 8,
  },
  hideButton: {
    padding: 12,
  },
  instructions: {
    width: "65%",
  },
});
