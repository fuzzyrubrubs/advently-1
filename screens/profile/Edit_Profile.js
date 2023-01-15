import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput, ImageBackground, Pressable, ActivityIndicator } from 'react-native';
import containers from '../../styles/containers';
import global from '../../styles/global';
import colors from '../../assets/colors/colors';
import { FontAwesome } from '@expo/vector-icons';
import Button_Main from '../../components/Buttons/Button_Main';
import { update_my_profile } from '../../firebase/methods/User_Functions';
import { get_avatar, upload_avatar } from '../../firebase/methods/Storage_Functions';
import { select_image_handler } from '../../tools/Upload_Methods';
import Alt_Header from '../../components/Headers/Alt_Header';
import Text_Input from '../../components/Items/Text_Input';
import { ProfileDataContext } from '../../contexts/ProfileData.context';

function Edit_Profile(props){ 
    const { user_profile } = useContext(ProfileDataContext)
    const [avatar, set_avatar] = useState(user_profile.image);
    const [name, set_name] = useState(user_profile.name);
    const [about, set_about] = useState(user_profile.about || "");
    const [status, set_status] = useState("");
    const dob = !user_profile.age ? [] : user_profile.age.split("-");
    const [age, set_age] = useState( {day: dob[2] || "", month: dob[1] || "", year: dob[0] || ""})
    const [loader, set_loader] = useState(false);

    
    const save_handler = async () => {
        set_loader(true);
        const age_validated = (age.day.length === 2 && age.day <= 31) && (age.month.length === 2 && age.month <= 12) && (age.year.length === 4 && age.year > 1900) ? `${age.year}-${age.month}-${age.day}` : user_profile.age;
        const name_validated = name.length >= 2 && name.length < 20 ? name : user_profile.name;
        try {
            await update_my_profile(user_profile.id, {name: name_validated, about, age: age_validated});
            set_status("Saved")
            props.close(false)
        } catch(error) {
            set_status(error.message);
            set_loader(false);
        }
    }


    const age_input_handler = (name) => {
        if(age[name] && /^\d+$/.test(age[name].toString())) {
            if(age.day > 31){
                set_age({...age, day: ""})
            } else if(age.month > 12){
                set_age({...age, month: ""})
            } else if(age.year < 1930 || age.year > 2015){
                set_age({...age, year: ""})
            }
        } else {
            set_age({...age, [name]: ""})
        }
    }

    const upload_image = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const data = await upload_avatar(blob, user_profile.id);
        if(data) {
            try {
                set_avatar(url);
                await update_my_profile(user_profile.id, {image: data});
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
            set_loader(true);
        }
    }
 
    return (  
        <ScrollView contentContainerStyle={styles.container}>
            <Alt_Header back_handler={() => props.close(false)}>Edit Profile</Alt_Header>
            <View style={[containers.main, styles.wrapper]}>
                <Pressable onPress={() => image_upload_handler()}>
                    <ImageBackground imageStyle={global.image_opacity}  style={global.image_round} source={{uri: avatar}}>
                        <FontAwesome name="camera" size={50} color={colors.white} />
                    </ImageBackground>
                </Pressable>
                <Text_Input value={name} input={set_name}>Name</Text_Input>
                <View>
                    <Text style={global.input_light_label}>Date of Birth</Text>
                    <View style={styles.age}>
                        <TextInput keyboardType='numeric' value={age.day} maxLength={2} style={[global.input_light, styles.age__input]} placeholder="DD" onBlur={() => age_input_handler('day')} onChangeText={(e) => set_age({...age, day: e})} />
                        <TextInput keyboardType='numeric' value={age.month} maxLength={2} style={[global.input_light, styles.age__input]} placeholder="MM" onBlur={() => age_input_handler('month')} onChangeText={(e) => set_age({...age, month: e})} />
                        <TextInput keyboardType='numeric' value={age.year} maxLength={4} style={[global.input_light, styles.year__input]} placeholder="YYYY" onBlur={() => age_input_handler('year')} onChangeText={(e) => set_age({...age, year: e})} />
                    </View>
                </View>
                <View>
                    <Text style={global.input_light_label}>About you</Text>
                    <TextInput style={[global.input_light, {textAlignVertical: 'top', height: 100}]} value={about} 
                        placeholder=""
                        numberOfLines={4}
                        multiline={true}
                        onChangeText={(e) => set_about(e)}/>
                </View>
                <Button_Main loader={loader} action={() => save_handler()}>Save Changes</Button_Main>
                <Text style={global.status_text}>{status}</Text>
                
            </View>
        </ScrollView>
    )
}

export default Edit_Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: 20
    },
    age: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    age__input: {
        width: 70,
        textAlign: 'center',
        marginRight: 5,
        fontSize: 15,
        letterSpacing: 5
    },
    year__input: {
        textAlign: 'center',
        width: 120,
        fontSize: 15,
        letterSpacing: 5
    },
})

