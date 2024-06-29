import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Button, Pressable, Text, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  // const [loaded] = useFonts({
  //   SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  // });

  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  // if (!loaded) {
  //   return null;
  // }
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerLeft: () => (
              <Pressable onPress={() => router.dismiss(1)}>
                <Ionicons
                  name="chevron-back"
                  color={Colors[colorScheme ?? "light"].text}
                  size={18}
                />
              </Pressable>
            ),
            headerStyle: {
              backgroundColor: Colors[colorScheme ?? "light"].background,
            },
            headerTintColor: Colors[colorScheme ?? "light"].text,
            headerTitleStyle: { fontWeight: "600" },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "New Meal",
              animation: "slide_from_bottom",
              headerLeft: () => (
                <Pressable onPress={() => router.dismiss(1)}>
                  <Ionicons
                    name="chevron-back"
                    color={Colors[colorScheme ?? "light"].text}
                    size={18}
                  />
                </Pressable>
              ),
              headerStyle: {
                backgroundColor: Colors[colorScheme ?? "light"].background,
              },
              headerTintColor: Colors[colorScheme ?? "light"].text,
              headerTitleStyle: { fontWeight: "600" },
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="selectLocation"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="addUsers" options={{ title: "Invite Guests" }} />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
