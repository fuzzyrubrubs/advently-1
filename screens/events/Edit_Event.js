import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, TextInput, ImageBackground, Pressable } from 'react-native';
import containers from '../../styles/containers';
import typography from '../../styles/typography';
import global from '../../styles/global';
import colors from '../../assets/colors/colors';
import { FontAwesome } from '@expo/vector-icons';
import Button_Main from '../../components/Buttons/Button_Main';
import { update_my_event } from '../../firebase/methods/Event_Functions';
import { delete_event } from '../../firebase/methods/Delete_Functions';
import { upload_event_image, get_event_image } from '../../firebase/methods/Storage_Functions';
import { populate_90_days, event_date_full, event_time } from '../../tools/DateTime_Methods';
import Slider from '@react-native-community/slider';
import { Entypo } from '@expo/vector-icons';
import { select_image_handler } from '../../tools/Upload_Methods';
import { postcode_to_address, zipcode_to_address } from '../../tools/Location_Methods';
import Selection_Box from '../../components/Items/Selection_Box';
import Alt_Header from '../../components/Headers/Alt_Header';
import Dates_List from '../../components/Lists/Dates_List';
import { LocationContext } from '../../contexts/Location.context';
import GoogleAddress from '../../components/Items/GoogleAddress';
import { useNavigation } from '@react-navigation/native';
import Pop_Menu from '../../components/Displays/Pop_Menu';
import CustomModal from '../../components/Items/CustomModal';
import Button_Display from '../../components/Buttons/Button_Display';

