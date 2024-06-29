import React from "react";
import { StyleSheet, View } from "react-native";
import StarRating from "react-native-star-rating-widget";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function RatingSettingsItem({
  title,
  rating,
  handleRating,
  handleScroll,
}: {
  title: string;
  rating: number;
  handleRating: Function;
  handleScroll: Function;
}) {
  const color = useThemeColor({}, "interactive");
  return (
    <View style={styles.item}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <StarRating
          rating={rating}
          onChange={(value) => handleRating(value)}
          onRatingStart={() => handleScroll(false)}
          onRatingEnd={() => handleScroll(true)}
          starSize={25}
          color={color}
        />
      </View>
      <ThemedText subdued style={styles.subduedText}>
        {rating.toFixed(1)}
      </ThemedText>
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

  content: {
    flexDirection: "row",
    gap: 15,
  },
  title: {
    width: 90,
  },
  subduedText: {
    textAlign: "right",
  },
});
