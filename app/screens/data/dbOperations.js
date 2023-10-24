import {app} from '../../../firebase'
import { getDatabase,ref,set,push,key,get, remove} from 'firebase/database';
import {getBlob, getStorage,list,listAll,ref as sref,uploadBytes, getDownloadURL} from 'firebase/storage'
import { async } from '@firebase/util';



// return format for the data should be
// {
//   adId: adId,
//   adData: adData
// }
// {
//   userId: userId,
//   userData: userData
// }
// {
//   adId: adId,
//   chatHistory: chatMessages
// }
const getUserInfo = async(userId)=>{
  try {
    const db = getDatabase(app);
    const userRef = ref(db, `users/${userId}`);
    const user = await (await get(userRef)).val()
    return user

  } catch (err) {
    throw err

  }


}
const addUserAd = async (userId,ad) => {
  try {
    const db = getDatabase(app);
    const adsRef = ref(db, `ads`);
    const newAdRef = await push(adsRef);
    const newAdKey = newAdRef.key;
    await set(newAdRef, ad);
    const userMypostsRef = ref(db, `users/${userId}/myAds/${newAdKey}`);
    await set(userMypostsRef, true);
    return {userId: userId , adId : newAdKey}

  } catch (err) {
    console.log(err)
  }

  };
  // Function to remove a user ad from Firebase
  const removeAd = (adId) => {
    const db = getDatabase(app);
  const adRef = ref(db, `ads/${adId}`);
  get(adRef).then((adSnapshot) => {
    if (adSnapshot.exists()) {
      const ownerId = adSnapshot.val().ownerId;
      const userMypostsRef = ref(db, `users/${ownerId}/myposts/${adId}`);
      set(userMypostsRef, null);
      const adRef = ref(db, `ads/${adId}`);
      set(adRef, null);
    }
  });
};

  // Function to edit a user ad in Firebase
  const editUserAd = (adId, updatedAd) => {
    const db = getDatabase(app)
  // Reference to the ad in the 'ads' table
    const adRef = ref(db, `ads/${adId}`);
    // Set the updated ad data, which will replace the previous value
    set(adRef, updatedAd);
};

const getUserAds = async (userId) => {
  try{
    const db = getDatabase(app)
    const myAdsRef = ref(db,`users/${userId}/myAds`);
    const response = await get(myAdsRef)
    const userAdsIds = response.val()||{}
    const adsIds = Object.keys(userAdsIds)
    const userAds = adsIds.map(async adId=>{
      const adData = await getAd(adId)
      return {adId:adId,adData:adData}
    })
    return await Promise.all(userAds)
  }
  catch(err){
  }
};

const existsInUserAds= async (userId,adId)=>{
  try{
    const db = getDatabase(app)
    const myAdsRef = ref(db,`users/${userId}/myAds`);
    const response = await get(myAdsRef)
    const userAdsIds = response.val()||{}
    const adsIds = Object.keys(userAdsIds)
    const result =  adsIds.includes(adId)
    return result
  }
  catch(err){
  }

}



const DeleteUserAds =async(userId,adIds)=>{
  try {
    const db = getDatabase(app)
    const result = adIds.map(async adId=>{
      const userAdRef = ref(db,`users/${userId}/myAds/${adId}`)
      const adRef = ref(db,`ads/${adId}`)
      await remove(userAdRef)
      await remove(adRef)
    })
    Promise.all(result)


  } catch (err) {
    throw err
  }

}
const getAllAds = async () => {
  try {
    const db = getDatabase(app);
    const adsRef = ref(db, 'ads');
    const result = await get(adsRef);
    return result.val()||{}
  } catch (err) {
    console.log(err); // You may want to return an appropriate value in case of an error
  }
}
  const getCategoryAds = async (category) => {
    try {
      const storage = getDatabase(app);
      const adsRef = ref(storage, 'ads');
      const result = await get(adsRef);
      const ads = result.val();
      const categoryArray = []
      const keys = Object.keys(ads)
      for(let i = 0; i < keys.length; i++){
        let key = keys[i]
        if(ads[key].category===category){
          categoryArray.push({adId:key,adData:ads[key]})
        }
      }
      return categoryArray
    } catch (err) {
      console.log(err);
    }
  };

