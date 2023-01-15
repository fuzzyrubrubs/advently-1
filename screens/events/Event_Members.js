import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import containers from '../../styles/containers';
import Alt_Header from '../../components/Headers/Alt_Header';
import Selection_Box from '../../components/Items/Selection_Box';
import { delete_event } from '../../firebase/methods/Delete_Functions';
import Button_Main from '../../components/Buttons/Button_Main';
import Event_Invites from './Manage/Event_Invites';
import { remove_invite, remove_joiner } from '../../firebase/methods/Event_Functions';
import { Joiner_List } from '../../components/Lists/Member_List';
import global from '../../styles/global';
import typography from '../../styles/typography';
import { AuthContext } from '../../contexts/Auth.context';

function Event_Members (props) {
    const { user } = useContext(AuthContext);
    const data = props.data;
    const remove_handler = (id) => remove_joiner(id, data.id);
    const alt_remove_handler = (id) => remove_invite(id, data.id);
    const access = data.mods.includes(user);
    return (
        <View style={styles.container}>
            <Alt_Header back_handler={() => props.close(false)}>Going</Alt_Header>
            {access ? <Text contentContainerStyle={{justifyContent: 'space-evenly'}} style={[global.information, typography.main]}>Press and hold to remove someone.</Text> : null}
            <ScrollView showsVerticalScrollIndicator={false} style={[containers.main, styles.wrapper]}>
                <Text style={[typography.header_5, styles.header]}>Confirmed</Text>
                <Joiner_List list={data.members} data={data} press={remove_handler} alt_press={alt_remove_handler} />
                {data.invites.length === 0 ? null : <Text style={[typography.header_5, styles.header]}>Invited</Text>}
                <Joiner_List list={data.invites} data={data} press={remove_handler} alt_press={alt_remove_handler} />
                {data.declined.length === 0 ? null : <Text style={[typography.header_5, styles.header]}>Declined</Text>}
                <Joiner_List list={data.declined} data={data} press={remove_handler} alt_press={alt_remove_handler} />
            </ScrollView>
        </View>
    )
}

export default Event_Members;



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
    },
    header: {
        marginBottom: 10,
        marginTop: 20
    }
    
});