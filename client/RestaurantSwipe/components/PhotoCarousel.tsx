import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useState } from "react";
import { ImageBackground, Pressable, StyleSheet, View } from "react-native";

export default function PhotoCarousel({ photos }: { photos: Array<string> }) {
  const [index, setIndex] = useState(0);
  const tintColor = useThemeColor({}, "tint");
  const subduedColor = useThemeColor({}, "subduedText");

  const testData = [
    "https://lh3.googleusercontent.com/places/ANXAkqFcbxUM9O9TXGDYFtoX_2u4pzR2YLi54T0ZFwZ6-o7R5M2mDHrUOknc7QDUqCFmN36TJ6_WuJvwasPJpIYpe3XqahnUh0v9kaQ=s4800-h1228",
    "https://lh3.googleusercontent.com/places/ANXAkqG467sR3wokEPV5OlGhaOM8tPnLcsWk_Ejd3oT_k2doEyN_h2j6B-8r1vlVYN1Ux0gdNmaq28NgRcP91fX_gw53K78MlvmDapk=s4800-h1600",
    "https://lh3.googleusercontent.com/places/ANXAkqEZzOVvu4RxW-33lukYsA9So774ktUDH6AjXQ-rqXiyeMR1yV-c5vUjA23RwPUwqCpt1yi5PZoOcaefB6cF0HcbAZFAokBNbrs=s4800-h682",
  ];
  const handleChangePhoto = (direction: number) => {
    setIndex(index + direction);
  };
  return (
    <View>
      <ImageBackground
        style={{
          height: 250,
          flexDirection: "row",
          backgroundColor: "black",
        }}
        resizeMode="cover"
        source={{
          uri: testData[index],
        }}
      >
        <Pressable
          style={{ width: "40%" }}
          onPress={() => handleChangePhoto(-1)}
        ></Pressable>
        <Pressable
          style={{ width: "60%" }}
          onPress={() => handleChangePhoto(1)}
        ></Pressable>
      </ImageBackground>
      <View style={styles.carouselPips}>
        <View
          style={[
            styles.carouselPip,
            { backgroundColor: index == 0 ? tintColor : subduedColor },
          ]}
        ></View>
        <View
          style={[
            styles.carouselPip,
            { backgroundColor: index == 1 ? tintColor : subduedColor },
          ]}
        ></View>
        <View
          style={[
            styles.carouselPip,
            { backgroundColor: index == 2 ? tintColor : subduedColor },
          ]}
        ></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselPips: {
    flexDirection: "row",
    padding: 7,
    flex: 1,
    justifyContent: "center",
  },
  carouselPip: {
    backgroundColor: "#a6a6a6",
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 3,
  },
});
