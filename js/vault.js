class Secret {
    constructor({ id, username, password, comment }) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.comment = comment;
    }

    // static
}

class EncryptedSecret {
    constructor({ id, salt, iv,  text }) {
        this.id = id;
        this.salt = salt;
        this.iv = iv;
        this.text = text;
    }

    decrypt(password) {

    }
}

class Vault {
    constructor({ id = 1, title = 'Default vault', salt = null, iv = null, secrets = [] }) {
        this.id = id;
        this.title = title;
        this.salt = salt;
        this.iv = iv;
        this.secrets = secrets;
        this.decryptedSecrets = [];
    }

    get isInitialized() {
        return this.salt && this.iv;
    }

    open(password) {
        // const decrypt = x => x;
        // const encrypt = x => x;
        this.decryptedSecrets = this.secrets.map(secret = decrypt(secret, password, this.salt, this.iv));

        this.addSecret = secret => {
            this.secrets.push(encrypt(secret, password, this.salt, this.iv));

        }
    }

    lock() {
        this.decryptedSecrets.length = 0;
    }

    // add(secret) {
    //     const encrypt = x => x;
    //     this.secrets.push(encrypt(secret))
    // }

    serialize() {
        return {
            id: this.id,
            title: this.title,
            salt: this.salt,
            iv: this.iv,
            secrets: this.secrets
        };
    }

    remove() {
        
    }
}

export default Vault;
