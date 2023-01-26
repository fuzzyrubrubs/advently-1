import { Dimensions } from 'react-native';
import colors from '../assets/colors/colors';
const windowHeight = Dimensions.get('window').height;

export default {
    input: {
        borderWidth: 1,
        borderColor: '#777',
        padding: 8,
        margin: 10
    },
    input_light: {
        backgroundColor: colors.background_light,
        padding: 15,
        borderRadius: 5,
        width: '100%',
        color: "#707070",
        fontFamily: 'Ubuntu-Medium',
        height: 60,
    },
    input_light_label: {
        fontFamily: 'Ubuntu-Regular',
        color: colors.text_dark,
        marginBottom: 5
    },
    input_dark: {
        backgroundColor: '#4C4C65',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        color: colors.text_light,
        height: 60
    },
    input_dark_label: {
        fontFamily: 'Ubuntu-Regular',
        color: colors.text_light_medium,
        marginBottom: 5
    },
    status_text: {
        fontSize: 12,
        lineHeight: 15,
        fontFamily: 'Ubuntu-Medium',
        color: colors.text_dark,
        textAlign: 'center',
        marginBottom: 20
    },
    link_button: {
        flexDirection: 'row',
        borderRadius: 10,
        alignItems: 'center', 
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    events_preview_date: {
        marginBottom: 15,
        marginTop: 5,
        color: colors.text_light_medium
    },
    list_wrapper: {
        marginBottom: 20
    },
    information: {
        textAlign: 'center',
        marginBottom: 15
    },
    image_round: {
        alignSelf: 'center',
        height: 120, 
        width: 120,
        borderRadius: 120,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    image_opacity: {
        opacity: 0.8
    }, 
    input_box_item: {
        backgroundColor: colors.primary,
        borderRadius: 5,
        height: 50,
        width: '48%',
        justifyContent: 'center', 
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 3, 
    },
    badge: reduced => ({
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.thirdary,
        borderRadius: 50,
        position: "absolute",
        top: reduced ? 0 : -10, 
        right: reduced ? 0 : -10,
        minHeight: 22, 
        minWidth: 22,
        textAlign: 'center',
        textAlignVertical: 'center',
        overflow: 'hidden'
    }),
      badge_text: {
        color: colors.white,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 12,
        lineHeight: 15,
        fontFamily: 'Ubuntu-Medium',
      },
    shadow: {
        elevation: 5,
        shadowColor: '#55555570',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2, 
    },
    text_light: { color: colors.text_light },
    text_light_medium: { color: colors.text_light_medium },
    text_medium: { color: colors.text_medium },
    text_white: { color: colors.white },
    text_primary: { color: colors.primary },
    capitalize: { textTransform: 'capitalize' },
    bottom: amount => ({marginBottom: amount}),
    left: amount => ({marginLeft: amount}),
    right: amount => ({marginRight: amount}),
    highlight: {
        backgroundColor: "rgba(85, 85, 85, 0.64)",
        paddingVertical: 7, 
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center', 
        color: colors.white,
        borderRadius: 20,
        alignSelf: 'flex-start',
    }

}