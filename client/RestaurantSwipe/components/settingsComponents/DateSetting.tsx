import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ThemedText } from "../ThemedText";

export default function DateSetting({
  date,
  setDate,
}: {
  date: Date;
  setDate: Function;
}) {
  const color = useThemeColor({}, "interactive");
  const [pickerOpen, setPickerOpen] = useState(false);
  const handleOpenDatePicker = () => {};
  return (
    <>
      <View style={styles.item}>
        <View style={styles.content}>
          <ThemedText style={styles.title}>Date</ThemedText>
          <Pressable
            style={{ flexDirection: "row", gap: 7, alignItems: "center" }}
            onPress={() => setPickerOpen(true)}
          >
            <ThemedText
              type="defaultSemiBold"
              interactive
            >{`${date.toLocaleDateString("en-US", {
              dateStyle: "medium",
            })}, ${date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
            })}`}</ThemedText>
            <Ionicons name="calendar" size={16} color={color} />
          </Pressable>
        </View>
      </View>
      <DateTimePickerModal
        isVisible={pickerOpen}
        mode="datetime"
        onConfirm={(value) => {
          setPickerOpen(false);
          setDate(value);
        }}
        onCancel={() => setPickerOpen(false)}
      />
    </>
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
});
