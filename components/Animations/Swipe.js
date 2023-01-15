import React from 'react';
import { StyleSheet, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Ionicons } from '@expo/vector-icons';

function Swipe(props){


    const _checkmark = <Ionicons name="checkmark-circle-outline" size={34} color="green" />;
    const _close = <Ionicons name="close-circle-outline" size={34} color="red" />;


    const Left_Handler = () => props.left_action ? props.left_action() : null;
    const Right_Handler = () => props.right_action ? props.right_action() : null;
    
    const LeftAction = () => props.left_action ? <View style={styles._accept}><View style={styles.swipe}>{_checkmark}</View></View> : null
    const RightAction = () => props.right_action ? <View style={styles._decline}><View style={styles.swipe}>{_close}</View></View> : null

    return (
        <Swipeable renderLeftActions={LeftAction} renderRightActions={RightAction} onSwipeableLeftOpen={Left_Handler} onSwipeableRightOpen={Right_Handler}>
            {props.children}
        </Swipeable>
    )
}
export default Swipe;

const styles = StyleSheet.create({
    _accept: {
        width: "100%",
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    _decline: {
        width: "100%",
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    swipe: {
        marginBottom: 5,
        borderRadius: 15,
        justifyContent: "center",
        marginLeft: 10,
        marginRight: 10,
    }
})
