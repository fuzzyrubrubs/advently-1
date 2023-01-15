import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput, ImageBackground, Pressable, Image, FlatList, Dimensions } from 'react-native';
import containers from '../../../styles/containers';
import global from '../../../styles/global';
import Alt_Header from '../../../components/Headers/Alt_Header';
import Button_Main from '../../../components/Buttons/Button_Main';
import { authenticate_me, change_my_password } from '../../../firebase/methods/User_Functions';


function Change_Password(props){   
    const [authenticated, set_authenticated] = useState(false)
    const [old_password, set_old_password] = useState("");
    const [new_password, set_new_password] = useState("");
    const [error, set_error] = useState("");

    const update_password = async () => {
        try {
            await change_my_password(new_password);
            set_error("Saved");
            props.navigation.goBack();
        } catch(error) {
            set_error(error.message)
        }
    }

    const authenticate_user = async () => {
        try {
            await authenticate_me(old_password);
            set_authenticated(true)
            set_error("");
        } catch(error) {
            set_error(error.message)
        }     
    }


    return (      
        <View>
                {
                    authenticated === true ? (
                        <>
                        <View style={styles.input__wrapper}>
                            <Text style={global.input_light_label}>Please enter your new password</Text>
                            <TextInput style={global.input_light} secureTextEntry={true} value={new_password} placeholder="" onChangeText={(e) => set_new_password(e)}/>
                        </View>
                        <Button_Main hollow={true} action={() => update_password()}>Save</Button_Main>
                        </>
                    ) : (
                        <>
                        <View style={styles.input__wrapper}>
                            <Text style={global.input_light_label}>Please enter your current password</Text>
                            <TextInput style={global.input_light} secureTextEntry={true} value={old_password} placeholder="" onChangeText={(e) => set_old_password(e)}/>
                        </View>
                        <Button_Main hollow={true} action={() => authenticate_user()}>Continue</Button_Main>
                        </>
                    )
                }
                <Text style={global.status_text}>{error}</Text>
            </View>
    )
}

export default Change_Password;



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        justifyContent: 'space-evenly'
    },
    
});
