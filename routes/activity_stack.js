import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Activity from '../screens/activity/Activity';
import Requests from '../screens/activity/Requests';

import UserProfile from '../screens/singles/UserProfile';
import Edit_Profile from '../screens/profile/Edit_Profile';

import Group from '../screens/singles/Group';

import Event from '../screens/singles/Event';
import Chat from '../screens/singles/Chat';


const AuthStack = createStackNavigator();

export default () => {
    return (
    <AuthStack.Navigator>
        <AuthStack.Screen name="Activity" component={Activity} options={{headerShown: false}} />
        <AuthStack.Screen name="Requests" component={Requests} options={{headerShown: false}} />
        
        <AuthStack.Screen name="Group" component={Group} options={{headerShown: false}} />
        <AuthStack.Screen name="Event" component={Event} options={{headerShown: false}} />

        <AuthStack.Screen name="UserProfile" component={UserProfile} options={{headerShown: false}} />
        <AuthStack.Screen name="Chat" component={Chat} options={{headerShown: false}} />
        <AuthStack.Screen name="Edit_Profile" component={Edit_Profile} options={{headerShown: false}} />
    </AuthStack.Navigator>
    )
}
