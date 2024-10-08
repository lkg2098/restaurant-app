import {
  Text,
  View,
  Button,
  TextInput,
  ImageBackground,
  Pressable,
  StyleSheet,
  Animated,
  ScrollView,
} from "react-native";
import {
  Link,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import axiosAuth from "@/api/auth";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import GradientButton from "@/components/GradientButton";
import DividerText from "@/components/DividerText";
import { PasswordInput } from "@/components/userInfoComponents/PasswordInput";
import PhoneInput from "react-native-phone-input";
import { ThemedPhoneInput } from "@/components/ThemedPhoneInput";
import VerifyCodeInput from "@/components/VerifyCodeInput";

export default function VerifyCode() {
  const router = useRouter();
  const { phone_number, username, password } = useLocalSearchParams<{
    phone_number: string;
    username: string;
    password: string;
  }>();
  const [message, setMessage] = useState("");

  const handleLogin = async (code: string) => {
    console.log(username, password, phone_number);
    try {
      let response = await axiosAuth.post("/signup", {
        username,
        password,
        phone_number,
        code,
      });
      if (response.status == 200) {
        return response.data.userId;
      } else {
        console.log("something went wrong!");
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const handleSendCode = async () => {
    try {
      let response = await axiosAuth.get("/verifyPhone", {
        params: { phone_number },
      });
      if (response.data) {
        console.log(response.data.message);
      }
    } catch (err) {
      console.log("Could not send code");
      router.back();
    }
  };

  useEffect(() => {
    console.log("hello");
    console.log(username, password, phone_number);
  }, [username, password, phone_number]);

  const fade = useRef(new Animated.Value(1)).current;

  const slideOut = (url: "./signup" | "./profileInfo", params?: any) => {
    Animated.timing(fade, {
      toValue: 0,
      duration: 175,
      useNativeDriver: true,
    }).start(() => {
      router.replace({ pathname: url, params: params });
      fade.setValue(1);
    });
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
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable onPress={() => router.back()}>
          <ThemedText>Back</ThemedText>
        </Pressable>
        <ThemedText type="title">Validate Your Phone Number</ThemedText>
        <VerifyCodeInput
          handleNav={(user_id: string) =>
            slideOut("./profileInfo", { userId: user_id })
          }
          sendCode={handleSendCode}
          submitCode={handleLogin}
        />

        <DividerText subdued text="or" dividerLength={"10%"} />
        <Pressable
          onPress={() => {
            slideOut("./signup", { username, password, phone_number });
          }}
        >
          <ThemedText type="defaultBold" interactive>
            Change Phone Number
          </ThemedText>
        </Pressable>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flavorText: {
    paddingBottom: 10,
  },
});
