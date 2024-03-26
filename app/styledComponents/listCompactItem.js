import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  Text,
  Card,
  Button,
  useTheme,
  ThemeProvider,
  Snackbar,
} from "react-native-paper";
import { TouchableOpacity } from "react-native";
import {
  existsInFavorites,
  getCoverImage,
  addToFavorites,
  removeFromFavorites,
  existsInUserAds,
} from "../screens/data/dbOperations";
import { useSelector, useDispatch } from "react-redux";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";

// accepts object in the form of {adId: adId,adData:adData}
function ListCompactItem({ navigation, item, fetchRefreshedData }) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    item: {
      padding: 10,
      backgroundColor: theme.colors.secondary,
      width: 120,
      height: 200,
      justifyContent: "space-between",
    },
    text:{
      color: theme.colors.text,
      maxWidth: 80
    },
    itemImage: {
      height: 100,
    },
    whiteIcon: {
      color: theme.colors.accent,
      alignSelf: 'flex-end'
    },
    redIcon: {
      color: "red",
    },
    snackbar: {
      position: "absolute",
      backgroundColor: theme.colors.secondary,
      top: 120,
      width: "100%",
      borderRadius: '50%'
    },
    snackbarText: {
      color: theme.colors.text,
    },
  });
  const opacity = useSharedValue(20)
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const userId = user.userId;
  const changeInData = user.changeInData;
  const [adData, setAdData] = useState({});
  const [adExistsInFavorites, setAdExistsInFavorites] = useState(false);
  const adId = item.adId;
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [snackbarVisiblility, setSnackbarVisibility] = useState(false);
  const [snackbarValue, setSnackbarValue] = useState("");
  const [adExistsInUserAds, setAdExistsInUserAds] = useState(true);
  const handleSnackbar = (response) => {
    setSnackbarValue(response);
    setSnackbarVisibility(true);
  };
  const addToFavoriteHandler = async () => {
    dispatch({ type: "changeInData" });
    opacity.value = withTiming(30,{
      duration: 100,
      reduceMotion:Easing.inOut(Easing.quad)
    })

    try {
      if (adExistsInFavorites) {
        // If the item is already in favorites, remove it
        const response = await removeFromFavorites(userId, item.adId);
        handleSnackbar(response);
        opacity.value = withTiming(20,{
          duration: 100,
          reduceMotion:Easing.inOut(Easing.quad)
        })
      } else {
        // If the item is not in favorites, add it
        const response = await addToFavorites(userId, item.adId);
        handleSnackbar(response);
        opacity.value = withTiming(20,{
          duration: 100,
          reduceMotion:Easing.inOut(Easing.quad)
        })
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await existsInUserAds(userId, item.adId);
        setAdExistsInUserAds(response);
        const downloadURL = await getCoverImage(adId);
        setDownloadUrl(downloadURL);
        setAdData(item.adData);
        const exists = await existsInFavorites(userId, item.adId);
        setAdExistsInFavorites(exists);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [changeInData]);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ItemDescription", { item: item });
          dispatch({ type: "changeInData" });
        }}
      >
        <Card style={styles.item}>
          <Card.Cover source={{ uri: downloadUrl }} style={styles.itemImage} />
          <Card.Content>
            <Text style = {styles.text}>{adData.title}</Text>
            <Text style = {styles.text}>${adData.price}</Text>
          </Card.Content>
          <Card.Actions>
            {!adExistsInUserAds &&
            <Animated.View
            style={{
              opacity
            }}
            >
              <Icon
                name="heart"
                size={opacity.value}
                style={adExistsInFavorites ? styles.redIcon : styles.whiteIcon}
                onPress={() => addToFavoriteHandler()}
              />
              </Animated.View>
            }
          </Card.Actions>
        </Card>
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

export default ListCompactItem;
