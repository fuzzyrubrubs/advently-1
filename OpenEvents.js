import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput, RefreshControl } from 'react-native';
import Slider from '@react-native-community/slider';
import { get_events } from '../../firebase/methods/Event_Functions';
import { update_my_profile } from '../../firebase/methods/User_Functions';
import { LocationContext } from '../../contexts/Location.context';
import { populate_30_days } from '../../tools/DateTime_Methods';
import containers from '../../styles/containers';
import typography from '../../styles/typography';
import global from '../../styles/global';
import colors from '../../assets/colors/colors';
import Empty from '../../components/Displays/Empty';
import { useFocusEffect } from '@react-navigation/native';
import Category_Menu from '../../components/Items/Category_Menu';
import Event_List from '../../components/Lists/Event_List';
import Dates_List from '../../components/Lists/Dates_List';
import Loader from '../../components/Displays/Loader';
import Alt_Header from '../../components/Headers/Alt_Header';


function ExploreEvents({ navigation }){ 
    const { calculate_distance, address, location } = useContext(LocationContext);
    const [all_events, set_all_events] = useState([]);
    const [date_selected, set_date_selected] = useState(0);
    const [show_filters, set_show_filters] = useState(false);
    const [filtered_distance, set_filtered_distance] = useState(25);
    const [filtered_type, set_filtered_type] = useState(0);
    const [filtered_query, set_filtered_query] = useState("");
    const [refreshing, set_refreshing] = React.useState(false);
    const [loader, set_loader] = useState(true);
    

    const fetch_data = async () => {
        const data = await get_events();
        data.forEach(event => {
            const distance = calculateDistance(event.coordinates);
            event.distance = Number(distance);
        })
        set_all_events(data);
        set_refreshing(false);
        set_loader(false);
    };


    useFocusEffect(
        React.useCallback(() => {
            fetch_data();
        }, [])
    );

    const onRefresh = React.useCallback(() => {
        set_refreshing(true);
        fetch_data();
    }, []);
 
    const calculateDistance = (coordinates) => (calculate_distance(coordinates.latitude, coordinates.longitude));

    const next_30_days = populate_30_days();

    return (  
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/> }>

            <Alt_Header action={() => set_show_filters(!show_filters)} action_text="Filters" >Explore {address.subregion}</Alt_Header>
            {/* HEADER  */}
            <View style={styles.header_wrapper}>

                {/* TITLE  */}
                <Text style={typography.header_1}>Events</Text>
                
                {/* FILTERS */}
                <View style={show_filters ? styles.filters : {transform: [{ scale: 0 }], height: 0}}>
                    {/* TEXT SEARCH */}
                    <TextInput style={global.input_light} placeholder="What are you looking for?" onChangeText={(e) => set_filtered_query(e)}/>    
                    {/* SEARCH RADIUS  */}
                    <View style={[containers.simple_row, styles.slider_wrapper]}>
                        <Text style={typography.main_bold}>Maximum distance</Text>
                        <Text style={typography.main_bold}>{filtered_distance} miles</Text>
                    </View>
                    <Slider style={styles.slider} minimumValue={1} maximumValue={50} minimumTrackTintColor={colors.primary_light} maximumTrackTintColor={colors.primary_light} thumbTintColor={colors.primary} value={filtered_distance} onSlidingComplete={value => set_filtered_distance(value.toFixed(0))} />
                    {/* CATEGORIES */}
                    <Category_Menu filtered_type={filtered_type} set_filtered_type={(e) => set_filtered_type(e)} />
                </View>

            </View>

            {/* DATE PICKER */}
            <Dates_List data={next_30_days} selector={(e) => set_date_selected(e)} selected={date_selected} />

            {/* MAIN */}
            {loader ? ( <Loader /> ) : (
            <View style={containers.main}>
                {all_events.length === 0 ? ( <Empty>No public events listed, be the first to create one</Empty> ) :
                    <Event_List data={all_events} query={filtered_query} type={filtered_type} distance={filtered_distance} date={next_30_days[date_selected].full} />      
                 }
            </View>

            )}

        </ScrollView>
    )
}

export default ExploreEvents;

const styles = StyleSheet.create({
    filters: {
        paddingTop: 20
    },
    slider_wrapper: {
        width: "100%",
        alignSelf: 'center',
        marginTop: 10
    },  
    slider: { 
        height: 40,
        color: colors.primary,  
        width: "100%",
        alignSelf: 'center'
    },  
    header_wrapper: {
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
});




