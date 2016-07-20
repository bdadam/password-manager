const asmCrypto = require('asmcrypto.js');

// import asmCrypto from 'asmCrypto.js';

export const encrypt = (data, password) => {
    return {
        text: encodeURIComponent(JSON.stringify(data)),
        salt: 'salt',
        iv: 1
    };
};

export const decrypt = (encryptedData, password) => {
    // encryptedData.salt
    // encryptedData.iv
    return JSON.parse(decodeURIComponent(encryptedData.text));
};

// export const encrypt = (data, password, salt, iv) => {
//     return encodeURIComponent(JSON.stringify(data));
// };
//
// export const decrypt = (data, password, salt, iv) => {
//     return JSON.parse(decodeURIComponent(data));
// };
//


// const encrypt = (text, salt, password) => {
//     const key = asmCrypto.PBKDF2_HMAC_SHA256.hex(password, salt, 10, 16);
//     const buf = asmCrypto.AES_CBC.encrypt(encodeURIComponent(text), key);
//     return String.fromCharCode.apply(null, buf);
//     // return ab2str(buf);
// };
//
// const decrypt = (text, salt, password) => {
//     const key = asmCrypto.PBKDF2_HMAC_SHA256.hex(password, salt, 10, 16);
//     const buf = asmCrypto.AES_CBC.decrypt(text, key);
//     return decodeURIComponent(String.fromCharCode.apply(null, buf));
//     // return ab2str(buf);
// };


// const asmCrypto = require('asmcrypto.js');

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/btoa
// http://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers

// ucs-2 string to base64 encoded ascii
function utoa(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}
// base64 encoded ascii to ucs-2 string
function atou(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

// const encrypt = (text, salt, password) => {
//     const key = asmCrypto.PBKDF2_HMAC_SHA256.hex(password, salt, 10, 16);
//     const buf = asmCrypto.AES_CBC.encrypt(encodeURIComponent(text), key);
//     return String.fromCharCode.apply(null, buf);
//     // return ab2str(buf);
// };
//
// const decrypt = (text, salt, password) => {
//     const key = asmCrypto.PBKDF2_HMAC_SHA256.hex(password, salt, 10, 16);
//     const buf = asmCrypto.AES_CBC.decrypt(text, key);
//     return decodeURIComponent(String.fromCharCode.apply(null, buf));
//     // return ab2str(buf);
// };

// const z = 'úsdőfúőáséfáéÉ:)';
    // const z = 'I \u2661 Unicode!';
    // const x = encrypt(z, SALT, PASS);
    // const y = decrypt(x, SALT, PASS);
    // console.log(z, y);
    // console.log(6, z === y);

// console.log(asmCrypto.SHA256.hex("The quick brown fox jumps over the lazy dog"));
//
// const key = asmCrypto.PBKDF2_HMAC_SHA256.hex('key', 'salt', 10, 16);
// const x = asmCrypto.AES_CBC.encrypt('data', key);
// const y = asmCrypto.AES_CBC.decrypt(x, key);
//
// console.log(y);
// console.log('WWWW', String.fromCharCode.apply(null, y));
//
//
// console.log([100, 97, 116, 97].map(s => String.fromCharCode(s)).join(''));
// console.log(y.map(s => String.fromCharCode(s)).join(''));
//
// console.log(x, 'QQQ', y.map(c => console.log(String.fromCharCode(c)) || String.fromCharCode(c)));
