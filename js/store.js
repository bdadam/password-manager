import { createStore } from 'redux';

var state = {
    user: { uid: 123, photoURL: 'url', displayName: 'name' },
    vaults: [
        { id: 456, title: 'vault title', secrets: ['secret', 'secret', '...'], password: 'n/a' }
    ]
};

const makeUser = function({ uid, photoURL, displayName, email }) {
    return {
        uid,
        photoURL,
        displayName,
        email
    };
};

const uuid = () => {
    // http://stackoverflow.com/a/2117523
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

const defaultState = {
    user: {},
    vaults: [
        { id: uuid(), name: 'Default Vault', secrets: ['jsdkfjsdklf', 'sdfiusoifusfisud'] }
    ]
};

const store = createStore((state = defaultState, action) => {
    switch (action.type) {
        case 'auth-state-changed':
            return Object.assign({}, state, { user: makeUser(action.user || {}) });
        case 'vault-created':
            break;
        case 'vault-removed':
            break;
        case 'vault-changed':
            break;
        case 'restore-from-local-db':
            break;
        case 'db-sync':
            break;
        default:
            return state;
    }
});

export default store;
