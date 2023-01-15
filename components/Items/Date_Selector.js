import React from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import colors from '../../assets/colors/colors';
import typography from '../../styles/typography';

function Events_Date_Selector(props){
    return (
    <Pressable onPress={() => props.action()} style={({pressed}) => [{}, styles.container, props.selected ? styles.selected : null]}>
        <Text style={typography.main}>{props.data.day.slice(0, 3)}</Text>
        <Text style={[styles.date, typography.large]}>{props.data.date}</Text>
    </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 15,
        height: 80,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 20,
        opacity: 0.5,
        marginBottom: 15,
    }, 
    selected: {
        opacity: 1,
        borderBottomWidth: 2,
        borderBottomColor: colors.text_dark
    }
})

export default Events_Date_Selector;