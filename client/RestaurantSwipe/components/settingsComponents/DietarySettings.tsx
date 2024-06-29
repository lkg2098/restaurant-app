import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../ThemedText";

export default function DietarySettings() {
  return (
    <View style={styles.item}>
      <View style={styles.content}>
        <ThemedText type="defaultMedium" style={styles.title}>
          Dietary Restrictions
        </ThemedText>
        <View style={styles.list}>
          <ThemedText subdued>Vegan</ThemedText>
          <ThemedText subdued>Vegetarian</ThemedText>
          <ThemedText subdued>Nut Free</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 17,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  list: {
    gap: 10,
  },
  content: {
    flexDirection: "row",
    gap: 15,
  },
  title: {
    width: 90,
  },
});
