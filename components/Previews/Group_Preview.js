import React from 'react';
import { StyleSheet, Pressable, View, Text, ImageBackground, Image } from 'react-native';
import colors from '../../assets/colors/colors';
import typography from '../../styles/typography';
import { useNavigation } from '@react-navigation/native';
import containers from '../../styles/containers';
import { group_types, pressed_opacity } from '../../tools/Global_Variables';
import global from '../../styles/global';
import { FontAwesome5, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Members_Display from '../Items/Members_Display';
import { Ionicons } from '@expo/vector-icons';

function Group_Preview(props){
    const navigation = useNavigation();

    
    const group = props.data;
    
    const wrappers = [
        <><View style={styles.green_two}></View><View style={styles.green_one}></View></>, 
        <><View style={styles.pink_two}></View><View style={styles.pink_one}></View></>, 
        <><View style={styles.blue_two}></View><View style={styles.blue_one}></View></>, 
        <><View style={styles.purple_two}></View><View style={styles.purple_one}></View></>, 
    ];

    const wrapper_colors = ['#C5F8EA', '#FBD8EA', '#C4E1FF', '#D0C9FF'];

    return (
        <Pressable onPress={() => navigation.navigate('Group', group)} style={({pressed}) => [{opacity: pressed ? pressed_opacity: 1}, styles.container]}>
                <ImageBackground style={styles.image} imageStyle={styles.image} source={{uri: group.image }}>
                    <LinearGradient colors={["#00000080", "#42424296"]} style={styles.gradient}>
                        <View style={containers.simple_column}>
                            <Text style={[typography.small, global.text_primary, global.bottom(5)]}>{group_types[group.type]}</Text>
                            <Text style={[typography.main_bold, global.text_white, global.bottom(5)]}>{group.name}</Text>
                            <View style={[global.highlight, global.bottom(15)]}><Text style={[typography.small, global.text_white, {fontSize: 12}]}>{group.location}</Text></View>
                            <Text style={[typography.small, global.text_light]}>{group.about}</Text>
                        </View>
                    </LinearGradient>
                </ImageBackground>
                <View style={styles.members}>
                    <Members_Display dark={true} users={group.members} />
                    <View style={containers.simple_row}>
                        <Text style={[typography.small, global.text_primary, global.right(5)]}>Upcoming</Text>
                        <Ionicons name="arrow-forward-sharp" size={24} color={colors.primary} />
                    </View>
                </View>
        </Pressable>
        // <Pressable onPress={() => navigation.navigate('Group', group)} style={({pressed}) => [{opacity: pressed ? pressed_opacity: 1}, styles.group]}>
        //     {wrappers[group.type]}
        //     <View style={[containers.simple_row, global.bottom(20)]}>
        //         <View style={containers.left_row}>
        //             <Image style={styles.group_image} source={{uri: group.image}} />
        //             <View>
        //                 <Text style={[typography.main_bold, global.bottom(5)]}>{group.name}</Text>
        //                 <Text style={[typography.extra_small, global.text_light_medium]}>{group.location}</Text>
        //             </View>
        //         </View>
        //         <View style={{flexDirection: 'row', alignItems: 'center'}}>
        //             <Text style={[typography.extra_small, global.text_light_medium, {marginRight: 5}]}>{group.upcoming.length}</Text>
        //             <FontAwesome name="calendar-o" size={12} color={colors.text_light_medium} />
        //         </View>
        //     </View>
        //     <View style={containers.simple_row}>
        //         <View>
        //             <View style={[containers.left_row, global.bottom(5)]}>
        //                 <FontAwesome name="columns" size={12} color={colors.text_medium} />
        //                 <Text style={[typography.extra_small, global.text_medium, {marginLeft: 10}]}>{group_types[group.type]}</Text>
        //             </View>
        //             <View style={containers.left_row}>
        //                 <FontAwesome name="user-o" size={12} color={colors.text_medium} />
        //                 <Text style={[typography.extra_small, global.text_medium, {marginLeft: 10}]}>{group.members.length} members</Text>
        //             </View>
        //         </View>
        //         <View style={{width: "55%", alignSelf: 'flex-start'}}>
        //             <Text style={[typography.extra_small, global.text_light_medium]}>{group.about}</Text>
        //         </View>
        //     </View>
        // </Pressable>
    );
}
export default Group_Preview;

const styles = StyleSheet.create({
    container: {
        height: 250,
        marginBottom: 20,
        padding: 5,
        backgroundColor: "#424242",
        borderRadius: 25,
    },
    gradient: {
        height: 170,
        borderTopLeftRadius: 20, 
        borderTopRightRadius: 20,
        padding: 20
    },
    image: {
        borderTopLeftRadius: 20, 
        borderTopRightRadius: 20,
    },
    members: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 80,
        padding: 20
    },  




    group: {
        backgroundColor: colors.background_light,
        borderRadius: 20,
        width: "100%",
        marginBottom: 20, 
        padding: 20, 
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',

    },  
    group_image: {
        height: 60,
        width: 60,
        borderRadius: 60,
        marginRight: 15
    },
    blue_one: {
        position: 'absolute',
        opacity: 0.6,
        top: "-4%", 
        right: "-5%",
        height: "80%",
        aspectRatio: 1,
        borderRadius: 30,
        backgroundColor: '#B4CEFE',
        transform: [{rotate: "40deg"}]
    },
    blue_two: {
        position: 'absolute',
        opacity: 0.6,
        bottom: "-4%", 
        right: "-5%",
        height: "80%",
        aspectRatio: 1,
        borderRadius: 30,
        backgroundColor: '#DDF1FE',
        transform: [{rotate: "40deg"}]
    },
    purple_one: {
        position: 'absolute',
        opacity: 0.6,
        top: "-4%", 
        right: "-5%",
        height: "80%",
        aspectRatio: 1,
        borderRadius: 30,
        backgroundColor: '#AAABE5',
        transform: [{rotate: "40deg"}]
    },
    purple_two: {
        position: 'absolute',
        opacity: 0.6,
        bottom: "-4%", 
        right: "-5%",
        height: "80%",
        aspectRatio: 1,
        borderRadius: 30,
        backgroundColor: '#DDDEFF',
        transform: [{rotate: "40deg"}]
    },
    green_one: {
        position: 'absolute',
        opacity: 0.6,
        top: "-4%", 
        right: "-5%",
        height: "80%",
        aspectRatio: 1,
        borderRadius: 30,
        backgroundColor: '#C3E6DC',
        transform: [{rotate: "40deg"}]
    },
    green_two: {
        position: 'absolute',
        opacity: 0.6,
        bottom: "-4%", 
        right: "-5%",
        height: "80%",
        aspectRatio: 1,
        borderRadius: 30,
        backgroundColor: '#DCFFF5',
        transform: [{rotate: "40deg"}]
    },
    pink_one: {
        position: 'absolute',
        opacity: 0.6,
        top: "-4%", 
        right: "-5%",
        height: "80%",
        aspectRatio: 1,
        borderRadius: 30,
        backgroundColor: '#E698AF',
        transform: [{rotate: "40deg"}]
    },
    pink_two: {
        position: 'absolute',
        opacity: 0.6,
        bottom: "-4%", 
        right: "-5%",
        height: "80%",
        aspectRatio: 1,
        borderRadius: 30,
        backgroundColor: '#FFB1C8',
        transform: [{rotate: "40deg"}]
    },
    
    
    
    
    
    
    
    
    
    
    
})
