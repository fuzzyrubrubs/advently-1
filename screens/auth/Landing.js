import React, { useRef, useContext } from 'react';
import { StyleSheet, Text, View, Image, Animated, Linking, Pressable } from 'react-native';
import typography from '../../styles/typography';
import Button_Landing from '../../components/Buttons/Button_Landing';
import colors from '../../assets/colors/colors';
// import * as WebBrowser from 'expo-web-browser';
// import { AuthContext } from '../../contexts/Auth.context';
// import { FontAwesome5 } from '@expo/vector-icons';


function Landing({ navigation }) {  
    // const { sign_in_google } = useContext(AuthContext); 

    const scroll_up_animation = useRef(new Animated.Value(-500)).current;
    
    Animated.timing(scroll_up_animation, {
        toValue: 0,
        duration: 1000,
        delay: 800,
        useNativeDriver: false
    }).start();

    return (      
        <View style={styles.container}>
            <Image style={styles.image} source={require('../../assets/images/landing.png')} />
            <Animated.View style={[styles.wrapper, {bottom: scroll_up_animation}]}>
                <View style={styles.section}>
                    <Text style={styles.welcome}>Welcome to</Text>
                    <Image style={styles.logo} source={require('../../assets/logo-transparent.png')} />
                    <Text style={styles.title}>Advently</Text>
                </View>
                <View style={styles.section}>
                    <Button_Landing action={() => navigation.push('Register')}>Get Started</Button_Landing>
                    <Text onPress={() => Linking.openURL('https://www.advently.co.uk/terms')} style={[typography.small, styles.small_print]}>By signing up you are agreeing to Advently's terms and conditions</Text>
                </View>
                <View style={[styles.section, styles.footer]}>
                    <Text style={[typography.main, styles.account]}>Already have an account?</Text>
                    <Text onPress={() => navigation.push('Login')} style={[typography.main_bold, styles.white]}>Login</Text>
                </View>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }, 
    image: {
        width: "100%",
        height: "100%"
    },
    wrapper: {
        backgroundColor: colors.secondary,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-between',
        position: 'absolute',
        left: 0,
        height: "75%",
        width: "100%",
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30
        
    },
    section: {
        alignItems: 'center',
        textAlign: 'center',
        paddingHorizontal: 40
    },
    logo: {
        height: 70, 
        width: 70,
        marginTop: 15,
        borderRadius: 70
    },
    title: {
        color: colors.text_light,
        marginTop: 5,
        fontSize: 25,
        lineHeight: 32,
        fontFamily: 'Ubuntu-Medium'
    },
    welcome: {
        color: colors.text_light_medium,
        marginTop: 50,
        fontSize: 20,
        lineHeight: 22,
        fontFamily: 'Ubuntu-Medium'
    }, 
    small_print: {
        color: colors.text_light_medium,
        marginTop: 10,
        textAlign: 'left',
        paddingHorizontal: 3
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 50
    },
    white: {
        color: colors.text_light
    },
    account: {
        color: colors.text_light_medium,
        marginRight: 5
    },
    google: {
        backgroundColor: colors.background_light,
        borderWidth: 0.5,
        borderColor: colors.text_light,
        borderRadius: 10,
        width: 300,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    google_text: {
        color: colors.text_medium,
        fontSize: 15,
        fontFamily: 'Ubuntu-Bold'
    }
})

export default Landing;

