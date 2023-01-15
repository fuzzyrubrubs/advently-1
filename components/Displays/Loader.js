import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import colors from '../../assets/colors/colors';

function Loader(){ 
    return (      
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 200,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Loader;
