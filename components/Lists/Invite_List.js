import React from 'react';
import { FlatList, View } from 'react-native';
import Group_Invite_Preview from '../Previews/Group_Invite_Preview';
import Invite_Preview from '../Previews/Invite_Preview';

function Invite_List(props){  
    const data = props.data;
    const filtered_query = props.query || null;

    const filter_query_handler = (event) => {       
        const queryText = filtered_query.toLowerCase();
        const event_name = event.name.toLowerCase();
        const group_name = event.group_name.toLowerCase();
        return event_name.includes(queryText) || group_name.includes(queryText); 
    }

    const filter_handler = (events) => {
        if(filtered_query) return events.filter(event => filter_query_handler(event));
        return events;
    };


    return (
        <FlatList 
            data={filter_handler(data)} 
                renderItem={({ item }) => ( props.group ? <Group_Invite_Preview data={item} /> : <Invite_Preview data={item} /> )}
                keyExtractor={item => item.id} 
                showsVerticalScrollIndicator={false}
              />             
    )
}


export default Invite_List;

