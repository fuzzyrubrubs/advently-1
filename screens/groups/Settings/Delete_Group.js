import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput, ImageBackground, Pressable, Image, FlatList, Dimensions } from 'react-native';
import containers from '../../../styles/containers';
import global from '../../../styles/global';
import Alt_Header from '../../../components/Headers/Alt_Header';
import Button_Main from '../../../components/Buttons/Button_Main';
import { delete_group, delete_logo } from '../../../firebase/methods/Delete_Functions';
import typography from '../../../styles/typography';
import { useNavigation } from '@react-navigation/native';


function Delete_Group(props){   
    const group_data = props.data;
    const [error, set_error] = useState("");
    const [loader, set_loader] = useState(false);
    const navigation = useNavigation()

    const delete_handler = async () => {
        set_loader(true);
        try {
            await delete_group(group_data.id);
            navigation.replace("Groups");       
        } catch(error) {
            set_error(error.message);
            set_loader(false);
        }
    }


    return (      
        
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={typography.main}>Permanently delete my group</Text>
                <View style={styles.input__wrapper}>
                    <Button_Main hollow={true} loader={loader} action={() => delete_handler()}>Delete</Button_Main>
                </View>
                <Text>{error}</Text>
            </ScrollView>
    )
}

export default Delete_Group;



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        justifyContent: 'space-evenly'
    },
    
});
