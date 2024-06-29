import {
  Text,
  View,
  Button,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  Link,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Restaurant from "@/utils/restaurant";
import RestaurantList, { RestaurantNode } from "@/utils/restaurantList";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColor } from "@/hooks/useThemeColor";
import SwipeCard from "@/components/SwipeCard";
import { Ionicons } from "@expo/vector-icons";
import socket from "@/utils/socket";
import axiosAuth from "@/api/auth";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type SessionRestaurant = { [key: string]: Restaurant };

socket.connect();
export default function Session() {
  const { session } = useLocalSearchParams();
  const router = useRouter();
  const [sessionRestaurants, setSessionRestaurants] =
    useState<SessionRestaurant>({});
  const restaurantsRef = useRef(sessionRestaurants);
  const [liked, setLiked] = useState<RestaurantList>(new RestaurantList(null));
  const likedRef = useRef(liked);
  const [disliked, setDisliked] = useState<RestaurantList>(
    new RestaurantList(null)
  );
  const dislikedRef = useRef(disliked);
  const [unseen, setUnseen] = useState<RestaurantList>(
    new RestaurantList(null)
  );
  const unseenRef = useRef(unseen);
  const [googleData, setGoogleData] = useState();

  const loading = liked == null || disliked == null || unseen == null;

  const [topCard, setTopCard] = useState<{ id: string; score: number }>();
  const topCardRef = useRef(topCard);
  const [cardNext, setCardNext] = useState<RestaurantNode>();
  const cardNextRef = useRef(cardNext);

  const tintColor = useThemeColor({}, "tint");

  const memberCount = 3;

  useFocusEffect(
    useCallback(() => {
      socket.emit("joinSession", session);
      return () => {
        socket.emit("leaveSession", session);
      };
    }, [])
  );

  const getSessionRestaurants = async () => {
    try {
      let response = await axiosAuth.get(
        `http://localhost:3000/sessions/${session}/restaurants`
      );
      if (response.data) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const getGoogleData = async () => {
    try {
      let response = await axiosAuth.get(
        `http://localhost:3000/restaurants/test`
      );
      if (response.status == 200) {
        return response.data;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  useEffect(() => {
    const restaurantMap = {} as SessionRestaurant;

    let liked = new RestaurantList(null);
    let disliked = new RestaurantList(null);
    let unseen = new RestaurantList(null);
    getGoogleData()
      .then((googleData) => {
        setGoogleData(googleData.results);

        getSessionRestaurants()
          .then((value) => {
            for (let res of value.seenByUser) {
              restaurantMap[res.place_id] = new Restaurant(
                res.place_id,
                null,
                res.approved == 1,
                true
              );
            }

            for (let res of value.sessionRestaurants) {
              if (!restaurantMap[res.place_id]) {
                restaurantMap[res.place_id] = new Restaurant(
                  res.place_id,
                  res.score,
                  res.dislikes != 0,
                  false
                );

                if (res.dislikes) {
                  disliked.append({ id: res.place_id, score: res.score });
                } else {
                  liked.append({ id: res.place_id, score: res.score });
                }
              } else {
                restaurantMap[res.place_id].score = res.score;
                restaurantMap[res.place_id].disliked = res.dislikes == 0;
              }
            }

            for (let res of googleData.results) {
              if (restaurantMap[res.id]) {
                restaurantMap[res.id].rating = res.rating;
                restaurantMap[res.id].location = res.location;
                restaurantMap[res.id].name = res.name;
                restaurantMap[res.id].address = res.address;
                restaurantMap[res.id].priceLevel = res.priceLevel;
                restaurantMap[res.id].rating_count = res.rating_count;
                restaurantMap[res.id].hours = res.hours;
                restaurantMap[res.id].photos = res.photos;
                restaurantMap[res.id].types = res.types;
                restaurantMap[res.id].accessibilityOptions =
                  res.accessibilityOptions;
                restaurantMap[res.id].website = res.website;
              } else {
                let score = Math.pow(2, memberCount);
                restaurantMap[res.id] = new Restaurant(
                  res.id,
                  score,
                  false,
                  false,
                  res.name,
                  res.address,
                  res.location,
                  res.rating,
                  res.priceLevel,
                  res.rating_count,
                  res.hours,
                  res.photos,
                  res.types,
                  res.accessibilityOptions,
                  res.website
                );
                unseen.append({ id: res.id, score: score });
              }
            }

            if (liked.head) {
              setTopCard(liked.head.value);
              liked.pop();
              if (liked.head) {
                setCardNext(liked.head);
              } else if (unseen.head) {
                setCardNext(unseen.head);
              } else if (disliked.head) {
                setCardNext(disliked.head);
              }
            } else if (unseen.head) {
              setTopCard(unseen.head.value);
              unseen.pop();
              if (unseen.head) {
                setCardNext(unseen.head);
              } else if (disliked.head) {
                setCardNext(disliked.head);
              }
            } else if (disliked.head) {
              setTopCard(disliked.head.value);
              disliked.pop();
              if (disliked.head) {
                setCardNext(disliked.head);
              }
            }

            setSessionRestaurants(restaurantMap);
            setLiked(liked);
            setUnseen(unseen);
            setDisliked(disliked);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {}, [liked.tail]);
  useEffect(() => {
    cardNextRef.current = cardNext;
  }, [cardNext]);

  useEffect(() => {
    console.log(topCard);
    topCardRef.current = topCard;
  }, [topCard]);

  useEffect(() => {
    restaurantsRef.current = sessionRestaurants;
  }, [sessionRestaurants]);

  useEffect(() => {
    likedRef.current = liked;
  }, [liked.length]);

  useEffect(() => {
    unseenRef.current = unseen;
  }, [unseen.length]);

  useEffect(() => {
    dislikedRef.current = disliked;
  }, [disliked.length]);

  useEffect(() => {
    socket.on("newResData", (data, liked) => {
      if (liked == 1) {
        handleLike(data.id, data.score);
      } else {
        handleDislike(data.id, data.score);
      }
    });
    socket.on("match", (data) => {
      console.log(`FOUND A MATCH! ${data.id}`);
    });
  }, [socket]);

  const addRestaurant = async (id: string, approved: number) => {
    try {
      await axiosAuth.post(
        `http://localhost:3000/sessions/${session}/restaurants`,
        { place_id: id },
        { params: { approved } }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleSwipe = async (approved: boolean, id: string, score: number) => {
    setSessionRestaurants((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        seenByUser: true,
        score: approved ? score / 2 : score * 5,
        disliked: prev[id].disliked || !approved,
      },
    }));
    if (cardNext) {
      setTopCard(cardNext.value);
      if (cardNext.value.id == liked.head?.value.id) {
        liked.pop();
      } else if (cardNext.value.id == unseen.head?.value.id) {
        unseen.pop();
      } else if (cardNext.value.id == disliked.head?.value.id) {
        disliked.pop();
      }
      if (liked.head) {
        setCardNext(liked.head);
      } else if (unseen.head) {
        setCardNext(unseen.head);
      } else if (disliked.head) {
        setCardNext(disliked.head);
      } else {
        setCardNext(undefined);
      }
    } else {
      setTopCard(undefined);
    }

    if (approved) {
      socket.emit("like", session, {
        id: id,
        score: score / 2,
      });
      await addRestaurant(id, 1);
    } else {
      socket.emit("dislike", session, {
        id: id,
        score: score * 5,
      });
      await addRestaurant(id, 0);
    }
  };

  const handleLike = (id: string, score: number) => {
    let restaurantMap = restaurantsRef.current;
    let resData = restaurantMap[id];
    let currentCard = topCardRef.current;
    if (resData && resData.score != score) {
      if (currentCard?.id != id) {
        sortIntoLists(resData, score, true);
      } else {
        setTopCard({ id, score });
      }
      setSessionRestaurants({
        ...restaurantMap,
        [id]: { ...resData, score: score },
      });
    } else if (!resData) {
      //call google data and add it to the map
    }
  };

  const handleDislike = (id: string, score: number) => {
    let restaurantMap = restaurantsRef.current;
    let resData = restaurantMap[id];
    let currentCard = topCardRef.current;
    if (resData && resData.score != score) {
      if (currentCard?.id != id) {
        sortIntoLists(resData, score, false);
      } else {
        setTopCard({ id, score });
      }
      setSessionRestaurants({
        ...restaurantMap,
        [id]: { ...resData, score: score, disliked: true },
      });
    } else if (!resData) {
      // call data from google and add it to the map
    }
  };

  const swapLists = (
    deleteFrom: RestaurantList,
    addTo: RestaurantList,
    id: string,
    score: number
  ) => {
    deleteFrom.delete(id);
    let success = addTo.append({ id, score });
    if (!success) {
      addTo.insert({ id, score });
    }
  };

  const sortIntoLists = (
    data: Restaurant,
    score: number,
    approved: boolean
  ) => {
    let likedList = likedRef.current;
    let unseenList = unseenRef.current;
    let dislikedList = dislikedRef.current;
    if (!data.seenByUser) {
      if (data.disliked) {
        dislikedList.insertAndDelete({ id: data.id, score: score });
      } else if (data.score == Math.pow(2, memberCount)) {
        if (approved) {
          swapLists(unseenList, likedList, data.id, score);
        } else {
          swapLists(unseenList, dislikedList, data.id, score);
        }
      } else {
        if (approved) {
          likedList.insertAndDelete({ id: data.id, score: score });
        } else {
          swapLists(likedList, dislikedList, data.id, score);
        }
      }
      if (likedList.head) {
        setCardNext(likedList.head);
      } else if (unseenList.head) {
        setCardNext(unseenList.head);
      } else if (dislikedList.head) {
        setCardNext(dislikedList.head);
      } else {
        setCardNext(undefined);
      }
      setLiked(likedList);
      setUnseen(unseenList);
      setDisliked(dislikedList);
    }
  };

  // const testData = {
  //   seen: [] as Array<{ id: string; approved: number }>,
  //   seenBySomeone: [] as Array<{
  //     id: string;
  //     score: number;
  //     dislikes: number;
  //     responses_needed: number;
  //   }>,
  //   googleData: [
  //     { id: "resA", address: "Brooklyn, NY", rating: 4.2 },
  //     { id: "resB", address: "Williamsburg, NY", rating: 4.5 },
  //     { id: "resC", address: "Park Slope, NY", rating: 4.5 },
  //     { id: "resD", address: "Prospect Heights, NY", rating: 3.7 },
  //     { id: "resE", address: "Brooklyn Heights, NY", rating: 3.9 },
  //     { id: "resF", address: "Bay Ridge, NY", rating: 4.7 },
  //     { id: "resG", address: "Brooklyn, NY", rating: 4.4 },
  //     { id: "resH", address: "Williamsburg, NY", rating: 3.8 },
  //     { id: "resI", address: "Prospect Heights, NY", rating: 4.0 },
  //     { id: "resJ", address: "Bay Ridge, NY", rating: 4.9 },
  //     { id: "resK", address: "Williamsburg, NY", rating: 4.1 },
  //   ],
  // };

  const mapMarkup = Object.keys(sessionRestaurants).map((key) => (
    <View key={sessionRestaurants[key].id}>
      <ThemedText>{sessionRestaurants[key].id}:</ThemedText>
      <ThemedText>{"    " + sessionRestaurants[key].score}</ThemedText>
      <ThemedText>
        {"    " + sessionRestaurants[key].seenByUser.toString()}
      </ThemedText>
      <ThemedText>
        {"    " + sessionRestaurants[key].disliked.toString()}
      </ThemedText>
      <ThemedText>{"    " + sessionRestaurants[key].location}</ThemedText>
      <ThemedText>{"    " + sessionRestaurants[key].rating}</ThemedText>
    </View>
  ));

  let totalUnseen = useMemo(() => {
    const likedCount = liked?.length || 0;
    const dislikedCount = disliked?.length || 0;
    const unseenCount = unseen?.length || 0;
    const addTopCard = topCard ? 1 : 0;
    return likedCount + dislikedCount + unseenCount + addTopCard;
  }, [liked.length, disliked.length, unseen.length, topCard]);

  return (
    <LinearGradient
      colors={[useThemeColor({}, "tint"), "#500B04"]}
      style={styles.gradient}
    >
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.navigate("(tabs)")}>
          <Ionicons
            name="chevron-back"
            color={useThemeColor({}, "text")}
            size={18}
          />
        </Pressable>
        <ThemedText>Test Title</ThemedText>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "sessionSettings",
              params: { sessionId: session },
            })
          }
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={24}
            color={useThemeColor({}, "text")}
          />
        </Pressable>
      </View>
      <Pressable onPress={() => router.push("match")}>
        <ThemedText>Click Me</ThemedText>
      </Pressable>
      <SwipeCard
        topCard={topCard}
        dataMap={sessionRestaurants}
        next={cardNext}
        handleSwipe={handleSwipe}
        totalCards={totalUnseen}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    paddingHorizontal: "7%",
  },
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    position: "relative",
    paddingVertical: "15%",
  },
});
