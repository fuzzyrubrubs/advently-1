import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import colors from '../../assets/colors/colors';

function Icon_Wrapper(props){
    return (
        <Pressable onPress={props.action} style={({pressed}) => [{backgroundColor: pressed ? colors.text_light : (props.filled ? "rgba(249, 249, 251, 0.3)" : "transparent")}, styles.wrapper, props.style]}>
            {props.children}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        //padding: 10,
        width: 50,
        aspectRatio: 1,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
})

export default Icon_Wrapper;