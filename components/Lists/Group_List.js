import React from 'react';
import { FlatList } from 'react-native';
import List_Footer from '../Displays/List_Footer';
import Group_Preview from '../Previews/Group_Preview';

function Group_List(props){  
    const data = props.data;

    const filtered_type = props.type || null;
    const filtered_query = props.query || null;


    const filter_private_handler = group => (props.personal ? true : group.type !== 0);

   
    const filter_query_handler = (group) => {       
        const queryText = filtered_query.toLowerCase();
        const name = group.name.toLowerCase();
        const about = group.about.toLowerCase();
        return name.includes(queryText) || about.includes(queryText);
    }

    const filter_by_type = group => (group.type === filtered_type || filtered_type === 0);

    const filter_handler = (groups) => {
        var filters = [];
        if(filtered_type) filters.push(filter_by_type);
        if(filtered_query) filters.push(filter_query_handler); 
        if(filtered_query === null || filtered_query.length < 3) filters.push(filter_private_handler);
        return groups.filter(v => filters.every(f => f(v)));
      }

    return (
        <FlatList 
            data={filter_handler(data)}
            ListFooterComponent={List_Footer}
            renderItem={({ item }) => (
                <Group_Preview data={item} />
            ) }
            keyExtractor={item => item.id}
            // numColumns="2"
            // columnWrapperStyle={{justifyContent: 'space-between'}}
            showsVerticalScrollIndicator={false}
    />
    )
}

export default Group_List;

