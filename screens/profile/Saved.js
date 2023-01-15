import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Text, View, FlatList, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Event_Preview from '../../components/Previews/Event_Preview';
import containers from '../../styles/containers';
import { get_event_data } from '../../firebase/methods/Event_Functions';
import List_Footer from '../../components/Displays/List_Footer';
import Alt_Header from '../../components/Headers/Alt_Header';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import { useFocusEffect } from '@react-navigation/core';

function Saved(props){  
    const { user_profile } = useContext(ProfileDataContext)
    const [event_data, set_event_data] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const fetch_data = async () => {
                const saved_events = await Promise.all(user_profile.saved.map(async (id) => {
                    return await get_event_data(id);
                 }))
                 set_event_data(saved_events)
            }
            fetch_data();
        }, [user_profile])
    );


    return (    
        <ScrollView>
            <Alt_Header>Saved Events</Alt_Header>
            <View style={containers.main}>
                <FlatList 
                    data={event_data}
                    ListFooterComponent={List_Footer}
                    renderItem={({ item }) => <Event_Preview event={item} />}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()} 
                />
            </View>
        </ScrollView>

    )
}

export default Saved;

