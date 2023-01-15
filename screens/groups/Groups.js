import React, { useContext, useState } from 'react';
import { Text, View, FlatList, ScrollView, RefreshControl, BackHandler } from 'react-native';
import containers from '../../styles/containers';
import typography from '../../styles/typography';
import global from '../../styles/global';
import { find_user_admins, find_user_mods, get_ginvites, get_user_groups } from '../../firebase/methods/User_Functions';
import { AuthContext } from '../../contexts/Auth.context';
import { useFocusEffect } from '@react-navigation/native';
import Main_Header from '../../components/Headers/Main_Header';
import Empty from '../../components/Displays/Empty';
import Loader from '../../components/Displays/Loader';
import My_Group_List from '../../components/Lists/My_Group_List';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import Invite_List from '../../components/Lists/Invite_List';
import Invites from '../singles/View_Invites';
import Group_List from '../../components/Lists/Group_List';
import Drop_Input from '../../components/Items/Drop_Input';

function Groups({ navigation }){
    const { user } = useContext(AuthContext);
    const { groups, ginvites } = useContext(ProfileDataContext);
    const [filtered_query, set_filtered_query] = useState("");
    const [filtered_type, set_filtered_type] = useState(0);
    const [loader, set_loader] = useState(false);
    const [view_invites, set_view_invites] = useState(false);

    
    const handleBackButtonClick = () => { navigation.navigate("Events", { screen: 'Events' }); return true; }

    useFocusEffect(
        React.useCallback(() => {
            BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
              };
        }, [])
      );


    if(view_invites) { return <Invites group={true} close={set_view_invites} /> }
    return (  
        <ScrollView>
            <Main_Header link="Create_Group" action={(e) => set_filtered_query(e)}>My Groups</Main_Header>
            { loader ? ( <Loader /> ) : (
            <View>
                {ginvites.length === 0 ? null : (
                    <>
                    <View style={[containers.main, containers.simple_row]}>
                        <Text style={typography.header_2}>Invites</Text>
                        {ginvites.length > 3 ? <Text style={typography.small} onPress={() => set_view_invites(true)}>View All</Text> : null}
                    </View>

                    <View style={[global.list_wrapper]}>
                       <Invite_List data={ginvites.slice(0, 3)} group={true} query={filtered_query} />
                    </View>
                    </>
                )}
                <View style={containers.main}>
                    <View style={[{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15}]}>
                        <Drop_Input action={set_filtered_type} active={true} options={["All", "Charity", "Community", "Business"]}>Type</Drop_Input>
                    </View>
                    <Group_List data={groups} personal={true} query={filtered_query} type={filtered_type} />

                {groups.length === 0 && ginvites.length === 0 ? <Empty>Communities are the heart of Advently, they serve to organise the same group of members for regular events. Join one to receive updates and invites to their current and future events.</Empty> : null}
                </View>
            </View>
            )}
        </ScrollView>
    )
}

export default Groups;

