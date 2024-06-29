import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import Restaurant from "@/utils/restaurant";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function Match() {
  const sessionId = useLocalSearchParams();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ThemedText
        type="title"
        style={{ fontFamily: "Playwrite", fontSize: 40, lineHeight: 70 }}
      >
        Delicious!
      </ThemedText>
      <ThemedView style={styles.match}></ThemedView>
      <Pressable onPress={() => {}} style={styles.button}>
        <ThemedText type="defaultBold">I Changed My Mind</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  match: {
    height: "70%",
    width: "80%",
  },
  button: {
    padding: 10,
    margin: 10,
    width: "70%",
    alignItems: "center",
  },
});
