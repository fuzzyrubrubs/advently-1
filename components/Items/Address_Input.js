import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput, ImageBackground, Pressable, FlatList } from 'react-native';
import typography from '../../styles/typography';
import global from '../../styles/global';
import colors from '../../assets/colors/colors';
import Button_Main from '../../components/Buttons/Button_Main';
import { AuthContext } from '../../contexts/Auth.context';
import { LocationContext } from '../../contexts/Location.context';
import { get_geo, postcode_to_address, zipcode_to_address } from '../../tools/Location_Methods';

function Address(props){ 
    const [stage, set_stage] = useState(0);
    const [status, set_status] = useState("");
    const [loader, set_loader] = useState(false);
    const { address } = useContext(LocationContext);


    const [show_address_inputs, set_show_address_inputs] = useState(false);
    const [autofill_address, set_autofill_address] = useState(false);

    const [geo_input, set_geo_input] = useState(null);
    const [address_input, set_address_input] = useState({street: "", district: "", region: "", postcode: "", country: ""});
   
    const [manual_address, set_manual_address] = useState(false);
    const [manual_address_button, set_manual_address_button] = useState(false);

    const [next, set_next] = useState(false);

    
 

    //////////////////////////// INPUT HANDLERS ///////////////////////////////////////////////////

    
    const postcode_input_handler = async () => {
        set_manual_address(false);
        const data = await postcode_to_address(address_input.postcode)
        if(data){
            set_status("");
            set_autofill_address(true);
            set_address_input({...address_input, district: data.district, region: data.region});
            set_geo_input({latitude: data.latitude, longitude: data.longitude});
            set_show_address_inputs(true);
        } else {
            set_show_address_inputs(false);
            set_status("Address not found");
            set_manual_address_button(true);
        };
    };

    const zipcode_input_handler = async () => {
        set_manual_address(false);
        const data = await zipcode_to_address(address_input.postcode, address.isoCountryCode)
        if(data){
            set_status("");
            set_autofill_address(true);
            set_address_input({...address_input, district: data.district, region: data.region});
            set_geo_input({latitude: data.latitude, longitude: data.longitude});
            set_show_address_inputs(true);
        } else {
            set_show_address_inputs(false);
            set_status("Address not found");
            set_manual_address_button(true);
        };
    };


    const find_address = async () => {
        const t = await get_geo(`${address_input.street}, ${address_input.district}, ${address_input.region}, ${address_input.postcode}, ${address_input.country}`);
        set_geo_input(t);
        set_next(true);
    };

    const next_handler = () => {
        if(geo_input) {
            props.address(address_input);
            props.geo(geo_input);
        } else {
            alert("Couldn't find address")
        }
    };


    const next_active_handler = () => {
         return address_input.postcode.length >= 5 && address_input.street.length >= 1 && address_input.district.length >=1 && address_input.region.length >= 1;
    }



    const uk = (
        <View style={styles.form}>
            <View style={styles.input_wrapper}>
                <Text style={global.input_light_label}>Postcode</Text>
                <TextInput style={global.input_light} placeholder="" value={address_input.postcode} onChangeText={(e) => set_address_input({...address_input, "postcode": e})} />
            </View>
            <Button_Main action={() => postcode_input_handler()}>Find</Button_Main>
            <View style={{opacity: show_address_inputs ? 1 : 0}}>
                <View style={styles.input_wrapper}>
                    <Text style={global.input_light_label}>Street 1</Text>
                    <TextInput style={global.input_light} value={address_input.street} placeholder="" onChangeText={(e) => set_address_input({...address_input, "street": e})} />
                </View>
                <View style={styles.input_wrapper}>
                    <Text style={global.input_light_label}>District</Text>
                    <TextInput style={global.input_light} editable={autofill_address ? false : true} selectTextOnFocus={autofill_address ? false : true} value={address_input.district} placeholder="" onChangeText={(e) => set_address_input({...address_input, "district": e})}   />
                </View>
                <View style={styles.input_wrapper}>
                    <Text style={global.input_light_label}>Region</Text>
                    <TextInput style={global.input_light} editable={autofill_address ? false : true} selectTextOnFocus={autofill_address ? false : true} value={address_input.region} placeholder="" onChangeText={(e) => set_address_input({...address_input, "region": e})}  />
                </View>
                <View style={styles.input_wrapper}>
                    <Text style={global.input_light_label}>Country</Text>
                    <TextInput style={global.input_light} editable={autofill_address ? false : true} selectTextOnFocus={autofill_address ? false : true} value={address_input.country} placeholder="" onChangeText={(e) => set_address_input({...address_input, "country": e})}  />
                </View>
                <View style={styles.input_wrapper}>
                    <Text style={global.input_light_label}>Country</Text>
                    <TextInput style={global.input_light} editable={autofill_address ? false : true} selectTextOnFocus={autofill_address ? false : true} value={address_input.country} placeholder="" onChangeText={(e) => set_address_input({...address_input, "country": e})}  />
                </View>
                <View style={styles.input_wrapper}>
                    <Text style={global.input_light_label}>Country</Text>
                    <TextInput style={global.input_light} editable={autofill_address ? false : true} selectTextOnFocus={autofill_address ? false : true} value={address_input.country} placeholder="" onChangeText={(e) => set_address_input({...address_input, "country": e})}  />
                </View>
                <Button_Main active={next_active_handler()} action={next_handler}>Next</Button_Main>
            </View>
            {manual_address_button ? <Button_Main onClick={() => set_manual_address(true)}>Enter Manually</Button_Main> : null}
        </View>
    );

    const international = (
        <View style={styles.form}>
            <View style={styles.input_wrapper}>
                <Text style={global.input_light_label}>Zipcode</Text>
                <TextInput style={global.input_light} placeholder="" value={address_input.postcode} onChangeText={(e) => set_address_input({...address_input, "postcode": e})} />
            </View>
            <Button_Main action={() => zipcode_input_handler()}>Find</Button_Main>
            <View style={{opacity: show_address_inputs ? 1 : 0}}>
                <View style={styles.input_wrapper}>
                    <Text style={global.input_light_label}>Street 1</Text>
                    <TextInput style={global.input_light} value={address_input.street} placeholder="" onChangeText={(e) => set_address_input({...address_input, "street": e})} />
                </View>
                <View style={styles.input_wrapper}>
                    <Text style={global.input_light_label}>District</Text>
                    <TextInput style={global.input_light} editable={autofill_address ? false : true} selectTextOnFocus={autofill_address ? false : true} value={address_input.district} placeholder="" onChangeText={(e) => set_address_input({...address_input, "district": e})}   />
                </View>
                <View style={styles.input_wrapper}>
                    <Text style={global.input_light_label}>Region</Text>
                    <TextInput style={global.input_light} editable={autofill_address ? false : true} selectTextOnFocus={autofill_address ? false : true} value={address_input.region} placeholder="" onChangeText={(e) => set_address_input({...address_input, "region": e})}  />
                </View>
                <View style={styles.input_wrapper}>
                    <Text style={global.input_light_label}>Country</Text>
                    <TextInput style={global.input_light} editable={autofill_address ? false : true} selectTextOnFocus={autofill_address ? false : true} value={address_input.country} placeholder="" onChangeText={(e) => set_address_input({...address_input, "country": e})}  />
                </View>
                <Button_Main active={next_active_handler()} action={next_handler}>Next</Button_Main>
            </View>
            {manual_address_button ? <Button_Main onClick={() => set_manual_address(true)}>Enter Manually</Button_Main> : null}
        </View>
    );

    const manual = (
        <View style={styles.form}>
            <View style={styles.input_wrapper}>
                <Text style={global.input_light_label}>Postcode/Zipcode</Text>
                <TextInput style={global.input_light} placeholder="" value={address_input.postcode} onChangeText={(e) => set_address_input({...address_input, "postcode": e})} />
            </View>
            <View>
                <View style={styles.input_wrapper}>
                    <Text style={global.input_light_label}>Street 1</Text>
                    <TextInput style={global.input_light} value={address_input.street} placeholder="" onChangeText={(e) => set_address_input({...address_input, "street": e})} />
                </View>
                <View style={styles.input_wrapper}>
                    <Text style={global.input_light_label}>District</Text>
                    <TextInput style={global.input_light} editable={autofill_address ? false : true} selectTextOnFocus={autofill_address ? false : true} value={address_input.district} placeholder="" onChangeText={(e) => set_address_input({...address_input, "district": e})}   />
                </View>
                <View style={styles.input_wrapper}>
                    <Text style={global.input_light_label}>Region</Text>
                    <TextInput style={global.input_light} editable={autofill_address ? false : true} selectTextOnFocus={autofill_address ? false : true} value={address_input.region} placeholder="" onChangeText={(e) => set_address_input({...address_input, "region": e})}  />
                </View>
                <View style={styles.input_wrapper}>
                    <Text style={global.input_light_label}>Country</Text>
                    <TextInput style={global.input_light} editable={autofill_address ? false : true} selectTextOnFocus={autofill_address ? false : true} value={address_input.country} placeholder="" onChangeText={(e) => set_address_input({...address_input, "country": e})}  />
                </View>
            </View>
            <Button_Main active={next_active_handler()} action={find_address}>Find</Button_Main>
        </View>
    );

    //////////////////////////////////////

    const content = () => {
        if(manual_address) { return manual }
        if(address && address.isoCountryCode === "GB") { return uk }
        if(address && address.isoCountryCode !== "GB") { return international }
        return manual
    };


    return content();
};

export default Address;


const styles = StyleSheet.create({
    white: {
        color: colors.white
    },
    input_box_item: {
        backgroundColor: colors.primary,
        borderRadius: 5,
        height: 60,
        width: '48%',
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: 30
    },

    input_wrapper: {
        marginBottom: 5
    },
})

