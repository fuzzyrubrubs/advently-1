import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MyProfile from '../screens/profile/MyProfile';
import Friends from '../screens/profile/Friends';
import Saved from '../screens/profile/Saved';
import Chats from '../screens/profile/Chats';
import Chat from '../screens/singles/Chat';

import UserProfile from '../screens/singles/UserProfile';

import Group from '../screens/singles/Group';


import Event from '../screens/singles/Event';
import Requests from '../screens/activity/Requests';


const AuthStack = createStackNavigator();

export default () => {
    return (
    <AuthStack.Navigator>
        <AuthStack.Screen name="Profile" component={MyProfile} options={{headerShown: false}} />
        <AuthStack.Screen name="Saved" component={Saved} options={{headerShown: false}} />
        <AuthStack.Screen name="Requests" component={Requests} options={{headerShown: false}} />
        <AuthStack.Screen name="Friends" component={Friends} options={{headerShown: false}} />
        <AuthStack.Screen name="UserProfile" component={UserProfile} options={{headerShown: false}} />
        <AuthStack.Screen name="Chats" component={Chats} options={{headerShown: false}} />
        <AuthStack.Screen name="Chat" component={Chat} options={{headerShown: false}} />

        <AuthStack.Screen name="Group" component={Group} options={{headerShown: false}} />

        <AuthStack.Screen name="Event" component={Event} options={{headerShown: false}} />

    </AuthStack.Navigator>
    )
}
