import { Text, View, Button, StyleSheet, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";
import GetLocation from "@/components/getLocation";
import MapView from "react-native-maps";
import { ThemedView } from "@/components/ThemedView";

export default function SelectLocation() {
  const router = useRouter();
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable onPress={() => router.navigate("../createSession")}>
        <Text>Back</Text>
      </Pressable>

      {/* <GetLocation /> */}
    </ThemedView>
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
    width: "80%",
    height: "10%",
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
});
