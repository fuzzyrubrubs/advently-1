import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Events from '../routes/events_stack';
import Groups from '../routes/groups_stack';
import Search from '../routes/search_stack';
import Activity from '../routes/activity_stack';
import MyProfile from '../routes/profile_stack';

import { View, Platform, SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Custom_Tab_Bar from '../components/Displays/Custom_Tab_Bar';
import { ProfileDataContext } from '../contexts/ProfileData.context';
import Loader_Page from '../components/Displays/Loader_Page';

// SafeAreaView><StatusBar translucent={false} backgroundColor={"transparent"} style={"dark"} barStyle="dark-content"  /></SafeAreaView>
const Tabs = createBottomTabNavigator();

export default () => {
    const { upcoming } = useContext(ProfileDataContext);
    if(!upcoming) { return <Loader_Page /> }
    return (
    <>
    <SafeAreaView><StatusBar translucent={false} backgroundColor={"#fff"} barStyle="light-content"  /></SafeAreaView>
    <Tabs.Navigator tabBar={props => <Custom_Tab_Bar {...props} />}>
        <Tabs.Screen name="Events" options={{ unmountOnBlur: true, headerShown: false }} component={Events} />
        <Tabs.Screen name="Groups" options={{ unmountOnBlur: true, headerShown: false }} component={Groups} />
        <Tabs.Screen name="Search" options={{ unmountOnBlur: true, headerShown: false }} component={Search} />
        <Tabs.Screen name="Activity" options={{ unmountOnBlur: true, headerShown: false }} component={Activity} />
        <Tabs.Screen name="MyProfile" options={{ unmountOnBlur: true, headerShown: false }} component={MyProfile} />
    </Tabs.Navigator>
    </>

    )
}

