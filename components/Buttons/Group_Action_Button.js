

import React, { useState, useEffect, useContext } from 'react';
import { accept_invite, add_request, remove_member, remove_group_request } from '../../firebase/methods/Group_Functions';
import Button_Main from './Button_Main';
import { accept_group_invite } from '../../firebase/methods/Invite_Functions';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import { AuthContext } from '../../contexts/Auth.context';

function Group_Action_Button(props){
    const { user } = useContext(AuthContext);
    const { user_profile } = useContext(ProfileDataContext);
    const data = props.data;

    const [status, set_status] = useState(0);
    const [error, set_error] = useState("");
    const [loader, set_loader] = useState(false);

    useEffect(() => {
        if(data.members.includes(user)) return set_status(3);
        if(data.requests.includes(user)) return set_status(2) 
        if(data.invites.includes(user)) return set_status(1); 
        return set_status(0)
    }, [data])

    const stages = ["Join", "Quick Join", "Requested", "Leave"];


    const action_handler = async () => {
        set_loader(true);
        if(status === 0) { add_request(user_profile, data)}
        if(status === 1) { accept_invite(user_profile, data) }
        if(status === 2) { remove_group_request(user, data.id) }
        if(status === 3) { remove_member(user, data.id) }
        set_loader(false);
    };

    return <Button_Main hollow={status === 2 || status === 3 ? true : false} error={error} loader={loader} action={action_handler}>{stages[status]}</Button_Main>;

};

export default Group_Action_Button;