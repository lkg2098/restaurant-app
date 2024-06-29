import { ThemedView } from "@/components/ThemedView";
import React, { useCallback, useState } from "react";
import SessionSettings from "@/components/SessionSettings";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import axiosAuth from "@/api/auth";
import { Meal } from "@/types/Meal";
import GuestSessionSettings from "@/components/GuestSessionSettings";
import { Pressable } from "react-native";

export default function Settings() {
  const { sessionId } = useLocalSearchParams();
  const [sessionData, setSessionData] = useState<Meal>();
  const [role, setRole] = useState<string>();
  const loading = sessionData == undefined;
  const getSettings = async () => {
    try {
      let response = await axiosAuth.get(
        `http://localhost:3000/sessions/${sessionId}`
      );

      if (response.data) {
        console.log(response.data);
        return response.data;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  const handleClearRestaurants = async () => {
    try {
      await axiosAuth.delete(
        `http://localhost:3000/sessions/${sessionId}/restaurants`
      );
    } catch (err) {
      console.log(err);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getSettings()
        .then((value) => {
          console.log(value.session);
          setRole(value.userRole);
          setSessionData({
            name: "Test Title",
            date: new Date(value.session.created_at),
            budget: [10, 50],
            distance: 100,
            rating: 3.5,
            location: [value.session.location_lat, value.session.location_long],
            diets: ["Dairy Free", "Gluten Free"],
          });
        })
        .catch((err) => {
          console.log(err);
        });
      return () => {
        setSessionData(undefined);
      };
    }, [])
  );
  return (
    <ThemedView
      lightColor="#FFFFFF"
      darkColor="#1A1723"
      style={{
        flex: 1,
        alignItems: "stretch",
      }}
    >
      <Pressable onPress={() => handleClearRestaurants()}>
        <ThemedText interactive type="defaultMedium">
          Clear session restaurants
        </ThemedText>
      </Pressable>
      {loading ? (
        <Ionicons name="airplane" />
      ) : role == "admin" ? (
        <SessionSettings data={sessionData} handleSessionData={() => {}} />
      ) : (
        <GuestSessionSettings data={sessionData} />
      )}
    </ThemedView>
  );
}
