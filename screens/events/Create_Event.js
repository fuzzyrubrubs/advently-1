import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput, ImageBackground, Pressable, FlatList, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import { create_event, get_event_data, update_my_event } from '../../firebase/methods/Event_Functions';
import { get_groups_templates, get_group_data } from '../../firebase/methods/Group_Functions';
import { upload_event_image, get_event_image } from '../../firebase/methods/Storage_Functions';
import containers from '../../styles/containers';
import typography from '../../styles/typography';
import global from '../../styles/global';
import colors from '../../assets/colors/colors';
import { FontAwesome } from '@expo/vector-icons';
import Button_Main from '../../components/Buttons/Button_Main';
import { Entypo } from '@expo/vector-icons';
import IDGenerator from '../../tools/IDGenerator';
import { AuthContext } from '../../contexts/Auth.context';
import { select_image_handler } from '../../tools/Upload_Methods';
import Dates_list from '../../components/Lists/Dates_List';
import { populate_90_days } from '../../tools/DateTime_Methods';
import Selection_Box from '../../components/Items/Selection_Box';
import Alt_Header from '../../components/Headers/Alt_Header';
import Loader_Page from '../../components/Displays/Loader_Page';
import Text_Input from '../../components/Items/Text_Input';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import GoogleAddress from '../../components/Items/GoogleAddress';
import { FontAwesome5 } from '@expo/vector-icons';
import { group_types } from '../../tools/Global_Variables';
import { Ionicons } from '@expo/vector-icons';
import Event_Invites from './Manage/Event_Invites';
import { listenRealTimeEvent } from '../../tools/Fetches';

