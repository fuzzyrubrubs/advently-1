import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Image, FlatList, ScrollView, ImageBackground, Animated, KeyboardAvoidingView, TextInput, RefreshControl, ActivityIndicator, StatusBar } from 'react-native';
import colors from '../../assets/colors/colors';
import { get_user_data } from '../../firebase/methods/User_Functions';
import global from '../../styles/global';
import typography from '../../styles/typography';

function Members_Display (props) {
    const amount = props.amount;
    const users = props.users.slice(0, amount || 3);

    return (
        <View style={styles.wrapper}>
            {users.map(item => <User dark={props.dark} user={item} />)}
            <View style={[styles.avatar(props.dark)]}><Text style={[typography.main, props.dark ? global.text_light : global.text_medium]}>{props.users.length}</Text></View>
        </View>
    )
}

export default Members_Display;

function User (props) {
    const [user_data, set_user_data] = useState({});

    useEffect(() => {
        const fetch = async () => {
            const u = await get_user_data(props.user);
            set_user_data(u)
        };
        fetch()
    }, [])


    const url = user_data ? user_data.image : null

    return <Image style={[styles.avatar(props.dark)]} imageStyle={[styles.avatar]} source={{uri: url}} />
}




const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
    },  
    avatar: dark => ({
        height: 45, 
        width: 45, 
        borderRadius: 45,
        backgroundColor: dark ? '#494949' : colors.background_light,
        marginLeft: -15,
        color: colors.text_medium,
        textAlign: 'center',
        textAlignVertical: 'center',
        justifyContent: 'center', 
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#555',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2, 
        borderWidth: dark ? 0 : 1,
        borderColor: colors.white
    }),
    text: {
        marginLeft: 5,
        color: colors.text_light_medium
    }
})