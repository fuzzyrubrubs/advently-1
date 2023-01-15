

import React, { useState, useEffect, useContext } from 'react';
import Button_Main from './Button_Main';
import { remove_joiner, accept_event_invite, add_request, remove_event_request, leave_event, remove_declined, decline_event_invite } from '../../firebase/methods/Event_Functions';
import { AuthContext } from '../../contexts/Auth.context';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import containers from '../../styles/containers';
import { Text, View } from 'react-native';
import typography from '../../styles/typography';
import global from '../../styles/global';
import { Information } from '../../tools/Global_Components';

function Event_Action_Button(props){
    const { user } = useContext(AuthContext);
    const { user_profile } = useContext(ProfileDataContext);
    const data = props.data;
    
    const [status, set_status] = useState(0);
    const [error, set_error] = useState("");
    const [loader, set_loader] = useState(false);

    useEffect(() => {
        if(data.members.includes(user)) return set_status(3);
        if(data.requests.includes(user)) return set_status(2) 
        if(data.invites.includes(user) || data.mods.includes(user) || data.admin === user) return set_status(1); 
        return set_status(0)
    }, [data])


    const content = [
        <Button_Main error={error} loader={loader} action={() => { remove_declined(user, data.id); add_request(user_profile, data);}}>Join</Button_Main>,
        <View><Information>You've been invited to this Event!</Information><View style={[containers.simple_row, {marginTop: 10}]}><Button_Main size={"48%"} error={error} loader={loader} action={() => accept_event_invite(user_profile, data)}>Accept</Button_Main><Button_Main size={"48%"} hollow={true} error={error} loader={loader} action={() => decline_event_invite(user, data.id)}>Decline</Button_Main></View></View>,
        <Button_Main hollow={true} error={error} loader={loader} action={() => remove_event_request(user, data.id)}>Requested</Button_Main>,
        <Button_Main hollow={true} error={error} loader={loader} action={() => leave_event(user, data.id)}>Leave</Button_Main>,

    ];

    return content[status]

};

export default Event_Action_Button;