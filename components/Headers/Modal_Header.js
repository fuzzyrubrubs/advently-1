import React from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import typography from '../../styles/typography';
import colors from '../../assets/colors/colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import global from '../../styles/global';
import Icon_Wrapper from '../Displays/Icon_Wrapper';



function Alt_Header(props){  
    const navigation = useNavigation(); 

    const back_handler = () => {
        if(props.back_handler) return props.back_handler();
        return navigation.goBack();
    }
    

    return (      
        <View style={styles.wrapper}>
            <Icon_Wrapper style={styles.icon} action={() => back_handler()}><FontAwesome5 name="chevron-left" size={24} color={colors.text_light_medium} /></Icon_Wrapper>
            <Text style={[typography.main_bold, styles.title]}>
                {props.children}
            </Text>
            {props.action ? (
            <Pressable style={({pressed}) => [{opacity: pressed ? 0.5 : 1,}, global.link_button]} onPress={props.action}>
                <Text style={[typography.small]}>
                    {props.action_text}
                </Text>
            </Pressable>
            ) : <Text style={styles.icon}></Text> }
        </View>
    )
}


export default Alt_Header;

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 5,
        paddingTop: 10,
        paddingBottom: 5,
    },
    icon: {
        width: 50
    },
    title: {
        color: colors.text_medium,
        flex: 1,
        textAlign: 'center'
    }
})