function Create_Event(props){ 
    const [id, set_id] = useState(IDGenerator());
    const [stage, set_stage] = useState(0);
    const [status, set_status] = useState("");
    const [loader, set_loader] = useState(false);
    const [page_loader, set_page_loader] = useState(true);
    const { user } = useContext(AuthContext);
    const { groups } = useContext(ProfileDataContext)


    const [groups_data, set_groups_data] = useState([]);
    const [groups_events_data, set_groups_events_data] = useState([]);
    const [selected_group, set_selected_group] = useState(null);


    const [date_selected, set_date_selected] = useState(0);
    const [address_input, set_address_input] = useState(null);
    const [geo_input, set_geo_input] = useState(null)
    const [private_status, set_private_status] = useState(false);
    const [name_input, set_name_input] = useState("");
    const [details_input, set_details_input] = useState("");
    const [available_spots, set_available_spots] = useState(15);
    const [image, set_image] = useState('https://firebasestorage.googleapis.com/v0/b/forage-212715.appspot.com/o/default-image.png?alt=media&token=a420c3be-5332-4396-9369-f5853c6ed3f2');
    const [formatted_image, set_formatted_image] = useState('https://firebasestorage.googleapis.com/v0/b/forage-212715.appspot.com/o/default-image.png?alt=media&token=a420c3be-5332-4396-9369-f5853c6ed3f2');
    const [time_input, set_time_input] = useState({hours: "", minutes: ""});

    const [created_data, set_created_data] = useState({});

    

    useEffect(() => {
        const fetch_data = async () => {
            set_groups_data(groups.filter(item => item.mods.includes(user) || item.admin === user))
            set_page_loader(false);
        };
        fetch_data();
    }, []);


    if(page_loader) { return <Loader_Page /> };

    
 
    const create_new_event = async () => {
        
        set_loader(true);
        try {
            create_event({
                name: name_input,
                details: details_input,
                address: address_input,
                slots: Number(available_spots),
                private_status: private_status,
                date: next_30_days[date_selected].full,
                time: `${time_input.hours}:${time_input.minutes}`,
                group_id: selected_group ? selected_group.id : null,
                image: formatted_image,
                id: id,
                geo: geo_input,
                admin: user
            }).then(async () => {
                const d = await get_event_data(id);
                set_created_data(d);
                set_loader(false);
                set_stage(8);
                // return navigation.navigate('Event', d)
                // props.navigation.replace('Event', created_data);
            })
        } catch(error) {
            set_status(error);
            set_loader(false);
        }
    };


    ///////////// PERMISSIONS AND IMAGE UPLOAD ///////////////////////

    const upload_image = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const data = await upload_event_image(blob, id)
        if(data) {
            try {
                set_image(url);
                set_formatted_image(data);
                set_loader(false);
            } catch(error) {
               set_status("Error uploading image")
               set_loader(false);
            }
        }
    }

    const image_upload_handler = async () => {
        const status = await select_image_handler();
        if(status.cancelled || false) {

        } else {
            upload_image(status.uri)
        }
    };


    const next_30_days = populate_90_days();

    //////////////////////////// INPUT HANDLERS ///////////////////////////////////////////////////

    const load_template_events = async (item) => {
        const template_data = await get_groups_templates(item.id);
        set_selected_group(item);
        set_address_input(item.location);
        set_geo_input(item.geo_input);
        set_image(item.image)
        set_formatted_image(item.image)
        if(template_data.length === 0) {
            set_stage(2)
        } else {
            set_groups_events_data(template_data);
            set_stage(1)
        }
    };

    const load_template_handler = (item) => {
        set_name_input(item.name);
        set_private_status(item.private_status);
        set_available_spots(item.slots);
        set_image(item.image);
        set_formatted_image(item.image);
        set_details_input(item.details);
        set_address_input(item.location);
        set_geo_input(item.coordinates)
        set_stage(7);
    };

    const continue_handler = () => set_stage(stage + 1);


    const time_input_handler = (name) => {
        if(time_input[name] && /^\d+$/.test(time_input[name].toString())) {
            if(time_input.hours > 24){
                set_time_input({...time_input, hours: ""})
            } else if(time_input.minutes > 60){
                set_time_input({...time_input, minutes: ""})
            }
        } else {
            set_time_input({...time_input, [name]: ""})
        }
    }


    const next_active_handler = () => {
        if(stage === 1) return true;
        if(stage === 2) return name_input.length >= 3 && name_input.length < 30;
        if(stage === 3) return true;
        if(stage === 4) return true;
        if(stage === 5) return true;
        if(stage === 6) return geo_input && address_input;
        if(stage === 7) return time_input.hours.length === 2 && time_input.minutes.length === 2;
        if(stage === 8) return true;
    }

    const back_handler = () => {
        if(stage === 0) { props.navigation.goBack(); return }
        if(stage === 2) { set_stage(0); return  } 
        if(stage === 8) { props.navigation.goBack(); return }
        set_stage(stage - 1);
    }

    //\\//\\//\\ CONTENT //\\//\\//\\


    const Group_Preview = (item) => (
        <View style={styles.group_wrapper}>
            <Pressable style={({pressed}) => [{backgroundColor: pressed ? colors.background_light : colors.white}, styles.group]} onPress={() => load_template_events(item)}>
                <Image style={styles.group_image} source={{uri: item.image }} />
                <View style={styles.group__content}>
                    <Text style={[typography.main_bold, global.text_medium]}>{ item.name }</Text>
                    <Text style={[typography.small, global.text_light_medium]}>{ item.members.length } members</Text>
                </View>
                <FontAwesome5 name="chevron-right" size={24} color={colors.text_light} />
            </Pressable>
        </View>
    )

    const Event_Preview = (item) => (
        <View style={styles.group_wrapper}>
            <Pressable style={({pressed}) => [{backgroundColor: pressed ? colors.background_light : colors.white}, styles.group]} onPress={() => load_template_handler(item)}>
                <Image style={styles.group_image} source={{uri: item.image }} />
                <View style={styles.group__content}>
                    <Text style={[typography.main_bold, global.text_medium]}>{ item.name }</Text>
                    <Text style={[typography.small, global.text_light_medium]}>{ item.members.length } members</Text>
                </View>
                <FontAwesome5 name="chevron-right" size={24} color={colors.text_light} />
            </Pressable>
        </View>
    )

    
    const stage_1 = (
        <View>
            <FlatList data={groups} showsVerticalScrollIndicator={false}  ListHeaderComponent={<Text style={[global.information, typography.main]}>Select a Community to assign to this Event.</Text>} renderItem={({ item }) => ( Group_Preview(item) )} keyExtractor={(item, index) => item.id.toString()} />
        </View>
    )

    const stage_2 = (
        <View>
            <FlatList data={groups_events_data} showsVerticalScrollIndicator={false} ListHeaderComponent={<Text style={[global.information, typography.main]}>Select a previous Event to remake it.</Text>} renderItem={({ item }) => ( Event_Preview(item) )} keyExtractor={(item, index) => item.id.toString()} />
        </View>
    )

    const stage_3 = (
        <>
        <Text style={[typography.header_3, styles.question]}>To start, what's your event called?</Text>
        <Text style={[typography.main, global.bottom(5)]}>Name</Text>
        <Text style={[typography.main_thin, global.text_light_medium, global.bottom(10)]}>Fill in the name of your Event.</Text>
        <Text_Input value={name_input} input={set_name_input} />
        </>
    )

    const stage_4 = (
        <>
        <Text style={[typography.header_3, styles.question]}>Next, tell us some additional information</Text>
            <View style={global.bottom(30)}>
                <Text style={[typography.main, global.bottom(5)]}>Type</Text>
                <Text style={[typography.main_thin, global.text_light_medium, global.bottom(10)]}>Select whether you want your Event to be visible.</Text>
                <Pressable onPress={() => set_private_status(false)} style={[styles.input_box_item, private_status ? {backgroundColor: colors.text_light} : null ]}>
                    <View style={containers.simple_row}>
                        <FontAwesome5 name="users" size={24} color={colors.white} />
                        <Text style={[typography.header_4, global.text_white, {marginRight: "auto", marginLeft: 20}]}>Open</Text>
                        {private_status ? <View></View> : <View style={[containers.centered_row, {backgroundColor: colors.primary_dark, height: 40, width: 40, borderRadius: 5}]}><Ionicons name="ios-checkmark-sharp" size={24} color={colors.white} /></View>}
                    </View>
                </Pressable>
                <Pressable onPress={() => set_private_status(true)} style={[styles.input_box_item, private_status ? null : {backgroundColor: colors.text_light} ]}>
                    <View style={containers.simple_row}>
                        <Entypo name="newsletter" size={24} color={colors.white} />
                        <Text style={[typography.header_4, global.text_white, {marginRight: "auto", marginLeft: 20}]}>Private</Text>
                        {private_status ? <View style={[containers.centered_row, {backgroundColor: colors.primary_dark, height: 40, width: 40, borderRadius: 5}]}><Ionicons name="ios-checkmark-sharp" size={24} color={colors.white} /></View> : <View></View>}
                    </View>    
                </Pressable>
            </View>

            <View style={styles.input__wrapper}>
                <Text style={[typography.main, global.bottom(5)]}>Available places - {available_spots}</Text>
                <Text style={[typography.main_thin, global.text_light_medium, global.bottom(5)]}>Select the maximum capacity.</Text>
                <Slider style={styles.slider} minimumValue={1} maximumValue={50} minimumTrackTintColor={colors.primary_light} maximumTrackTintColor={colors.primary_light} thumbTintColor={colors.primary} value={Number(available_spots)} onSlidingComplete={value => set_available_spots(Number(value.toFixed(0)))} />        
            </View>
        </>
    )

    const stage_5 = (
        <>
        <Text style={[typography.header_3, styles.question]}>Select an image for your event</Text>
        <View style={styles.input__wrapper}>
            <Pressable onPress={() => image_upload_handler()}>
                <View>
                    <ImageBackground imageStyle={global.image_opacity} style={global.image_round}source={{uri: image}}>
                        <FontAwesome name="camera" size={50} color={colors.white} />
                    </ImageBackground>
                </View>
            </Pressable>
       </View>
        
        </>
    )

    const stage_6 = (
        <>
        <Text style={[typography.header_3, styles.question]}>Provide some details about your event.</Text>
        <View style={{flex: 1}}>
        <Text style={[typography.main, global.bottom(5)]}>Details</Text>
        <Text style={[typography.main_thin, global.text_light_medium, global.bottom(10)]}>Fill in anything you think people should know.</Text>
            <TextInput 
                style={[global.input_light, {textAlignVertical: 'top', flex: 1, minHeight: 280 }]} 
                numberOfLines={15}
                multiline={true}
                value={details_input} placeholder="" 
                onChangeText={(e) => set_details_input(e)}
            />
        </View> 
        </>
    );


    const stage_7 = (
        <>
        <Text style={[typography.header_3, styles.question]}>Provide the address the event is taking place at.</Text>
        <Text style={[typography.main, global.bottom(5)]}>Location</Text>
        <Text style={[typography.main_thin, global.text_light_medium, global.bottom(10)]}>Start typing to select a location.</Text>
        <GoogleAddress location={address_input} set_location={set_address_input} geo={set_geo_input} />
        </>
    );



    const stage_8 = (
        <>
        <Text style={[typography.header_3, styles.question]}>Finally, what is the date and start time of your event?</Text>
            <View style={global.bottom(30)}>
                <Text style={[typography.main, global.bottom(5)]}>Date</Text>
                <Text style={[typography.main_thin, global.text_light_medium, global.bottom(10)]}>{date_selected ? `${next_30_days[date_selected].day}, ${next_30_days[date_selected].month} ${next_30_days[date_selected].date}` : "Select the date of your Event."}</Text>
                <Dates_list data={next_30_days} selector={(e) => set_date_selected(e)} selected={date_selected} />
            </View>
            <View>
                <Text style={[typography.main, global.bottom(5)]}>Time</Text>
                <Text style={[typography.main_thin, global.text_light_medium, global.bottom(10)]}>{time_input.hours && time_input.minutes ? `${time_input.hours}:${time_input.minutes}` : "Fill in the time of your Event."}</Text>
                <View style={styles.time}>
                    <TextInput keyboardType='numeric' value={time_input.hours} maxLength={2} style={[global.input_light, styles.time__input]} placeholder="HH" onBlur={() => time_input_handler('hours')} onChangeText={(e) => set_time_input({...time_input, hours: e})} />
                    <Entypo name="dots-two-vertical" size={24} color={colors.text_light} />
                    <TextInput keyboardType='numeric' value={time_input.minutes} maxLength={2} style={[global.input_light, styles.time__input]} placeholder="MM" onBlur={() => time_input_handler('minutes')} onChangeText={(e) => set_time_input({...time_input, minutes: e})} />
                </View>
            </View>
        </>
    );

    const stage_9 = (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[typography.header_3, styles.question]}>Congratulations! {created_data.name} has been created.</Text>
            <Text style={[typography.main, global.bottom(5)]}>Send Invites</Text>
            <Text style={[typography.main_thin, global.text_light_medium]}>Tap on a connection to send them an invite and let your connections know about your Event.</Text>
            <Event_Invites data={created_data} embed={true} />
        
        </ScrollView>
    );

    const stages = [stage_1, stage_2, stage_3, stage_4, stage_5, stage_6, stage_7, stage_8, stage_9];


    //////////////////////////////////////

    const button_handler = () => {
        if(stage === 0) return <Button_Main action={() => set_stage(2)}>Skip</Button_Main>
        if(stage === 1) return <Button_Main action={() => continue_handler()}>Skip</Button_Main>
        if(stage === 7) return <Button_Main loader={loader} active={next_active_handler()} action={() => create_new_event()}>Create</Button_Main>
        if(stage === 8) return <Button_Main action={() => props.navigation.replace('Event', created_data)}>Skip</Button_Main>
        return <Button_Main active={next_active_handler()} action={() => continue_handler()}>Next</Button_Main>

    }

    return (  
        <ScrollView contentContainerStyle={styles.container}>
            <Alt_Header back_handler={back_handler}>Create Event</Alt_Header>
            <View style={[containers.main, styles.wrapper]}>
                <View style={styles.content_wrapper}>{stages[stage]}</View>
                {status ? <Text style={global.status_text}>{status}</Text> : null}
                {button_handler()}
            </View>
        </ScrollView>
    );
};

