import React, { useContext, useState } from 'react';
import { Text, View, StyleSheet, BackHandler, TextInput } from 'react-native';
import typography from '../../styles/typography';
import global from '../../styles/global';
import { LocationContext } from '../../contexts/Location.context';
import Button_Main from '../../components/Buttons/Button_Main';
import containers from '../../styles/containers';
import { useFocusEffect } from '@react-navigation/core';
import Selection_Box from '../../components/Items/Selection_Box';
import Text_Input from '../../components/Items/Text_Input';


function Search({ navigation }){ 
    const { location, address, get_permissions, get_location, get_location_handler } = useContext(LocationContext);
    const [error, set_error] = useState("")
    const [loader, set_loader] = useState(false)

    const handleBackButtonClick = () => { navigation.navigate("Events", { screen: 'Events' }); return true; }

    useFocusEffect(
        React.useCallback(() => {
            BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
            };
        }, [])
    );


    const location_handler = async () => {
        set_loader(true);
        const status = await get_location_handler();
        if(status !== true) { set_error(status)}
        set_loader(false)

    }

    return ( 
        <> 
        { location ? (
            <View style={styles.container}>
                <Text style={typography.header_1}>Discover</Text>
                <View>
                    <Selection_Box action={() => navigation.navigate("ExploreEvents")}>Events</Selection_Box>
                    <Selection_Box action={() => navigation.navigate("ExploreGroups")}>Communities</Selection_Box>
                </View>
                <Text style={[typography.header_2, {width: "80%", textAlign: 'center'}]}>{address ? address.subregion : null}</Text>
            </View>
            ) : (
            <View style={[styles.container, containers.main]}>
                <Text style={[typography.main, { textAlign: 'center' }]}>
                    Advently needs your location to find your local events and communities
                </Text>
                <Text style={[global.status_text, { textAlign: 'center' }]}>{error}</Text>
                <Button_Main loader={loader} action={() => location_handler()}>Enable location</Button_Main>
            </View>
            )}
        </>
    )
}

export default Search;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginHorizontal: 20
    },
})

