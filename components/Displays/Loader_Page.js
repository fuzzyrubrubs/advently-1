import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Image } from 'react-native';
import colors from '../../assets/colors/colors';
import global from '../../styles/global';
import { LinearGradient } from 'expo-linear-gradient';


function Loader_Page(){ 
    const [loader, set_loader] = useState(false);
    
    useEffect(() => {
        setTimeout(() => {
            set_loader(true)
        }, 1000)
    }, [])

    return (      
        <View style={styles.container}>     
            <Image style={styles.image} source={require('../../assets/splash.png')} />
            <View style={styles.loader}>
               {loader ? <ActivityIndicator size="large" color={colors.text_light} /> : null}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapper: {
        height: 220, 
        width: 220, 
        borderRadius: 110,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        height: 230, 
        width: 230
    }, 
    loader: {
        position: 'absolute', 
        bottom: 180
    }
})

export default Loader_Page;
