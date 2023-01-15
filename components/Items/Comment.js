import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Text, Image } from 'react-native';
import colors from '../../assets/colors/colors';
import { remove_event_comment } from '../../firebase/methods/Event_Functions';
import containers from '../../styles/containers';
import typography from '../../styles/typography';
import { time_since } from '../../tools/DateTime_Methods';
import Swipe from '../Animations/Swipe';



function Comment(props){
    const [expand, set_expand] = useState(false);

    const comment = props.data

    const delete_handler = () => remove_event_comment(comment.send_id, comment.comment_id);

    return props.access ? (
        <Swipe right_action={delete_handler}>
            <View style={styles.container}>
                <View styles={styles.image_wrapper}>
                    <Image style={styles.image} source={{uri: comment.data.image }} />
                </View>
                <View style={styles.wrapper}>
                    <View style={[containers.simple_row, styles.header]}>
                        <Text style={typography.main}>{comment.data.name}</Text>
                        <Text style={[typography.extra_small, styles.timestamp]}>{time_since(comment.created.seconds)}</Text>
                    </View>
                    <Text style={styles.comment_text}>{comment.content}</Text>
                </View>
            </View>
        </Swipe>
    ) : (
        <View style={styles.container}>
            <View styles={styles.image_wrapper}>
                <Image style={styles.image} source={{uri: comment.data.image }} />
            </View>
            <View style={styles.wrapper}>
                <View style={[containers.simple_row, styles.header]}>
                    <Text style={typography.main}>{comment.data.name}</Text>
                    <Text style={[typography.extra_small, styles.timestamp]}>{time_since(comment.created.seconds)}</Text>
                </View>
                <Text style={styles.comment_text}>{comment.content}</Text>
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
    comment_text: {
        fontSize: 14,
        lineHeight: 17,
        fontFamily: 'Ubuntu-Light',
        color: colors.text_dark
    }
})

export default Comment;