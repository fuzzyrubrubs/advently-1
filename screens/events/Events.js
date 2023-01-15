import React, { useContext, useState, useCallback } from 'react';
import { Text, View, ScrollView, BackHandler, FlatList } from 'react-native';
import containers from '../../styles/containers';
import typography from '../../styles/typography';
import Main_Header from '../../components/Headers/Main_Header';
import Empty from '../../components/Displays/Empty';
import { useFocusEffect } from '@react-navigation/core';
import { AuthContext } from '../../contexts/Auth.context';
import global from '../../styles/global';
import Loader from '../../components/Displays/Loader';
import Event_List from '../../components/Lists/Event_List';
import Invite_List from '../../components/Lists/Invite_List';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import Invites from '../singles/View_Invites';
import Event_Preview from '../../components/Previews/Event_Preview';
import Drop_Input from '../../components/Items/Drop_Input';
import { get_event_data } from '../../firebase/methods/Event_Functions';

function Events({ navigation }){  
    const { user } = useContext(AuthContext);
    const { upcoming, einvites, history, user_profile } = useContext(ProfileDataContext)
    const [filtered_query, set_filtered_query] = useState("");
    const [loader, set_loader] = useState(false);
    const [view_invites, set_view_invites] = useState(false);
    const [selected, set_selected] = useState(0);
    const [saved, set_saved] = useState([]);

    const handleBackButtonClick = () => { BackHandler.exitApp(); return true }
    
    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
            const fetch_data = async () => set_saved(await Promise.all(user_profile.saved.map(async (id) => await get_event_data(id))));
            fetch_data();
            return () => {
               BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
            };
        }, [])
      );

    if(view_invites) { return <Invites close={set_view_invites} /> }

    return (    
        <ScrollView>
            <Main_Header link="Create_Event" action={(e) => set_filtered_query(e)}>My Events</Main_Header>
            {loader ? ( <Loader /> ) : (
            <View>

                {einvites.length > 0 ? (
                    <>
                    <View style={[containers.main, containers.simple_row]}>
                        <Text style={typography.header_2}>Invites</Text>
                        {einvites.length > 3 ? <Text style={typography.small} onPress={() => set_view_invites(true)}>View All</Text> : null}
                    </View>
                    
                    <View style={[global.list_wrapper]}>
                       <Invite_List data={einvites.slice(0, 3)} query={filtered_query} />
                    </View>
                    </>
                ) : null }

                <View style={[containers.main, containers.simple_row, global.bottom(10)]}>
                    <Drop_Input action={set_selected} active={true} options={["Upcoming", "History", "Saved"]}></Drop_Input>
                    {/* <Drop_Input action={set_selected} active={true} options={["Newest", "Oldest"]}>Sort</Drop_Input> */}
                </View>

                <View style={[containers.main, global.list_wrapper]}>
                    {
                    selected === 2 ? <View style={{marginTop: 35}}><FlatList  data={saved} ListEmptyComponent={<Empty>Save Events to see them here.</Empty>} renderItem={({ item }) => <Event_Preview event={item} />} showsVerticalScrollIndicator={false} keyExtractor={(item, index) => index.toString()} /></View>
                    : selected === 1 ? <View style={{marginTop: 35}}><FlatList  data={history} ListEmptyComponent={<Empty>Sign up to Events to see them here.</Empty>} renderItem={({ item }) => <Event_Preview event={item} />} showsVerticalScrollIndicator={false} keyExtractor={(item, index) => index.toString()} /></View>
                    : <Event_List data={upcoming} query={filtered_query} /> 
                    }
                </View>
            
            </View>
            )}
        </ScrollView>

    )
}

export default Events;


