import { Text, View, Button } from "react-native";
import { Link } from "expo-router";
import ImagePickerExample from "@/components/ImagePickerExample";

export default function Explore() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/(tabs)/explore.tsx to edit screen.</Text>
      <ImagePickerExample />
      <Text>Single person session page</Text>
    </View>
  );
}
