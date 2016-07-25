import { createStore } from 'redux';
import { firebase } from './firebase';

import localforage from 'localforage';

// const store = createStore((state = {}, action) => {
//     return state;
// });

import store from './store';

const datastore = localforage.createInstance({ name: "brick-password-manager" });

const app = {
    init() {
        firebase.auth().onAuthStateChanged(user => console.log('User', user));
        firebase.auth().onAuthStateChanged(user => {
            // datastore.setItem('user', { uid: user.uid, photoURL: user.photoURL, displayName: user.displayName, email: user.email }).then(() => store.dispatch({ type: 'auth-state-changed', user }));
            store.dispatch({ type: 'auth-state-changed', user });
        });

        store.subscribe(() => {
            const state = store.getState();
            datastore.setItem('user', state.user);
            // datastore.setItem('vaults', state.vaults);
        });
    },

    user: {
        login() {
            var authProvider = new firebase.auth.GithubAuthProvider();
            authProvider.addScope('user');
            firebase.auth().signInWithRedirect(authProvider);

            // set up local datastore
        },
        logout() {
            firebase.auth().signOut();
            // delete local datastore
        }
    },

    vaults: {
        create(vaultid, value) {},
        update(vaultid, value) {},
        remove(vaultid) {}
    },

    secrets: {
        create(secretid, vaultid, value) {},
        update(secretid, vaultid, value) {},
        remove(secretid) {}
    },

    subscribe(fn) {},
    getState() {}
};

app.init();

export default app;
