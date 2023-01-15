import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, ImageBackground, Pressable, ScrollView } from 'react-native';
import { create_group } from '../../firebase/methods/Group_Functions';
import { upload_logo, get_logo } from '../../firebase/methods/Storage_Functions';
import containers from '../../styles/containers';
import typography from '../../styles/typography';
import global from '../../styles/global';
import colors from '../../assets/colors/colors';
import { FontAwesome5, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Button_Main from '../../components/Buttons/Button_Main';
import Alt_Header from '../../components/Headers/Alt_Header';
import IDGenerator from '../../tools/IDGenerator';
import { AuthContext } from '../../contexts/Auth.context';
import { LocationContext } from '../../contexts/Location.context';
import { select_image_handler } from '../../tools/Upload_Methods';
import { get_geo } from '../../tools/Location_Methods';
import GoogleAddress from '../../components/Items/GoogleAddress';
import Text_Input from '../../components/Items/Text_Input';

function Create_Group(props){ 
    const [id, set_id] = useState(IDGenerator())
    const { address, get_location_handler, get_permissions } = useContext(LocationContext);
    const { user } = useContext(AuthContext);
    const [stage, set_stage] = useState(0);
    const [status, set_status] = useState("");
    const [loader, set_loader] = useState(false);
    const [community_type, set_community_type] = useState(null);
    const [name_input, set_name_input] = useState("");
    
    const [location_input, set_location_input] = useState(address ? address.subregion : "");
    const [geo_input, set_geo_input] = useState(null);

    const [about_input, set_about_input] = useState("");
    const [logo, set_logo] = useState('https://firebasestorage.googleapis.com/v0/b/forage-212715.appspot.com/o/default-image.png?alt=media&token=a420c3be-5332-4396-9369-f5853c6ed3f2');
    const [formatted_logo, set_formatted_logo] = useState('https://firebasestorage.googleapis.com/v0/b/forage-212715.appspot.com/o/default-image.png?alt=media&token=a420c3be-5332-4396-9369-f5853c6ed3f2');


    useEffect(() => {
        if(address) { 
            const fetch = async () => {
                const geo_data = await get_geo(`${address}, ${address.region}`);
                set_geo_input(geo_data)
            }
            fetch() 
        } 
    }, []);

    
    const create_group_profile = async () => {
        try {
            create_group({name: name_input, type: community_type, about: about_input, user_id: user, logo: formatted_logo, location: location_input, geo: geo_input, id: id})
            .then(async (res) => {
                props.navigation.replace("Groups");
            })
        } catch(error) {
            set_loader(false);
            set_status(error.message);
        }
    }


    const continue_handler = () => set_stage(stage + 1);


    const upload_image = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const data = await upload_logo(blob, id);
        if(data) {
            try {
                set_logo(url);
                set_formatted_logo(data);
                set_loader(false);
            } catch(error) {
                set_status(error.message)
                set_logo(false);
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

    const back_handler = () => {
        if(stage === 0){
            props.navigation.goBack();
        } else {
            set_stage(stage - 1);
            set_status("");
        }
    }


    const next_active_handler = () => {
        if(stage === 1) return name_input.length >= 3 && name_input.length < 30;
        if(stage === 3) return geo_input && location_input.length > 2;
        return true
    };



    const stage_0 = (
        <>
            <Text style={[typography.header_2, styles.question]}>Select the type of community you want to create.</Text>
        <View>
            <Pressable onPress={() => {
                set_stage(1), 
                set_community_type(1)
            }} style={({pressed}) => [{backgroundColor: pressed ? colors.background_light : colors.white}, styles.item]}>
                <View>
                    <Text style={[typography.main_bold, styles.item_header]}>Charity</Text>
                    <Text style={[typography.extra_small, styles.item_content]}>
                        For nonprofit organisations seeing volunteers
                    </Text>
                </View>
                <View style={[styles.icon, {backgroundColor: "#7d7ddc"}]}>
                    <MaterialCommunityIcons name="charity" size={32} color={colors.text_dark} />
                </View>
            </Pressable>
            
            <Pressable onPress={() => {
                set_stage(1), 
                set_community_type(2)
            }} style={({pressed}) => [{backgroundColor: pressed ? colors.background_light : colors.white}, styles.item]}>
                <View>
                    <Text style={[typography.main_bold, styles.item_header]}>Community</Text>
                    <Text style={[typography.extra_small, styles.item_content]}>
                        Looking to start something new and host community activities 
                    </Text>
                </View>
                <View style={[styles.icon, {backgroundColor: colors.primary_light}]}>
                    <FontAwesome5 name="users" size={24} color={colors.text_dark} />
                </View>
            </Pressable>
            
            <Pressable onPress={() => {
                set_stage(1), 
                set_community_type(3)
            }} style={({pressed}) => [{backgroundColor: pressed ? colors.background_light : colors.white}, styles.item]}>
                <View>
                    <Text style={[typography.main_bold, styles.item_header]}>Business</Text>
                    <Text style={[typography.extra_small, styles.item_content]}>
                        Offering free classes, promotions or simply hosting something fun
                    </Text>
                </View>
                <View style={[styles.icon, {backgroundColor: colors.green}]}>
                    <MaterialCommunityIcons name="finance" size={32} color={colors.text_dark} />
                </View>
            </Pressable>

            <Pressable onPress={() => {
                set_stage(1), 
                set_community_type(0)
            }} style={({pressed}) => [{backgroundColor: pressed ? colors.background_light : colors.white}, styles.item, {borderBottomWidth: 0}]}>
                <View>
                    <Text style={[typography.main_bold, styles.item_header]}>Private</Text>
                    <Text style={[typography.extra_small, styles.item_content]}>
                        For events with your friends, this group will not be discoverable
                    </Text>
                </View>
                <View style={[styles.icon, {backgroundColor: colors.orange}]}>
                    <FontAwesome5 name="user-lock" size={24} color={colors.text_dark} />
                </View>
            </Pressable>
        </View>
        </>
    )

    const stage_1 = (
        <>
        <Text style={[typography.header_3, styles.question]}>What should we name it?</Text>
        <View>
            <Text style={[typography.main, global.bottom(5)]}>Name</Text>
            <Text style={[typography.main_thin, global.text_light_medium, global.bottom(10)]}>Fill in the name of your Community.</Text>
            <Text_Input value={name_input} input={set_name_input} />
        </View>
        </>
    )

    const stage_2 = (
        <>
        <Text style={[typography.header_3, styles.question]}>Write a short description!</Text>
        <View>
            <Text style={[typography.main, global.bottom(5)]}>Description</Text>
            <Text style={[typography.main_thin, global.text_light_medium, global.bottom(10)]}>Fill in a short description.</Text>
            <Text_Input value={about_input} input={set_about_input} />
        </View>
        </>
    )


    const stage_3 = (
        <>
        <Text style={[typography.header_3, styles.question]}>Where are you located?</Text>
        <View>
            <Text style={[typography.main, global.bottom(5)]}>Location</Text>
            <Text style={[typography.main_thin, global.text_light_medium, global.bottom(10)]}>Start typing to find your location.</Text>
        </View>
            <GoogleAddress location={location_input} set_location={set_location_input} geo={set_geo_input} />
        </>
    );

    const stage_4 = (
        <>
        <Text style={[typography.header_3, styles.question]}>Finally, upload an image.</Text>
            <Pressable onPress={() => image_upload_handler()}>
                    <ImageBackground imageStyle={global.image_opacity} style={global.image_round} source={{uri: logo}}>
                        <FontAwesome name="camera" size={50} color={colors.white} />
                    </ImageBackground>
            </Pressable>
        </>
    )

    const button_handler = () => {
        if(stage === 0) return null
        if(stage === 4) return <Button_Main loader={loader} active={next_active_handler()} action={create_group_profile}>Create</Button_Main>
        return <Button_Main active={next_active_handler()} action={continue_handler}>Next</Button_Main>

    }

    const stages = [stage_0, stage_1, stage_2, stage_3, stage_4]

    return (  
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='always' >
                <Alt_Header back_handler={back_handler}></Alt_Header>
                <View style={[containers.main, styles.wrapper]}>
                    <View style={styles.content_wrapper}>{stages[stage]}</View>
                    {status ? <Text style={global.status_text}>{status}</Text> : null}
                    {button_handler()}
                </View>
            </ScrollView>
    )
}

export default Create_Group;


const styles = StyleSheet.create({
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
    item: {
        borderBottomWidth: 0.3,
        borderColor: colors.text_light,
        paddingVertical: 30,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 20,
        // paddingHorizontal: 10
    },
    item_header: {
        marginBottom: 5, 
    },
    item_content: {
        color: colors.text_medium,
        lineHeight: 20,
        width: 220
    },
    icon: {
        height: 60,
        width: 60,
        borderRadius: 5,
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

