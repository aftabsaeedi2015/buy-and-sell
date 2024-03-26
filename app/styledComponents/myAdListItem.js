import React, { useEffect, useState } from "react";
import { Card, Text, Snackbar, useTheme, Checkbox } from "react-native-paper";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  addToFavorites,
  getCoverImage,
  existsInFavorites,
  removeFromFavorites,
} from "../screens/data/dbOperations";
import { useSelector, useDispatch } from "react-redux";

// item is in the following format:
// {adId: adId,adData: adData}

function MyAdListItem({ navigation, item, addToSelectedAds }) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    parentContainer: {
      display: "flex",
      flexDirection: "row",
      padding: 5,
      backgroundColor: theme.colors.secondary,
      borderRadius: 5
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
    icon: {
      color: "white",
    },
text:{
  color: "white",
},
    snackbar: {
      position: "absolute",
      backgroundColor: theme.colors.secondary,
      top: 400,
      width: "100%",
    },
    snackbarText: {
      color: theme.colors.text,
    },
    checkboxContainer: {
      position: 'absolute',
      top: -60,
      right: 0,
      borderWidth: 1,
      borderColor: theme.colors.accent,
      borderRadius: '50%',
    },
  });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const userId = user.userId;
  const changeInData = user.changeInData;
  const [imageUrl, setImageUrl] = useState(null);
  const [snackbarVisiblility, setSnackbarVisibility] = useState(false);
  const [snackbarValue, setSnackbarValue] = useState("");
  const [status, setStatus] = useState(false);
  const handleSnackbar = (response) => {
    setSnackbarValue(response);
    setSnackbarVisibility(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = await getCoverImage(item.adId);
        setImageUrl(url);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [changeInData]);

  return (
    <>
      <TouchableOpacity
        style={styles.parentContainer}
        key={item.adId}
        onPress={() => {
          navigation.navigate("ItemDescription", { item: item });
        }}
      >
        <View>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
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
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={status ? "checked" : "unchecked"}
                onPress={() => {
                  setStatus((prevStatus) => {
                    const updatedStatus = !prevStatus;
                    addToSelectedAds(item.adId, updatedStatus);
                    return updatedStatus;
                  });
                }}
                color={theme.colors.accent}
                style={styles.checkbox}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
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

export default MyAdListItem;
