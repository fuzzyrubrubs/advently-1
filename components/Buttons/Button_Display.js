import React from 'react';
import { StyleSheet, Pressable, Text, ActivityIndicator, View } from 'react-native';
import colors from '../../assets/colors/colors';
import global from '../../styles/global';
import { pressed_opacity } from '../../tools/Global_Variables';

function Button_Display(props){


    return (
        <View style={[
            styles.button, 
            props.hollow ? null : global.shadow,
            {backgroundColor: props.hollow ? colors.white : (props.active || props.active === undefined ? colors.primary_light : colors.text_light )},
            {borderColor: props.hollow ? colors.primary : (props.active || props.active === undefined ? colors.primary_light : colors.text_light )},
            {width: props.size || "100%"}
            ]}>
            <Text style={[styles.text, { color: props.hollow ? colors.primary_light : colors.white }]}>
                {props.loader ? <ActivityIndicator size="small" color={props.hollow ? colors.primary : colors.white} /> : props.children}
            </Text>
        </View>
    )
}

export default Button_Display;

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        borderWidth: 1,
    }, 
    text: {
        fontSize: 15,
        fontFamily: 'Ubuntu-Bold'
    },
})
