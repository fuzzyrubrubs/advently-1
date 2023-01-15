import React, { useContext, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput, ImageBackground, Pressable, Image, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import containers from '../../../styles/containers';
import global from '../../../styles/global';
import Alt_Header from '../../../components/Headers/Alt_Header';
import Button_Main from '../../../components/Buttons/Button_Main';
import { authenticate_me } from '../../../firebase/methods/User_Functions';
import { delete_account } from '../../../firebase/methods/Delete_Functions';
import { AuthContext } from '../../../contexts/Auth.context';
import typography from '../../../styles/typography';


function Delete_Account(props){   
    const { user } = useContext(AuthContext);
    const [authenticated, set_authenticated] = useState(false)
    const [password, set_password] = useState("");
    const [error, set_error] = useState("");
    const [loader, set_loader] = useState(false);

    const delete_handler = async () => {
        set_loader(true);
        try {
            await delete_account(user);
        } catch(error) {
            set_error(error.message)
            set_loader(false);
        }
    }

    const authenticate_user = async () => {
        set_loader(true);
        try {
            await authenticate_me(password);
            set_authenticated(true)
            set_error("");
            set_loader(false);
        } catch(error) {
            set_error(error.message);
            set_loader(false);
        }
       
    }

    return (      
        <View>
            
                {
                    authenticated === true ? (
                        <>
                        <Text style={typography.main}>This action is irreversible</Text>
                        <View style={styles.input__wrapper}>
                            <Button_Main hollow={true} loader={loader} action={() => delete_handler()}>Delete My Account</Button_Main>
                        </View>
                        </>
                    ) : (
                        <>
                        <View style={styles.input__wrapper}>
                            <Text style={global.input_light_label}>Please enter your password</Text>
                            <TextInput style={global.input_light} secureTextEntry={true} value={password} placeholder="" onChangeText={(e) => set_password(e)}/>
                        </View>
                        <Button_Main loader={loader} hollow={true} action={() => authenticate_user()}>Continue</Button_Main>
                        </>
                    )
                }
                 <Text style={global.status_text}>{error}</Text>
            
        </View>
    )
}

export default Delete_Account;



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        justifyContent: 'space-evenly'
    },
    
});
