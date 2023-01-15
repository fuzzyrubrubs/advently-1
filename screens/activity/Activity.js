import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Pressable, BackHandler, Image, ImageBackground } from 'react-native';
import { useFocusEffect } from '@react-navigation/core';

import { ProfileDataContext } from '../../contexts/ProfileData.context';
import { AuthContext } from '../../contexts/Auth.context';

import containers from '../../styles/containers';
import typography from '../../styles/typography';
import global from '../../styles/global';

import Notification from '../../components/Items/Notification';
import Empty from '../../components/Displays/Empty';
import List_Footer from '../../components/Displays/List_Footer';


import colors from '../../assets/colors/colors';
import { Ionicons } from '@expo/vector-icons';
import { set } from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
import { get_user_data } from '../../firebase/methods/User_Functions';


function Activity({ navigation }){ 
    const { notifications, read_notes_handler, requests } = useContext(ProfileDataContext);
    const { user } = useContext(AuthContext);
    const [avatar, set_avatar] = useState(null);

    console.log(requests[0])

    const handleBackButtonClick = () => { navigation.navigate("Events", { screen: 'Events' }); return true; };

    useFocusEffect(
        React.useCallback(() => {
            read_notes_handler();
            const fetch = async () => {
                const u = await get_user_data(requests[0].user_id);
                set_avatar(u.image);
            };
            if(requests.length > 0) { fetch() };
            BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
            };
        }, [])
    );

    return (  
        <ScrollView>
            <View style={styles.container}>
                <Text style={typography.header_1}>Activity</Text>
            </View>

            <View>
                <Pressable onPress={() => navigation.navigate("Requests")} style={({pressed}) => [{backgroundColor: pressed ? colors.background_medium : null}, styles.requests]}>
                    {requests.length === 0 ? <View style={styles.icon}><FontAwesome5 name="user-plus" size={24} color={colors.text_light_medium} /></View> : <ImageBackground style={styles.image} imageStyle={styles.image} source={{uri: avatar }}><View style={global.badge()}><Text style={global.badge_text}>{requests.length}</Text></View></ImageBackground>}
                    <View>
                        <Text style={[typography.main, global.text_medium]}>Follow Requests</Text>
                        <Text style={[typography.small, global.text_light_medium]}>Approve or ignore requests</Text>
                    </View>
                </Pressable>
                <FlatList 
                    data={notifications}
                    // ListFooterComponent={List_Footer}
                    ListEmptyComponent={<View style={containers.main}><Empty>Join communities and sign up to events to see your notifications here</Empty></View>}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (<Notification data={item} user_id={user} />) }
                    keyExtractor={item => item.note_id} 
                />
            </View>
        </ScrollView>
    )
}


export default Activity;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginHorizontal: 25,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start', 
    },
    requests: {
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 10,
        padding: 15,
        borderRadius: 20
    },
    icon: {
        borderWidth: 2,
        borderColor: colors.text_light_medium,
        borderRadius: 50,
        height: 50, 
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20
    }, 
    image: {
        borderRadius: 50,
        height: 50, 
        width: 50,
        marginRight: 20
    }
})


