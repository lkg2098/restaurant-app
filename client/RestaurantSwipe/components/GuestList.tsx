import React from "react";
import {
  Animated,
  FlatList,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { Guest } from "@/types/Guest";

function GuestListItem({
  guest,
  handleDelete,
}: {
  guest: Guest;
  handleDelete: Function;
}) {
  return (
    <Swipeable
      containerStyle={{ ...styles.item }}
      overshootRight={false}
      rightThreshold={5}
      renderRightActions={(progress, dragX) => {
        const trans = dragX.interpolate({
          inputRange: [0, 5, 10],
          outputRange: [-8.7, -5, -10],
        });
        const scale = dragX.interpolate({
          inputRange: [0, 10, 20, 30, 40],
          outputRange: [0, -0.1, -0.2, -0.3, -0.4],
        });
        return (
          <Pressable
            onPress={() => handleDelete(guest.username)}
            style={{ position: "relative", width: 90 }}
          >
            <Animated.View
              style={{
                backgroundColor: "red",
                width: "100%",
                height: "100%",
                transform: [{ scaleX: scale }],
                transformOrigin: "right",
              }}
            ></Animated.View>
            <Animated.Text
              style={{
                left: "125%",
                top: "-70%",
                transform: [{ translateX: trans }],
              }}
            >
              <Ionicons
                name="trash"
                color="white"
                size={25}
                style={{ position: "relative" }}
              />
            </Animated.Text>
          </Pressable>
        );
      }}
    >
      <View style={styles.item}>
        <Image
          style={styles.profileImage}
          source={
            guest.profileImage
              ? guest.profileImage
              : require("../assets/images/dining out.jpeg")
          }
        />
        <ThemedText>{guest.username}</ThemedText>
      </View>
    </Swipeable>
  );
}
export default function GuestList({
  guests,
  deleteGuest,
}: {
  guests: Array<Guest>;
  deleteGuest: Function;
}) {
  return (
    <GestureHandlerRootView style={styles.list}>
      <FlatList
        data={guests}
        style={styles.list}
        renderItem={({ item }: { item: Guest }) => (
          <GuestListItem guest={item} handleDelete={deleteGuest} />
        )}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  list: {
    alignSelf: "stretch",
    flex: 1,
  },
  item: {
    paddingHorizontal: 10,
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    paddingVertical: 7,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
