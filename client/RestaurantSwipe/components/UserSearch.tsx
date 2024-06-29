import {
  Text,
  View,
  Button,
  Modal,
  TextInput,
  StyleSheet,
  FlatList,
  ImageSourcePropType,
  Image,
  ListRenderItem,
  Pressable,
} from "react-native";
import { Link, useRouter } from "expo-router";
import axiosAuth from "@/api/auth";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { Guest } from "@/types/Guest";

function SearchResult({ username, profileImage }: Guest) {
  return (
    <View style={styles.result}>
      <View style={styles.resultInfo}>
        {profileImage && (
          <Image source={profileImage} style={styles.profileImage} />
        )}
        <ThemedText>{username}</ThemedText>
      </View>
      <Ionicons
        name="add-circle-outline"
        size={20}
        color={useThemeColor({}, "tint")}
      />
    </View>
  );
}

export default function UserSearch({ handleUsers }: { handleUsers: Function }) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const handleQueryChange = async (query: string) => {
    console.log(`query: ${query}`);
    setQuery(query);
    if (query.length > 0) {
      try {
        const response = await axiosAuth.post(
          "http://localhost:3000/users/search",
          {
            queryTerm: query,
          }
        );
        console.log(response.data);
        setResults(response.data.users);
      } catch (error) {
        console.log(error);
      }
    } else {
      setResults([]);
    }
  };

  const handleSelect = (guest: Guest) => {
    setQuery("");
    setResults([]);
    handleUsers(guest);
  };
  return (
    <View style={styles.search}>
      <View style={styles.searchBar}>
        <TextInput
          value={query}
          onChangeText={handleQueryChange}
          placeholder="Search"
          placeholderTextColor={useThemeColor({}, "subduedText")}
          style={styles.searchInput}
        />
        <Ionicons name="search" size={16} />
      </View>
      <FlatList
        data={results}
        style={styles.searchResults}
        renderItem={({ item }: { item: Guest }) => (
          <Pressable onPress={() => handleSelect(item)}>
            <SearchResult
              username={item.username}
              profileImage={require("../assets/images/dining out.jpeg")}
            />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    alignSelf: "stretch",
    position: "relative",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    justifyContent: "space-between",
  },
  searchInput: {
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchResults: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  resultInfo: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  result: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
});
