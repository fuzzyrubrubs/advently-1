import React from 'react';
import { Text, View, Pressable, TextInput, StyleSheet } from 'react-native';
import typography from '../../styles/typography';
import colors from '../../assets/colors/colors';
import { useNavigation } from '@react-navigation/native';
import global from '../../styles/global';
import { pressed_opacity } from '../../tools/Global_Variables';
import { Ionicons } from '@expo/vector-icons';



function Main_Header(props){  
    const navigation = useNavigation(); 

    return (      
        <View style={styles.container}>
            <View style={styles.wrapper}> 
                <Text style={[typography.header_1]}>{props.children}</Text>
                <Pressable style={({pressed}) => [{backgroundColor: pressed ? colors.text_light : colors.white}, global.link_button]} onPress={() => navigation.navigate(props.link)}>
                    <Text style={[typography.main, global.text_medium]}>Create</Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.text_medium} />
                </Pressable>
            </View>
            <TextInput style={global.input_light} placeholder="What are you looking for?" onChangeText={props.action} />
        </View>
    )
}

export default Main_Header;


const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingHorizontal: 25,
        paddingBottom: 20,
    },
    wrapper: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },

})



