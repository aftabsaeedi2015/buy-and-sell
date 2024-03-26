import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import ResultListItem from "../styledComponents/resultListItem";
import MessageInput from "../styledComponents/messageInput";
import { ChatBubble } from "../styledComponents/sellerBuyerMessage";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector, UseSelector } from "react-redux";
import {
  deleteAdInteractions,
  existsInUserAds,
  getAd,
  getAdChatsHistory,
  getAdInteractionId,
  getChatInteractionHistory,
  getUserInfo,
  restartInteractionForUser,
  sendMessage,
} from "./data/dbOperations";
import { Button, useTheme, ActivityIndicator } from "react-native-paper";
import { async } from "@firebase/util";
import { dispatch } from "react-redux";

function SellerBuyerInteractionScreen({ navigation }) {
  const theme = useTheme();
  const route = useRoute();
  const dispatch = useDispatch();
  const { adId, adData } = route.params;
  const user = useSelector((state) => state.user);
  const userId = user.userId;
  const changeIntData = user.changeIntData;
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRestartInteractionMessage, setShowRestartInteractionMessage] =
    useState(false);
  const [foundInteractionId, setFoundInteractionId] = useState("");
  const handleSendMessage = async (inputMessage) => {
    const NotfirstTimeInteraction =
      inputMessage.trim() !== "" && chats.length > 0;
    if (NotfirstTimeInteraction) {
      await sendMessage(adId, userId, inputMessage);
      dispatch({ type: "changeInData" });
    } else if (!NotfirstTimeInteraction) {
      await sendMessage(adId, userId, inputMessage);
      dispatch({ type: "changeInData" });
    }
    fetchAdChatHistory();
  };
  const fetchAdChatHistory = async () => {
    try {
      const foundInteractionId = await getAdInteractionId(userId, adId);
      setFoundInteractionId(foundInteractionId);
      const response = await getChatInteractionHistory(foundInteractionId);
      if (response.length === 0) {
        setShowRestartInteractionMessage(true);
      } else {
        setShowRestartInteractionMessage(false);
      }
      setChats(response);
      dispatch({ type: "changeInData" });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchAdChatHistory();
  }, [chats, changeIntData]);
  // for real time interaction add the chats state to the dependency array for the useeffect
  const handleRestartChatInteraction = async () => {
    setLoading(true);
    // we have to check if the current user is the owner cause we can then specify which user to restart the conversation with seller or buyer from chats array
    if (userId === adData.ownerId) {
      // chatInteractionId,userWhoRestartsInteraction,UserToRestartInteractionWith,adId
      await restartInteractionForUser(
        foundInteractionId,
        userId,
        chats[0].buyerId,
        adId
      );
    } else {
      await restartInteractionForUser(
        foundInteractionId,
        userId,
        chats[0].sellerId,
        adId
      );
    }
    fetchAdChatHistory();
    setLoading(false);
  };
  const deleteTheCurrentChatInteractionAndStartANewOne = async () => {
    await handleRestartChatInteraction();
  };
  const styles = StyleSheet.create({
    parentContainer: {
      gap: 20,
      justifyContent: "flex-end",
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 10
    },
    messagesContainer: {
      height: 450,
    },
    deleteButton: {
      alignSelf: "flex-end",
      backgroundColor: theme.colors.background,
      color: "white",
      marginRight: 20,
      marginTop: 20,
    },
    loadingIcon: {
      position: "absolute",
      top: "50%",
      left: "50%",
    },
  });
  return (
    <View style={styles.parentContainer}>
      {loading && (
        <ActivityIndicator
          animating={true}
          size={40}
          style={styles.loadingIcon}
          color={theme.colors.background}
        />
      )}
      <ResultListItem
        navigation={navigation}
        key={adId}
        item={{ adId: adId, adData: adData }}
      />
      <ScrollView style={styles.messagesContainer}>
        {/* if user has interacted with the ad but there are no chats it means the other user has delete the chatinteraction */}
        {chats.length === 1 && (
          <>
            <Text>user has deleted this interaction</Text>
            <Button
              style={styles.deleteButton}
              mode="contained"
              onPress={() => deleteTheCurrentChatInteractionAndStartANewOne()}
              textColor={"white"}
              rippleColor={"white"}
            >
              start a new conversation
            </Button>
          </>
        )}
        {!showRestartInteractionMessage &&
          chats.slice([1]).map((chat,index) => {
            const senderId = chat.senderId;
            const isSent = senderId === userId;
            return (
              <ChatBubble
                key={index}
                message={chat.message}
                isSent={isSent}
              />
            );
          })}
      </ScrollView>
      <MessageInput
        adId={adId}
        disabled={loading}
        handleSendMessage={handleSendMessage}
      />
    </View>
  );
}

export default SellerBuyerInteractionScreen;
