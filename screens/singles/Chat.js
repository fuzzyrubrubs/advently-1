import React, { useContext, useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Image, FlatList, ScrollView, ImageBackground, Animated, KeyboardAvoidingView, Modal, TextInput, RefreshControl, ActivityIndicator, StatusBar } from 'react-native';
import colors from '../../assets/colors/colors';
import typography from '../../styles/typography';
import { FontAwesome5, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import containers from '../../styles/containers';
import { db } from '../../firebase/Firebase';
import { add_event_comment, get_event_data } from '../../firebase/methods/Event_Functions';
import { get_user_data, toggle_event_save } from '../../firebase/methods/User_Functions';
import Comment from '../../components/Items/Comment';
import global from '../../styles/global';
import { useFocusEffect } from '@react-navigation/native';
import { event_banner_format, event_format, event_expired, local_to_utc, utc_to_local, readable, event_preview_array_format, chat_date_format } from '../../tools/DateTime_Methods';
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
import { group_types, pressed_opacity } from '../../tools/Global_Variables';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import { create_chat, send_direct_message, read_direct_message, delete_chat, toggle_block_chat } from '../../firebase/methods/Message_Functions';
import Direct_Message from '../../components/Items/Direct_Message';
import generatePushID from '../../tools/IDGenerator';
import { format_messages, get_chat_id } from '../../tools/Global_Functions';


function Chat(props){  
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const { user_profile } = useContext(ProfileDataContext);
    // const contact = props.route.params;
    const contact_id = props.route.params.id ? props.route.params.id : props.route.params;
    const [message_input, set_message_input] = useState("");
    const [messages, set_messages] = useState([]);
    const chat_id = get_chat_id(user, contact_id)
    const [display_options, set_display_options] = useState(false);
    const [blocked, set_blocked] = useState(false);
    const [block, set_block] = useState(false);
    const [loader, set_loader] = useState(false);
    const [contact, set_contact] = useState(props.route.params.id ? props.route.params : {})


    const fetch_data = async () => {
        const contact_data = await get_user_data(contact_id);
        set_contact(contact_data);
    };

    useFocusEffect(
        React.useCallback( () => { 
            read_direct_message(chat_id);

            if(contact.id === undefined) { fetch_data(); };

            const unsub_comments = db.collection("chats").doc(chat_id).onSnapshot(doc => {
                if(doc.data() === undefined) return;
                set_messages(doc.data().messages);
                set_blocked(doc.data().blocked.includes(contact.id))
                set_block(doc.data().blocked.includes(user))
            });
            const unsubscribe = () => { unsub_comments() }
            return () => unsubscribe();
        }, [])
      );


      if(loader) { return <Loader_Page /> }
    
      const error_handler = () => {
          alert("Failed to send message");
      }

      const message_handler = async () => {
          if(message_input === "") return;
          if(messages.length === 0) { create_chat(chat_id, user_profile, contact.id, message_input); set_message_input(""); return }
          send_direct_message(chat_id, user_profile, contact.id, message_input).then(result => result === true ? set_message_input("") : error_handler());
      }

      const delete_chat_handler = () => {
          delete_chat(chat_id, user).then(result => result === true ? navigation.goBack() : alert("Delete failed"));
      };
      const block_handler = () => {
          toggle_block_chat(chat_id, user, block).then(result => result === true ? set_block(block => !block) : alert("Failed"));
         
      };

    
    const options = (
        <Modal animationType="fade" transparent={true} visible={display_options} onRequestClose={() => {set_display_options(false);}}>
            <Pressable style={styles.modal} onPress={() => {set_display_options(false);}}>
            <View style={[styles.options, global.shadow]}>
                <View style={styles.options_icon}><FontAwesome name="user" size={44} color={colors.text_light} /></View>
                <Text style={typography.header_5}>{contact.name}</Text>
                <View style={styles.options_wrapper}>
                    <Button_Main action={delete_chat_handler}>Delete Chat</Button_Main>
                    <Button_Main action={block_handler}>{block ? "Unblock User" : "Block User"}</Button_Main>
                </View>
            </View>
            </Pressable>
        </Modal>
        )

    return ( 
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={40}>
            {/* HEADER */}
            <View style={styles.header_wrapper}>
                <Pressable style={styles.header_icon} onPress={() => navigation.goBack()}><FontAwesome5 name="chevron-left" size={24} color={colors.text_light_medium} /></Pressable>
                <Pressable style={({pressed}) => [{backgroundColor: pressed ? colors.background_light : colors.white}, styles.header_content]} onPress={() => navigation.navigate("UserProfile", contact)}> 
                    <Image style={styles.header_avatar} source={{ uri: contact.image }} />
                    <View style={styles.header_title}>
                        <Text style={typography.main_bold}>{contact.name}</Text>
                    </View>
                </Pressable>
                <View style={styles.header_icon}><Pressable onPress={() => set_display_options(d => !d)}><Ionicons name="ios-ellipsis-vertical" size={22} color={colors.text_light_medium} /></Pressable></View>       
                {display_options ? options : null}
            </View>


            <View style={styles.content}>
                <View style={styles.comments}>
                    <FlatList key={'directmessages'} 
                    ListFooterComponent={blocked ? <Text style={[typography.small, global.information]}>You cannot reply to this person</Text> : <Send_Message valid={true} value={message_input} input={set_message_input} action={() => message_handler()}>Write message...</Send_Message>} 
                    data={format_messages(messages)} extraData={format_messages(messages)} 

                    renderItem={({ item }) => {
                        return (
                            <View>
                                <Text style={[typography.small, styles.date]}>{chat_date_format(item.date)}</Text>
                                {item.messages.map((message, index) => <Direct_Message data={message} sender={message.sender === user} key={index} /> )}
                            </View>
                                ) 
                            }
                        }

                    keyExtractor={(item, index) => index.toString()} 
                    inverted contentContainerStyle={{ flexDirection: 'column-reverse' }} 
                    showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always" />
                </View>
            </View>
    
        </KeyboardAvoidingView>
    );
};

export default Chat;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        paddingBottom: 10
    },
    content: {
        paddingHorizontal: 20,
        flex: 1,
        backgroundColor: colors.background_light,
    },   
    comments: {
        paddingBottom: 10,
        justifyContent: 'space-between',
        flex: 1
    },
    header_wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: colors.white,
        elevation: 1
    },
    header_content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 20
    },  
    header_avatar: {
        height: 40, 
        width: 40, 
        borderRadius: 40,
        marginRight: 15
    },  
    header_icon: {
        width: 30,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    date: {
        textAlign: 'center',
        color: colors.text_light_medium,
        marginVertical: 20
    },
    options: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: colors.white,
        zIndex: 1,
        padding: 10,
        width: 280, 
        height: 220,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: 20
    },
    options_icon: {
        marginTop: -55,
        borderWidth: 2,
        borderColor: colors.text_light,
        borderRadius: 70,
        width: 70,
        height: 70,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    options_wrapper: {
       width: "100%"
    },  
    options_button: {
        
    },  
    modal: {
        height: "100%",
        width: "100%",
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center', 
        justifyContent: 'center'
    }
})


