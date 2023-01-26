import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Events from '../screens/events/Events';
import Create_Event from '../screens/events/Create_Event';

import UserProfile from '../screens/singles/UserProfile';

import Group from '../screens/singles/Group';


import Event from '../screens/singles/Event';
import Chat from '../screens/singles/Chat';

const AuthStack = createStackNavigator();

export default ({ navigation }) => {
    return (
    <AuthStack.Navigator>
        <AuthStack.Screen name="Events" component={Events} options={{headerShown: false}} />
        <AuthStack.Screen name="Create_Event" component={Create_Event} options={{headerShown: false}} />
        <AuthStack.Screen name="Event" component={Event} options={{headerShown: false}} />

        <AuthStack.Screen name="Group" component={Group} options={{headerShown: false}} />

        <AuthStack.Screen name="UserProfile" component={UserProfile} options={{headerShown: false}} />
        <AuthStack.Screen name="Chat" component={Chat} options={{headerShown: false}} />
    </AuthStack.Navigator>
    )
}
