import React, { useContext } from 'react';
import { FlatList, View, StyleSheet, Dimensions, Text } from 'react-native';
import { ProfileDataContext } from "../../contexts/ProfileData.context.js";
import { AuthContext } from "../../contexts/Auth.context.js";
import typography from "../../styles/typography.js";
import colors from "../../assets/colors/colors.js";
import { Simple, Member, Invite, Joiner } from "../Previews/Member_Preview.js";



function Simple_List (props) {
    const list = props.list;
    
    const circle = <View style={styles.circle_wrapper}><View style={styles.circle}><Text style={[typography.main_bold, styles.circle_icon]}>{list.length}</Text></View></View>;
    const add_icon = (members) => {
        if(members.length <= 16) return members;
        if(members.length > 16) {
            let sliced = members.slice(0, 15);
            sliced.push(circle);
            return sliced
        }
    }

    const simple_members = list.map(item => <Simple key={item.id} data={item} simple={true} />);

    return add_icon(simple_members) 

}

function Member_List (props) {
    const { user } = useContext(AuthContext)
    const data = props.data;
    const list = props.list.sort((a, b) => { 
        return a == data.admin ? -1 : b == data.admin ? 1 : data.mods.includes(a) ? -1 : data.mods.includes(b) ? 1 : 0; 
    });
    

    const status_handler = (item) => {
        if(data.admin === item) { return 5 }
        if(data.mods.includes(item)) { return 4 }
        if(data.members.includes(item)) { return 3 }
        if(data.invites.includes(item)) { return 2 }
        if(data.declined.includes(item)) { return 1 }
        return 0
    };


    return  (
        <FlatList 
                data={list}
                renderItem={({ item }) => (
                    <Member 
                        key={item.id}
                        data={item} 
                        status={status_handler(item)} 
                        access={data.admin === user || data.mods.includes(user)}
                        admin={data.admin === user}
                        press={props.press}
                        group={data}
                    />
                ) }
                keyExtractor={(item, index) => `${index}${item}${index}`}
                numColumns="4"
                showsVerticalScrollIndicator={false}
            />
    )

}

function Joiner_List (props) {
    const { user } = useContext(AuthContext)
    const data = props.data;
    const list = props.list.sort((a, b) => { 
        return a == data.admin ? -1 : b == data.admin ? 1 : data.mods.includes(a) ? -1 : data.mods.includes(b) ? 1 : 0; 
    });
    

    const status_handler = (item) => {
        if(data.admin === item && data.members.includes(item)) { return 4 }
        if(data.mods.includes(item) && data.members.includes(item)) { return 3 }
        if(data.members.includes(item)) { return 2 }
        if(data.invites.includes(item)) { return 1 }
        if(data.declined.includes(item)) { return 0 }
        return 0
    };


    

    return  (
        <View style={styles.map}>
            {list.map(item => <Joiner key={item.id} data={item} status={status_handler(item)} access={data.admin === user || data.mods.includes(user)} admin={data.admin === user} press={props.press} alt_press={props.alt_press} />)}
        </View>
    )

}

function Invite_List (props) {
    const { user } = useContext(AuthContext)
    const data = props.data;
    const list = props.list;
    
    
    const status_handler = (item) => {
        if(data.members.includes(item)) { return 3 }
        if(data.invites.includes(item)) { return 2 }
        if(data.declined.includes(item)) { return 1 }
        return 0
    };

    return  (
        <FlatList 
                data={list}
                extraData={list}
                renderItem={({ item }) => (
                    <Invite 
                        key={item.id}
                        data={item} 
                        status={status_handler(item)} 
                        press={props.press}
                    />
                )}
                keyExtractor={(item, index) => `${index}${item}${index}`}
                numColumns="4"
                showsVerticalScrollIndicator={false}
            />
    )

}

export { Simple_List, Member_List, Invite_List, Joiner_List }

const circle_size = Dimensions.get('window').height / 12;

const styles = StyleSheet.create({
    circle_icon: {
        
    },
    circle: {
        borderRadius: 100,
        backgroundColor: colors.background_light,
        height: circle_size, 
        width: circle_size,
        alignItems: 'center',
        justifyContent: 'center',

    },
    circle_wrapper: {
        width: "25%",
        height: "25%",
        alignItems: 'center',
        justifyContent: 'center',
    }, 
    map: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});