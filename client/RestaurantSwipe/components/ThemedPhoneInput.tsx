import {
  TextInput,
  type TextInputProps,
  StyleSheet,
  Text,
  Image,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import PhoneInput, {
  ReactNativePhoneInputProps,
} from "react-native-phone-input";
import { useEffect, useRef, useState } from "react";
import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export type ThemedTextProps = ReactNativePhoneInputProps & {
  lightColor?: string;
  darkColor?: string;
  handleChangeValue: Function;
  initialPlaceholder: boolean;
};

export function ThemedPhoneInput({
  style,
  lightColor,
  darkColor,
  handleChangeValue,
  initialPlaceholder,
  ...rest
}: ThemedTextProps) {
  const subduedColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "subduedText"
  );
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  const [error, setError] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(initialPlaceholder);
  const [iso, setISO] = useState("");
  let phone = useRef<PhoneInput<typeof TextInput>>(null).current;

  const validateNumber = () => {
    if (!phone?.isValidNumber()) {
      setError(true);
    }
  };

  const handleChange = (value: string, iso2: string) => {
    if (iso2 && iso2 != iso) setISO(iso2.toUpperCase());
    console.log(value.substring(iso2.length));
    if (value != "+" && showPlaceholder) {
      setShowPlaceholder(false);
    } else if (value == "+") {
      setShowPlaceholder(true);
    }
    handleChangeValue(value, phone?.isValidNumber());
  };
  const handleCountrySelect = (iso2: string) => {
    if (iso != iso2) setISO(iso2.toUpperCase());
    if (showPlaceholder) setShowPlaceholder(false);
  };

  const handleFlag = () => {
    return (
      <ThemedText interactive type="defaultSemiBold">
        {iso || "US"}
      </ThemedText>
    );
  };
  return (
    <ThemedView
      style={{
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <PhoneInput
        textProps={{
          placeholderTextColor: subduedColor,
          onBlur: validateNumber,
          onFocus: (e) => setError(false),
        }}
        autoFormat
        initialCountry="us"
        onSelectCountry={(iso) => handleCountrySelect(iso)}
        onChangePhoneNumber={(value, iso) => handleChange(value, iso)}
        renderFlag={({ imageSource }) => handleFlag()}
        ref={(ref) => (phone = ref)}
        textStyle={[styles.text, { color: useThemeColor({}, "text") }]}
        style={[
          {
            zIndex: 1,
            backgroundColor: error
              ? "rgba(255,0,0,0.1)"
              : "rgba(255,255,255,0)",
            borderColor: error ? "#d10000" : "#d0d0d0",
          },
          styles.textInput,
          style,
        ]}
        {...rest}
      />
      {showPlaceholder && (
        <ThemedText
          subdued
          style={{
            position: "absolute",
            padding: 12,
            paddingLeft: 12,
            marginLeft: 38,
            lineHeight: 20,
            zIndex: 0,
          }}
        >
          <ThemedText style={{ opacity: 0 }}>+1 </ThemedText>Phone Number
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    width: "100%",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
  },
});
