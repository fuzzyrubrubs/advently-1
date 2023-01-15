import React, { useState } from "react";
import { StyleSheet, Pressable, Modal, View } from 'react-native';
import colors from "../../assets/colors/colors";


function CustomModal (props) {
    const content = props.content;

    return (
        <>
        <Pressable onPress={() => props.set_show(true)}>{content}</Pressable>
        <Modal animationType="fade" transparent={true} visible={props.show} onRequestClose={() => { props.set_show(false); }}>
            <Pressable style={styles.modal} onPress={() => {props.set_show(false);}}>
                <View style={styles.wrapper}>
                    {props.children}
                </View>
            </Pressable>
        </Modal>
        </>
    )
}

export default CustomModal;



const styles = StyleSheet.create({
    modal: {
        height: "100%",
        width: "100%",
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center', 
        justifyContent: 'center'
    },
    wrapper: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 30,
        width: "75%"
    }
})