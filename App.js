import React, { useState, useEffect, useCallback } from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import Root from './Root';
import * as SplashScreen from 'expo-splash-screen';

import { AuthProvider } from './contexts/Auth.context';
import { ProfileDataProvider } from './contexts/ProfileData.context';
import { LocationProvider } from './contexts/Location.context';
import { LogBox, View } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);



export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          "Ubuntu-Regular": require("./assets/fonts/Ubuntu-Regular.ttf"),
          "Ubuntu-Medium": require("./assets/fonts/Ubuntu-Medium.ttf"),
          "Ubuntu-Bold": require("./assets/fonts/Ubuntu-Bold.ttf"),
          "Ubuntu-Light": require("./assets/fonts/Ubuntu-Light.ttf"),
        })
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) { await SplashScreen.hideAsync(); }
  }, [appIsReady]);

  if (!appIsReady) { return null; }
  
  return (
    <AuthProvider>
        <LocationProvider>
          <ProfileDataProvider>
              <Root onReady={onLayoutRootView} />
          </ProfileDataProvider>
        </LocationProvider>
    </AuthProvider>
  )
}

