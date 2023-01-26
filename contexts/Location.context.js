import React, { createContext, useState, useEffect } from "react";
import * as Location from 'expo-location';

export const LocationContext = createContext();

export function LocationProvider(props) {
    const [location, set_location] = useState(null);
    const [address, set_address] = useState(null);

    useEffect(() => {
        check_location();
    }, [])

    const get_location_handler = async () => {
        const permission_status = await check_permissions_enabled();
        if(!permission_status) {
            const get_permission_status = await get_permissions();
            return get_permission_status
        }

        const service_status = await check_services_enabled();
        if(!service_status) {
            const get_service = await get_location();
            return get_service
        }

        const location_status = await get_location();
        return location_status;
    }

    const check_services_enabled = async () => {
        const provider = await Location.getProviderStatusAsync();
        return provider.locationServicesEnabled
    };

    const check_permissions_enabled = async () => {
        let { status } = await Location.getForegroundPermissionsAsync();
        return status === 'granted' ? true : false;
    };

    const check_location = async () => {
        const permission = await check_permissions_enabled();
        const service = await check_services_enabled();
        if (permission && service) { get_location();}
        return permission && service ? true : false;
    }

    const get_permissions = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') { return "Permission not granted"; }    
        return get_location();
    }

    // const get_location = async () => {
    //     const high = await get_location_high(); 
    //     if(high === false) { get_location_low (); }

    // }

    const get_location = async () => {
        try {
            //{accuracy:Location.Accuracy.Highest}
            let location = await Location.getCurrentPositionAsync({accuracy: 1});
            let address = await Location.reverseGeocodeAsync({latitude: location.coords.latitude, longitude: location.coords.longitude})
            set_location(location.coords);
            set_address(address[0])
            return true;
        } catch(error) {
            return error.message;
        }
    };

    const get_location_low = async () => {
        try {
            let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Lowest});
            let address = await Location.reverseGeocodeAsync({latitude: location.coords.latitude, longitude: location.coords.longitude})
            set_location(location.coords);
            set_address(address[0])
            return true;
        } catch(error) {
            return false;
        }
    };


    const get_miles = (i) => (i*0.000621371192);

    const calculate_distance = (lat1, lon1, lat2 = location.latitude, lon2 = location.longitude) => {
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 + 
                c(lat1 * p) * c(lat2 * p) * 
                (1 - c((lon2 - lon1) * p))/2;
        var kms = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
        return get_miles(kms * 1000).toFixed(1)
    }

    return (
    <LocationContext.Provider value={{ location, address, get_permissions, get_location, calculate_distance, check_location, get_location_handler  }}>
        {props.children}
    </LocationContext.Provider>
    );

}


