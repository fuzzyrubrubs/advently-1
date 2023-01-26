import { db } from "../firebase/Firebase";
import { get_group_data } from "../firebase/methods/Group_Functions";
import { get_user_data } from "../firebase/methods/User_Functions";


const listenRealTimeEvent = (state, id) => {
    return db.collection("events").doc(id).onSnapshot(async (doc) => {
        const d = doc.data();
        const organiser = d.group_id ? await get_group_data(d.group_id) : await get_user_data(d.admin);
        state({...d, organiser})
    });
}

const sort_comments = (comments) => comments.sort((a, b) => a.created.seconds - b.created.seconds);
const listenRealTimeComments = (state, id ) => {
    return db.collection("events").doc(id).collection("comments").onSnapshot(async (querySnapshot) => {
        const data = await Promise.all(querySnapshot.docs.map(async (doc) => {
            const d = doc.data();
            const u = d.ref_id ? await get_user_data(d.ref_id) : d.data;
            return {...d, data: u}
        }));
    state(sort_comments(data))    
    })
}

const listenRealTimeJoiners = (state, id ) => {
    return db.collection("events").doc(id).collection("joiners").onSnapshot(async (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => doc.data());
        state(data.map(user => user.user_id))   
    })
}


///
const listenRealTimeGroup = (state, id) => {
    return db.collection("groups").doc(id).onSnapshot(doc => state(doc.data()));
}

const listenRealTimeMessages = (state, id ) => {
    return db.collection("groups").doc(id).collection("messages").onSnapshot(async (querySnapshot) => {
        const data = await Promise.all(querySnapshot.docs.map(async (doc) => {
            const d = doc.data();
            const u = d.ref_id ? await get_user_data(d.ref_id) : d.data;
            return {...d, data: u}
        }));
    state(sort_comments(data))    
    })
}

const listenRealTimeMembers = (state, id ) => {
    return db.collection("groups").doc(id).collection("members").onSnapshot(async (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => doc.data());
        state(data.map(user => user.user_id))   
    })
};

const listenRealTimeUser = (state, id) => {
    return db.collection("users").doc(id).onSnapshot(async (doc) => {
        const d = doc.data();
        state(d)
    });
}



export { 
    listenRealTimeEvent, 
    listenRealTimeComments,
    listenRealTimeJoiners,
    listenRealTimeGroup,
    listenRealTimeMembers, 
    listenRealTimeMessages, 
    listenRealTimeUser
}