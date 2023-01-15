import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import colors from '../../assets/colors/colors';
import typography from '../../styles/typography';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import Button_Main from '../Buttons/Button_Main';
import global from '../../styles/global';

function Empty(props){
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View>
                <Image style={styles.image} source={require('../../assets/images/cat-in-space.png')} />
            </View>
            <Text style={[typography.header_5, styles.text]}>
                There are no items here!
            </Text>
            <Text style={[typography.main, styles.text, global.text_light_medium]}>
                {props.children}
            </Text>
            {props.link ? <Button_Main action={() => navigation.navigate(props.link)}>Create Group</Button_Main> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        borderRadius: 25,
        paddingTop: 30, 
        paddingBottom: 30,
        backgroundColor: colors.background_light,
        zIndex: -1
    },
    wrapper: {
        backgroundColor: colors.white,
        height: 85,
        width: 85,
        borderRadius: 85,
        // elevation: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        height: 125, 
        width: 125
    },
    text: {
        marginTop: 25,
        color: colors.text_medium,
        textAlign: 'center',
        width: 270,
    }
})

export default Empty;