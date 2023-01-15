import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Pressable } from 'react-native';
import containers from '../../styles/containers';
import typography from '../../styles/typography';
import global from '../../styles/global';
import colors from '../../assets/colors/colors';
import { FontAwesome } from '@expo/vector-icons';
import Button_Main from '../../components/Buttons/Button_Main';
import { update_my_group } from '../../firebase/methods/Group_Functions';
import { upload_logo, get_logo } from '../../firebase/methods/Storage_Functions';
import { select_image_handler } from '../../tools/Upload_Methods';
import Alt_Header from '../../components/Headers/Alt_Header';
import Text_Input from '../../components/Items/Text_Input';

function Edit_Group(props){ 
    const group_data = props.data;
    const [logo, set_logo] = useState(group_data.image);
    const [name, set_name] = useState(group_data.name);
    const [about, set_about] = useState(group_data.about);
    const [type, set_type] = useState(group_data.type);
    const [loader, set_loader] = useState(false);
    const [status, set_status] = useState("");
    
    const save_handler = async () => {
        set_loader(true);
        const name_validated = name.length >= 2 && name.length < 30 ? name : group_data.name;
        const save = await update_my_group(group_data.id, {name: name_validated, about, type});
        if ( save === true ) {
            set_status("Saved")
            props.close(false);
        } else {
            set_status(save);
            set_loader(false);
        }
    }


    const upload_image = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const data = await upload_logo(blob, group_data.id)
        if(data) {
            try {
                set_logo(url);
                await update_my_group(group_data.id, {image: data})
                set_loader(false);
            } catch(error) {
                set_loader(false);
                set_status(error.message)

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
            <Alt_Header back_handler={() => props.close(false)}>Edit Group</Alt_Header>
            <View style={[containers.main, styles.wrapper]}>
                <Pressable onPress={() => image_upload_handler()}>
                    <ImageBackground imageStyle={global.image_opacity} style={global.image_round} source={{uri: logo}}>
                        <FontAwesome name="camera" size={50} color={colors.white} />
                    </ImageBackground>
                </Pressable>
                <Text_Input value={name} input={set_name}>Name</Text_Input>
                <Text_Input value={about} input={set_about}>About</Text_Input>
                <View>
                    <Text style={global.input_light_label}>Type</Text>
                    <View style={[containers.simple_row]}>
                        <Pressable onPress={() => set_type(0)} style={[styles.item, type === 0 ? styles.item_selected : null]}>
                            <Text style={[typography.small, styles.item_text, type === 0 ? styles.item_selected_text : null]}>
                                Private
                            </Text>
                        </Pressable>
                        <Pressable onPress={() => set_type(1)} style={[styles.item, type === 1 ? styles.item_selected : null]}>
                            <Text style={[typography.small, styles.item_text, type === 1 ? styles.item_selected_text : null]}>
                                Charity
                            </Text>
                        </Pressable>
                    </View>
                    <View style={[containers.simple_row]}>
                        <Pressable onPress={() => set_type(2)} style={[styles.item, type === 2 ? styles.item_selected : null]}>
                            <Text style={[typography.small, styles.item_text, type === 2 ? styles.item_selected_text : null]}>
                                Community
                            </Text>
                        </Pressable>
                        <Pressable onPress={() => set_type(3)} style={[styles.item, type === 3 ? styles.item_selected : null]}>
                            <Text style={[typography.small, styles.item_text, type === 3 ? styles.item_selected_text : null]}>
                                Business
                            </Text>
                        </Pressable>
                    </View>
                </View>
                <Button_Main loader={loader} action={() => save_handler()}>Save Changes</Button_Main>
                <Text style={global.status_text}>{status}</Text>
                
            </View>
        </ScrollView>
    )
}

export default Edit_Group;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        justifyContent: 'space-between'
    },
    item: {
        height: 60,
        width: "49%",
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: colors.primary,
        borderRadius: 5,
        marginBottom: 5,
        backgroundColor: "#eee"
    },
    item_selected: {
        backgroundColor: colors.primary
    },
    item_text: {
        color: colors.primary
    },
    item_selected_text: {
        color: colors.white
    }
})

