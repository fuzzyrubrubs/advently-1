
import * as Location from 'expo-location';

async function geo_to_address(lat, long){
    const url = "https://api.postcodes.io/postcodes?lon=" + long + "&lat=" + lat + "&limit=1";
    const data = await fetch(url).then(response => response.json())
    .then(json => {
        return {
            place: json.result[0].admin_ward,
            district: json.result[0].admin_district,
            region: json.result[0].region
        }
    })
    .catch(error => false)
    return data;
}


const postcode_to_address = async (postcode) => {
    const url = "https://api.postcodes.io/postcodes/" + postcode;
    const data = await fetch(url).then(response => response.json())
    .then(json => {
        return {
            district: json.result.admin_district, 
            region: json.result.region,
            latitude: json.result.latitude, 
            longitude: json.result.longitude
        }
    })
    .catch(error => false)
    return data;
}

const zipcode_to_address = async (postcode, countrycode) => {
    const url = "https://app.zipcodebase.com/api/v1/search?apikey=686fa190-c652-11eb-ad59-935310a8cfbd&codes=" + postcode + "&country=" + countrycode;
    const info = await fetch(url).then(response => response.json())
    .then(json => {
        const data = json.results[postcode][0];
        return {
            district: data.city, 
            region: data.state,
            latitude: Number(data.latitude), 
            longitude: Number(data.longitude)
        }
    })
    .catch(error => {
        return false
    })
    return info;
}


const get_geo = async (input_address) => {
    let found_address = await Location.geocodeAsync(input_address);

    return found_address.length === 0 ? false : {latitude: Number(found_address[0].latitude), longitude: Number(found_address[0].longitude)};
}

export { get_geo, postcode_to_address, zipcode_to_address }