import { ColorValue, StyleSheet, View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";

export function Badge({
  text,
  color,
  textColor,
  size,
}: {
  text: string;
  color?: ColorValue;
  textColor?: ColorValue;
  size?: "small" | "medium" | "large";
}) {
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const badgeColor = color || tintColor;
  const textColorVal = textColor || backgroundColor;

  return (
    <View style={[{ backgroundColor: badgeColor }, styles.smallBadge]}>
      <ThemedText
        type="defaultSemiBold"
        style={{ color: textColorVal, fontSize: 14 }}
      >
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  smallBadge: {
    padding: 3,
    margin: 4,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
});
