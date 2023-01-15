import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import containers from '../../../styles/containers';
import Alt_Header from '../../../components/Headers/Alt_Header';
import typography from '../../../styles/typography';
import { AuthContext } from '../../../contexts/Auth.context';
import { ProfileDataContext } from '../../../contexts/ProfileData.context';
import { Invite_List } from '../../../components/Lists/Member_List';
import { accept_event_request, add_invite, remove_invite } from '../../../firebase/methods/Event_Functions';
import global from '../../../styles/global';
import colors from '../../../assets/colors/colors';
import { useFocusEffect } from '@react-navigation/native';
import { listenRealTimeEvent } from '../../../tools/Fetches';


function Event_Invites(props){   
    const data = props.data;
    const [event_data, set_event_data] = useState(data);
    const { user } = useContext(AuthContext);
    const { groups, user_profile } = useContext(ProfileDataContext);  
    const [error, set_error] = useState("");

    useFocusEffect(
        useCallback(async () => { 
            if(props.embed) {
                const unlistenEvent = listenRealTimeEvent(set_event_data, data.id);
                return () => {
                    unlistenEvent();
                };
            } 
        }, [])
      );
    

    const press_handler = (id, status) => {
        if(status === 0 && data.requests.includes(id)) { accept_event_request(id, data); }
        if(status === 0) { add_invite(id, data);}
        if(status === 2) { remove_invite(id, data.id);}
    
    };

    return (      
        <ScrollView showsVerticalScrollIndicator={false}>
            {props.embed ? null : (
                <>
                <Text style={[typography.header_1, global.bottom(10)]}>Send Invites</Text>
                <Text style={[typography.main, global.text_light_medium]}>You can view all your connections below and invite them to {data.name}.</Text>
                </>
            )}
                {data.group_id ? <Text style={[typography.header_5, styles.header]}>{data.organiser.name}</Text> : null}
                {data.group_id ? <Invite_List data={props.embed ? event_data : data} list={data.organiser.members.filter(item => item !== user)} press={press_handler} /> : null}
                <Text style={[typography.header_5, styles.header]}>Friends</Text>
                <Invite_List data={data} list={user_profile.friends} press={press_handler} />
                {groups.filter(item => item.id !== data.organiser.id).map(item => {
                    return (
                        <>
                        <Text style={[typography.header_5, styles.header]}>{item.name}</Text>
                        <Invite_List data={data} list={item.members.filter(item => item !== user)} press={press_handler}  />
                        </>
                    )
                })}
        </ScrollView>
    )
}

export default Event_Invites;



const styles = StyleSheet.create({
    text: {
        marginVertical: 10
    },
    header: {
        marginBottom: 10,
        marginTop: 30,
    }
});
