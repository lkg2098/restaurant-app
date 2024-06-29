import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { ThemedText } from "./ThemedText";

export default function GradientButton({
  handlePress,
  buttonText,
  style,
}: {
  handlePress: Function;
  buttonText: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={() => handlePress()}
      style={[styles.submitButton, style]}
    >
      <LinearGradient
        locations={[0.2, 1]}
        colors={["#F43625", "#F5C341"]}
        style={{ padding: 15 }}
      >
        <ThemedText type="defaultBold" style={styles.submitButtonText}>
          {buttonText}
        </ThemedText>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    alignSelf: "center",
    borderRadius: 8,
    overflow: "hidden",
  },
  submitButtonText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
