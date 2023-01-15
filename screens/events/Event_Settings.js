import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import containers from '../../styles/containers';
import Alt_Header from '../../components/Headers/Alt_Header';
import Selection_Box from '../../components/Items/Selection_Box';
import { delete_event } from '../../firebase/methods/Delete_Functions';
import Button_Main from '../../components/Buttons/Button_Main';
import Event_Invites from './Manage/Event_Invites';
import Event_Mods from './Manage/Event_Mods';
import { useNavigation } from '@react-navigation/native';


function Event_Settings(props){   
    const event_data = props.data;
    const [loader, set_loader] = useState(false);
    const [selected, set_selected] = useState(0);
    const navigation = useNavigation();


    const back_handler = () => {
        if(selected === 0) { props.close(false) } else { set_selected(0) }
    };

    const main = (
        <View style={containers.selection_box_wrapper}>
            <Selection_Box action={() => set_selected(1)}>Send Invites</Selection_Box>
            <Selection_Box action={() => set_selected(2)}>Manage Mods</Selection_Box>
        </View>
    );

    const content = [main, <Event_Invites data={event_data} />, <Event_Mods data={event_data} />]




    return (      
        <View style={styles.container}>
            <Alt_Header back_handler={back_handler}>Manage Event</Alt_Header>
            <View style={[containers.main, styles.wrapper]}>
                <Event_Invites data={event_data} />
            </View>
        </View>
    )
}

export default Event_Settings;



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        justifyContent: 'space-evenly'
    },
    
});



