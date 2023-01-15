import React from 'react';
import { Text, View } from 'react-native';
import containers from '../../styles/containers';
import typography from '../../styles/typography';

function Category_Menu(props){
    const categories = ["All", "Charity", "Community", "Business"];

    return (
        <View style={containers.simple_row}>
            {categories.map((type, index) => <Text onPress={() => props.set_filtered_type(index)} key={index} style={[typography.main_bold, {opacity: 0.5}, props.filtered_type === index ? {opacity: 1} : null]}>{type}</Text> )}
        </View>
    );
};


export default Category_Menu;

