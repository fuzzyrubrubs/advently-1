import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Text, Image } from 'react-native';
import colors from '../../assets/colors/colors';
import { remove_message } from '../../firebase/methods/Group_Functions';
import containers from '../../styles/containers';
import typography from '../../styles/typography';
import { message_time, time_since } from '../../tools/DateTime_Methods';



function Direct_Message(props){

    const message = props.data
    const sender = props.sender;



    return (
        <View style={styles.container}>
            <View style={sender ? styles.sender : styles.message}>
                <Text style={[styles.content, {color: sender ? colors.white : colors.text_dark}]}>{message.content}</Text>
                <Text style={[typography.extra_small, styles.timestamp, {color: sender ? colors.white : colors.text_dark}]}>{message_time(message.created.seconds)}</Text>
            </View>
        </View>
    )
}

export default Direct_Message;

const styles = StyleSheet.create({
    container: {    
        width: "100%",
        marginBottom: 10
    },
    sender: {
        backgroundColor: colors.primary_light,
        alignSelf: 'flex-end',
        borderTopRightRadius: 15, 
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        padding: 10,
        maxWidth: "80%"
    },
    message: {
        backgroundColor: "#ededed",
        alignSelf: 'flex-start',
        borderTopRightRadius: 15, 
        borderTopLeftRadius: 15,
        borderBottomRightRadius: 15,
        padding: 10,
        maxWidth: "80%"
    },
    content: {
        fontSize: 14,
        lineHeight: 17,
        fontFamily: 'Ubuntu-Medium',
        color: colors.text_dark,
    },
    timestamp: {
        alignSelf: 'flex-end',
        color: colors.text_dark
    }
})