import React, { useEffect, useState, useMemo, useCallback, useContext } from 'react';
import { StyleSheet, Pressable, View, Image, Text, Modal, Dimensions, ActivityIndicator } from 'react-native';
import colors from '../../assets/colors/colors';
import { get_user_data } from '../../firebase/methods/User_Functions';
import typography from '../../styles/typography';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import Pop_Menu from '../Displays/Pop_Menu';
import Button_Main from '../Buttons/Button_Main';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import User_Action_Button from '../Buttons/User_Action_Button';
import { MaterialIcons } from '@expo/vector-icons';
import { make_group_mod, remove_group_mod, remove_member } from '../../firebase/methods/Group_Functions';


function Member(props){
    const data = props.data;
    const navigation = useNavigation();
    const type = props.type;
    const group = props.group;
    const [user_data, set_user_data] = useState({});
    const [display_options, set_display_options] = useState(false);
    const [loader, set_loader] = useState(true);


    useEffect(() => {
        const fetch = async () => {
            const u = await get_user_data(data)
            set_user_data(u);
            set_loader(false);
        };
        fetch();
    }, [])

    const remove_handler = () => {
        set_display_options(false);
        remove_member(data, group.id);
    };
    const make_mod_handler = () => make_group_mod(data, group);
    const remove_mod_handler = () => remove_group_mod(data, group);


    return (
            <Pressable 
                style={({pressed}) => [{backgroundColor: pressed ? colors.background_medium : null }, styles.container]} 
                onPress={() => navigation.navigate('UserProfile', user_data)} 
                onLongPress={props.access ? () => set_display_options(true) : null}
                >
                {props.status === 5 ? <Text style={[typography.small, styles.mod]}>Organiser</Text> : props.status === 4 ? <Text style={[typography.small, styles.mod]}>Mod</Text> : null}
                {loader ? <View style={styles.loader}></View> : (

                    <Image style={styles.image} source={{uri: user_data.image }} />

                )}

                <Text style={[typography.main, styles.name]}>{user_data.name ? user_data.name.split(" ")[0] : null}</Text>

                <Pop_Menu data={user_data} visible={display_options} close={set_display_options}>
                    <Button_Main action={() => navigation.navigate("UserProfile", user_data)}>View Profile</Button_Main>
                    {props.status === 5 ? null : props.status === 4 && props.admin ?  <Button_Main action={remove_mod_handler}>Depromote</Button_Main> : props.status < 4 ? <Button_Main action={make_mod_handler}>Promote</Button_Main> : null}
                    {props.status == 5 ? null : <Button_Main action={remove_handler}>Remove Member</Button_Main>}
                </Pop_Menu>
            </Pressable>
    )
}

function Joiner(props){
    const data = props.data;
    const navigation = useNavigation();
    const type = props.type;
    const [user_data, set_user_data] = useState({});
    const [display_options, set_display_options] = useState(false);
    const [loader, set_loader] = useState(true);


    useEffect(() => {
        const fetch = async () => {
            const u = await get_user_data(data)
            set_user_data(u);
            set_loader(false);
        };
        fetch();
    }, [])

    const icons = [
        <AntDesign name="closecircle" size={24} color={colors.red} />, 
        <AntDesign name="clockcircle" size={24} color={colors.orange} />, 
        <AntDesign name="checkcircle" size={24} color={colors.green} />,
        <AntDesign name="checkcircle" size={24} color={colors.green} />,
        <AntDesign name="checkcircle" size={24} color={colors.green} />,
    ];

    const remove_handler = () => {
        set_display_options(false);
        props.press(data);
    }

    const remove_invite_handler = () => {
        set_display_options(false);
        props.alt_press(data);
    }

    return (
            <Pressable 
                style={props.access ? ({pressed}) => [{backgroundColor: pressed ? colors.background_medium : null }, styles.container] : null} 
                onPress={() => navigation.navigate('UserProfile', user_data)} 
                onLongPress={props.access ? () => set_display_options(true) : null}
                >
                <View style={styles.icon}>{icons[props.status]}</View>
                {props.status === 4 ? <Text style={[typography.small, styles.mod]}>Organiser</Text> : props.status === 3 ? <Text style={[typography.small, styles.mod]}>Mod</Text> : null}
                {loader ? <View style={styles.loader}></View> : (
                    <Image style={styles.image} source={{uri: user_data.image }} />

                )}

                <Text style={[typography.main, styles.name]}>{user_data.name ? user_data.name.split(" ")[0] : null}</Text>

                <Pop_Menu data={user_data} visible={display_options} close={set_display_options}>
                    <Button_Main action={() => navigation.navigate("UserProfile", user_data)}>View Profile</Button_Main>
                    {props.status === 1 ? <Button_Main action={remove_invite_handler}>Remove Invite</Button_Main> : null}
                    {props.status === 2 ? <Button_Main action={remove_handler}>Remove Member</Button_Main> : null}
                    {props.status === 3 && props.admin ? <Button_Main action={remove_handler}>Remove Member</Button_Main> : null}
                </Pop_Menu>
            </Pressable>
    )
}


