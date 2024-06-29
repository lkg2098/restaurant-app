import {
  Text,
  View,
  Button,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  ImageBackground,
  Animated,
  ScrollView,
} from "react-native";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import axiosAuth from "@/api/auth";
import axios, { AxiosError } from "axios";
import * as SecureStorage from "expo-secure-store";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import DividerText from "@/components/DividerText";
import GradientButton from "@/components/GradientButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { PasswordInput } from "@/components/PasswordInput";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });

  useFocusEffect(
    useCallback(() => {
      setLoginInfo({
        username: "",
        password: "",
      });
      setError("");
      return () => {};
    }, [])
  );
  const fade = useRef(new Animated.Value(1)).current;

  const slideOut = () => {
    Animated.timing(fade, {
      toValue: 0,
      duration: 175,
      useNativeDriver: true,
    }).start(() => {
      router.replace("./signup");
      fade.setValue(1);
    });
  };

  const handleInput = (key: keyof typeof loginInfo, value: string) => {
    setLoginInfo(() => ({ ...loginInfo, [key]: value }));
  };

  const handleLogin = async () => {
    try {
      let response = await axiosAuth.post(
        "http://localhost:3000/login",
        loginInfo
      );
      if (response.status == 200) {
        console.log(response.data);
        router.push("(tabs)");
      } else {
        console.log(response);
      }
    } catch (err: any) {
      console.log(err.response.data);
      if (err.response.status == 401) {
        setError(err.response.data.error);
      }
    }
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fade,
      }}
    >
      <ScrollView
        keyboardDismissMode="interactive"
        contentContainerStyle={{ flex: 1 }}
      >
        <ImageBackground
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          source={require("../assets/images/Crave background.png")}
          resizeMode="cover"
        >
          <ThemedText
            interactive
            style={{
              fontFamily: "Playwrite",
              fontSize: 45,
              fontWeight: 500,
              lineHeight: 70,
            }}
          >
            Tastebuds
          </ThemedText>

          <ThemedText interactive>{error}</ThemedText>
          <ThemedTextInput
            style={styles.textInput}
            value={loginInfo.username}
            placeholder="Username"
            placeholderTextColor={useThemeColor({}, "subduedText")}
            onChangeText={(value) => handleInput("username", value)}
          />
          <PasswordInput
            style={styles.textInput}
            value={loginInfo.password}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor={useThemeColor({}, "subduedText")}
            onChangeText={(value) => handleInput("password", value)}
          />

          <GradientButton
            handlePress={handleLogin}
            buttonText="Login"
            style={{ width: "75%", margin: 10 }}
          />
          <ThemedText interactive type="defaultSemiBold">
            Forgot Password?
          </ThemedText>
          <DividerText text="or" subdued dividerLength={"30%"} />

          <Pressable
            onPress={() => {
              slideOut();
            }}
          >
            <ThemedText type="defaultBold" interactive>
              Create an account
            </ThemedText>
          </Pressable>
          <Link href="(tabs)" asChild>
            <Pressable style={{ margin: 20 }}>
              <ThemedText style={styles.bypassButton}>Bypass</ThemedText>
            </Pressable>
          </Link>
        </ImageBackground>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  welcome: {
    padding: 15,
  },
  bypassButton: {
    fontSize: 18,
    fontWeight: "600",
  },
  textInput: { width: "70%", margin: 5 },
});
