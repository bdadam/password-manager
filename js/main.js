'use strict';

const $ = require('cash-dom');
const Vue = require('vue');
const page = require('page');

import { encrypt, decrypt } from './crypto.js';
import Vault from './vault.js';


import store from './store';
import { firebase } from './firebase';

import once from 'lodash/once';
// import once from 'lodash';


import app from './app';

const PASS = '123456';
const SALT = 'salt';

import uuid from './uuid';

Vue.component('app-header', {
    replace: false,
    template: require('../templates/app-header.html'),

    data() {
        return { user: null };
    },

    created() {
        this.user = firebase.auth().currentUser;
        firebase.auth().onAuthStateChanged(user => this.user = user);
    },

    methods: {
        logout() { firebase.auth().signOut(); }
    }
});

// Screens:
// - create vault
// - edit vault
// - unlock vault (provide password)
// - vault content (list of secrets)
// - edit secret / detail view

Vue.component('app-main', {
    replace: false,
    template: require('../templates/app-main.html'),
    data() {
        return {
            vaults: {},
            vaultsLoading: false
        };
    },

    created() {
        this.vaultsLoading = true;
        const uid = firebase.auth().currentUser.uid;
        const dbref = firebase.database().ref(`users/${uid}/vaults-test`);
        dbref.on('value', snap => {
            console.log(snap.val());
            this.vaults = snap.val();
            this.vaultsLoading = false;
        });
    },

    methods: {
        createVault() {
            const uid = firebase.auth().currentUser.uid;
            const id = uuid();
            const dbref = firebase.database().ref(`users/${uid}/vaults-test/${id}`);
            dbref.set({ name: 'Test name', id, meta: { created: firebase.database.ServerValue.TIMESTAMP }, secrets: [] })
                    .then(x => console.log(x))
                    .catch(e => console.error(e));
        },

        removeVault(id) {
            const uid = firebase.auth().currentUser.uid;
            const dbref = firebase.database().ref(`users/${uid}/vaults-test/${id}`);
            dbref.remove();
        }
    }
});

Vue.component('vault-view', {
    replace: false,
    template: require('../templates/vault-view.html'),
    props: ['vaultid'],

    data: () => ({ vault: null, password: '', decryptedSecrets: [] }),

    methods: {
        initializeVault(initPassword) { console.log(initPassword); },
        add() { console.log('add'); },
        remove() { console.log('remove'); },
        reveal() {},
        edit() {},
        copyToClipboard() {},
        filter() {},

        lock() {},
        unlock() {}
    },

    computed: {
        vault() {
            const state = store.getState();
            const f = state.vaults.filter(v => v.id === this.vaultid);
            return f[0];
        },

        vaultLocked() {
            return this.vault.hasPassword && true;
        },

        vaultOpen() {
            return false;
        },

        decryptedSecrets() {
            return [
                { title: 'title1234', username: 'user1', password: 'password1', description: 'description', tags: ['asdf', 'qwe', 'sfsdf', 'abc'] },
                { title: 'title1234', username: 'user2', password: 'password2', description: 'description', tags: ['asdf', 'qwe', 'sfsdf', 'abc'] },
                { title: 'title1234', username: 'user3', password: 'password3', description: 'description', tags: ['asdf', 'qwe', 'sfsdf', 'abc'] },
                { title: 'title1234', username: 'user4', password: 'password4', description: 'description', tags: ['asdf', 'qwe', 'sfsdf', 'abc'] },
                { title: 'title1234', username: 'user5', password: 'password5', description: 'description', tags: ['asdf', 'qwe', 'sfsdf', 'abc'] }
            ]
        }
    }
});

Vue.component('modal-window', {
    replace: false,
    template: '<div transition="modal" @click.self="close"><div style="background-color: #fff; max-width: 300px; height: 300px; width: 100%;"><slot></slot></div></div>',
    methods: {
        close() {
            this.$emit('close');
        }
    }
});

