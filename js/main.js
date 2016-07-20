'use strict';

const $ = require('cash-dom');
const Vue = require('vue');
// const firebase = require('firebase');
const firebase = window.firebase;
const localforage = require('localforage');
// const page = require('page');
// const PubSub = require('./pubsub');

import { encrypt, decrypt } from './crypto.js';
import Vault from './vault.js';


localforage.config({
    name        : 'brick-password-manager',
    version     : 3
});

const PASS = '123456';
const SALT = 'salt';

Vue.component('header-login', {
    replace: false,
    template: document.querySelector('#header-login-template').innerHTML,
    props: ['name', 'avatar', 'email']
});

Vue.component('vault-editor', {
    replace: false,
    template: document.querySelector('#vault-editor-template').innerHTML,
    props: ['vault'],

    methods: {
        save() {
            console.log(this.vault.id);
        }
    }
});

const makeUser = function({ uid, photoURL, displayName }) {
    return {
        uid,
        photoURL,
        displayName
    };
}

const model = new Vue({
    el: '#app-root',

    data: {
        user: null,
        currentVault: { id: 0 }
    },

    init() {
        localforage.getItem('user').then(user => {
            this.setUser(user);
        });
    },

    ready: () => {
        document.querySelector('#app-root').style.display = 'block';
    },

    computed: {
        isUserLoggedIn () {
            return this.user && this.user.uid;
        },


    },

    methods: {
        setUser(user) {
            this.user = user && makeUser(user);

            localforage.setItem('user', this.user);

            if (user) {
                const dbref = firebase.database().ref(`users/${this.user.uid}/salt`);
                dbref.set(SALT);
            }
        },

        loginWithGitHub: () => {
            var p = new firebase.auth.GithubAuthProvider();
            p.addScope('user');
            firebase.auth().signInWithRedirect(p);
        },

        logout: () => {
            firebase.auth().signOut();
        },

        createSecret: () => {
            console.log('create secret');

            const dbref = firebase.database().ref(`user-passwords/${model.user.uid}`);
            dbref.on('value', x => {
                console.log(x.val());
            });

            dbref.push(encrypt(JSON.stringify({ asdf: 'qwe_' + Math.random() }), SALT, PASS));
        },

        sync: () => {
            const dbref = firebase.database().ref(`user-passwords/${model.user.uid}`);

            dbref.once('value', snap => {
                snap.forEach(x => {
                    const encryptedVal = x.val();
                    const realVal = decrypt(encryptedVal, SALT, PASS);
                    const id = x.key;
                    const obj = JSON.parse(realVal);
                    console.log(id, encryptedVal, realVal, obj);
                });
            });

            // firebase.database().ref(`user-passwords/${model.user.uid}`).push({
            //     asdf: 'qwe'
            // });
        },

        test() {
            console.log(this);
            console.log(this === model);
        }
    }
});

firebase.initializeApp({
    apiKey: "AIzaSyAvdrVPo0WJMIA1qkMVz4_Ul_vDDPmJCGc",
    authDomain: "passwords-b6edd.firebaseapp.com",
    databaseURL: "https://passwords-b6edd.firebaseio.com",
    storageBucket: "passwords-b6edd.appspot.com",
});
//
// firebase.database().ref(`users/STxWl9QwIwWIwVpm9Z1fDmmdtju1`).once('value', s => {
//     console.log(s.val());
// });



const rf = firebase.database().ref('user-passwords/STxWl9QwIwWIwVpm9Z1fDmmdtju1');
rf.once('value', snap => {
    console.log(snap.val());
});

firebase.auth().onAuthStateChanged(model.setUser);
// firebase.auth().onAuthStateChanged(user => (user && console.log(user.uid)) || 'null user');
// firebase.auth().onAuthStateChanged(x => console.log('auth state changed', x));


// const vaults = [
//     {
//         title: 'title',
//         iv: 'abc123',
//         salt: 'salt',
//         secrets: [
//             'sdfsdfsdf',
//             'wer23332efsd',
//             '...'
//         ]
//     }
// ];



const sjcl = require('sjcl');

var saltBits = sjcl.random.randomWords(8);
var derivedKey = sjcl.misc.pbkdf2("password", saltBits, 1000, 256);
var key = sjcl.codec.base64.fromBits(derivedKey);

var rp = {};
// sjcl.encrypt(key, 'text', { iv: sjcl.random.randomWords(8) }, rp)
const res = sjcl.encrypt('password', 'text', { ks: 256, mode: 'gcm' });
console.log(1, res);

const res2 = sjcl.decrypt('password', res);
console.log(2, res2);

// console.time('asdf');
// for (var i = 0; i < 10; i++) {
//     var saltBits = sjcl.random.randomWords(8);
//     var derivedKey = sjcl.misc.pbkdf2("password", saltBits, 1000, 256);
//     var key = sjcl.codec.base64.fromBits(derivedKey);
//     sjcl.encrypt('skldifjuisoufo8s78f8s7f897s98', 'fsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsd', { ks: 256, mode: 'gcm' });
// }
//
// console.timeEnd('asdf');
