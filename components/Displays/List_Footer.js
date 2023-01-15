import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import colors from '../../assets/colors/colors';
import typography from '../../styles/typography';

function List_Footer(props){
    return (
        <View style={styles.container}>
            <Text style={[typography.main, styles.text]}>You've reached the end of the list</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
       width: "100%",
       alignSelf: "stretch",
       marginTop: 30,
       marginBottom: 30,
       alignItems: 'center'
    },
    text: {
        color: colors.text_light,
        width: 200,
        textAlign: 'center'
    }

    
})

export default List_Footer;