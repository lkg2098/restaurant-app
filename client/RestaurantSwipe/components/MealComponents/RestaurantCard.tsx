import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import StarRating from "react-native-star-rating-widget";
import { ThemedText } from "../ThemedText";
import * as WebBrowser from "expo-web-browser";
import { Link, useRouter } from "expo-router";
import { Badge } from "../Badge";
import PhotoCarousel from "../PhotoCarousel";

export default function RestaurantCard({ data }: { data: any }) {
  const router = useRouter();

  const subduedColor = useThemeColor({}, "subduedText");
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");

  const priceLevel = useMemo(() => {
    if (data?.priceLevel) {
      if (data.priceLevel == "PRICE_LEVEL_INEXPENSIVE") {
        return "$";
      }
      if (data.priceLevel == "PRICE_LEVEL_MODERATE") {
        return "$$";
      }
      if (data.priceLevel == "PRICE_LEVEL_EXPENSIVE") {
        return "$$$";
      }
      if (data.priceLevel == "PRICE_LEVEL_VERY_EXPENSIVE") {
        return "$$$$";
      }
    }
  }, [data?.priceLevel]);
  return (
    <View style={{ height: "100%" }}>
      <PhotoCarousel
        photos={
          data?.photos?.map(
            (photo: { name: string; author: any }) => photo.name
          ) || []
        }
      />
      <View style={styles.restaurantDescription}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ThemedText type="title">{data?.name || ""}</ThemedText>
          <ThemedText>{priceLevel}</ThemedText>
        </View>
        <ThemedText style={{ paddingVertical: 5 }}>
          <Ionicons name="location" size={16} /> {data?.address}
        </ThemedText>

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {data?.types?.map((type: string) => (
            <Badge key={type} text={type} textColor={backgroundColor} />
          ))}
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            paddingVertical: 5,
            alignItems: "flex-end",
          }}
        >
          <StarRating
            rating={data?.rating || 5}
            onChange={() => {}}
            enableSwiping={false}
            color={subduedColor}
            starSize={25}
            style={{ paddingVertical: 0 }}
            starStyle={{ width: 15 }}
          />
          <ThemedText subdued type="defaultSemiBold" style={{ lineHeight: 23 }}>
            {data?.rating || 5}
          </ThemedText>
        </View>
        {/* {data.hours.map((hour: string) => (
          <ThemedText >{hour}</ThemedText>
        ))} */}
        <ThemedText>
          <Ionicons name="restaurant" size={14} />
          Dine-in <Ionicons name="bag" size={14} /> Takeout,{" "}
          <Ionicons name="car" size={14} /> Delivery
        </ThemedText>
        {data?.website && (
          <Pressable
            style={styles.iconPressable}
            onPress={() => {
              router.push({
                pathname: "./webView",
                params: {
                  title: data?.name || "Website",
                  url: data?.website,
                },
              });
            }}
          >
            <Ionicons name="globe" size={20} color={tintColor} />
            <ThemedText type="defaultBold" interactive>
              {"Website / Menu"}
            </ThemedText>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconPressable: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    paddingVertical: 5,
  },
  restaurantDescription: {
    paddingHorizontal: 20,
  },
});
