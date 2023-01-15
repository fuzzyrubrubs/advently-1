import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Image, Text } from 'react-native';
import colors from '../../assets/colors/colors';
import global from '../../styles/global';
import typography from '../../styles/typography';
import Button_Main from '../Buttons/Button_Main';


function Missing(){ 
    const navigation = useNavigation();

    return (      
        <View style={styles.container}>
            <Image style={styles.image} source={require('../../assets/images/cat-in-space.png')} />
            <Text style={typography.header_2}>404</Text>
            <Text style={[typography.main, global.text_light_medium, styles.margin]}>This item has been removed</Text>
            <View style={styles.button}>
                <Button_Main action={() => navigation.goBack()}>Take me back</Button_Main>
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
        borderRadius: 120,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        height: 200, 
        width: 200
    }, 
    button: {
        width: 200
    },
    margin: {
        marginTop: 10, 
        marginBottom: 20
    }
})

export default Missing;
