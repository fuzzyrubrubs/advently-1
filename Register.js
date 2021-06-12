import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/Auth.context';
import colors from '../../assets/colors/colors';
import global from '../../styles/global';
import typography from '../../styles/typography';
import Button_Main from '../../components/Buttons/Button_Main';
import Alt_Header from '../../components/Headers/Alt_Header';
import Text_Input from '../../components/Items/Text_Input';
import Password_Input from '../../components/Items/Password_Input';


function Register({ navigation }){ 
    const { register_user } = useContext(AuthContext);
    const [stage, set_stage] = useState(0)
    const [name_input, set_name_input] = useState("");
    const [email_input, set_email_input] = useState("");
    const [password_input, set_password_input] = useState("");
    const [loader, set_loader] = useState(false);
    const [status, set_status] = useState("");

    const next_active_handler = () => {
        if(stage === 0) return name_input.length >= 3 && name_input.length < 20;
        if(stage === 1) return email_input.length >= 3;
        if(stage === 2) return password_input.length >= 3;
    }

    const submit_handler = () => {
        if(loader === false) {
            set_loader(true);
            const user_main = {email: email_input, password: password_input};
            const user_profile = {name: name_input};
            try {
                register_user(user_main, user_profile)
                set_status("Created")
            } catch(error) {
                set_loader(false);
                set_status(error.message)
            }
        }
    }  
      
    
    const continue_handler = () => set_stage(stage + 1);
    const back_handler = () => stage === 0 ? navigation.goBack() : set_stage(stage - 1);


    const stage_one = (
        <>
        <FontAwesome name="user-circle-o" size={90} color={colors.primary} />
        <Text style={[typography.header_3, styles.question]}>To start, what's your name?</Text>
        <Text_Input dark={true} value={name_input} input={set_name_input}>Name</Text_Input>
        </>
    )

    const stage_two = (
        <>
        <MaterialIcons name="mail-outline" size={90} color={colors.primary} />
        <Text style={[typography.header_3, styles.question]}>We need to know your email address</Text>
        <Text_Input dark={true} value={email_input} input={set_email_input}>Email</Text_Input>
        </>
    )

    const stage_three = (
        <>
        <Ionicons name="lock-closed-outline" size={90} color={colors.primary} />
        <Text style={[typography.header_3, styles.question]}>Lastly, set your password</Text>
        <Password_Input value={password_input} input={set_password_input}>Password</Password_Input>
        </>
    )

    const content = [stage_one, stage_two, stage_three];

    return (      
        <View style={styles.container}>
            <Alt_Header back_handler={back_handler}></Alt_Header>
            {content[stage]}
            {stage === 2 ? <Button_Main active={next_active_handler()} loader={loader} action={submit_handler}>Complete</Button_Main> : <Button_Main active={next_active_handler()} action={continue_handler}>Next</Button_Main> }
            <Text style={[global.status_text, { color: colors.text_light }]}>{status}</Text>
            <Text style={[typography.main, styles.footer]}>Back to <Text onPress={() => navigation.navigate('Login')} style={[typography.main_bold, styles.text_light]}> Login</Text></Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary,
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        alignItems: 'center'
    },
    question: {
        color: colors.text_light,
        alignSelf: 'flex-start'
    },
    text_light: {
        color: colors.text_light
    }, 
    footer: {
        color: colors.text_light_medium,
        marginBottom: 30
    }, 
})

export default Register;
