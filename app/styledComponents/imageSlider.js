import React,{useState} from 'react'
import { View,StyleSheet,Image,TouchableOpacity } from 'react-native'
import { SlideInDown } from 'react-native-reanimated';
import Icon from "react-native-vector-icons/FontAwesome";



function ImageSlider({images}) {
    const [index, setIndex] = useState(0)
    const [slide, setSlide] = useState('0%')
    const handleIconClick = (index) => {
        index!=0 ? setSlide(`-${index}00%`): setSlide('0%')
        setIndex(index)
    }
    const styles = StyleSheet.create({
        container:{
            height: 400,
            width: '100%',
            overflow: 'hidden',
            borderRadius: 5
        },
        imagescontainer:{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'black',
            height: 400,
            width: '100%',
            left: slide,

        },
        image:{
            height: 400,
            width: '100%',

        },
        iconsContainer:{
            position: 'absolute',
            top: 370,
            display: 'flex',
            flexDirection: 'row',
            gap: 5,
            width: '100%',
            justifyContent: 'center'
        },
        icon:{
            position: 'absolute',
            top: 100
        }
    })
  return (
    <>
    <View style = {styles.container}>
        <View style = {styles.imagescontainer}>
            {images.map((image,index)=>{
            return <>
                <Image key = {index} source={{uri : image}} style = {styles.image} alt = "image"/>
            </>
            })}
        </View>
    </View>
    <View style = {styles.iconsContainer}>
    {images.map((icon,iconIndex)=>{
        return <>
        <TouchableOpacity onPress={()=>{handleIconClick(iconIndex)}}>
         <Icon key = {iconIndex} name='circle' size={20} color={iconIndex===index? 'black': 'white'}/>
         </TouchableOpacity>
         </>
    })}
    </View>
    </>
  )
}

export default ImageSlider
