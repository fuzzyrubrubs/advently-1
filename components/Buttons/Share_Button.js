import React from 'react';
import { Share, View, Button, Pressable, StyleSheet, Text } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import colors from '../../assets/colors/colors';
import * as Linking from 'expo-linking';
import global from '../../styles/global';
import typography from '../../styles/typography';

function Share_Button (props) {

    const type = props.type;
    const id = props.id
    const url = `https://www.advently.co.uk/${type}/${id}`;

    const onShare = async () => {
        try {
        const result = await Share.share({
            title: 'Advently',
            message: `Check out this ${type} - ${url}`,
            url: url
        });
        } catch (error) {
        //   alert(error.message);
        }
    };


    return props.box ? (
            <Pressable onPress={onShare} style={({pressed}) => [{backgroundColor: pressed ? colors.background_light : colors.white}, styles.box]}>
                <Text style={[typography.main, global.text_light_medium, global.bottom(3)]}>Share</Text>
                <Text style={[typography.small, global.text_light]}>Share this Event</Text>          
            </Pressable>
    ) : (
        <Pressable style={styles.share} onPress={onShare}>
            <Entypo name="share" size={24} color={colors.text_light} />
        </Pressable>
    );
};

export default Share_Button;


const styles = StyleSheet.create({
    box: {
        borderTopWidth: 0.5, 
        borderTopColor: colors.text_light, 
        alignItems: 'center', 
        paddingTop: 30, 
        paddingBottom: 30,
        marginTop: 30,
        borderRadius: 20
    }
});

