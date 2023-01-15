import React, { useContext, useState, useCallback } from 'react';
import { Text, View, FlatList, ScrollView, RefreshControl } from 'react-native';
import Request from '../../components/Items/Request';
import containers from '../../styles/containers';
import global from '../../styles/global';
import typography from '../../styles/typography';
import Empty from '../../components/Displays/Empty';
import { useFocusEffect } from '@react-navigation/core';
import { AuthContext } from '../../contexts/Auth.context';
import { get_all_requests } from '../../firebase/methods/User_Functions';
import Loader_Page from '../../components/Displays/Loader_Page';
import Alt_Header from '../../components/Headers/Alt_Header';
import { ProfileDataContext } from '../../contexts/ProfileData.context';


function Requests(props){  
    const [refreshing, set_refreshing] = useState(false);
    const { user } = useContext(AuthContext);
    const { groups, upcoming, user_profile, requests } = useContext(ProfileDataContext);
    const [loader, set_loader] = useState(false);


    if(loader) { return <Loader_Page /> }
        
    return (
        <ScrollView>
            <Alt_Header>Requests</Alt_Header>
            <Text style={[global.information, typography.main]}>Swipe left to decline, right to accept</Text>
            <View>
            <FlatList 
                    data={requests}
                    ListEmptyComponent={<View style={containers.main}><Empty>Create communities and make friends to see new requests here</Empty></View>}
                    extraData={requests}
                    renderItem={({ item }) => (
                        <Request data={item}  />
                    )}
                    keyExtractor={(item, index) => `${item}${index}`} 
                 />      
            </View>
        </ScrollView>
    )
}

export default Requests;

// remove={(user_id, request_id) => remove_user_handler(user_id, request_id)}

