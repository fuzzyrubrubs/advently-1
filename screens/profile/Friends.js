import React, { useState, useContext, useEffect } from 'react';
import { Text, View, FlatList, ScrollView, RefreshControl } from 'react-native';
import containers from '../../styles/containers';
import global from '../../styles/global';
import typography from '../../styles/typography';
import Empty from '../../components/Displays/Empty';
import { get_friend_requests, query_users } from '../../firebase/methods/User_Functions';
import Loader_Page from '../../components/Displays/Loader_Page';
import Alt_Header from '../../components/Headers/Alt_Header';
import { get_friends } from '../../firebase/methods/User_Functions';
import Send_Message from '../../components/Buttons/Send_Message';
import List_Footer from '../../components/Displays/List_Footer';
import { useFocusEffect } from '@react-navigation/core';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import { User } from '../../components/Previews/Member_Preview';


function Friends(props){  
    const { user_profile } = useContext(ProfileDataContext);


    const [query, set_query] = useState("");
    const [query_display, set_query_display] = useState(false);
    const [query_loader, set_query_loader] = useState(false);
    const [found_users, set_founds_users] = useState([]);

    const query_handler = async () => {
        set_query_loader(true);
        set_query_display(true);
        const find_users = await query_users(query);
        set_founds_users(find_users); 
        set_query_loader(false);
    };


    const content = (
        <FlatList key="friends" data={user_profile.friends} 
            ListEmptyComponent={<Empty>No friends</Empty>} 
            renderItem={({ item }) => <User data={item} />} 
            keyExtractor={item => item.email} 
            numColumns="4"
            showsVerticalScrollIndicator={false} 
        />
    );
    
    const search_content = (
        <FlatList key="query" data={found_users} 
            ListEmptyComponent={<Empty>No results</Empty>} 
            renderItem={({ item }) => <User data={item.id} />} 
            keyExtractor={item => item.id} 
            numColumns="4"
            showsVerticalScrollIndicator={false} 
        /> 
    );
        
    return (
        <ScrollView>
            <View style={containers.main}>
                <Alt_Header>Friends</Alt_Header>
                <Send_Message loader={query_loader} value={query} input={set_query} action={query_handler}>Search users</Send_Message>
                <View style={{marginTop: 30}}>{query_display ? search_content : content}</View>
            </View>
        </ScrollView>
    );
};

export default Friends;

