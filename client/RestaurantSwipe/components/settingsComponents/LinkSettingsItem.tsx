import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../ThemedText";

export default function LinkSettingsItem({
  href,
  title,
  content,
}: {
  href: string;
  title: string;
  content: string;
}) {
  const iconColor = useThemeColor({}, "subduedText");
  return (
    <Link href={href} asChild>
      <Pressable style={styles.item}>
        <View style={styles.content}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText subdued>{content}</ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={14} color={iconColor} />
      </Pressable>
    </Link>
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
