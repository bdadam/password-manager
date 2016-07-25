import localforage from 'localforage';

const firebase = window.firebase;

const datastore = localforage.createInstance({ name: "brick-password-manager" });


const init(done) => {
    return Promise.all([
        datastore.getItem('user'),
        datastore.getItem('vaults')
    ]).then(results => {
        const user = results[0];
        const vaults = results[1];
        done({ user, vaults });
    });
};
