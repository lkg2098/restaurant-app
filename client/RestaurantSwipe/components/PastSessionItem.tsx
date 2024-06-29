import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";

export default function PastSessionItem({
  id,
  title,
  imageSrc,
  date,
  location,
  liked,
}: {
  id: number;
  title: string;
  imageSrc: ImageSourcePropType;
  date: Date;
  location: string;
  liked?: boolean;
}) {
  const [isToday, setIsToday] = useState(
    date.toLocaleDateString() == new Date().toLocaleDateString()
  );
  return (
    <Link href={`../${id}`} asChild>
      <Pressable style={styles.item}>
        <Image source={imageSrc} style={styles.mealImage} />
        <View style={styles.itemContent}>
          <View>
            <ThemedText type="defaultMedium">{title}</ThemedText>
            <ThemedText subdued style={{ fontSize: 14, lineHeight: 16 }}>
              {location} •{" "}
              {date.toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "2-digit",
              })}
            </ThemedText>
          </View>

          <Pressable style={styles.itemRight}>
            <Ionicons
              name="heart"
              color={liked === true ? useThemeColor({}, "tint") : "#b0b0b0"}
              size={25}
            />
            <Ionicons
              name="chevron-forward"
              color={useThemeColor({}, "subduedText")}
            />
          </Pressable>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 15,
  },
  itemContent: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    alignSelf: "stretch",
  },
  mealImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
