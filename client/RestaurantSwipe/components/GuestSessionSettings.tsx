import { useThemeColor } from "@/hooks/useThemeColor";
import { Meal } from "@/types/Meal";
import React from "react";
import { Image, Pressable, ScrollView, StyleSheet } from "react-native";
import LinkSettingsItem from "./settingsComponents/LinkSettingsItem";
import StaticSettingsItem from "./settingsComponents/StaticSettingsItem";
import { ThemedText } from "./ThemedText";
import { ThemedTextInput } from "./ThemedTextInput";

export default function GuestSessionSettings({ data }: { data: Meal }) {
  return (
    <ScrollView
      // scrollEnabled={scrollEnabled}
      contentContainerStyle={styles.scrollBox}
    >
      <Image
        source={require("@/assets/images/dining out.jpeg")}
        style={styles.groupImage}
      />
      <Pressable>
        <ThemedText interactive type="defaultSemiBold" style={styles.editPhoto}>
          Edit group photo
        </ThemedText>
      </Pressable>
      <ThemedTextInput
        style={styles.textInput}
        value={data?.name || ""}
        //   onChangeText={handleName}
        placeholder="Group Name"
        placeholderTextColor={useThemeColor({}, "subduedText")}
      />

      {data && (
        <LinkSettingsItem
          href="../createSession/userList"
          title="Members"
          content="Lucas, Mal, Owen, Claudia..."
        />
      )}
      <StaticSettingsItem
        title="Location"
        content={data?.location.toString() || "Current Location..."}
      />
      {/* 
    <DateSetting date={data?.date || new Date()} setDate={handleDate} />
    <LinkSettingsItem
      href="../createSession/selectLocation"
      title="Location"
      content={data?.location.toString() || "Current Location..."}
    />
    <SliderSettingsItem
      title="Distance"
      content={`${data?.distance || 5}mi`}
      values={[data?.distance || 5]}
      handleValues={handleDistance}
      min={5}
      max={200}
      step={5}
      snapped={false}
      handleScroll={handleScroll}
    />
    <SliderSettingsItem
      title="Budget"
      values={data?.budget || [10, 50]}
      content={`$${data?.budget[0] || 10}-$${data?.budget[1] || 50}`}
      min={10}
      max={50}
      step={10}
      snapped={true}
      handleValues={handleBudget}
      handleScroll={handleScroll}
    />
    <RatingSettingsItem
      title="Minimum Rating"
      rating={data?.rating || 3.5}
      handleRating={handleRating}
      handleScroll={handleScroll}
    /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollBox: {
    alignItems: "center",
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  groupImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  editPhoto: {
    padding: 12,
  },
  textInput: {
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    width: 177,
    height: 40,
    marginBottom: 15,
    textAlign: "center",
  },
});
