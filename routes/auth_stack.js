import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Landing from '../screens/auth/Landing';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import Reset_Password from '../screens/auth/Reset_Password';

import { View, Platform, SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const AuthStack = createStackNavigator();

export default () => {
    return (
    <>
    <StatusBar translucent backgroundColor={"transparent"} style="light"  />
    <AuthStack.Navigator>
        <AuthStack.Screen name="Landing" component={Landing} options={{headerShown: false}} />
        <AuthStack.Screen name="Login" component={Login} options={{headerShown: false}} />
        <AuthStack.Screen name="Register" component={Register} options={{headerShown: false}} />
        <AuthStack.Screen name="Reset_Password" component={Reset_Password} options={{headerShown: false}} />
    </AuthStack.Navigator>
    </>
    )
}
















// import { createStackNavigator } from 'react-navigation-stack';
// import { createAppContainer } from 'react-navigation';

// import Landing from '../screens/auth/Landing';
// import Login from '../screens/auth/Login';

// const screens = {
//     Landing: { screen: Landing },
//     Login: { screen: Login }
// }

// const auth_stack = createStackNavigator(screens)

// export default createAppContainer(auth_stack)