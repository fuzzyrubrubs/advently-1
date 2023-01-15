import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, View, Text, Image } from 'react-native';
import colors from '../../assets/colors/colors';
import typography from '../../styles/typography';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import containers from '../../styles/containers';
import { time_since } from '../../tools/DateTime_Methods';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { accept_request, get_user_data, remove_request } from '../../firebase/methods/User_Functions';
import { accept_event_request, remove_event_request } from '../../firebase/methods/Event_Functions';
import { accept_group_request, remove_group_request } from '../../firebase/methods/Group_Functions';

function Request(props){
    const data = props.data;
    const ref = props.data.id
    const navigation = useNavigation();
    const [user_data, set_user_data] = useState({});

    useEffect(() => {
        const fetch = async () => {
            const u = await get_user_data(data.user_id)
            set_user_data(u)
        }
        fetch()
    }, [])


    const Left_Handler = () => {
        if(data.type === 0){accept_request(data.data, data.user_id)}
        if(data.type === 1){accept_group_request(data.user_id, data.data)}
        if(data.type === 2){accept_event_request(data.user_id, data.data)}
    }
    
    const LeftAction = () => {
        return (<View style={[styles.swipe, styles.swipe_accept]}><Ionicons name="checkmark-circle-outline" size={34} color="green" /></View>)
    }

    const Right_Handler = () => {
        if(data.type === 0){remove_request(data.user_id, ref)}
        if(data.type === 1){remove_group_request(data.user_id, ref)}
        if(data.type === 2){remove_event_request(data.user_id, ref)}
        // [remove_friend_request(data, ref), remove_group_request(data, ref), remove_event_request(data, ref)][data.type]
    }

    const RightAction = () => {
        return (<View style={[styles.swipe, styles.swipe_decline]}><Ionicons name="close-circle-outline" size={34} color="red" /></View>
        )
    }

    return (
        <Swipeable renderLeftActions={LeftAction} renderRightActions={RightAction} onSwipeableLeftOpen={Left_Handler} onSwipeableRightOpen={Right_Handler}>
            <Pressable onPress={() => navigation.navigate("UserProfile", user_data)} style={styles.container}>
                <Image style={styles.image} source={{uri: user_data.image }} />
                <View style={styles.wrapper}>
                    <View style={containers.simple_row}>
                        <Text style={typography.main_bold}>{user_data.name}</Text>
                    </View>
                    <Text>{data.name}</Text>
                </View>
            </Pressable>
        </Swipeable>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background_light,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 25,
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginBottom: 5,
    },
    wrapper: {
        flex: 1
    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 50,
        marginRight: 15
    },
    swipe: {
        // width: "100%",
        marginBottom: 5,
        borderRadius: 15,
        justifyContent: "center",
        marginLeft: 10,
        marginRight: 10
    },
})

export default Request;