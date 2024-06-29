import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps } from "react-native";
import { ThemedText } from "./ThemedText";
import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export type VerifyCodeInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  code: string;
  onVerified: Function;
};

export default function VerifyCodeInput({
  style,
  lightColor,
  darkColor,
  code,
  onVerified,
  ...rest
}: VerifyCodeInputProps) {
  const router = useRouter();
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  const tintColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "tint"
  );

  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [verified, setVerified] = useState<boolean>();

  let cellsMarkup = code.split("").map((char, index) => (
    <View
      style={[
        styles.cell,
        {
          borderColor:
            verified || (focused && inputValue.length == index)
              ? useThemeColor({}, "tint")
              : useThemeColor({}, "subduedText"),
        },
      ]}
      key={char}
    >
      <Text style={styles.cellText}>
        {inputValue.length > index && inputValue[index]}
      </Text>
    </View>
  ));

  const handleInput = (value: string) => {
    let numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue.length == code.length) {
      setVerified(numericValue == code);
    }
    setInputValue(numericValue);
  };

  useEffect(() => {
    if (verified) {
      const timeout = setTimeout(() => {
        onVerified();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [verified]);

  useFocusEffect(
    useCallback(() => {
      setVerified(false);
      setFocused(false);
      setInputValue("");
    }, [])
  );
  const handleFocus = () => {
    setFocused(true);
  };
  const handleBlur = () => {
    setFocused(false);
  };

  const confirmationText = verified;
  return (
    <View style={styles.paddingContainer}>
      <View style={styles.container}>
        {cellsMarkup}
        <TextInput
          value={inputValue}
          maxLength={code.length}
          keyboardType="number-pad"
          editable={!verified}
          onChangeText={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[styles.textInput, { width: code.length * 45 }]}
          {...rest}
        />
      </View>
      {verified && (
        <ThemedText style={{ paddingTop: 10 }} interactive>
          <Ionicons name="checkmark" color={tintColor} />
          Delicious!
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    borderWidth: 1,
    width: 40,
    height: 50,
    marginHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
  },
  cellText: {
    lineHeight: 50,
    fontSize: 32,
  },
  textInput: {
    position: "absolute",
    height: 50,
    opacity: 0,
  },
  container: {
    flexDirection: "row",
    position: "relative",
    justifyContent: "center",
  },
  paddingContainer: {
    padding: 20,
    alignItems: "center",
  },
});
