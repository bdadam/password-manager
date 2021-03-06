import { createStore } from 'redux';

const defaultState = {
    starting: true,
    user: undefined,
    vaults: {},
    secrets: undefined,
    selectedVaultId: null,
    passwords: {},
};

const store = createStore((state = defaultState, action) => {
    switch(action.type) {
        case 'user-changed':
            return Object.assign({}, state, { starting: false }, { user: action.user });
        case 'vaults-changed':
            return Object.assign({}, state, { starting: false }, { vaults: action.vaults });
        case 'secrets-changed':
            return Object.assign({}, state, { starting: false }, { secrets: action.secrets });
        case 'select-vault':
            return Object.assign({}, state, { starting: false }, { selectedVaultId: action.id });
        case 'select-secret':
            return Object.assign({}, state, { starting: false }, { selectedSecretId: action.id });

        // case 'open-vault':
        //     return Object.assign({}, state, { starting: false }, { passwords: Object.assign({}, state.passwords, { [action.vaultid]: action.password }) });
        default:
            return state;
    }
});

firebase.auth().getRedirectResult().catch(ex => {
    // todo: log exception to GA
}).then(() => {
    firebase.auth().onAuthStateChanged(user => {
        store.dispatch({ type: 'user-changed', user });
    });
});

const subscribeToDbChanges = uid => {
    const vaultsDbref = firebase.database().ref(`users/${uid}/vaults-test`).orderByChild('created');

    vaultsDbref.on('value', snap => {
        const vaults = {};
        snap.forEach(o => {
            vaults[o.key] = o.val();
        });

        store.dispatch({ type: 'vaults-changed', vaults });
    });

    const secretsDbref = firebase.database().ref(`users/${uid}/secrets-test`).orderByChild('created');
    secretsDbref.on('value', snap => {
        const secrets = {};
        snap.forEach(o => {
            secrets[o.key] = o.val();
        });

        store.dispatch({ type: 'secrets-changed', secrets });
    });
};

var dbuid;
store.subscribe(() => {
    const state = store.getState();

    if (state.user && state.user.uid) {
        if (dbuid !== state.user.uid) {
            dbuid = state.user.uid;
            subscribeToDbChanges(dbuid);
        }
    }
});

const v = {
    name: 'PUBLIC',
    created: 'PUBLIC',
    secrets: [{ created: 'PUBLIC', text: 'PRIVATE' }]
};

const vaultStore = createStore((state = { vaults: {}, passwords: {}, decryptedVaults: {} }, action) => {
    switch (action.type) {
        case 'load-vaults':
            return Object.assign({}, state, { passwords: {}, vaults: action.vaults, encryptedVaults: {} });
        case 'unlock-vault':



            // const decryptedVault = decryptVault(state.vaults[action.id], password);


            return Object.assign({}, state, {
                passwords: Object.assign({}, state.passwords, { [action.id]: action.password }),
                decryptedVaults: Object.assign({}, state.decryptedVaults, { [action.id]: state.vaults[action.id] })
            });


            const vault = state.vaults[action.id];
            const pw = action.password;
            const decrypt = x => decodeURIComponent(x);
            const decryptedSecrets = vault.encryptedSecrets.map(decrypt);

            const vaults = Object.assign(state.vaults);
            vaults[action.id].password = action.password;
            vaults[action.id].decryptedSecrets = vaults[action.id].encryptedSecrets.map(decrypt);

            return Object.assign({}, state, { vaults });

            // return Object.assign({}, state, { vaults: { [action.id]:  }});
        // case 'lock-vault':
        //     const vaults = Object.assign({}, state.vaults);
        //     vaults[action.id].password = '';
        //     vaults[action.id].decryptedSecrets = null;
        //     return Object.assign({}, state);
        default:
            return state;
    }
});


// const s = createStore((state = {}, action) => {
//     switch (action.type) {
//         case 'x':
//             return Object.assign({}, state);
//         case 'e':
//             throw new Error('BUMM');
//         default:
//             return state;
//     }
// });
//
// s.dispatch({ type: 'x' });
//
// try {
//     s.dispatch({ type: 'e' });
// } catch(e) {
//     console.warn(e);
// }

//
// var state = {
//     user: { uid: 123, photoURL: 'url', displayName: 'name' },
//     vaults: [
//         { id: 456, title: 'vault title', secrets: ['secret', 'secret', '...'], password: 'n/a' }
//     ]
// };
//
// const makeUser = function({ uid, photoURL, displayName, email }) {
//     return {
//         uid,
//         photoURL,
//         displayName,
//         email
//     };
// };
//
// const uuid = () => {
//     // http://stackoverflow.com/a/2117523
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//         var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
//         return v.toString(16);
//     });
// }
//
// const defaultState = {
//     user: null,
//     vaults: [
//         { id: uuid(), name: 'Default Vault', hasPassword: false, secrets: [] },
//         { id: uuid(), name: 'Personal secrets', hasPassword: false, secrets: [] },
//         { id: uuid(), name: 'Company secrets', hasPassword: false, secrets: [] }
//     ]
// };
//
// const store = createStore((state = defaultState, action) => {
//     switch (action.type) {
//         case 'auth-state-changed':
//             return Object.assign({}, state, { user: makeUser(action.user || {}) });
//         case 'vault-created':
//             break;
//         case 'vault-removed':
//             break;
//         case 'vault-changed':
//             break;
//         case 'restore-from-local-db':
//             break;
//         case 'db-sync':
//             break;
//         default:
//             return state;
//     }
// });
//

export default store;
