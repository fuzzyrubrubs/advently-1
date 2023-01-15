import React, { useContext, useState } from 'react';
import { StyleSheet, Pressable, Text, View, Image } from 'react-native';
import colors from '../../assets/colors/colors';
import typography from '../../styles/typography';
import global from '../../styles/global';
import { useNavigation } from '@react-navigation/native';
import { time_since } from '../../tools/DateTime_Methods';
import { delete_note } from '../../firebase/methods/Notification_Functions';
import { FontAwesome5 } from '@expo/vector-icons';
import Swipe from '../../components/Animations/Swipe';
import { get_event_data } from '../../firebase/methods/Event_Functions';
import { get_group_data } from '../../firebase/methods/Group_Functions';
import { get_user_data } from '../../firebase/methods/User_Functions';
import { AuthContext } from '../../contexts/Auth.context';

function Notification(props){
    const { user } = useContext(AuthContext);
    const data = props.data
    const navigation = useNavigation();


    const right_handler = () => delete_note(user, data.note_id);

    const navigation_handler = async () => {
        if(data.type === 4) {
            return navigation.navigate("Requests");
        }
        if(data.type === 3) {
            const d = await get_user_data(data.ref_id);
            return navigation.navigate("Chat", d)
        }
        if(data.type === 2) {
            const d = await get_event_data(data.ref_id);
            return navigation.navigate('Event', d)
        }
        if(data.type === 1) {
            const d = await get_group_data(data.ref_id);
            return navigation.navigate('Group', d)
        }
        if(data.type === 0) {
            const d = await get_user_data(data.ref_id);
            return navigation.navigate('UserProfile', d)
        }
    }

    return (
        <Swipe right_action={right_handler}>
            <Pressable style={({pressed}) => [{backgroundColor: pressed ? colors.background_medium : colors.white}, styles.container]} onPress={navigation_handler}>
                <Image style={styles.image} source={{uri: data.image }} />
                <View style={styles.wrapper}>
                    <Text style={[typography.main, global.text_medium]}>{ data.title }</Text>
                    <Text style={[typography.extra_small, styles.content]}>{ data.message }</Text>
                    <Text style={[typography.small, global.text_light]}>{ time_since(data.created.seconds) }</Text>
                </View>
                <FontAwesome5 name="chevron-right" size={24} color={colors.text_light} />
            </Pressable>
        </Swipe>
    )
}

export default Notification;

const styles = StyleSheet.create({
    // notification: {
    //     borderBottomColor: colors.background_light,
    //     borderBottomWidth: 1,
    //     marginHorizontal: 10,
    //     paddingHorizontal: 15
    // },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        borderRadius: 20,
        height: 105,
        paddingHorizontal: 15,
        marginHorizontal: 10
    },
    image: {
        height: 60, 
        width: 60,
        borderRadius: 60
    },
    wrapper: {
        flex: 1, 
        paddingHorizontal: 20
    }, 
    time: {
        color: colors.text_medium,
    },
    content: {
        color: colors.text_light_medium,
        marginTop: 5,
        marginBottom: 5
    },
    swipe: {
        marginBottom: 5,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: 'flex-end',
        marginLeft: 10,
        marginRight: 10,
        width: "100%"
    },

})