Vue.component('login-screen', {
    replace: false,
    template: require('../templates/login-screen.html'),
    methods: {
        login(provider) {
            var authProvider = new firebase.auth[`${provider}AuthProvider`]();
            firebase.auth().signInWithRedirect(authProvider);
        }
    }
});

const model = new Vue({
    el: '#app-root',

    data: {
        user: null,
        vaults: [],
        store,
        currentVaultId: null,
        showModal: false,

        starting: true,
        currentview: ''
    },

    ready() {
        firebase.auth().getRedirectResult().catch(ex => {
            // todo: log exception to GA
        }).then(() => {
            firebase.auth().onAuthStateChanged(user => {
                this.starting = false;

                if (user && user.uid) {
                    this.currentview = 'app-main';
                } else {
                    this.currentview = 'login-screen';
                }
            });
        });
    },

    computed: {

        currentVault() {
            return this.vaults[0] || { title: 'default' };
        },

        tabs() {
            const tabs = this.vaults.map(vault => ({ text: vault.name, href: `/vaults/${vault.id}`, title: '', classes: this.currentVaultId === vault.id ? 'tab active' : 'tab' }));
            tabs.push({ text: '+ New vault', href: '/vaults/new', title: '', classes: 'tab' });
            tabs.push({ text: 'Settings', href: '/vaults/settings', title: '', classes: 'tab' });
            return tabs;
        }
    },

    methods: {
        createSecret: () => {
            console.log('create secret');

            const dbref = firebase.database().ref(`user-passwords/${model.user.uid}`);
            dbref.on('value', x => {
                console.log(x.val());
            });

            dbref.push(encrypt(JSON.stringify({ asdf: 'qwe_' + Math.random() }), SALT, PASS));
        },

        // sync: () => {
        //     const dbref = firebase.database().ref(`user-passwords/${model.user.uid}`);
        //
        //     dbref.once('value', snap => {
        //         snap.forEach(x => {
        //             const encryptedVal = x.val();
        //             const realVal = decrypt(encryptedVal, SALT, PASS);
        //             const id = x.key;
        //             const obj = JSON.parse(realVal);
        //             console.log(id, encryptedVal, realVal, obj);
        //         });
        //     });
        // }
    }
});

page('/', (ctx, next) => {
    // console.log(ctx);
});


page('/vaults/new', (ctx, next) => {
    console.log('new vault');
});

page('/vaults/:id', (ctx, next) => {
    console.log('vaultid:', ctx.params.id);
    model.currentVaultId = ctx.params.id;
});

page({});

store.subscribe(() => {
    const state = store.getState();
    model.user = state.user;
    model.vaults = state.vaults;
});



// window.jwtdecode = require('jwt-decode');

// firebase.auth().signInWithCredential(firebase.auth.GithubAuthProvider.credential('a5684313144fa64eb3e3aeac9e6ad077b94f3588'))

// firebase.initializeApp({
//     apiKey: "AIzaSyAvdrVPo0WJMIA1qkMVz4_Ul_vDDPmJCGc",
//     authDomain: "passwords-b6edd.firebaseapp.com",
//     databaseURL: "https://passwords-b6edd.firebaseio.com",
//     storageBucket: "passwords-b6edd.appspot.com",
// });


// firebase.database().ref(`users/STxWl9QwIwWIwVpm9Z1fDmmdtju1`).once('value', s => {
//     console.log(s.val());
// });


//
// const rf = firebase.database().ref('user-passwords/STxWl9QwIwWIwVpm9Z1fDmmdtju1');
// rf.once('value', snap => {
//     console.log(snap.val());
// });

// firebase.auth().onAuthStateChanged(model.setUser);
// firebase.auth().onAuthStateChanged(user => store.dispatch({ type: 'auth-state-changed', user }));
// firebase.auth().onAuthStateChanged(user => console.log(user));
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
