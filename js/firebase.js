const firebase = window.firebase;
// const firebase = require('firebase');

import store from './store';

var userid;

firebase.initializeApp({
    apiKey: "AIzaSyAvdrVPo0WJMIA1qkMVz4_Ul_vDDPmJCGc",
    authDomain: "passwords-b6edd.firebaseapp.com",
    databaseURL: "https://passwords-b6edd.firebaseio.com",
    storageBucket: "passwords-b6edd.appspot.com",
});

firebase.auth().onAuthStateChanged(user => store.dispatch({ type: 'auth-state-changed', user }));
// firebase.auth().onAuthStateChanged(user => {
//     if (user.uid) {
//         userid = user.uid;
//
//         const dbref = firebase.database().ref(`user-passwords/${userid}`);
//
//         dbref.once('value', x => {
//             console.log('!!! value', x.val());
//         });
//
//         dbref.on('child_changed', x => {
//             console.log('!!! ch_ch', x.val());
//         });
//
//         dbref.on('child_added', x => {
//             console.log('!!! ch_ad', x.key, x.val());
//         });
//
//         setTimeout(() => dbref.push({ asdf: 'qwe' }), 2500);
//     }
// });

const upsertVault = vault => {
    const dbref = firebase.database().ref(`users/${userid}/vaults/${vault.id}`);
    dbref.set(vault);
};

const usermanager = {
    login(provider) {
        var authProvider = new firebase.auth.GithubAuthProvider();
        authProvider.addScope('user');
        firebase.auth().signInWithRedirect(authProvider);
    },

    logout() {
        firebase.auth().signOut();
    }
};

export { firebase, usermanager, upsertVault };
