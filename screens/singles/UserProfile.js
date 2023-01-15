import React, { useState, useRef, useContext, useCallback } from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable, Animated, PanResponder, ImageBackground, Image, FlatList, ScrollView } from 'react-native';
import { StatusBar } from 'react-native';
import { get_friends, get_users_communities, get_users_events, get_user_data, get_user_groups, get_user_joins} from '../../firebase/methods/User_Functions';
import typography from '../../styles/typography';
import colors from '../../assets/colors/colors';
import Locked from '../../components/Displays/Locked';
import Empty from '../../components/Displays/Empty';
import { useFocusEffect } from '@react-navigation/native';
import { calculate_age } from '../../tools/DateTime_Methods';
import { LinearGradient } from 'expo-linear-gradient';
import Loader_Page from '../../components/Displays/Loader_Page';
import Missing from '../../components/Displays/Missing';
import User_Action_Button from '../../components/Buttons/User_Action_Button';
import Alt_Header from '../../components/Headers/Alt_Header';
import global from '../../styles/global';
import Button_Main from '../../components/Buttons/Button_Main';
import containers from '../../styles/containers';
import { AuthContext } from '../../contexts/Auth.context';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { listenRealTimeUser } from '../../tools/Fetches';
import { Ionicons } from '@expo/vector-icons';


function UserProfile(props){  
    const data = props.route.params;
    const { user } = useContext(AuthContext)
    const [user_data, set_user_data] = useState(data);
    const [groups, set_groups] = useState([]);
    const [events, set_events] = useState([]);
    const [loader, set_loader] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if(data) {
                const unlistenUser = listenRealTimeUser(set_user_data, data.id)
                const fetch_data = async () => {
                    const g = await get_users_communities(data.id);
                    const e = await get_users_events(data.id);
                    set_groups(g);
                    set_events(e);
                }
                fetch_data()
                return () => { unlistenUser(); };
            }
        }, [])
      );

      
    if(!user_data) { return <Missing /> }


    return (    
    <ScrollView>
    <Alt_Header></Alt_Header>
    <View style={styles.container}>
        
        <View style={{alignItems: 'center', marginBottom: user_data.id === user ? 30 : 10}}>
            <Image style={[styles.image, global.bottom(10)]} source={{uri: user_data.image }} />
            <Text style={[typography.header_2, global.capitalize, global.bottom(10)]}>{user_data.name}</Text>
            <Text style={[typography.main_thin, global.text_light_medium]}>{user_data.location ? user_data.location : null}</Text>
        </View>

        {user_data.id === user ? null : (
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30, paddingHorizontal: 40}}>
            <User_Action_Button user_data={user_data} />
            <Pressable onPress={() => props.navigation.navigate("Chat", user_data)} style={styles.chat}><Ionicons name="md-chatbubbles-outline" size={24} color={colors.text_dark} /></Pressable>
        </View>
        )}

        <View style={global.bottom(40)}>
            <Text style={[typography.main, global.bottom(10)]}>Bio</Text>
            <Text style={[typography.main_paragraph, global.text_medium]}>{user_data.about}</Text>
        </View>

        <View style={global.bottom(30)}>
            <Text style={[typography.main, global.bottom(15)]}>Activity</Text>
            <View style={styles.activity}>
                <MaterialIcons name="event" size={25} color={colors.text_light} />
                <Text style={[typography.main_thin, {marginRight: 'auto', marginLeft: 15}]}>Events</Text>
                <View style={styles.icon}><Text style={typography.main_bold}>{events.length}</Text></View>
            </View>
            <View style={styles.activity}>
                <Feather name="command" size={25} color={colors.text_light} />
                <Text style={[typography.main_thin, {marginRight: 'auto', marginLeft: 15}]}>Communities</Text>
                <View style={styles.icon}><Text style={typography.main_bold}>{groups.length}</Text></View>
            </View>
            <View style={styles.activity}>
                <FontAwesome name="group" size={25} color={colors.text_light} />
                <Text style={[typography.main_thin, {marginRight: 'auto', marginLeft: 15}]}>Friends</Text>
                <View style={styles.icon}><Text style={typography.main_bold}>{user_data.friends.length}</Text></View>
            </View>
        </View>  

    </View>
    </ScrollView>
    )
}


// {user_data.id === user ? <View></View> : (
//     <View style={styles.section}>
//         <User_Action_Button user_data={user_data} />
//         <Button_Main hollow={true} action={() => props.navigation.navigate("Chat", user_data)}>Send Message</Button_Main>
//     </View>
//     )}

const windowHeight = (Dimensions.get('window').height * 85) / 100;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 25,
    },
    image: {
        resizeMode: 'cover',
        height: 120, 
        width: 120, 
        borderRadius: 120,
    }, 
    chat: {
        height: 55, 
        width: 55, 
        borderRadius: 55, 
        backgroundColor: colors.background_light,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20
    },
    activity: {
        backgroundColor: colors.background_light,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 75,
        marginBottom: 10,
    },
    icon: {
        height: 40, 
        width: 40, 
        borderRadius: 5, 
        backgroundColor: colors.text_light,
        alignItems: 'center',
        justifyContent: 'center'
    },
    display: {
        justifyContent: 'space-between',
        alignItems: 'center', 
    },
    display_image: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background_light,
        height: 75, 
        width: 75, 
        borderRadius: 75,
        marginBottom: 10
    },
    display_text: {
        color: colors.text_light
    }

});

export default UserProfile;