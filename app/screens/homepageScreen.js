import React, { useEffect, useState } from 'react'
import {Text,Card,Button,useTheme,ActivityIndicator} from 'react-native-paper'
import { StyleSheet,View,TextInput, SafeAreaView, TouchableOpacity,ScrollView } from 'react-native'
import SearchBar from '../styledComponents/searchBar'
import Icon from 'react-native-vector-icons/FontAwesome';
import ListCompactItem from '../styledComponents/listCompactItem';
import MainMenuBar from '../styledComponents/mainMenuBar';
import CategoriesBar from '../styledComponents/categoriesBar';
import {getAllAds, getCategoryAds} from './data/dbOperations'
import {useSelector} from 'react-redux'
import { useFocusEffect } from '@react-navigation/native';

function HomepageScreen({navigation}) {
    const [ads,setAds] = useState([])
    const theme = useTheme()

    const user = useSelector(state=>state.user)
    const changeInData = user.changeInData
    const [loading, setLoading] = useState(true)

      const fetchData = async () => {
        try {
          const allAds = await getAllAds();
          const adIds = Object.keys(allAds);
          const adsData = Object.values(allAds);
          const adsArray = adIds.map((adId, index) => ({ adId : adId , adData: adsData[index] }));
          setAds(adsArray);
          setLoading(false)
        } catch (err) {console.log(err)}
      };
      // everytime user navigates to this page it gets the updated data
      useFocusEffect(
        React.useCallback(() => {
          fetchData()
        }, [])
      );
    const styles =StyleSheet.create({
        safeArea: {
            flex: 1,
          },
        parentContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flex: 1,
            backgroundColor: theme.colors.primary,
            zIndex: 0
        },
        itemContainer: {
            display: 'flex',
            gap: 5,
            flex: 1,
            alignItems: 'center',
            // justifyContent: 'center',

        },
        itemRow: {
            display: 'flex',
            flexDirection: 'row',
            // alignItems: 'flex-start',
            width: '100%',
            flexWrap: 'wrap',
            // flex: 1,
            gap: 10,
            justifyContent: 'flex-start',

        },
        searchBarContainer: {
            // width: "100%"
            zIndex:   1

        },
        searchBar: {
        },
        loadingIcon:{
          position: 'absolute',
          top: '50%',
          left: '50%'
        },
    })
  return (
    <SafeAreaView style={styles.safeArea}>
    <View style = {styles.parentContainer}>
        <View style = {styles.searchBarContainer}>
            <SearchBar
            navigation={navigation}
            />
        </View>
        {loading&&<ActivityIndicator
                    animating={true}
                    size = {40}
                    style = {styles.loadingIcon}
                    color={theme.colors.background} />
        }
        <CategoriesBar navigation ={navigation}/>
        <ScrollView contentContainerStyle = {styles.itemContainer}>
            <View style={styles.itemRow}>
                {!loading && ads.map((ad,index)=>{
                    return <ListCompactItem
                    key = {index}
                    navigation = {navigation}
                    item = {ad}/>
                })
                }
            </View>
        </ScrollView>

        <MainMenuBar navigation={navigation}/>
    </View>
    </SafeAreaView>
  )
}

export default HomepageScreen
