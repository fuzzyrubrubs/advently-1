import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import colors from '../../assets/colors/colors';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import typography from '../../styles/typography';
import CustomModal from './CustomModal';
import Slider from '@react-native-community/slider';

function Radius_Input(props) {
    const label = props.children;
    const active = props.active;
    const [show, set_show] = useState(false);



    const content = (
        <View style={styles.drop}>
            {label ? <Text style={[typography.main_bold, styles.label]}>{label}:</Text> : null}
            <Text style={[typography.main_bold, styles.option]}>{props.distance} miles</Text>
        </View>
    )

    return ( 
        <CustomModal content={content} show={show} set_show={set_show}>
             <View style={[styles.options, global.shadow]}>
             <Slider 
                style={styles.slider} 
                minimumValue={1} 
                maximumValue={50} 
                minimumTrackTintColor={colors.primary_light} 
                maximumTrackTintColor={colors.primary_light} 
                thumbTintColor={colors.primary} 
                value={props.distance} 
                onSlidingComplete={value => props.action(value.toFixed(0))} />
            </View>
        </CustomModal>
    )
}

export default Radius_Input;



const styles = StyleSheet.create({
    drop: {
        flexDirection: 'row',
        backgroundColor: colors.background_light,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        paddingHorizontal: 20,
        position: 'relative',
        zIndex: 10,
    },
    label: {
        color: colors.text_light_medium,
    },
    option: {
        textTransform: 'capitalize',
        marginHorizontal: 10,
    },
    icon: {
        alignItems: 'flex-end',
        justifyContent: 'center'
    },

    
    options: {
        alignItems: 'center',
    },
    slider: { 
        height: 40,
        color: colors.primary,  
        width: "100%",
        alignSelf: 'center'
    },  
})