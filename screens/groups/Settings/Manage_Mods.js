
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable, Image, FlatList, RefreshControl } from 'react-native';
import containers from '../../../styles/containers';
import global from '../../../styles/global';
import Alt_Header from '../../../components/Headers/Alt_Header';
import { useFocusEffect } from '@react-navigation/core';
import typography from '../../../styles/typography';
import colors from '../../../assets/colors/colors';
import { switch_mod_status, get_user_data } from '../../../firebase/methods/User_Functions';
import { make_group_mod, remove_group_mod } from '../../../firebase/methods/Group_Functions';


function Manage_Mods(props){   
    const group_data = props.data;
    const [members_data, set_members_data] = useState([]);
    const [mods_data, set_mods_data] = useState([]);
    const [creator, set_creator] = useState({});
    const [refreshing, set_refreshing] = React.useState(false);
    

    useFocusEffect(
        React.useCallback(() => {
            const fetch_data = async () => {
                const users_data = await Promise.all(group_data.members.filter(item => item !== group_data.admin).map(async (member) => {
                    return await get_user_data(member);
                }))
                set_mods_data(users_data.filter(item => group_data.mods.includes(item.id)))
                set_members_data(users_data.filter(item => !group_data.mods.includes(item.id)));
            }
            fetch_data();
        }, [group_data])
      );


    const make_mod_handler = (item) => {
        make_group_mod(item.id, group_data)
    }

    const remove_mod_handler = (item) => {
        remove_group_mod(item.id, group_data)
    }

    return (      
        <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[typography.small, global.information]}>Tap on a user to change their role</Text>
                <Text style={typography.header_2}>{mods_data.length > 0 ? "Mods" : null}</Text>
                <View>
                    <FlatList
                        key={"mods"} 
                        data={mods_data}
                        extraData={mods_data}
                        renderItem={({ item }) => (
                            <Pressable onPress={() => remove_mod_handler(item)} style={({pressed}) => [{opacity: pressed ? 0.5 : 1,}, styles.person]}>
                                <Image style={styles.icon} source={{uri: item.image}} />
                                <Text style={[typography.main, styles.name]}>{item.name}</Text>
                            </Pressable>
                        ) }
                        keyExtractor={item => item.toString()} 
                        numColumns="4"
                        showsVerticalScrollIndicator={false}
                        columnWrapperStyle={{justifyContent: 'flex-start'}}
                    />
                </View>
                <Text style={typography.header_2}>{members_data.length > 0 ? "Members" : null}</Text>
                <View>
                    <FlatList
                        key={"members"} 
                        data={members_data}
                        extraData={members_data}
                        renderItem={({ item }) => (
                            <Pressable onPress={() => make_mod_handler(item)} style={({pressed}) => [{opacity: pressed ? 0.5 : 1,}, styles.person]}>
                                <Image style={styles.icon} source={{uri: item.image}} />
                                <Text style={[typography.main, styles.name]}>{item.name ? item.name.split(" ")[0] : ""}</Text>
                            </Pressable>
                        ) }
                        keyExtractor={item => item.toString()} 
                        numColumns="4"
                        showsVerticalScrollIndicator={false}
                        columnWrapperStyle={{justifyContent: 'flex-start'}}
                    />
                </View>
        </ScrollView>
    )
}

export default Manage_Mods;



const styles = StyleSheet.create({
    person: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 5,
        marginTop: 5,
        width: "25%",
        height: 120,
        textAlign: 'center',
    },
    icon: {
        height: 75,
        width: 75,
        borderRadius: 80,
        marginBottom: 5,
    },
    name: {
        textAlign: 'center',
        width: 75,
    }
})
