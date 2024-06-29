import React from "react";
import { Animated, GestureResponderHandlers, View } from "react-native";

export default function SliderCircle({
  translation,
  panHandlers,
}: {
  translation: number;
  panHandlers: GestureResponderHandlers;
}) {
  return (
    <Animated.View
      style={{
        transform: [{ translateX: translation }],
        position: "absolute",
        width: 50,
        height: 50,
        top: -25,
        left: -25,
      }}
      {...panHandlers}
    >
      <View
        style={{
          width: 14,
          height: 14,
          borderRadius: 7,
          backgroundColor: "blue",
          position: "relative",
          top: 19,
          left: 19,
        }}
      ></View>
    </Animated.View>
  );
}
