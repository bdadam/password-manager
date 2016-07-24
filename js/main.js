'use strict';

const $ = require('cash-dom');
const Vue = require('vue');
// const firebase = require('firebase');
const firebase = window.firebase;
const localforage = require('localforage');
const page = require('page');
// const PubSub = require('./pubsub');

import { encrypt, decrypt } from './crypto.js';
import Vault from './vault.js';


localforage.config({ name: 'brick-password-manager' });

import store from './store';

// localforage.clear();


const PASS = '123456';
const SALT = 'salt';

Vue.component('header-login', {
    replace: false,
    template: require('../templates/header-login.html'),
    props: ['name', 'avatar', 'email']
});

Vue.component('vault-view', {
    replace: false,
    template: require('../templates/vault-view.html'),
    props: ['vaultid'],

    data: () => ({ vault: null, password: '', decryptedSecrets: [] }),

    methods: {
        initialize() {},
        add() { console.log('add'); },
        remove() { console.log('remove'); },
        reveal() {},
        edit() {},
        copyToClipboard() {},

        lock() {},
        unlock() {}
    },

    computed: {
        vault() {
            const state = store.getState();
            const f = state.vaults.filter(v => v.id === this.vaultid);
            return f[0];
        },

        decryptedSecrets() {
            return [
                { username: 'user1', password: 'password1', description: 'description' },
                { username: 'user2', password: 'password2', description: 'description' },
                { username: 'user3', password: 'password3', description: 'description' },
                { username: 'user4', password: 'password4', description: 'description' },
                { username: 'user5', password: 'password5', description: 'description' }
            ]
        }
    }
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

// const store = require('./store');

const model = new Vue({
    el: '#app-root',

    data: {
        user: null,
        vaults: []
    },

    init() {
    },

    ready: () => {
        document.querySelector('#app-root').style.display = 'block';
    },

    computed: {
        isUserLoggedIn () {
            return this.user && this.user.uid;
        },

        currentVault() {
            return this.vaults[0] || { title: 'default' };
        }
    },

    methods: {
        loginWithGitHub() {
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

page('/', (ctx, next) => {
    console.log(ctx);
});

page('/vaults/:id', (ctx, next) => {
    console.log(ctx);
});

page({});

store.subscribe(() => {
    const state = store.getState();
    model.user = state.user;
    model.vaults = state.vaults;
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


//
// const rf = firebase.database().ref('user-passwords/STxWl9QwIwWIwVpm9Z1fDmmdtju1');
// rf.once('value', snap => {
//     console.log(snap.val());
// });

// firebase.auth().onAuthStateChanged(model.setUser);
firebase.auth().onAuthStateChanged(user => {
    store.dispatch({ type: 'auth-state-changed', user });
});
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


//
// const sjcl = require('sjcl');
//
// var saltBits = sjcl.random.randomWords(8);
// var derivedKey = sjcl.misc.pbkdf2("password", saltBits, 1000, 256);
// var key = sjcl.codec.base64.fromBits(derivedKey);
//
// var rp = {};
// // sjcl.encrypt(key, 'text', { iv: sjcl.random.randomWords(8) }, rp)
// const res = sjcl.encrypt('password', 'text', { ks: 256, mode: 'gcm', adata: 'qwe' });
// console.log(1, res, typeof(res));
//
// const res1 = JSON.parse(res);
// console.log(1.5, res1);
//
// // res1.adata = 'wqweqwe';
//
// // const res2 = sjcl.decrypt('password', res);
// const res2 = sjcl.decrypt('password', JSON.stringify(res1));
// console.log(2, res2);

// console.time('asdf');
// for (var i = 0; i < 10; i++) {
//     var saltBits = sjcl.random.randomWords(8);
//     var derivedKey = sjcl.misc.pbkdf2("password", saltBits, 1000, 256);
//     var key = sjcl.codec.base64.fromBits(derivedKey);
//     sjcl.encrypt('skldifjuisoufo8s78f8s7f897s98', 'fsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsdfsifopsipfs89f89s08fsfjsjfklsjflks89fs89df678sd6fysudifsdjfsd', { ks: 256, mode: 'gcm' });
// }
//
// console.timeEnd('asdf');
