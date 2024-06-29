import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../ThemedText";

export default function StaticSettingsItem({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const iconColor = useThemeColor({}, "subduedText");
  return (
    <Pressable style={styles.item}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText subdued>{content}</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 15,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    gap: 15,
  },
  title: {
    width: 90,
  },
});
