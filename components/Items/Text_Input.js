import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import colors from '../../assets/colors/colors';

function Text_Input(props){
    return (
    <View style={styles.wrapper}>
        {props.children ? <Text style={props.dark ? styles.label_dark : styles.label}>{props.children}</Text> : null}
        <TextInput autoCapitalize={props.lowercase === true ? "none" : null} style={props.dark ? styles.input_dark : styles.input} value={props.value} placeholder="" onChangeText={(e) => props.input(e)}/>
    </View>
    )
}

export default Text_Input;



const styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch'
    },
    input: {
        backgroundColor: '#eee',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        color: "#707070",
        alignSelf: 'stretch',  
        height: 60
    },
    label: {
        fontFamily: 'Ubuntu-Regular',
        color: colors.text_dark,
        marginBottom: 5
    },
    input_dark: {
        backgroundColor: '#4C4C65',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        color: colors.text_light,
        alignSelf: 'stretch',    
        height: 60
    },
    label_dark: {
        fontFamily: 'Ubuntu-Regular',
        color: colors.text_light_medium,
        marginBottom: 5
    },
})