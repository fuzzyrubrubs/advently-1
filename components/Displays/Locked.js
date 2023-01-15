import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import colors from '../../assets/colors/colors';
import typography from '../../styles/typography';
import { FontAwesome5 } from '@expo/vector-icons';

function Locked(props){
    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <FontAwesome5 name="lock" size={50} color={colors.text_medium} />
            </View>
            <Text style={[typography.header_4, styles.text]}>Private</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20
    },
    wrapper: {
        backgroundColor: colors.background_light,
        height: 100,
        width: 100,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        marginTop: 15,
        color: colors.text_dark
    }
})

export default Locked;