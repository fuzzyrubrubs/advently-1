import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import colors from '../../assets/colors/colors';
import global from '../../styles/global';
import typography from '../../styles/typography';


function View_Button(props){   


    return (      
        <Pressable onPress={props.action} style={({pressed}) => [{opacity: pressed ? 0.5 : 1}, styles.view_button]}>
            <Text style={[typography.main, {textAlign: 'center'}]}>{props.children}</Text>
        </Pressable>
    )
}

export default View_Button;



const styles = StyleSheet.create({
    view_button: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        minWidth: 120,
        borderWidth: 3,
        borderColor: colors.primary,
        borderRadius: 50, 
        marginTop: 10,
        marginBottom: 10,
        marginHorizontal: 7,
        textAlign: 'center',
        backgroundColor: colors.white
    }, 
    
});



