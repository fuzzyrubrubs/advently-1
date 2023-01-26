import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Search from '../screens/search/Search';
import ExploreEvents from '../screens/search/OpenEvents';
import ExploreGroups from '../screens/search/Groups';

import UserProfile from '../screens/singles/UserProfile';
import Edit_Profile from '../screens/profile/Edit_Profile';
import Change_Password from '../screens/profile/Settings/Change_Password';
import Delete_Account from '../screens/profile/Settings/Delete_Account';

import Group from '../screens/singles/Group';
import Edit_Group from '../screens/groups/Edit_Group';
import Group_Settings from '../screens/groups/Group_Settings';
import Manage_Mods from '../screens/groups/Settings/Manage_Mods';
import Delete_Group from '../screens/groups/Settings/Delete_Group';


import Event from '../screens/singles/Event';
import Edit_Event from '../screens/events/Edit_Event';
import Chat from '../screens/singles/Chat';


const AuthStack = createStackNavigator();

export default () => {
    return (
    <AuthStack.Navigator>
        <AuthStack.Screen name="Search" component={Search} options={{headerShown: false}} />
        <AuthStack.Screen name="ExploreEvents" component={ExploreEvents} options={{headerShown: false}} />
        <AuthStack.Screen name="ExploreGroups" component={ExploreGroups} options={{headerShown: false}} />
        
        <AuthStack.Screen name="Group" component={Group} options={{headerShown: false}} />

        <AuthStack.Screen name="Event" component={Event} options={{headerShown: false}} />

        <AuthStack.Screen name="UserProfile" component={UserProfile} options={{headerShown: false}} />
        <AuthStack.Screen name="Chat" component={Chat} options={{headerShown: false}} />
    </AuthStack.Navigator>
    )
}
