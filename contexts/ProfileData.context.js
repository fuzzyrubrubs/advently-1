import React, { createContext, useState, useEffect, useContext } from "react";
import { get } from "react-native/Libraries/Utilities/PixelRatio";
import { listenRealTimeGroupInvites, listenRealTimeEventInvites, listenRealTimeGoing, listenRealTimeMember, listenRealTimeUserData, listenRealTimeChats, listenRealTimeNotifications, listenRealTimeHistory } from "../firebase/fetches/Listeners";
import { db } from '../firebase/Firebase';
import { read_notes } from '../firebase/methods/Notification_Functions';
import { get_user_data, update_active } from "../firebase/methods/User_Functions";
import { AuthContext } from './Auth.context';


export const ProfileDataContext = createContext();

export function ProfileDataProvider(props) {
    const { user } = useContext(AuthContext);
    const [user_profile, set_user_profile] = useState(false);

    const [notifications, set_notifications] = useState([]);
    const [unread_notes, set_unread_notes] = useState(0);

    const [upcoming, set_upcoming] = useState(null);
    const [history, set_history] = useState([]);
    const [einvites, set_einvites] = useState([]);
    const [ginvites, set_ginvites] = useState([]);
    const [groups, set_groups] = useState([]);
    const [chats, set_chats] = useState([]);

    const [u_requests, set_u_requests] = useState([]);
    const [e_requests, set_e_requests] = useState([]);
    const [g_requests, set_g_requests] = useState([]);
 

    useEffect(() => {
        async function fetchData(){

            const unlistenGoing = listenRealTimeGoing(set_upcoming, user);
            const unlistenHistory = listenRealTimeHistory(set_history, user);
            const unlistenEventInvites = listenRealTimeEventInvites(set_einvites, user);
            const unlistenUserData = listenRealTimeUserData(set_user_profile, user)
            const unlistenMember = listenRealTimeMember(set_groups, user);
            const unlistenGroupInvites = listenRealTimeGroupInvites(set_ginvites, user);
            const unlistenChats = listenRealTimeChats(set_chats, user)
            const unListenNotifications = listenRealTimeNotifications(set_notifications, set_unread_notes, user);

            update_active(user)     
        };
        if(user){ fetchData(); } 
        
    }, [user]);


    useEffect(() => {
        if(user_profile) {
            const map = user_profile.requests.map(request => {
                return {user_id: request, id: user_profile.id, name: "Friend", type: 0, data: user_profile};
            })
            set_u_requests( map)
        }
    }, [user_profile]);

    useEffect(() => {
        if(upcoming) {
            const map = [];
            [...upcoming].filter(item => (item.mods.includes(user) || item.admin === user) && item.requests.length > 0).forEach(item => {
                item.requests.forEach(request => {
                    const result = {user_id: request, id: item.id, name: item.name, type: 2, data: item};
                    map.push(result)
                })
            })
            set_e_requests(map)
        }
    }, [upcoming]);

    useEffect(() => {
        if(groups) {
            const map = [];
            [...groups].filter(item => (item.mods.includes(user) || item.admin === user) && item.requests.length > 0).forEach(item => {
                item.requests.forEach(request => {
                    const result = {user_id: request, id: item.id, name: item.name, type: 1, data: item};
                    map.push(result)
                })
            })
            set_g_requests(map)
        }
    }, [groups]);


        
    const read_notes_handler = () => {
        read_notes(user);
        set_unread_notes(0);
    };


    const unread_chats = chats.filter(item => item.unread === true).length;
    
    return (
    <ProfileDataContext.Provider value={{
        user_profile,
        notifications, 
        unread_notes, 
        read_notes_handler, 
        groups, 
        upcoming,
        history, 
        einvites,
        ginvites,
        requests: [...u_requests, ...e_requests, ...g_requests],
        chats,
        unread_chats,
        }}>
        {props.children}
    </ProfileDataContext.Provider>
    );
}
