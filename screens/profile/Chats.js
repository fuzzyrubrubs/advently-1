import React, { useState, useContext, useCallback } from 'react';
import { Text, View, FlatList, ScrollView, RefreshControl, StyleSheet, Pressable, Image } from 'react-native';
import containers from '../../styles/containers';
import typography from '../../styles/typography';
import Empty from '../../components/Displays/Empty';
import Alt_Header from '../../components/Headers/Alt_Header';
import { get_friends } from '../../firebase/methods/User_Functions';
import List_Footer from '../../components/Displays/List_Footer';
import { search_direct_messages } from '../../firebase/methods/Message_Functions';
import Message_Preview from '../../components/Previews/Message_Preview';
import { pressed_opacity } from '../../tools/Global_Variables';
import { useFocusEffect } from '@react-navigation/core';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import Loader_Page from '../../components/Displays/Loader_Page';
import { Chat } from '../../components/Previews/Member_Preview';


function Chats(props){  
    const data = props.route.params;
    const user_id = data.user_id;
    const { chats, user_profile } = useContext(ProfileDataContext);
    const [friends_data, set_friends_data] = useState([]);
    const [refreshing, set_refreshing] = useState(false);
    const [loader, set_loader] = useState(true);

    
    const fetch_data = async () => {
        set_friends_data(user_profile.friends.filter(friend => chats.every(item => item.contact.id !== friend)))
        set_refreshing(false);
        set_loader(false);
    };
    useFocusEffect(
        useCallback(() => {
            fetch_data();
            return () => {};
        }, [])
    );

    const on_refresh = useCallback(() => {
        set_refreshing(true);
        fetch_data();
    }, []);

    if(loader) { return <Loader_Page /> }


   
    return (
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={on_refresh}/> }>
            <Alt_Header>Direct Messages</Alt_Header>
            <View style={containers.main}>
                    <FlatList 
                        key="friends" 
                        data={friends_data} 
                        extraData={friends_data}
                        ListEmptyComponent={null}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => <Chat data={item} />} 
                        keyExtractor={item => item.id} horizontal />
                        

                    <FlatList 
                        key="messages" 
                        data={chats} 
                        ListHeaderComponent={<Text style={[typography.header_5, {marginBottom: 15}]}>Messages</Text>}
                        ListEmptyComponent={<Empty>No messages</Empty>}
                        renderItem={({ item }) => <Message_Preview data={item} />} 
                        keyExtractor={item => item.chat_id} showsVerticalScrollIndicator={false} 
                    />
            </View>
        </ScrollView>
    )
}

export default Chats;

const Friend = (data) => (
    <Pressable onPress={() => props.navigation.navigate("Chat", data)} style={({pressed}) => [{opacity: pressed ? pressed_opacity : 1}, styles.friend]}>
        <Image style={styles.friend_image} source={{uri: data.image}} />
        <Text style={[typography.small, {textAlign: 'center'}]}>{data.name}</Text>
    </Pressable>
);


const styles = StyleSheet.create({
    friend: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5, 
        marginBottom: 20,
        width: 85,
        marginVertical: 15,
        height: 120
    },
    friend_image: {
        height: 60, 
        width: 60,
        borderRadius: 60,
        marginBottom: 3
    },
})

