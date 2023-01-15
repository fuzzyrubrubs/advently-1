import React, { useContext } from 'react';
import { StyleSheet, Pressable, View, Text, ImageBackground, Image } from 'react-native';
import colors from '../../assets/colors/colors';
import typography from '../../styles/typography';
import { useNavigation } from '@react-navigation/native';
import containers from '../../styles/containers';
import { day_month, invite_preview_format } from '../../tools/DateTime_Methods';
import { pressed_opacity } from '../../tools/Global_Variables';
import global from '../../styles/global';
import Swipe from '../Animations/Swipe';
import { FontAwesome5 } from '@expo/vector-icons';
import { LocationContext } from '../../contexts/Location.context';
import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { accept_event_invite, decline_event_invite } from '../../firebase/methods/Event_Functions';
import { AuthContext } from '../../contexts/Auth.context';
import { ProfileDataContext } from '../../contexts/ProfileData.context';

function Invite_Preview(props){
    const { user } = useContext(AuthContext);
    const { user_profile } = useContext(ProfileDataContext)
    const { location, calculate_distance } = useContext(LocationContext);
    const navigation = useNavigation();
    const event = props.data;

    const right_handler = () => decline_event_invite(user, event.id);
    const left_handler = () => accept_event_invite(user_profile, event);

    const [day, month] = day_month(event.start).split(" ");

    return (
        <Swipe right_action={right_handler} left_action={left_handler}>
            <Pressable onPress={() => navigation.navigate('Event', event)} style={({pressed}) => [{opacity: pressed ? pressed_opacity : 1}, styles.container, global.shadow]}>
                
                

                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={[colors.secondary_light, colors.secondary]} style={styles.date}>
                        <Text style={[typography.header_5, global.text_white]}>{day}</Text>
                        <Text style={[typography.extra_small, global.text_light]}>{month}</Text>
                    </LinearGradient>

                    <View style={styles.content}>
                        


                        <Text style={[typography.extra_small, global.text_light_medium]}>{event.organiser.name}</Text>
                        <Text style={[typography.header_4, styles.name]}>{event.name}</Text>
                        <View style={styles.details}>
                            <Text style={[typography.extra_small, global.text_light_medium]}>{event.time} </Text>
                            {location && event.coordinates ? (
                                <>
                                <Entypo name="dot-single" size={15} color={colors.text_light_medium} />
                                <Text style={[typography.extra_small, global.text_light_medium]}> {`${calculate_distance(event.coordinates.latitude, event.coordinates.longitude)} miles`}</Text>
                                </>
                            ) : null}
                        </View>

                    </View>

                
            </Pressable>
        </Swipe>
    )
}
export default Invite_Preview;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.background_light,
        elevation: 5,
        padding: 11,
        borderRadius: 15,
        marginLeft: 25, 
        marginRight: 25,
        marginBottom: 5
    },  
    
    date: {
        height: 70, 
        width: 60, 
        borderRadius: 10,
        backgroundColor: colors.primary_light,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.2,
        borderColor: colors.text_light,
        overflow: 'hidden',
        marginRight: 1
        },
    content: {
        backgroundColor: colors.background_light,
        flex: 1,
        justifyContent: 'center',
        borderRadius: 10,
        paddingHorizontal: 20
    },
    
    name: { 
        marginVertical: 1 
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center'
    },
})
