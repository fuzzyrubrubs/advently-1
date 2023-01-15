import React from 'react';
import { StyleSheet, Pressable, Text, ActivityIndicator } from 'react-native';
import colors from '../../assets/colors/colors';
import global from '../../styles/global';

function Button_Main(props){

    const action_handler = () => {
        if(props.action === undefined) return 
        if(props.loader) return
        if(props.active || props.active === undefined) return props.action();
        return
    }


    return (
        <Pressable onPress={() => action_handler()} style={({pressed}) => [
            styles.button, 
            props.hollow ? null : global.shadow,
            {opacity: pressed ? 0.5 : 1}, 
            {backgroundColor: props.hollow ? colors.white : (props.active || props.active === undefined ? colors.primary_light : props.dark ? colors.text_medium : colors.text_light )},
            {borderColor: props.hollow ? colors.primary : (props.active || props.active === undefined ? colors.primary_light : props.dark ? colors.text_medium : colors.text_light )},
            {width: props.size || "100%"}
            ]}>
            <Text style={[styles.text, { color: props.hollow ? colors.primary_light : colors.white }]}>
                {props.loader ? <ActivityIndicator size="small" color={props.hollow ? colors.primary : colors.white} /> : props.children}
            </Text>
        </Pressable>
    )
}

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

export default Button_Main;