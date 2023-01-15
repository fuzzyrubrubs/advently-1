import React, { useState, useContext, useCallback } from 'react';
import { StyleSheet, Text, View, Image, Pressable, BackHandler, RefreshControl } from 'react-native';
import { AuthContext } from '../../contexts/Auth.context';
import { get_user_profile, update_my_profile, get_friends } from '../../firebase/methods/User_Functions';
import typography from '../../styles/typography';
import colors from '../../assets/colors/colors';
import { MaterialIcons } from '@expo/vector-icons';
import Button_Main from '../../components/Buttons/Button_Main';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../components/Displays/Loader';
import { FontAwesome5 } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import containers from '../../styles/containers';
import global from '../../styles/global';
import { search_direct_messages } from '../../firebase/methods/Message_Functions';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import Icon_Wrapper from '../../components/Displays/Icon_Wrapper';
import Edit_Profile from './Edit_Profile';
import Settings from './Settings';
import View_Button from '../../components/Buttons/View_Button';


function MyProfile({ navigation }){  
    const { user, sign_out } = useContext(AuthContext);
    const { user_profile, unread_chats, requests } = useContext(ProfileDataContext);
    const [do_not_disturb, set_do_not_disturb] = useState(user_profile.dnd_notifications);
    const [account_private, set_account_private] = useState(user_profile.private);
    const [loader, set_loader] = useState(false);
    const [edit, set_edit] = useState(false);
    const [settings, set_settings] = useState(false);

    const handleBackButtonClick = () => { navigation.navigate("Events", { screen: 'Events' }); return true; }
    
    useFocusEffect(
        React.useCallback(() => {
            BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
                };
        }, [])
    );

    const notifications_handler = (status) => {
        set_do_not_disturb(do_not_disturb => !do_not_disturb);
        update_my_profile(user, {dnd_notifications: status});
        update_my_profile(user, {dnd_emails: status});
    }

    const privacy_handler = (status) => {
        set_account_private(account_private => !account_private);
        update_my_profile(user, {private: status})
    }

    const sign_out_handler = () => {
        update_my_profile(user, {device_id: null});
        sign_out();
    }
    
    const on = <MaterialIcons name="do-not-disturb-on" size={30} color={colors.white} />
    const off = <MaterialIcons name="do-not-disturb-off" size={30} color={colors.white} />

    if(edit) return <Edit_Profile close={set_edit} />
    if(settings) return <Settings close={set_settings} />
    
    return (    
        <ScrollView contentContainerStyle={styles.container} >
            <View style={styles.header_wrapper}>
                <View style={styles.image_wrapper}>
                    <Icon_Wrapper action={() => navigation.navigate("Chats", {user_id: user, friends: user_profile.friends})}>
                        <FontAwesome5 name="inbox" size={24} color={colors.text_light_medium} />
                        {unread_chats > 0 ? <View style={global.badge(true)}><Text style={global.badge_text}>{unread_chats}</Text></View> : null} 
                    </Icon_Wrapper>
                    <Image style={global.image_round} source={{uri: user_profile.image}} />
                    <Icon_Wrapper action={() => set_settings(true)}>
                        <FontAwesome5 name="cog" size={24} color={colors.text_light_medium} />
                    </Icon_Wrapper>
                </View>
                <Text style={[typography.header_2, styles.name]}>{user_profile.name}</Text>
                <Text style={[typography.main, styles.email]}>{user_profile.email}</Text>

                <View style={containers.centered_row}>
                    <View_Button action={() => set_edit(true)}>Edit Profile</View_Button>
                    <View_Button action={() => navigation.navigate("UserProfile", user_profile)}>View Profile</View_Button>
                </View>
            </View>

            <View style={containers.main}>

                <Text style={typography.label}>Notifications</Text>
                <Pressable onPress={() => notifications_handler(!do_not_disturb)} 
                    style={({pressed}) => [{opacity: pressed ? 0.5 : 1}, styles.item_wrapper]}>
                    <View style={styles.item_icon}>{do_not_disturb ? on : off}</View>
                    <View>
                        <Text style={[typography.main_bold, styles.text_white]}>
                            Do not disturb
                        </Text>
                        <Text style={[typography.small, styles.text_grey]}>
                            {do_not_disturb ? "On" : "Off"}
                        </Text>
                    </View>
                </Pressable>

                <Text style={typography.label}>Privacy</Text>
                <Pressable onPress={() => privacy_handler(!account_private)} 
                    style={({pressed}) => [{opacity: pressed ? 0.5 : 1}, styles.item_wrapper]}>
                    <View style={styles.item_icon}>{account_private ? on : off}</View>
                    <View>
                        <Text style={[typography.main_bold, styles.text_white]}>
                            Account private
                        </Text>
                        <Text style={[typography.small, styles.text_grey]}>
                            {account_private ? "On" : "Off"}
                        </Text>
                    </View>
                </Pressable>
                
                <Text style={typography.label}>Manage</Text>
                <View style={styles.bundled_wrapper}>
                    <Pressable onPress={() => navigation.navigate("Friends")} 
                        style={({pressed}) => [{opacity: pressed ? 0.5 : 1}, styles.item_wrapper_half]}>
                        <Text style={[typography.extra_small, styles.item_half_text]}>{user_profile.friends.length} Friends</Text>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("Requests")} 
                        style={({pressed}) => [{opacity: pressed ? 0.5 : 1}, styles.item_wrapper_half]}>
                        <Text style={[typography.extra_small, styles.item_half_text]}>{requests.length} Requests</Text>
                    </Pressable>
                </View>

                <View style={styles.logout}><Button_Main action={() => sign_out_handler()}>Log out</Button_Main></View>
            </View>
            
        </ScrollView>  
    )
}

const styles = StyleSheet.create({
    container: { justifyContent: 'space-evenly' },
    header_wrapper: { 
        alignItems: 'center',
        paddingTop: 30
    },  
    image_wrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: "85%"
    },
    image: {
        backgroundColor: colors.secondary,
        borderRadius: 100,
        height: 115,
        width: 115,
        marginTop: 40
    },
    name: { marginTop: 10 },
    email: { color: colors.secondary },
    text_white: { color: colors.white },
    text_grey: { color: colors.text_medium },
    item_wrapper: {
        backgroundColor: colors.secondary,
        height: 80,
        width: "100%",
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    item_icon: {
        height: 45, 
        width: 45,
        borderRadius: 45,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20
    },  
    bundled_wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    item_wrapper_half: {
        backgroundColor: colors.secondary,
        height: 80,
        width: "49%",
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5
    },
    item_half_text: {
        color: colors.text_light,
        textAlign: 'center'
    },  
    logout: { marginVertical: 20 },


});

export default MyProfile;