'use strict';

const $ = require('cash-dom');
const Vue = require('vue');
const firebase = require('firebase');
// const page = require('page');
// const PubSub = require('./pubsub');

const PASS = '123456';
const SALT = 'salt';

Vue.component('header-login', {
    replace: false,
    template: document.querySelector('#header-login-template').innerHTML,
    props: ['name', 'avatar', 'email']
});

const model = new Vue({
    el: '#app-root',

    data: {
        user: null,
        hasSomeLoginState: false
    },

    computed: {
        isUserLoggedIn: function () {
            return this.user && this.user.uid;
        }
    },

    ready: () => {
        document.querySelector('#app-root').style.display = 'block';
    },

    methods: {
        setUser: (user) => {
            model.user = user;
            model.hasSomeLoginState = true;

            if (user) {
                const dbref = firebase.database().ref(`users/${model.user.uid}/salt`);
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
        }
    }
});

firebase.initializeApp({
    apiKey: "AIzaSyAvdrVPo0WJMIA1qkMVz4_Ul_vDDPmJCGc",
    authDomain: "passwords-b6edd.firebaseapp.com",
    databaseURL: "https://passwords-b6edd.firebaseio.com",
    storageBucket: "passwords-b6edd.appspot.com",
});

firebase.auth().onAuthStateChanged(model.setUser);

const asmCrypto = require('asmcrypto.js');

const encrypt = (text, salt, password) => {
    const key = asmCrypto.PBKDF2_HMAC_SHA256.hex(password, salt, 10, 16);
    const buf = asmCrypto.AES_CBC.encrypt(text, key);
    return String.fromCharCode.apply(null, buf);
};

const decrypt = (text, salt, password) => {
    const key = asmCrypto.PBKDF2_HMAC_SHA256.hex(password, salt, 10, 16);
    const buf = asmCrypto.AES_CBC.decrypt(text, key);
    return String.fromCharCode.apply(null, buf);

};

// console.log(asmCrypto.SHA256.hex("The quick brown fox jumps over the lazy dog"));
//
// const key = asmCrypto.PBKDF2_HMAC_SHA256.hex('key', 'salt', 10, 16);
// const x = asmCrypto.AES_CBC.encrypt('data', key);
// const y = asmCrypto.AES_CBC.decrypt(x, key);
//
// console.log(y);
// console.log('WWWW', String.fromCharCode.apply(null, y));
//
//
// console.log([100, 97, 116, 97].map(s => String.fromCharCode(s)).join(''));
// console.log(y.map(s => String.fromCharCode(s)).join(''));
//
// console.log(x, 'QQQ', y.map(c => console.log(String.fromCharCode(c)) || String.fromCharCode(c)));
