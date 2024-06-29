import { useThemeColor } from "@/hooks/useThemeColor";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../ThemedText";

export default function SliderSettingsItem({
  title,
  content,
  values,
  handleValues,
  min,
  max,
  step,
  snapped,
  handleScroll,
}: {
  title: string;
  content: string;
  values: Array<number>;
  handleValues: Function;
  min: number;
  max: number;
  step: number;
  snapped: boolean;
  handleScroll: Function;
}) {
  const color = useThemeColor({}, "interactive");
  return (
    <View style={styles.item}>
      <View style={styles.header}>
        <ThemedText type="defaultMedium" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText subdued style={styles.subduedText}>
          {content}
        </ThemedText>
      </View>
      <MultiSlider
        values={values}
        min={min}
        max={max}
        step={step}
        snapped={snapped}
        onValuesChange={(values) => handleValues(values)}
        onValuesChangeStart={() => handleScroll(false)}
        onValuesChangeFinish={() => handleScroll(true)}
        containerStyle={styles.sliderContainer}
        markerStyle={{ ...styles.sliderMarker, backgroundColor: color }}
        trackStyle={{ ...styles.sliderTrack, backgroundColor: color }}
        selectedStyle={{ ...styles.sliderSelected, backgroundColor: color }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingTop: 15,
    alignSelf: "stretch",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  title: {
    width: 90,
  },
  subduedText: {
    textAlign: "right",
  },
  sliderTrack: { opacity: 0.4 },
  sliderMarker: {
    width: 12,
    height: 12,
    borderWidth: 0,
    shadowOpacity: 0,
  },
  sliderSelected: { opacity: 1 },
  sliderContainer: { alignSelf: "center", paddingTop: 5 },
});
