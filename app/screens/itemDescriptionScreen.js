import React, { useEffect, useState } from "react";
import { Text, Button, ThemeProvider, useTheme, ActivityIndicator } from "react-native-paper";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import ListCompactItem from "../styledComponents/listCompactItem";
import { useRoute,useFocusEffect } from "@react-navigation/native";
import {
  existsInUserAds,
  getAdInteractionId,
  getCategoryAds,
  getImages,
  getUserInfo,
} from "./data/dbOperations";
import { useSelector, UseSelector } from "react-redux";
import MainMenuBar from "../styledComponents/mainMenuBar";
import ImageSlider from "../styledComponents/imageSlider";



function ItemDescription({ navigation }) {
  const theme = useTheme()
  const user = useSelector((state) => state.user);
  const userId = user.userId;
  const changeInData = user.changeInData;
  const route = useRoute();
  const { item } = route.params;
  const [owner, setOwner] = useState({});
  const [similarAds, setSimilarAds] = useState([]);
  const [adExistsInUserAds, setAdExistsInUserAds] = useState(true);
  const [images,setImages] = useState([])
  const [loading, setLoading] = useState(true);
  const handleMessaging = () => {
    navigation.navigate("SellerBuyerInteractionScreen", {
      adId: item.adId,
      adData: item.adData,
    });
  };
  const styles = StyleSheet.create({
    parentContainer: {
      flex: 1,
      flexDirection: "column",
      gap: 10,
      height: 600,
      backgroundColor: theme.colors.background,

    },
    contentContainer: {
      flex: 1,
      padding: 10

    },
    imageContainer: {
      height: 400,
      width: "100%",
    },
    image: {
      height: 400,
      width: "auto",
    },
    locationContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    costAndLocationContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    desccription: {
      padding: 10,
      backgroundColor: "gray",
      borderRadius: 5,

    },
    profileDetails: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: theme.colors.secondary,
      padding: 10,
      borderRadius: 5
    },
    profileImage: {
      borderRadius: "50%",
      height: 40,
      width: 40,
    },
    profileText: {
      gap: 10,
      color:'white'
    },
    description: {
      width: "100%",
      height: 'auto',
      marginTop: 10,
      marginBottom: 10
    },
    map: {
      width: "100%",
      height: 200,
    },
    messageButton: {
      width: "100%",
      backgroundColor: theme.colors.accent,
      marginBottom: 10
    },
    similarItemsContainer: {
      display: "flex",
      flexDirection: "row",
      height: 200,
      gap: 10,
      margin: 10,
    },
    loadingIcon: {
      position: "absolute",
      top: "50%",
      left: "50%",
      zIndex: 1
    },
    text:{
      color: theme.colors.text,
      fontSize: 20
    },
    description:{
      marginTop: 10,
      gap: 10,
      marginBottom: 10
    },
    descriptionText:{
      color: theme.colors.text,
      fontSize: 15

    }
  });
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const fetchedImages = await getImages(item.adId);
          setImages(fetchedImages)

          const response = await existsInUserAds(userId, item.adId);
          setAdExistsInUserAds(response);
          const result = await getCategoryAds(item.adData.category);
          setSimilarAds(result);
          const ownerResponse = await getUserInfo(item.adData.ownerId);
          setOwner(ownerResponse);
          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      };
      setLoading(true)
      fetchData();

    }, [changeInData])
  );

  return (
    <SafeAreaView style={styles.parentContainer}>
      {loading && (
          <ActivityIndicator
            animating={true}
            size={40}
            style={styles.loadingIcon}
            color={theme.colors.accent}
          />
        )}
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* <View style={styles.imageContainer}>
          <Image source={{uri : images[0]}} style={styles.image} />
        </View> */}
        <ImageSlider images = {images}/>
        <View>
          <Text style={styles.text}>{item.adData.title}</Text>
        </View>
        <View style={styles.costAndLocationContainer}>
          <Text style={styles.text}>${item.adData.price}</Text>
          <View style={styles.locationContainer}>
            <Icon name="mobile" size={40} style = {{color: theme.colors.background}}/>
            <Text style={styles.text}>{item.adData.location}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Profile", { ownerId: item.adData.ownerId,ownerName: owner.name });
          }}
          disabled = {loading}
        >
          <View style={styles.profileDetails}>
            <Image
              source={require("../assets/profilePic.png")}
              style={styles.profileImage}
            />
              <Text style={styles.profileText}>{owner.name}</Text>
          </View>
        </TouchableOpacity>
        <View>
          <View style={styles.description}>
            <Text style = {styles.descriptionText}>Description</Text>
            <Text style = {styles.descriptionText}>{item.adData.description}</Text>
          </View>
        </View>
        {!adExistsInUserAds && !loading &&
          <TouchableOpacity>
            <Button
              mode="contained"
              onPress={() => handleMessaging()}
              style={styles.messageButton}
              labelStyle={{ color: theme.colors.accentText }}
            >
              message
            </Button>
          </TouchableOpacity>
        }
        <View>
          <Text style = {styles.text}>similar items</Text>
          <ScrollView
            alwaysBounceHorizontal={true}
            bounces={true}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.similarItemsContainer}>
              {similarAds.map((similarAd, index) => {
                return similarAd.adId != item.adId ? (
                  <ListCompactItem
                    key={index}
                    item={similarAd}
                    navigation={navigation}
                  />
                ) : null;
              })}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
      <MainMenuBar navigation={navigation} />
    </SafeAreaView>
  );
}

export default ItemDescription;