function Invite(props){
    const data = props.data;
    const status = props.status;
    const [user_data, set_user_data] = useState({});
    const [loader, set_loader] = useState(true);
    const [sending, set_sending] = useState(false);

    const fetch = useCallback(async () => {
        const u = await get_user_data(data)
        set_user_data(u);
        set_loader(false);
    });


    useEffect(() => {
        fetch();
    }, [])

    const press_handler = async () => {
        set_sending(true);   
        await props.press(data, status)
        setTimeout(() => {
            set_sending(false) 
        }, 1000);
    }

    const icons = [
        <AntDesign name="pluscircleo" size={24} color={colors.text_light} />, 
        <AntDesign name="closecircle" size={24} color={colors.red} />, 
        <AntDesign name="clockcircle" size={24} color={colors.orange} />, 
        <AntDesign name="checkcircle" size={24} color={colors.green} />,
    ];

    return (
            <Pressable onPress={press_handler}  style={({pressed}) => [{backgroundColor: pressed ? colors.text_light : "transparent"}, styles.container]}>
                <View style={styles.icon}>{sending ? <ActivityIndicator size="small" color={colors.primary} /> : icons[props.status]}</View>
                {loader ? <View style={styles.loader}></View> : ( 
                <View>
                    <Image style={styles.image} source={{uri: user_data.image }} />
                </View> )}
                <Text style={[typography.main, styles.name]}>{user_data.name ? user_data.name.split(" ")[0] : ""}</Text>
            </Pressable>
    )
}


function Simple(props){
    const data = props.data;
    const [user_data, set_user_data] = useState({});
    const [loader, set_loader] = useState(true);


    useEffect(() => {
        const fetch = async () => {
            const u = await get_user_data(data)
            set_user_data(u);
            set_loader(false);
        };
        fetch();
    }, [])


    return (
        <View style={styles.simple}>
            <Image style={styles.simple_icon} source={{uri: user_data.image}} />
        </View>
    )
}

function Chat(props){
    const data = props.data;
    const [user_data, set_user_data] = useState({});
    const [loader, set_loader] = useState(true);
    const navigation = useNavigation();

    const fetch = useCallback(async () => {
        const u = await get_user_data(data)
        set_user_data(u);
        set_loader(false);
    });


    useEffect(() => {
        fetch();
    }, [])

    const icons = [
        <FontAwesome name="circle" size={14} color={colors.green} />
    ];

    return (
            <View style={styles.chat}>
                <View style={styles.icon}></View>
                {loader ? <View style={styles.loader}></View> : ( 
                <Pressable onPress={() => navigation.navigate("Chat", user_data)} >
                    <Image style={styles.image} source={{uri: user_data.image }} />
                </Pressable> )}
                <Text style={[typography.main, styles.name]}>{user_data.name ? user_data.name.split(" ")[0] : ""}</Text>
            </View>
    )
}

function User(props){
    const { user_profile } = useContext(ProfileDataContext);
    const data = props.data;
    const navigation = useNavigation();
    const [user_data, set_user_data] = useState(!props.no_query ? data : {});
    const [display_options, set_display_options] = useState(false);
    const [loader, set_loader] = useState(true);
    const [status, set_status] = useState(0);


    useEffect(() => {
        const fetch = async () => {
            const u = await get_user_data(data)
            set_user_data(u);
            set_loader(false);
            if(user_profile.friends.includes(data)) return set_status(3);
            if(user_profile.requests.includes(data)) return set_status(2);
            if(u.requests.includes(user_profile.id)) return set_status(1);
            return set_status(0)
        };
        if(!props.no_query) {
            fetch();
        } else {
            set_loader(false);
            if(user_profile.friends.includes(data.id)) return set_status(3);
            if(user_profile.requests.includes(data.id)) return set_status(2);
            if(data.requests.includes(user_profile.id)) return set_status(1);
            return set_status(0)
        }
    }, [])

    const icons = [
        null,
        <AntDesign name="clockcircle" size={24} color={colors.orange} />,
        <AntDesign name="clockcircle" size={24} color={colors.orange} />, 
        null,
    ];


    return (
            <Pressable onPress={() => set_display_options(true)} style={({pressed}) => [{backgroundColor: pressed ? colors.background_medium : null}, styles.container]}>
                <View style={styles.icon}>{icons[status]}</View>
                {loader ? <View style={styles.loader}></View> : <Image style={styles.image} source={{uri: user_data.image }} />}

                <Text style={[typography.main, styles.name]}>{user_data.name ? user_data.name.split(" ")[0] : ""}</Text>

                <Pop_Menu data={user_data} visible={display_options} close={set_display_options}>
                    <Button_Main action={() => navigation.navigate("UserProfile", user_data)}>View Profile</Button_Main>
                    <User_Action_Button user_data={user_data} />
                </Pop_Menu>
            </Pressable>
    )
}


export { Simple, Invite, Member, Chat, User, Joiner };








const circle_size = Dimensions.get('window').height / 12;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 5,
        width: "25%",
        height: 120,
        textAlign: 'center',
        borderRadius: 10,
        paddingTop: 5,
    },
    chat: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 5,
        marginTop: 5,
        marginRight: 15,
        height: 120,
        textAlign: 'center',
    },
    image: {
        height: 75,
        width: 75,
        borderRadius: 80,
        marginBottom: 5,
    },
    loader: {
        height: 75,
        width: 75,
        borderRadius: 80,
        marginBottom: 5,
        backgroundColor: colors.text_light_medium
    },
    name: {
        textAlign: 'center',
        width: 75,
    },
    icon: {
        position: 'absolute',
        zIndex: 5,
        right: 5,
        top: 55,
        backgroundColor: colors.white,
        borderRadius: 20
    }, 
    mod: {
        position: 'absolute',
        zIndex: 5,
        bottom: 3,
        color: colors.text_light_medium
    }, 
    simple: {
        width: "25%",
        height: "25%",
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 3
    },
    simple_icon: {
        height: circle_size, 
        width: circle_size,
        borderRadius: 100,
        backgroundColor: colors.secondary,
    },
  
})