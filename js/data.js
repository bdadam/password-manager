import uuid from './uuid';
import { firebase } from './firebase';

const vault = {
    create(name, meta, password) {
        const id = uuid();
        const uid = firebase.auth().currentUser.uid;
        const dbref = firebase.database().ref(`users/${uid}/vaults-test/${id}`);
        return dbref.set({ name, id, created: firebase.database.ServerValue.TIMESTAMP, secrets: '' });
                // .then(x => console.log(x))
                // .catch(e => console.error(e))
                // .then(() => this.navigate(`/vaults/${id}`));

        // return id;
    },

    remove(id) {
        const uid = firebase.auth().currentUser.uid;
        const dbref = firebase.database().ref(`users/${uid}/vaults-test/${id}`);
        return dbref.remove();
    },

    // upsertSecret(vaultid, )

};

const secret = {
    create(data, password) {},
    update(id, data, password) {},
    remove(id) {}
};

export { vault, secret };

// vault.create('Name', 'password');
// vault.update('id', { name: 'New Name', description: 'Some description' });
// vault.changePassword(id, oldPassword, newPassword);

// secrets.create('vaultid', 'vaultpassword', { name: 'some name', username: 'username', password: 'asdfg1234' });
// secrets.update('vaultid', 'vaultpassword', 'secretid', { name: 'some name', username: 'username', password: 'asdfg1234' });
// secrets.update('secretid', 'vault-password', { name: 'some name', username: 'username', password: 'asdfg1234' });
