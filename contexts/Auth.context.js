import React, { createContext, useState, useEffect } from "react";
import { auth } from '../firebase/Firebase';
import { add_member } from "../firebase/methods/Group_Functions";
import { create_user_profile } from '../firebase/methods/User_Functions';

// import * as WebBrowser from 'expo-web-browser';
// import { ResponseType, makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
// import * as Google from 'expo-auth-session/providers/google';
// import * as GoogleSignIn from 'expo-google-sign-in';


export const AuthContext = createContext();

// WebBrowser.maybeCompleteAuthSession();

export function AuthProvider(props) {
 
    const [user, setUser] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);

    
    useEffect(() => {
 
        var unlisten = auth.onAuthStateChanged(async (user) => {
            if(user){
                setEmailVerified(user.emailVerified)
                setUser(user.uid)      
                } else {
                setUser(null);        
            }
        })
    }, [])

    useEffect(() => {
        auth.onIdTokenChanged(async (user) => {
            if(user){
                setEmailVerified(user.emailVerified)
                setUser(user.uid)      
            } else {
                setUser(null);      
            }
        });
    }, [])


    
    const register_user = (main, profile) => {
        var status = async () => {
            try {
                await auth.createUserWithEmailAndPassword(main.email, main.password).then(user => {
                    return user.user.uid
                    }).then((result) => {
                        create_user_profile(result, {...profile, email: main.email})
                    })
                return true
            } catch (error) {
                return error.message
            }
        }
        return status();
    }

    const sign_in = ({email, password}) => {
        var status = async () => {
            try {
                await auth.signInWithEmailAndPassword(email, password);
                return true
            } catch (error) {
                return error.message
            }
        }
        return status();
    }

    const sign_out = () => auth.signOut(); 


    return (
    <AuthContext.Provider value={{ user, register_user, sign_in, sign_out }}>
        {props.children}
    </AuthContext.Provider>
    );

};





    // useEffect(() => {
    //     initAsync();
    // }, []);

    // const initAsync = async () => {
    //     await GoogleSignIn.initAsync({});
    //     _syncUserWithStateAsync();
    //   };
    
    // const _syncUserWithStateAsync = async () => {
    //     await GoogleSignIn.signInSilentlyAsync();
    // };

    // const signOutAsync = async () => {
    //     await GoogleSignIn.signOutAsync();
    // };

    // const sign_in_google = async () => {
    //     try {
    //         await GoogleSignIn.askForPlayServicesAsync();
    //         const {idToken} = await GoogleSignIn.signInAsync();
    //         const credential = auth.GoogleAuthProvider.credential(idToken);
    //         _syncUserWithStateAsync();
    //         await auth.signInWithCredential(credential).then((result) => {
    //             if(result.additionalUserInfo.isNewUser) {
    //                 create_user_profile(result.user.uid, {name: result.user.displayName, email: result.user.email})
    //             }
    //         });
    //     } catch ({ message }) {
    //       return message
    //     }
    //   };



    //const [request, response, sign_in_google] = Google.useIdTokenAuthRequest({clientId: '959656286292-962plieog6bu5fa1ugm38loae0dporhn'});

    // React.useEffect(() => {
    //         console.log(response)
    //         console.log("AUTH CONTEXT GOOGLE SIGN IN")
    //         if (response?.type === 'success') {
    //         const { id_token } = response.params;       
    //         const provider = new firebase.auth.GoogleAuthProvider();
    //         const credential = provider.credential(id_token);
    //         auth.signInWithCredential(credential).then((result) => {
    //             if(result.additionalUserInfo.isNewUser) {
    //                 create_user_profile(result.user.uid, {name: result.user.displayName, email: result.user.email})
    //             };
    //             return result
    //         });
    //         }
    //     }, [response]);
