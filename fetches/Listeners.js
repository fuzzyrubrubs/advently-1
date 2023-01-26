import React, { useState } from 'react';
import { event_expired } from '../../tools/DateTime_Methods';
import { db } from "../Firebase";
import { get_group_data, get_group_upcoming } from '../methods/Group_Functions';
import { get_user_data } from "../methods/User_Functions";
const current_date = new Date();

const listenRealTimeAdmins = (state, id) => {
    return db.collection("groups").where("admin", "==", id).onSnapshot(async (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => doc.data().id);    
        state(data)
  });
};


const listenRealTimeMods = (state, id) => {
    return db.collectionGroup("members").where("user_id", "==", id).where("mod", "==", true).onSnapshot(async (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => doc.data().group_id);    
        state(data)
  });
};


const listenRealTimeUserData = (state, id) => {
    return db.collection("users").doc(id).onSnapshot(async (doc) => {
        const data = doc.data();
        state(data);
    });
}

const listenRealTimeGoing = (state, id) => {
    const current_date = new Date();
    return db.collection("events").where("members", "array-contains", id).where("start", ">=", current_date).onSnapshot(async (querySnapshot) => {
        const data = await Promise.all(querySnapshot.docs.map(async (doc) => {
            const d = doc.data();
            const organiser = d.group_id ? await get_group_data(d.group_id) : await get_user_data(d.admin);
            return {...d, organiser}
       }));    
        state(data)
  });
};

const listenRealTimeHistory = (state, id) => {
    const current_date = new Date();
    return db.collection("events").where("members", "array-contains", id).where("start", "<", current_date).onSnapshot(async (querySnapshot) => {
        const data = await Promise.all(querySnapshot.docs.map(async (doc) => {
            const d = doc.data();
            const organiser = d.group_id ? await get_group_data(d.group_id) : await get_user_data(d.admin);
            return {...d, organiser}
       }));    
        state(data.reverse())
  });
};

const listenRealTimeEventInvites  = (state, id) => {
    return db.collection("events").where("invites", "array-contains", id).where("start", ">=", current_date).orderBy('start', 'desc').onSnapshot(async (querySnapshot) => {
        const data = await Promise.all(querySnapshot.docs.map(async (doc) => {
            const d = doc.data();
            const organiser = d.group_id ? await get_group_data(d.group_id) : await get_user_data(d.admin);
            return {...d, organiser}
        }));       
        state(data) 
  });
};

const listenRealTimeMember = (state, id) => {
    return db.collection("groups").where("members", "array-contains", id).orderBy('name', 'desc').onSnapshot(async (querySnapshot) => {
        const data = await Promise.all(querySnapshot.docs.map(async (doc) => {
            const d = doc.data();
            const upcoming = await get_group_upcoming(d.id)
            return {...d, upcoming}
        }));    
        state(data)
  });
};

const listenRealTimeGroupInvites  = (state, id) => {
    return db.collection("groups").where("invites", "array-contains", id).onSnapshot(async (querySnapshot) => {
        const data = await Promise.all(querySnapshot.docs.map(async (doc) => {
            const d = doc.data();
            const upcoming = await get_group_upcoming(d.id)
            return {...d, upcoming}
        }));    
        state(data) 
  });
};


const listenRealTimeChats  = (state, id) => {
    return db.collection("chats").where("users", "array-contains", id).orderBy('timestamp', 'desc').onSnapshot(async (querySnapshot) => {
        const data = await Promise.all(querySnapshot.docs.map(async (doc) => {
            const item = doc.data();
            const contact_id = item.users.filter(e => e !== id)[0];
            const contact_data = await get_user_data(contact_id);
            const deleted = item.deleted.includes(id);
            const blocked = item.deleted.includes(id);
            const unread = item.unread === id ? true : false;
            return {messages: item.messages, chat_id: item.id, blocked: blocked, contact: contact_data, unread: unread, deleted: deleted}
        }))
        state(data.filter(item => !item.deleted));
    });
};

const listenRealTimeNotifications  = (state, count, id) => {
    return db.collection("users").doc(id).collection("notifications").orderBy('created', 'desc').limit(30).onSnapshot(async (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
            return {note_id: doc.id, ...doc.data()}
        });
        state(data.filter(item => item.type !== 3));
        count(data.filter(item => item.is_read === false).length)
    });
};


export { 
    listenRealTimeAdmins, 
    listenRealTimeMods,
    listenRealTimeGoing,
    listenRealTimeHistory,
    listenRealTimeMember,
    listenRealTimeEventInvites,
    listenRealTimeGroupInvites,
    listenRealTimeUserData,
    listenRealTimeChats, 
    listenRealTimeNotifications
}