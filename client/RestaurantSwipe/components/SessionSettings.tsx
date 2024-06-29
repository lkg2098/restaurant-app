import {
  Text,
  View,
  Button,
  Modal,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import axiosAuth from "@/api/auth";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import DateSetting from "@/components/settingsComponents/DateSetting";
import DietarySettings from "@/components/settingsComponents/DietarySettings";
import LinkSettingsItem from "@/components/settingsComponents/LinkSettingsItem";
import SliderSettingsItem from "@/components/settingsComponents/SliderSettingsItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import RatingSettingsItem from "@/components/settingsComponents/RatingSettingsItem";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { DietaryRestriction, Meal } from "@/types/Meal";
import { ThemedTextInput } from "./ThemedTextInput";

export default function SessionSettings({
  data,
  handleSessionData,
}: {
  data?: Meal;
  handleSessionData: Function;
}) {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject>();

  const [scrollEnabled, setScrollEnabled] = useState(true);

  const handleScroll = (value: boolean) => {
    setScrollEnabled(value);
  };

  const handleName = (value: string) => {
    handleSessionData({ ...data, name: value });
  };

  const handleDate = (value: Date) => {
    handleSessionData({ ...data, date: value });
  };
  const handleDistance = (values: Array<number>) => {
    handleSessionData({ ...data, distance: values[0] });
  };

  const handleBudget = (value: Array<number>) => {
    handleSessionData({ ...data, budget: value });
  };

  const handleRating = (value: number) => {
    handleSessionData({ ...data, rating: value });
  };

  const handleDiet = (value: DietaryRestriction) => {
    const dietsCopy = data?.diets ? [...data.diets] : [];
    dietsCopy.push(value);
    handleSessionData({ ...data, diets: dietsCopy });
  };

  return (
    <ScrollView
      scrollEnabled={scrollEnabled}
      contentContainerStyle={styles.scrollBox}
    >
      {/* <Image
        source={require("@/assets/images/dining out.jpeg")}
        style={styles.groupImage}
      />
      <Pressable>
        <ThemedText interactive type="defaultSemiBold" style={styles.editPhoto}>
          Edit group photo
        </ThemedText>
      </Pressable> */}
      <ThemedTextInput
        style={styles.textInput}
        value={data?.name || ""}
        onChangeText={handleName}
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
      />
      {/* <DietarySettings /> */}
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
