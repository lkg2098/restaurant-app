import { Text, View, Button, Image, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import LinkSettingsItem from "@/components/settingsComponents/LinkSettingsItem";
import { useThemeColor } from "@/hooks/useThemeColor";
import axiosAuth from "@/api/auth";
import React, { useEffect, useState } from "react";

export default function Account() {
  const [userData, setUserData] = useState({ username: "" });

  const getUserData = async () => {
    try {
      let response = await axiosAuth.get("http://localhost:3000/users/account");
      return response.data.user;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    getUserData()
      .then((value) => {
        console.log(value);
        setUserData({ username: value.username });
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <ThemedView
      style={{
        flex: 1,
        alignItems: "center",
        paddingTop: 15,
        paddingHorizontal: 20,
        paddingBottom: 100,
      }}
    >
      <Image
        source={require("@/assets/images/dining out.jpeg")}
        style={styles.groupImage}
      />
      <Pressable>
        <ThemedText interactive type="defaultSemiBold" style={styles.editPhoto}>
          Change profile photo
        </ThemedText>
      </Pressable>
      <ThemedText
        type="defaultSemiBold"
        style={{ textAlign: "left", alignSelf: "stretch" }}
      >
        Account Info
      </ThemedText>
      <LinkSettingsItem title="Username" href="" content={userData.username} />
      <LinkSettingsItem title="Password" href="" content="Update password" />
      <View
        style={{
          borderColor: useThemeColor({}, "tint"),
          opacity: 0.3,
          alignSelf: "stretch",
          borderBottomWidth: 1,
          marginVertical: 10,
        }}
      ></View>
      <ThemedText
        type="defaultSemiBold"
        style={{ textAlign: "left", alignSelf: "stretch", marginTop: 10 }}
      >
        Personal Settings
      </ThemedText>
      <LinkSettingsItem
        title="Diet"
        href=""
        content="No dietary restrictions..."
      />
      <View
        style={{
          borderColor: useThemeColor({}, "tint"),
          opacity: 0.3,
          alignSelf: "stretch",
          borderBottomWidth: 1,
          marginVertical: 10,
        }}
      ></View>
      <ThemedText
        type="defaultSemiBold"
        style={{ textAlign: "left", alignSelf: "stretch", marginTop: 10 }}
      >
        Support
      </ThemedText>
      <LinkSettingsItem title="Bug Report" href="" content="Got an issue?" />
      <LinkSettingsItem
        title="Suggestions"
        href=""
        content="Send us a message..."
      />
      <Link href="../login" asChild>
        <Pressable style={styles.signout}>
          <ThemedText interactive type="defaultSemiBold">
            Sign Out
          </ThemedText>
        </Pressable>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  groupImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  editPhoto: {
    padding: 12,
    marginBottom: 10,
  },
  signout: {
    paddingVertical: 15,
  },
});
