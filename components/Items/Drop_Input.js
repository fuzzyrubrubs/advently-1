import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import colors from '../../assets/colors/colors';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import typography from '../../styles/typography';
import CustomModal from './CustomModal';

function Drop_Input(props) {
    const label = props.children;
    const list = props.options;
    const active = props.active;
    const [selected, set_selected] = useState(active ? 0 : false);
    const [show, set_show] = useState(false);


    const action_handler = (index) => {
        set_selected(index);
        set_show(false);
        if(props.action) { props.action(index) };
    };

    const content = (
        <View style={styles.drop}>
            {selected !== false && label ? <Text style={[typography.main_bold, styles.label]}>{label}:</Text> : null}
            <Text style={[typography.main_bold, styles.option]}>{selected !== false ? list[selected] : label}</Text>
            <Entypo name="chevron-down" size={24} color={colors.text_light_medium} />
        </View>
    )

    return ( 
        <CustomModal content={content} show={show} set_show={set_show}>
             <View style={[styles.options, global.shadow]}>
                {list.map((item, index) => <Pressable key={item} style={({pressed}) => [{backgroundColor: pressed ? colors.text_light : "transparent"}, styles.press]} onPress={() => action_handler(index)}><Text style={[typography.main_bold, styles.item]}>{item}</Text></Pressable>)}
            </View>
        </CustomModal>
    )
}

export default Drop_Input;



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
    press: {
        width: 240,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center'
    },  
    item: {
        textTransform: 'capitalize',
        color: colors.text_light_medium,
    }, 
    options: {
        alignItems: 'center',
    },
})