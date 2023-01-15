import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import containers from '../../styles/containers';
import typography from '../../styles/typography';
import colors from '../../assets/colors/colors';
import { reset_password } from '../../firebase/methods/User_Functions';
import global from '../../styles/global';
import Button_Main from '../../components/Buttons/Button_Main';
import Text_Input from '../../components/Items/Text_Input';
import Alt_Header from '../../components/Headers/Alt_Header';


function Reset_Passsword() {   
    const [email_input, set_email_input] = useState("");
    const [status, set_status] = useState("");
    const [loader, set_loader] = useState(false);

    const reset_handler = async  () => {
        if(loader === false) {
            set_loader(true);
            try {
                await reset_password(email_input);
                set_status("Sent")
                set_loader(false);
            } catch(error) {
                set_status(error.message)
                set_loader(false);
            };
        };
    };

    return (      
        <View style={styles.container}>
            <Alt_Header></Alt_Header>
            <View style={[containers.main, styles.wrapper]}>
                <Text style={[typography.header_4, global.text_light]}>Enter your email to recieve an email reset</Text>
                <Text_Input dark={true} value={email_input} input={set_email_input}>Email</Text_Input>
                <Button_Main active={true} loader={loader} action={reset_handler}>Reset</Button_Main>
                <Text style={[global.status_text, { color: colors.text_light }]}>{status}</Text>
            </View>
        </View>
    )
}

export default Reset_Passsword;



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary,
        paddingVertical: 60
    },
    wrapper: {
        flex: 1,
        justifyContent: 'space-evenly'
    },  
});



