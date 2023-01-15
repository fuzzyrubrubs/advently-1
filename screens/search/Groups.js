import React, { useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput, RefreshControl } from 'react-native';
import containers from '../../styles/containers';
import typography from '../../styles/typography';
import global from '../../styles/global';
import { LocationContext } from '../../contexts/Location.context';
import { get_nearby_groups } from '../../firebase/methods/Group_Functions';
import Empty from '../../components/Displays/Empty';
import Category_Menu from '../../components/Items/Category_Menu';
import Alt_Header from '../../components/Headers/Alt_Header';
import Group_List from '../../components/Lists/Group_List';
import Loader from '../../components/Displays/Loader';
import Drop_Input from '../../components/Items/Drop_Input';

function ExploreGroups({ navigation }){ 
    const [all_groups, set_all_groups] = useState([]);
    const { address, location } = useContext(LocationContext);
    const [filtered_type, set_filtered_type] = useState(0);
    const [filtered_query, set_filtered_query] = useState("");
    const [refreshing, set_refreshing] = useState(false);
    const [loader, set_loader] = useState(true);
    
    const onRefresh = React.useCallback(() => {
        set_refreshing(true);
        const fetch_data = async () => {
            const data = await get_nearby_groups(location);
            set_all_groups(data);
            set_refreshing(false);
        }
        fetch_data();
    }, []);

    useEffect(() => {
        const fetch_data = async () => {
            const data = await get_nearby_groups(location);
            set_all_groups(data);
            set_loader(false);
        }
        fetch_data();
    }, [])

    return (  
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/> }>
            {/* NAVIGATION */}
            <Alt_Header>Explore {address.subregion}</Alt_Header>

            {/* HEADER */}
            <View style={styles.main_wrapper}>
                {/* <Text style={typography.header_1}>Communities</Text> */}
                <TextInput style={[global.input_light]} placeholder="What are you looking for?" onChangeText={(e) => set_filtered_query(e)}/>
                <View style={[{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15}]}>
                    <Drop_Input action={set_filtered_type} active={true} options={["All", "Charity", "Community", "Business"]}>Type</Drop_Input>
                    {/* <Drop_Input action={set_selected} active={true} options={["Newest", "Oldest"]}>Sort</Drop_Input> */}
                </View>
                {/* <Category_Menu filtered_type={filtered_type} set_filtered_type={(e) => set_filtered_type(e)} /> */}
            </View>

            {/* MAIN */}
            {loader ? ( <Loader /> ) : (
                <View style={containers.main}>
                    {all_groups.length === 0  ? ( <Empty>No public communities listed, be the first to create one</Empty> ) :
                        <Group_List data={all_groups} query={filtered_query} type={filtered_type} />
                    }
                </View>
            )}
        </ScrollView>
    )
}

export default ExploreGroups;

const styles = StyleSheet.create({
    main_wrapper: {
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 20,
        marginTop: 10
    }
})

