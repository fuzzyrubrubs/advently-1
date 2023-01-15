import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Text, View, StyleSheet, Pressable, Image, FlatList, ScrollView, ImageBackground, Animated, KeyboardAvoidingView, TextInput, RefreshControl, ActivityIndicator, StatusBar, Dimensions } from 'react-native';
import colors from '../../assets/colors/colors';
import typography from '../../styles/typography';
import { FontAwesome5, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import containers from '../../styles/containers';
import { db } from '../../firebase/Firebase';
import { add_event_comment, get_event_data, remove_joiner, send_email_invites } from '../../firebase/methods/Event_Functions';
import { get_friends, get_user_data, toggle_event_save } from '../../firebase/methods/User_Functions';
import Comment from '../../components/Items/Comment';
import global from '../../styles/global';
import { useFocusEffect } from '@react-navigation/native';
import { event_banner_format, event_format, event_expired, local_to_utc, utc_to_local, readable } from '../../tools/DateTime_Methods';
import { LocationContext } from '../../contexts/Location.context';
import { AuthContext } from '../../contexts/Auth.context';
import IDGenerator from '../../tools/IDGenerator';
import Button_Main from '../../components/Buttons/Button_Main';
import Event_Action_Button from '../../components/Buttons/Event_Action_Button';
import Locked from '../../components/Displays/Locked';
import Missing from '../../components/Displays/Missing';
import Loader_Page from '../../components/Displays/Loader_Page';
import Send_Message from '../../components/Buttons/Send_Message';
import Share_Button from '../../components/Buttons/Share_Button';
import Alt_Header from '../../components/Headers/Alt_Header';
import { group_types } from '../../tools/Global_Variables';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import Icon_Wrapper from '../../components/Displays/Icon_Wrapper';
import { listenRealTimeComments, listenRealTimeEvent } from '../../tools/Fetches';
import Edit_Event from '../events/Edit_Event';
import Event_Settings from '../events/Event_Settings';
import Members_Display from '../../components/Items/Members_Display';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import Event_Members from '../events/Event_Members';
import moment from 'moment';
import View_Button from '../../components/Buttons/View_Button';
import { Information } from '../../tools/Global_Components';


function Event(props){  
    const data = props.route.params; 

    const { user } = useContext(AuthContext);
    const { set_tabs_background_secondary, user_profile } = useContext(ProfileDataContext);
    const [event_data, set_event_data] = useState(data);
    const [comments, set_comments] = useState([]);

    const [event_saved, set_event_saved] = useState(user_profile.saved.includes(data.id))
    const [selected_option, set_selected_option] = useState(0);
    const [comment_input, set_comment_input] = useState("");
    const navigation = useNavigation();
    const { location, calculate_distance } = useContext(LocationContext);
    const [show_full_menu, set_show_full_menu] = useState(true);

    const [edit, set_edit] = useState(false);
    const [settings, set_settings] = useState(false);
    const [members, set_members] = useState(false);



    useFocusEffect(
        useCallback(async () => { 
            if(data) {
                const unlistenEvent = listenRealTimeEvent(set_event_data, data.id);
                const unlistenComments = listenRealTimeComments(set_comments, data.id);
                send_email_invites(user, data)
                return () => {
                    unlistenEvent();
                    unlistenComments();
                };
            } 
        }, [])
      );



    if(!event_data) { return <Missing /> };


    const format_date = moment(event_data.start.seconds).format('D MMMM');
    const format_weekday = moment(event_data.start.seconds).format('dddd');

    const utc = moment.unix(event_data.start.seconds).utc();
    const year = utc.format('YYYY')
    const month = utc.format('M')
    const day = utc.format('D')
    const hour = utc.format('H')
    const minute = utc.format('m')

    const image = { uri: event_data.image || null };
    const banner_date = event_data.start ? event_banner_format(event_data.start) : [];



    const access_level_handler = () => {
        if(event_data.admin === user) return 3
        if(event_data.mods.includes(user)) return 2
        if(event_data.invites.includes(user)) return 1
        if(event_data.members.includes(user)) return 1
        return 0
    };
    const access_level = access_level_handler();


    const expired = event_expired(event_data.start);
    const full = event_data.members.length >= event_data.slots;

    const comment_handler = async () => {
        if(comment_input.length > 0) {
            const comment_id = IDGenerator();
            const status = await add_event_comment(event_data.id, event_data.name, user_profile, comment_id, comment_input);
            if(status === true) { set_comment_input(""); };
        }
    };

    const save_event_handler = (status) => {
        set_event_saved(prevState => !prevState);
        toggle_event_save(user, event_data.id, !status);
    };


    // PRIVATE
    const content_private = (
        <View>
            <Locked />
        </View>
    );


    if(edit) return <Edit_Event data={event_data} close={set_edit} />
    if(settings) return <Event_Settings data={event_data} close={set_settings} />
    if(members) return <Event_Members data={event_data} close={set_members} />



    return ( 
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null}  keyboardVerticalOffset={50}>
            <ScrollView contentContainerStyle={{paddingBottom: 30}} showsVerticalScrollIndicator={false}>
                {/* HEADER */}
                <ImageBackground style={styles.image_background} imageStyle={styles.image} source={image}>
                    {/* <LinearGradient colors={['transparent', '#ffffff05', '#ffffff']} style={styles.gradient}> */}
                    <View style={styles.header_wrapper}>
                        <Icon_Wrapper filled={true} action={() => navigation.goBack()}><FontAwesome5 name="chevron-left" size={24} color={colors.white} /></Icon_Wrapper>
                        <Icon_Wrapper filled={true} action={() => save_event_handler(event_saved)}>{event_saved ? <FontAwesome name="bookmark" size={24} color={colors.primary} /> : <FontAwesome name="bookmark-o" size={24} color={colors.white} />}</Icon_Wrapper>
                    </View>
                    {/* </LinearGradient> */}
                </ImageBackground>

                {/* CONTENT  */}         
                <View style={[{marginTop: -7, borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: colors.white, paddingHorizontal: 25}]}>
                
         
                {/* EVENT NAME  */}
                <View style={styles.section}>
                    <Text style={[typography.header_2, global.text_dark, global.capitalize, global.bottom(10)]}>{event_data.name}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        
                        <Text style={[typography.main_thin, global.text_light_medium]}>{event_data.private_status ? "Private" : "Open"}</Text>
                        <Entypo name="dot-single" size={15} color={colors.text_light} />
                        <Text style={[typography.main_thin, global.text_light_medium]}>{event_data.members.length} going</Text>
                        {location && event_data.coordinates ? (
                            <>
                            <Entypo name="dot-single" size={15} color={colors.text_light} />
                            <Text style={[typography.main_thin, global.text_light_medium]}>{`${calculate_distance(event_data.coordinates.latitude, event_data.coordinates.longitude)} miles`}</Text>
                            </>
                        ) : null}
                    </View>
                </View>


            {/* ADMIN STUFF  */}
            {access_level < 2 || expired ? ( null ) : (
            <View style={{marginTop: 10}}>
                <View style={containers.centered_row}>
                    <View_Button action={() => set_edit(true)}>Edit</View_Button>
                    <View_Button action={() => set_settings(true)}>Invites</View_Button>
                </View>
            </View>
                )}

            {/* DATE */}
            <View style={styles.section}>
                <Text style={[typography.header_3, global.text_dark]}>{event_data.time} - {banner_date[2] || null}, {banner_date[0] || null} {banner_date[1] || null}</Text>
            </View>

             {/* ACTION BUTTON */}
             <View style={styles.section}>
                { expired ? <Information>This event has finished.</Information> : full && !event_data.members.includes(user) ? <Information>This event is full.</Information> : <Event_Action_Button data={event_data}  /> }  
            </View>

            {/* GOING  */}
            <View style={[styles.section]}>
                <Text style={[typography.header_5, styles.section_header]}>People</Text>
                <Pressable style={styles.organiser} onPress={() => set_members(true)}>
                    <View>
                        <Text style={[typography.main, styles.details, global.text_medium, global.bottom(10)]}>{event_data.slots - event_data.members.length} Available Places</Text>
                        <Members_Display amount={7} users={event_data.members}>Confirmed Going</Members_Display>
                    </View>
                    <FontAwesome5 name="chevron-right" size={20} color={colors.text_light_medium} />     
                </Pressable>
            </View>

           {/* LOCATION */}
            <View style={styles.section}>
                <Text style={[typography.header_5, styles.section_header]}>Location</Text>
                <Text style={[typography.main, styles.details]}>
                    {access_level === 0  ? "Address hidden" : (event_data.location ? event_data.location : "Address not found")}
                </Text>             
            </View>

        
            {/* ORGANISER */}
            <View style={styles.section}>
                <Text style={[typography.header_5, styles.section_header]}>Organiser</Text>
                    <Pressable onPress={event_data.group_id ? () => navigation.navigate("Group", event_data.organiser) : () => navigation.navigate("UserProfile", event_data.organiser)}  style={styles.organiser}>
                        <Image style={styles.organiser_image} source={{uri: event_data.organiser.image}} />
                        <View style={styles.organiser_content}>
                            <Text style={[typography.main, global.bottom(5)]}>{event_data.organiser.name}</Text>
                            <Text style={[typography.main_thin, global.text_light_medium]}>{event_data.group_id ? group_types[event_data.organiser.type] : "User"}</Text>
                        </View>
                        <FontAwesome5 name="chevron-right" size={20} color={colors.text_light_medium} />        
                    </Pressable>
            </View>

            {/* ABOUT */}         
            <View style={styles.section}>
                <Text style={[typography.header_5, styles.section_header]}>About</Text>
                <Text style={[typography.main, styles.details]}>
                    {event_data.details.split('\n').map((item, key) => <Text key={key}>{item}{"\n"}</Text>)}
                </Text>
            </View>

            {/* COMMENTS */}
            <View style={styles.section}>
                <Text style={[typography.header_5, styles.section_header]}>Comments</Text>
                <View >
                    <View style={styles.comments}>
                        {comments.length === 0 ? <Text style={[typography.main_thin, global.text_light_medium, {marginVertical: 10}]}>No comments yet, be the first!</Text> : null}
                        <FlatList key={'1'}data={comments} extraData={comments} renderItem={({ item }) => ( <Comment data={item} access={item.data.id === user || access_level === 3} /> ) } keyExtractor={(item, index) => item.comment_id} inverted contentContainerStyle={{ flexDirection: 'column-reverse' }} showsVerticalScrollIndicator={true} />
                    </View>
                    <Send_Message valid={true} value={comment_input} input={set_comment_input} action={() => comment_handler()}>Write comment...</Send_Message>
                </View>
            </View>


            {/* SHARE */}
            <Share_Button box={true} type="event" id={event_data.id} />
     
        </View>
            

            </ScrollView>

           
        </KeyboardAvoidingView>
    );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    },
    content: {
        paddingHorizontal: 20,
        flex: 1,
        backgroundColor: colors.white,
        paddingTop: 20
    },
    scroll: {
        paddingHorizontal: 25,
        flexGrow: 1,
        backgroundColor: colors.white,
        paddingTop: 20,
        paddingBottom: 50
    },  
    main: {  
        position: "absolute",
        bottom: 0,
        height: 165,
        width: "100%",   
        backgroundColor: colors.secondary, 
        justifyContent: 'space-evenly'
    },
    section: {
        marginTop: 30
    },
    section_header: {
        marginBottom: 10
    },
    main_wrapper: {
        paddingHorizontal: 25
    },
    header_wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 20
    },
    header_icon: {
        width: 55,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    header_title: {
        color: colors.text_medium,
        flex: 1,
        textAlign: 'center'
    },  
    image_background: {
        height: 500,
        justifyContent: "space-between"
    },
    image: {
        backgroundColor: colors.secondary,
    },
    gradient: {
        height: "100%"
    },
    event_header: {
        textTransform: 'capitalize',
        color: colors.white,     
        fontSize: 18,
        lineHeight: 20,
        fontFamily: 'Ubuntu-Medium'
    }, 
    event_date: {
        color: colors.text_light,
    },
    group_name: {
        color: colors.text_light,
    },
    organiser: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 15,
        alignItems: 'center',
        backgroundColor: colors.background_light,
        borderRadius: 15,
    },
    organiser_image: {
        backgroundColor: colors.secondary,
        height: 60, 
        width: 60, 
        borderRadius: 60
    },
    organiser_content: {
        textAlign: 'left',
        marginRight: 'auto',
        marginLeft: 15
    },
    location: {
        marginTop: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    location_text: {
        color: colors.text_medium,
        fontSize: 15,
        paddingLeft: 10
    },
    calender: {
        flexDirection: 'row',
        //width: "90%",
        backgroundColor: colors.primary,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingVertical: 7,
        elevation: 5,
        //alignSelf: 'center',
    },
    privacy: {
        fontFamily: 'Ubuntu-Medium',
        fontSize: 15,
        color: colors.white,
    },
    overview_item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        width: "90%"
    },
    overview_category: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    overview_header: {
        color: colors.text_medium,
        marginLeft: 15
    },
    overview_info: {
        width: 120
    }, 
    details: {
        color: colors.text_medium,
        fontFamily: 'Ubuntu-Regular'
    },



    menu2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginBottom: 5,
    },
    menu2_selected: {
        opacity: 1,
    },  
    menu2_header_icon: {
        opacity: 0.5,
    },
    menu2_header: {
        alignItems: 'center', 
        justifyContent: 'center',
        marginTop: -35,
        backgroundColor: colors.secondary,
        height: 50, 
        width: 50,
        borderRadius: 50,
        borderColor: colors.background_light, 
        elevation: 5,
        borderWidth: 3,
        
    }, 



    comments: {
        justifyContent: 'space-between',
        flex: 1,
    },

    going: {
        backgroundColor: colors.background_light,
        paddingHorizontal: 15,
        paddingVertical: 20, 
        borderRadius: 15
    }

})

export default Event;

