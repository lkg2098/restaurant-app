import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: {
          height: "12%",
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
        headerShadowVisible: false,
        tabBarShowLabel: false,
        headerTintColor: Colors[colorScheme ?? "light"].text,
        headerTitleStyle: { fontWeight: "600" },
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
      }}
      screenListeners={{
        tabPress: (e) => {
          const tabName = e.target?.split("-")[0];

          if (tabName == "newSession") {
            e.preventDefault();
            router.push("../createSession");
          }
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Upcoming Meals",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "people" : "people-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "location" : "location-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="newSession"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <LinearGradient
              locations={[0.4, 1]}
              colors={["#E91F0C", "#F5C341"]}
              style={{ padding: "11%", borderRadius: 33 }}
            >
              <Ionicons name="add-outline" size={32} color="white" />
            </LinearGradient>
          ),
        }}
      />
      <Tabs.Screen
        name="pastSessions"
        options={{
          title: "Past Meals",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "time" : "time-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
