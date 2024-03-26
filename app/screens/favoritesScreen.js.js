import React, { useState, useEffect } from "react";
import { Button, Text, ActivityIndicator, useTheme } from "react-native-paper";
import { View, StyleSheet, ScrollView,SafeAreaView } from "react-native";
import MainMenuBar from "../styledComponents/mainMenuBar";
import { useSelector } from "react-redux";
import { getFavoriteAds } from "./data/dbOperations";
import FavoritesListItem from "../styledComponents/favoritesListItem";

function FavoritesScreen({ navigation }) {
  const theme = useTheme();
  const [favorites, setFavorites] = useState([]);
  const user = useSelector((state) => state.user);
  const userId = user.userId;
  const changeInData = user.changeInData;
  const [loading, setLoading] = useState(true);
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: theme.colors.background
    },
    itemContainer: {
      display: "flex",
      gap: 5,
      flex: 1,
      alignItems: "center",
    },
    itemRow: {
      display: "flex",
      flexDirection: "row",
      alignItems: 'center',
      width: "100%",
      flexWrap: "wrap",
      flex: 1,
      gap: 5,
      justifyContent: "center",
    },
    loadingIcon: {
      position: "absolute",
      top: "50%",
      left: "50%",
    },
    noAdsMessage: {
      position: "absolute",
      top: 25,
      color: theme.colors.text,
      fontSize: 25
    },
  });
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const result = await getFavoriteAds(userId);
        setFavorites(result);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFavorites();
  }, [changeInData]);
  return (
    <SafeAreaView style={styles.mainContainer}>
      {loading && (
        <ActivityIndicator
          animating={true}
          size={40}
          style={styles.loadingIcon}
          color={theme.colors.accent}
        />
      )}
      <ScrollView contentContainerStyle={styles.itemContainer}>
        <View style={styles.itemRow}>
          {!loading &&
            favorites.map((item, index) => (
              <FavoritesListItem
                key={index}
                navigation={navigation}
                item={item}
              />
            ))}
          {favorites.length === 0 && !loading && (
            <Text style={styles.noAdsMessage}>
              no favorite ads to show
            </Text>
          )}
        </View>
      </ScrollView>
      <MainMenuBar navigation={navigation} />
    </SafeAreaView>
  );
}

export default FavoritesScreen;
