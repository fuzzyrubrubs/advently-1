import { View, StyleSheet, Text } from "react-native";
import { Ionicons, MaterialCommunityIcons  } from '@expo/vector-icons';
import colors from "../assets/colors/colors";
import typography from "../styles/typography";
import global from "../styles/global";

function Information (props) {
    return (
        <View style={styles.information}>
            <MaterialCommunityIcons name="information-outline" size={24} color={colors.text_light_medium} />
            <Text style={[typography.small, global.text_light_medium, {marginLeft: 15}]}>{props.children}</Text>
        </View>
    )
}

export { Information }

const styles = StyleSheet.create({
    information: {
        alignSelf: 'stretch',
        backgroundColor: colors.background_light,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 65

    }
    
});