// Function to get an ad using the adId
const getAd = async (adId) => {
  try {
    const db = getDatabase(app);
    const adRef = ref(db, `ads/${adId}`);
    const response = await get(adRef);
    const adData = response.val()
    return adData
  } catch (err) {
    throw err
  }
};
const uploadImages = async(images,adId)=>{
try {
  console.log(images)
  await Promise.all(
    images.map(async (image_uri) => {
      const response = await fetch(image_uri);
      const blob = await response.blob();
      const storage = getStorage(app)
      console.log('adding image',adId)
      const storageRef = sref(storage, `images/${adId}/${new Date().getTime()}.jpg`);
      await uploadBytes(storageRef, blob);
      const uploadedRef = sref(storage,`images/${adId}/`)
      const result = await listAll(uploadedRef);
      console.log('getting uplaoded images',await getDownloadURL(result.items[0]))

    })
  );

} catch (err) {
  throw err
}
}
  const getCoverImage = async (adId) => {
    try {
      const storage = getStorage(app);
      const coverImgRef = sref(storage, `images/${adId}`);
      const result = await list(coverImgRef);
      const downloadURL = await getDownloadURL(result.items[0])
      return downloadURL||'';
    } catch (err) {
      throw err
    }
  }
  const getAllAdImages = async (adId) => {
    try {
      const storage = getStorage(app);
      const imagesRef = ref(storage, `images/${adId}`);
      const result = await listAll(imagesRef);
      const downloadURLs = [];
      for (const itemRef of result.items) {
          const url = await getDownloadURL(itemRef);
          downloadURLs.push(url);
      }
      return downloadURLs;
    } catch (err) {
      console.log('Error listing images in the folder:', err);
    }
  };



  const getFavoriteAds = async (userId) => {
    try {
      const db = getDatabase(app);
      const favoriteAdsRef = ref(db, `users/${userId}/favorites/`);
      const result = await get(favoriteAdsRef);
      let favoriteAdsIds = result.val() || [];
      let favoriteAdsArray = [];

      // Use map to create an array of promises
      const fetchPromises = favoriteAdsIds.map(async (adId) => {
        let foundAd = await getAd(adId);
        favoriteAdsArray.push({ adId: adId, adData: foundAd });
      });

      // Wait for all promises to resolve using Promise.all
      await Promise.all(fetchPromises);

      return favoriteAdsArray;
    } catch (err) {
      throw err;
    }
  };


  // Function to add an ad to a user's favorites
  const addToFavorites = async (userId, adId) => {
    const db = getDatabase(app);
    const favoritesRef = ref(db, `users/${userId}/favorites/`);
    try {
      const favoritesSnapshot = await get(favoritesRef);
      let favoritesArray = favoritesSnapshot.val() || [];
        favoritesArray.push(adId);
        await set(favoritesRef, favoritesArray);
        return 'Ad added to favorites';
    } catch (error) {
      console.log('Error in addToFavorites:', error);
      throw error;
    }
  };

const existsInFavorites = async(userId,adId)=>{
  const db = getDatabase(app);
  const favoritesRef = ref(db, `users/${userId}/favorites/`);
  try {
    const favoritesSnapshot = await get(favoritesRef);
    let favoritesArray = favoritesSnapshot.val() || [];
    return favoritesArray.includes(adId)
  } catch (error) {
    console.log('Error in addToFavorites:', error);
    throw error;
  }
}
  // Function to remove an ad from a user's favorites
  const removeFromFavorites = async (userId, adId) => {
    try {
      const db = getDatabase(app);
      const favoritesRef = ref(db, `users/${userId}/favorites`);
      // Fetch the current favorites array
      const favoritesSnapshot = await get(favoritesRef);
      let favoritesArray = favoritesSnapshot.val() || [];
        // Remove the adId from the favorites array
        favoritesArray = favoritesArray.filter(favId => favId !== adId);
        await set(favoritesRef, favoritesArray);
        return 'Ad removed from favorites.'

    } catch (error) {
      // console.error('Error removing ad from favorites:', error);
      throw error
    }
  };



const getAdChatsHistory= async (userId,adId) => {
  const db = getDatabase(app);
    const userRef = ref(db, `users/${userId}/chatsHistory/${adId}`);
    try{
      const response = await get(userRef)
      const chatHistory = response.val()
      return chatHistory
    }
    catch(err){
      throw err

    }
}

const getChatInteractionHistory=async(chatInteractionId)=>{
  try{
    if(chatInteractionId===''){
      return []
    }
    const db = getDatabase(app)
    const chatInteractionRef = ref(db,`chatInteraction/${chatInteractionId}`)
    const response = await get(chatInteractionRef)
    const chats = response.val()||[]
    return chats
  }
  catch(err){
    throw err
  }


}

