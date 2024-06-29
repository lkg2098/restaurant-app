import React from "react";
import { View } from "react-native";

export default function SliderBar({
  start,
  length,
}: {
  start: number;
  length: number;
}) {
  return (
    <View
      style={{
        position: "absolute",
        left: start,
        width: length,
        height: 2,
        backgroundColor: "blue",
      }}
    ></View>
  );
}
