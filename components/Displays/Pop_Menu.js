

import React, { useEffect, useState } from 'react';
import { StyleSheet, Pressable, View, Image, Text, Modal } from 'react-native';
import colors from '../../assets/colors/colors';
import { get_user_data } from '../../firebase/methods/User_Functions';
import typography from '../../styles/typography';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { add_invite } from '../../firebase/methods/Event_Functions'; 

function Pop_Menu(props){
    const data = props.data;

    
    return (
        <Modal animationType="fade" transparent={true} visible={props.visible} onRequestClose={() => {props.close(false);}}>
            <Pressable style={styles.modal} onPress={() => {props.close(false);}}>
            <View style={[styles.options, global.shadow]}>
                <View style={styles.options_icon}><Image style={styles.image} source={{uri: data.image }} /></View>
                <Text style={typography.main}>{data.name}</Text>
                <View style={styles.options_wrapper}>
                    {props.children}
                </View>
            </View>
            </Pressable>
        </Modal>
    )
}

export default Pop_Menu;

const styles = StyleSheet.create({

    image: {
        height: 75,
        width: 75,
        borderRadius: 80,
    },
    name: {
        textAlign: 'center'
    },
    icon: {
        position: 'absolute',
        zIndex: 5,
        right: 5,
        top: 55,
        backgroundColor: colors.white,
        borderRadius: 20
    }, 
    modal: {
        height: "100%",
        width: "100%",
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center', 
        justifyContent: 'center'
    }, 
    options: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: colors.white,
        zIndex: 1,
        paddingHorizontal: 10,
        paddingVertical: 50,
        width: 280, 
        height: 'auto',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: 20
    },
    options_icon: {
        position: 'absolute',
        top: -40,
        borderWidth: 10,
        borderColor: colors.text_light,
        borderRadius: 80,
        width: 80,
        height: 80,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    options_wrapper: {
       width: "100%",
       marginTop: 20
    },  
    options_button: {
        
    },  
})