export default Create_Event;


const styles = StyleSheet.create({
    white: {
        color: colors.white
    },
    container: {
        flex: 1
    },
    wrapper: {
        flex: 1,
        paddingTop: 10,
        justifyContent: 'space-between',
        paddingBottom: 10
    },
    content_wrapper: {
        flex: 1,
        marginTop: 30,
        justifyContent: 'flex-start'
    },
    question: {
        marginBottom: 30
    },
    input_box_item: {
        backgroundColor: colors.primary,
        borderRadius: 15,
        height: 75,
        justifyContent: 'center',
        paddingHorizontal: 20, 
        marginBottom: 10
    },
    time: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    time__input: {
        width: 70,
        textAlign: 'center',
        marginRight: 5,
        fontSize: 15,
        letterSpacing: 5
    },
    date_time: {
        textAlign: 'center'
    },
    input_wrapper: {
        marginBottom: 5
    },
    date_display_wrapper: {
        height: 200,
        width: 200,
        borderRadius: 200,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background_light,
        alignSelf: 'center'
    },
    date_display: {
        height: 150,
        width: 150,
        borderRadius: 150,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingVertical: 20,
        backgroundColor: colors.white,
        elevation: 5
    },
    group: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        borderRadius: 20,
        paddingHorizontal: 0,
        height: 90,
        justifyContent: 'space-between'
    },
    group_image: {
        height: 60, 
        width: 60,
        borderRadius: 60
    },
    group__content: {
        marginRight: "auto",
        marginLeft: 15
    },  
    group_wrapper: {
        borderBottomColor: colors.background_light,
        borderBottomWidth: 1,
    },


    
})

