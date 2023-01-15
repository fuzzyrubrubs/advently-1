import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import colors from '../../assets/colors/colors';
import { Ionicons } from '@expo/vector-icons';

function Password_Input(props){
    const [hide_password, set_hide_password] = useState(true);

    return (
    <View style={styles.wrapper}>
        <Text style={styles.label_dark}>{props.children}</Text>
        <View style={styles.input_wrapper}>
            <TextInput style={styles.input_dark} value={props.value} secureTextEntry={hide_password} placeholder="" onChangeText={(e) => props.input(e)} />
            <Pressable autoCapitalize="none" onPress={() => set_hide_password(password => !password)}>{hide_password ? <Ionicons name="ios-eye-off-outline" size={24} color={colors.text_light} /> : <Ionicons name="ios-eye-outline" size={24} color={colors.text_light} />}</Pressable>
        </View>
    </View>
    )
}

export default Password_Input;



const styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch',
    },
    label_dark: {
        fontFamily: 'Ubuntu-Regular',
        color: colors.text_light_medium,
        marginBottom: 5
    },
    input_wrapper: {
        backgroundColor: '#4C4C65',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        height: 60
    },
    input_dark: {
        color: colors.text_light,
        flex: 1
    },
})