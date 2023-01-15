import React from 'react';
import { Text, View, FlatList } from 'react-native';
import global from '../../styles/global';
import typography from '../../styles/typography';
import { date_after, event_preview_array_format } from '../../tools/DateTime_Methods';
import { format_events } from '../../tools/Global_Functions';
import Empty from '../Displays/Empty';
import List_Footer from '../Displays/List_Footer';
import Event_Preview from '../Previews/Event_Preview';

function Event_List(props){  
    const data = props.data;

    const filtered_type = props.type || null;
    const filtered_query = props.query || null;
    const filtered_distance = props.distance || null;
    const filtered_date = props.date || null;

    const filter_query_handler = (event) => {       
        const queryText = filtered_query.toLowerCase();
        const event_name = event.name.toLowerCase();
        const group_name = event.group_name.toLowerCase();
        return event_name.includes(queryText) || group_name.includes(queryText); 
    }
    const filter_by_type = event => (event.group_type === filtered_type || filtered_type === 0);
    const filter_by_radius = event => (event.distance < filtered_distance);

    const filter_by_date = (array, new_date) => array.filter(item => date_after(item.date, new_date));

    const filter_handler = (events) => {
        var filters = [];
        if(filtered_type) filters.push(filter_by_type);
        if(filtered_distance) filters.push(filter_by_radius);
        if(filtered_query) filters.push(filter_query_handler);  

        const filteredData = events.filter(v => filters.every(f => f(v)));
        const format_filtered = format_events(filteredData);
        if(filtered_date){
            return filter_by_date(format_filtered, filtered_date);
        } else {
            return format_filtered
        }
    }

    return (
        <FlatList data={filter_handler(data)} 
            ListFooterComponent={data.length > 3 ? List_Footer : null} 
            ListEmptyComponent={<Empty>Sign up to Events to see them here.</Empty>}
            renderItem={({ item }) => {
            return (
                <View style={global.event_previews_wrapper}>
                    <Text style={[typography.extra_small, global.events_preview_date]}>{event_preview_array_format(item.date).toUpperCase()}</Text>
                    {item.events.map((event, index) => <Event_Preview event={event} key={index} />)}
                </View>
                    ) 
                }
            }
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()} 
        />
    )
}


export default Event_List;

