import React, { useContext, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import containers from '../../styles/containers';
import Alt_Header from '../../components/Headers/Alt_Header';
import Selection_Box from '../../components/Items/Selection_Box';
import Group_Invites from './Settings/Group_Invites';
import Manage_Mods from './Settings/Manage_Mods';
import Delete_Group from './Settings/Delete_Group';
import { AuthContext } from '../../contexts/Auth.context';


function Group_Settings(props){   
    const [selected, set_selected] = useState(0);
    const { user } = useContext(AuthContext);
    const group_data = props.data;

    const back_handler = () => {
        if(selected === 0) { props.close(false) } else { set_selected(0) }
    };

    const main = (
        <View style={containers.selection_box_wrapper}>
            <Selection_Box action={() => set_selected(1)}>Send Invites</Selection_Box>
            {!group_data ? null : (
                <>
                <Selection_Box action={() => set_selected(2)}>Manage Mods</Selection_Box>
                {group_data.admin === user ? <Selection_Box action={() => set_selected(3)}>Delete Group</Selection_Box> : null}
                </>
            ) }
        </View>
    );

    const content = [main, <Group_Invites data={group_data} />, <Manage_Mods data={group_data} />, <Delete_Group data={group_data} />]


    return (      
        <View style={styles.container}>
            <Alt_Header back_handler={back_handler}></Alt_Header>
            <View style={[containers.main, styles.wrapper]}>
                {content[selected]}
            </View>
        </View>
    )
}

export default Group_Settings;



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        justifyContent: 'space-evenly'
    },
    
});



