import React from 'react';
import { FlatList } from 'react-native';
import Events_Date_Selector from '../Items/Date_Selector';

function Dates_list(props){  
    const dates = props.data;

    return (
        <FlatList data={dates} 
            renderItem={({ item }) => (
                <Events_Date_Selector data={item} action={() => props.selector(item.id)} selected={item.id === props.selected ? true : false} />
            )}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            horizontal
        />
    )
}


export default Dates_list;