function Edit_Event(props){ 
    const event_data = props.data;
    const navigation = useNavigation();
    const [confirmation, set_confirmation] = useState(false);

    const { address } = useContext(LocationContext);
    const [status, set_status] = useState("");
    const [content, set_content] = useState(0)
    const [loader, set_loader] = useState(false);

    const [private_status, set_private_status] = useState(event_data.private_status);
    const [name_input, set_name_input] = useState(event_data.name);
    const [details_input, set_details_input] = useState(event_data.details);
    const [available_spots, set_available_spots] = useState(Number(event_data.slots));
    const [image, set_image] = useState(event_data.image);
    const [time_input, set_time_input] = useState(() => {
        const split = event_time(event_data.start).split(":");
        return {hours: split[0], minutes: split[1]}
    });
    const [geo_input, set_geo_input] = useState(event_data.geo);
    const [address_input, set_address_input] = useState(event_data.location);

    const next_30_days = populate_90_days();
    const date_index = next_30_days.findIndex(date => date.full === event_date_full(event_data.start));

    const [date_selected, set_date_selected] = useState(date_index);


    const new_data = [
        {},
        {name: name_input.length >= 2 && name_input.length < 30 ? name_input : event_data.name, private_status: private_status, slots: Number(available_spots)}, 
        {details: details_input}, 
        {location: address_input, geo: geo_input}, 
        {date: next_30_days[date_selected].full, time: `${time_input.hours}:${time_input.minutes}`}
    ]

    const save_handler = async () => {
        set_loader(true);
        try {
            await update_my_event(event_data.id, new_data[content]);
            set_status("Saved")
            props.close(false)
        } catch (error)  {
            set_status(error.message);
            set_loader(false);
        }
    }

    const upload_image = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const data = await upload_event_image(blob, event_data.id)
        if(data) {
            try {
                set_image(url);
                await update_my_event(event_data.id, {image: data});
                set_loader(false);
            } catch(error) {
               set_status(error.message)
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
    }


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


    const back_handler = () => {
        if(content === 0){
            props.close(false);
        } else {
            set_content(0);
        }
    }

    const delete_event_handler = async () => {
        set_loader(true)
        try {
            await delete_event(event_data.id);
            navigation.replace("Events")
        } catch(error) {
            set_loader(false);
            set_status(error.message)
        }
    }


    
    
    const options = (
        <>
            <View style={containers.selection_box_wrapper}>
                <Selection_Box action={() => set_content(1)}>Information</Selection_Box>
                <Selection_Box action={() => set_content(2)}>Details</Selection_Box>
                <Selection_Box action={() => set_content(3)}>Location</Selection_Box>
                <Selection_Box action={() => set_content(4)}>Date</Selection_Box>
            </View>
            <CustomModal show={confirmation} set_show={set_confirmation} content={<Button_Display hollow={true}>Delete Event</Button_Display>}>
                <View style={styles.modal}>
                    <Text style={[typography.header_3, global.bottom(15)]}>Are you sure you want to delete this Event?</Text>
                    <Text style={[typography.small, global.text_light_medium, global.bottom(15)]}>This action is irreversible.</Text>
                    <View style={containers.simple_row}>
                        <Button_Main action={() => set_confirmation(false)} size={"48%"}>Cancel</Button_Main>
                        <Button_Main action={delete_event_handler} loader={loader} hollow={true} size={"48%"}>Delete</Button_Main>
                    </View>
                </View>
            </CustomModal>
        </>
    )

    const information = (
        <>
        <Pressable onPress={() => image_upload_handler()}>
            <View>
                <ImageBackground imageStyle={global.image_opacity} style={global.image_round} source={{uri: image}}>
                    <FontAwesome name="camera" size={50} color={colors.white} />
                </ImageBackground>
            </View>
        </Pressable>
        <View>
            <Text style={global.input_light_label}>Name</Text>
            <TextInput style={global.input_light} value={name_input} placeholder="" onChangeText={(e) => set_name_input(e)}/>
        </View>
        <View>
            <Text style={global.input_light_label}>Type</Text>
            <View style={containers.simple_row}>
                <Pressable 
                    onPress={() => set_private_status(false)}
                    style={[global.input_box_item, private_status ? {backgroundColor: colors.text_dark} : null ]}>
                        <Text style={[typography.header_4, {color: colors.white} ]}>Public</Text>
                </Pressable>
                <Pressable 
                    onPress={() => set_private_status(true)}
                    style={[global.input_box_item, private_status ? null : {backgroundColor: colors.text_dark} ]}>
                        <Text style={[typography.header_4, {color: colors.white} ]}>Private</Text>
                </Pressable>
            </View>
        </View>
        <View>
            <Text style={global.input_light_label}>Available places - {available_spots}</Text>
            <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={50}
                minimumTrackTintColor={colors.primary_light}
                maximumTrackTintColor={colors.primary_light}
                thumbTintColor={colors.primary}
                value={available_spots}
                onSlidingComplete={value => set_available_spots(value.toFixed(0))}
            />        
        </View>
        </>
    )

    const details = (
        <>
            <Text style={global.input_light_label}>Details</Text>
            <TextInput 
                style={[global.input_light, {textAlignVertical: 'top', flex: 1, minHeight: 340 }]} 
                numberOfLines={25}
                multiline={true}
                value={details_input} placeholder="" 
                onChangeText={(e) => set_details_input(e)}
            />
        </>
    )

    const location = (
        <>
        <GoogleAddress location={address_input} set_location={set_address_input} geo={set_geo_input} />
        </>
    )

    const time = (
        <>
        <View>
            <Dates_List data={next_30_days} selector={(e) => set_date_selected(e)} selected={date_selected} />
        </View>
        <View>
            <View style={styles.time}>
                <TextInput keyboardType='numeric' value={time_input.hours} maxLength={2} style={[global.input_light, styles.time_input]} placeholder="HH" onBlur={() => time_input_handler('hours')} onChangeText={(e) => set_time_input({...time_input, hours: e})} />
                <Entypo name="dots-two-vertical" size={24} color={colors.text_medium} />
                <TextInput keyboardType='numeric' value={time_input.minutes} maxLength={2} style={[global.input_light, styles.time_input]} placeholder="MM" onBlur={() => time_input_handler('minutes')} onChangeText={(e) => set_time_input({...time_input, minutes: e})} />
            </View>
        </View>
        <Text style={[typography.header_5, styles.date_time]}> 
            {next_30_days[date_selected].date} {next_30_days[date_selected].month} - {time_input.hours}:{time_input.minutes}
        </Text>
        </>
    )

    const display_content = [options, information, details, location, time]


    return (  
        <View style={styles.container}>
            <Alt_Header back_handler={back_handler}>Edit Event</Alt_Header>
            <View style={[containers.main, styles.wrapper]}>
                {display_content[content]}          
                {content !== 0 ? <Button_Main loader={loader} action={() => save_handler()}>Save Changes</Button_Main> : null}
                <Text style={global.status_text}>{status}</Text>
            </View>
        </View>
    )
}

export default Edit_Event;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        justifyContent: 'space-evenly'
    },
    time: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    time_input: {
        width: 70,
        textAlign: 'center',
        marginRight: 5,
        fontSize: 15,
        letterSpacing: 5
    },
    date_input_wrapper: {
        justifyContent: 'space-between',
        height: 300
    },
    date_time: {
        textAlign: 'center'
    },

})

