import React from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import colors from '../../assets/colors/colors';
import global from '../../styles/global';

function Button_Landing(props){
    return (
    <Pressable onPress={props.action} style={({pressed}) => [{opacity: pressed ? 0.5 : 1,}, styles.button, global.shadow]}>
        <Text style={styles.text}>{props.children}</Text>
    </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        height: 50,
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
    }, 
    text: {
        color: colors.white,
        fontSize: 15,
        fontFamily: 'Ubuntu-Bold'
    }
})

export default Button_Landing;