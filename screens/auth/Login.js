import React, { useState, useContext } from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import colors from '../../assets/colors/colors';
import global from '../../styles/global';
import { AntDesign } from '@expo/vector-icons';
import typography from '../../styles/typography';
import { AuthContext } from '../../contexts/Auth.context';
import Button_Main from '../../components/Buttons/Button_Main';
import Alt_Header from '../../components/Headers/Alt_Header';
import Text_Input from '../../components/Items/Text_Input';
import Password_Input from '../../components/Items/Password_Input';


function Login({ navigation }){ 
    const { sign_in } = useContext(AuthContext);
    const [email_input, set_email_input] = useState("");
    const [password_input, set_password_input] = useState("");
    const [status, set_status] = useState("");
    const [loader, set_loader] = useState(false);


    const submit_handler = () => {
        set_loader(true);
        sign_in({email: email_input.trim(), password: password_input.trim()}).then(result => {
            if(result === true){
                set_status("Logged in")
            } else {
                set_loader(false);
                set_status(result);
            }
        })        
    }

    return (      
        <ScrollView contentContainerStyle={styles.container}>
            <Alt_Header></Alt_Header>
            <AntDesign name="login" size={90} color={colors.primary} />
            <Text style={[typography.header_3, styles.question]}>Enter your details</Text>
            <Text_Input lowercase={true} dark={true} value={email_input} input={set_email_input}>Email</Text_Input>
            <Password_Input value={password_input} input={set_password_input}>Password</Password_Input>
            <Button_Main dark={true} active={email_input.length >= 1 && password_input.length >= 1} action={() => submit_handler()} loader={loader}>Login</Button_Main>
            <Text onPress={() => navigation.navigate("Reset_Password")} style={[typography.small, global.text_light]}>Forgot your password?</Text>
            <Text style={[global.status_text, global.text_light]}>{status}</Text>
            <Text style={[typography.main, global.text_light_medium]}>Back to <Text onPress={() => navigation.navigate('Register')} style={[typography.main_bold, global.text_light]}> Register</Text></Text>
        </ScrollView>
    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary,
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 60,
        alignItems: 'center'
    },
    question: {
        color: colors.text_light,
        alignSelf: 'flex-start'
    },
})

export default Login;
