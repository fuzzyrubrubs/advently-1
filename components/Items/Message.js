import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Text, Image } from 'react-native';
import colors from '../../assets/colors/colors';
import { remove_message } from '../../firebase/methods/Group_Functions';
import containers from '../../styles/containers';
import typography from '../../styles/typography';
import { time_since } from '../../tools/DateTime_Methods';
import Swipe from '../Animations/Swipe';
import Button_Main from '../Buttons/Button_Main';
import Pop_Menu from '../Displays/Pop_Menu';



function Message(props){
    const [display_options, set_display_options] = useState(false);

    const message = props.data

    const delete_handler = () => remove_message(message.send_id, message.message_id);

    return props.access ? (
            <Swipe right_action={delete_handler}>
                <View style={styles.container}>
                    <View styles={styles.image_wrapper}>
                        <Image style={styles.image} source={{uri: message.data.image }} />
                    </View>
                    <View style={styles.wrapper}>
                        <View style={[containers.simple_row, styles.header]}>
                            <Text style={typography.main_bold}>{message.data.name}</Text>
                            <Text style={[typography.extra_small, styles.timestamp]}>{time_since(message.created.seconds)}</Text>
                        </View>
                        <Text style={styles.message_text}>{message.content}</Text>
                    </View>
                </View>
            </Swipe>
        ) : (
            <View style={styles.container}>
                <View styles={styles.image_wrapper}>
                    <Image style={styles.image} source={{uri: message.data.image }} />
                </View>
                <View style={styles.wrapper}>
                    <View style={[containers.simple_row, styles.header]}>
                        <Text style={typography.main_bold}>{message.data.name}</Text>
                        <Text style={[typography.extra_small, styles.timestamp]}>{time_since(message.created.seconds)}</Text>
                    </View>
                    <Text style={styles.message_text}>{message.content}</Text>
                </View>
            </View>

        )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        marginBottom: 5,
        paddingVertical: 10,
        borderRadius: 5,
        borderRadius: 10,
    },
    wrapper: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    image: {
        height: 40,
        width: 40,
        borderRadius: 40,
        marginRight: 15,
        alignSelf: 'flex-start'
    },
    image_wrapper: {
        justifyContent: 'flex-start'
    },
    header: {
        marginBottom: 4
    },
    timestamp: {
        color: colors.text_light_medium
    },
    message_text: {
        fontSize: 14,
        lineHeight: 17,
        fontFamily: 'Ubuntu-Regular',
        color: colors.text_dark,
        minHeight: 40
    }
})

export default Message;