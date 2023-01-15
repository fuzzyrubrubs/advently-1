import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import colors from '../../assets/colors/colors';
import { Ionicons } from '@expo/vector-icons';
import global from '../../styles/global';
import { pressed_opacity } from '../../tools/Global_Variables';

function Send_Message(props){

    return (
    <View style={styles.wrapper}>
        <View style={styles.input_wrapper}>
            <TextInput style={styles.input_dark} value={props.value} placeholder={props.children} onChangeText={(e) => props.input(e)} />
        </View>
        <Pressable style={({pressed}) => [{opacity: pressed ? 0.7 : 1}, styles.button, global.shadow ]} onPress={props.action}>{props.loader ? <ActivityIndicator size="small" color={colors.white} /> : <Ionicons name="ios-send" size={22} color={colors.white} />}</Pressable>
    </View>
    )
}

export default Send_Message;



const styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch',
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    input_wrapper: {
        backgroundColor: "#eee",
        paddingHorizontal: 15, 
        paddingVertical: 10,
        height: 50,
        borderRadius: 15,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    input_dark: {
        color: colors.dark,
        flex: 1,
        paddingRight: 5
    },
    button: {
        width: 50, 
        height: 50,
        borderRadius: 50,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5
    }
})