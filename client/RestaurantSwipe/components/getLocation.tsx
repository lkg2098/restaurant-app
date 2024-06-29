import React, { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet } from "react-native";

import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

export default function GetLocation() {
  const [coords, setCoords] = useState([37.785834, -122.406417]);
  const [errorMsg, setErrorMsg] = useState("");

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <>
      <MapView
        initialRegion={{
          latitude: coords[0],
          longitude: coords[1],
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={(e) => {
          setCoords([
            e.nativeEvent.coordinate.latitude,
            e.nativeEvent.coordinate.longitude,
          ]);
        }}
        style={styles.map}
      >
        <Marker
          coordinate={{ latitude: coords[0], longitude: coords[1] }}
          draggable
          onDrag={(e) =>
            setCoords([
              e.nativeEvent.coordinate.latitude,
              e.nativeEvent.coordinate.longitude,
            ])
          }
          image={require("../assets/images/favicon.png")}
        />
      </MapView>
      <Text>{coords.toString()}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
});
