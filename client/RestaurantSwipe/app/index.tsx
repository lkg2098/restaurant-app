import { Redirect, useFocusEffect } from "expo-router";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import axiosAuth from "@/api/auth";
import { Image, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";

export default function Index() {
  const router = useRouter();

  const isLoggedIn = async () => {
    try {
      console.log("AAAA");
      const response = await axiosAuth.get("http://localhost:3000/");
      console.log(response.data);
      return response.status == 200;
    } catch (err) {
      console.log("it is false");
      console.log(err);
      return false;
    }
  };

  useFocusEffect(
    useCallback(() => {
      isLoggedIn()
        .then((loggedIn) => {
          if (loggedIn) {
            router.navigate("(tabs)");
          } else {
            console.log("or here?");
            router.navigate("login");
          }
        })
        .catch((err) => {
          console.log(err);
          console.log("here?");
          router.navigate("login");
        });
    }, [])
  );

  // return <Redirect href={"(tabs)"} />;
  return <></>;
}
