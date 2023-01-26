import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';
import React, { useState, useContext, useEffect } from 'react';
import Main_navigator from './routes/main_stack';
import Auth_navigator from './routes/auth_stack';
import { AuthContext } from './contexts/Auth.context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { ProfileDataContext } from './contexts/ProfileData.context';
import { LocationContext } from './contexts/Location.context';
import { update_my_profile } from './firebase/methods/User_Functions';
import { View } from 'react-native';

import { registerForPushNotificationsAsync } from './tools/Notification_Methods';
import Loader_Page from './components/Displays/Loader_Page';


export default function App(props) {
  const { user } = useContext(AuthContext);
  const { user_profile } = useContext(ProfileDataContext);
  const { address, location } = useContext(LocationContext);
  const [location_updated, set_location_updated] = useState(false);

  useEffect(() => {
      registerForPushNotificationsAsync().then(token => update_my_profile(user, {device_id: token}));
  }, [user]);


  if (!location_updated && user && address) {
    update_my_profile( user, {location: address.subregion});
    set_location_updated(true);
  }

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'rgb(255, 45, 85)',
      background: '#fff'
    },
  };

  if(user === false) return;

  return (
      <NavigationContainer theme={MyTheme} onReady={props.onReady}>
          {user ? <Main_navigator /> : <Auth_navigator />} 
      </NavigationContainer>
  )
};