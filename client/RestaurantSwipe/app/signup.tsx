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
import { Collapsible } from "@/components/Collapsible";

export default function Signup() {
  const router = useRouter();
  const { phoneNumber, username, password } = useLocalSearchParams();
  const [loginInfo, setLoginInfo] = useState({
    phoneNumber:
      (typeof phoneNumber != "string"
        ? phoneNumber?.toString()
        : phoneNumber) || "",
    username:
      (typeof username != "string" ? username?.toString() : username) || "",
    password:
      (typeof password != "string" ? password?.toString() : password) || "",
  });

  const backgroundColor = useThemeColor({}, "background");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [validPhone, setValidPhone] = useState(false);

  const handleInput = (key: keyof typeof loginInfo, value: string) => {
    console.log(`${key}: ${value}`);
    setLoginInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhoneInput = (value: string, isValid: boolean) => {
    console.log("phone is in here");
    setLoginInfo((prev) => ({ ...prev, phoneNumber: value }));
    setValidPhone(isValid);
  };

  const handleLogin = async () => {
    try {
      console.log(loginInfo);
      let validUsername = verifyUsername();
      // let response = await axios.post(
      //   "http://localhost:3000/signup",
      //   loginInfo
      // );
      console.log(validUsername);

      if (validUsername) {
        let uniqueUser = await axios.post(
          "http://localhost:3000/users/verifyUser",
          { loginInfo }
        );
        if (uniqueUser) {
          slideOut("verifyCode", uniqueUser.data.loginInfo);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log(phoneNumber);
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

  const verifyUsername = () => {
    let valid = false;
    if (typeof loginInfo.username == "string") {
      valid = Boolean(loginInfo.username.match("^[a-zA-Z0-9_]{3,}$"));
      if (!valid) {
        setErrors((prev) => ({
          ...prev,
          username:
            "Username may only contain numbers, letters, and underscores",
        }));
      }
    }
    return valid;
  };

  const handleFocus = (key: keyof typeof errors) => {
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
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
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThemedText type="subtitle" style={styles.welcome}>
          Satisfy all your
          <ThemedText
            type="subtitle"
            interactive
            style={{
              fontFamily: "Playwrite",
            }}
          >
            {" "}
            Tastebuds!
          </ThemedText>
        </ThemedText>
        <ThemedPhoneInput
          style={styles.textInput}
          initialValue={loginInfo.phoneNumber}
          handleChangeValue={handlePhoneInput}
          initialPlaceholder={phoneNumber == undefined}
        />
        <ThemedTextInput
          style={[
            styles.textInput,
            {
              backgroundColor: errors.username
                ? "rgba(255,0,0,0.1)"
                : backgroundColor,
              borderColor: errors.username ? "#d10000" : "#d0d0d0",
            },
          ]}
          placeholder="Username"
          value={loginInfo.username}
          helpText="Username must use only letters, numbers, and underscores"
          placeholderTextColor={useThemeColor({}, "subduedText")}
          onChangeText={(value) => handleInput("username", value)}
        />
        <PasswordInput
          style={styles.textInput}
          placeholder="Password"
          value={loginInfo.password}
          placeholderTextColor={useThemeColor({}, "subduedText")}
          onChangeText={(value) => handleInput("password", value)}
        />

        <GradientButton
          handlePress={handleLogin}
          buttonText="Signup"
          style={{ width: "75%", marginTop: 10 }}
        />
        <DividerText
          text="Already have an account?"
          subdued
          dividerLength={"10%"}
        />

        <Pressable onPress={() => slideOut("./login")}>
          <ThemedText type="defaultBold" interactive>
            Go to Login
          </ThemedText>
        </Pressable>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  welcome: {
    padding: 5,
  },
  bypassButton: {
    fontSize: 18,
    fontWeight: "600",
  },
  textInput: { width: "70%", margin: 5 },
  instructions: {
    width: "67%",
  },
});
