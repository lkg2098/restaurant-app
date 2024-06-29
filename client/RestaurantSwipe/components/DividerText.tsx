import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { DimensionValue, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

function DividerLine({
  subdued,
  dividerLength,
}: {
  subdued?: boolean;
  dividerLength: DimensionValue;
}) {
  return (
    <View
      style={
        subdued
          ? {
              ...styles.line,
              width: dividerLength,
              borderColor: "#909090",
            }
          : { ...styles.line, width: dividerLength }
      }
    ></View>
  );
}

export default function DividerText({
  text,
  subdued,
  dividerLength,
}: {
  text: string;
  subdued?: boolean;
  dividerLength: DimensionValue;
}) {
  return (
    <View style={styles.divider}>
      <DividerLine subdued dividerLength={dividerLength} />
      <ThemedText subdued={subdued}>{text}</ThemedText>
      <DividerLine subdued dividerLength={dividerLength} />
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    gap: 10,
  },
  line: {
    borderBottomWidth: 1,
  },
});
