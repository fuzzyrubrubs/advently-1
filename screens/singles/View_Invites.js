import React, { useState, useContext } from 'react';
import { Text, View, ScrollView, FlatList, RefreshControl } from 'react-native';
import containers from '../../styles/containers';
import typography from '../../styles/typography';
import Alt_Header from '../../components/Headers/Alt_Header';
import global from '../../styles/global';
import List_Footer from '../../components/Displays/List_Footer';;
import { get_invites } from '../../firebase/methods/User_Functions';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import Invite_List from '../../components/Lists/Invite_List';

function Invites(props){ 

    const { einvites, ginvites } = useContext(ProfileDataContext)


    return (      
        <View>
            <Alt_Header back_handler={() => props.close(false)} >Invites</Alt_Header>
            <Text style={[global.information, typography.main]}>Swipe left to decline, right to join</Text>
                <Invite_List group={props.group} data={props.group ? ginvites : einvites} />
        </View>
    )
}

export default Invites;