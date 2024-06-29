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
import { Link, useFocusEffect, useRouter } from "expo-router";
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

export default function ProfileInfo() {
  const router = useRouter();
  const [name, setName] = useState("");
  const handleLogin = async () => {
    try {
      // let response = await axios.post(
      //   "http://localhost:3000/signup",
      //   loginInfo
      // );
    } catch (err) {
      console.log(err);
    }
  };

  const handleName = (value: string) => {
    setName(value);
  };

  return (
    <ScrollView
      keyboardDismissMode="interactive"
      scrollEnabled={false}
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText type="title" style={{ padding: 20 }}>
        One Last Thing...
      </ThemedText>
      <ThemedText style={styles.flavorText} type="subtitle">
        Tell us your name,
      </ThemedText>
      <ThemedText style={styles.flavorText} type="subtitle">
        so your{" "}
        <ThemedText interactive style={{ fontFamily: "Playwrite" }}>
          buds
        </ThemedText>{" "}
        can recognize you!
      </ThemedText>
      <ThemedTextInput
        style={styles.textInput}
        placeholder="Full Name"
        onChangeText={(value) => handleName(value)}
        value={name}
      />
      <GradientButton
        buttonText="Let's Go!"
        style={styles.button}
        handlePress={() => router.replace("(tabs)")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flavorText: { textAlign: "center" },
  textInput: {
    marginVertical: 20,
    width: "50%",
    textAlign: "center",
  },
  button: {
    width: "30%",
  },
});
