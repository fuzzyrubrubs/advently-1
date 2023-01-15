import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { color } from 'react-native-reanimated';
import colors from '../../assets/colors/colors';
import { FontAwesome, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import global from '../../styles/global';
import typography from '../../styles/typography';
import { ProfileDataContext } from '../../contexts/ProfileData.context';

function Custom_Tab_Bar({ state, descriptors, navigation }) {
  const { unread_notes, unread_chats } = useContext(ProfileDataContext);

  
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          
          const label =
          options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;

          const isFocused = state.index === index;

          const the_icon = 
            route.name === "Events" ? (
              <View style={styles.icon_wrapper}> 
                <Text style={styles.icon}><MaterialIcons name="event" size={25} color={isFocused ? colors.white : "#ffffff80"} /></Text> 
                {isFocused ? <View style={styles.selected_dot}></View> : null }  
              </View>) :
            route.name === "Groups" ? ( 
              <View style={styles.icon_wrapper}> 
                <Text style={styles.icon}><FontAwesome name="th" size={25} color={isFocused ? colors.white : "#ffffff80"} /></Text> 
                  {isFocused ? <View style={styles.selected_dot}></View> : null }  
                </View> ) :
            route.name === "Search" ? ( 
              <View style={styles.icon_wrapper}> 
                <Text style={styles.icon}><FontAwesome name="search" size={25} color={isFocused ? colors.white : "#ffffff80"} /></Text> 
                  {isFocused ? <View style={styles.selected_dot}></View> : null }  
                </View> ) :
            route.name === "Activity" ? ( 
              <View style={styles.icon_wrapper}> 
                <Text style={styles.icon}><MaterialIcons name="notifications" size={25} color={isFocused ? colors.white : "#ffffff80"} /></Text> 
                  {isFocused ? <View style={styles.selected_dot}></View> : null } 
                  {unread_notes > 0 ? <View style={styles.badge}><Text style={[typography.small, styles.badge_text]}>{unread_notes}</Text></View> : null} 
                </View> ) : (
            <View style={styles.icon_wrapper}> 
                <Text style={styles.icon}><FontAwesome name="user" size={25} color={isFocused ? colors.white : "#ffffff80"} /></Text> 
                {isFocused ? <View style={styles.selected_dot}></View> : null } 
                {unread_chats > 0 ? <View style={styles.badge}><Text style={[typography.small, styles.badge_text]}>{unread_chats}</Text></View> : null} 
            </View> );


          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
              // navigation.reset({routes: [{name: route.name}] })
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              key={index}
              style={[styles.item]}
            >
              {the_icon}       
              {/* <Text style={[{ color: isFocused ? colors.primary : colors.text_dark}, styles.text ]}>
              </Text> */}
            </TouchableOpacity>
          );

        })}
         </View>
      </View>
  );
}

export default Custom_Tab_Bar;

const styles = StyleSheet.create({  
    container: {
        height: "auto",
        backgroundColor: "transparent",
    },
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      height: Platform.OS === 'ios' ? 90 : 70,
      backgroundColor: colors.primary,
      borderTopRightRadius: 25, 
      borderTopLeftRadius: 25,
      elevation: 5
    },
    item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',  
        borderRadius: 100,
        height: 50, 
        width: 50
    },
    text: {
        fontSize: 10
    },
    icon_wrapper: {
      alignItems: 'center'
    },
    selected_dot: {
      height: 5, 
      width: 5,
      backgroundColor: colors.white,
      marginTop: 5,
      borderRadius: 10,
      flexDirection: 'column',
    },
    badge: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.thirdary,
      borderRadius: 50,
      position: "absolute",
      top: -10, 
      right: -10,
      minHeight: 22, 
      minWidth: 22,
      textAlign: 'center',
      textAlignVertical: 'center',
      overflow: 'hidden'
    },
    badge_text: {
      color: colors.white,
      textAlign: 'center',
      textAlignVertical: 'center',
    }
})