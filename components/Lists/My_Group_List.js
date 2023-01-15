import React from 'react';
import { FlatList, View } from 'react-native';
import List_Footer from '../Displays/List_Footer';
import Group_Preview from '../Previews/Group_Preview';

function Group_List(props){  
    const data = props.data;

    const filtered_query = props.query || null;

   
    const filter_query_handler = (group) => {       
        const queryText = filtered_query.toLowerCase();
        const name = group.name.toLowerCase();
        const about = group.about.toLowerCase();
        return name.includes(queryText) || about.includes(queryText);
    }

    const filter_handler = (groups) => {
        var filters = [];
        if(filtered_query) filters.push(filter_query_handler); 
        return groups.filter(v => filters.every(f => f(v)));
      }

    return (
        <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
            {data.map(item => <Group_Preview data={item} />)}
        </View>
    )
}

export default Group_List;



{/* <FlatList 
data={data}
ListFooterComponent={List_Footer}
renderItem={({ item }) => (
    <Group_Preview data={item} />
) }
keyExtractor={item => item.id}
numColumns="2"
showsVerticalScrollIndicator={false}
columnWrapperStyle={{justifyContent: 'space-between'}}
/> */}