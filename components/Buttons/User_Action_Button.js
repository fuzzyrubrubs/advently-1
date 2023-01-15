import React, { useState, useEffect, useContext } from 'react';
import { accept_request, add_request, remove_friend, remove_request } from '../../firebase/methods/User_Functions';
import Button_Main from './Button_Main';
import { StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../contexts/Auth.context';
import { ProfileDataContext } from '../../contexts/ProfileData.context';

function User_Action_Button(props){
    const { user } = useContext(AuthContext)
    const { user_profile } = useContext(ProfileDataContext);
    const user_data = props.user_data;

    const [status, set_status] = useState(0);
    const [loader, set_loader] = useState(false);
    const [error, set_error] = useState("");

    useEffect(() => {
        if(user_data.friends.includes(user)) return set_status(3);
        if(user_profile.requests.includes(user_data.id)) return set_status(2);
        if(user_data.requests.includes(user)) return set_status(1);
        return set_status(0)
    }, [user_data])


    const stages = ["Add Friend", "Requested", "Become Friends", "Remove"];


    const action_handler = async () => {
        set_loader(true);
        if(status === 0) { add_request(user_profile, user_data.id) }
        if(status === 1) { remove_request(user, user_data.id) }
        if(status === 2) { accept_request(user_profile, user_data.id) }
        if(status === 3) { remove_friend(user, user_data.id) }
        set_loader(false);
    };

    return <Button_Main hollow={status === 1 || status === 3 ? true : false}  error={error} loader={loader} action={action_handler}>{stages[status]}</Button_Main>;

};

export default User_Action_Button;
