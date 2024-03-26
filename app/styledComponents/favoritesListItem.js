import React, { useEffect, useState } from "react";
import {
  Card,
  Text,
  Snackbar,
  ThemeProvider,
  useTheme,
} from "react-native-paper";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  addToFavorites,
  getCoverImage,
  existsInFavorites,
  removeFromFavorites,
} from "../screens/data/dbOperations";
import { useSelector, useDispatch } from "react-redux";

function FavoritesListItem({ navigation, item }) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    parentContainer: {
      display: "flex",
      flexDirection: "row",
      padding: 5,
      backgroundColor: theme.colors.secondary,
      borderRadius: 5,

    },
    card: {
      display: "flex",
      flexDirection: "row",
    },
    image: {
      height: 100,
      width: 100,
      borderRadius: 5
    },
    text:{
      color: 'white'
    },
    icon:{
      color:"white"
    },
    descriptionContainer: {
      alignItems: "flex-start",
      justifyContent: "space-between",
      padding: 5,
    },
    descriptionUp: {},
    descriptionDown: {
      width: 250,
      display: "flex",
      flexDirection: "row",
      alignItems: "end",
      justifyContent: "space-between",
    },
    locationDescription: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
    },
    crossIcon: {
      color: theme.colors.accent,
    },
    snackbar: {
      position: "absolute",
      backgroundColor: theme.colors.background,
      top: 400,
      width: "100%",
    },
    snackbarText: {
      color: "white",
    },
  });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const userId = user.userId;

  const [downloadUrl, setDownloadUrl] = useState(null);
  const [snackbarVisiblility, setSnackbarVisibility] = useState(false);
  const [snackbarValue, setSnackbarValue] = useState("");
  const handleSnackbar = (response) => {
    setSnackbarValue(response);
    setSnackbarVisibility(true);
  };
  const removeFromFavoriteAds = async () => {
    try {
      const response = await removeFromFavorites(userId, item.adId);
      handleSnackbar(response);
      dispatch({ type: "changeInData" });
    } catch (err) {
      console.log(err);
    }
  };
  const fetchData = async () => {
    try {
      const downloadURL = await getCoverImage(item.adId);
      setDownloadUrl(downloadURL);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <View style={styles.parentContainer} >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ItemDescription", { item: item });
          }}
        >
          <Image source={{ uri: downloadUrl }} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.descriptionContainer}>
          <View style={styles.descriptionUp}>
            <Text style = {styles.text}>{item.adData.title}</Text>
            <Text style = {styles.text}>{item.adData.price}</Text>
          </View>
          <View style={styles.descriptionDown}>
            <View style={styles.locationDescription}>
              <Icon name={"mobile"} size={30} style={styles.icon} />
              <Text style = {styles.text}>{item.adData.location}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFromFavoriteAds()}>
              <Icon name="close" size={30} style={styles.crossIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Snackbar
        style={styles.snackbar}
        visible={snackbarVisiblility}
        onDismiss={() => {
          setSnackbarVisibility(false);
        }}
        duration="2000"
      >
        <Text style={styles.snackbarText}>{snackbarValue}</Text>
      </Snackbar>
    </>
  );
}

export default FavoritesListItem;
