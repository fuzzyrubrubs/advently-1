import React from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import colors from '../../assets/colors/colors';
import global from '../../styles/global';
import typography from '../../styles/typography';

function Selection_Box(props){
    return (
        <Pressable onPress={props.action} style={({pressed}) => [{ opacity: pressed ? 0.5 : 1 }, props.outline ? styles.container_outline : styles.container, props.outline ? null : global.shadow ]}>
            <Text style={[typography.header_4, props.outline ? styles.text_outline : styles.text]}>{props.children}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary_light,
        width: "100%",
        minWidth: "100%",
        height: 70,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        alignSelf: 'stretch',
    },
    text: {
        color: colors.white
    },

    container_outline: {
        backgroundColor: colors.white,
        width: "100%",
        height: 70,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: colors.primary,
        marginTop: 50
    },
    text_outline: {
        color: colors.primary
    },
})

export default Selection_Box;