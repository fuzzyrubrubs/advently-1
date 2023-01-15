import React, { useContext, useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import containers from '../../../styles/containers';
import Alt_Header from '../../../components/Headers/Alt_Header';
import typography from '../../../styles/typography';
import { AuthContext } from '../../../contexts/Auth.context';
import { ProfileDataContext } from '../../../contexts/ProfileData.context';
import { Invite_List } from '../../../components/Lists/Member_List';
import Pop_Menu from '../../../components/Displays/Pop_Menu';
import Button_Main from '../../../components/Buttons/Button_Main';
import { add_invite, remove_invite } from '../../../firebase/methods/Group_Functions';
import { Invite } from '../../../components/Previews/Member_Preview';


function Group_Invites(props){   
    const group_data = props.data;
    const { user } = useContext(AuthContext);
    const { groups, user_profile } = useContext(ProfileDataContext);  
    const [error, set_error] = useState("");
    const [display_options, set_display_options] = useState(false);


    const press_handler = (data, status) => {
        if(status === 0) { add_invite(data, group_data); }
        if(status === 2) { remove_invite(data, group_data.id) }
    };


    return (      
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={typography.header_1}>Send Invites</Text>
                <Text style={[typography.main, styles.text]}>Tap your connections to invite them to {group_data.name}, if the invite is pending you can tap again to uninvite them.</Text>
                <Text style={[typography.header_4, styles.header]}>Friends</Text>
                <Invite_List data={group_data} list={user_profile.friends} press={press_handler} />
                {groups.filter(item => item.id !== group_data.id).map(item => {
                    return (
                        <>
                        <Text style={[typography.header_4, styles.header]}>{item.name}</Text>
                        <Invite_List data={group_data} list={item.members.filter(item => item !== user)} press={press_handler} />
                        </>
                    )
                })}
            </ScrollView>
            
    )
}

export default Group_Invites;



const styles = StyleSheet.create({
    text: {
        marginVertical: 10
    },
    header: {
        marginBottom: 10,
        marginTop: 30
    }
});
