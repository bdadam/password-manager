import * as sjcl from 'sjcl';
import uuid from './uuid';
import { createStore } from 'redux';

import omit from 'lodash/omit';
// import { omit } from 'lodash-es/omit';

const encrypt = (obj, password) => {
    return sjcl.encrypt(password, encodeURIComponent(JSON.stringify(obj)), { ks: 256, mode: 'gcm' });
};

const decrypt = (text, password) => {
    return JSON.parse(decodeURIComponent(sjcl.decrypt(password, text)));
};

export const checkPassword = (vault, password) => {
    return vault.id && vault.id === decrypt(vault.encryptedid, password);
};

export const changePassword = (vault, oldPassword, newPassword) => {
    return {};
};

export const create = (name, password) => {
    const id = uuid();

    return {
        id,
        name,
        version: 1,
        encryptedid: encrypt(id, password),
        secrets: []
    };
};
//
// export const addSecret = (vault, secret, password) => {
//     const id = uuid();
//     // const encryptedSecret =
//     return Object.assign({}, vault, { secrets: vault.secrets });
// };
//
// export const removeSecret = (vault, secret) => {
//     return Object.assign({}, vault, { secrets: vault.secrets.filter(s => s.id === secret.id) });
// };

export const vaultStore = createStore((state = {}, action) => {
    switch (action.type) {
        case 'load-vaults':
            return Object.assign({}, state, { vaults: action.vaults });

        case 'create-vault':
            const id = uuid();
            const vault = {
                version: 1,
                name: action.name,
                encryptedid: encrypt(id, action.password),
                secrets: {}
            };

            const vaults = Object.assign({}, state.vaults, { [id]: vault } );

            return Object.assign({}, state, { vaults });

        case 'remove-vault':
            return Object.assign({}, { vaults: omit(state.vaults, action.id) });

        case 'add-secret':
            // return Object.assign({}, {
            //     vaults: Object.assign({}, state.vaults, {
            //         [action.vaultid]: Object.assign({}, state.vaults[action.vaultid])
            //     })
            // });
            return state;

        case 'remove-secret':
            return state;

        default:
            return state;
    }
});


vaultStore.dispatch({ type: 'create-vault', name: 'qwe3', password: 'password' });
vaultStore.dispatch({ type: 'create-vault', name: 'qwe4', password: 'password' });

vaultStore.dispatch({ type: 'load-vaults', vaults: {"53618129-be51-450c-bf56-3c6d53d3f5c6":{"version":1,"name":"qwe","encryptedid":"{\"iv\":\"xu1QQNaAbSeXjoa0DGhe/Q==\",\"v\":1,\"iter\":1000,\"ks\":256,\"ts\":64,\"mode\":\"gcm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"XW2yq2ngKao=\",\"ct\":\"io9kFK2nNFJktv6b03fzuaeKmKw7VWv++nK1ozc/Ya5Mdv5IIpHms42f5qPZqg3a0wk=\"}","secrets":{}},"ed654abb-0c02-48cf-a73e-448c7e2d6c9a":{"version":1,"name":"qwe2","encryptedid":"{\"iv\":\"JMuZqtiTVHGGTDARz6Odfg==\",\"v\":1,\"iter\":1000,\"ks\":256,\"ts\":64,\"mode\":\"gcm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"XW2yq2ngKao=\",\"ct\":\"wFHaag+iM0wvKwWpMucj3+AzI5I260WRCxHO39FhWnRbF4jkCxcsCdazqbC8UNHy/Wc=\"}","secrets":{}}} });
vaultStore.dispatch({ type: 'remove-vault', id: '53618129-be51-450c-bf56-3c6d53d3f5c6'});

vaultStore.dispatch({ type: 'add-secret', vaultid: 'ed654abb-0c02-48cf-a73e-448c7e2d6c9a', secret: { username: 'user', password: 'password' }});

console.log(vaultStore.getState());
Object.keys(vaultStore.getState().vaults).forEach(id => {
    console.log(decrypt(vaultStore.getState().vaults[id].encryptedid, 'password'));
})
