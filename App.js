import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import LoginScreen from "./app/screens/loginScreen";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import HomepageScreen from "./app/screens/homepageScreen";
import CategoryResult from "./app/screens/categoryResultScreen";
import SingupScreen from "./app/screens/signupScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ItemDescription from "./app/screens/itemDescriptionScreen";
import PostItem from "./app/screens/postItemScreen";
import ReceivedMessagesScreen from "./app/screens/receivedMessagesScreen";
// import CategorieScreen from "./app/screens/categorieScreen";
import SellerBuyerInteractionScreen from "./app/screens/sellerBuyerInteractionScreen";
import { Provider } from "react-redux";
import store from "./app/state/store";
// import SuccessAdPostMessage from './app/state/successAdPostMessage';
import FavoritesScreen from "./app/screens/favoritesScreen.js";
import MyAdsScreen from "./app/screens/myAdsScreen";
import SearchResultScreen from "./app/screens/SearchResultScreen";
import SplashScreen from "./app/screens/splashScreen";
import Animation from "./app/screens/animation";
import ProfileScreen from "./app/screens/profileScreen";
import SignupScreen from "./app/screens/signupScreen";
import MainMenuBar from "./app/styledComponents/mainMenuBar";
import ImageSlider from "./app/styledComponents/imageSlider";

export default function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const theme = {
    dark: isDarkMode,
    roundness: 2,
    colors: {
      primary: isDarkMode ? "#F2F2F2" : "#f46036",
      secondary: "#33384E",
      border: isDarkMode ? "#32de8a" : "#f46036",
      background: isDarkMode ? "#24293E" : "#32de8a",
      text: isDarkMode ? "#f4f5fc" : "black",
      icon: "#bebbff",
      accent: '#bebbff',
      accentText: '#24293E'
    },
  };
  const Stack = createNativeStackNavigator();
  const headerStyle = {
    headerStyle: {
      backgroundColor: theme.colors.secondary,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      alignItems: "center",
      fontWeight: "bold",
      justifyContent: 'center'
    },
    headerBackVisible: false
  }
  const headerStyle2 = {
    headerStyle: {
      backgroundColor: theme.colors.secondary,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      alignItems: "center",
      fontWeight: "bold",
      justifyContent: 'center'
    },
    headerBackVisible: true
  }
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator>
            {/* <Stack.Screen name="animation" component={Animation} /> */}
            {/* <Stack.Screen name="Slider" component={ImageSlider}
            options={{headerShown: false}} /> */}
            <Stack.Screen name="Splash" component={SplashScreen}
            options={{headerShown: false}} />
            <Stack.Screen name="Login" component={LoginScreen}
            options={{headerShown: false}}
            />
            <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={headerStyle2}
             />
            <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={headerStyle}
            />
            <Stack.Screen
            name="Home"
            component={HomepageScreen}
            options={headerStyle}
            />
            <Stack.Screen name="SearchResult" component={SearchResultScreen}
            options = {headerStyle2}
            />
            <Stack.Screen name="MyAds" component={MyAdsScreen}
             options = {headerStyle}
            />
            <Stack.Screen name="CategoryResult" component={CategoryResult}
             options = {headerStyle2}
            />
            <Stack.Screen name="ItemDescription" component={ItemDescription}
             options = {headerStyle2}
            />
            <Stack.Screen name="Post" component={PostItem}
             options = {headerStyle}
            />
            {/* <Stack.Screen name="Categories" component={CategorieScreen}
             options = {headerStyle}
            /> */}
            <Stack.Screen name="Favorites" component={FavoritesScreen}
             options = {headerStyle}
              />
            <Stack.Screen name="Message" component={ReceivedMessagesScreen}
             options = {headerStyle}
              />
            <Stack.Screen name="SellerBuyerInteractionScreen" component={SellerBuyerInteractionScreen}
             options = {headerStyle2}
             />
            {/* <Stack.Screen name="AdPostSuccess" component={SuccessAdPostMessage} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "dodgerblue",
    alignItems: "center",
    justifyContent: "center",
  },
});
