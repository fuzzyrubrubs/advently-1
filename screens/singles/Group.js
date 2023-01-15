import React, { useState, useContext, useCallback } from 'react';
import { Text, View, StyleSheet, Pressable, Image, FlatList, ScrollView, RefreshControl, Dimensions, KeyboardAvoidingView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../../firebase/Firebase';
import { get_group_upcoming, get_group_history, get_group_data, add_message, remove_member } from '../../firebase/methods/Group_Functions';

import { AuthContext } from '../../contexts/Auth.context';
import { FontAwesome5, FontAwesome, Ionicons } from '@expo/vector-icons';
import colors from '../../assets/colors/colors';

import typography from '../../styles/typography';
import global from '../../styles/global';
import containers from '../../styles/containers';

import { group_types } from '../../tools/Global_Variables';
import IDGenerator from '../../tools/IDGenerator';

import Locked from '../../components/Displays/Locked';
import Group_Action_Button from '../../components/Buttons/Group_Action_Button';
import Message from '../../components/Items/Message';
import Loader_Page from '../../components/Displays/Loader_Page';
import Empty from '../../components/Displays/Empty';
import Alt_Header from '../../components/Headers/Alt_Header';
import Event_List from '../../components/Lists/Event_List';
import Send_Message from '../../components/Buttons/Send_Message';
import Missing from '../../components/Displays/Missing';
import Icon_Wrapper from '../../components/Displays/Icon_Wrapper';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import { listenRealTimeGroup, listenRealTimeMembers, listenRealTimeMessages } from '../../tools/Fetches';
import Event_Settings from '../events/Event_Settings';
import Group_Settings from '../groups/Group_Settings';
import Edit_Group from '../groups/Edit_Group';
import { Member_List, Simple_List } from '../../components/Lists/Member_List';
import Button_Main from '../../components/Buttons/Button_Main';

function Group(props){  
    const data = props.route.params; 
    const { user } = useContext(AuthContext);
    const { user_profile } = useContext(ProfileDataContext)
    const [group_data, set_group_data] = useState(data);
    const [groups_events, set_groups_events] = useState([]);
    const [groups_history, set_groups_history] = useState([])
    const [groups_messages, set_groups_messages] = useState([]);
    const [active_menu, set_active_menu] = useState(0);
    const [loader, set_loader] = useState(true);
    const [message_input, set_message_input] = useState("");
    const [exit, set_exit] = useState(false);
    const [settings, set_settings] = useState(false);
    const [edit, set_edit] = useState(false);
    const [rerender, set_rerender] = useState(false);

    
    useFocusEffect(
        useCallback(async () => {  
            if(data) {
                const unlistenGroup = listenRealTimeGroup(set_group_data, data.id);
                const unlistenMessages = listenRealTimeMessages(set_groups_messages, data.id);
                const fetch_events = await get_group_upcoming(data.id);
                const fetch_history = await get_group_history(data.id);
                set_groups_events(fetch_events.map(item =>{ return {...item, organiser: data}}));
                set_groups_history(fetch_history.map(item =>{ return {...item, organiser: data}}));
                return () => {
                    unlistenGroup();
                    unlistenMessages();
                };
            }
        }, [rerender])
      );


    if(!group_data) { return <Missing /> }

    const access_level_handler = () => {
        if(group_data.admin === user) return 4
        if(group_data.mods.includes(user)) return 3
        if(group_data.members.includes(user)) return 2
        if(group_data.invites.includes(user)) return 1
        return 0
    }


    const access_level = access_level_handler();

    const message_handler = async () => {
        if(message_input.length > 0) {
            const message_id = IDGenerator();
            const status = await add_message(group_data.id, group_data.name, user_profile, message_id, message_input);
            if(status === true) { set_message_input(""); };
        }
    };


    const leave_handler = () => set_exit(true);
    const enter_handler = () => set_exit(false);


    const discussion = (
        <View style={styles.messages_wrapper}>
            {groups_messages.length === 0 ? <Empty>No messages yet.</Empty> : null}
            <FlatList 
                key={'1'} 
                ListFooterComponent={
                    <Send_Message valid={true} value={message_input} input={set_message_input} action={() => message_handler()}>Message...</Send_Message>
                } 
                data={groups_messages} 
                extraData={groups_messages} 
                renderItem={({ item }) => ( 
                    <Message data={item} access={item.ref_id === user || access_level === 4} /> 
                    ) } 
                keyExtractor={(item, index) => item.message_id} 
                inverted 
                contentContainerStyle={{ flexDirection: 'column-reverse' }} 
                showsVerticalScrollIndicator={false}
            />
        </View>
    )

    const upcoming = (
        <>
        {/* <Pressable style={styles.history}><Text style={[typography.small, { color: colors.white }]}>Event History</Text></Pressable> */}
        <Event_List data={groups_events} />
        </>
    )
    

    const remove_handler = (id) => remove_member(id, group_data.id);
    const make_mod_handler = (id) => make_group_mod(id, group_data);
    const remove_mod_handler = (id) => remove_group_mod(id, group_data);

    
    const members = (
        <View style={{marginBottom: 30, marginTop: 15}}>
            {access_level >= 3 ? <Text style={[global.information, typography.main, {marginTop: 10}]}>Press and hold a User for options</Text> : null}
            <Member_List list={group_data.members} data={group_data} press={remove_handler} />
        </View>
    )


   const display_content = [discussion, upcoming, members];



    const home = (
            <>
            {/* NAVIGATION */}
            <Alt_Header></Alt_Header>
            <View style={styles.wrapper}>
                <Image style={styles.image} source={{ uri: group_data.image }} />
                {access_level <= 1 ? null : <Icon_Wrapper style={styles.enter_icon} action={() => enter_handler()}><Ionicons name="enter-outline" size={24} color={colors.primary} /></Icon_Wrapper>}
                <Text style={[typography.header_2, styles.title]}>{group_data.name}</Text>
                <Text style={[typography.main, styles.about]}>{group_data.about}</Text>
                {/* DETAILS */}
                <View style={styles.details_wrapper}>
                    <View style={styles.details_item}><FontAwesome5 name="calendar-day" size={12} color={colors.text_light_medium} /><Text style={[typography.extra_small, styles.details_item_text]}>{groups_events.length} Upcoming</Text></View>
                    <View style={styles.details_item}><FontAwesome name="group" size={12} color={colors.text_light_medium} /><Text style={[typography.extra_small, styles.details_item_text]}>{group_types[group_data.type]}</Text></View>
                    <View style={styles.details_item}><Ionicons name="location" size={16} color={colors.text_light_medium} /><Text style={[typography.extra_small, styles.details_item_text]}>{group_data.location}</Text></View>
                </View>
                {/* MEMBER SIMPLE VIEW */}
                <View style={styles.content}>{access_level === 0 && group_data.type === 0 ? <Locked /> : <Simple_List list={group_data.members} />}</View>
                {/* ACTION BUTTON */}
                {access_level === 4 ? ( <View style={styles.icon}></View> ) : (<Group_Action_Button data={group_data} />)}
            </View>
            </>
    );


    const member_zone = (
        <>
        <View style={[styles.header_container]}>
            {/* HEADER */}
            <View style={styles.header}>
            <Icon_Wrapper style={styles.icon} action={() => props.navigation.goBack()}><FontAwesome5 name="chevron-left" size={24} color={colors.text_light_medium} /></Icon_Wrapper>
                <View style={styles.header_wrapper}>
                    <Image style={styles.image_small} source={{ uri: group_data.image }} />
                    <Text style={typography.header_4}>{group_data.name}</Text>
                    <Text style={[typography.extra_small, styles.text_medium]}>{group_data.members.length} members</Text>
                    {access_level < 3 ? ( null ) : (
                        <View style={containers.centered_row}>
                            <Pressable onPress={() => set_edit(true)} style={({pressed}) => [{opacity: pressed ? 0.7 : 1,}, styles.view_button]}><Text style={typography.small}>Edit</Text></Pressable>
                            <Pressable onPress={() => set_settings(true)} style={({pressed}) => [{opacity: pressed ? 0.7 : 1,}, styles.view_button]}><Text style={typography.small}>Manage</Text></Pressable>
                        </View>
                    )}
                </View>
                <Icon_Wrapper style={styles.icon} action={() => leave_handler()}><Ionicons name="exit-outline" size={24} color={colors.primary} /></Icon_Wrapper>
            </View>
            
            {/* MENU */}
            <View style={styles.menu}>
                <Pressable onPress={() => set_active_menu(0)} style={[typography.main, styles.menu_item, active_menu === 0 ? styles.menu_item_selected : null]}><Text style={[typography.main, {textAlign: 'center'}]}>Messages</Text></Pressable>
                <Pressable onPress={() => set_active_menu(1)} style={[typography.main, styles.menu_item, active_menu === 1 ? styles.menu_item_selected : null]}><Text style={[typography.main, {textAlign: 'center'}]}>Events</Text></Pressable>
                <Pressable onPress={() => set_active_menu(2)} style={[typography.main, styles.menu_item, active_menu === 2 ? styles.menu_item_selected : null]}><Text style={[typography.main, {textAlign: 'center'}]}>Members</Text></Pressable>
            </View>
        </View>
        {/* SELECTED CONTENT */}
        <View style={styles.content_wrapper}>
            {display_content[active_menu]}
        </View>
        </>
    );

    if(settings) return <Group_Settings close={set_settings} data={group_data} />
    if(edit) return <Edit_Group close={set_edit} data={group_data} />


    return ( 
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={40}>
            {access_level <= 1 || exit ? home : member_zone}
        </KeyboardAvoidingView>
    );
};

const circle_size = Dimensions.get('window').height / 12;

const styles = StyleSheet.create({
    text_medium: {
        color: colors.text_medium
    },
    container: {
        flex: 1,
        paddingBottom: 10
    },
    image: {
        alignSelf: 'center',
        height: 100, 
        width: 100,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 8
    },  
    image_small: {
        alignSelf: 'center',
        height: 50, 
        width: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 3
    },  
    wrapper: {
        paddingHorizontal: 30,
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: -10
    },
    content: {
        flex: 1,
        flexDirection: 'row', 
        flexWrap: 'wrap',
        width: "100%",
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        paddingVertical: 10
    },
    title: {
        marginBottom: 10,
        textAlign: 'center'
    },
    about: {
        width: "90%",
        textAlign: 'center',
        color: colors.text_medium,
        marginBottom: 10
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20, 
        paddingTop: 20, 
        paddingBottom: 10
    },
    header_wrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        width: "80%"
    },
    enter_icon: {
        position: "absolute",
        right: "10%",
        top: "0.5%",
    },
    icon: {
        flexBasis: "10%",
    },
    menu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },  
    menu_item: {
        flex: 1,
        textAlign: 'center',
        paddingBottom: 10,
        color: colors.text_light_medium
    },
    menu_item_selected: { 
        borderBottomWidth: 3,
        borderBottomColor: colors.text_dark,
        color: colors.text_dark
    },
    content_wrapper: {
        flex: 1,
        backgroundColor: colors.background_light,
        paddingHorizontal: 20,
    },
    all_members_icon: {
        height: circle_size, 
        width: circle_size,
        borderRadius: 100,
        backgroundColor: colors.background_light,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        textAlignVertical: 'center',

    },
    all_members_wrapper: {
        width: "25%",
        height: "25%",
        alignItems: 'center',
        justifyContent: 'center',
    }, 
    view_button: {
        paddingVertical: 5,
        width: 110,
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 50, 
        marginTop: 10,
        marginBottom: 5,
        marginHorizontal: 5,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },  
    details_wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: "100%",
        marginBottom: 10
    },
    details_item: {
        flexDirection: 'row',
        width: "33%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    details_item_text: {
        color: colors.text_medium,
        marginLeft: 5,
        textAlign: 'center'
    },
    messages_wrapper: {
        justifyContent: 'space-between',
        flex: 1
    },
    history: {
        height: 20,
        textAlignVertical: 'center',
        textAlign: 'center',
        backgroundColor: colors.secondary_light,
        borderRadius: 20,
        width: "80%",
        alignSelf: 'center',
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Group;


