import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { WebView } from "react-native-webview";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";

export default function RestaurantWebView() {
  const { title, url } = useLocalSearchParams();
  const router = useRouter();
  const tintColor = useThemeColor({}, "tint");
  const subduedColor = useThemeColor({}, "subduedText");

  const [browserData, setBrowserData] = useState({
    canGoForward: false,
    canGoBack: false,
    loading: false,
  });

  let webBrowser = useRef<WebView>(null).current;

  const load = useRef(new Animated.Value(0)).current;

  const handleLoad = () => {
    Animated.timing(load, {
      toValue: 100,
      duration: 1000,
      easing: Easing.quad,
      useNativeDriver: true,
    }).start(() => load.setValue(0));
  };

  useEffect(() => {
    handleLoad();
  }, []);

  const handleBack = () => {
    if (browserData.canGoBack) {
      handleLoad();
      webBrowser?.goBack();
    }
  };

  const handleForward = () => {
    if (browserData.canGoForward) {
      handleLoad();
      webBrowser?.goForward();
    }
  };

  const handleDismiss = () => {
    router.dismiss(1);
  };

  if (url) {
    return (
      <>
        <View style={styles.header}>
          <View style={styles.buttonGroup}>
            <Pressable onPress={() => handleBack()}>
              <Ionicons
                name="chevron-back"
                color={browserData.canGoBack ? "black" : subduedColor}
                size={32}
              />
            </Pressable>
            <Pressable onPress={() => handleForward()}>
              <Ionicons
                name="chevron-forward"
                color={browserData.canGoForward ? "black" : subduedColor}
                size={32}
              />
            </Pressable>
          </View>
          <ThemedText
            type="defaultSemiBold"
            style={{ color: "black", marginLeft: -32 }}
          >
            {title || "Website"}
          </ThemedText>
          <Pressable onPress={() => handleDismiss()}>
            <Ionicons name="close" color="black" size={32} />
          </Pressable>
        </View>
        <Animated.View
          style={{
            width: "100%",
            height: 3,
            marginTop: -3,
            backgroundColor: tintColor,
            transform: [{ scaleX: load }],
            transformOrigin: "left",
          }}
        ></Animated.View>
        <WebView
          onLoad={(e) => {
            const { nativeEvent } = e;
            setBrowserData({
              canGoForward: nativeEvent.canGoForward,
              canGoBack: nativeEvent.canGoBack,
              loading: nativeEvent.loading,
            });
          }}
          ref={(ref) => {
            webBrowser = ref;
          }}
          style={styles.container}
          source={{ uri: url.toString() }}
          mediaPlaybackRequiresUserAction={true}
        />
      </>
    );
  } else
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">
          Oops! Looks like this url no longer exists!
        </ThemedText>
      </ThemedView>
    );
}

const styles = StyleSheet.create({
  container: {
    // borderRadius: 10,
  },
  header: {
    backgroundColor: "rgba(255,255,255,0.8)",
    alignSelf: "stretch",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "space-between",
    marginTop: "18%",
    padding: 10,
    flexDirection: "row",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  buttonGroup: {
    flexDirection: "row",
  },
});