const getAdsInteractedWith= async (userId) => {
  try{
    const db = getDatabase(app);
    const chatHistoryRef = ref(db, `users/${userId}/chatInteraction/`);
    const response = await get(chatHistoryRef)
    const chatHistory = response.val()||{}
    const keys = Object.keys(chatHistory)
    const array = keys.map(async chatInteractionId=>{
      const adId =chatHistory[chatInteractionId].adId
      const ad = await getAd(adId)
      return {adId:adId,adData: ad}
    })
    const adsInteractedWith = await Promise.all(array)
    return adsInteractedWith
  }
  catch(err){
    throw err
  }
}
const getAdInteractionId =async(userId,adId)=>{
  try{
    const db = getDatabase(app);
    const chatHistoryRef = ref(db, `users/${userId}/chatInteraction/`);
    const response = await get(chatHistoryRef)
    const chatHistory = response.val()||{}
    const keys = Object.keys(chatHistory)
    let foundChatInteractionId = ''
    const promise = keys.map(async chatInteractionId=>{
      const currentAdId =chatHistory[chatInteractionId].adId
      if(currentAdId===adId){
        foundChatInteractionId =  chatInteractionId
      }
    })
    await Promise.all(promise)
    return foundChatInteractionId
  }
  catch(err){
    throw err
  }

}

const sendMessage = async (adId,userId,message)=>{
  try{
    // first check if the ad exists in the interactionHistory
    const db = getDatabase(app);
    const userChatInteractionRef = ref(db, `users/${userId}/chatInteraction/`);
    const response = await get(userChatInteractionRef);
    const chatInteraction = response.val() || {};
    const chatInteractionIds = Object.keys(chatInteraction);

    let existsInChatInteraction = false;

    for (const chatInteractionId of chatInteractionIds) {
      const item = chatInteraction[chatInteractionId];

      if (item.adId === adId) {
        existsInChatInteraction = true;

        const chatInteractionRef = ref(db, `chatInteraction/${chatInteractionId}/`);
        const chatInteractionResponse = await get(chatInteractionRef);
        const previousData = chatInteractionResponse.val() || [];
        const updatedData = [...previousData, { message: message, senderId: userId }];

        await set(chatInteractionRef, updatedData);
      }
    }

    // add the chatinteractionid to owner and user when first time interacted
    if(!existsInChatInteraction){
      const adRef = ref(db,`ads/${adId}`)
      const adResponse = await get(adRef)
      const ad = adResponse.val()
      const ownerId = ad.ownerId
      const chatInteractionRef =  ref(db,'chatInteraction/')
      const response = await push(chatInteractionRef,[{message:message,senderId: userId}])
      const chatInteractionId = response.key
      const userChatInteractionRef = ref(db, `users/${userId}/chatInteraction/${chatInteractionId}/`)
      const ownerChatInteractionRef = ref(db, `users/${ownerId}/chatInteraction/${chatInteractionId}/`)
      await set(userChatInteractionRef,{adId:adId})
      await set(ownerChatInteractionRef,{adId:adId})
    }
  }
  catch(err){
    throw err
  }
}
  // Function to remove a user from messaging
  const deleteAdInteractions = async (userId, adIds) => {
   try {
     const db = getDatabase(app);
     const result = adIds.map(async adId=>{
      const adInteractionId = await getAdInteractionId(userId,adId)
      const chatInteractionRef = ref(db,`chatInteraction/${adInteractionId}`)
      const userChatInteractionRef = ref(db,`users/${userId}/chatInteraction/${adInteractionId}`)
      await remove(chatInteractionRef)
      await remove(userChatInteractionRef)
     })
    await Promise.all(result)
   } catch (err) {
    throw err
   }
  };

  export {
    getUserInfo,
    addUserAd,
    removeAd,
    getUserAds,
    existsInUserAds,
    DeleteUserAds,
    getAd,
    getFavoriteAds,
    addToFavorites,
    existsInFavorites,
    removeFromFavorites,
    getAllAds,
    getCategoryAds,
    getCoverImage,
    uploadImages,
    getAllAdImages,
    getAdsInteractedWith,
    getAdChatsHistory,
    sendMessage,
    getChatInteractionHistory,
    getAdInteractionId,
    deleteAdInteractions
  }
