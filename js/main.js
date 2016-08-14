'use strict';

const $ = require('cash-dom');
const Vue = require('vue');
const page = require('page');

// import { encrypt, decrypt } from './crypto.js';
// import Vault from './vault.js';


import { firebase } from './firebase';
import store from './store';
import once from 'lodash/once';
// import once from 'lodash';


// import app from './app';

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

import { default as registerFilters } from './filters';

registerFilters(Vue);
//
// console.log(document.hidden);
//  document.addEventListener('visibilitychange', e => {
//     console.log(document.hidden);
//  });

// Screens:
// - create vault
// - edit vault
// - unlock vault (provide password)
// - vault content (list of secrets)
// - edit secret / detail view

Vue.component('vault-list', {
    replace: false,
    props: ['store', 'vaults'],
    template: require('../templates/vault-list.html'),

    created() {
        this.vaults = this.store.getState().vaults;
        this.store.subscribe(() => {
            this.vaults = this.store.getState().vaults;
        });
    }
});

Vue.component('vault-details', {
    replace: false,
    data() {
        return { state: null, vault: null, password: null, isPasswordCorrect: false }
    },
    props: ['vaultid', 'store'],
    template: require('../templates/vault-details.html'),
    created() {
        this.store.subscribe(() => {
            console.log('sub');
            this.state = this.store.getState();
            this.vault = this.state.vaults[this.vaultid];
        });

        this.state = this.store.getState();
        this.vault = this.state.vaults[this.vaultid];

        // const state = this.store.getState();
        // this.vaultid = state.selectedVaultId;
    },
    ready() {
        console.log('ready');
        if (this.state) {
            this.vault = this.state.vaults[this.vaultid];
        }
        // const state = this.store.getState();
        // this.vault = state.vaults[this.vaultid];
    },
    computed: {
        // vault() {
        //     console.log('comp vault');
        //     return this.state.vaults[this.vaultid];
        // },
        //
        // secrets() {
        //     return [];
        //
        //     const state = this.store.getState();
        //     // const vault = state.vaults[this.vaultid];
        //     const secrets = state.secrets.filter(s => s.vaultid === this.vaultid);
        //
        //     return secrets;
        // }
    },

    methods: {
        checkPassword() {
            const decrypt = (data, pw) => data;
            this.isPasswordCorrect = decrypt(this.vault.test, this.password) === 'test';
        }
    }
});

Vue.component('prompt-vault-create', {
    replace: false,
    template: require('../templates/prompt-vault-create.html'),
    data() {
        return {
            name: '',
            password: '',
            passwordConfirm: '',
            nameIsValid: true,
            passwordIsValid: true,
            passwordsMatch: true
        };
    },
    methods: {
        validate() {
            this.nameIsValid = !!this.name;
            this.passwordsMatch = this.password === this.passwordConfirm;
            this.passwordIsValid = !!this.password;

            return this.nameIsValid && this.passwordsMatch && this.passwordIsValid;
        },
        create() {
            if (this.validate()) {
                this.$emit('vaultcreated', { name: this.name, password: this.password });
            }
        },
        cancel() {
            this.$emit('cancel');
        }
    }
});

Vue.component('prompt-vault-unlock', {
    replace: false,
    template: require('../templates/prompt-vault-unlock.html')
});

Vue.component('app-main', {
    replace: false,
    template: require('../templates/app-main.html'),
    props: ['store', 'view', 'params'],
    data() {
        return {
            vaults: {},
            vaultsLoading: false,
            history: [],
            store,
            currentVaultId: '',
            prompt: ''
        };
    },

    created() {
        this.store.subscribe(() => {
            const state = this.store.getState();
            this.currentVaultId = state.selectedVaultId;

            this.vaults = state.vaults;
        });
    },

    methods: {
        openPrompt(prompt) {
            this.prompt = prompt;
        },

        closePrompt() {
            this.prompt = '';
        },

        vaultcreated(data) {
            this.closePrompt();

            const name = data.name;
            const password = data.password;
            const uid = firebase.auth().currentUser.uid;
            const id = uuid();
            const dbref = firebase.database().ref(`users/${uid}/vaults-test/${id}`);
            dbref.set({ name, id, created: firebase.database.ServerValue.TIMESTAMP, secrets: [] })
                    .catch(e => console.error(e))

            page(`/vaults/${id}`);
        },

        openVault(id) {
            this.openPrompt('vault-unlock-password');
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
    template: '<div transition="modal" @click.self="close"><div class="modal-window"><slot></slot></div></div>',
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
        currentview: '',
        store,
        view: '',
        viewParams: {}
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

        store.subscribe(() => {
            const state = store.getState();
            this.user = state.user;
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
        openView(view, params) {
            this.view = view;
            this.viewParams = params;
        },

        // createSecret: () => {
        //     console.log('create secret');
        //
        //     const dbref = firebase.database().ref(`user-passwords/${model.user.uid}`);
        //     dbref.on('value', x => {
        //         console.log(x.val());
        //     });
        //
        //     dbref.push(encrypt(JSON.stringify({ asdf: 'qwe_' + Math.random() }), SALT, PASS));
        // },

        logout() { firebase.auth().signOut(); }
    }
});

page('/', (ctx, next) => {
    model.openView('vault-list');
});

page('/vaults', (ctx, next) => {
    model.openView('vault-list');
});

page('/vaults/:id', (ctx, next) => {
    model.openView('vault-details', { vaultid: ctx.params.id });
});

page('*', (ctx, next) => {
    console.log('unknown page');
});

page({});

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
