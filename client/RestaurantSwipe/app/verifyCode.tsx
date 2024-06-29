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
import { axiosLogin } from "@/api/auth";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import GradientButton from "@/components/GradientButton";
import DividerText from "@/components/DividerText";
import { PasswordInput } from "@/components/PasswordInput";
import PhoneInput from "react-native-phone-input";
import { ThemedPhoneInput } from "@/components/ThemedPhoneInput";
import VerifyCodeInput from "@/components/VerifyCodeInput";

export default function VerifyCode() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleLogin = async () => {
    try {
      let response = await axios.post("http://localhost:3000/signup", params);
      if (response.status == 200) {
        slideOut("profileInfo");
      } else {
        console.log("something went wrong!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("hello");
      console.log(params);
    }, [])
  );

  const fade = useRef(new Animated.Value(1)).current;

  const slideOut = (url: string, params?: any) => {
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
        <ThemedText type="title">Validate Your Phone Number</ThemedText>
        <VerifyCodeInput code="2345" onVerified={handleLogin} />
        <ThemedText type="subtitle" style={styles.flavorText}>
          Don't see a code?
        </ThemedText>
        <Pressable onPress={() => {}}>
          <ThemedText type="defaultBold" interactive>
            Resend Code
          </ThemedText>
        </Pressable>

        <DividerText subdued text="or" dividerLength={"10%"} />
        <Pressable
          onPress={() => {
            slideOut("./signup", params);
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
