import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import containers from '../../styles/containers';
import Alt_Header from '../../components/Headers/Alt_Header';
import Selection_Box from '../../components/Items/Selection_Box';
import Change_Password from './Settings/Change_Password';
import Delete_Account from './Settings/Delete_Account';


function Settings(props){   
    const [selected, set_selected] = useState(0);
    const user_data = props.data;

    const back_handler = () => {
        if(selected === 0) { props.close(false) } else { set_selected(0) }
    };

    const main = (
        <View style={containers.selection_box_wrapper}>
            <Selection_Box action={() => set_selected(1)}>Change Password</Selection_Box>
            <Selection_Box action={() => set_selected(2)}>Delete Account</Selection_Box>
        </View>
    );

    const content = [main, <Change_Password data={user_data} />, <Delete_Account data={user_data} />]


    return (      
        <View style={styles.container}>
            <Alt_Header back_handler={back_handler}>Settings</Alt_Header>
            <View style={[containers.main, styles.wrapper]}>
                {content[selected]}
            </View>
        </View>
    )
}

export default Settings;


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        justifyContent: 'center'
    },
    
});



