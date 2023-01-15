import React, { useEffect, useState } from 'react';
import { StyleSheet, Pressable, View, Image, Text  } from 'react-native';
import colors from '../../assets/colors/colors';
import typography from '../../styles/typography';
import { useNavigation } from '@react-navigation/native';
import containers from '../../styles/containers';
import { time_since } from '../../tools/DateTime_Methods';

function Message_Preview(props){
    const navigation = useNavigation();
    const data = props.data;
    const contact = data.contact;
    const message = data.messages[data.messages.length - 1];
    const unread = data.unread;

    
    return (
        <View style={styles.message_preview}>
            <Pressable onPress={() => navigation.navigate("Chat", contact)} style={({pressed}) => [{backgroundColor: pressed ? colors.background_light : colors.white}, styles.container]}>
               <Image style={styles.image} source={{uri: contact.image }} />
                <View style={styles.wrapper}>
                    <View style={containers.simple_row}>
                        <Text style={typography.main_bold}>{contact.name}</Text>
                        <Text style={[typography.extra_small]}>{message ? time_since(message.created.seconds) : null}</Text>
                    </View>
                    <View style={containers.simple_row}>
                        <Text style={[unread ? typography.main : typography.main_paragraph, styles.content]}>{message ? message.content.slice(0, 25) : ""}</Text>
                        {unread > 0 ? <View style={styles.unread}><Text style={styles.unread_text}></Text></View> : null}
                    </View>
                </View>
            </Pressable>
        </View>
    );
};

export default Message_Preview;

const styles = StyleSheet.create({
    message_preview: {
        borderBottomColor: colors.background_light,
        borderBottomWidth: 1,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        flex: 1,
        paddingHorizontal: 0,
        borderRadius: 20,
        marginVertical: 5
    },
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        height: "100%",
        paddingVertical: 10
    },  
    image: {
        height: 75,
        width: 75,
        borderRadius: 75,
        marginRight: 15
    },
    content: {
        marginTop: 5
    },
    unread: {
        marginTop: 5,
        height: 15, 
        width: 15, 
        borderRadius: 15,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    unread_text: {
        color: colors.white
    }
})