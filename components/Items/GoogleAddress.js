import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import Constants from 'expo-constants';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GOOGLE_PLACES_API_KEY = 'AIzaSyD3p-zqgG7xGncibuSWoxBkHCPea1RyuKk'; // never save your real api key in a snack!

// navigator.geolocation = require('@react-native-community/geolocation');
// navigator.geolocation = require('react-native-geolocation-service');


function GoogleAddress(props) {

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder={props.location ? props.location : "Search"}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: 'en', // language of the results
        }}
        onPress={(data, details) => {props.set_location(data.description); props.geo({latitude: details.geometry.location.lat, longitude: details.geometry.location.lng});}}
        onFail={(error) => console.error(error)}
        requestUrl={{
          url: 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
          useOnPlatform: 'web',
        }} // this in only required for use on the web. See https://git.io/JflFv more for details.
       fetchDetails={true}
       enablePoweredByContainer={false}
       keepResultsAfterBlur={true}
       styles={{
           textInput: {
            backgroundColor: '#eee',
            padding: 15,
            borderRadius: 5,
            width: '100%',
            color: "#707070",
            alignSelf: 'stretch',  
            height: 60
           }, 
           poweredContainer: {
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5,
            borderColor: '#c8c7cc',
            borderTopWidth: 0.5,
            backgroundColor: 'red'
          },

       }}
      />
    </View>
  );
};


export default GoogleAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 5,
    // paddingTop: Constants.statusBarHeight + 10,
    // backgroundColor: '#ecf0f1',
  },
  main: {
  }
});

