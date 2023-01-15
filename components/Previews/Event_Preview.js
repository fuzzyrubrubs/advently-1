import React, { useContext } from 'react';
import { StyleSheet, Pressable, Text, View, ImageBackground } from 'react-native';
import colors from '../../assets/colors/colors';
import typography from '../../styles/typography';
import global from '../../styles/global';
import { useNavigation } from '@react-navigation/native';
import { LocationContext } from '../../contexts/Location.context';
import { day_month } from '../../tools/DateTime_Methods';
import { pressed_opacity } from '../../tools/Global_Variables';
import containers from '../../styles/containers';
import { LinearGradient } from 'expo-linear-gradient';
import Members_Display from '../Items/Members_Display';
import { Entypo } from '@expo/vector-icons';

function Event_Preview(props){
    const { location, calculate_distance } = useContext(LocationContext);
    const navigation = useNavigation();
    
    const event_data = props.event;

    const [day, month] = day_month(event_data.start).split(" ");

    return (
        <Pressable onPress={() => navigation.navigate('Event', event_data)} style={({pressed}) => [{opacity: pressed ? pressed_opacity : 1}, styles.container]}>
            <ImageBackground style={styles.image} imageStyle={styles.image_style} source={{uri: event_data.image }}>
                    <LinearGradient colors={['transparent', colors.secondary]} style={styles.gradient}>
                        <View style={containers.simple_row}>
                            <View>
                                <Members_Display users={event_data.members} />
                            </View>
                            <View style={[global.shadow, styles.date]}>
                                <Text style={typography.header_5}>{day}</Text>
                                <Text style={[typography.extra_small, global.text_light_medium]}>{month}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={[typography.extra_small, global.text_light]}>{event_data.organiser.name || "Not found"}</Text>
                            <Text style={[typography.header_4, global.text_white, styles.name]}>{event_data.name}</Text>
                            <View style={styles.details}>
                                <Text style={[typography.extra_small, global.text_light]}>{event_data.time}</Text>
                                <Entypo name="dot-single" size={15} color={colors.text_light} />
                                <Text style={[typography.extra_small, global.text_light]}>{event_data.private_status ? "Private" : "Open"}</Text>
                                {location && event_data.coordinates ? (
                                    <>
                                    <Entypo name="dot-single" size={15} color={colors.text_light} />
                                    <Text style={[typography.extra_small, global.text_light]}> {`${calculate_distance(event_data.coordinates.latitude, event_data.coordinates.longitude)} miles`}</Text>
                                    </>
                                ) : null}
                            </View>
                        </View>
                    </LinearGradient> 
            </ImageBackground>
        </Pressable>
    );
}


const styles = StyleSheet.create({
    gradient: {
        width: "100%",
        height: "100%",
        borderRadius: 15,
        justifyContent: 'space-between',
        padding: 25
    },
    container: {
        width: "100%",
        backgroundColor: colors.secondary,
        marginBottom: 20,
        borderRadius: 15
    },

    image: {
        height: 220, 
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    image_style: {
        opacity: 0.9,
        borderRadius: 15
    }, 
   
    name: { marginVertical: 5 },
    date: {
        height: 55, 
        width: 50, 
        borderRadius: 10,
        backgroundColor: colors.background_light,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5
    }, 
    details: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})

export default Event_Preview;