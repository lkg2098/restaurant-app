import { useThemeColor } from "@/hooks/useThemeColor";
import Restaurant from "@/utils/restaurant";
import RestaurantList, { RestaurantNode } from "@/utils/restaurantList";
import { transform } from "@babel/core";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import StarRating from "react-native-star-rating-widget";
import RestaurantCard from "./RestaurantCard";
import { ThemedText } from "./ThemedText";

export default function SwipeCard({
  topCard,
  dataMap,
  next,
  handleSwipe,
  totalCards,
}: {
  topCard?: { id: string; score: number };
  dataMap: { [key: string]: Restaurant };
  next?: RestaurantNode;
  handleSwipe: Function;
  totalCards: number;
}) {
  const { width, height } = Dimensions.get("screen");
  const backgroundColor = useThemeColor({}, "background");
  const backCardColor = useColorScheme() == "dark" ? "black" : "#a6a6a6";
  const tintColor = useThemeColor({}, "tint");

  const swipe = useRef(new Animated.ValueXY()).current;
  const sticky = useRef(new Animated.ValueXY()).current;

  const [swiped, setSwiped] = useState(0 | 1 | 2);
  const [topCardData, setTopCardData] = useState<Restaurant | null>();
  const [nextCardData, setNextCardData] = useState<Restaurant | null>();

  useEffect(() => {
    if (topCard) {
      console.log(topCard);
      if (dataMap[topCard.id]) {
        console.log(dataMap[topCard.id]);
        setTopCardData(dataMap[topCard.id]);
      } else {
        setTopCardData(null);
      }
    } else {
      setTopCardData(null);
    }
  }, [topCard, dataMap]);

  useEffect(() => {
    if (next?.value) {
      if (dataMap[next.value.id]) {
        console.log(dataMap[next.value.id]);
        setNextCardData(dataMap[next.value.id]);
      } else {
        setNextCardData(null);
      }
    } else {
      setNextCardData(null);
    }
  }, [next, dataMap]);
  const rotate = swipe.x.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: ["-8deg", "0deg", "8deg"],
  });

  const stickyRotate = sticky.x.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: ["-8deg", "0deg", "8deg"],
  });

  const opacity = swipe.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [0, 1.0, 0],
  });

  const scale = swipe.x.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [1, 0.93, 1],
    extrapolate: "clamp",
  });

  const rise = swipe.x.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [-35, 0, -35],
    extrapolate: "clamp",
  });

  const removeTopCard = useCallback(
    (yes: boolean) => {
      console.log(topCard);
      if (yes) {
        setSwiped(1);
      } else {
        setSwiped(2);
      }
      swipe.setValue({ x: 0, y: 0 });
    },
    [swipe]
  );

  const buttonYes = () => {
    Animated.timing(swipe, {
      duration: 350,
      toValue: { x: width + 200, y: 100 },
      useNativeDriver: true,
    }).start(() => removeTopCard(true));
  };

  const buttonNo = () => {
    Animated.timing(swipe, {
      duration: 300,
      toValue: { x: -1 * (width + 200), y: 100 },
      useNativeDriver: true,
    }).start(() => removeTopCard(false));
  };

  useEffect(() => {
    if (swiped == 1) {
      if (topCard) handleSwipe(true, topCard.id, topCard.score);
      setSwiped(0);
    } else if (swiped == 2) {
      if (topCard) handleSwipe(false, topCard.id, topCard.score);
      setSwiped(0);
    }
  }, [swiped]);

  const panresponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        //return true if user is swiping, return false if it's a single click
        return !(gestureState.dx === 0 && gestureState.dy === 0);
      },
      onPanResponderMove: (_, { dx, dy, y0 }) => {
        swipe.setValue({ x: dx, y: dy });
        sticky.setValue({ x: dx, y: dy });
      },
      onPanResponderRelease: (_, { dx, dy }) => {
        const direction = Math.sign(dx);
        const swipedPastThreshhold = Math.abs(dx) > 100;
        if (swipedPastThreshhold) {
          Animated.timing(swipe, {
            duration: 200,
            toValue: { x: direction * (width + 200), y: dy },
            useNativeDriver: true,
          }).start(() => removeTopCard(direction == 1));
          return;
        }
        Animated.spring(swipe, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          friction: 5,
        }).start();
      },
    })
  ).current;

  const frontCardMarkup =
    // (topCard && totalCards > 0) ||
    topCardData ? (
      <Animated.View
        style={{
          ...styles.card,
          backgroundColor: backgroundColor,
          zIndex: 3,
          transform: [...swipe.getTranslateTransform(), { rotate }],
        }}
        {...panresponder.panHandlers}
      >
        <RestaurantCard data={topCardData} />
        {/* <ThemedText style={{ color: "black" }}>{topCard.id}</ThemedText>
        <ThemedText style={{ color: "black" }}>
          cards left: {totalCards}
        </ThemedText> */}
      </Animated.View>
    ) : (
      <View
        style={{
          ...styles.card,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: backgroundColor,
          padding: 20,
        }}
      >
        <ThemedText type="title">You're out of options!</ThemedText>
        <ThemedText
          type="subtitle"
          style={{ textAlign: "center", paddingVertical: 30 }}
        >
          You've voted on all the available restaurants! Now you just need to
          wait for your guests to cast their votes
        </ThemedText>
        <Pressable
          onPress={() => {}}
          style={[styles.button, { backgroundColor: tintColor }]}
        >
          <ThemedText type="defaultSemiBold">Remind Other Guests</ThemedText>
        </Pressable>
      </View>
    );
  const backCardMarkup = totalCards > 0 && (
    <Animated.View
      style={{
        ...styles.backCard,
        zIndex: 2,
        transform: [{ translateY: rise }, { scale }],
      }}
      {...panresponder.panHandlers}
    >
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 2,
          backgroundColor: backCardColor,
          opacity: opacity,
        }}
        {...panresponder.panHandlers}
      ></Animated.View>
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: backgroundColor,
        }}
      >
        {next ? (
          <>
            <RestaurantCard data={nextCardData} />
          </>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ThemedText>You're out of options!</ThemedText>
          </View>
        )}
      </View>
    </Animated.View>
  );

  const thirdCard = totalCards >= 2 && (
    <View
      style={{
        ...styles.backCard,
        transform: [{ scale: 0.93 }],
        backgroundColor: backCardColor,
        zIndex: 1,
      }}
    ></View>
  );
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <View style={styles.stack}>
        {frontCardMarkup}
        {backCardMarkup}
        {thirdCard}
      </View>
      {topCard && (
        <View style={styles.buttonGroup}>
          <Pressable
            onPress={() => buttonNo()}
            style={{
              ...styles.circleButton,
              backgroundColor: tintColor,
            }}
          >
            <Ionicons name="close" size={40} color="white" />
          </Pressable>
          <Pressable
            onPress={() => buttonYes()}
            style={{ ...styles.circleButton, backgroundColor: "#039F85" }}
          >
            <MaterialCommunityIcons
              name="silverware-fork-knife"
              size={40}
              color="white"
            />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    height: "85%",
    width: "85%",
    marginTop: "5%",
    alignItems: "center",
    position: "relative",
  },
  card: {
    position: "absolute",
    overflow: "hidden",
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  backCard: {
    position: "absolute",
    overflow: "hidden",
    width: "100%",
    height: "100%",
    borderRadius: 10,
    top: 35,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    margin: 10,
  },
  buttonGroup: {
    paddingVertical: 35,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "55%",
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
