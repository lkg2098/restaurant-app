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
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import RatingSettingsItem from "@/components/settingsComponents/RatingSettingsItem";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import SessionSettings from "@/components/SessionSettings";
import { DietaryRestriction, Meal } from "@/types/Meal";
import GradientButton from "@/components/GradientButton";

export default function CreateSession() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [sessionData, setSessionData] = useState<Meal>({
    name: "",
    date: new Date(),
    budget: [10, 50],
    distance: 5,
    rating: 3,
    location: [],
    diets: [] as DietaryRestriction[],
  });

  const handleSubmit = async () => {
    // console.log(JSON.stringify(sessionData));
    try {
      if (!sessionData.location.length) {
        console.log("here");
        let location = await Location.getCurrentPositionAsync({});
        sessionData.location = [
          location.coords.latitude,
          location.coords.longitude,
        ];
      }
      // console.log(sessionData);
      let response = await axiosAuth.post(
        "http://localhost:3000/sessions/new",
        {
          session_name: sessionData.name,
          session_photo: "",
          scheduled_at: sessionData.date.toISOString(),
          address: "",
          location_lat: sessionData.location[0],
          location_long: sessionData.location[1],
          radius: sessionData.distance,
          budget_min: sessionData.budget[0],
          budget_max: sessionData.budget[1],
          rating: sessionData.rating,
        }
      );
      if (response.status == 200) {
        router.push({
          pathname: "../createSession/addUsers",
          params: { sessionId: response.data.sessionId },
        });
      } else {
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSessionData = (data: Meal) => {
    setSessionData(data);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }
    })();
  }, []);

  return (
    <ThemedView
      lightColor="#FFFFFF"
      darkColor="#1A1723"
      style={{
        flex: 1,
        alignItems: "stretch",
      }}
    >
      <SessionSettings
        data={sessionData}
        handleSessionData={handleSessionData}
      />
      <GradientButton
        handlePress={handleSubmit}
        buttonText="Create Meal"
        style={{
          position: "absolute",

          width: 350,

          top: "88%",
        }}
      />
    </ThemedView>
  );
}
