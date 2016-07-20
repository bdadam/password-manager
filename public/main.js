/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _crypto = __webpack_require__(1);
	
	var _vault = __webpack_require__(3);
	
	var _vault2 = _interopRequireDefault(_vault);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var $ = __webpack_require__(4);
	var Vue = __webpack_require__(5);
	// const firebase = require('firebase');
	var firebase = window.firebase;
	var localforage = __webpack_require__(7);
	// const page = require('page');
	// const PubSub = require('./pubsub');
	
	localforage.config({
	    name: 'brick-password-manager',
	    version: 0.1
	});
	
	var PASS = '123456';
	var SALT = 'salt';
	
	Vue.component('header-login', {
	    replace: false,
	    template: document.querySelector('#header-login-template').innerHTML,
	    props: ['name', 'avatar', 'email']
	});
	
	Vue.component('vault-editor', {
	    replace: false,
	    template: document.querySelector('#vault-editor-template').innerHTML,
	    props: ['vault'],
	
	    methods: {
	        save: function save() {
	            console.log(this.vault.id);
	        }
	    }
	});
	
	var makeUser = function makeUser(_ref) {
	    var uid = _ref.uid;
	    var photoURL = _ref.photoURL;
	    var displayName = _ref.displayName;
	
	    return {
	        uid: uid,
	        photoURL: photoURL,
	        displayName: displayName
	    };
	};
	
	var model = new Vue({
	    el: '#app-root',
	
	    data: {
	        user: null,
	        currentVault: { id: 0 }
	    },
	
	    init: function init() {
	        var _this = this;
	
	        localforage.getItem('user').then(function (user) {
	            _this.setUser(user);
	        });
	    },
	
	
	    ready: function ready() {
	        document.querySelector('#app-root').style.display = 'block';
	    },
	
	    computed: {
	        isUserLoggedIn: function isUserLoggedIn() {
	            return this.user && this.user.uid;
	        }
	    },
	
	    methods: {
	        setUser: function setUser(user) {
	            this.user = user && makeUser(user);
	
	            localforage.setItem('user', this.user);
	
	            if (user) {
	                var dbref = firebase.database().ref('users/' + this.user.uid + '/salt');
	                dbref.set(SALT);
	            }
	        },
	
	
	        loginWithGitHub: function loginWithGitHub() {
	            var p = new firebase.auth.GithubAuthProvider();
	            p.addScope('user');
	            firebase.auth().signInWithRedirect(p);
	        },
	
	        logout: function logout() {
	            firebase.auth().signOut();
	        },
	
	        createSecret: function createSecret() {
	            console.log('create secret');
	
	            var dbref = firebase.database().ref('user-passwords/' + model.user.uid);
	            dbref.on('value', function (x) {
	                console.log(x.val());
	            });
	
	            dbref.push((0, _crypto.encrypt)(JSON.stringify({ asdf: 'qwe_' + Math.random() }), SALT, PASS));
	        },
	
	        sync: function sync() {
	            var dbref = firebase.database().ref('user-passwords/' + model.user.uid);
	
	            dbref.once('value', function (snap) {
	                snap.forEach(function (x) {
	                    var encryptedVal = x.val();
	                    var realVal = (0, _crypto.decrypt)(encryptedVal, SALT, PASS);
	                    var id = x.key;
	                    var obj = JSON.parse(realVal);
	                    console.log(id, encryptedVal, realVal, obj);
	                });
	            });
	
	            // firebase.database().ref(`user-passwords/${model.user.uid}`).push({
	            //     asdf: 'qwe'
	            // });
	        },
	
	        test: function test() {
	            console.log(this);
	            console.log(this === model);
	        }
	    }
	});
	
	firebase.initializeApp({
	    apiKey: "AIzaSyAvdrVPo0WJMIA1qkMVz4_Ul_vDDPmJCGc",
	    authDomain: "passwords-b6edd.firebaseapp.com",
	    databaseURL: "https://passwords-b6edd.firebaseio.com",
	    storageBucket: "passwords-b6edd.appspot.com"
	});
	//
	// firebase.database().ref(`users/STxWl9QwIwWIwVpm9Z1fDmmdtju1`).once('value', s => {
	//     console.log(s.val());
	// });
	
	var rf = firebase.database().ref('user-passwords/STxWl9QwIwWIwVpm9Z1fDmmdtju1');
	rf.once('value', function (snap) {
	    console.log(snap.val());
	});
	
	firebase.auth().onAuthStateChanged(model.setUser);
	// firebase.auth().onAuthStateChanged(user => (user && console.log(user.uid)) || 'null user');
	// firebase.auth().onAuthStateChanged(x => console.log('auth state changed', x));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var asmCrypto = __webpack_require__(2);
	
	// import asmCrypto from 'asmCrypto.js';
	
	var encrypt = exports.encrypt = function encrypt(data, password) {
	    return {
	        text: encodeURIComponent(JSON.stringify(data)),
	        salt: 'salt',
	        iv: 1
	    };
	};
	
	var decrypt = exports.decrypt = function decrypt(encryptedData, password) {
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
	    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
	    var bufView = new Uint16Array(buf);
	    for (var i = 0, strLen = str.length; i < strLen; i++) {
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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! asmCrypto v0.0.11, (c) 2013 Artem S Vybornov, opensource.org/licenses/MIT */
	!function(a,b){function c(){var a=Error.apply(this,arguments);this.message=a.message,this.stack=a.stack}function d(){var a=Error.apply(this,arguments);this.message=a.message,this.stack=a.stack}function e(){var a=Error.apply(this,arguments);this.message=a.message,this.stack=a.stack}function f(a,b){b=!!b;for(var c=a.length,d=new Uint8Array(b?4*c:c),e=0,f=0;c>e;e++){var g=a.charCodeAt(e);if(b&&g>=55296&&56319>=g){if(++e>=c)throw new Error("Malformed string, low surrogate expected at position "+e);g=(55296^g)<<10|65536|56320^a.charCodeAt(e)}else if(!b&&g>>>8)throw new Error("Wide characters are not allowed.");!b||127>=g?d[f++]=g:2047>=g?(d[f++]=192|g>>6,d[f++]=128|63&g):65535>=g?(d[f++]=224|g>>12,d[f++]=128|g>>6&63,d[f++]=128|63&g):(d[f++]=240|g>>18,d[f++]=128|g>>12&63,d[f++]=128|g>>6&63,d[f++]=128|63&g)}return d.subarray(0,f)}function g(a){var b=a.length;1&b&&(a="0"+a,b++);for(var c=new Uint8Array(b>>1),d=0;b>d;d+=2)c[d>>1]=parseInt(a.substr(d,2),16);return c}function h(a){return f(atob(a))}function i(a,b){b=!!b;for(var c=a.length,d=new Array(c),e=0,f=0;c>e;e++){var g=a[e];if(!b||128>g)d[f++]=g;else if(g>=192&&224>g&&c>e+1)d[f++]=(31&g)<<6|63&a[++e];else if(g>=224&&240>g&&c>e+2)d[f++]=(15&g)<<12|(63&a[++e])<<6|63&a[++e];else{if(!(g>=240&&248>g&&c>e+3))throw new Error("Malformed UTF8 character at byte offset "+e);var h=(7&g)<<18|(63&a[++e])<<12|(63&a[++e])<<6|63&a[++e];65535>=h?d[f++]=h:(h^=65536,d[f++]=55296|h>>10,d[f++]=56320|1023&h)}}for(var i="",j=16384,e=0;f>e;e+=j)i+=String.fromCharCode.apply(String,d.slice(e,f>=e+j?e+j:f));return i}function j(a){for(var b="",c=0;c<a.length;c++){var d=(255&a[c]).toString(16);d.length<2&&(b+="0"),b+=d}return b}function k(a){return btoa(i(a))}function l(a){return a-=1,a|=a>>>1,a|=a>>>2,a|=a>>>4,a|=a>>>8,a|=a>>>16,a+=1}function m(a){return"number"==typeof a}function n(a){return"string"==typeof a}function o(a){return a instanceof ArrayBuffer}function p(a){return a instanceof Uint8Array}function q(a){return a instanceof Int8Array||a instanceof Uint8Array||a instanceof Int16Array||a instanceof Uint16Array||a instanceof Int32Array||a instanceof Uint32Array||a instanceof Float32Array||a instanceof Float64Array}function r(a,b){var c=b.heap,d=c?c.byteLength:b.heapSize||65536;if(4095&d||0>=d)throw new Error("heap size must be a positive integer and a multiple of 4096");return c=c||new a(new ArrayBuffer(d))}function s(a,b,c,d,e){var f=a.length-b,g=e>f?f:e;return a.set(c.subarray(d,d+g),b),g}function t(a){a=a||{},this.heap=r(Uint8Array,a).subarray(Xb.HEAP_DATA),this.asm=a.asm||Xb(b,null,this.heap.buffer),this.mode=null,this.key=null,this.reset(a)}function u(a){if(void 0!==a){if(o(a)||p(a))a=new Uint8Array(a);else{if(!n(a))throw new TypeError("unexpected key type");a=f(a)}var b=a.length;if(16!==b&&24!==b&&32!==b)throw new d("illegal key size");var c=new DataView(a.buffer,a.byteOffset,a.byteLength);this.asm.set_key(b>>2,c.getUint32(0),c.getUint32(4),c.getUint32(8),c.getUint32(12),b>16?c.getUint32(16):0,b>16?c.getUint32(20):0,b>24?c.getUint32(24):0,b>24?c.getUint32(28):0),this.key=a}else if(!this.key)throw new Error("key is required")}function v(a){if(void 0!==a){if(o(a)||p(a))a=new Uint8Array(a);else{if(!n(a))throw new TypeError("unexpected iv type");a=f(a)}if(16!==a.length)throw new d("illegal iv size");var b=new DataView(a.buffer,a.byteOffset,a.byteLength);this.iv=a,this.asm.set_iv(b.getUint32(0),b.getUint32(4),b.getUint32(8),b.getUint32(12))}else this.iv=null,this.asm.set_iv(0,0,0,0)}function w(a){void 0!==a?this.padding=!!a:this.padding=!0}function x(a){return a=a||{},this.result=null,this.pos=0,this.len=0,u.call(this,a.key),this.hasOwnProperty("iv")&&v.call(this,a.iv),this.hasOwnProperty("padding")&&w.call(this,a.padding),this}function y(a){if(n(a)&&(a=f(a)),o(a)&&(a=new Uint8Array(a)),!p(a))throw new TypeError("data isn't of expected type");for(var b=this.asm,c=this.heap,d=Xb.ENC[this.mode],e=Xb.HEAP_DATA,g=this.pos,h=this.len,i=0,j=a.length||0,k=0,l=h+j&-16,m=0,q=new Uint8Array(l);j>0;)m=s(c,g+h,a,i,j),h+=m,i+=m,j-=m,m=b.cipher(d,e+g,h),m&&q.set(c.subarray(g,g+m),k),k+=m,h>m?(g+=m,h-=m):(g=0,h=0);return this.result=q,this.pos=g,this.len=h,this}function z(a){var b=null,c=0;void 0!==a&&(b=y.call(this,a).result,c=b.length);var e=this.asm,f=this.heap,g=Xb.ENC[this.mode],h=Xb.HEAP_DATA,i=this.pos,j=this.len,k=16-j%16,l=j;if(this.hasOwnProperty("padding")){if(this.padding){for(var m=0;k>m;++m)f[i+j+m]=k;j+=k,l=j}else if(j%16)throw new d("data length must be a multiple of the block size")}else j+=k;var n=new Uint8Array(c+l);return c&&n.set(b),j&&e.cipher(g,h+i,j),l&&n.set(f.subarray(i,i+l),c),this.result=n,this.pos=0,this.len=0,this}function A(a){if(n(a)&&(a=f(a)),o(a)&&(a=new Uint8Array(a)),!p(a))throw new TypeError("data isn't of expected type");var b=this.asm,c=this.heap,d=Xb.DEC[this.mode],e=Xb.HEAP_DATA,g=this.pos,h=this.len,i=0,j=a.length||0,k=0,l=h+j&-16,m=0,q=0;this.hasOwnProperty("padding")&&this.padding&&(m=h+j-l||16,l-=m);for(var r=new Uint8Array(l);j>0;)q=s(c,g+h,a,i,j),h+=q,i+=q,j-=q,q=b.cipher(d,e+g,h-(j?0:m)),q&&r.set(c.subarray(g,g+q),k),k+=q,h>q?(g+=q,h-=q):(g=0,h=0);return this.result=r,this.pos=g,this.len=h,this}function B(a){var b=null,c=0;void 0!==a&&(b=A.call(this,a).result,c=b.length);var f=this.asm,g=this.heap,h=Xb.DEC[this.mode],i=Xb.HEAP_DATA,j=this.pos,k=this.len,l=k;if(k>0){if(k%16){if(this.hasOwnProperty("padding"))throw new d("data length must be a multiple of the block size");k+=16-k%16}if(f.cipher(h,i+j,k),this.hasOwnProperty("padding")&&this.padding){var m=g[j+l-1];if(1>m||m>16||m>l)throw new e("bad padding");for(var n=0,o=m;o>1;o--)n|=m^g[j+l-o];if(n)throw new e("bad padding");l-=m}}var p=new Uint8Array(c+l);return c>0&&p.set(b),l>0&&p.set(g.subarray(j,j+l),c),this.result=p,this.pos=0,this.len=0,this}function C(a){this.padding=!0,this.iv=null,t.call(this,a),this.mode="CBC"}function D(a){C.call(this,a)}function E(a){C.call(this,a)}function F(a){this.nonce=null,this.counter=0,this.counterSize=0,t.call(this,a),this.mode="CTR"}function G(a){F.call(this,a)}function H(a,b,c){if(void 0!==c){if(8>c||c>48)throw new d("illegal counter size");this.counterSize=c;var e=Math.pow(2,c)-1;this.asm.set_mask(0,0,e/4294967296|0,0|e)}else this.counterSize=c=48,this.asm.set_mask(0,0,65535,4294967295);if(void 0===a)throw new Error("nonce is required");if(o(a)||p(a))a=new Uint8Array(a);else{if(!n(a))throw new TypeError("unexpected nonce type");a=f(a)}var g=a.length;if(!g||g>16)throw new d("illegal nonce size");this.nonce=a;var h=new DataView(new ArrayBuffer(16));if(new Uint8Array(h.buffer).set(a),this.asm.set_nonce(h.getUint32(0),h.getUint32(4),h.getUint32(8),h.getUint32(12)),void 0!==b){if(!m(b))throw new TypeError("unexpected counter type");if(0>b||b>=Math.pow(2,c))throw new d("illegal counter value");this.counter=b,this.asm.set_counter(0,0,b/4294967296|0,0|b)}else this.counter=b=0}function I(a){return a=a||{},x.call(this,a),H.call(this,a.nonce,a.counter,a.counterSize),this}function J(a){for(var b=this.heap,c=this.asm,d=0,e=a.length||0,f=0;e>0;){for(f=s(b,0,a,d,e),d+=f,e-=f;15&f;)b[f++]=0;c.mac(Xb.MAC.GCM,Xb.HEAP_DATA,f)}}function K(a){this.nonce=null,this.adata=null,this.iv=null,this.counter=1,this.tagSize=16,t.call(this,a),this.mode="GCM"}function L(a){K.call(this,a)}function M(a){K.call(this,a)}function N(a){a=a||{},x.call(this,a);var b=this.asm,c=this.heap;b.gcm_init();var e=a.tagSize;if(void 0!==e){if(!m(e))throw new TypeError("tagSize must be a number");if(4>e||e>16)throw new d("illegal tagSize value");this.tagSize=e}else this.tagSize=16;var g=a.nonce;if(void 0===g)throw new Error("nonce is required");if(p(g)||o(g))g=new Uint8Array(g);else{if(!n(g))throw new TypeError("unexpected nonce type");g=f(g)}this.nonce=g;var h=g.length||0,i=new Uint8Array(16);12!==h?(J.call(this,g),c[0]=c[1]=c[2]=c[3]=c[4]=c[5]=c[6]=c[7]=c[8]=c[9]=c[10]=0,c[11]=h>>>29,c[12]=h>>>21&255,c[13]=h>>>13&255,c[14]=h>>>5&255,c[15]=h<<3&255,b.mac(Xb.MAC.GCM,Xb.HEAP_DATA,16),b.get_iv(Xb.HEAP_DATA),b.set_iv(),i.set(c.subarray(0,16))):(i.set(g),i[15]=1);var j=new DataView(i.buffer);this.gamma0=j.getUint32(12),b.set_nonce(j.getUint32(0),j.getUint32(4),j.getUint32(8),0),b.set_mask(0,0,0,4294967295);var k=a.adata;if(void 0!==k&&null!==k){if(p(k)||o(k))k=new Uint8Array(k);else{if(!n(k))throw new TypeError("unexpected adata type");k=f(k)}if(k.length>bc)throw new d("illegal adata length");k.length?(this.adata=k,J.call(this,k)):this.adata=null}else this.adata=null;var l=a.counter;if(void 0!==l){if(!m(l))throw new TypeError("counter must be a number");if(1>l||l>4294967295)throw new RangeError("counter must be a positive 32-bit integer");this.counter=l,b.set_counter(0,0,0,this.gamma0+l|0)}else this.counter=1,b.set_counter(0,0,0,this.gamma0+1|0);var q=a.iv;if(void 0!==q){if(!m(l))throw new TypeError("counter must be a number");this.iv=q,v.call(this,q)}return this}function O(a){if(n(a)&&(a=f(a)),o(a)&&(a=new Uint8Array(a)),!p(a))throw new TypeError("data isn't of expected type");var b=0,c=a.length||0,d=this.asm,e=this.heap,g=this.counter,h=this.pos,i=this.len,j=0,k=i+c&-16,l=0;if((g-1<<4)+i+c>bc)throw new RangeError("counter overflow");for(var m=new Uint8Array(k);c>0;)l=s(e,h+i,a,b,c),i+=l,b+=l,c-=l,l=d.cipher(Xb.ENC.CTR,Xb.HEAP_DATA+h,i),l=d.mac(Xb.MAC.GCM,Xb.HEAP_DATA+h,l),l&&m.set(e.subarray(h,h+l),j),g+=l>>>4,j+=l,i>l?(h+=l,i-=l):(h=0,i=0);return this.result=m,this.counter=g,this.pos=h,this.len=i,this}function P(){var a=this.asm,b=this.heap,c=this.counter,d=this.tagSize,e=this.adata,f=this.pos,g=this.len,h=new Uint8Array(g+d);a.cipher(Xb.ENC.CTR,Xb.HEAP_DATA+f,g+15&-16),g&&h.set(b.subarray(f,f+g));for(var i=g;15&i;i++)b[f+i]=0;a.mac(Xb.MAC.GCM,Xb.HEAP_DATA+f,i);var j=null!==e?e.length:0,k=(c-1<<4)+g;return b[0]=b[1]=b[2]=0,b[3]=j>>>29,b[4]=j>>>21,b[5]=j>>>13&255,b[6]=j>>>5&255,b[7]=j<<3&255,b[8]=b[9]=b[10]=0,b[11]=k>>>29,b[12]=k>>>21&255,b[13]=k>>>13&255,b[14]=k>>>5&255,b[15]=k<<3&255,a.mac(Xb.MAC.GCM,Xb.HEAP_DATA,16),a.get_iv(Xb.HEAP_DATA),a.set_counter(0,0,0,this.gamma0),a.cipher(Xb.ENC.CTR,Xb.HEAP_DATA,16),h.set(b.subarray(0,d),g),this.result=h,this.counter=1,this.pos=0,this.len=0,this}function Q(a){var b=O.call(this,a).result,c=P.call(this).result,d=new Uint8Array(b.length+c.length);return b.length&&d.set(b),c.length&&d.set(c,b.length),this.result=d,this}function R(a){if(n(a)&&(a=f(a)),o(a)&&(a=new Uint8Array(a)),!p(a))throw new TypeError("data isn't of expected type");var b=0,c=a.length||0,d=this.asm,e=this.heap,g=this.counter,h=this.tagSize,i=this.pos,j=this.len,k=0,l=j+c>h?j+c-h&-16:0,m=j+c-l,q=0;if((g-1<<4)+j+c>bc)throw new RangeError("counter overflow");for(var r=new Uint8Array(l);c>m;)q=s(e,i+j,a,b,c-m),j+=q,b+=q,c-=q,q=d.mac(Xb.MAC.GCM,Xb.HEAP_DATA+i,q),q=d.cipher(Xb.DEC.CTR,Xb.HEAP_DATA+i,q),q&&r.set(e.subarray(i,i+q),k),g+=q>>>4,k+=q,i=0,j=0;return c>0&&(j+=s(e,0,a,b,c)),this.result=r,this.counter=g,this.pos=i,this.len=j,this}function S(){var a=this.asm,b=this.heap,d=this.tagSize,f=this.adata,g=this.counter,h=this.pos,i=this.len,j=i-d,k=0;if(d>i)throw new c("authentication tag not found");for(var l=new Uint8Array(j),m=new Uint8Array(b.subarray(h+j,h+i)),n=j;15&n;n++)b[h+n]=0;k=a.mac(Xb.MAC.GCM,Xb.HEAP_DATA+h,n),k=a.cipher(Xb.DEC.CTR,Xb.HEAP_DATA+h,n),j&&l.set(b.subarray(h,h+j));var o=null!==f?f.length:0,p=(g-1<<4)+i-d;b[0]=b[1]=b[2]=0,b[3]=o>>>29,b[4]=o>>>21,b[5]=o>>>13&255,b[6]=o>>>5&255,b[7]=o<<3&255,b[8]=b[9]=b[10]=0,b[11]=p>>>29,b[12]=p>>>21&255,b[13]=p>>>13&255,b[14]=p>>>5&255,b[15]=p<<3&255,a.mac(Xb.MAC.GCM,Xb.HEAP_DATA,16),a.get_iv(Xb.HEAP_DATA),a.set_counter(0,0,0,this.gamma0),a.cipher(Xb.ENC.CTR,Xb.HEAP_DATA,16);for(var q=0,n=0;d>n;++n)q|=m[n]^b[n];if(q)throw new e("data integrity check failed");return this.result=l,this.counter=1,this.pos=0,this.len=0,this}function T(a){var b=R.call(this,a).result,c=S.call(this).result,d=new Uint8Array(b.length+c.length);return b.length&&d.set(b),c.length&&d.set(c,b.length),this.result=d,this}function U(a,b,c,d){if(void 0===a)throw new SyntaxError("data required");if(void 0===b)throw new SyntaxError("key required");return new C({heap:fc,asm:gc,key:b,padding:c,iv:d}).encrypt(a).result}function V(a,b,c,d){if(void 0===a)throw new SyntaxError("data required");if(void 0===b)throw new SyntaxError("key required");return new C({heap:fc,asm:gc,key:b,padding:c,iv:d}).decrypt(a).result}function W(a,b,c,d,e){if(void 0===a)throw new SyntaxError("data required");if(void 0===b)throw new SyntaxError("key required");if(void 0===c)throw new SyntaxError("nonce required");return new K({heap:fc,asm:gc,key:b,nonce:c,adata:d,tagSize:e}).encrypt(a).result}function X(a,b,c,d,e){if(void 0===a)throw new SyntaxError("data required");if(void 0===b)throw new SyntaxError("key required");if(void 0===c)throw new SyntaxError("nonce required");return new K({heap:fc,asm:gc,key:b,nonce:c,adata:d,tagSize:e}).decrypt(a).result}function Y(){return this.result=null,this.pos=0,this.len=0,this.asm.reset(),this}function Z(a){if(null!==this.result)throw new c("state must be reset before processing new data");if(n(a)&&(a=f(a)),o(a)&&(a=new Uint8Array(a)),!p(a))throw new TypeError("data isn't of expected type");for(var b=this.asm,d=this.heap,e=this.pos,g=this.len,h=0,i=a.length,j=0;i>0;)j=s(d,e+g,a,h,i),g+=j,h+=j,i-=j,j=b.process(e,g),e+=j,g-=j,g||(e=0);return this.pos=e,this.len=g,this}function $(){if(null!==this.result)throw new c("state must be reset before processing new data");return this.asm.finish(this.pos,this.len,0),this.result=new Uint8Array(this.HASH_SIZE),this.result.set(this.heap.subarray(0,this.HASH_SIZE)),this.pos=0,this.len=0,this}function _(a,b,c){"use asm";var d=0,e=0,f=0,g=0,h=0,i=0,j=0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;var u=new a.Uint8Array(c);function v(a,b,c,i,j,k,l,m,n,o,p,q,r,s,t,u){a=a|0;b=b|0;c=c|0;i=i|0;j=j|0;k=k|0;l=l|0;m=m|0;n=n|0;o=o|0;p=p|0;q=q|0;r=r|0;s=s|0;t=t|0;u=u|0;var v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,$=0,_=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0,ua=0,va=0,wa=0,xa=0,ya=0,za=0,Aa=0,Ba=0,Ca=0,Da=0,Ea=0,Fa=0,Ga=0,Ha=0,Ia=0,Ja=0,Ka=0,La=0;v=d;w=e;x=f;y=g;z=h;B=a+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;B=b+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;B=c+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;B=i+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;B=j+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;B=k+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;B=l+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;B=m+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;B=n+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;B=o+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;B=p+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;B=q+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;B=r+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;B=s+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;B=t+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;B=u+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=s^n^c^a;C=A<<1|A>>>31;B=C+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=t^o^i^b;D=A<<1|A>>>31;B=D+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=u^p^j^c;E=A<<1|A>>>31;B=E+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=C^q^k^i;F=A<<1|A>>>31;B=F+(v<<5|v>>>27)+z+(w&x|~w&y)+1518500249|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=D^r^l^j;G=A<<1|A>>>31;B=G+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=E^s^m^k;H=A<<1|A>>>31;B=H+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=F^t^n^l;I=A<<1|A>>>31;B=I+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=G^u^o^m;J=A<<1|A>>>31;B=J+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=H^C^p^n;K=A<<1|A>>>31;B=K+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=I^D^q^o;L=A<<1|A>>>31;B=L+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=J^E^r^p;M=A<<1|A>>>31;B=M+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=K^F^s^q;N=A<<1|A>>>31;B=N+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=L^G^t^r;O=A<<1|A>>>31;B=O+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=M^H^u^s;P=A<<1|A>>>31;B=P+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=N^I^C^t;Q=A<<1|A>>>31;B=Q+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=O^J^D^u;R=A<<1|A>>>31;B=R+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=P^K^E^C;S=A<<1|A>>>31;B=S+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=Q^L^F^D;T=A<<1|A>>>31;B=T+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=R^M^G^E;U=A<<1|A>>>31;B=U+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=S^N^H^F;V=A<<1|A>>>31;B=V+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=T^O^I^G;W=A<<1|A>>>31;B=W+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=U^P^J^H;X=A<<1|A>>>31;B=X+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=V^Q^K^I;Y=A<<1|A>>>31;B=Y+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=W^R^L^J;Z=A<<1|A>>>31;B=Z+(v<<5|v>>>27)+z+(w^x^y)+1859775393|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=X^S^M^K;$=A<<1|A>>>31;B=$+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=Y^T^N^L;_=A<<1|A>>>31;B=_+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=Z^U^O^M;aa=A<<1|A>>>31;B=aa+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=$^V^P^N;ba=A<<1|A>>>31;B=ba+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=_^W^Q^O;ca=A<<1|A>>>31;B=ca+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=aa^X^R^P;da=A<<1|A>>>31;B=da+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=ba^Y^S^Q;ea=A<<1|A>>>31;B=ea+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=ca^Z^T^R;fa=A<<1|A>>>31;B=fa+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=da^$^U^S;ga=A<<1|A>>>31;B=ga+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=ea^_^V^T;ha=A<<1|A>>>31;B=ha+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=fa^aa^W^U;ia=A<<1|A>>>31;B=ia+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=ga^ba^X^V;ja=A<<1|A>>>31;B=ja+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=ha^ca^Y^W;ka=A<<1|A>>>31;B=ka+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=ia^da^Z^X;la=A<<1|A>>>31;B=la+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=ja^ea^$^Y;ma=A<<1|A>>>31;B=ma+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=ka^fa^_^Z;na=A<<1|A>>>31;B=na+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=la^ga^aa^$;oa=A<<1|A>>>31;B=oa+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=ma^ha^ba^_;pa=A<<1|A>>>31;B=pa+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=na^ia^ca^aa;qa=A<<1|A>>>31;B=qa+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=oa^ja^da^ba;ra=A<<1|A>>>31;B=ra+(v<<5|v>>>27)+z+(w&x|w&y|x&y)-1894007588|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=pa^ka^ea^ca;sa=A<<1|A>>>31;B=sa+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=qa^la^fa^da;ta=A<<1|A>>>31;B=ta+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=ra^ma^ga^ea;ua=A<<1|A>>>31;B=ua+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=sa^na^ha^fa;va=A<<1|A>>>31;B=va+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=ta^oa^ia^ga;wa=A<<1|A>>>31;B=wa+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=ua^pa^ja^ha;xa=A<<1|A>>>31;B=xa+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=va^qa^ka^ia;ya=A<<1|A>>>31;B=ya+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=wa^ra^la^ja;za=A<<1|A>>>31;B=za+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=xa^sa^ma^ka;Aa=A<<1|A>>>31;B=Aa+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=ya^ta^na^la;Ba=A<<1|A>>>31;B=Ba+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=za^ua^oa^ma;Ca=A<<1|A>>>31;B=Ca+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=Aa^va^pa^na;Da=A<<1|A>>>31;B=Da+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=Ba^wa^qa^oa;Ea=A<<1|A>>>31;B=Ea+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=Ca^xa^ra^pa;Fa=A<<1|A>>>31;B=Fa+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=Da^ya^sa^qa;Ga=A<<1|A>>>31;B=Ga+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=Ea^za^ta^ra;Ha=A<<1|A>>>31;B=Ha+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=Fa^Aa^ua^sa;Ia=A<<1|A>>>31;B=Ia+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=Ga^Ba^va^ta;Ja=A<<1|A>>>31;B=Ja+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=Ha^Ca^wa^ua;Ka=A<<1|A>>>31;B=Ka+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;A=Ia^Da^xa^va;La=A<<1|A>>>31;B=La+(v<<5|v>>>27)+z+(w^x^y)-899497514|0;z=y;y=x;x=w<<30|w>>>2;w=v;v=B;d=d+v|0;e=e+w|0;f=f+x|0;g=g+y|0;h=h+z|0}function w(a){a=a|0;v(u[a|0]<<24|u[a|1]<<16|u[a|2]<<8|u[a|3],u[a|4]<<24|u[a|5]<<16|u[a|6]<<8|u[a|7],u[a|8]<<24|u[a|9]<<16|u[a|10]<<8|u[a|11],u[a|12]<<24|u[a|13]<<16|u[a|14]<<8|u[a|15],u[a|16]<<24|u[a|17]<<16|u[a|18]<<8|u[a|19],u[a|20]<<24|u[a|21]<<16|u[a|22]<<8|u[a|23],u[a|24]<<24|u[a|25]<<16|u[a|26]<<8|u[a|27],u[a|28]<<24|u[a|29]<<16|u[a|30]<<8|u[a|31],u[a|32]<<24|u[a|33]<<16|u[a|34]<<8|u[a|35],u[a|36]<<24|u[a|37]<<16|u[a|38]<<8|u[a|39],u[a|40]<<24|u[a|41]<<16|u[a|42]<<8|u[a|43],u[a|44]<<24|u[a|45]<<16|u[a|46]<<8|u[a|47],u[a|48]<<24|u[a|49]<<16|u[a|50]<<8|u[a|51],u[a|52]<<24|u[a|53]<<16|u[a|54]<<8|u[a|55],u[a|56]<<24|u[a|57]<<16|u[a|58]<<8|u[a|59],u[a|60]<<24|u[a|61]<<16|u[a|62]<<8|u[a|63])}function x(a){a=a|0;u[a|0]=d>>>24;u[a|1]=d>>>16&255;u[a|2]=d>>>8&255;u[a|3]=d&255;u[a|4]=e>>>24;u[a|5]=e>>>16&255;u[a|6]=e>>>8&255;u[a|7]=e&255;u[a|8]=f>>>24;u[a|9]=f>>>16&255;u[a|10]=f>>>8&255;u[a|11]=f&255;u[a|12]=g>>>24;u[a|13]=g>>>16&255;u[a|14]=g>>>8&255;u[a|15]=g&255;u[a|16]=h>>>24;u[a|17]=h>>>16&255;u[a|18]=h>>>8&255;u[a|19]=h&255}function y(){d=1732584193;e=4023233417;f=2562383102;g=271733878;h=3285377520;i=j=0}function z(a,b,c,k,l,m,n){a=a|0;b=b|0;c=c|0;k=k|0;l=l|0;m=m|0;n=n|0;d=a;e=b;f=c;g=k;h=l;i=m;j=n}function A(a,b){a=a|0;b=b|0;var c=0;if(a&63)return-1;while((b|0)>=64){w(a);a=a+64|0;b=b-64|0;c=c+64|0}i=i+c|0;if(i>>>0<c>>>0)j=j+1|0;return c|0}function B(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;if(a&63)return-1;if(~c)if(c&31)return-1;if((b|0)>=64){d=A(a,b)|0;if((d|0)==-1)return-1;a=a+d|0;b=b-d|0}d=d+b|0;i=i+b|0;if(i>>>0<b>>>0)j=j+1|0;u[a|b]=128;if((b|0)>=56){for(e=b+1|0;(e|0)<64;e=e+1|0)u[a|e]=0;w(a);b=0;u[a|0]=0}for(e=b+1|0;(e|0)<59;e=e+1|0)u[a|e]=0;u[a|56]=j>>>21&255;u[a|57]=j>>>13&255;u[a|58]=j>>>5&255;u[a|59]=j<<3&255|i>>>29;u[a|60]=i>>>21&255;u[a|61]=i>>>13&255;u[a|62]=i>>>5&255;u[a|63]=i<<3&255;w(a);if(~c)x(c);return d|0}function C(){d=k;e=l;f=m;g=n;h=o;i=64;j=0}function D(){d=p;e=q;f=r;g=s;h=t;i=64;j=0}function E(a,b,c,u,w,x,z,A,B,C,D,E,F,G,H,I){a=a|0;b=b|0;c=c|0;u=u|0;w=w|0;x=x|0;z=z|0;A=A|0;B=B|0;C=C|0;D=D|0;E=E|0;F=F|0;G=G|0;H=H|0;I=I|0;y();v(a^1549556828,b^1549556828,c^1549556828,u^1549556828,w^1549556828,x^1549556828,z^1549556828,A^1549556828,B^1549556828,C^1549556828,D^1549556828,E^1549556828,F^1549556828,G^1549556828,H^1549556828,I^1549556828);p=d;q=e;r=f;s=g;t=h;y();v(a^909522486,b^909522486,c^909522486,u^909522486,w^909522486,x^909522486,z^909522486,A^909522486,B^909522486,C^909522486,D^909522486,E^909522486,F^909522486,G^909522486,H^909522486,I^909522486);k=d;l=e;m=f;n=g;o=h;i=64;j=0}function F(a,b,c){a=a|0;b=b|0;c=c|0;var i=0,j=0,k=0,l=0,m=0,n=0;if(a&63)return-1;if(~c)if(c&31)return-1;n=B(a,b,-1)|0;i=d,j=e,k=f,l=g,m=h;D();v(i,j,k,l,m,2147483648,0,0,0,0,0,0,0,0,0,672);if(~c)x(c);return n|0}function G(a,b,c,i,j){a=a|0;b=b|0;c=c|0;i=i|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;if(a&63)return-1;if(~j)if(j&31)return-1;u[a+b|0]=c>>>24;u[a+b+1|0]=c>>>16&255;u[a+b+2|0]=c>>>8&255;u[a+b+3|0]=c&255;F(a,b+4|0,-1)|0;k=p=d,l=q=e,m=r=f,n=s=g,o=t=h;i=i-1|0;while((i|0)>0){C();v(p,q,r,s,t,2147483648,0,0,0,0,0,0,0,0,0,672);p=d,q=e,r=f,s=g,t=h;D();v(p,q,r,s,t,2147483648,0,0,0,0,0,0,0,0,0,672);p=d,q=e,r=f,s=g,t=h;k=k^d;l=l^e;m=m^f;n=n^g;o=o^h;i=i-1|0}d=k;e=l;f=m;g=n;h=o;if(~j)x(j);return 0}return{reset:y,init:z,process:A,finish:B,hmac_reset:C,hmac_init:E,hmac_finish:F,pbkdf2_generate_block:G}}function aa(a){a=a||{},this.heap=r(Uint8Array,a),this.asm=a.asm||_(b,null,this.heap.buffer),this.BLOCK_SIZE=hc,this.HASH_SIZE=ic,this.reset()}function ba(){return null===kc&&(kc=new aa({heapSize:1048576})),kc}function ca(a){if(void 0===a)throw new SyntaxError("data required");return ba().reset().process(a).finish().result}function da(a){var b=ca(a);return j(b)}function ea(a){var b=ca(a);return k(b)}function fa(a,b,c){"use asm";var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;var n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;var D=new a.Uint8Array(c);function E(a,b,c,l,m,n,o,p,q,r,s,t,u,v,w,x){a=a|0;b=b|0;c=c|0;l=l|0;m=m|0;n=n|0;o=o|0;p=p|0;q=q|0;r=r|0;s=s|0;t=t|0;u=u|0;v=v|0;w=w|0;x=x|0;var y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0;y=d;z=e;A=f;B=g;C=h;D=i;E=j;F=k;G=a+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+1116352408|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;G=b+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+1899447441|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;G=c+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+3049323471|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;G=l+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+3921009573|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;G=m+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+961987163|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;G=n+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+1508970993|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;G=o+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+2453635748|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;G=p+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+2870763221|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;G=q+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+3624381080|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;G=r+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+310598401|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;G=s+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+607225278|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;G=t+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+1426881987|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;G=u+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+1925078388|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;G=v+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+2162078206|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;G=w+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+2614888103|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;G=x+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+3248222580|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;a=G=(b>>>7^b>>>18^b>>>3^b<<25^b<<14)+(w>>>17^w>>>19^w>>>10^w<<15^w<<13)+a+r|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+3835390401|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;b=G=(c>>>7^c>>>18^c>>>3^c<<25^c<<14)+(x>>>17^x>>>19^x>>>10^x<<15^x<<13)+b+s|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+4022224774|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;c=G=(l>>>7^l>>>18^l>>>3^l<<25^l<<14)+(a>>>17^a>>>19^a>>>10^a<<15^a<<13)+c+t|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+264347078|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;l=G=(m>>>7^m>>>18^m>>>3^m<<25^m<<14)+(b>>>17^b>>>19^b>>>10^b<<15^b<<13)+l+u|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+604807628|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;m=G=(n>>>7^n>>>18^n>>>3^n<<25^n<<14)+(c>>>17^c>>>19^c>>>10^c<<15^c<<13)+m+v|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+770255983|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;n=G=(o>>>7^o>>>18^o>>>3^o<<25^o<<14)+(l>>>17^l>>>19^l>>>10^l<<15^l<<13)+n+w|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+1249150122|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;o=G=(p>>>7^p>>>18^p>>>3^p<<25^p<<14)+(m>>>17^m>>>19^m>>>10^m<<15^m<<13)+o+x|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+1555081692|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;p=G=(q>>>7^q>>>18^q>>>3^q<<25^q<<14)+(n>>>17^n>>>19^n>>>10^n<<15^n<<13)+p+a|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+1996064986|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;q=G=(r>>>7^r>>>18^r>>>3^r<<25^r<<14)+(o>>>17^o>>>19^o>>>10^o<<15^o<<13)+q+b|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+2554220882|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;r=G=(s>>>7^s>>>18^s>>>3^s<<25^s<<14)+(p>>>17^p>>>19^p>>>10^p<<15^p<<13)+r+c|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+2821834349|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;s=G=(t>>>7^t>>>18^t>>>3^t<<25^t<<14)+(q>>>17^q>>>19^q>>>10^q<<15^q<<13)+s+l|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+2952996808|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;t=G=(u>>>7^u>>>18^u>>>3^u<<25^u<<14)+(r>>>17^r>>>19^r>>>10^r<<15^r<<13)+t+m|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+3210313671|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;u=G=(v>>>7^v>>>18^v>>>3^v<<25^v<<14)+(s>>>17^s>>>19^s>>>10^s<<15^s<<13)+u+n|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+3336571891|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;v=G=(w>>>7^w>>>18^w>>>3^w<<25^w<<14)+(t>>>17^t>>>19^t>>>10^t<<15^t<<13)+v+o|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+3584528711|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;w=G=(x>>>7^x>>>18^x>>>3^x<<25^x<<14)+(u>>>17^u>>>19^u>>>10^u<<15^u<<13)+w+p|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+113926993|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;
	x=G=(a>>>7^a>>>18^a>>>3^a<<25^a<<14)+(v>>>17^v>>>19^v>>>10^v<<15^v<<13)+x+q|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+338241895|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;a=G=(b>>>7^b>>>18^b>>>3^b<<25^b<<14)+(w>>>17^w>>>19^w>>>10^w<<15^w<<13)+a+r|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+666307205|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;b=G=(c>>>7^c>>>18^c>>>3^c<<25^c<<14)+(x>>>17^x>>>19^x>>>10^x<<15^x<<13)+b+s|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+773529912|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;c=G=(l>>>7^l>>>18^l>>>3^l<<25^l<<14)+(a>>>17^a>>>19^a>>>10^a<<15^a<<13)+c+t|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+1294757372|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;l=G=(m>>>7^m>>>18^m>>>3^m<<25^m<<14)+(b>>>17^b>>>19^b>>>10^b<<15^b<<13)+l+u|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+1396182291|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;m=G=(n>>>7^n>>>18^n>>>3^n<<25^n<<14)+(c>>>17^c>>>19^c>>>10^c<<15^c<<13)+m+v|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+1695183700|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;n=G=(o>>>7^o>>>18^o>>>3^o<<25^o<<14)+(l>>>17^l>>>19^l>>>10^l<<15^l<<13)+n+w|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+1986661051|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;o=G=(p>>>7^p>>>18^p>>>3^p<<25^p<<14)+(m>>>17^m>>>19^m>>>10^m<<15^m<<13)+o+x|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+2177026350|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;p=G=(q>>>7^q>>>18^q>>>3^q<<25^q<<14)+(n>>>17^n>>>19^n>>>10^n<<15^n<<13)+p+a|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+2456956037|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;q=G=(r>>>7^r>>>18^r>>>3^r<<25^r<<14)+(o>>>17^o>>>19^o>>>10^o<<15^o<<13)+q+b|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+2730485921|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;r=G=(s>>>7^s>>>18^s>>>3^s<<25^s<<14)+(p>>>17^p>>>19^p>>>10^p<<15^p<<13)+r+c|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+2820302411|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;s=G=(t>>>7^t>>>18^t>>>3^t<<25^t<<14)+(q>>>17^q>>>19^q>>>10^q<<15^q<<13)+s+l|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+3259730800|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;t=G=(u>>>7^u>>>18^u>>>3^u<<25^u<<14)+(r>>>17^r>>>19^r>>>10^r<<15^r<<13)+t+m|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+3345764771|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;u=G=(v>>>7^v>>>18^v>>>3^v<<25^v<<14)+(s>>>17^s>>>19^s>>>10^s<<15^s<<13)+u+n|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+3516065817|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;v=G=(w>>>7^w>>>18^w>>>3^w<<25^w<<14)+(t>>>17^t>>>19^t>>>10^t<<15^t<<13)+v+o|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+3600352804|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;w=G=(x>>>7^x>>>18^x>>>3^x<<25^x<<14)+(u>>>17^u>>>19^u>>>10^u<<15^u<<13)+w+p|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+4094571909|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;x=G=(a>>>7^a>>>18^a>>>3^a<<25^a<<14)+(v>>>17^v>>>19^v>>>10^v<<15^v<<13)+x+q|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+275423344|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;a=G=(b>>>7^b>>>18^b>>>3^b<<25^b<<14)+(w>>>17^w>>>19^w>>>10^w<<15^w<<13)+a+r|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+430227734|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;b=G=(c>>>7^c>>>18^c>>>3^c<<25^c<<14)+(x>>>17^x>>>19^x>>>10^x<<15^x<<13)+b+s|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+506948616|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;c=G=(l>>>7^l>>>18^l>>>3^l<<25^l<<14)+(a>>>17^a>>>19^a>>>10^a<<15^a<<13)+c+t|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+659060556|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;l=G=(m>>>7^m>>>18^m>>>3^m<<25^m<<14)+(b>>>17^b>>>19^b>>>10^b<<15^b<<13)+l+u|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+883997877|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;m=G=(n>>>7^n>>>18^n>>>3^n<<25^n<<14)+(c>>>17^c>>>19^c>>>10^c<<15^c<<13)+m+v|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+958139571|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;n=G=(o>>>7^o>>>18^o>>>3^o<<25^o<<14)+(l>>>17^l>>>19^l>>>10^l<<15^l<<13)+n+w|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+1322822218|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;o=G=(p>>>7^p>>>18^p>>>3^p<<25^p<<14)+(m>>>17^m>>>19^m>>>10^m<<15^m<<13)+o+x|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+1537002063|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;p=G=(q>>>7^q>>>18^q>>>3^q<<25^q<<14)+(n>>>17^n>>>19^n>>>10^n<<15^n<<13)+p+a|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+1747873779|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;q=G=(r>>>7^r>>>18^r>>>3^r<<25^r<<14)+(o>>>17^o>>>19^o>>>10^o<<15^o<<13)+q+b|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+1955562222|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;r=G=(s>>>7^s>>>18^s>>>3^s<<25^s<<14)+(p>>>17^p>>>19^p>>>10^p<<15^p<<13)+r+c|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+2024104815|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;s=G=(t>>>7^t>>>18^t>>>3^t<<25^t<<14)+(q>>>17^q>>>19^q>>>10^q<<15^q<<13)+s+l|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+2227730452|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;t=G=(u>>>7^u>>>18^u>>>3^u<<25^u<<14)+(r>>>17^r>>>19^r>>>10^r<<15^r<<13)+t+m|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+2361852424|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;u=G=(v>>>7^v>>>18^v>>>3^v<<25^v<<14)+(s>>>17^s>>>19^s>>>10^s<<15^s<<13)+u+n|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+2428436474|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;v=G=(w>>>7^w>>>18^w>>>3^w<<25^w<<14)+(t>>>17^t>>>19^t>>>10^t<<15^t<<13)+v+o|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+2756734187|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;w=G=(x>>>7^x>>>18^x>>>3^x<<25^x<<14)+(u>>>17^u>>>19^u>>>10^u<<15^u<<13)+w+p|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+3204031479|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;x=G=(a>>>7^a>>>18^a>>>3^a<<25^a<<14)+(v>>>17^v>>>19^v>>>10^v<<15^v<<13)+x+q|0;G=G+F+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(E^C&(D^E))+3329325298|0;F=E;E=D;D=C;C=B+G|0;B=A;A=z;z=y;y=G+(z&A^B&(z^A))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;d=d+y|0;e=e+z|0;f=f+A|0;g=g+B|0;h=h+C|0;i=i+D|0;j=j+E|0;k=k+F|0}function F(a){a=a|0;E(D[a|0]<<24|D[a|1]<<16|D[a|2]<<8|D[a|3],D[a|4]<<24|D[a|5]<<16|D[a|6]<<8|D[a|7],D[a|8]<<24|D[a|9]<<16|D[a|10]<<8|D[a|11],D[a|12]<<24|D[a|13]<<16|D[a|14]<<8|D[a|15],D[a|16]<<24|D[a|17]<<16|D[a|18]<<8|D[a|19],D[a|20]<<24|D[a|21]<<16|D[a|22]<<8|D[a|23],D[a|24]<<24|D[a|25]<<16|D[a|26]<<8|D[a|27],D[a|28]<<24|D[a|29]<<16|D[a|30]<<8|D[a|31],D[a|32]<<24|D[a|33]<<16|D[a|34]<<8|D[a|35],D[a|36]<<24|D[a|37]<<16|D[a|38]<<8|D[a|39],D[a|40]<<24|D[a|41]<<16|D[a|42]<<8|D[a|43],D[a|44]<<24|D[a|45]<<16|D[a|46]<<8|D[a|47],D[a|48]<<24|D[a|49]<<16|D[a|50]<<8|D[a|51],D[a|52]<<24|D[a|53]<<16|D[a|54]<<8|D[a|55],D[a|56]<<24|D[a|57]<<16|D[a|58]<<8|D[a|59],D[a|60]<<24|D[a|61]<<16|D[a|62]<<8|D[a|63])}function G(a){a=a|0;D[a|0]=d>>>24;D[a|1]=d>>>16&255;D[a|2]=d>>>8&255;D[a|3]=d&255;D[a|4]=e>>>24;D[a|5]=e>>>16&255;D[a|6]=e>>>8&255;D[a|7]=e&255;D[a|8]=f>>>24;D[a|9]=f>>>16&255;D[a|10]=f>>>8&255;D[a|11]=f&255;D[a|12]=g>>>24;D[a|13]=g>>>16&255;D[a|14]=g>>>8&255;D[a|15]=g&255;D[a|16]=h>>>24;D[a|17]=h>>>16&255;D[a|18]=h>>>8&255;D[a|19]=h&255;D[a|20]=i>>>24;D[a|21]=i>>>16&255;D[a|22]=i>>>8&255;D[a|23]=i&255;D[a|24]=j>>>24;D[a|25]=j>>>16&255;D[a|26]=j>>>8&255;D[a|27]=j&255;D[a|28]=k>>>24;D[a|29]=k>>>16&255;D[a|30]=k>>>8&255;D[a|31]=k&255}function H(){d=1779033703;e=3144134277;f=1013904242;g=2773480762;h=1359893119;i=2600822924;j=528734635;k=1541459225;l=m=0}function I(a,b,c,n,o,p,q,r,s,t){a=a|0;b=b|0;c=c|0;n=n|0;o=o|0;p=p|0;q=q|0;r=r|0;s=s|0;t=t|0;d=a;e=b;f=c;g=n;h=o;i=p;j=q;k=r;l=s;m=t}function J(a,b){a=a|0;b=b|0;var c=0;if(a&63)return-1;while((b|0)>=64){F(a);a=a+64|0;b=b-64|0;c=c+64|0}l=l+c|0;if(l>>>0<c>>>0)m=m+1|0;return c|0}function K(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;if(a&63)return-1;if(~c)if(c&31)return-1;if((b|0)>=64){d=J(a,b)|0;if((d|0)==-1)return-1;a=a+d|0;b=b-d|0}d=d+b|0;l=l+b|0;if(l>>>0<b>>>0)m=m+1|0;D[a|b]=128;if((b|0)>=56){for(e=b+1|0;(e|0)<64;e=e+1|0)D[a|e]=0;F(a);b=0;D[a|0]=0}for(e=b+1|0;(e|0)<59;e=e+1|0)D[a|e]=0;D[a|56]=m>>>21&255;D[a|57]=m>>>13&255;D[a|58]=m>>>5&255;D[a|59]=m<<3&255|l>>>29;D[a|60]=l>>>21&255;D[a|61]=l>>>13&255;D[a|62]=l>>>5&255;D[a|63]=l<<3&255;F(a);if(~c)G(c);return d|0}function L(){d=n;e=o;f=p;g=q;h=r;i=s;j=t;k=u;l=64;m=0}function M(){d=v;e=w;f=x;g=y;h=z;i=A;j=B;k=C;l=64;m=0}function N(a,b,c,D,F,G,I,J,K,L,M,N,O,P,Q,R){a=a|0;b=b|0;c=c|0;D=D|0;F=F|0;G=G|0;I=I|0;J=J|0;K=K|0;L=L|0;M=M|0;N=N|0;O=O|0;P=P|0;Q=Q|0;R=R|0;H();E(a^1549556828,b^1549556828,c^1549556828,D^1549556828,F^1549556828,G^1549556828,I^1549556828,J^1549556828,K^1549556828,L^1549556828,M^1549556828,N^1549556828,O^1549556828,P^1549556828,Q^1549556828,R^1549556828);v=d;w=e;x=f;y=g;z=h;A=i;B=j;C=k;H();E(a^909522486,b^909522486,c^909522486,D^909522486,F^909522486,G^909522486,I^909522486,J^909522486,K^909522486,L^909522486,M^909522486,N^909522486,O^909522486,P^909522486,Q^909522486,R^909522486);n=d;o=e;p=f;q=g;r=h;s=i;t=j;u=k;l=64;m=0}function O(a,b,c){a=a|0;b=b|0;c=c|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;if(a&63)return-1;if(~c)if(c&31)return-1;t=K(a,b,-1)|0;l=d,m=e,n=f,o=g,p=h,q=i,r=j,s=k;M();E(l,m,n,o,p,q,r,s,2147483648,0,0,0,0,0,0,768);if(~c)G(c);return t|0}function P(a,b,c,l,m){a=a|0;b=b|0;c=c|0;l=l|0;m=m|0;var n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;if(a&63)return-1;if(~m)if(m&31)return-1;D[a+b|0]=c>>>24;D[a+b+1|0]=c>>>16&255;D[a+b+2|0]=c>>>8&255;D[a+b+3|0]=c&255;O(a,b+4|0,-1)|0;n=v=d,o=w=e,p=x=f,q=y=g,r=z=h,s=A=i,t=B=j,u=C=k;l=l-1|0;while((l|0)>0){L();E(v,w,x,y,z,A,B,C,2147483648,0,0,0,0,0,0,768);v=d,w=e,x=f,y=g,z=h,A=i,B=j,C=k;M();E(v,w,x,y,z,A,B,C,2147483648,0,0,0,0,0,0,768);v=d,w=e,x=f,y=g,z=h,A=i,B=j,C=k;n=n^d;o=o^e;p=p^f;q=q^g;r=r^h;s=s^i;t=t^j;u=u^k;l=l-1|0}d=n;e=o;f=p;g=q;h=r;i=s;j=t;k=u;if(~m)G(m);return 0}return{reset:H,init:I,process:J,finish:K,hmac_reset:L,hmac_init:N,hmac_finish:O,pbkdf2_generate_block:P}}function ga(a){a=a||{},this.heap=r(Uint8Array,a),this.asm=a.asm||fa(b,null,this.heap.buffer),this.BLOCK_SIZE=lc,this.HASH_SIZE=mc,this.reset()}function ha(){return null===oc&&(oc=new ga({heapSize:1048576})),oc}function ia(a){if(void 0===a)throw new SyntaxError("data required");return ha().reset().process(a).finish().result}function ja(a){var b=ia(a);return j(b)}function ka(a){var b=ia(a);return k(b)}function la(a){if(a=a||{},!a.hash)throw new SyntaxError("option 'hash' is required");if(!a.hash.HASH_SIZE)throw new SyntaxError("option 'hash' supplied doesn't seem to be a valid hash function");return this.hash=a.hash,this.BLOCK_SIZE=this.hash.BLOCK_SIZE,this.HMAC_SIZE=this.hash.HASH_SIZE,this.key=null,this.verify=null,this.result=null,(void 0!==a.password||void 0!==a.verify)&&this.reset(a),this}function ma(a,b){if(o(b)&&(b=new Uint8Array(b)),n(b)&&(b=f(b)),!p(b))throw new TypeError("password isn't of expected type");var c=new Uint8Array(a.BLOCK_SIZE);return b.length>a.BLOCK_SIZE?c.set(a.reset().process(b).finish().result):c.set(b),c}function na(a){if(o(a)||p(a))a=new Uint8Array(a);else{if(!n(a))throw new TypeError("verify tag isn't of expected type");a=f(a)}if(a.length!==this.HMAC_SIZE)throw new d("illegal verification tag size");this.verify=a}function oa(a){a=a||{};var b=a.password;if(null===this.key&&!n(b)&&!b)throw new c("no key is associated with the instance");this.result=null,this.hash.reset(),(b||n(b))&&(this.key=ma(this.hash,b));for(var d=new Uint8Array(this.key),e=0;e<d.length;++e)d[e]^=54;this.hash.process(d);var f=a.verify;return void 0!==f?na.call(this,f):this.verify=null,this}function pa(a){if(null===this.key)throw new c("no key is associated with the instance");if(null!==this.result)throw new c("state must be reset before processing new data");return this.hash.process(a),this}function qa(){if(null===this.key)throw new c("no key is associated with the instance");if(null!==this.result)throw new c("state must be reset before processing new data");for(var a=this.hash.finish().result,b=new Uint8Array(this.key),d=0;d<b.length;++d)b[d]^=92;var e=this.verify,f=this.hash.reset().process(b).process(a).finish().result;if(e)if(e.length===f.length){for(var g=0,d=0;d<e.length;d++)g|=e[d]^f[d];this.result=!g}else this.result=!1;else this.result=f;return this}function ra(a){return a=a||{},a.hash instanceof aa||(a.hash=ba()),la.call(this,a),this}function sa(a){a=a||{},this.result=null,this.hash.reset();var b=a.password;if(void 0!==b){n(b)&&(b=f(b));var c=this.key=ma(this.hash,b);this.hash.reset().asm.hmac_init(c[0]<<24|c[1]<<16|c[2]<<8|c[3],c[4]<<24|c[5]<<16|c[6]<<8|c[7],c[8]<<24|c[9]<<16|c[10]<<8|c[11],c[12]<<24|c[13]<<16|c[14]<<8|c[15],c[16]<<24|c[17]<<16|c[18]<<8|c[19],c[20]<<24|c[21]<<16|c[22]<<8|c[23],c[24]<<24|c[25]<<16|c[26]<<8|c[27],c[28]<<24|c[29]<<16|c[30]<<8|c[31],c[32]<<24|c[33]<<16|c[34]<<8|c[35],c[36]<<24|c[37]<<16|c[38]<<8|c[39],c[40]<<24|c[41]<<16|c[42]<<8|c[43],c[44]<<24|c[45]<<16|c[46]<<8|c[47],c[48]<<24|c[49]<<16|c[50]<<8|c[51],c[52]<<24|c[53]<<16|c[54]<<8|c[55],c[56]<<24|c[57]<<16|c[58]<<8|c[59],c[60]<<24|c[61]<<16|c[62]<<8|c[63])}else this.hash.asm.hmac_reset();var d=a.verify;return void 0!==d?na.call(this,d):this.verify=null,this}function ta(){if(null===this.key)throw new c("no key is associated with the instance");if(null!==this.result)throw new c("state must be reset before processing new data");var a=this.hash,b=this.hash.asm,d=this.hash.heap;b.hmac_finish(a.pos,a.len,0);var e=this.verify,f=new Uint8Array(ic);if(f.set(d.subarray(0,ic)),e)if(e.length===f.length){for(var g=0,h=0;h<e.length;h++)g|=e[h]^f[h];this.result=!g}else this.result=!1;else this.result=f;return this}function ua(){return null===rc&&(rc=new ra),rc}function va(a){return a=a||{},a.hash instanceof ga||(a.hash=ha()),la.call(this,a),this}function wa(a){a=a||{},this.result=null,this.hash.reset();var b=a.password;if(void 0!==b){n(b)&&(b=f(b));var c=this.key=ma(this.hash,b);this.hash.reset().asm.hmac_init(c[0]<<24|c[1]<<16|c[2]<<8|c[3],c[4]<<24|c[5]<<16|c[6]<<8|c[7],c[8]<<24|c[9]<<16|c[10]<<8|c[11],c[12]<<24|c[13]<<16|c[14]<<8|c[15],c[16]<<24|c[17]<<16|c[18]<<8|c[19],c[20]<<24|c[21]<<16|c[22]<<8|c[23],c[24]<<24|c[25]<<16|c[26]<<8|c[27],c[28]<<24|c[29]<<16|c[30]<<8|c[31],c[32]<<24|c[33]<<16|c[34]<<8|c[35],c[36]<<24|c[37]<<16|c[38]<<8|c[39],c[40]<<24|c[41]<<16|c[42]<<8|c[43],c[44]<<24|c[45]<<16|c[46]<<8|c[47],c[48]<<24|c[49]<<16|c[50]<<8|c[51],c[52]<<24|c[53]<<16|c[54]<<8|c[55],c[56]<<24|c[57]<<16|c[58]<<8|c[59],c[60]<<24|c[61]<<16|c[62]<<8|c[63])}else this.hash.asm.hmac_reset();var d=a.verify;return void 0!==d?na.call(this,d):this.verify=null,this}function xa(){if(null===this.key)throw new c("no key is associated with the instance");if(null!==this.result)throw new c("state must be reset before processing new data");var a=this.hash,b=this.hash.asm,d=this.hash.heap;b.hmac_finish(a.pos,a.len,0);var e=this.verify,f=new Uint8Array(mc);if(f.set(d.subarray(0,mc)),e)if(e.length===f.length){for(var g=0,h=0;h<e.length;h++)g|=e[h]^f[h];this.result=!g}else this.result=!1;else this.result=f;return this}function ya(){return null===tc&&(tc=new va),tc}function za(a,b){if(void 0===a)throw new SyntaxError("data required");if(void 0===b)throw new SyntaxError("password required");return ua().reset({password:b}).process(a).finish().result}function Aa(a,b){var c=za(a,b);return j(c)}function Ba(a,b){var c=za(a,b);return k(c)}function Ca(a,b){if(void 0===a)throw new SyntaxError("data required");if(void 0===b)throw new SyntaxError("password required");return ya().reset({password:b}).process(a).finish().result}function Da(a,b){var c=Ca(a,b);return j(c)}function Ea(a,b){var c=Ca(a,b);return k(c)}function Fa(a){if(a=a||{},!a.hmac)throw new SyntaxError("option 'hmac' is required");if(!a.hmac.HMAC_SIZE)throw new SyntaxError("option 'hmac' supplied doesn't seem to be a valid HMAC function");this.hmac=a.hmac,this.count=a.count||4096,this.length=a.length||this.hmac.HMAC_SIZE,this.result=null;var b=a.password;return(b||n(b))&&this.reset(a),this}function Ga(a){return this.result=null,this.hmac.reset(a),this}function Ha(a,b,e){if(null!==this.result)throw new c("state must be reset before processing new data");if(!a&&!n(a))throw new d("bad 'salt' value");b=b||this.count,e=e||this.length,this.result=new Uint8Array(e);for(var f=Math.ceil(e/this.hmac.HMAC_SIZE),g=1;f>=g;++g){var h=(g-1)*this.hmac.HMAC_SIZE,i=(f>g?0:e%this.hmac.HMAC_SIZE)||this.hmac.HMAC_SIZE,j=new Uint8Array(this.hmac.reset().process(a).process(new Uint8Array([g>>>24&255,g>>>16&255,g>>>8&255,255&g])).finish().result);this.result.set(j.subarray(0,i),h);for(var k=1;b>k;++k){j=new Uint8Array(this.hmac.reset().process(j).finish().result);for(var l=0;i>l;++l)this.result[h+l]^=j[l]}}return this}function Ia(a){return a=a||{},a.hmac instanceof ra||(a.hmac=ua()),Fa.call(this,a),this}function Ja(a,b,e){if(null!==this.result)throw new c("state must be reset before processing new data");if(!a&&!n(a))throw new d("bad 'salt' value");b=b||this.count,e=e||this.length,this.result=new Uint8Array(e);for(var f=Math.ceil(e/this.hmac.HMAC_SIZE),g=1;f>=g;++g){var h=(g-1)*this.hmac.HMAC_SIZE,i=(f>g?0:e%this.hmac.HMAC_SIZE)||this.hmac.HMAC_SIZE;this.hmac.reset().process(a),this.hmac.hash.asm.pbkdf2_generate_block(this.hmac.hash.pos,this.hmac.hash.len,g,b,0),this.result.set(this.hmac.hash.heap.subarray(0,i),h)}return this}function Ka(){return null===wc&&(wc=new Ia),wc}function La(a){return a=a||{},a.hmac instanceof va||(a.hmac=ya()),Fa.call(this,a),this}function Ma(a,b,e){if(null!==this.result)throw new c("state must be reset before processing new data");if(!a&&!n(a))throw new d("bad 'salt' value");b=b||this.count,e=e||this.length,this.result=new Uint8Array(e);for(var f=Math.ceil(e/this.hmac.HMAC_SIZE),g=1;f>=g;++g){var h=(g-1)*this.hmac.HMAC_SIZE,i=(f>g?0:e%this.hmac.HMAC_SIZE)||this.hmac.HMAC_SIZE;this.hmac.reset().process(a),this.hmac.hash.asm.pbkdf2_generate_block(this.hmac.hash.pos,this.hmac.hash.len,g,b,0),this.result.set(this.hmac.hash.heap.subarray(0,i),h)}return this}function Na(){return null===yc&&(yc=new La),yc}function Oa(a,b,c,d){if(void 0===a)throw new SyntaxError("password required");if(void 0===b)throw new SyntaxError("salt required");return Ka().reset({password:a}).generate(b,c,d).result}function Pa(a,b,c,d){var e=Oa(a,b,c,d);return j(e)}function Qa(a,b,c,d){var e=Oa(a,b,c,d);return k(e)}function Ra(a,b,c,d){if(void 0===a)throw new SyntaxError("password required");if(void 0===b)throw new SyntaxError("salt required");return Na().reset({password:a}).generate(b,c,d).result}function Sa(a,b,c,d){var e=Ra(a,b,c,d);return j(e)}function Ta(a,b,c,d){var e=Ra(a,b,c,d);return k(e)}function Ua(){if(void 0!==Ec)d=new Uint8Array(32),zc.call(Ec,d),Hc(d);else{var a,c,d=new Ub(3);d[0]=Cc(),d[1]=Bc(),d[2]=Fc(),d=new Uint8Array(d.buffer);var e=Na();for(a=0;100>a;a++)d=e.reset({password:d}).generate(b.location.href,1e3,32).result,c=Fc(),d[0]^=c>>>24,d[1]^=c>>>16,d[2]^=c>>>8,d[3]^=c;Hc(d)}Ic=0,Jc=!0}function Va(a){if(!o(a)&&!q(a))throw new TypeError("bad seed type");var b=a.byteOffest||0,c=a.byteLength||a.length,d=new Uint8Array(a.buffer||a,b,c);Hc(d),Ic=0;for(var e=0,f=0;f<d.length;f++)e|=d[f],d[f]=0;return 0!==e&&(Lc+=4*c),Kc=Lc>=Mc}function Wa(a){if(Jc||Ua(),!Kc&&void 0===Ec){if(!Nc)throw new e("No strong PRNGs available. Use asmCrypto.random.seed().");void 0!==Vb&&Vb.error("No strong PRNGs available; your security is greatly lowered. Use asmCrypto.random.seed().")}if(!Oc&&!Kc&&void 0!==Ec&&void 0!==Vb){var b=(new Error).stack;Pc[b]|=0,Pc[b]++||Vb.warn("asmCrypto PRNG not seeded; your security relies on your system PRNG. If this is not acceptable, use asmCrypto.random.seed().")}if(!o(a)&&!q(a))throw new TypeError("unexpected buffer type");var c,d,f=a.byteOffset||0,g=a.byteLength||a.length,h=new Uint8Array(a.buffer||a,f,g);for(void 0!==Ec&&zc.call(Ec,h),c=0;g>c;c++)0===(3&c)&&(Ic>=1099511627776&&Ua(),d=Gc(),Ic++),h[c]^=d,d>>>=8;return a}function Xa(){(!Jc||Ic>=1099511627776)&&Ua();var a=(1048576*Gc()+(Gc()>>>12))/4503599627370496;return Ic+=2,a}function Ya(a,b){return a*b|0}function Za(a,b,c){"use asm";var d=0;var e=new a.Uint32Array(c);var f=a.Math.imul;function g(a){a=a|0;d=a=a+31&-32;return a|0}function h(a){a=a|0;var b=0;b=d;d=b+(a+31&-32)|0;return b|0}function i(a){a=a|0;d=d-(a+31&-32)|0}function j(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;if((b|0)>(c|0)){for(;(d|0)<(a|0);d=d+4|0){e[c+d>>2]=e[b+d>>2]}}else{for(d=a-4|0;(d|0)>=0;d=d-4|0){e[c+d>>2]=e[b+d>>2]}}}function k(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;for(;(d|0)<(a|0);d=d+4|0){e[c+d>>2]=b}}function l(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var f=0,g=0,h=0,i=0,j=0;if((d|0)<=0)d=b;if((d|0)<(b|0))b=d;g=1;for(;(j|0)<(b|0);j=j+4|0){f=~e[a+j>>2];h=(f&65535)+g|0;i=(f>>>16)+(h>>>16)|0;e[c+j>>2]=i<<16|h&65535;g=i>>>16}for(;(j|0)<(d|0);j=j+4|0){e[c+j>>2]=g-1|0}return g|0}function m(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var f=0,g=0,h=0;if((b|0)>(d|0)){for(h=b-4|0;(h|0)>=(d|0);h=h-4|0){if(e[a+h>>2]|0)return 1}}else{for(h=d-4|0;(h|0)>=(b|0);h=h-4|0){if(e[c+h>>2]|0)return-1}}for(;(h|0)>=0;h=h-4|0){f=e[a+h>>2]|0,g=e[c+h>>2]|0;if(f>>>0<g>>>0)return-1;if(f>>>0>g>>>0)return 1}return 0}function n(a,b){a=a|0;b=b|0;var c=0;for(c=b-4|0;(c|0)>=0;c=c-4|0){if(e[a+c>>2]|0)return c+4|0}return 0}function o(a,b,c,d,f,g){a=a|0;b=b|0;c=c|0;d=d|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0;if((b|0)<(d|0)){k=a,a=c,c=k;k=b,b=d,d=k}if((g|0)<=0)g=b+4|0;if((g|0)<(d|0))b=d=g;for(;(m|0)<(d|0);m=m+4|0){h=e[a+m>>2]|0;i=e[c+m>>2]|0;k=((h&65535)+(i&65535)|0)+j|0;l=((h>>>16)+(i>>>16)|0)+(k>>>16)|0;e[f+m>>2]=k&65535|l<<16;j=l>>>16}for(;(m|0)<(b|0);m=m+4|0){h=e[a+m>>2]|0;k=(h&65535)+j|0;l=(h>>>16)+(k>>>16)|0;e[f+m>>2]=k&65535|l<<16;j=l>>>16}for(;(m|0)<(g|0);m=m+4|0){e[f+m>>2]=j|0;j=0}return j|0}function p(a,b,c,d,f,g){a=a|0;b=b|0;c=c|0;d=d|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0;if((g|0)<=0)g=(b|0)>(d|0)?b+4|0:d+4|0;if((g|0)<(b|0))b=g;if((g|0)<(d|0))d=g;if((b|0)<(d|0)){for(;(m|0)<(b|0);m=m+4|0){h=e[a+m>>2]|0;i=e[c+m>>2]|0;k=((h&65535)-(i&65535)|0)+j|0;l=((h>>>16)-(i>>>16)|0)+(k>>16)|0;e[f+m>>2]=k&65535|l<<16;j=l>>16}for(;(m|0)<(d|0);m=m+4|0){i=e[c+m>>2]|0;k=j-(i&65535)|0;l=(k>>16)-(i>>>16)|0;e[f+m>>2]=k&65535|l<<16;j=l>>16}}else{for(;(m|0)<(d|0);m=m+4|0){h=e[a+m>>2]|0;i=e[c+m>>2]|0;k=((h&65535)-(i&65535)|0)+j|0;l=((h>>>16)-(i>>>16)|0)+(k>>16)|0;e[f+m>>2]=k&65535|l<<16;j=l>>16}for(;(m|0)<(b|0);m=m+4|0){h=e[a+m>>2]|0;k=(h&65535)+j|0;l=(h>>>16)+(k>>16)|0;e[f+m>>2]=k&65535|l<<16;j=l>>16}}for(;(m|0)<(g|0);m=m+4|0){e[f+m>>2]=j|0}return j|0}function q(a,b,c,d,g,h){a=a|0;b=b|0;c=c|0;d=d|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,$=0,_=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0;if((b|0)>(d|0)){ca=a,da=b;a=c,b=d;c=ca,d=da}fa=b+d|0;if((h|0)>(fa|0)|(h|0)<=0)h=fa;if((h|0)<(b|0))b=h;if((h|0)<(d|0))d=h;for(;(ga|0)<(b|0);ga=ga+32|0){ha=a+ga|0;q=e[(ha|0)>>2]|0,r=e[(ha|4)>>2]|0,s=e[(ha|8)>>2]|0,t=e[(ha|12)>>2]|0,u=e[(ha|16)>>2]|0,v=e[(ha|20)>>2]|0,w=e[(ha|24)>>2]|0,x=e[(ha|28)>>2]|0,i=q&65535,j=r&65535,k=s&65535,l=t&65535,m=u&65535,n=v&65535,o=w&65535,p=x&65535,q=q>>>16,r=r>>>16,s=s>>>16,t=t>>>16,u=u>>>16,v=v>>>16,w=w>>>16,x=x>>>16;W=X=Y=Z=$=_=aa=ba=0;for(ia=0;(ia|0)<(d|0);ia=ia+32|0){ja=c+ia|0;ka=g+(ga+ia|0)|0;G=e[(ja|0)>>2]|0,H=e[(ja|4)>>2]|0,I=e[(ja|8)>>2]|0,J=e[(ja|12)>>2]|0,K=e[(ja|16)>>2]|0,L=e[(ja|20)>>2]|0,M=e[(ja|24)>>2]|0,N=e[(ja|28)>>2]|0,y=G&65535,z=H&65535,A=I&65535,B=J&65535,C=K&65535,D=L&65535,E=M&65535,F=N&65535,G=G>>>16,H=H>>>16,I=I>>>16,J=J>>>16,K=K>>>16,L=L>>>16,M=M>>>16,N=N>>>16;O=e[(ka|0)>>2]|0,P=e[(ka|4)>>2]|0,Q=e[(ka|8)>>2]|0,R=e[(ka|12)>>2]|0,S=e[(ka|16)>>2]|0,T=e[(ka|20)>>2]|0,U=e[(ka|24)>>2]|0,V=e[(ka|28)>>2]|0;ca=((f(i,y)|0)+(W&65535)|0)+(O&65535)|0;da=((f(q,y)|0)+(W>>>16)|0)+(O>>>16)|0;ea=((f(i,G)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(q,G)|0)+(da>>>16)|0)+(ea>>>16)|0;O=ea<<16|ca&65535;ca=((f(i,z)|0)+(fa&65535)|0)+(P&65535)|0;da=((f(q,z)|0)+(fa>>>16)|0)+(P>>>16)|0;ea=((f(i,H)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(q,H)|0)+(da>>>16)|0)+(ea>>>16)|0;P=ea<<16|ca&65535;ca=((f(i,A)|0)+(fa&65535)|0)+(Q&65535)|0;da=((f(q,A)|0)+(fa>>>16)|0)+(Q>>>16)|0;ea=((f(i,I)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(q,I)|0)+(da>>>16)|0)+(ea>>>16)|0;Q=ea<<16|ca&65535;ca=((f(i,B)|0)+(fa&65535)|0)+(R&65535)|0;da=((f(q,B)|0)+(fa>>>16)|0)+(R>>>16)|0;ea=((f(i,J)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(q,J)|0)+(da>>>16)|0)+(ea>>>16)|0;R=ea<<16|ca&65535;ca=((f(i,C)|0)+(fa&65535)|0)+(S&65535)|0;da=((f(q,C)|0)+(fa>>>16)|0)+(S>>>16)|0;ea=((f(i,K)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(q,K)|0)+(da>>>16)|0)+(ea>>>16)|0;S=ea<<16|ca&65535;ca=((f(i,D)|0)+(fa&65535)|0)+(T&65535)|0;da=((f(q,D)|0)+(fa>>>16)|0)+(T>>>16)|0;ea=((f(i,L)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(q,L)|0)+(da>>>16)|0)+(ea>>>16)|0;T=ea<<16|ca&65535;ca=((f(i,E)|0)+(fa&65535)|0)+(U&65535)|0;da=((f(q,E)|0)+(fa>>>16)|0)+(U>>>16)|0;ea=((f(i,M)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(q,M)|0)+(da>>>16)|0)+(ea>>>16)|0;U=ea<<16|ca&65535;ca=((f(i,F)|0)+(fa&65535)|0)+(V&65535)|0;da=((f(q,F)|0)+(fa>>>16)|0)+(V>>>16)|0;ea=((f(i,N)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(q,N)|0)+(da>>>16)|0)+(ea>>>16)|0;V=ea<<16|ca&65535;W=fa;ca=((f(j,y)|0)+(X&65535)|0)+(P&65535)|0;da=((f(r,y)|0)+(X>>>16)|0)+(P>>>16)|0;ea=((f(j,G)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(r,G)|0)+(da>>>16)|0)+(ea>>>16)|0;P=ea<<16|ca&65535;ca=((f(j,z)|0)+(fa&65535)|0)+(Q&65535)|0;da=((f(r,z)|0)+(fa>>>16)|0)+(Q>>>16)|0;ea=((f(j,H)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(r,H)|0)+(da>>>16)|0)+(ea>>>16)|0;Q=ea<<16|ca&65535;ca=((f(j,A)|0)+(fa&65535)|0)+(R&65535)|0;da=((f(r,A)|0)+(fa>>>16)|0)+(R>>>16)|0;ea=((f(j,I)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(r,I)|0)+(da>>>16)|0)+(ea>>>16)|0;R=ea<<16|ca&65535;ca=((f(j,B)|0)+(fa&65535)|0)+(S&65535)|0;da=((f(r,B)|0)+(fa>>>16)|0)+(S>>>16)|0;ea=((f(j,J)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(r,J)|0)+(da>>>16)|0)+(ea>>>16)|0;S=ea<<16|ca&65535;ca=((f(j,C)|0)+(fa&65535)|0)+(T&65535)|0;da=((f(r,C)|0)+(fa>>>16)|0)+(T>>>16)|0;ea=((f(j,K)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(r,K)|0)+(da>>>16)|0)+(ea>>>16)|0;T=ea<<16|ca&65535;ca=((f(j,D)|0)+(fa&65535)|0)+(U&65535)|0;da=((f(r,D)|0)+(fa>>>16)|0)+(U>>>16)|0;ea=((f(j,L)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(r,L)|0)+(da>>>16)|0)+(ea>>>16)|0;U=ea<<16|ca&65535;ca=((f(j,E)|0)+(fa&65535)|0)+(V&65535)|0;da=((f(r,E)|0)+(fa>>>16)|0)+(V>>>16)|0;ea=((f(j,M)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(r,M)|0)+(da>>>16)|0)+(ea>>>16)|0;V=ea<<16|ca&65535;ca=((f(j,F)|0)+(fa&65535)|0)+(W&65535)|0;da=((f(r,F)|0)+(fa>>>16)|0)+(W>>>16)|0;ea=((f(j,N)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(r,N)|0)+(da>>>16)|0)+(ea>>>16)|0;W=ea<<16|ca&65535;X=fa;ca=((f(k,y)|0)+(Y&65535)|0)+(Q&65535)|0;da=((f(s,y)|0)+(Y>>>16)|0)+(Q>>>16)|0;ea=((f(k,G)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(s,G)|0)+(da>>>16)|0)+(ea>>>16)|0;Q=ea<<16|ca&65535;ca=((f(k,z)|0)+(fa&65535)|0)+(R&65535)|0;da=((f(s,z)|0)+(fa>>>16)|0)+(R>>>16)|0;ea=((f(k,H)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(s,H)|0)+(da>>>16)|0)+(ea>>>16)|0;R=ea<<16|ca&65535;ca=((f(k,A)|0)+(fa&65535)|0)+(S&65535)|0;da=((f(s,A)|0)+(fa>>>16)|0)+(S>>>16)|0;ea=((f(k,I)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(s,I)|0)+(da>>>16)|0)+(ea>>>16)|0;S=ea<<16|ca&65535;ca=((f(k,B)|0)+(fa&65535)|0)+(T&65535)|0;da=((f(s,B)|0)+(fa>>>16)|0)+(T>>>16)|0;ea=((f(k,J)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(s,J)|0)+(da>>>16)|0)+(ea>>>16)|0;T=ea<<16|ca&65535;ca=((f(k,C)|0)+(fa&65535)|0)+(U&65535)|0;da=((f(s,C)|0)+(fa>>>16)|0)+(U>>>16)|0;ea=((f(k,K)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(s,K)|0)+(da>>>16)|0)+(ea>>>16)|0;U=ea<<16|ca&65535;ca=((f(k,D)|0)+(fa&65535)|0)+(V&65535)|0;da=((f(s,D)|0)+(fa>>>16)|0)+(V>>>16)|0;ea=((f(k,L)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(s,L)|0)+(da>>>16)|0)+(ea>>>16)|0;V=ea<<16|ca&65535;ca=((f(k,E)|0)+(fa&65535)|0)+(W&65535)|0;da=((f(s,E)|0)+(fa>>>16)|0)+(W>>>16)|0;ea=((f(k,M)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(s,M)|0)+(da>>>16)|0)+(ea>>>16)|0;W=ea<<16|ca&65535;ca=((f(k,F)|0)+(fa&65535)|0)+(X&65535)|0;da=((f(s,F)|0)+(fa>>>16)|0)+(X>>>16)|0;ea=((f(k,N)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(s,N)|0)+(da>>>16)|0)+(ea>>>16)|0;X=ea<<16|ca&65535;Y=fa;ca=((f(l,y)|0)+(Z&65535)|0)+(R&65535)|0;da=((f(t,y)|0)+(Z>>>16)|0)+(R>>>16)|0;ea=((f(l,G)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(t,G)|0)+(da>>>16)|0)+(ea>>>16)|0;R=ea<<16|ca&65535;ca=((f(l,z)|0)+(fa&65535)|0)+(S&65535)|0;da=((f(t,z)|0)+(fa>>>16)|0)+(S>>>16)|0;ea=((f(l,H)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(t,H)|0)+(da>>>16)|0)+(ea>>>16)|0;S=ea<<16|ca&65535;ca=((f(l,A)|0)+(fa&65535)|0)+(T&65535)|0;da=((f(t,A)|0)+(fa>>>16)|0)+(T>>>16)|0;ea=((f(l,I)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(t,I)|0)+(da>>>16)|0)+(ea>>>16)|0;T=ea<<16|ca&65535;ca=((f(l,B)|0)+(fa&65535)|0)+(U&65535)|0;da=((f(t,B)|0)+(fa>>>16)|0)+(U>>>16)|0;ea=((f(l,J)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(t,J)|0)+(da>>>16)|0)+(ea>>>16)|0;U=ea<<16|ca&65535;ca=((f(l,C)|0)+(fa&65535)|0)+(V&65535)|0;da=((f(t,C)|0)+(fa>>>16)|0)+(V>>>16)|0;ea=((f(l,K)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(t,K)|0)+(da>>>16)|0)+(ea>>>16)|0;V=ea<<16|ca&65535;ca=((f(l,D)|0)+(fa&65535)|0)+(W&65535)|0;da=((f(t,D)|0)+(fa>>>16)|0)+(W>>>16)|0;ea=((f(l,L)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(t,L)|0)+(da>>>16)|0)+(ea>>>16)|0;W=ea<<16|ca&65535;ca=((f(l,E)|0)+(fa&65535)|0)+(X&65535)|0;da=((f(t,E)|0)+(fa>>>16)|0)+(X>>>16)|0;ea=((f(l,M)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(t,M)|0)+(da>>>16)|0)+(ea>>>16)|0;X=ea<<16|ca&65535;ca=((f(l,F)|0)+(fa&65535)|0)+(Y&65535)|0;da=((f(t,F)|0)+(fa>>>16)|0)+(Y>>>16)|0;ea=((f(l,N)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(t,N)|0)+(da>>>16)|0)+(ea>>>16)|0;Y=ea<<16|ca&65535;Z=fa;ca=((f(m,y)|0)+($&65535)|0)+(S&65535)|0;da=((f(u,y)|0)+($>>>16)|0)+(S>>>16)|0;ea=((f(m,G)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(u,G)|0)+(da>>>16)|0)+(ea>>>16)|0;S=ea<<16|ca&65535;ca=((f(m,z)|0)+(fa&65535)|0)+(T&65535)|0;da=((f(u,z)|0)+(fa>>>16)|0)+(T>>>16)|0;ea=((f(m,H)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(u,H)|0)+(da>>>16)|0)+(ea>>>16)|0;T=ea<<16|ca&65535;ca=((f(m,A)|0)+(fa&65535)|0)+(U&65535)|0;da=((f(u,A)|0)+(fa>>>16)|0)+(U>>>16)|0;ea=((f(m,I)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(u,I)|0)+(da>>>16)|0)+(ea>>>16)|0;U=ea<<16|ca&65535;ca=((f(m,B)|0)+(fa&65535)|0)+(V&65535)|0;da=((f(u,B)|0)+(fa>>>16)|0)+(V>>>16)|0;ea=((f(m,J)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(u,J)|0)+(da>>>16)|0)+(ea>>>16)|0;V=ea<<16|ca&65535;ca=((f(m,C)|0)+(fa&65535)|0)+(W&65535)|0;da=((f(u,C)|0)+(fa>>>16)|0)+(W>>>16)|0;
	ea=((f(m,K)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(u,K)|0)+(da>>>16)|0)+(ea>>>16)|0;W=ea<<16|ca&65535;ca=((f(m,D)|0)+(fa&65535)|0)+(X&65535)|0;da=((f(u,D)|0)+(fa>>>16)|0)+(X>>>16)|0;ea=((f(m,L)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(u,L)|0)+(da>>>16)|0)+(ea>>>16)|0;X=ea<<16|ca&65535;ca=((f(m,E)|0)+(fa&65535)|0)+(Y&65535)|0;da=((f(u,E)|0)+(fa>>>16)|0)+(Y>>>16)|0;ea=((f(m,M)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(u,M)|0)+(da>>>16)|0)+(ea>>>16)|0;Y=ea<<16|ca&65535;ca=((f(m,F)|0)+(fa&65535)|0)+(Z&65535)|0;da=((f(u,F)|0)+(fa>>>16)|0)+(Z>>>16)|0;ea=((f(m,N)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(u,N)|0)+(da>>>16)|0)+(ea>>>16)|0;Z=ea<<16|ca&65535;$=fa;ca=((f(n,y)|0)+(_&65535)|0)+(T&65535)|0;da=((f(v,y)|0)+(_>>>16)|0)+(T>>>16)|0;ea=((f(n,G)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(v,G)|0)+(da>>>16)|0)+(ea>>>16)|0;T=ea<<16|ca&65535;ca=((f(n,z)|0)+(fa&65535)|0)+(U&65535)|0;da=((f(v,z)|0)+(fa>>>16)|0)+(U>>>16)|0;ea=((f(n,H)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(v,H)|0)+(da>>>16)|0)+(ea>>>16)|0;U=ea<<16|ca&65535;ca=((f(n,A)|0)+(fa&65535)|0)+(V&65535)|0;da=((f(v,A)|0)+(fa>>>16)|0)+(V>>>16)|0;ea=((f(n,I)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(v,I)|0)+(da>>>16)|0)+(ea>>>16)|0;V=ea<<16|ca&65535;ca=((f(n,B)|0)+(fa&65535)|0)+(W&65535)|0;da=((f(v,B)|0)+(fa>>>16)|0)+(W>>>16)|0;ea=((f(n,J)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(v,J)|0)+(da>>>16)|0)+(ea>>>16)|0;W=ea<<16|ca&65535;ca=((f(n,C)|0)+(fa&65535)|0)+(X&65535)|0;da=((f(v,C)|0)+(fa>>>16)|0)+(X>>>16)|0;ea=((f(n,K)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(v,K)|0)+(da>>>16)|0)+(ea>>>16)|0;X=ea<<16|ca&65535;ca=((f(n,D)|0)+(fa&65535)|0)+(Y&65535)|0;da=((f(v,D)|0)+(fa>>>16)|0)+(Y>>>16)|0;ea=((f(n,L)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(v,L)|0)+(da>>>16)|0)+(ea>>>16)|0;Y=ea<<16|ca&65535;ca=((f(n,E)|0)+(fa&65535)|0)+(Z&65535)|0;da=((f(v,E)|0)+(fa>>>16)|0)+(Z>>>16)|0;ea=((f(n,M)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(v,M)|0)+(da>>>16)|0)+(ea>>>16)|0;Z=ea<<16|ca&65535;ca=((f(n,F)|0)+(fa&65535)|0)+($&65535)|0;da=((f(v,F)|0)+(fa>>>16)|0)+($>>>16)|0;ea=((f(n,N)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(v,N)|0)+(da>>>16)|0)+(ea>>>16)|0;$=ea<<16|ca&65535;_=fa;ca=((f(o,y)|0)+(aa&65535)|0)+(U&65535)|0;da=((f(w,y)|0)+(aa>>>16)|0)+(U>>>16)|0;ea=((f(o,G)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(w,G)|0)+(da>>>16)|0)+(ea>>>16)|0;U=ea<<16|ca&65535;ca=((f(o,z)|0)+(fa&65535)|0)+(V&65535)|0;da=((f(w,z)|0)+(fa>>>16)|0)+(V>>>16)|0;ea=((f(o,H)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(w,H)|0)+(da>>>16)|0)+(ea>>>16)|0;V=ea<<16|ca&65535;ca=((f(o,A)|0)+(fa&65535)|0)+(W&65535)|0;da=((f(w,A)|0)+(fa>>>16)|0)+(W>>>16)|0;ea=((f(o,I)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(w,I)|0)+(da>>>16)|0)+(ea>>>16)|0;W=ea<<16|ca&65535;ca=((f(o,B)|0)+(fa&65535)|0)+(X&65535)|0;da=((f(w,B)|0)+(fa>>>16)|0)+(X>>>16)|0;ea=((f(o,J)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(w,J)|0)+(da>>>16)|0)+(ea>>>16)|0;X=ea<<16|ca&65535;ca=((f(o,C)|0)+(fa&65535)|0)+(Y&65535)|0;da=((f(w,C)|0)+(fa>>>16)|0)+(Y>>>16)|0;ea=((f(o,K)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(w,K)|0)+(da>>>16)|0)+(ea>>>16)|0;Y=ea<<16|ca&65535;ca=((f(o,D)|0)+(fa&65535)|0)+(Z&65535)|0;da=((f(w,D)|0)+(fa>>>16)|0)+(Z>>>16)|0;ea=((f(o,L)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(w,L)|0)+(da>>>16)|0)+(ea>>>16)|0;Z=ea<<16|ca&65535;ca=((f(o,E)|0)+(fa&65535)|0)+($&65535)|0;da=((f(w,E)|0)+(fa>>>16)|0)+($>>>16)|0;ea=((f(o,M)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(w,M)|0)+(da>>>16)|0)+(ea>>>16)|0;$=ea<<16|ca&65535;ca=((f(o,F)|0)+(fa&65535)|0)+(_&65535)|0;da=((f(w,F)|0)+(fa>>>16)|0)+(_>>>16)|0;ea=((f(o,N)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(w,N)|0)+(da>>>16)|0)+(ea>>>16)|0;_=ea<<16|ca&65535;aa=fa;ca=((f(p,y)|0)+(ba&65535)|0)+(V&65535)|0;da=((f(x,y)|0)+(ba>>>16)|0)+(V>>>16)|0;ea=((f(p,G)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(x,G)|0)+(da>>>16)|0)+(ea>>>16)|0;V=ea<<16|ca&65535;ca=((f(p,z)|0)+(fa&65535)|0)+(W&65535)|0;da=((f(x,z)|0)+(fa>>>16)|0)+(W>>>16)|0;ea=((f(p,H)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(x,H)|0)+(da>>>16)|0)+(ea>>>16)|0;W=ea<<16|ca&65535;ca=((f(p,A)|0)+(fa&65535)|0)+(X&65535)|0;da=((f(x,A)|0)+(fa>>>16)|0)+(X>>>16)|0;ea=((f(p,I)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(x,I)|0)+(da>>>16)|0)+(ea>>>16)|0;X=ea<<16|ca&65535;ca=((f(p,B)|0)+(fa&65535)|0)+(Y&65535)|0;da=((f(x,B)|0)+(fa>>>16)|0)+(Y>>>16)|0;ea=((f(p,J)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(x,J)|0)+(da>>>16)|0)+(ea>>>16)|0;Y=ea<<16|ca&65535;ca=((f(p,C)|0)+(fa&65535)|0)+(Z&65535)|0;da=((f(x,C)|0)+(fa>>>16)|0)+(Z>>>16)|0;ea=((f(p,K)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(x,K)|0)+(da>>>16)|0)+(ea>>>16)|0;Z=ea<<16|ca&65535;ca=((f(p,D)|0)+(fa&65535)|0)+($&65535)|0;da=((f(x,D)|0)+(fa>>>16)|0)+($>>>16)|0;ea=((f(p,L)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(x,L)|0)+(da>>>16)|0)+(ea>>>16)|0;$=ea<<16|ca&65535;ca=((f(p,E)|0)+(fa&65535)|0)+(_&65535)|0;da=((f(x,E)|0)+(fa>>>16)|0)+(_>>>16)|0;ea=((f(p,M)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(x,M)|0)+(da>>>16)|0)+(ea>>>16)|0;_=ea<<16|ca&65535;ca=((f(p,F)|0)+(fa&65535)|0)+(aa&65535)|0;da=((f(x,F)|0)+(fa>>>16)|0)+(aa>>>16)|0;ea=((f(p,N)|0)+(da&65535)|0)+(ca>>>16)|0;fa=((f(x,N)|0)+(da>>>16)|0)+(ea>>>16)|0;aa=ea<<16|ca&65535;ba=fa;e[(ka|0)>>2]=O,e[(ka|4)>>2]=P,e[(ka|8)>>2]=Q,e[(ka|12)>>2]=R,e[(ka|16)>>2]=S,e[(ka|20)>>2]=T,e[(ka|24)>>2]=U,e[(ka|28)>>2]=V}ka=g+(ga+ia|0)|0;e[(ka|0)>>2]=W,e[(ka|4)>>2]=X,e[(ka|8)>>2]=Y,e[(ka|12)>>2]=Z,e[(ka|16)>>2]=$,e[(ka|20)>>2]=_,e[(ka|24)>>2]=aa,e[(ka|28)>>2]=ba}}function r(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,$=0,_=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0;for(;(ja|0)<(b|0);ja=ja+4|0){oa=c+(ja<<1)|0;n=e[a+ja>>2]|0,d=n&65535,n=n>>>16;_=f(d,d)|0;aa=(f(d,n)|0)+(_>>>17)|0;ba=(f(n,n)|0)+(aa>>>15)|0;e[oa>>2]=aa<<17|_&131071;e[(oa|4)>>2]=ba}for(ia=0;(ia|0)<(b|0);ia=ia+8|0){ma=a+ia|0,oa=c+(ia<<1)|0;n=e[ma>>2]|0,d=n&65535,n=n>>>16;D=e[(ma|4)>>2]|0,v=D&65535,D=D>>>16;_=f(d,v)|0;aa=(f(d,D)|0)+(_>>>16)|0;ba=(f(n,v)|0)+(aa&65535)|0;ea=((f(n,D)|0)+(aa>>>16)|0)+(ba>>>16)|0;fa=e[(oa|4)>>2]|0;_=(fa&65535)+((_&65535)<<1)|0;ba=((fa>>>16)+((ba&65535)<<1)|0)+(_>>>16)|0;e[(oa|4)>>2]=ba<<16|_&65535;ca=ba>>>16;fa=e[(oa|8)>>2]|0;_=((fa&65535)+((ea&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(ea>>>16<<1)|0)+(_>>>16)|0;e[(oa|8)>>2]=ba<<16|_&65535;ca=ba>>>16;if(ca){fa=e[(oa|12)>>2]|0;_=(fa&65535)+ca|0;ba=(fa>>>16)+(_>>>16)|0;e[(oa|12)>>2]=ba<<16|_&65535}}for(ia=0;(ia|0)<(b|0);ia=ia+16|0){ma=a+ia|0,oa=c+(ia<<1)|0;n=e[ma>>2]|0,d=n&65535,n=n>>>16,o=e[(ma|4)>>2]|0,g=o&65535,o=o>>>16;D=e[(ma|8)>>2]|0,v=D&65535,D=D>>>16,E=e[(ma|12)>>2]|0,w=E&65535,E=E>>>16;_=f(d,v)|0;aa=f(n,v)|0;ba=((f(d,D)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(n,D)|0)+(aa>>>16)|0)+(ba>>>16)|0;L=ba<<16|_&65535;_=(f(d,w)|0)+(ea&65535)|0;aa=(f(n,w)|0)+(ea>>>16)|0;ba=((f(d,E)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(n,E)|0)+(aa>>>16)|0)+(ba>>>16)|0;M=ba<<16|_&65535;N=ea;_=(f(g,v)|0)+(M&65535)|0;aa=(f(o,v)|0)+(M>>>16)|0;ba=((f(g,D)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(o,D)|0)+(aa>>>16)|0)+(ba>>>16)|0;M=ba<<16|_&65535;_=((f(g,w)|0)+(N&65535)|0)+(ea&65535)|0;aa=((f(o,w)|0)+(N>>>16)|0)+(ea>>>16)|0;ba=((f(g,E)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(o,E)|0)+(aa>>>16)|0)+(ba>>>16)|0;N=ba<<16|_&65535;O=ea;fa=e[(oa|8)>>2]|0;_=(fa&65535)+((L&65535)<<1)|0;ba=((fa>>>16)+(L>>>16<<1)|0)+(_>>>16)|0;e[(oa|8)>>2]=ba<<16|_&65535;ca=ba>>>16;fa=e[(oa|12)>>2]|0;_=((fa&65535)+((M&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(M>>>16<<1)|0)+(_>>>16)|0;e[(oa|12)>>2]=ba<<16|_&65535;ca=ba>>>16;fa=e[(oa|16)>>2]|0;_=((fa&65535)+((N&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(N>>>16<<1)|0)+(_>>>16)|0;e[(oa|16)>>2]=ba<<16|_&65535;ca=ba>>>16;fa=e[(oa|20)>>2]|0;_=((fa&65535)+((O&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(O>>>16<<1)|0)+(_>>>16)|0;e[(oa|20)>>2]=ba<<16|_&65535;ca=ba>>>16;for(la=24;!!ca&(la|0)<32;la=la+4|0){fa=e[(oa|la)>>2]|0;_=(fa&65535)+ca|0;ba=(fa>>>16)+(_>>>16)|0;e[(oa|la)>>2]=ba<<16|_&65535;ca=ba>>>16}}for(ia=0;(ia|0)<(b|0);ia=ia+32|0){ma=a+ia|0,oa=c+(ia<<1)|0;n=e[ma>>2]|0,d=n&65535,n=n>>>16,o=e[(ma|4)>>2]|0,g=o&65535,o=o>>>16,p=e[(ma|8)>>2]|0,h=p&65535,p=p>>>16,q=e[(ma|12)>>2]|0,i=q&65535,q=q>>>16;D=e[(ma|16)>>2]|0,v=D&65535,D=D>>>16,E=e[(ma|20)>>2]|0,w=E&65535,E=E>>>16,F=e[(ma|24)>>2]|0,x=F&65535,F=F>>>16,G=e[(ma|28)>>2]|0,y=G&65535,G=G>>>16;_=f(d,v)|0;aa=f(n,v)|0;ba=((f(d,D)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(n,D)|0)+(aa>>>16)|0)+(ba>>>16)|0;L=ba<<16|_&65535;_=(f(d,w)|0)+(ea&65535)|0;aa=(f(n,w)|0)+(ea>>>16)|0;ba=((f(d,E)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(n,E)|0)+(aa>>>16)|0)+(ba>>>16)|0;M=ba<<16|_&65535;_=(f(d,x)|0)+(ea&65535)|0;aa=(f(n,x)|0)+(ea>>>16)|0;ba=((f(d,F)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(n,F)|0)+(aa>>>16)|0)+(ba>>>16)|0;N=ba<<16|_&65535;_=(f(d,y)|0)+(ea&65535)|0;aa=(f(n,y)|0)+(ea>>>16)|0;ba=((f(d,G)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(n,G)|0)+(aa>>>16)|0)+(ba>>>16)|0;O=ba<<16|_&65535;P=ea;_=(f(g,v)|0)+(M&65535)|0;aa=(f(o,v)|0)+(M>>>16)|0;ba=((f(g,D)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(o,D)|0)+(aa>>>16)|0)+(ba>>>16)|0;M=ba<<16|_&65535;_=((f(g,w)|0)+(N&65535)|0)+(ea&65535)|0;aa=((f(o,w)|0)+(N>>>16)|0)+(ea>>>16)|0;ba=((f(g,E)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(o,E)|0)+(aa>>>16)|0)+(ba>>>16)|0;N=ba<<16|_&65535;_=((f(g,x)|0)+(O&65535)|0)+(ea&65535)|0;aa=((f(o,x)|0)+(O>>>16)|0)+(ea>>>16)|0;ba=((f(g,F)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(o,F)|0)+(aa>>>16)|0)+(ba>>>16)|0;O=ba<<16|_&65535;_=((f(g,y)|0)+(P&65535)|0)+(ea&65535)|0;aa=((f(o,y)|0)+(P>>>16)|0)+(ea>>>16)|0;ba=((f(g,G)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(o,G)|0)+(aa>>>16)|0)+(ba>>>16)|0;P=ba<<16|_&65535;Q=ea;_=(f(h,v)|0)+(N&65535)|0;aa=(f(p,v)|0)+(N>>>16)|0;ba=((f(h,D)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(p,D)|0)+(aa>>>16)|0)+(ba>>>16)|0;N=ba<<16|_&65535;_=((f(h,w)|0)+(O&65535)|0)+(ea&65535)|0;aa=((f(p,w)|0)+(O>>>16)|0)+(ea>>>16)|0;ba=((f(h,E)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(p,E)|0)+(aa>>>16)|0)+(ba>>>16)|0;O=ba<<16|_&65535;_=((f(h,x)|0)+(P&65535)|0)+(ea&65535)|0;aa=((f(p,x)|0)+(P>>>16)|0)+(ea>>>16)|0;ba=((f(h,F)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(p,F)|0)+(aa>>>16)|0)+(ba>>>16)|0;P=ba<<16|_&65535;_=((f(h,y)|0)+(Q&65535)|0)+(ea&65535)|0;aa=((f(p,y)|0)+(Q>>>16)|0)+(ea>>>16)|0;ba=((f(h,G)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(p,G)|0)+(aa>>>16)|0)+(ba>>>16)|0;Q=ba<<16|_&65535;R=ea;_=(f(i,v)|0)+(O&65535)|0;aa=(f(q,v)|0)+(O>>>16)|0;ba=((f(i,D)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(q,D)|0)+(aa>>>16)|0)+(ba>>>16)|0;O=ba<<16|_&65535;_=((f(i,w)|0)+(P&65535)|0)+(ea&65535)|0;aa=((f(q,w)|0)+(P>>>16)|0)+(ea>>>16)|0;ba=((f(i,E)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(q,E)|0)+(aa>>>16)|0)+(ba>>>16)|0;P=ba<<16|_&65535;_=((f(i,x)|0)+(Q&65535)|0)+(ea&65535)|0;aa=((f(q,x)|0)+(Q>>>16)|0)+(ea>>>16)|0;ba=((f(i,F)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(q,F)|0)+(aa>>>16)|0)+(ba>>>16)|0;Q=ba<<16|_&65535;_=((f(i,y)|0)+(R&65535)|0)+(ea&65535)|0;aa=((f(q,y)|0)+(R>>>16)|0)+(ea>>>16)|0;ba=((f(i,G)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(q,G)|0)+(aa>>>16)|0)+(ba>>>16)|0;R=ba<<16|_&65535;S=ea;fa=e[(oa|16)>>2]|0;_=(fa&65535)+((L&65535)<<1)|0;ba=((fa>>>16)+(L>>>16<<1)|0)+(_>>>16)|0;e[(oa|16)>>2]=ba<<16|_&65535;ca=ba>>>16;fa=e[(oa|20)>>2]|0;_=((fa&65535)+((M&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(M>>>16<<1)|0)+(_>>>16)|0;e[(oa|20)>>2]=ba<<16|_&65535;ca=ba>>>16;fa=e[(oa|24)>>2]|0;_=((fa&65535)+((N&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(N>>>16<<1)|0)+(_>>>16)|0;e[(oa|24)>>2]=ba<<16|_&65535;ca=ba>>>16;fa=e[(oa|28)>>2]|0;_=((fa&65535)+((O&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(O>>>16<<1)|0)+(_>>>16)|0;e[(oa|28)>>2]=ba<<16|_&65535;ca=ba>>>16;fa=e[oa+32>>2]|0;_=((fa&65535)+((P&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(P>>>16<<1)|0)+(_>>>16)|0;e[oa+32>>2]=ba<<16|_&65535;ca=ba>>>16;fa=e[oa+36>>2]|0;_=((fa&65535)+((Q&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(Q>>>16<<1)|0)+(_>>>16)|0;e[oa+36>>2]=ba<<16|_&65535;ca=ba>>>16;fa=e[oa+40>>2]|0;_=((fa&65535)+((R&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(R>>>16<<1)|0)+(_>>>16)|0;e[oa+40>>2]=ba<<16|_&65535;ca=ba>>>16;fa=e[oa+44>>2]|0;_=((fa&65535)+((S&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(S>>>16<<1)|0)+(_>>>16)|0;e[oa+44>>2]=ba<<16|_&65535;ca=ba>>>16;for(la=48;!!ca&(la|0)<64;la=la+4|0){fa=e[oa+la>>2]|0;_=(fa&65535)+ca|0;ba=(fa>>>16)+(_>>>16)|0;e[oa+la>>2]=ba<<16|_&65535;ca=ba>>>16}}for(ga=32;(ga|0)<(b|0);ga=ga<<1){ha=ga<<1;for(ia=0;(ia|0)<(b|0);ia=ia+ha|0){oa=c+(ia<<1)|0;da=0;for(ja=0;(ja|0)<(ga|0);ja=ja+32|0){ma=(a+ia|0)+ja|0;n=e[ma>>2]|0,d=n&65535,n=n>>>16,o=e[(ma|4)>>2]|0,g=o&65535,o=o>>>16,p=e[(ma|8)>>2]|0,h=p&65535,p=p>>>16,q=e[(ma|12)>>2]|0,i=q&65535,q=q>>>16,r=e[(ma|16)>>2]|0,j=r&65535,r=r>>>16,s=e[(ma|20)>>2]|0,k=s&65535,s=s>>>16,t=e[(ma|24)>>2]|0,l=t&65535,t=t>>>16,u=e[(ma|28)>>2]|0,m=u&65535,u=u>>>16;T=U=V=W=X=Y=Z=$=ca=0;for(ka=0;(ka|0)<(ga|0);ka=ka+32|0){na=((a+ia|0)+ga|0)+ka|0;D=e[na>>2]|0,v=D&65535,D=D>>>16,E=e[(na|4)>>2]|0,w=E&65535,E=E>>>16,F=e[(na|8)>>2]|0,x=F&65535,F=F>>>16,G=e[(na|12)>>2]|0,y=G&65535,G=G>>>16,H=e[(na|16)>>2]|0,z=H&65535,H=H>>>16,I=e[(na|20)>>2]|0,A=I&65535,I=I>>>16,J=e[(na|24)>>2]|0,B=J&65535,J=J>>>16,K=e[(na|28)>>2]|0,C=K&65535,K=K>>>16;L=M=N=O=P=Q=R=S=0;_=((f(d,v)|0)+(L&65535)|0)+(T&65535)|0;aa=((f(n,v)|0)+(L>>>16)|0)+(T>>>16)|0;ba=((f(d,D)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(n,D)|0)+(aa>>>16)|0)+(ba>>>16)|0;L=ba<<16|_&65535;_=((f(d,w)|0)+(M&65535)|0)+(ea&65535)|0;aa=((f(n,w)|0)+(M>>>16)|0)+(ea>>>16)|0;ba=((f(d,E)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(n,E)|0)+(aa>>>16)|0)+(ba>>>16)|0;M=ba<<16|_&65535;_=((f(d,x)|0)+(N&65535)|0)+(ea&65535)|0;aa=((f(n,x)|0)+(N>>>16)|0)+(ea>>>16)|0;ba=((f(d,F)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(n,F)|0)+(aa>>>16)|0)+(ba>>>16)|0;N=ba<<16|_&65535;_=((f(d,y)|0)+(O&65535)|0)+(ea&65535)|0;aa=((f(n,y)|0)+(O>>>16)|0)+(ea>>>16)|0;ba=((f(d,G)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(n,G)|0)+(aa>>>16)|0)+(ba>>>16)|0;O=ba<<16|_&65535;_=((f(d,z)|0)+(P&65535)|0)+(ea&65535)|0;aa=((f(n,z)|0)+(P>>>16)|0)+(ea>>>16)|0;ba=((f(d,H)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(n,H)|0)+(aa>>>16)|0)+(ba>>>16)|0;P=ba<<16|_&65535;_=((f(d,A)|0)+(Q&65535)|0)+(ea&65535)|0;aa=((f(n,A)|0)+(Q>>>16)|0)+(ea>>>16)|0;ba=((f(d,I)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(n,I)|0)+(aa>>>16)|0)+(ba>>>16)|0;Q=ba<<16|_&65535;_=((f(d,B)|0)+(R&65535)|0)+(ea&65535)|0;aa=((f(n,B)|0)+(R>>>16)|0)+(ea>>>16)|0;ba=((f(d,J)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(n,J)|0)+(aa>>>16)|0)+(ba>>>16)|0;R=ba<<16|_&65535;_=((f(d,C)|0)+(S&65535)|0)+(ea&65535)|0;aa=((f(n,C)|0)+(S>>>16)|0)+(ea>>>16)|0;ba=((f(d,K)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(n,K)|0)+(aa>>>16)|0)+(ba>>>16)|0;S=ba<<16|_&65535;T=ea;_=((f(g,v)|0)+(M&65535)|0)+(U&65535)|0;aa=((f(o,v)|0)+(M>>>16)|0)+(U>>>16)|0;ba=((f(g,D)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(o,D)|0)+(aa>>>16)|0)+(ba>>>16)|0;M=ba<<16|_&65535;_=((f(g,w)|0)+(N&65535)|0)+(ea&65535)|0;aa=((f(o,w)|0)+(N>>>16)|0)+(ea>>>16)|0;ba=((f(g,E)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(o,E)|0)+(aa>>>16)|0)+(ba>>>16)|0;N=ba<<16|_&65535;_=((f(g,x)|0)+(O&65535)|0)+(ea&65535)|0;aa=((f(o,x)|0)+(O>>>16)|0)+(ea>>>16)|0;ba=((f(g,F)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(o,F)|0)+(aa>>>16)|0)+(ba>>>16)|0;O=ba<<16|_&65535;_=((f(g,y)|0)+(P&65535)|0)+(ea&65535)|0;aa=((f(o,y)|0)+(P>>>16)|0)+(ea>>>16)|0;ba=((f(g,G)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(o,G)|0)+(aa>>>16)|0)+(ba>>>16)|0;P=ba<<16|_&65535;_=((f(g,z)|0)+(Q&65535)|0)+(ea&65535)|0;aa=((f(o,z)|0)+(Q>>>16)|0)+(ea>>>16)|0;ba=((f(g,H)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(o,H)|0)+(aa>>>16)|0)+(ba>>>16)|0;Q=ba<<16|_&65535;_=((f(g,A)|0)+(R&65535)|0)+(ea&65535)|0;aa=((f(o,A)|0)+(R>>>16)|0)+(ea>>>16)|0;ba=((f(g,I)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(o,I)|0)+(aa>>>16)|0)+(ba>>>16)|0;R=ba<<16|_&65535;_=((f(g,B)|0)+(S&65535)|0)+(ea&65535)|0;aa=((f(o,B)|0)+(S>>>16)|0)+(ea>>>16)|0;ba=((f(g,J)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(o,J)|0)+(aa>>>16)|0)+(ba>>>16)|0;S=ba<<16|_&65535;_=((f(g,C)|0)+(T&65535)|0)+(ea&65535)|0;aa=((f(o,C)|0)+(T>>>16)|0)+(ea>>>16)|0;ba=((f(g,K)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(o,K)|0)+(aa>>>16)|0)+(ba>>>16)|0;T=ba<<16|_&65535;U=ea;_=((f(h,v)|0)+(N&65535)|0)+(V&65535)|0;aa=((f(p,v)|0)+(N>>>16)|0)+(V>>>16)|0;ba=((f(h,D)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(p,D)|0)+(aa>>>16)|0)+(ba>>>16)|0;N=ba<<16|_&65535;_=((f(h,w)|0)+(O&65535)|0)+(ea&65535)|0;aa=((f(p,w)|0)+(O>>>16)|0)+(ea>>>16)|0;ba=((f(h,E)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(p,E)|0)+(aa>>>16)|0)+(ba>>>16)|0;O=ba<<16|_&65535;_=((f(h,x)|0)+(P&65535)|0)+(ea&65535)|0;aa=((f(p,x)|0)+(P>>>16)|0)+(ea>>>16)|0;ba=((f(h,F)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(p,F)|0)+(aa>>>16)|0)+(ba>>>16)|0;P=ba<<16|_&65535;_=((f(h,y)|0)+(Q&65535)|0)+(ea&65535)|0;aa=((f(p,y)|0)+(Q>>>16)|0)+(ea>>>16)|0;ba=((f(h,G)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(p,G)|0)+(aa>>>16)|0)+(ba>>>16)|0;Q=ba<<16|_&65535;_=((f(h,z)|0)+(R&65535)|0)+(ea&65535)|0;aa=((f(p,z)|0)+(R>>>16)|0)+(ea>>>16)|0;ba=((f(h,H)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(p,H)|0)+(aa>>>16)|0)+(ba>>>16)|0;R=ba<<16|_&65535;_=((f(h,A)|0)+(S&65535)|0)+(ea&65535)|0;aa=((f(p,A)|0)+(S>>>16)|0)+(ea>>>16)|0;ba=((f(h,I)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(p,I)|0)+(aa>>>16)|0)+(ba>>>16)|0;S=ba<<16|_&65535;_=((f(h,B)|0)+(T&65535)|0)+(ea&65535)|0;aa=((f(p,B)|0)+(T>>>16)|0)+(ea>>>16)|0;ba=((f(h,J)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(p,J)|0)+(aa>>>16)|0)+(ba>>>16)|0;T=ba<<16|_&65535;_=((f(h,C)|0)+(U&65535)|0)+(ea&65535)|0;aa=((f(p,C)|0)+(U>>>16)|0)+(ea>>>16)|0;ba=((f(h,K)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(p,K)|0)+(aa>>>16)|0)+(ba>>>16)|0;U=ba<<16|_&65535;V=ea;_=((f(i,v)|0)+(O&65535)|0)+(W&65535)|0;aa=((f(q,v)|0)+(O>>>16)|0)+(W>>>16)|0;ba=((f(i,D)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(q,D)|0)+(aa>>>16)|0)+(ba>>>16)|0;O=ba<<16|_&65535;_=((f(i,w)|0)+(P&65535)|0)+(ea&65535)|0;aa=((f(q,w)|0)+(P>>>16)|0)+(ea>>>16)|0;ba=((f(i,E)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(q,E)|0)+(aa>>>16)|0)+(ba>>>16)|0;P=ba<<16|_&65535;_=((f(i,x)|0)+(Q&65535)|0)+(ea&65535)|0;aa=((f(q,x)|0)+(Q>>>16)|0)+(ea>>>16)|0;ba=((f(i,F)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(q,F)|0)+(aa>>>16)|0)+(ba>>>16)|0;Q=ba<<16|_&65535;_=((f(i,y)|0)+(R&65535)|0)+(ea&65535)|0;aa=((f(q,y)|0)+(R>>>16)|0)+(ea>>>16)|0;ba=((f(i,G)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(q,G)|0)+(aa>>>16)|0)+(ba>>>16)|0;R=ba<<16|_&65535;_=((f(i,z)|0)+(S&65535)|0)+(ea&65535)|0;aa=((f(q,z)|0)+(S>>>16)|0)+(ea>>>16)|0;ba=((f(i,H)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(q,H)|0)+(aa>>>16)|0)+(ba>>>16)|0;S=ba<<16|_&65535;_=((f(i,A)|0)+(T&65535)|0)+(ea&65535)|0;aa=((f(q,A)|0)+(T>>>16)|0)+(ea>>>16)|0;ba=((f(i,I)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(q,I)|0)+(aa>>>16)|0)+(ba>>>16)|0;T=ba<<16|_&65535;_=((f(i,B)|0)+(U&65535)|0)+(ea&65535)|0;aa=((f(q,B)|0)+(U>>>16)|0)+(ea>>>16)|0;ba=((f(i,J)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(q,J)|0)+(aa>>>16)|0)+(ba>>>16)|0;U=ba<<16|_&65535;_=((f(i,C)|0)+(V&65535)|0)+(ea&65535)|0;aa=((f(q,C)|0)+(V>>>16)|0)+(ea>>>16)|0;ba=((f(i,K)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(q,K)|0)+(aa>>>16)|0)+(ba>>>16)|0;V=ba<<16|_&65535;W=ea;_=((f(j,v)|0)+(P&65535)|0)+(X&65535)|0;aa=((f(r,v)|0)+(P>>>16)|0)+(X>>>16)|0;ba=((f(j,D)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(r,D)|0)+(aa>>>16)|0)+(ba>>>16)|0;P=ba<<16|_&65535;_=((f(j,w)|0)+(Q&65535)|0)+(ea&65535)|0;aa=((f(r,w)|0)+(Q>>>16)|0)+(ea>>>16)|0;ba=((f(j,E)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(r,E)|0)+(aa>>>16)|0)+(ba>>>16)|0;Q=ba<<16|_&65535;_=((f(j,x)|0)+(R&65535)|0)+(ea&65535)|0;aa=((f(r,x)|0)+(R>>>16)|0)+(ea>>>16)|0;ba=((f(j,F)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(r,F)|0)+(aa>>>16)|0)+(ba>>>16)|0;R=ba<<16|_&65535;_=((f(j,y)|0)+(S&65535)|0)+(ea&65535)|0;aa=((f(r,y)|0)+(S>>>16)|0)+(ea>>>16)|0;ba=((f(j,G)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(r,G)|0)+(aa>>>16)|0)+(ba>>>16)|0;S=ba<<16|_&65535;_=((f(j,z)|0)+(T&65535)|0)+(ea&65535)|0;aa=((f(r,z)|0)+(T>>>16)|0)+(ea>>>16)|0;ba=((f(j,H)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(r,H)|0)+(aa>>>16)|0)+(ba>>>16)|0;T=ba<<16|_&65535;_=((f(j,A)|0)+(U&65535)|0)+(ea&65535)|0;aa=((f(r,A)|0)+(U>>>16)|0)+(ea>>>16)|0;ba=((f(j,I)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(r,I)|0)+(aa>>>16)|0)+(ba>>>16)|0;U=ba<<16|_&65535;_=((f(j,B)|0)+(V&65535)|0)+(ea&65535)|0;aa=((f(r,B)|0)+(V>>>16)|0)+(ea>>>16)|0;ba=((f(j,J)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(r,J)|0)+(aa>>>16)|0)+(ba>>>16)|0;V=ba<<16|_&65535;_=((f(j,C)|0)+(W&65535)|0)+(ea&65535)|0;aa=((f(r,C)|0)+(W>>>16)|0)+(ea>>>16)|0;ba=((f(j,K)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(r,K)|0)+(aa>>>16)|0)+(ba>>>16)|0;W=ba<<16|_&65535;X=ea;_=((f(k,v)|0)+(Q&65535)|0)+(Y&65535)|0;aa=((f(s,v)|0)+(Q>>>16)|0)+(Y>>>16)|0;ba=((f(k,D)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(s,D)|0)+(aa>>>16)|0)+(ba>>>16)|0;Q=ba<<16|_&65535;_=((f(k,w)|0)+(R&65535)|0)+(ea&65535)|0;aa=((f(s,w)|0)+(R>>>16)|0)+(ea>>>16)|0;ba=((f(k,E)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(s,E)|0)+(aa>>>16)|0)+(ba>>>16)|0;R=ba<<16|_&65535;_=((f(k,x)|0)+(S&65535)|0)+(ea&65535)|0;aa=((f(s,x)|0)+(S>>>16)|0)+(ea>>>16)|0;ba=((f(k,F)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(s,F)|0)+(aa>>>16)|0)+(ba>>>16)|0;S=ba<<16|_&65535;_=((f(k,y)|0)+(T&65535)|0)+(ea&65535)|0;aa=((f(s,y)|0)+(T>>>16)|0)+(ea>>>16)|0;ba=((f(k,G)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(s,G)|0)+(aa>>>16)|0)+(ba>>>16)|0;T=ba<<16|_&65535;_=((f(k,z)|0)+(U&65535)|0)+(ea&65535)|0;aa=((f(s,z)|0)+(U>>>16)|0)+(ea>>>16)|0;ba=((f(k,H)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(s,H)|0)+(aa>>>16)|0)+(ba>>>16)|0;U=ba<<16|_&65535;_=((f(k,A)|0)+(V&65535)|0)+(ea&65535)|0;aa=((f(s,A)|0)+(V>>>16)|0)+(ea>>>16)|0;ba=((f(k,I)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(s,I)|0)+(aa>>>16)|0)+(ba>>>16)|0;V=ba<<16|_&65535;_=((f(k,B)|0)+(W&65535)|0)+(ea&65535)|0;aa=((f(s,B)|0)+(W>>>16)|0)+(ea>>>16)|0;ba=((f(k,J)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(s,J)|0)+(aa>>>16)|0)+(ba>>>16)|0;W=ba<<16|_&65535;_=((f(k,C)|0)+(X&65535)|0)+(ea&65535)|0;aa=((f(s,C)|0)+(X>>>16)|0)+(ea>>>16)|0;ba=((f(k,K)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(s,K)|0)+(aa>>>16)|0)+(ba>>>16)|0;X=ba<<16|_&65535;Y=ea;_=((f(l,v)|0)+(R&65535)|0)+(Z&65535)|0;aa=((f(t,v)|0)+(R>>>16)|0)+(Z>>>16)|0;ba=((f(l,D)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(t,D)|0)+(aa>>>16)|0)+(ba>>>16)|0;R=ba<<16|_&65535;_=((f(l,w)|0)+(S&65535)|0)+(ea&65535)|0;aa=((f(t,w)|0)+(S>>>16)|0)+(ea>>>16)|0;ba=((f(l,E)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(t,E)|0)+(aa>>>16)|0)+(ba>>>16)|0;S=ba<<16|_&65535;_=((f(l,x)|0)+(T&65535)|0)+(ea&65535)|0;aa=((f(t,x)|0)+(T>>>16)|0)+(ea>>>16)|0;ba=((f(l,F)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(t,F)|0)+(aa>>>16)|0)+(ba>>>16)|0;T=ba<<16|_&65535;_=((f(l,y)|0)+(U&65535)|0)+(ea&65535)|0;aa=((f(t,y)|0)+(U>>>16)|0)+(ea>>>16)|0;ba=((f(l,G)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(t,G)|0)+(aa>>>16)|0)+(ba>>>16)|0;U=ba<<16|_&65535;_=((f(l,z)|0)+(V&65535)|0)+(ea&65535)|0;aa=((f(t,z)|0)+(V>>>16)|0)+(ea>>>16)|0;ba=((f(l,H)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(t,H)|0)+(aa>>>16)|0)+(ba>>>16)|0;V=ba<<16|_&65535;_=((f(l,A)|0)+(W&65535)|0)+(ea&65535)|0;aa=((f(t,A)|0)+(W>>>16)|0)+(ea>>>16)|0;ba=((f(l,I)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(t,I)|0)+(aa>>>16)|0)+(ba>>>16)|0;W=ba<<16|_&65535;_=((f(l,B)|0)+(X&65535)|0)+(ea&65535)|0;aa=((f(t,B)|0)+(X>>>16)|0)+(ea>>>16)|0;ba=((f(l,J)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(t,J)|0)+(aa>>>16)|0)+(ba>>>16)|0;X=ba<<16|_&65535;_=((f(l,C)|0)+(Y&65535)|0)+(ea&65535)|0;aa=((f(t,C)|0)+(Y>>>16)|0)+(ea>>>16)|0;ba=((f(l,K)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(t,K)|0)+(aa>>>16)|0)+(ba>>>16)|0;Y=ba<<16|_&65535;Z=ea;_=((f(m,v)|0)+(S&65535)|0)+($&65535)|0;aa=((f(u,v)|0)+(S>>>16)|0)+($>>>16)|0;ba=((f(m,D)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(u,D)|0)+(aa>>>16)|0)+(ba>>>16)|0;S=ba<<16|_&65535;_=((f(m,w)|0)+(T&65535)|0)+(ea&65535)|0;aa=((f(u,w)|0)+(T>>>16)|0)+(ea>>>16)|0;ba=((f(m,E)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(u,E)|0)+(aa>>>16)|0)+(ba>>>16)|0;T=ba<<16|_&65535;_=((f(m,x)|0)+(U&65535)|0)+(ea&65535)|0;aa=((f(u,x)|0)+(U>>>16)|0)+(ea>>>16)|0;ba=((f(m,F)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(u,F)|0)+(aa>>>16)|0)+(ba>>>16)|0;U=ba<<16|_&65535;_=((f(m,y)|0)+(V&65535)|0)+(ea&65535)|0;aa=((f(u,y)|0)+(V>>>16)|0)+(ea>>>16)|0;ba=((f(m,G)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(u,G)|0)+(aa>>>16)|0)+(ba>>>16)|0;V=ba<<16|_&65535;_=((f(m,z)|0)+(W&65535)|0)+(ea&65535)|0;aa=((f(u,z)|0)+(W>>>16)|0)+(ea>>>16)|0;ba=((f(m,H)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(u,H)|0)+(aa>>>16)|0)+(ba>>>16)|0;W=ba<<16|_&65535;_=((f(m,A)|0)+(X&65535)|0)+(ea&65535)|0;aa=((f(u,A)|0)+(X>>>16)|0)+(ea>>>16)|0;ba=((f(m,I)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(u,I)|0)+(aa>>>16)|0)+(ba>>>16)|0;X=ba<<16|_&65535;_=((f(m,B)|0)+(Y&65535)|0)+(ea&65535)|0;aa=((f(u,B)|0)+(Y>>>16)|0)+(ea>>>16)|0;ba=((f(m,J)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(u,J)|0)+(aa>>>16)|0)+(ba>>>16)|0;Y=ba<<16|_&65535;_=((f(m,C)|0)+(Z&65535)|0)+(ea&65535)|0;aa=((f(u,C)|0)+(Z>>>16)|0)+(ea>>>16)|0;ba=((f(m,K)|0)+(aa&65535)|0)+(_>>>16)|0;ea=((f(u,K)|0)+(aa>>>16)|0)+(ba>>>16)|0;Z=ba<<16|_&65535;$=ea;la=ga+(ja+ka|0)|0;fa=e[oa+la>>2]|0;_=((fa&65535)+((L&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(L>>>16<<1)|0)+(_>>>16)|0;e[oa+la>>2]=ba<<16|_&65535;ca=ba>>>16;la=la+4|0;fa=e[oa+la>>2]|0;_=((fa&65535)+((M&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(M>>>16<<1)|0)+(_>>>16)|0;e[oa+la>>2]=ba<<16|_&65535;ca=ba>>>16;la=la+4|0;fa=e[oa+la>>2]|0;_=((fa&65535)+((N&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(N>>>16<<1)|0)+(_>>>16)|0;e[oa+la>>2]=ba<<16|_&65535;ca=ba>>>16;la=la+4|0;fa=e[oa+la>>2]|0;_=((fa&65535)+((O&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(O>>>16<<1)|0)+(_>>>16)|0;e[oa+la>>2]=ba<<16|_&65535;ca=ba>>>16;la=la+4|0;fa=e[oa+la>>2]|0;_=((fa&65535)+((P&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(P>>>16<<1)|0)+(_>>>16)|0;e[oa+la>>2]=ba<<16|_&65535;ca=ba>>>16;la=la+4|0;fa=e[oa+la>>2]|0;_=((fa&65535)+((Q&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(Q>>>16<<1)|0)+(_>>>16)|0;e[oa+la>>2]=ba<<16|_&65535;ca=ba>>>16;la=la+4|0;fa=e[oa+la>>2]|0;_=((fa&65535)+((R&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(R>>>16<<1)|0)+(_>>>16)|0;e[oa+la>>2]=ba<<16|_&65535;ca=ba>>>16;la=la+4|0;fa=e[oa+la>>2]|0;_=((fa&65535)+((S&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(S>>>16<<1)|0)+(_>>>16)|0;e[oa+la>>2]=ba<<16|_&65535;ca=ba>>>16}la=ga+(ja+ka|0)|0;fa=e[oa+la>>2]|0;_=(((fa&65535)+((T&65535)<<1)|0)+ca|0)+da|0;ba=((fa>>>16)+(T>>>16<<1)|0)+(_>>>16)|0;e[oa+la>>2]=ba<<16|_&65535;ca=ba>>>16;la=la+4|0;fa=e[oa+la>>2]|0;_=((fa&65535)+((U&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(U>>>16<<1)|0)+(_>>>16)|0;e[oa+la>>2]=ba<<16|_&65535;ca=ba>>>16;la=la+4|0;fa=e[oa+la>>2]|0;_=((fa&65535)+((V&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(V>>>16<<1)|0)+(_>>>16)|0;e[oa+la>>2]=ba<<16|_&65535;ca=ba>>>16;la=la+4|0;fa=e[oa+la>>2]|0;_=((fa&65535)+((W&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(W>>>16<<1)|0)+(_>>>16)|0;e[oa+la>>2]=ba<<16|_&65535;ca=ba>>>16;la=la+4|0;fa=e[oa+la>>2]|0;_=((fa&65535)+((X&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(X>>>16<<1)|0)+(_>>>16)|0;e[oa+la>>2]=ba<<16|_&65535;ca=ba>>>16;la=la+4|0;fa=e[oa+la>>2]|0;_=((fa&65535)+((Y&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(Y>>>16<<1)|0)+(_>>>16)|0;e[oa+la>>2]=ba<<16|_&65535;ca=ba>>>16;la=la+4|0;fa=e[oa+la>>2]|0;_=((fa&65535)+((Z&65535)<<1)|0)+ca|0;ba=((fa>>>16)+(Z>>>16<<1)|0)+(_>>>16)|0;e[oa+la>>2]=ba<<16|_&65535;ca=ba>>>16;la=la+4|0;fa=e[oa+la>>2]|0;_=((fa&65535)+(($&65535)<<1)|0)+ca|0;ba=((fa>>>16)+($>>>16<<1)|0)+(_>>>16)|0;e[oa+la>>2]=ba<<16|_&65535;da=ba>>>16}for(la=la+4|0;!!da&(la|0)<ha<<1;la=la+4|0){fa=e[oa+la>>2]|0;_=(fa&65535)+da|0;ba=(fa>>>16)+(_>>>16)|0;e[oa+la>>2]=ba<<16|_&65535;da=ba>>>16}}}}function s(a,b,c,d,g){a=a|0;b=b|0;c=c|0;d=d|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;for(x=b-1&-4;(x|0)>=0;x=x-4|0){h=e[a+x>>2]|0;if(h){b=x;break}}for(x=d-1&-4;(x|0)>=0;x=x-4|0){i=e[c+x>>2]|0;if(i){d=x;break}}while((i&2147483648)==0){i=i<<1;j=j+1|0}l=e[a+b>>2]|0;if(j){k=l>>>(32-j|0);for(x=b-4|0;(x|0)>=0;x=x-4|0){h=e[a+x>>2]|0;e[a+x+4>>2]=l<<j|(j?h>>>(32-j|0):0);l=h}e[a>>2]=l<<j}if(j){m=e[c+d>>2]|0;for(x=d-4|0;(x|0)>=0;x=x-4|0){i=e[c+x>>2]|0;e[c+x+4>>2]=m<<j|i>>>(32-j|0);m=i}e[c>>2]=m<<j}m=e[c+d>>2]|0;n=m>>>16,o=m&65535;for(x=b;(x|0)>=(d|0);x=x-4|0){y=x-d|0;l=e[a+x>>2]|0;p=(k>>>0)/(n>>>0)|0,r=(k>>>0)%(n>>>0)|0,t=f(p,o)|0;while((p|0)==65536|t>>>0>(r<<16|l>>>16)>>>0){p=p-1|0,r=r+n|0,t=t-o|0;if((r|0)>=65536)break}v=0,w=0;for(z=0;(z|0)<=(d|0);z=z+4|0){i=e[c+z>>2]|0;t=(f(p,i&65535)|0)+(v>>>16)|0;u=(f(p,i>>>16)|0)+(t>>>16)|0;i=v&65535|t<<16;v=u;h=e[a+y+z>>2]|0;t=((h&65535)-(i&65535)|0)+w|0;u=((h>>>16)-(i>>>16)|0)+(t>>16)|0;e[a+y+z>>2]=u<<16|t&65535;w=u>>16}t=((k&65535)-(v&65535)|0)+w|0;u=((k>>>16)-(v>>>16)|0)+(t>>16)|0;k=u<<16|t&65535;w=u>>16;if(w){p=p-1|0;w=0;for(z=0;(z|0)<=(d|0);z=z+4|0){i=e[c+z>>2]|0;h=e[a+y+z>>2]|0;t=(h&65535)+w|0;u=(h>>>16)+i+(t>>>16)|0;e[a+y+z>>2]=u<<16|t&65535;w=u>>>16}k=k+w|0}l=e[a+x>>2]|0;h=k<<16|l>>>16;q=(h>>>0)/(n>>>0)|0,s=(h>>>0)%(n>>>0)|0,t=f(q,o)|0;while((q|0)==65536|t>>>0>(s<<16|l&65535)>>>0){q=q-1|0,s=s+n|0,t=t-o|0;if((s|0)>=65536)break}v=0,w=0;for(z=0;(z|0)<=(d|0);z=z+4|0){i=e[c+z>>2]|0;t=(f(q,i&65535)|0)+(v&65535)|0;u=((f(q,i>>>16)|0)+(t>>>16)|0)+(v>>>16)|0;i=t&65535|u<<16;v=u>>>16;h=e[a+y+z>>2]|0;t=((h&65535)-(i&65535)|0)+w|0;u=((h>>>16)-(i>>>16)|0)+(t>>16)|0;w=u>>16;e[a+y+z>>2]=u<<16|t&65535}t=((k&65535)-(v&65535)|0)+w|0;u=((k>>>16)-(v>>>16)|0)+(t>>16)|0;w=u>>16;if(w){q=q-1|0;w=0;for(z=0;(z|0)<=(d|0);z=z+4|0){i=e[c+z>>2]|0;h=e[a+y+z>>2]|0;t=((h&65535)+(i&65535)|0)+w|0;u=((h>>>16)+(i>>>16)|0)+(t>>>16)|0;w=u>>>16;e[a+y+z>>2]=t&65535|u<<16}}e[g+y>>2]=p<<16|q;k=e[a+x>>2]|0}if(j){l=e[a>>2]|0;for(x=4;(x|0)<=(d|0);x=x+4|0){h=e[a+x>>2]|0;e[a+x-4>>2]=h<<(32-j|0)|l>>>j;l=h}e[a+d>>2]=l>>>j}}function t(a,b,c,d,g,l){a=a|0;b=b|0;c=c|0;d=d|0;g=g|0;l=l|0;var n=0,o=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;n=h(d<<1)|0;k(d<<1,0,n);j(b,a,n);for(z=0;(z|0)<(d|0);z=z+4|0){q=e[n+z>>2]|0,r=q&65535,q=q>>>16;t=g>>>16,s=g&65535;u=f(r,s)|0,v=((f(r,t)|0)+(f(q,s)|0)|0)+(u>>>16)|0;r=u&65535,q=v&65535;y=0;for(A=0;(A|0)<(d|0);A=A+4|0){B=z+A|0;t=e[c+A>>2]|0,s=t&65535,t=t>>>16;x=e[n+B>>2]|0;u=((f(r,s)|0)+(y&65535)|0)+(x&65535)|0;v=((f(r,t)|0)+(y>>>16)|0)+(x>>>16)|0;w=((f(q,s)|0)+(v&65535)|0)+(u>>>16)|0;y=((f(q,t)|0)+(w>>>16)|0)+(v>>>16)|0;x=w<<16|u&65535;e[n+B>>2]=x}B=z+A|0;x=e[n+B>>2]|0;u=((x&65535)+(y&65535)|0)+o|0;v=((x>>>16)+(y>>>16)|0)+(u>>>16)|0;e[n+B>>2]=v<<16|u&65535;o=v>>>16}j(d,n+d|0,l);i(d<<1);if(o|(m(c,d,l,d)|0)<=0){p(l,d,c,d,l,d)|0}}return{sreset:g,salloc:h,sfree:i,z:k,tst:n,neg:l,cmp:m,add:o,sub:p,mul:q,sqr:r,div:s,mredc:t}}function $a(a){return a instanceof _a}function _a(a){var b=Tc,c=0,d=0;if(n(a)&&(a=f(a)),o(a)&&(a=new Uint8Array(a)),void 0===a);else if(m(a)){var e=Math.abs(a);e>4294967295?(b=new Uint32Array(2),b[0]=0|e,b[1]=e/4294967296|0,c=52):e>0?(b=new Uint32Array(1),b[0]=e,c=32):(b=Tc,c=0),d=0>a?-1:1}else if(p(a)){if(c=8*a.length,!c)return Vc;b=new Uint32Array(c+31>>5);for(var g=a.length-4;g>=0;g-=4)b[a.length-4-g>>2]=a[g]<<24|a[g+1]<<16|a[g+2]<<8|a[g+3];-3===g?b[b.length-1]=a[0]:-2===g?b[b.length-1]=a[0]<<8|a[1]:-1===g&&(b[b.length-1]=a[0]<<16|a[1]<<8|a[2]),d=1}else{if("object"!=typeof a||null===a)throw new TypeError("number is of unexpected type");b=new Uint32Array(a.limbs),c=a.bitLength,d=a.sign}this.limbs=b,this.bitLength=c,this.sign=d}function ab(a){a=a||16;var b=this.limbs,c=this.bitLength,e="";if(16!==a)throw new d("bad radix");for(var f=(c+31>>5)-1;f>=0;f--){var g=b[f].toString(16);e+="00000000".substr(g.length),e+=g}return e=e.replace(/^0+/,""),e.length||(e="0"),this.sign<0&&(e="-"+e),e}function bb(){var a=this.bitLength,b=this.limbs;if(0===a)return new Uint8Array(0);for(var c=a+7>>3,d=new Uint8Array(c),e=0;c>e;e++){var f=c-e-1;d[e]=b[f>>2]>>((3&f)<<3)}return d}function cb(){var a=this.limbs,b=this.bitLength,c=this.sign;if(!c)return 0;if(32>=b)return c*(a[0]>>>0);if(52>=b)return c*(4294967296*(a[1]>>>0)+(a[0]>>>0));var d,e,f=0;for(d=a.length-1;d>=0;d--)if(0!==(e=a[d])){for(;0===(e<<f&2147483648);)f++;break}return 0===d?c*(a[0]>>>0):c*(1048576*((a[d]<<f|(f?a[d-1]>>>32-f:0))>>>0)+((a[d-1]<<f|(f&&d>1?a[d-2]>>>32-f:0))>>>12))*Math.pow(2,32*d-f-52)}function db(a){var b=this.limbs,c=this.bitLength;if(a>=c)return this;var d=new _a,e=a+31>>5,f=a%32;return d.limbs=new Uint32Array(b.subarray(0,e)),d.bitLength=a,d.sign=this.sign,f&&(d.limbs[e-1]&=-1>>>32-f),d}function eb(a,b){if(!m(a))throw new TypeError("TODO");if(void 0!==b&&!m(b))throw new TypeError("TODO");var c=this.limbs,d=this.bitLength;if(0>a)throw new RangeError("TODO");if(a>=d)return Vc;(void 0===b||b>d-a)&&(b=d-a);var e,f=new _a,g=a>>5,h=a+b+31>>5,i=b+31>>5,j=a%32,k=b%32;if(e=new Uint32Array(i),j){for(var l=0;h-g-1>l;l++)e[l]=c[g+l]>>>j|c[g+l+1]<<32-j;e[l]=c[g+l]>>>j}else e.set(c.subarray(g,h));return k&&(e[i-1]&=-1>>>32-k),f.limbs=e,f.bitLength=b,f.sign=this.sign,f}function fb(){var a=new _a;return a.limbs=this.limbs,a.bitLength=this.bitLength,a.sign=-1*this.sign,a}function gb(a){$a(a)||(a=new _a(a));var b=this.limbs,c=b.length,d=a.limbs,e=d.length,f=0;return this.sign<a.sign?-1:this.sign>a.sign?1:(Sc.set(b,0),Sc.set(d,c),f=Za.cmp(0,c<<2,c<<2,e<<2),f*this.sign)}function hb(a){
	if($a(a)||(a=new _a(a)),!this.sign)return a;if(!a.sign)return this;var b,c,d,e,f=this.bitLength,g=this.limbs,h=g.length,i=this.sign,j=a.bitLength,k=a.limbs,l=k.length,m=a.sign,n=new _a;b=(f>j?f:j)+(i*m>0?1:0),c=b+31>>5,Za.sreset();var o=Za.salloc(h<<2),p=Za.salloc(l<<2),q=Za.salloc(c<<2);return Za.z(q-o+(c<<2),0,o),Sc.set(g,o>>2),Sc.set(k,p>>2),i*m>0?(Za.add(o,h<<2,p,l<<2,q,c<<2),d=i):i>m?(e=Za.sub(o,h<<2,p,l<<2,q,c<<2),d=e?m:i):(e=Za.sub(p,l<<2,o,h<<2,q,c<<2),d=e?i:m),e&&Za.neg(q,c<<2,q,c<<2),0===Za.tst(q,c<<2)?Vc:(n.limbs=new Uint32Array(Sc.subarray(q>>2,(q>>2)+c)),n.bitLength=b,n.sign=d,n)}function ib(a){return $a(a)||(a=new _a(a)),this.add(a.negate())}function jb(a){if($a(a)||(a=new _a(a)),!this.sign||!a.sign)return Vc;var b,c,d=this.bitLength,e=this.limbs,f=e.length,g=a.bitLength,h=a.limbs,i=h.length,j=new _a;b=d+g,c=b+31>>5,Za.sreset();var k=Za.salloc(f<<2),l=Za.salloc(i<<2),m=Za.salloc(c<<2);return Za.z(m-k+(c<<2),0,k),Sc.set(e,k>>2),Sc.set(h,l>>2),Za.mul(k,f<<2,l,i<<2,m,c<<2),j.limbs=new Uint32Array(Sc.subarray(m>>2,(m>>2)+c)),j.sign=this.sign*a.sign,j.bitLength=b,j}function kb(){if(!this.sign)return Vc;var a,b,c=this.bitLength,d=this.limbs,e=d.length,f=new _a;a=c<<1,b=a+31>>5,Za.sreset();var g=Za.salloc(e<<2),h=Za.salloc(b<<2);return Za.z(h-g+(b<<2),0,g),Sc.set(d,g>>2),Za.sqr(g,e<<2,h),f.limbs=new Uint32Array(Sc.subarray(h>>2,(h>>2)+b)),f.bitLength=a,f.sign=1,f}function lb(a){$a(a)||(a=new _a(a));var b,c,d=this.bitLength,e=this.limbs,f=e.length,g=a.bitLength,h=a.limbs,i=h.length,j=Vc,k=Vc;Za.sreset();var l=Za.salloc(f<<2),m=Za.salloc(i<<2),n=Za.salloc(f<<2);return Za.z(n-l+(f<<2),0,l),Sc.set(e,l>>2),Sc.set(h,m>>2),Za.div(l,f<<2,m,i<<2,n),b=Za.tst(n,f<<2)>>2,b&&(j=new _a,j.limbs=new Uint32Array(Sc.subarray(n>>2,(n>>2)+b)),j.bitLength=b<<5>d?d:b<<5,j.sign=this.sign*a.sign),c=Za.tst(l,i<<2)>>2,c&&(k=new _a,k.limbs=new Uint32Array(Sc.subarray(l>>2,(l>>2)+c)),k.bitLength=c<<5>g?g:c<<5,k.sign=this.sign),{quotient:j,remainder:k}}function mb(a,b){var c,d,e,f,g=0>a?-1:1,h=0>b?-1:1,i=1,j=0,k=0,l=1;for(a*=g,b*=h,f=b>a,f&&(e=a,a=b,b=e,e=g,g=h,h=e),d=Math.floor(a/b),c=a-d*b;c;)e=i-d*j,i=j,j=e,e=k-d*l,k=l,l=e,a=b,b=c,d=Math.floor(a/b),c=a-d*b;return j*=g,l*=h,f&&(e=j,j=l,l=e),{gcd:b,x:j,y:l}}function nb(a,b){$a(a)||(a=new _a(a)),$a(b)||(b=new _a(b));var c=a.sign,d=b.sign;0>c&&(a=a.negate()),0>d&&(b=b.negate());var e=a.compare(b);if(0>e){var f=a;a=b,b=f,f=c,c=d,d=f}var g,h,i,j=Wc,k=Vc,l=b.bitLength,m=Vc,n=Wc,o=a.bitLength;for(g=a.divide(b);(h=g.remainder)!==Vc;)i=g.quotient,g=j.subtract(i.multiply(k).clamp(l)).clamp(l),j=k,k=g,g=m.subtract(i.multiply(n).clamp(o)).clamp(o),m=n,n=g,a=b,b=h,g=a.divide(b);if(0>c&&(k=k.negate()),0>d&&(n=n.negate()),0>e){var f=k;k=n,n=f}return{gcd:b,x:k,y:n}}function ob(){if(_a.apply(this,arguments),this.valueOf()<1)throw new RangeError;if(!(this.bitLength<=32)){var a;if(1&this.limbs[0]){var b=(this.bitLength+31&-32)+1,c=new Uint32Array(b+31>>5);c[c.length-1]=1,a=new _a,a.sign=1,a.bitLength=b,a.limbs=c;var d=mb(4294967296,this.limbs[0]).y;this.coefficient=0>d?-d:4294967296-d,this.comodulus=a,this.comodulusRemainder=a.divide(this).remainder,this.comodulusRemainderSquare=a.square().divide(this).remainder}}}function pb(a){return $a(a)||(a=new _a(a)),a.bitLength<=32&&this.bitLength<=32?new _a(a.valueOf()%this.valueOf()):a.compare(this)<0?a:a.divide(this).remainder}function qb(a){a=this.reduce(a);var b=nb(this,a);return 1!==b.gcd.valueOf()?null:(b=b.y,b.sign<0&&(b=b.add(this).clamp(this.bitLength)),b)}function rb(a,b){$a(a)||(a=new _a(a)),$a(b)||(b=new _a(b));for(var c=0,d=0;d<b.limbs.length;d++)for(var e=b.limbs[d];e;)1&e&&c++,e>>>=1;var f=8;b.bitLength<=4536&&(f=7),b.bitLength<=1736&&(f=6),b.bitLength<=630&&(f=5),b.bitLength<=210&&(f=4),b.bitLength<=60&&(f=3),b.bitLength<=12&&(f=2),1<<f-1>=c&&(f=1),a=sb(this.reduce(a).multiply(this.comodulusRemainderSquare),this);var g=sb(a.square(),this),h=new Array(1<<f-1);h[0]=a,h[1]=sb(a.multiply(g),this);for(var d=2;1<<f-1>d;d++)h[d]=sb(h[d-1].multiply(g),this);for(var i=this.comodulusRemainder,j=i,d=b.limbs.length-1;d>=0;d--)for(var e=b.limbs[d],k=32;k>0;)if(2147483648&e){for(var l=e>>>32-f,m=f;0===(1&l);)l>>>=1,m--;for(var n=h[l>>>1];l;)l>>>=1,j!==i&&(j=sb(j.square(),this));j=j!==i?sb(j.multiply(n),this):n,e<<=m,k-=m}else j!==i&&(j=sb(j.square(),this)),e<<=1,k--;return j=sb(j,this)}function sb(a,b){var c=a.limbs,d=c.length,e=b.limbs,f=e.length,g=b.coefficient;Za.sreset();var h=Za.salloc(d<<2),i=Za.salloc(f<<2),j=Za.salloc(f<<2);Za.z(j-h+(f<<2),0,h),Sc.set(c,h>>2),Sc.set(e,i>>2),Za.mredc(h,d<<2,i,f<<2,g,j);var k=new _a;return k.limbs=new Uint32Array(Sc.subarray(j>>2,(j>>2)+f)),k.bitLength=b.bitLength,k.sign=1,k}function tb(a){var b=new _a(this),c=0;for(b.limbs[0]-=1;0===b.limbs[c>>5];)c+=32;for(;0===(b.limbs[c>>5]>>(31&c)&1);)c++;b=b.slice(c);for(var d=new ob(this),e=this.subtract(Wc),f=new _a(this),g=this.limbs.length-1;0===f.limbs[g];)g--;for(;--a>=0;){for(Wa(f.limbs),f.limbs[0]<2&&(f.limbs[0]+=2);f.compare(e)>=0;)f.limbs[g]>>>=1;var h=d.power(f,b);if(0!==h.compare(Wc)&&0!==h.compare(e)){for(var i=c;--i>0;){if(h=h.square().divide(d).remainder,0===h.compare(Wc))return!1;if(0===h.compare(e))break}if(0===i)return!1}}return!0}function ub(a){a=a||80;var b=this.limbs,c=0;if(0===(1&b[0]))return!1;if(1>=a)return!0;var d=0,e=0,f=0;for(c=0;c<b.length;c++){for(var g=b[c];g;)d+=3&g,g>>>=2;for(var h=b[c];h;)e+=3&h,h>>>=2,e-=3&h,h>>>=2;for(var i=b[c];i;)f+=15&i,i>>>=4,f-=15&i,i>>>=4}return d%3&&e%5&&f%17?2>=a?!0:tb.call(this,a>>>1):!1}function vb(a){if(Yc.length>=a)return Yc.slice(0,a);for(var b=Yc[Yc.length-1]+2;Yc.length<a;b+=2){for(var c=0,d=Yc[c];b>=d*d&&b%d!=0;d=Yc[++c]);d*d>b&&Yc.push(b)}return Yc}function wb(a,c){var d=a+31>>5,e=new _a({sign:1,bitLength:a,limbs:d}),f=e.limbs,g=1e4;512>=a&&(g=2200),256>=a&&(g=600);var h=vb(g),i=new Uint32Array(g),j=a*b.Math.LN2|0,k=27;for(a>=250&&(k=12),a>=450&&(k=6),a>=850&&(k=3),a>=1300&&(k=2);;){Wa(f),f[0]|=1,f[d-1]|=1<<(a-1&31),31&a&&(f[d-1]&=l(a+1&31)-1),i[0]=1;for(var m=1;g>m;m++)i[m]=e.divide(h[m]).remainder.valueOf();a:for(var n=0;j>n;n+=2,f[0]+=2){for(var m=1;g>m;m++)if((i[m]+n)%h[m]===0)continue a;if(("function"!=typeof c||c(e))&&tb.call(e,k))return e}}}function xb(a){a=a||{},this.key=null,this.result=null,this.reset(a)}function yb(a){a=a||{},this.result=null;var b=a.key;if(void 0!==b){if(!(b instanceof Array))throw new TypeError("unexpected key type");var c=b.length;if(2!==c&&3!==c&&8!==c)throw new SyntaxError("unexpected key type");var d=[];d[0]=new ob(b[0]),d[1]=new _a(b[1]),c>2&&(d[2]=new _a(b[2])),c>3&&(d[3]=new ob(b[3]),d[4]=new ob(b[4]),d[5]=new _a(b[5]),d[6]=new _a(b[6]),d[7]=new _a(b[7])),this.key=d}return this}function zb(a){if(!this.key)throw new c("no key is associated with the instance");n(a)&&(a=f(a)),o(a)&&(a=new Uint8Array(a));var b;if(p(a))b=new _a(a);else{if(!$a(a))throw new TypeError("unexpected data type");b=a}if(this.key[0].compare(b)<=0)throw new RangeError("data too large");var d=this.key[0],e=this.key[1],g=d.power(b,e).toBytes(),h=d.bitLength+7>>3;if(g.length<h){var i=new Uint8Array(h);i.set(g,h-g.length),g=i}return this.result=g,this}function Ab(a){if(!this.key)throw new c("no key is associated with the instance");if(this.key.length<3)throw new c("key isn't suitable for decription");n(a)&&(a=f(a)),o(a)&&(a=new Uint8Array(a));var b;if(p(a))b=new _a(a);else{if(!$a(a))throw new TypeError("unexpected data type");b=a}if(this.key[0].compare(b)<=0)throw new RangeError("data too large");var d;if(this.key.length>3){for(var e=this.key[0],g=this.key[3],h=this.key[4],i=this.key[5],j=this.key[6],k=this.key[7],l=g.power(b,i),m=h.power(b,j),q=l.subtract(m);q.sign<0;)q=q.add(g);var r=g.reduce(k.multiply(q));d=r.multiply(h).add(m).clamp(e.bitLength).toBytes()}else{var e=this.key[0],s=this.key[2];d=e.power(b,s).toBytes()}var t=e.bitLength+7>>3;if(d.length<t){var u=new Uint8Array(t);u.set(d,t-d.length),d=u}return this.result=d,this}function Bb(a,b){if(a=a||2048,b=b||65537,512>a)throw new d("bit length is too small");if(n(b)&&(b=f(b)),o(b)&&(b=new Uint8Array(b)),!(p(b)||m(b)||$a(b)))throw new TypeError("unexpected exponent type");if(b=new _a(b),0===(1&b.limbs[0]))throw new d("exponent must be an odd number");var c,b,e,g,h,i,j,k,l,q;g=wb(a>>1,function(a){return i=new _a(a),i.limbs[0]-=1,1==nb(i,b).gcd.valueOf()}),h=wb(a-(a>>1),function(d){return c=new ob(g.multiply(d)),c.limbs[(a+31>>5)-1]>>>(a-1&31)?(j=new _a(d),j.limbs[0]-=1,1==nb(j,b).gcd.valueOf()):!1}),e=new ob(i.multiply(j)).inverse(b),k=e.divide(i).remainder,l=e.divide(j).remainder,g=new ob(g),h=new ob(h);var q=g.inverse(h);return[c,b,e,g,h,k,l,q]}function Cb(a){if(a=a||{},!a.hash)throw new SyntaxError("option 'hash' is required");if(!a.hash.HASH_SIZE)throw new SyntaxError("option 'hash' supplied doesn't seem to be a valid hash function");this.hash=a.hash,this.label=null,this.reset(a)}function Db(a){a=a||{};var b=a.label;if(void 0!==b){if(o(b)||p(b))b=new Uint8Array(b);else{if(!n(b))throw new TypeError("unexpected label type");b=f(b)}this.label=b.length>0?b:null}else this.label=null;yb.call(this,a)}function Eb(a){if(!this.key)throw new c("no key is associated with the instance");var b=Math.ceil(this.key[0].bitLength/8),e=this.hash.HASH_SIZE,g=a.byteLength||a.length||0,h=b-g-2*e-2;if(g>b-2*this.hash.HASH_SIZE-2)throw new d("data too large");var i=new Uint8Array(b),j=i.subarray(1,e+1),k=i.subarray(e+1);if(p(a))k.set(a,e+h+1);else if(o(a))k.set(new Uint8Array(a),e+h+1);else{if(!n(a))throw new TypeError("unexpected data type");k.set(f(a),e+h+1)}k.set(this.hash.reset().process(this.label||"").finish().result,0),k[e+h]=1,Wa(j);for(var l=Gb.call(this,j,k.length),m=0;m<k.length;m++)k[m]^=l[m];for(var q=Gb.call(this,k,j.length),m=0;m<j.length;m++)j[m]^=q[m];return zb.call(this,i),this}function Fb(a){if(!this.key)throw new c("no key is associated with the instance");var b=Math.ceil(this.key[0].bitLength/8),f=this.hash.HASH_SIZE,g=a.byteLength||a.length||0;if(g!==b)throw new d("bad data");Ab.call(this,a);var h=this.result[0],i=this.result.subarray(1,f+1),j=this.result.subarray(f+1);if(0!==h)throw new e("decryption failed");for(var k=Gb.call(this,j,i.length),l=0;l<i.length;l++)i[l]^=k[l];for(var m=Gb.call(this,i,j.length),l=0;l<j.length;l++)j[l]^=m[l];for(var n=this.hash.reset().process(this.label||"").finish().result,l=0;f>l;l++)if(n[l]!==j[l])throw new e("decryption failed");for(var o=f;o<j.length;o++){var p=j[o];if(1===p)break;if(0!==p)throw new e("decryption failed")}if(o===j.length)throw new e("decryption failed");return this.result=j.subarray(o+1),this}function Gb(a,b){a=a||"",b=b||0;for(var c=this.hash.HASH_SIZE,d=new Uint8Array(b),e=new Uint8Array(4),f=Math.ceil(b/c),g=0;f>g;g++){e[0]=g>>>24,e[1]=g>>>16&255,e[2]=g>>>8&255,e[3]=255&g;var h=d.subarray(g*c),i=this.hash.reset().process(a).process(e).finish().result;i.length>h.length&&(i=i.subarray(0,h.length)),h.set(i)}return d}function Hb(a){if(a=a||{},!a.hash)throw new SyntaxError("option 'hash' is required");if(!a.hash.HASH_SIZE)throw new SyntaxError("option 'hash' supplied doesn't seem to be a valid hash function");this.hash=a.hash,this.saltLength=4,this.reset(a)}function Ib(a){a=a||{},yb.call(this,a);var b=a.saltLength;if(void 0!==b){if(!m(b)||0>b)throw new TypeError("saltLength should be a non-negative number");if(null!==this.key&&Math.ceil((this.key[0].bitLength-1)/8)<this.hash.HASH_SIZE+b+2)throw new SyntaxError("saltLength is too large");this.saltLength=b}else this.saltLength=4}function Jb(a){if(!this.key)throw new c("no key is associated with the instance");var b=this.key[0].bitLength,d=this.hash.HASH_SIZE,e=Math.ceil((b-1)/8),f=this.saltLength,g=e-f-d-2,h=new Uint8Array(e),i=h.subarray(e-d-1,e-1),j=h.subarray(0,e-d-1),k=j.subarray(g+1),l=new Uint8Array(8+d+f),m=l.subarray(8,8+d),n=l.subarray(8+d);m.set(this.hash.reset().process(a).finish().result),f>0&&Wa(n),j[g]=1,k.set(n),i.set(this.hash.reset().process(l).finish().result);for(var o=Gb.call(this,i,j.length),p=0;p<j.length;p++)j[p]^=o[p];h[e-1]=188;var q=8*e-b+1;return q%8&&(h[0]&=255>>>q),Ab.call(this,h),this}function Kb(a,b){if(!this.key)throw new c("no key is associated with the instance");var d=this.key[0].bitLength,f=this.hash.HASH_SIZE,g=Math.ceil((d-1)/8),h=this.saltLength,i=g-h-f-2;zb.call(this,a);var j=this.result;if(188!==j[g-1])throw new e("bad signature");var k=j.subarray(g-f-1,g-1),l=j.subarray(0,g-f-1),m=l.subarray(i+1),n=8*g-d+1;if(n%8&&j[0]>>>8-n)throw new e("bad signature");for(var o=Gb.call(this,k,l.length),p=0;p<l.length;p++)l[p]^=o[p];n%8&&(j[0]&=255>>>n);for(var p=0;i>p;p++)if(0!==l[p])throw new e("bad signature");if(1!==l[i])throw new e("bad signature");var q=new Uint8Array(8+f+h),r=q.subarray(8,8+f),s=q.subarray(8+f);r.set(this.hash.reset().process(b).finish().result),s.set(m);for(var t=this.hash.reset().process(q).finish().result,p=0;f>p;p++)if(k[p]!==t[p])throw new e("bad signature");return this}function Lb(a,b){if(void 0===a)throw new SyntaxError("bitlen required");if(void 0===b)throw new SyntaxError("e required");for(var c=Bb(a,b),d=0;d<c.length;d++)$a(c[d])&&(c[d]=c[d].toBytes());return c}function Mb(a,b,c){if(void 0===a)throw new SyntaxError("data required");if(void 0===b)throw new SyntaxError("key required");return new Cb({hash:ba(),key:b,label:c}).encrypt(a).result}function Nb(a,b,c){if(void 0===a)throw new SyntaxError("data required");if(void 0===b)throw new SyntaxError("key required");return new Cb({hash:ba(),key:b,label:c}).decrypt(a).result}function Ob(a,b,c){if(void 0===a)throw new SyntaxError("data required");if(void 0===b)throw new SyntaxError("key required");return new Cb({hash:ha(),key:b,label:c}).encrypt(a).result}function Pb(a,b,c){if(void 0===a)throw new SyntaxError("data required");if(void 0===b)throw new SyntaxError("key required");return new Cb({hash:ha(),key:b,label:c}).decrypt(a).result}function Qb(a,b,c){if(void 0===a)throw new SyntaxError("data required");if(void 0===b)throw new SyntaxError("key required");return new Hb({hash:ba(),key:b,saltLength:c}).sign(a).result}function Rb(a,b,c,d){if(void 0===a)throw new SyntaxError("signature required");if(void 0===b)throw new SyntaxError("data required");if(void 0===c)throw new SyntaxError("key required");try{return new Hb({hash:ba(),key:c,saltLength:d}).verify(a,b),!0}catch(a){if(!(a instanceof e))throw a}return!1}function Sb(a,b,c){if(void 0===a)throw new SyntaxError("data required");if(void 0===b)throw new SyntaxError("key required");return new Hb({hash:ha(),key:b,saltLength:c}).sign(a).result}function Tb(a,b,c,d){if(void 0===a)throw new SyntaxError("signature required");if(void 0===b)throw new SyntaxError("data required");if(void 0===c)throw new SyntaxError("key required");try{return new Hb({hash:ha(),key:c,saltLength:d}).verify(a,b),!0}catch(a){if(!(a instanceof e))throw a}return!1}c.prototype=Object.create(Error.prototype,{name:{value:"IllegalStateError"}}),d.prototype=Object.create(Error.prototype,{name:{value:"IllegalArgumentError"}}),e.prototype=Object.create(Error.prototype,{name:{value:"SecurityError"}});var Ub=b.Float64Array||b.Float32Array,Vb=b.console,Wb=!b.location.protocol.search(/https:|file:|chrome:|chrome-extension:/);Wb||void 0===Vb||Vb.warn("asmCrypto seems to be load from an insecure origin; this may cause to MitM-attack vulnerability. Consider using secure transport protocol."),a.string_to_bytes=f,a.hex_to_bytes=g,a.base64_to_bytes=h,a.bytes_to_string=i,a.bytes_to_hex=j,a.bytes_to_base64=k,b.IllegalStateError=c,b.IllegalArgumentError=d,b.SecurityError=e;var Xb=function(){"use strict";function a(){e=[],f=[];var a,b,c=1;for(a=0;255>a;a++)e[a]=c,b=128&c,c<<=1,c&=255,128===b&&(c^=27),c^=e[a],f[e[a]]=a;e[255]=e[0],f[0]=0,k=!0}function b(a,b){var c=e[(f[a]+f[b])%255];return(0===a||0===b)&&(c=0),c}function c(a){var b=e[255-f[a]];return 0===a&&(b=0),b}function d(){function d(a){var b,d,e;for(d=e=c(a),b=0;4>b;b++)d=255&(d<<1|d>>>7),e^=d;return e^=99}k||a(),g=[],h=[],i=[[],[],[],[]],j=[[],[],[],[]];for(var e=0;256>e;e++){var f=d(e);g[e]=f,h[f]=e,i[0][e]=b(2,f)<<24|f<<16|f<<8|b(3,f),j[0][f]=b(14,e)<<24|b(9,e)<<16|b(13,e)<<8|b(11,e);for(var l=1;4>l;l++)i[l][e]=i[l-1][e]>>>8|i[l-1][e]<<24,j[l][f]=j[l-1][f]>>>8|j[l-1][f]<<24}}var e,f,g,h,i,j,k=!1,l=!1,m=function(a,b,c){function e(a,b,c,d,e,h,i,k,l){var n=f.subarray(0,60),o=f.subarray(256,316);n.set([b,c,d,e,h,i,k,l]);for(var p=a,q=1;4*a+28>p;p++){var r=n[p-1];(p%a===0||8===a&&p%a===4)&&(r=g[r>>>24]<<24^g[r>>>16&255]<<16^g[r>>>8&255]<<8^g[255&r]),p%a===0&&(r=r<<8^r>>>24^q<<24,q=q<<1^(128&q?27:0)),n[p]=n[p-a]^r}for(var s=0;p>s;s+=4)for(var t=0;4>t;t++){var r=n[p-(4+s)+(4-t)%4];4>s||s>=p-4?o[s+t]=r:o[s+t]=j[0][g[r>>>24]]^j[1][g[r>>>16&255]]^j[2][g[r>>>8&255]]^j[3][g[255&r]]}m.set_rounds(a+5)}l||d();var f=new Uint32Array(c);f.set(g,512),f.set(h,768);for(var k=0;4>k;k++)f.set(i[k],4096+1024*k>>2),f.set(j[k],8192+1024*k>>2);var m=function(a,b,c){"use asm";var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;var y=new a.Uint32Array(c),z=new a.Uint8Array(c);function A(a,b,c,h,i,j,k,l){a=a|0;b=b|0;c=c|0;h=h|0;i=i|0;j=j|0;k=k|0;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;m=c|1024,n=c|2048,o=c|3072;i=i^y[(a|0)>>2],j=j^y[(a|4)>>2],k=k^y[(a|8)>>2],l=l^y[(a|12)>>2];for(t=16;(t|0)<=h<<4;t=t+16|0){p=y[(c|i>>22&1020)>>2]^y[(m|j>>14&1020)>>2]^y[(n|k>>6&1020)>>2]^y[(o|l<<2&1020)>>2]^y[(a|t|0)>>2],q=y[(c|j>>22&1020)>>2]^y[(m|k>>14&1020)>>2]^y[(n|l>>6&1020)>>2]^y[(o|i<<2&1020)>>2]^y[(a|t|4)>>2],r=y[(c|k>>22&1020)>>2]^y[(m|l>>14&1020)>>2]^y[(n|i>>6&1020)>>2]^y[(o|j<<2&1020)>>2]^y[(a|t|8)>>2],s=y[(c|l>>22&1020)>>2]^y[(m|i>>14&1020)>>2]^y[(n|j>>6&1020)>>2]^y[(o|k<<2&1020)>>2]^y[(a|t|12)>>2];i=p,j=q,k=r,l=s}d=y[(b|i>>22&1020)>>2]<<24^y[(b|j>>14&1020)>>2]<<16^y[(b|k>>6&1020)>>2]<<8^y[(b|l<<2&1020)>>2]^y[(a|t|0)>>2],e=y[(b|j>>22&1020)>>2]<<24^y[(b|k>>14&1020)>>2]<<16^y[(b|l>>6&1020)>>2]<<8^y[(b|i<<2&1020)>>2]^y[(a|t|4)>>2],f=y[(b|k>>22&1020)>>2]<<24^y[(b|l>>14&1020)>>2]<<16^y[(b|i>>6&1020)>>2]<<8^y[(b|j<<2&1020)>>2]^y[(a|t|8)>>2],g=y[(b|l>>22&1020)>>2]<<24^y[(b|i>>14&1020)>>2]<<16^y[(b|j>>6&1020)>>2]<<8^y[(b|k<<2&1020)>>2]^y[(a|t|12)>>2]}function B(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;A(0,2048,4096,x,a,b,c,d)}function C(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var f=0;A(1024,3072,8192,x,a,d,c,b);f=e,e=g,g=f}function D(a,b,c,l){a=a|0;b=b|0;c=c|0;l=l|0;A(0,2048,4096,x,h^a,i^b,j^c,k^l);h=d,i=e,j=f,k=g}function E(a,b,c,l){a=a|0;b=b|0;c=c|0;l=l|0;var m=0;A(1024,3072,8192,x,a,l,c,b);m=e,e=g,g=m;d=d^h,e=e^i,f=f^j,g=g^k;h=a,i=b,j=c,k=l}function F(a,b,c,l){a=a|0;b=b|0;c=c|0;l=l|0;A(0,2048,4096,x,h,i,j,k);h=d=d^a,i=e=e^b,j=f=f^c,k=g=g^l}function G(a,b,c,l){a=a|0;b=b|0;c=c|0;l=l|0;A(0,2048,4096,x,h,i,j,k);d=d^a,e=e^b,f=f^c,g=g^l;h=a,i=b,j=c,k=l}function H(a,b,c,l){a=a|0;b=b|0;c=c|0;l=l|0;A(0,2048,4096,x,h,i,j,k);h=d,i=e,j=f,k=g;d=d^a,e=e^b,f=f^c,g=g^l}function I(a,b,c,h){a=a|0;b=b|0;c=c|0;h=h|0;A(0,2048,4096,x,l,m,n,o);o=~s&o|s&o+1,n=~r&n|r&n+((o|0)==0),m=~q&m|q&m+((n|0)==0),l=~p&l|p&l+((m|0)==0);d=d^a,e=e^b,f=f^c,g=g^h}function J(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;a=a^h,b=b^i,c=c^j,d=d^k;e=t|0,f=u|0,g=v|0,l=w|0;for(;(q|0)<128;q=q+1|0){if(e>>>31){m=m^a,n=n^b,o=o^c,p=p^d}e=e<<1|f>>>31,f=f<<1|g>>>31,g=g<<1|l>>>31,l=l<<1;r=d&1;d=d>>>1|c<<31,c=c>>>1|b<<31,b=b>>>1|a<<31,a=a>>>1;if(r)a=a^3774873600}h=m,i=n,j=o,k=p}function K(a){a=a|0;x=a}function L(a,b,c,h){a=a|0;b=b|0;c=c|0;h=h|0;d=a,e=b,f=c,g=h}function M(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;h=a,i=b,j=c,k=d}function N(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;l=a,m=b,n=c,o=d}function O(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;p=a,q=b,r=c,s=d}function P(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;o=~s&o|s&d,n=~r&n|r&c,m=~q&m|q&b,l=~p&l|p&a}function Q(a){a=a|0;if(a&15)return-1;z[a|0]=d>>>24,z[a|1]=d>>>16&255,z[a|2]=d>>>8&255,z[a|3]=d&255,z[a|4]=e>>>24,z[a|5]=e>>>16&255,z[a|6]=e>>>8&255,z[a|7]=e&255,z[a|8]=f>>>24,z[a|9]=f>>>16&255,z[a|10]=f>>>8&255,z[a|11]=f&255,z[a|12]=g>>>24,z[a|13]=g>>>16&255,z[a|14]=g>>>8&255,z[a|15]=g&255;return 16}function R(a){a=a|0;if(a&15)return-1;z[a|0]=h>>>24,z[a|1]=h>>>16&255,z[a|2]=h>>>8&255,z[a|3]=h&255,z[a|4]=i>>>24,z[a|5]=i>>>16&255,z[a|6]=i>>>8&255,z[a|7]=i&255,z[a|8]=j>>>24,z[a|9]=j>>>16&255,z[a|10]=j>>>8&255,z[a|11]=j&255,z[a|12]=k>>>24,z[a|13]=k>>>16&255,z[a|14]=k>>>8&255,z[a|15]=k&255;return 16}function S(){B(0,0,0,0);t=d,u=e,v=f,w=g}function T(a,b,c){a=a|0;b=b|0;c=c|0;var h=0;if(b&15)return-1;while((c|0)>=16){V[a&7](z[b|0]<<24|z[b|1]<<16|z[b|2]<<8|z[b|3],z[b|4]<<24|z[b|5]<<16|z[b|6]<<8|z[b|7],z[b|8]<<24|z[b|9]<<16|z[b|10]<<8|z[b|11],z[b|12]<<24|z[b|13]<<16|z[b|14]<<8|z[b|15]);z[b|0]=d>>>24,z[b|1]=d>>>16&255,z[b|2]=d>>>8&255,z[b|3]=d&255,z[b|4]=e>>>24,z[b|5]=e>>>16&255,z[b|6]=e>>>8&255,z[b|7]=e&255,z[b|8]=f>>>24,z[b|9]=f>>>16&255,z[b|10]=f>>>8&255,z[b|11]=f&255,z[b|12]=g>>>24,z[b|13]=g>>>16&255,z[b|14]=g>>>8&255,z[b|15]=g&255;h=h+16|0,b=b+16|0,c=c-16|0}return h|0}function U(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;if(b&15)return-1;while((c|0)>=16){W[a&1](z[b|0]<<24|z[b|1]<<16|z[b|2]<<8|z[b|3],z[b|4]<<24|z[b|5]<<16|z[b|6]<<8|z[b|7],z[b|8]<<24|z[b|9]<<16|z[b|10]<<8|z[b|11],z[b|12]<<24|z[b|13]<<16|z[b|14]<<8|z[b|15]);d=d+16|0,b=b+16|0,c=c-16|0}return d|0}var V=[B,C,D,E,F,G,H,I];var W=[D,J];return{set_rounds:K,set_state:L,set_iv:M,set_nonce:N,set_mask:O,set_counter:P,get_state:Q,get_iv:R,gcm_init:S,cipher:T,mac:U}}(a,b,c);return m.set_key=e,m};return m.ENC={ECB:0,CBC:2,CFB:4,OFB:6,CTR:7},m.DEC={ECB:1,CBC:3,CFB:5,OFB:6,CTR:7},m.MAC={CBC:0,GCM:1},m.HEAP_DATA=16384,m}(),Yb=C.prototype;Yb.BLOCK_SIZE=16,Yb.reset=x,Yb.encrypt=z,Yb.decrypt=B;var Zb=D.prototype;Zb.BLOCK_SIZE=16,Zb.reset=x,Zb.process=y,Zb.finish=z;var $b=E.prototype;$b.BLOCK_SIZE=16,$b.reset=x,$b.process=A,$b.finish=B;var _b=F.prototype;_b.BLOCK_SIZE=16,_b.reset=I,_b.encrypt=z,_b.decrypt=z;var ac=G.prototype;ac.BLOCK_SIZE=16,ac.reset=I,ac.process=y,ac.finish=z;var bc=68719476704,cc=K.prototype;cc.BLOCK_SIZE=16,cc.reset=N,cc.encrypt=Q,cc.decrypt=T;var dc=L.prototype;dc.BLOCK_SIZE=16,dc.reset=N,dc.process=O,dc.finish=P;var ec=M.prototype;ec.BLOCK_SIZE=16,ec.reset=N,ec.process=R,ec.finish=S;var fc=new Uint8Array(1048576),gc=Xb(b,null,fc.buffer);a.AES_CBC=C,a.AES_CBC.encrypt=U,a.AES_CBC.decrypt=V,a.AES_CBC.Encrypt=D,a.AES_CBC.Decrypt=E,a.AES_GCM=K,a.AES_GCM.encrypt=W,a.AES_GCM.decrypt=X,a.AES_GCM.Encrypt=L,a.AES_GCM.Decrypt=M;var hc=64,ic=20;aa.BLOCK_SIZE=hc,aa.HASH_SIZE=ic;var jc=aa.prototype;jc.reset=Y,jc.process=Z,jc.finish=$;var kc=null;aa.bytes=ca,aa.hex=da,aa.base64=ea,a.SHA1=aa;var lc=64,mc=32;ga.BLOCK_SIZE=lc,ga.HASH_SIZE=mc;var nc=ga.prototype;nc.reset=Y,nc.process=Z,nc.finish=$;var oc=null;ga.bytes=ia,ga.hex=ja,ga.base64=ka,a.SHA256=ga;var pc=la.prototype;pc.reset=oa,pc.process=pa,pc.finish=qa,ra.BLOCK_SIZE=aa.BLOCK_SIZE,ra.HMAC_SIZE=aa.HASH_SIZE;var qc=ra.prototype;qc.reset=sa,qc.process=pa,qc.finish=ta;var rc=null;va.BLOCK_SIZE=ga.BLOCK_SIZE,va.HMAC_SIZE=ga.HASH_SIZE;var sc=va.prototype;sc.reset=wa,sc.process=pa,sc.finish=xa;var tc=null;a.HMAC=la,ra.bytes=za,ra.hex=Aa,ra.base64=Ba,a.HMAC_SHA1=ra,va.bytes=Ca,va.hex=Da,va.base64=Ea,a.HMAC_SHA256=va;var uc=Fa.prototype;uc.reset=Ga,uc.generate=Ha;var vc=Ia.prototype;vc.reset=Ga,vc.generate=Ja;var wc=null,xc=La.prototype;xc.reset=Ga,xc.generate=Ma;var yc=null;a.PBKDF2=a.PBKDF2_HMAC_SHA1={bytes:Oa,hex:Pa,base64:Qa},a.PBKDF2_HMAC_SHA256={bytes:Ra,hex:Sa,base64:Ta};var zc,Ac=function(){function a(){function a(){b^=d<<11,l=l+b|0,d=d+f|0,d^=f>>>2,m=m+d|0,f=f+l|0,f^=l<<8,n=n+f|0,l=l+m|0,l^=m>>>16,o=o+l|0,m=m+n|0,m^=n<<10,p=p+m|0,n=n+o|0,n^=o>>>4,b=b+n|0,o=o+p|0,o^=p<<8,d=d+o|0,p=p+b|0,p^=b>>>9,f=f+p|0,b=b+d|0}var b,d,f,l,m,n,o,p;h=i=j=0,b=d=f=l=m=n=o=p=2654435769;for(var q=0;4>q;q++)a();for(var q=0;256>q;q+=8)b=b+g[0|q]|0,d=d+g[1|q]|0,f=f+g[2|q]|0,l=l+g[3|q]|0,m=m+g[4|q]|0,n=n+g[5|q]|0,o=o+g[6|q]|0,p=p+g[7|q]|0,a(),e.set([b,d,f,l,m,n,o,p],q);for(var q=0;256>q;q+=8)b=b+e[0|q]|0,d=d+e[1|q]|0,f=f+e[2|q]|0,l=l+e[3|q]|0,m=m+e[4|q]|0,n=n+e[5|q]|0,o=o+e[6|q]|0,p=p+e[7|q]|0,a(),e.set([b,d,f,l,m,n,o,p],q);c(1),k=256}function b(b){var c,d,e,h,i;if(q(b))b=new Uint8Array(b.buffer);else if(m(b))h=new Ub(1),h[0]=b,b=new Uint8Array(h.buffer);else if(n(b))b=f(b);else{if(!o(b))throw new TypeError("bad seed type");b=new Uint8Array(b)}for(i=b.length,d=0;i>d;d+=1024){for(e=d,c=0;1024>c&&i>e;e=d|++c)g[c>>2]^=b[e]<<((3&c)<<3);a()}}function c(a){a=a||1;for(var b,c,d;a--;)for(j=j+1|0,i=i+j|0,b=0;256>b;b+=4)h^=h<<13,h=e[b+128&255]+h|0,c=e[0|b],e[0|b]=d=e[c>>>2&255]+(h+i|0)|0,g[0|b]=i=e[d>>>10&255]+c|0,h^=h>>>6,h=e[b+129&255]+h|0,c=e[1|b],e[1|b]=d=e[c>>>2&255]+(h+i|0)|0,g[1|b]=i=e[d>>>10&255]+c|0,h^=h<<2,h=e[b+130&255]+h|0,c=e[2|b],e[2|b]=d=e[c>>>2&255]+(h+i|0)|0,g[2|b]=i=e[d>>>10&255]+c|0,h^=h>>>16,h=e[b+131&255]+h|0,c=e[3|b],e[3|b]=d=e[c>>>2&255]+(h+i|0)|0,g[3|b]=i=e[d>>>10&255]+c|0}function d(){return k--||(c(1),k=255),g[k]}var e=new Uint32Array(256),g=new Uint32Array(256),h=0,i=0,j=0,k=0;return{seed:b,prng:c,rand:d}}(),Vb=b.console,Bc=b.Date.now,Cc=b.Math.random,Dc=b.performance,Ec=b.crypto||b.msCrypto;void 0!==Ec&&(zc=Ec.getRandomValues);var Fc,Gc=Ac.rand,Hc=Ac.seed,Ic=0,Jc=!1,Kc=!1,Lc=0,Mc=256,Nc=!1,Oc=!1,Pc={};if(void 0!==Dc)Fc=function(){return 1e3*Dc.now()|0};else{var Qc=1e3*Bc()|0;Fc=function(){return 1e3*Bc()-Qc|0}}a.random=Xa,a.random.seed=Va,Object.defineProperty(Xa,"allowWeak",{get:function(){return Nc},set:function(a){Nc=a}}),Object.defineProperty(Xa,"skipSystemRNGWarning",{get:function(){return Oc},set:function(a){Oc=a}}),a.getRandomValues=Wa,a.getRandomValues.seed=Va,Object.defineProperty(Wa,"allowWeak",{get:function(){return Nc},set:function(a){Nc=a}}),Object.defineProperty(Wa,"skipSystemRNGWarning",{get:function(){return Oc},set:function(a){Oc=a}}),b.Math.random=Xa,void 0===b.crypto&&(b.crypto={}),b.crypto.getRandomValues=Wa;var Rc;Rc=void 0===b.Math.imul?function(a,c,d){b.Math.imul=Ya;var e=Za(a,c,d);return delete b.Math.imul,e}:Za;var Sc=new Uint32Array(1048576),Za=Rc(b,null,Sc.buffer),Tc=new Uint32Array(0),Uc=_a.prototype=new Number;Uc.toString=ab,Uc.toBytes=bb,Uc.valueOf=cb,Uc.clamp=db,Uc.slice=eb,Uc.negate=fb,Uc.compare=gb,Uc.add=hb,Uc.subtract=ib,Uc.multiply=jb,Uc.square=kb,Uc.divide=lb;var Vc=new _a(0),Wc=new _a(1);Object.freeze(Vc),Object.freeze(Wc);var Xc=ob.prototype=new _a;Xc.reduce=pb,Xc.inverse=qb,Xc.power=rb;var Yc=[2,3];Uc.isProbablePrime=ub,_a.randomProbablePrime=wb,_a.ZERO=Vc,_a.ONE=Wc,_a.extGCD=nb,a.BigNumber=_a,a.Modulus=ob;var Zc=xb.prototype;Zc.reset=yb,Zc.encrypt=zb,Zc.decrypt=Ab,xb.generateKey=Bb;var $c=Cb.prototype;$c.reset=Db,$c.encrypt=Eb,$c.decrypt=Fb;var _c=Hb.prototype;return _c.reset=Ib,_c.sign=Jb,_c.verify=Kb,a.RSA={generateKey:Lb},a.RSA_OAEP=Cb,a.RSA_OAEP_SHA1={encrypt:Mb,decrypt:Nb},a.RSA_OAEP=Cb,a.RSA_OAEP_SHA256={encrypt:Ob,decrypt:Pb},a.RSA_PSS=Hb,a.RSA_PSS_SHA1={sign:Qb,verify:Rb},a.RSA_PSS=Hb,a.RSA_PSS_SHA256={sign:Sb,verify:Tb}, true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){return a}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"object"==typeof module&&module.exports?module.exports=a:b.asmCrypto=a,a}({},function(){return this}());
	//# sourceMappingURL=asmcrypto.js.map

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Secret = function Secret(_ref) {
	    var id = _ref.id;
	    var username = _ref.username;
	    var password = _ref.password;
	    var comment = _ref.comment;
	
	    _classCallCheck(this, Secret);
	
	    this.id = id;
	    this.username = username;
	    this.password = password;
	    this.comment = comment;
	}
	
	// static
	;
	
	var EncryptedSecret = function () {
	    function EncryptedSecret(_ref2) {
	        var id = _ref2.id;
	        var salt = _ref2.salt;
	        var iv = _ref2.iv;
	        var text = _ref2.text;
	
	        _classCallCheck(this, EncryptedSecret);
	
	        this.id = id;
	        this.salt = salt;
	        this.iv = iv;
	        this.text = text;
	    }
	
	    _createClass(EncryptedSecret, [{
	        key: 'decrypt',
	        value: function decrypt(password) {}
	    }]);
	
	    return EncryptedSecret;
	}();
	
	var Vault = function () {
	    function Vault(_ref3) {
	        var _ref3$id = _ref3.id;
	        var id = _ref3$id === undefined ? 1 : _ref3$id;
	        var _ref3$title = _ref3.title;
	        var title = _ref3$title === undefined ? 'Default vault' : _ref3$title;
	        var _ref3$salt = _ref3.salt;
	        var salt = _ref3$salt === undefined ? null : _ref3$salt;
	        var _ref3$iv = _ref3.iv;
	        var iv = _ref3$iv === undefined ? null : _ref3$iv;
	        var _ref3$secrets = _ref3.secrets;
	        var secrets = _ref3$secrets === undefined ? [] : _ref3$secrets;
	
	        _classCallCheck(this, Vault);
	
	        this.id = id;
	        this.title = title;
	        this.salt = salt;
	        this.iv = iv;
	        this.secrets = secrets;
	        this.decryptedSecrets = [];
	    }
	
	    _createClass(Vault, [{
	        key: 'open',
	        value: function open(password) {
	            var _this = this;
	
	            // const decrypt = x => x;
	            // const encrypt = x => x;
	            this.decryptedSecrets = this.secrets.map(secret = decrypt(secret, password, this.salt, this.iv));
	
	            this.addSecret = function (secret) {
	                _this.secrets.push(encrypt(secret, password, _this.salt, _this.iv));
	            };
	        }
	    }, {
	        key: 'lock',
	        value: function lock() {
	            this.decryptedSecrets.length = 0;
	        }
	
	        // add(secret) {
	        //     const encrypt = x => x;
	        //     this.secrets.push(encrypt(secret))
	        // }
	
	    }, {
	        key: 'serialize',
	        value: function serialize() {
	            return {
	                id: this.id,
	                title: this.title,
	                salt: this.salt,
	                iv: this.iv,
	                secrets: this.secrets
	            };
	        }
	    }, {
	        key: 'remove',
	        value: function remove() {}
	    }, {
	        key: 'isInitialized',
	        get: function get() {
	            return this.salt && this.iv;
	        }
	    }]);
	
	    return Vault;
	}();
	
	exports.default = Vault;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";
	
	/*! cash-dom 1.3.4, https://github.com/kenwheeler/cash @license MIT */
	(function (root, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    module.exports = factory();
	  } else {
	    root.cash = root.$ = factory();
	  }
	})(this, function () {
	  var doc = document, win = window, ArrayProto = Array.prototype, slice = ArrayProto.slice, filter = ArrayProto.filter, push = ArrayProto.push;
	
	  var noop = function () {}, isFunction = function (item) {
	    return typeof item === typeof noop;
	  }, isString = function (item) {
	    return typeof item === typeof "";
	  };
	
	  var idMatch = /^#[\w-]*$/, classMatch = /^\.[\w-]*$/, htmlMatch = /<.+>/, singlet = /^\w+$/;
	
	  function find(selector, context) {
	    context = context || doc;
	    var elems = (classMatch.test(selector) ? context.getElementsByClassName(selector.slice(1)) : singlet.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
	    return elems;
	  }
	
	  var frag, tmp;
	  function parseHTML(str) {
	    frag = frag || doc.createDocumentFragment();
	    tmp = tmp || frag.appendChild(doc.createElement("div"));
	    tmp.innerHTML = str;
	    return tmp.childNodes;
	  }
	
	  function onReady(fn) {
	    if (doc.readyState !== "loading") {
	      fn();
	    } else {
	      doc.addEventListener("DOMContentLoaded", fn);
	    }
	  }
	
	  function Init(selector, context) {
	    if (!selector) {
	      return this;
	    }
	
	    // If already a cash collection, don't do any further processing
	    if (selector.cash && selector !== win) {
	      return selector;
	    }
	
	    var elems = selector, i = 0, length;
	
	    if (isString(selector)) {
	      elems = (idMatch.test(selector) ?
	      // If an ID use the faster getElementById check
	      doc.getElementById(selector.slice(1)) : htmlMatch.test(selector) ?
	      // If HTML, parse it into real elements
	      parseHTML(selector) :
	      // else use `find`
	      find(selector, context));
	
	      // If function, use as shortcut for DOM ready
	    } else if (isFunction(selector)) {
	      onReady(selector);return this;
	    }
	
	    if (!elems) {
	      return this;
	    }
	
	    // If a single DOM element is passed in or received via ID, return the single element
	    if (elems.nodeType || elems === win) {
	      this[0] = elems;
	      this.length = 1;
	    } else {
	      // Treat like an array and loop through each item.
	      length = this.length = elems.length;
	      for (; i < length; i++) {
	        this[i] = elems[i];
	      }
	    }
	
	    return this;
	  }
	
	  function cash(selector, context) {
	    return new Init(selector, context);
	  }
	
	  var fn = cash.fn = cash.prototype = Init.prototype = { // jshint ignore:line
	    constructor: cash,
	    cash: true,
	    length: 0,
	    push: push,
	    splice: ArrayProto.splice,
	    map: ArrayProto.map,
	    init: Init
	  };
	
	  cash.parseHTML = parseHTML;
	  cash.noop = noop;
	  cash.isFunction = isFunction;
	  cash.isString = isString;
	
	  cash.extend = fn.extend = function (target) {
	    target = target || {};
	
	    var args = slice.call(arguments), length = args.length, i = 1;
	
	    if (args.length === 1) {
	      target = this;
	      i = 0;
	    }
	
	    for (; i < length; i++) {
	      if (!args[i]) {
	        continue;
	      }
	      for (var key in args[i]) {
	        if (args[i].hasOwnProperty(key)) {
	          target[key] = args[i][key];
	        }
	      }
	    }
	
	    return target;
	  };
	
	  function each(collection, callback) {
	    var l = collection.length, i = 0;
	
	    for (; i < l; i++) {
	      if (callback.call(collection[i], collection[i], i, collection) === false) {
	        break;
	      }
	    }
	  }
	
	  function matches(el, selector) {
	    var m = el && (el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector);
	    return !!m && m.call(el, selector);
	  }
	
	  function unique(collection) {
	    return cash(slice.call(collection).filter(function (item, index, self) {
	      return self.indexOf(item) === index;
	    }));
	  }
	
	  cash.extend({
	    merge: function (first, second) {
	      var len = +second.length, i = first.length, j = 0;
	
	      for (; j < len; i++, j++) {
	        first[i] = second[j];
	      }
	
	      first.length = i;
	      return first;
	    },
	
	    each: each,
	    matches: matches,
	    unique: unique,
	    isArray: Array.isArray,
	    isNumeric: function (n) {
	      return !isNaN(parseFloat(n)) && isFinite(n);
	    }
	
	  });
	
	  var uid = cash.uid = "_cash" + Date.now();
	
	  function getDataCache(node) {
	    return (node[uid] = node[uid] || {});
	  }
	
	  function setData(node, key, value) {
	    return (getDataCache(node)[key] = value);
	  }
	
	  function getData(node, key) {
	    var c = getDataCache(node);
	    if (c[key] === undefined) {
	      c[key] = node.dataset ? node.dataset[key] : cash(node).attr("data-" + key);
	    }
	    return c[key];
	  }
	
	  function removeData(node, key) {
	    var c = getDataCache(node);
	    if (c) {
	      delete c[key];
	    } else if (node.dataset) {
	      delete node.dataset[key];
	    } else {
	      cash(node).removeAttr("data-" + name);
	    }
	  }
	
	  fn.extend({
	    data: function (name, value) {
	      if (isString(name)) {
	        return (value === undefined ? getData(this[0], name) : this.each(function (v) {
	          return setData(v, name, value);
	        }));
	      }
	
	      for (var key in name) {
	        this.data(key, name[key]);
	      }
	
	      return this;
	    },
	
	    removeData: function (key) {
	      return this.each(function (v) {
	        return removeData(v, key);
	      });
	    }
	
	  });
	
	  var notWhiteMatch = /\S+/g;
	
	  function getClasses(c) {
	    return isString(c) && c.match(notWhiteMatch);
	  }
	
	  function hasClass(v, c) {
	    return (v.classList ? v.classList.contains(c) : new RegExp("(^| )" + c + "( |$)", "gi").test(v.className));
	  }
	
	  function addClass(v, c, spacedName) {
	    if (v.classList) {
	      v.classList.add(c);
	    } else if (spacedName.indexOf(" " + c + " ")) {
	      v.className += " " + c;
	    }
	  }
	
	  function removeClass(v, c) {
	    if (v.classList) {
	      v.classList.remove(c);
	    } else {
	      v.className = v.className.replace(c, "");
	    }
	  }
	
	  fn.extend({
	    addClass: function (c) {
	      var classes = getClasses(c);
	
	      return (classes ? this.each(function (v) {
	        var spacedName = " " + v.className + " ";
	        each(classes, function (c) {
	          addClass(v, c, spacedName);
	        });
	      }) : this);
	    },
	
	    attr: function (name, value) {
	      if (!name) {
	        return undefined;
	      }
	
	      if (isString(name)) {
	        if (value === undefined) {
	          return this[0] ? this[0].getAttribute ? this[0].getAttribute(name) : this[0][name] : undefined;
	        }
	
	        return this.each(function (v) {
	          if (v.setAttribute) {
	            v.setAttribute(name, value);
	          } else {
	            v[name] = value;
	          }
	        });
	      }
	
	      for (var key in name) {
	        this.attr(key, name[key]);
	      }
	
	      return this;
	    },
	
	    hasClass: function (c) {
	      var check = false, classes = getClasses(c);
	      if (classes && classes.length) {
	        this.each(function (v) {
	          check = hasClass(v, classes[0]);
	          return !check;
	        });
	      }
	      return check;
	    },
	
	    prop: function (name, value) {
	      if (isString(name)) {
	        return (value === undefined ? this[0][name] : this.each(function (v) {
	          v[name] = value;
	        }));
	      }
	
	      for (var key in name) {
	        this.prop(key, name[key]);
	      }
	
	      return this;
	    },
	
	    removeAttr: function (name) {
	      return this.each(function (v) {
	        if (v.removeAttribute) {
	          v.removeAttribute(name);
	        } else {
	          delete v[name];
	        }
	      });
	    },
	
	    removeClass: function (c) {
	      if (!arguments.length) {
	        return this.attr("class", "");
	      }
	      var classes = getClasses(c);
	      return (classes ? this.each(function (v) {
	        each(classes, function (c) {
	          removeClass(v, c);
	        });
	      }) : this);
	    },
	
	    removeProp: function (name) {
	      return this.each(function (v) {
	        delete v[name];
	      });
	    },
	
	    toggleClass: function (c, state) {
	      if (state !== undefined) {
	        return this[state ? "addClass" : "removeClass"](c);
	      }
	      var classes = getClasses(c);
	      return (classes ? this.each(function (v) {
	        var spacedName = " " + v.className + " ";
	        each(classes, function (c) {
	          if (hasClass(v, c)) {
	            removeClass(v, c);
	          } else {
	            addClass(v, c, spacedName);
	          }
	        });
	      }) : this);
	    } });
	
	  fn.extend({
	    add: function (selector, context) {
	      return unique(cash.merge(this, cash(selector, context)));
	    },
	
	    each: function (callback) {
	      each(this, callback);
	      return this;
	    },
	
	    eq: function (index) {
	      return cash(this.get(index));
	    },
	
	    filter: function (selector) {
	      return cash(filter.call(this, (isString(selector) ? function (e) {
	        return matches(e, selector);
	      } : selector)));
	    },
	
	    first: function () {
	      return this.eq(0);
	    },
	
	    get: function (index) {
	      if (index === undefined) {
	        return slice.call(this);
	      }
	      return (index < 0 ? this[index + this.length] : this[index]);
	    },
	
	    index: function (elem) {
	      var child = elem ? cash(elem)[0] : this[0], collection = elem ? this : cash(child).parent().children();
	      return slice.call(collection).indexOf(child);
	    },
	
	    last: function () {
	      return this.eq(-1);
	    }
	
	  });
	
	  var camelCase = (function () {
	    var camelRegex = /(?:^\w|[A-Z]|\b\w)/g, whiteSpace = /[\s-_]+/g;
	    return function (str) {
	      return str.replace(camelRegex, function (letter, index) {
	        return letter[index === 0 ? "toLowerCase" : "toUpperCase"]();
	      }).replace(whiteSpace, "");
	    };
	  }());
	
	  var getPrefixedProp = (function () {
	    var cache = {}, doc = document, div = doc.createElement("div"), style = div.style;
	
	    return function (prop) {
	      prop = camelCase(prop);
	      if (cache[prop]) {
	        return cache[prop];
	      }
	
	      var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1), prefixes = ["webkit", "moz", "ms", "o"], props = (prop + " " + (prefixes).join(ucProp + " ") + ucProp).split(" ");
	
	      each(props, function (p) {
	        if (p in style) {
	          cache[p] = prop = cache[prop] = p;
	          return false;
	        }
	      });
	
	      return cache[prop];
	    };
	  }());
	
	  cash.prefixedProp = getPrefixedProp;
	  cash.camelCase = camelCase;
	
	  fn.extend({
	    css: function (prop, value) {
	      if (isString(prop)) {
	        prop = getPrefixedProp(prop);
	        return (arguments.length > 1 ? this.each(function (v) {
	          return v.style[prop] = value;
	        }) : win.getComputedStyle(this[0])[prop]);
	      }
	
	      for (var key in prop) {
	        this.css(key, prop[key]);
	      }
	
	      return this;
	    }
	
	  });
	
	  function compute(el, prop) {
	    return parseInt(win.getComputedStyle(el[0], null)[prop], 10) || 0;
	  }
	
	  each(["Width", "Height"], function (v) {
	    var lower = v.toLowerCase();
	
	    fn[lower] = function () {
	      return this[0].getBoundingClientRect()[lower];
	    };
	
	    fn["inner" + v] = function () {
	      return this[0]["client" + v];
	    };
	
	    fn["outer" + v] = function (margins) {
	      return this[0]["offset" + v] + (margins ? compute(this, "margin" + (v === "Width" ? "Left" : "Top")) + compute(this, "margin" + (v === "Width" ? "Right" : "Bottom")) : 0);
	    };
	  });
	
	  function registerEvent(node, eventName, callback) {
	    var eventCache = getData(node, "_cashEvents") || setData(node, "_cashEvents", {});
	    eventCache[eventName] = eventCache[eventName] || [];
	    eventCache[eventName].push(callback);
	    node.addEventListener(eventName, callback);
	  }
	
	  function removeEvent(node, eventName, callback) {
	    var eventCache = getData(node, "_cashEvents")[eventName];
	    if (callback) {
	      node.removeEventListener(eventName, callback);
	    } else {
	      each(eventCache, function (event) {
	        node.removeEventListener(eventName, event);
	      });
	      eventCache = [];
	    }
	  }
	
	  fn.extend({
	    off: function (eventName, callback) {
	      return this.each(function (v) {
	        return removeEvent(v, eventName, callback);
	      });
	    },
	
	    on: function (eventName, delegate, callback, runOnce) {
	      // jshint ignore:line
	
	      var originalCallback;
	
	      if (!isString(eventName)) {
	        for (var key in eventName) {
	          this.on(key, delegate, eventName[key]);
	        }
	        return this;
	      }
	
	      if (isFunction(delegate)) {
	        callback = delegate;
	        delegate = null;
	      }
	
	      if (eventName === "ready") {
	        onReady(callback);
	        return this;
	      }
	
	      if (delegate) {
	        originalCallback = callback;
	        callback = function (e) {
	          var t = e.target;
	
	          while (!matches(t, delegate)) {
	            if (t === this) {
	              return (t = false);
	            }
	            t = t.parentNode;
	          }
	
	          if (t) {
	            originalCallback.call(t, e);
	          }
	        };
	      }
	
	      return this.each(function (v) {
	        var finalCallback = callback;
	        if (runOnce) {
	          finalCallback = function () {
	            callback.apply(this, arguments);
	            removeEvent(v, eventName, finalCallback);
	          };
	        }
	        registerEvent(v, eventName, finalCallback);
	      });
	    },
	
	    one: function (eventName, delegate, callback) {
	      return this.on(eventName, delegate, callback, true);
	    },
	
	    ready: onReady,
	
	    trigger: function (eventName, data) {
	      var evt = doc.createEvent("HTMLEvents");
	      evt.data = data;
	      evt.initEvent(eventName, true, false);
	      return this.each(function (v) {
	        return v.dispatchEvent(evt);
	      });
	    }
	
	  });
	
	  function encode(name, value) {
	    return "&" + encodeURIComponent(name) + "=" + encodeURIComponent(value).replace(/%20/g, "+");
	  }
	  function isCheckable(field) {
	    return field.type === "radio" || field.type === "checkbox";
	  }
	
	  var formExcludes = ["file", "reset", "submit", "button"];
	
	  fn.extend({
	    serialize: function () {
	      var formEl = this[0].elements, query = "";
	
	      each(formEl, function (field) {
	        if (field.name && formExcludes.indexOf(field.type) < 0) {
	          if (field.type === "select-multiple") {
	            each(field.options, function (o) {
	              if (o.selected) {
	                query += encode(field.name, o.value);
	              }
	            });
	          } else if (!isCheckable(field) || (isCheckable(field) && field.checked)) {
	            query += encode(field.name, field.value);
	          }
	        }
	      });
	
	      return query.substr(1);
	    },
	
	    val: function (value) {
	      if (value === undefined) {
	        return this[0].value;
	      } else {
	        return this.each(function (v) {
	          return v.value = value;
	        });
	      }
	    }
	
	  });
	
	  function insertElement(el, child, prepend) {
	    if (prepend) {
	      var first = el.childNodes[0];
	      el.insertBefore(child, first);
	    } else {
	      el.appendChild(child);
	    }
	  }
	
	  function insertContent(parent, child, prepend) {
	    var str = isString(child);
	
	    if (!str && child.length) {
	      each(child, function (v) {
	        return insertContent(parent, v, prepend);
	      });
	      return;
	    }
	
	    each(parent, str ? function (v) {
	      return v.insertAdjacentHTML(prepend ? "afterbegin" : "beforeend", child);
	    } : function (v, i) {
	      return insertElement(v, (i === 0 ? child : child.cloneNode(true)), prepend);
	    });
	  }
	
	  fn.extend({
	    after: function (selector) {
	      cash(selector).insertAfter(this);
	      return this;
	    },
	
	    append: function (content) {
	      insertContent(this, content);
	      return this;
	    },
	
	    appendTo: function (parent) {
	      insertContent(cash(parent), this);
	      return this;
	    },
	
	    before: function (selector) {
	      cash(selector).insertBefore(this);
	      return this;
	    },
	
	    clone: function () {
	      return cash(this.map(function (v) {
	        return v.cloneNode(true);
	      }));
	    },
	
	    empty: function () {
	      this.html("");
	      return this;
	    },
	
	    html: function (content) {
	      if (content === undefined) {
	        return this[0].innerHTML;
	      }
	      var source = (content.nodeType ? content[0].outerHTML : content);
	      return this.each(function (v) {
	        return v.innerHTML = source;
	      });
	    },
	
	    insertAfter: function (selector) {
	      var _this = this;
	
	
	      cash(selector).each(function (el, i) {
	        var parent = el.parentNode, sibling = el.nextSibling;
	        _this.each(function (v) {
	          parent.insertBefore((i === 0 ? v : v.cloneNode(true)), sibling);
	        });
	      });
	
	      return this;
	    },
	
	    insertBefore: function (selector) {
	      var _this2 = this;
	      cash(selector).each(function (el, i) {
	        var parent = el.parentNode;
	        _this2.each(function (v) {
	          parent.insertBefore((i === 0 ? v : v.cloneNode(true)), el);
	        });
	      });
	      return this;
	    },
	
	    prepend: function (content) {
	      insertContent(this, content, true);
	      return this;
	    },
	
	    prependTo: function (parent) {
	      insertContent(cash(parent), this, true);
	      return this;
	    },
	
	    remove: function () {
	      return this.each(function (v) {
	        return v.parentNode.removeChild(v);
	      });
	    },
	
	    text: function (content) {
	      if (content === undefined) {
	        return this[0].textContent;
	      }
	      return this.each(function (v) {
	        return v.textContent = content;
	      });
	    }
	
	  });
	
	  var docEl = doc.documentElement;
	
	  fn.extend({
	    position: function () {
	      var el = this[0];
	      return {
	        left: el.offsetLeft,
	        top: el.offsetTop
	      };
	    },
	
	    offset: function () {
	      var rect = this[0].getBoundingClientRect();
	      return {
	        top: rect.top + win.pageYOffset - docEl.clientTop,
	        left: rect.left + win.pageXOffset - docEl.clientLeft
	      };
	    },
	
	    offsetParent: function () {
	      return cash(this[0].offsetParent);
	    }
	
	  });
	
	  function directCompare(el, selector) {
	    return el === selector;
	  }
	
	  fn.extend({
	    children: function (selector) {
	      var elems = [];
	      this.each(function (el) {
	        push.apply(elems, el.children);
	      });
	      elems = unique(elems);
	
	      return (!selector ? elems : elems.filter(function (v) {
	        return matches(v, selector);
	      }));
	    },
	
	    closest: function (selector) {
	      if (!selector || matches(this[0], selector)) {
	        return this;
	      }
	      return this.parent().closest(selector);
	    },
	
	    is: function (selector) {
	      if (!selector) {
	        return false;
	      }
	
	      var match = false, comparator = (isString(selector) ? matches : selector.cash ? function (el) {
	        return selector.is(el);
	      } : directCompare);
	
	      this.each(function (el, i) {
	        match = comparator(el, selector, i);
	        return !match;
	      });
	
	      return match;
	    },
	
	    find: function (selector) {
	      if (!selector) {
	        return cash();
	      }
	
	      var elems = [];
	      this.each(function (el) {
	        push.apply(elems, find(selector, el));
	      });
	
	      return unique(elems);
	    },
	
	    has: function (selector) {
	      return filter.call(this, function (el) {
	        return cash(el).find(selector).length !== 0;
	      });
	    },
	
	    next: function () {
	      return cash(this[0].nextElementSibling);
	    },
	
	    not: function (selector) {
	      return filter.call(this, function (el) {
	        return !matches(el, selector);
	      });
	    },
	
	    parent: function () {
	      var result = this.map(function (item) {
	        return item.parentElement || doc.body.parentNode;
	      });
	
	      return unique(result);
	    },
	
	    parents: function (selector) {
	      var last, result = [];
	
	      this.each(function (item) {
	        last = item;
	
	        while (last !== doc.body.parentNode) {
	          last = last.parentElement;
	
	          if (!selector || (selector && matches(last, selector))) {
	            result.push(last);
	          }
	        }
	      });
	
	      return unique(result);
	    },
	
	    prev: function () {
	      return cash(this[0].previousElementSibling);
	    },
	
	    siblings: function () {
	      var collection = this.parent().children(), el = this[0];
	
	      return filter.call(collection, function (i) {
	        return i !== el;
	      });
	    }
	
	  });
	
	
	  return cash;
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {/*!
	 * Vue.js v1.0.26
	 * (c) 2016 Evan You
	 * Released under the MIT License.
	 */
	'use strict';
	
	function set(obj, key, val) {
	  if (hasOwn(obj, key)) {
	    obj[key] = val;
	    return;
	  }
	  if (obj._isVue) {
	    set(obj._data, key, val);
	    return;
	  }
	  var ob = obj.__ob__;
	  if (!ob) {
	    obj[key] = val;
	    return;
	  }
	  ob.convert(key, val);
	  ob.dep.notify();
	  if (ob.vms) {
	    var i = ob.vms.length;
	    while (i--) {
	      var vm = ob.vms[i];
	      vm._proxy(key);
	      vm._digest();
	    }
	  }
	  return val;
	}
	
	/**
	 * Delete a property and trigger change if necessary.
	 *
	 * @param {Object} obj
	 * @param {String} key
	 */
	
	function del(obj, key) {
	  if (!hasOwn(obj, key)) {
	    return;
	  }
	  delete obj[key];
	  var ob = obj.__ob__;
	  if (!ob) {
	    if (obj._isVue) {
	      delete obj._data[key];
	      obj._digest();
	    }
	    return;
	  }
	  ob.dep.notify();
	  if (ob.vms) {
	    var i = ob.vms.length;
	    while (i--) {
	      var vm = ob.vms[i];
	      vm._unproxy(key);
	      vm._digest();
	    }
	  }
	}
	
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	 * Check whether the object has the property.
	 *
	 * @param {Object} obj
	 * @param {String} key
	 * @return {Boolean}
	 */
	
	function hasOwn(obj, key) {
	  return hasOwnProperty.call(obj, key);
	}
	
	/**
	 * Check if an expression is a literal value.
	 *
	 * @param {String} exp
	 * @return {Boolean}
	 */
	
	var literalValueRE = /^\s?(true|false|-?[\d\.]+|'[^']*'|"[^"]*")\s?$/;
	
	function isLiteral(exp) {
	  return literalValueRE.test(exp);
	}
	
	/**
	 * Check if a string starts with $ or _
	 *
	 * @param {String} str
	 * @return {Boolean}
	 */
	
	function isReserved(str) {
	  var c = (str + '').charCodeAt(0);
	  return c === 0x24 || c === 0x5F;
	}
	
	/**
	 * Guard text output, make sure undefined outputs
	 * empty string
	 *
	 * @param {*} value
	 * @return {String}
	 */
	
	function _toString(value) {
	  return value == null ? '' : value.toString();
	}
	
	/**
	 * Check and convert possible numeric strings to numbers
	 * before setting back to data
	 *
	 * @param {*} value
	 * @return {*|Number}
	 */
	
	function toNumber(value) {
	  if (typeof value !== 'string') {
	    return value;
	  } else {
	    var parsed = Number(value);
	    return isNaN(parsed) ? value : parsed;
	  }
	}
	
	/**
	 * Convert string boolean literals into real booleans.
	 *
	 * @param {*} value
	 * @return {*|Boolean}
	 */
	
	function toBoolean(value) {
	  return value === 'true' ? true : value === 'false' ? false : value;
	}
	
	/**
	 * Strip quotes from a string
	 *
	 * @param {String} str
	 * @return {String | false}
	 */
	
	function stripQuotes(str) {
	  var a = str.charCodeAt(0);
	  var b = str.charCodeAt(str.length - 1);
	  return a === b && (a === 0x22 || a === 0x27) ? str.slice(1, -1) : str;
	}
	
	/**
	 * Camelize a hyphen-delmited string.
	 *
	 * @param {String} str
	 * @return {String}
	 */
	
	var camelizeRE = /-(\w)/g;
	
	function camelize(str) {
	  return str.replace(camelizeRE, toUpper);
	}
	
	function toUpper(_, c) {
	  return c ? c.toUpperCase() : '';
	}
	
	/**
	 * Hyphenate a camelCase string.
	 *
	 * @param {String} str
	 * @return {String}
	 */
	
	var hyphenateRE = /([a-z\d])([A-Z])/g;
	
	function hyphenate(str) {
	  return str.replace(hyphenateRE, '$1-$2').toLowerCase();
	}
	
	/**
	 * Converts hyphen/underscore/slash delimitered names into
	 * camelized classNames.
	 *
	 * e.g. my-component => MyComponent
	 *      some_else    => SomeElse
	 *      some/comp    => SomeComp
	 *
	 * @param {String} str
	 * @return {String}
	 */
	
	var classifyRE = /(?:^|[-_\/])(\w)/g;
	
	function classify(str) {
	  return str.replace(classifyRE, toUpper);
	}
	
	/**
	 * Simple bind, faster than native
	 *
	 * @param {Function} fn
	 * @param {Object} ctx
	 * @return {Function}
	 */
	
	function bind(fn, ctx) {
	  return function (a) {
	    var l = arguments.length;
	    return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
	  };
	}
	
	/**
	 * Convert an Array-like object to a real Array.
	 *
	 * @param {Array-like} list
	 * @param {Number} [start] - start index
	 * @return {Array}
	 */
	
	function toArray(list, start) {
	  start = start || 0;
	  var i = list.length - start;
	  var ret = new Array(i);
	  while (i--) {
	    ret[i] = list[i + start];
	  }
	  return ret;
	}
	
	/**
	 * Mix properties into target object.
	 *
	 * @param {Object} to
	 * @param {Object} from
	 */
	
	function extend(to, from) {
	  var keys = Object.keys(from);
	  var i = keys.length;
	  while (i--) {
	    to[keys[i]] = from[keys[i]];
	  }
	  return to;
	}
	
	/**
	 * Quick object check - this is primarily used to tell
	 * Objects from primitive values when we know the value
	 * is a JSON-compliant type.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */
	
	function isObject(obj) {
	  return obj !== null && typeof obj === 'object';
	}
	
	/**
	 * Strict object type check. Only returns true
	 * for plain JavaScript objects.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */
	
	var toString = Object.prototype.toString;
	var OBJECT_STRING = '[object Object]';
	
	function isPlainObject(obj) {
	  return toString.call(obj) === OBJECT_STRING;
	}
	
	/**
	 * Array type check.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */
	
	var isArray = Array.isArray;
	
	/**
	 * Define a property.
	 *
	 * @param {Object} obj
	 * @param {String} key
	 * @param {*} val
	 * @param {Boolean} [enumerable]
	 */
	
	function def(obj, key, val, enumerable) {
	  Object.defineProperty(obj, key, {
	    value: val,
	    enumerable: !!enumerable,
	    writable: true,
	    configurable: true
	  });
	}
	
	/**
	 * Debounce a function so it only gets called after the
	 * input stops arriving after the given wait period.
	 *
	 * @param {Function} func
	 * @param {Number} wait
	 * @return {Function} - the debounced function
	 */
	
	function _debounce(func, wait) {
	  var timeout, args, context, timestamp, result;
	  var later = function later() {
	    var last = Date.now() - timestamp;
	    if (last < wait && last >= 0) {
	      timeout = setTimeout(later, wait - last);
	    } else {
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    }
	  };
	  return function () {
	    context = this;
	    args = arguments;
	    timestamp = Date.now();
	    if (!timeout) {
	      timeout = setTimeout(later, wait);
	    }
	    return result;
	  };
	}
	
	/**
	 * Manual indexOf because it's slightly faster than
	 * native.
	 *
	 * @param {Array} arr
	 * @param {*} obj
	 */
	
	function indexOf(arr, obj) {
	  var i = arr.length;
	  while (i--) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	}
	
	/**
	 * Make a cancellable version of an async callback.
	 *
	 * @param {Function} fn
	 * @return {Function}
	 */
	
	function cancellable(fn) {
	  var cb = function cb() {
	    if (!cb.cancelled) {
	      return fn.apply(this, arguments);
	    }
	  };
	  cb.cancel = function () {
	    cb.cancelled = true;
	  };
	  return cb;
	}
	
	/**
	 * Check if two values are loosely equal - that is,
	 * if they are plain objects, do they have the same shape?
	 *
	 * @param {*} a
	 * @param {*} b
	 * @return {Boolean}
	 */
	
	function looseEqual(a, b) {
	  /* eslint-disable eqeqeq */
	  return a == b || (isObject(a) && isObject(b) ? JSON.stringify(a) === JSON.stringify(b) : false);
	  /* eslint-enable eqeqeq */
	}
	
	var hasProto = ('__proto__' in {});
	
	// Browser environment sniffing
	var inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';
	
	// detect devtools
	var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
	
	// UA sniffing for working around browser-specific quirks
	var UA = inBrowser && window.navigator.userAgent.toLowerCase();
	var isIE = UA && UA.indexOf('trident') > 0;
	var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
	var isAndroid = UA && UA.indexOf('android') > 0;
	var isIos = UA && /(iphone|ipad|ipod|ios)/i.test(UA);
	var iosVersionMatch = isIos && UA.match(/os ([\d_]+)/);
	var iosVersion = iosVersionMatch && iosVersionMatch[1].split('_');
	
	// detecting iOS UIWebView by indexedDB
	var hasMutationObserverBug = iosVersion && Number(iosVersion[0]) >= 9 && Number(iosVersion[1]) >= 3 && !window.indexedDB;
	
	var transitionProp = undefined;
	var transitionEndEvent = undefined;
	var animationProp = undefined;
	var animationEndEvent = undefined;
	
	// Transition property/event sniffing
	if (inBrowser && !isIE9) {
	  var isWebkitTrans = window.ontransitionend === undefined && window.onwebkittransitionend !== undefined;
	  var isWebkitAnim = window.onanimationend === undefined && window.onwebkitanimationend !== undefined;
	  transitionProp = isWebkitTrans ? 'WebkitTransition' : 'transition';
	  transitionEndEvent = isWebkitTrans ? 'webkitTransitionEnd' : 'transitionend';
	  animationProp = isWebkitAnim ? 'WebkitAnimation' : 'animation';
	  animationEndEvent = isWebkitAnim ? 'webkitAnimationEnd' : 'animationend';
	}
	
	/**
	 * Defer a task to execute it asynchronously. Ideally this
	 * should be executed as a microtask, so we leverage
	 * MutationObserver if it's available, and fallback to
	 * setTimeout(0).
	 *
	 * @param {Function} cb
	 * @param {Object} ctx
	 */
	
	var nextTick = (function () {
	  var callbacks = [];
	  var pending = false;
	  var timerFunc;
	  function nextTickHandler() {
	    pending = false;
	    var copies = callbacks.slice(0);
	    callbacks = [];
	    for (var i = 0; i < copies.length; i++) {
	      copies[i]();
	    }
	  }
	
	  /* istanbul ignore if */
	  if (typeof MutationObserver !== 'undefined' && !hasMutationObserverBug) {
	    var counter = 1;
	    var observer = new MutationObserver(nextTickHandler);
	    var textNode = document.createTextNode(counter);
	    observer.observe(textNode, {
	      characterData: true
	    });
	    timerFunc = function () {
	      counter = (counter + 1) % 2;
	      textNode.data = counter;
	    };
	  } else {
	    // webpack attempts to inject a shim for setImmediate
	    // if it is used as a global, so we have to work around that to
	    // avoid bundling unnecessary code.
	    var context = inBrowser ? window : typeof global !== 'undefined' ? global : {};
	    timerFunc = context.setImmediate || setTimeout;
	  }
	  return function (cb, ctx) {
	    var func = ctx ? function () {
	      cb.call(ctx);
	    } : cb;
	    callbacks.push(func);
	    if (pending) return;
	    pending = true;
	    timerFunc(nextTickHandler, 0);
	  };
	})();
	
	var _Set = undefined;
	/* istanbul ignore if */
	if (typeof Set !== 'undefined' && Set.toString().match(/native code/)) {
	  // use native Set when available.
	  _Set = Set;
	} else {
	  // a non-standard Set polyfill that only works with primitive keys.
	  _Set = function () {
	    this.set = Object.create(null);
	  };
	  _Set.prototype.has = function (key) {
	    return this.set[key] !== undefined;
	  };
	  _Set.prototype.add = function (key) {
	    this.set[key] = 1;
	  };
	  _Set.prototype.clear = function () {
	    this.set = Object.create(null);
	  };
	}
	
	function Cache(limit) {
	  this.size = 0;
	  this.limit = limit;
	  this.head = this.tail = undefined;
	  this._keymap = Object.create(null);
	}
	
	var p = Cache.prototype;
	
	/**
	 * Put <value> into the cache associated with <key>.
	 * Returns the entry which was removed to make room for
	 * the new entry. Otherwise undefined is returned.
	 * (i.e. if there was enough room already).
	 *
	 * @param {String} key
	 * @param {*} value
	 * @return {Entry|undefined}
	 */
	
	p.put = function (key, value) {
	  var removed;
	
	  var entry = this.get(key, true);
	  if (!entry) {
	    if (this.size === this.limit) {
	      removed = this.shift();
	    }
	    entry = {
	      key: key
	    };
	    this._keymap[key] = entry;
	    if (this.tail) {
	      this.tail.newer = entry;
	      entry.older = this.tail;
	    } else {
	      this.head = entry;
	    }
	    this.tail = entry;
	    this.size++;
	  }
	  entry.value = value;
	
	  return removed;
	};
	
	/**
	 * Purge the least recently used (oldest) entry from the
	 * cache. Returns the removed entry or undefined if the
	 * cache was empty.
	 */
	
	p.shift = function () {
	  var entry = this.head;
	  if (entry) {
	    this.head = this.head.newer;
	    this.head.older = undefined;
	    entry.newer = entry.older = undefined;
	    this._keymap[entry.key] = undefined;
	    this.size--;
	  }
	  return entry;
	};
	
	/**
	 * Get and register recent use of <key>. Returns the value
	 * associated with <key> or undefined if not in cache.
	 *
	 * @param {String} key
	 * @param {Boolean} returnEntry
	 * @return {Entry|*}
	 */
	
	p.get = function (key, returnEntry) {
	  var entry = this._keymap[key];
	  if (entry === undefined) return;
	  if (entry === this.tail) {
	    return returnEntry ? entry : entry.value;
	  }
	  // HEAD--------------TAIL
	  //   <.older   .newer>
	  //  <--- add direction --
	  //   A  B  C  <D>  E
	  if (entry.newer) {
	    if (entry === this.head) {
	      this.head = entry.newer;
	    }
	    entry.newer.older = entry.older; // C <-- E.
	  }
	  if (entry.older) {
	    entry.older.newer = entry.newer; // C. --> E
	  }
	  entry.newer = undefined; // D --x
	  entry.older = this.tail; // D. --> E
	  if (this.tail) {
	    this.tail.newer = entry; // E. <-- D
	  }
	  this.tail = entry;
	  return returnEntry ? entry : entry.value;
	};
	
	var cache$1 = new Cache(1000);
	var filterTokenRE = /[^\s'"]+|'[^']*'|"[^"]*"/g;
	var reservedArgRE = /^in$|^-?\d+/;
	
	/**
	 * Parser state
	 */
	
	var str;
	var dir;
	var c;
	var prev;
	var i;
	var l;
	var lastFilterIndex;
	var inSingle;
	var inDouble;
	var curly;
	var square;
	var paren;
	/**
	 * Push a filter to the current directive object
	 */
	
	function pushFilter() {
	  var exp = str.slice(lastFilterIndex, i).trim();
	  var filter;
	  if (exp) {
	    filter = {};
	    var tokens = exp.match(filterTokenRE);
	    filter.name = tokens[0];
	    if (tokens.length > 1) {
	      filter.args = tokens.slice(1).map(processFilterArg);
	    }
	  }
	  if (filter) {
	    (dir.filters = dir.filters || []).push(filter);
	  }
	  lastFilterIndex = i + 1;
	}
	
	/**
	 * Check if an argument is dynamic and strip quotes.
	 *
	 * @param {String} arg
	 * @return {Object}
	 */
	
	function processFilterArg(arg) {
	  if (reservedArgRE.test(arg)) {
	    return {
	      value: toNumber(arg),
	      dynamic: false
	    };
	  } else {
	    var stripped = stripQuotes(arg);
	    var dynamic = stripped === arg;
	    return {
	      value: dynamic ? arg : stripped,
	      dynamic: dynamic
	    };
	  }
	}
	
	/**
	 * Parse a directive value and extract the expression
	 * and its filters into a descriptor.
	 *
	 * Example:
	 *
	 * "a + 1 | uppercase" will yield:
	 * {
	 *   expression: 'a + 1',
	 *   filters: [
	 *     { name: 'uppercase', args: null }
	 *   ]
	 * }
	 *
	 * @param {String} s
	 * @return {Object}
	 */
	
	function parseDirective(s) {
	  var hit = cache$1.get(s);
	  if (hit) {
	    return hit;
	  }
	
	  // reset parser state
	  str = s;
	  inSingle = inDouble = false;
	  curly = square = paren = 0;
	  lastFilterIndex = 0;
	  dir = {};
	
	  for (i = 0, l = str.length; i < l; i++) {
	    prev = c;
	    c = str.charCodeAt(i);
	    if (inSingle) {
	      // check single quote
	      if (c === 0x27 && prev !== 0x5C) inSingle = !inSingle;
	    } else if (inDouble) {
	      // check double quote
	      if (c === 0x22 && prev !== 0x5C) inDouble = !inDouble;
	    } else if (c === 0x7C && // pipe
	    str.charCodeAt(i + 1) !== 0x7C && str.charCodeAt(i - 1) !== 0x7C) {
	      if (dir.expression == null) {
	        // first filter, end of expression
	        lastFilterIndex = i + 1;
	        dir.expression = str.slice(0, i).trim();
	      } else {
	        // already has filter
	        pushFilter();
	      }
	    } else {
	      switch (c) {
	        case 0x22:
	          inDouble = true;break; // "
	        case 0x27:
	          inSingle = true;break; // '
	        case 0x28:
	          paren++;break; // (
	        case 0x29:
	          paren--;break; // )
	        case 0x5B:
	          square++;break; // [
	        case 0x5D:
	          square--;break; // ]
	        case 0x7B:
	          curly++;break; // {
	        case 0x7D:
	          curly--;break; // }
	      }
	    }
	  }
	
	  if (dir.expression == null) {
	    dir.expression = str.slice(0, i).trim();
	  } else if (lastFilterIndex !== 0) {
	    pushFilter();
	  }
	
	  cache$1.put(s, dir);
	  return dir;
	}
	
	var directive = Object.freeze({
	  parseDirective: parseDirective
	});
	
	var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
	var cache = undefined;
	var tagRE = undefined;
	var htmlRE = undefined;
	/**
	 * Escape a string so it can be used in a RegExp
	 * constructor.
	 *
	 * @param {String} str
	 */
	
	function escapeRegex(str) {
	  return str.replace(regexEscapeRE, '\\$&');
	}
	
	function compileRegex() {
	  var open = escapeRegex(config.delimiters[0]);
	  var close = escapeRegex(config.delimiters[1]);
	  var unsafeOpen = escapeRegex(config.unsafeDelimiters[0]);
	  var unsafeClose = escapeRegex(config.unsafeDelimiters[1]);
	  tagRE = new RegExp(unsafeOpen + '((?:.|\\n)+?)' + unsafeClose + '|' + open + '((?:.|\\n)+?)' + close, 'g');
	  htmlRE = new RegExp('^' + unsafeOpen + '((?:.|\\n)+?)' + unsafeClose + '$');
	  // reset cache
	  cache = new Cache(1000);
	}
	
	/**
	 * Parse a template text string into an array of tokens.
	 *
	 * @param {String} text
	 * @return {Array<Object> | null}
	 *               - {String} type
	 *               - {String} value
	 *               - {Boolean} [html]
	 *               - {Boolean} [oneTime]
	 */
	
	function parseText(text) {
	  if (!cache) {
	    compileRegex();
	  }
	  var hit = cache.get(text);
	  if (hit) {
	    return hit;
	  }
	  if (!tagRE.test(text)) {
	    return null;
	  }
	  var tokens = [];
	  var lastIndex = tagRE.lastIndex = 0;
	  var match, index, html, value, first, oneTime;
	  /* eslint-disable no-cond-assign */
	  while (match = tagRE.exec(text)) {
	    /* eslint-enable no-cond-assign */
	    index = match.index;
	    // push text token
	    if (index > lastIndex) {
	      tokens.push({
	        value: text.slice(lastIndex, index)
	      });
	    }
	    // tag token
	    html = htmlRE.test(match[0]);
	    value = html ? match[1] : match[2];
	    first = value.charCodeAt(0);
	    oneTime = first === 42; // *
	    value = oneTime ? value.slice(1) : value;
	    tokens.push({
	      tag: true,
	      value: value.trim(),
	      html: html,
	      oneTime: oneTime
	    });
	    lastIndex = index + match[0].length;
	  }
	  if (lastIndex < text.length) {
	    tokens.push({
	      value: text.slice(lastIndex)
	    });
	  }
	  cache.put(text, tokens);
	  return tokens;
	}
	
	/**
	 * Format a list of tokens into an expression.
	 * e.g. tokens parsed from 'a {{b}} c' can be serialized
	 * into one single expression as '"a " + b + " c"'.
	 *
	 * @param {Array} tokens
	 * @param {Vue} [vm]
	 * @return {String}
	 */
	
	function tokensToExp(tokens, vm) {
	  if (tokens.length > 1) {
	    return tokens.map(function (token) {
	      return formatToken(token, vm);
	    }).join('+');
	  } else {
	    return formatToken(tokens[0], vm, true);
	  }
	}
	
	/**
	 * Format a single token.
	 *
	 * @param {Object} token
	 * @param {Vue} [vm]
	 * @param {Boolean} [single]
	 * @return {String}
	 */
	
	function formatToken(token, vm, single) {
	  return token.tag ? token.oneTime && vm ? '"' + vm.$eval(token.value) + '"' : inlineFilters(token.value, single) : '"' + token.value + '"';
	}
	
	/**
	 * For an attribute with multiple interpolation tags,
	 * e.g. attr="some-{{thing | filter}}", in order to combine
	 * the whole thing into a single watchable expression, we
	 * have to inline those filters. This function does exactly
	 * that. This is a bit hacky but it avoids heavy changes
	 * to directive parser and watcher mechanism.
	 *
	 * @param {String} exp
	 * @param {Boolean} single
	 * @return {String}
	 */
	
	var filterRE = /[^|]\|[^|]/;
	function inlineFilters(exp, single) {
	  if (!filterRE.test(exp)) {
	    return single ? exp : '(' + exp + ')';
	  } else {
	    var dir = parseDirective(exp);
	    if (!dir.filters) {
	      return '(' + exp + ')';
	    } else {
	      return 'this._applyFilters(' + dir.expression + // value
	      ',null,' + // oldValue (null for read)
	      JSON.stringify(dir.filters) + // filter descriptors
	      ',false)'; // write?
	    }
	  }
	}
	
	var text = Object.freeze({
	  compileRegex: compileRegex,
	  parseText: parseText,
	  tokensToExp: tokensToExp
	});
	
	var delimiters = ['{{', '}}'];
	var unsafeDelimiters = ['{{{', '}}}'];
	
	var config = Object.defineProperties({
	
	  /**
	   * Whether to print debug messages.
	   * Also enables stack trace for warnings.
	   *
	   * @type {Boolean}
	   */
	
	  debug: false,
	
	  /**
	   * Whether to suppress warnings.
	   *
	   * @type {Boolean}
	   */
	
	  silent: false,
	
	  /**
	   * Whether to use async rendering.
	   */
	
	  async: true,
	
	  /**
	   * Whether to warn against errors caught when evaluating
	   * expressions.
	   */
	
	  warnExpressionErrors: true,
	
	  /**
	   * Whether to allow devtools inspection.
	   * Disabled by default in production builds.
	   */
	
	  devtools: process.env.NODE_ENV !== 'production',
	
	  /**
	   * Internal flag to indicate the delimiters have been
	   * changed.
	   *
	   * @type {Boolean}
	   */
	
	  _delimitersChanged: true,
	
	  /**
	   * List of asset types that a component can own.
	   *
	   * @type {Array}
	   */
	
	  _assetTypes: ['component', 'directive', 'elementDirective', 'filter', 'transition', 'partial'],
	
	  /**
	   * prop binding modes
	   */
	
	  _propBindingModes: {
	    ONE_WAY: 0,
	    TWO_WAY: 1,
	    ONE_TIME: 2
	  },
	
	  /**
	   * Max circular updates allowed in a batcher flush cycle.
	   */
	
	  _maxUpdateCount: 100
	
	}, {
	  delimiters: { /**
	                 * Interpolation delimiters. Changing these would trigger
	                 * the text parser to re-compile the regular expressions.
	                 *
	                 * @type {Array<String>}
	                 */
	
	    get: function get() {
	      return delimiters;
	    },
	    set: function set(val) {
	      delimiters = val;
	      compileRegex();
	    },
	    configurable: true,
	    enumerable: true
	  },
	  unsafeDelimiters: {
	    get: function get() {
	      return unsafeDelimiters;
	    },
	    set: function set(val) {
	      unsafeDelimiters = val;
	      compileRegex();
	    },
	    configurable: true,
	    enumerable: true
	  }
	});
	
	var warn = undefined;
	var formatComponentName = undefined;
	
	if (process.env.NODE_ENV !== 'production') {
	  (function () {
	    var hasConsole = typeof console !== 'undefined';
	
	    warn = function (msg, vm) {
	      if (hasConsole && !config.silent) {
	        console.error('[Vue warn]: ' + msg + (vm ? formatComponentName(vm) : ''));
	      }
	    };
	
	    formatComponentName = function (vm) {
	      var name = vm._isVue ? vm.$options.name : vm.name;
	      return name ? ' (found in component: <' + hyphenate(name) + '>)' : '';
	    };
	  })();
	}
	
	/**
	 * Append with transition.
	 *
	 * @param {Element} el
	 * @param {Element} target
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */
	
	function appendWithTransition(el, target, vm, cb) {
	  applyTransition(el, 1, function () {
	    target.appendChild(el);
	  }, vm, cb);
	}
	
	/**
	 * InsertBefore with transition.
	 *
	 * @param {Element} el
	 * @param {Element} target
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */
	
	function beforeWithTransition(el, target, vm, cb) {
	  applyTransition(el, 1, function () {
	    before(el, target);
	  }, vm, cb);
	}
	
	/**
	 * Remove with transition.
	 *
	 * @param {Element} el
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */
	
	function removeWithTransition(el, vm, cb) {
	  applyTransition(el, -1, function () {
	    remove(el);
	  }, vm, cb);
	}
	
	/**
	 * Apply transitions with an operation callback.
	 *
	 * @param {Element} el
	 * @param {Number} direction
	 *                  1: enter
	 *                 -1: leave
	 * @param {Function} op - the actual DOM operation
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */
	
	function applyTransition(el, direction, op, vm, cb) {
	  var transition = el.__v_trans;
	  if (!transition ||
	  // skip if there are no js hooks and CSS transition is
	  // not supported
	  !transition.hooks && !transitionEndEvent ||
	  // skip transitions for initial compile
	  !vm._isCompiled ||
	  // if the vm is being manipulated by a parent directive
	  // during the parent's compilation phase, skip the
	  // animation.
	  vm.$parent && !vm.$parent._isCompiled) {
	    op();
	    if (cb) cb();
	    return;
	  }
	  var action = direction > 0 ? 'enter' : 'leave';
	  transition[action](op, cb);
	}
	
	var transition = Object.freeze({
	  appendWithTransition: appendWithTransition,
	  beforeWithTransition: beforeWithTransition,
	  removeWithTransition: removeWithTransition,
	  applyTransition: applyTransition
	});
	
	/**
	 * Query an element selector if it's not an element already.
	 *
	 * @param {String|Element} el
	 * @return {Element}
	 */
	
	function query(el) {
	  if (typeof el === 'string') {
	    var selector = el;
	    el = document.querySelector(el);
	    if (!el) {
	      process.env.NODE_ENV !== 'production' && warn('Cannot find element: ' + selector);
	    }
	  }
	  return el;
	}
	
	/**
	 * Check if a node is in the document.
	 * Note: document.documentElement.contains should work here
	 * but always returns false for comment nodes in phantomjs,
	 * making unit tests difficult. This is fixed by doing the
	 * contains() check on the node's parentNode instead of
	 * the node itself.
	 *
	 * @param {Node} node
	 * @return {Boolean}
	 */
	
	function inDoc(node) {
	  if (!node) return false;
	  var doc = node.ownerDocument.documentElement;
	  var parent = node.parentNode;
	  return doc === node || doc === parent || !!(parent && parent.nodeType === 1 && doc.contains(parent));
	}
	
	/**
	 * Get and remove an attribute from a node.
	 *
	 * @param {Node} node
	 * @param {String} _attr
	 */
	
	function getAttr(node, _attr) {
	  var val = node.getAttribute(_attr);
	  if (val !== null) {
	    node.removeAttribute(_attr);
	  }
	  return val;
	}
	
	/**
	 * Get an attribute with colon or v-bind: prefix.
	 *
	 * @param {Node} node
	 * @param {String} name
	 * @return {String|null}
	 */
	
	function getBindAttr(node, name) {
	  var val = getAttr(node, ':' + name);
	  if (val === null) {
	    val = getAttr(node, 'v-bind:' + name);
	  }
	  return val;
	}
	
	/**
	 * Check the presence of a bind attribute.
	 *
	 * @param {Node} node
	 * @param {String} name
	 * @return {Boolean}
	 */
	
	function hasBindAttr(node, name) {
	  return node.hasAttribute(name) || node.hasAttribute(':' + name) || node.hasAttribute('v-bind:' + name);
	}
	
	/**
	 * Insert el before target
	 *
	 * @param {Element} el
	 * @param {Element} target
	 */
	
	function before(el, target) {
	  target.parentNode.insertBefore(el, target);
	}
	
	/**
	 * Insert el after target
	 *
	 * @param {Element} el
	 * @param {Element} target
	 */
	
	function after(el, target) {
	  if (target.nextSibling) {
	    before(el, target.nextSibling);
	  } else {
	    target.parentNode.appendChild(el);
	  }
	}
	
	/**
	 * Remove el from DOM
	 *
	 * @param {Element} el
	 */
	
	function remove(el) {
	  el.parentNode.removeChild(el);
	}
	
	/**
	 * Prepend el to target
	 *
	 * @param {Element} el
	 * @param {Element} target
	 */
	
	function prepend(el, target) {
	  if (target.firstChild) {
	    before(el, target.firstChild);
	  } else {
	    target.appendChild(el);
	  }
	}
	
	/**
	 * Replace target with el
	 *
	 * @param {Element} target
	 * @param {Element} el
	 */
	
	function replace(target, el) {
	  var parent = target.parentNode;
	  if (parent) {
	    parent.replaceChild(el, target);
	  }
	}
	
	/**
	 * Add event listener shorthand.
	 *
	 * @param {Element} el
	 * @param {String} event
	 * @param {Function} cb
	 * @param {Boolean} [useCapture]
	 */
	
	function on(el, event, cb, useCapture) {
	  el.addEventListener(event, cb, useCapture);
	}
	
	/**
	 * Remove event listener shorthand.
	 *
	 * @param {Element} el
	 * @param {String} event
	 * @param {Function} cb
	 */
	
	function off(el, event, cb) {
	  el.removeEventListener(event, cb);
	}
	
	/**
	 * For IE9 compat: when both class and :class are present
	 * getAttribute('class') returns wrong value...
	 *
	 * @param {Element} el
	 * @return {String}
	 */
	
	function getClass(el) {
	  var classname = el.className;
	  if (typeof classname === 'object') {
	    classname = classname.baseVal || '';
	  }
	  return classname;
	}
	
	/**
	 * In IE9, setAttribute('class') will result in empty class
	 * if the element also has the :class attribute; However in
	 * PhantomJS, setting `className` does not work on SVG elements...
	 * So we have to do a conditional check here.
	 *
	 * @param {Element} el
	 * @param {String} cls
	 */
	
	function setClass(el, cls) {
	  /* istanbul ignore if */
	  if (isIE9 && !/svg$/.test(el.namespaceURI)) {
	    el.className = cls;
	  } else {
	    el.setAttribute('class', cls);
	  }
	}
	
	/**
	 * Add class with compatibility for IE & SVG
	 *
	 * @param {Element} el
	 * @param {String} cls
	 */
	
	function addClass(el, cls) {
	  if (el.classList) {
	    el.classList.add(cls);
	  } else {
	    var cur = ' ' + getClass(el) + ' ';
	    if (cur.indexOf(' ' + cls + ' ') < 0) {
	      setClass(el, (cur + cls).trim());
	    }
	  }
	}
	
	/**
	 * Remove class with compatibility for IE & SVG
	 *
	 * @param {Element} el
	 * @param {String} cls
	 */
	
	function removeClass(el, cls) {
	  if (el.classList) {
	    el.classList.remove(cls);
	  } else {
	    var cur = ' ' + getClass(el) + ' ';
	    var tar = ' ' + cls + ' ';
	    while (cur.indexOf(tar) >= 0) {
	      cur = cur.replace(tar, ' ');
	    }
	    setClass(el, cur.trim());
	  }
	  if (!el.className) {
	    el.removeAttribute('class');
	  }
	}
	
	/**
	 * Extract raw content inside an element into a temporary
	 * container div
	 *
	 * @param {Element} el
	 * @param {Boolean} asFragment
	 * @return {Element|DocumentFragment}
	 */
	
	function extractContent(el, asFragment) {
	  var child;
	  var rawContent;
	  /* istanbul ignore if */
	  if (isTemplate(el) && isFragment(el.content)) {
	    el = el.content;
	  }
	  if (el.hasChildNodes()) {
	    trimNode(el);
	    rawContent = asFragment ? document.createDocumentFragment() : document.createElement('div');
	    /* eslint-disable no-cond-assign */
	    while (child = el.firstChild) {
	      /* eslint-enable no-cond-assign */
	      rawContent.appendChild(child);
	    }
	  }
	  return rawContent;
	}
	
	/**
	 * Trim possible empty head/tail text and comment
	 * nodes inside a parent.
	 *
	 * @param {Node} node
	 */
	
	function trimNode(node) {
	  var child;
	  /* eslint-disable no-sequences */
	  while ((child = node.firstChild, isTrimmable(child))) {
	    node.removeChild(child);
	  }
	  while ((child = node.lastChild, isTrimmable(child))) {
	    node.removeChild(child);
	  }
	  /* eslint-enable no-sequences */
	}
	
	function isTrimmable(node) {
	  return node && (node.nodeType === 3 && !node.data.trim() || node.nodeType === 8);
	}
	
	/**
	 * Check if an element is a template tag.
	 * Note if the template appears inside an SVG its tagName
	 * will be in lowercase.
	 *
	 * @param {Element} el
	 */
	
	function isTemplate(el) {
	  return el.tagName && el.tagName.toLowerCase() === 'template';
	}
	
	/**
	 * Create an "anchor" for performing dom insertion/removals.
	 * This is used in a number of scenarios:
	 * - fragment instance
	 * - v-html
	 * - v-if
	 * - v-for
	 * - component
	 *
	 * @param {String} content
	 * @param {Boolean} persist - IE trashes empty textNodes on
	 *                            cloneNode(true), so in certain
	 *                            cases the anchor needs to be
	 *                            non-empty to be persisted in
	 *                            templates.
	 * @return {Comment|Text}
	 */
	
	function createAnchor(content, persist) {
	  var anchor = config.debug ? document.createComment(content) : document.createTextNode(persist ? ' ' : '');
	  anchor.__v_anchor = true;
	  return anchor;
	}
	
	/**
	 * Find a component ref attribute that starts with $.
	 *
	 * @param {Element} node
	 * @return {String|undefined}
	 */
	
	var refRE = /^v-ref:/;
	
	function findRef(node) {
	  if (node.hasAttributes()) {
	    var attrs = node.attributes;
	    for (var i = 0, l = attrs.length; i < l; i++) {
	      var name = attrs[i].name;
	      if (refRE.test(name)) {
	        return camelize(name.replace(refRE, ''));
	      }
	    }
	  }
	}
	
	/**
	 * Map a function to a range of nodes .
	 *
	 * @param {Node} node
	 * @param {Node} end
	 * @param {Function} op
	 */
	
	function mapNodeRange(node, end, op) {
	  var next;
	  while (node !== end) {
	    next = node.nextSibling;
	    op(node);
	    node = next;
	  }
	  op(end);
	}
	
	/**
	 * Remove a range of nodes with transition, store
	 * the nodes in a fragment with correct ordering,
	 * and call callback when done.
	 *
	 * @param {Node} start
	 * @param {Node} end
	 * @param {Vue} vm
	 * @param {DocumentFragment} frag
	 * @param {Function} cb
	 */
	
	function removeNodeRange(start, end, vm, frag, cb) {
	  var done = false;
	  var removed = 0;
	  var nodes = [];
	  mapNodeRange(start, end, function (node) {
	    if (node === end) done = true;
	    nodes.push(node);
	    removeWithTransition(node, vm, onRemoved);
	  });
	  function onRemoved() {
	    removed++;
	    if (done && removed >= nodes.length) {
	      for (var i = 0; i < nodes.length; i++) {
	        frag.appendChild(nodes[i]);
	      }
	      cb && cb();
	    }
	  }
	}
	
	/**
	 * Check if a node is a DocumentFragment.
	 *
	 * @param {Node} node
	 * @return {Boolean}
	 */
	
	function isFragment(node) {
	  return node && node.nodeType === 11;
	}
	
	/**
	 * Get outerHTML of elements, taking care
	 * of SVG elements in IE as well.
	 *
	 * @param {Element} el
	 * @return {String}
	 */
	
	function getOuterHTML(el) {
	  if (el.outerHTML) {
	    return el.outerHTML;
	  } else {
	    var container = document.createElement('div');
	    container.appendChild(el.cloneNode(true));
	    return container.innerHTML;
	  }
	}
	
	var commonTagRE = /^(div|p|span|img|a|b|i|br|ul|ol|li|h1|h2|h3|h4|h5|h6|code|pre|table|th|td|tr|form|label|input|select|option|nav|article|section|header|footer)$/i;
	var reservedTagRE = /^(slot|partial|component)$/i;
	
	var isUnknownElement = undefined;
	if (process.env.NODE_ENV !== 'production') {
	  isUnknownElement = function (el, tag) {
	    if (tag.indexOf('-') > -1) {
	      // http://stackoverflow.com/a/28210364/1070244
	      return el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement;
	    } else {
	      return (/HTMLUnknownElement/.test(el.toString()) &&
	        // Chrome returns unknown for several HTML5 elements.
	        // https://code.google.com/p/chromium/issues/detail?id=540526
	        // Firefox returns unknown for some "Interactive elements."
	        !/^(data|time|rtc|rb|details|dialog|summary)$/.test(tag)
	      );
	    }
	  };
	}
	
	/**
	 * Check if an element is a component, if yes return its
	 * component id.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Object|undefined}
	 */
	
	function checkComponentAttr(el, options) {
	  var tag = el.tagName.toLowerCase();
	  var hasAttrs = el.hasAttributes();
	  if (!commonTagRE.test(tag) && !reservedTagRE.test(tag)) {
	    if (resolveAsset(options, 'components', tag)) {
	      return { id: tag };
	    } else {
	      var is = hasAttrs && getIsBinding(el, options);
	      if (is) {
	        return is;
	      } else if (process.env.NODE_ENV !== 'production') {
	        var expectedTag = options._componentNameMap && options._componentNameMap[tag];
	        if (expectedTag) {
	          warn('Unknown custom element: <' + tag + '> - ' + 'did you mean <' + expectedTag + '>? ' + 'HTML is case-insensitive, remember to use kebab-case in templates.');
	        } else if (isUnknownElement(el, tag)) {
	          warn('Unknown custom element: <' + tag + '> - did you ' + 'register the component correctly? For recursive components, ' + 'make sure to provide the "name" option.');
	        }
	      }
	    }
	  } else if (hasAttrs) {
	    return getIsBinding(el, options);
	  }
	}
	
	/**
	 * Get "is" binding from an element.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Object|undefined}
	 */
	
	function getIsBinding(el, options) {
	  // dynamic syntax
	  var exp = el.getAttribute('is');
	  if (exp != null) {
	    if (resolveAsset(options, 'components', exp)) {
	      el.removeAttribute('is');
	      return { id: exp };
	    }
	  } else {
	    exp = getBindAttr(el, 'is');
	    if (exp != null) {
	      return { id: exp, dynamic: true };
	    }
	  }
	}
	
	/**
	 * Option overwriting strategies are functions that handle
	 * how to merge a parent option value and a child option
	 * value into the final value.
	 *
	 * All strategy functions follow the same signature:
	 *
	 * @param {*} parentVal
	 * @param {*} childVal
	 * @param {Vue} [vm]
	 */
	
	var strats = config.optionMergeStrategies = Object.create(null);
	
	/**
	 * Helper that recursively merges two data objects together.
	 */
	
	function mergeData(to, from) {
	  var key, toVal, fromVal;
	  for (key in from) {
	    toVal = to[key];
	    fromVal = from[key];
	    if (!hasOwn(to, key)) {
	      set(to, key, fromVal);
	    } else if (isObject(toVal) && isObject(fromVal)) {
	      mergeData(toVal, fromVal);
	    }
	  }
	  return to;
	}
	
	/**
	 * Data
	 */
	
	strats.data = function (parentVal, childVal, vm) {
	  if (!vm) {
	    // in a Vue.extend merge, both should be functions
	    if (!childVal) {
	      return parentVal;
	    }
	    if (typeof childVal !== 'function') {
	      process.env.NODE_ENV !== 'production' && warn('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
	      return parentVal;
	    }
	    if (!parentVal) {
	      return childVal;
	    }
	    // when parentVal & childVal are both present,
	    // we need to return a function that returns the
	    // merged result of both functions... no need to
	    // check if parentVal is a function here because
	    // it has to be a function to pass previous merges.
	    return function mergedDataFn() {
	      return mergeData(childVal.call(this), parentVal.call(this));
	    };
	  } else if (parentVal || childVal) {
	    return function mergedInstanceDataFn() {
	      // instance merge
	      var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
	      var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
	      if (instanceData) {
	        return mergeData(instanceData, defaultData);
	      } else {
	        return defaultData;
	      }
	    };
	  }
	};
	
	/**
	 * El
	 */
	
	strats.el = function (parentVal, childVal, vm) {
	  if (!vm && childVal && typeof childVal !== 'function') {
	    process.env.NODE_ENV !== 'production' && warn('The "el" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
	    return;
	  }
	  var ret = childVal || parentVal;
	  // invoke the element factory if this is instance merge
	  return vm && typeof ret === 'function' ? ret.call(vm) : ret;
	};
	
	/**
	 * Hooks and param attributes are merged as arrays.
	 */
	
	strats.init = strats.created = strats.ready = strats.attached = strats.detached = strats.beforeCompile = strats.compiled = strats.beforeDestroy = strats.destroyed = strats.activate = function (parentVal, childVal) {
	  return childVal ? parentVal ? parentVal.concat(childVal) : isArray(childVal) ? childVal : [childVal] : parentVal;
	};
	
	/**
	 * Assets
	 *
	 * When a vm is present (instance creation), we need to do
	 * a three-way merge between constructor options, instance
	 * options and parent options.
	 */
	
	function mergeAssets(parentVal, childVal) {
	  var res = Object.create(parentVal || null);
	  return childVal ? extend(res, guardArrayAssets(childVal)) : res;
	}
	
	config._assetTypes.forEach(function (type) {
	  strats[type + 's'] = mergeAssets;
	});
	
	/**
	 * Events & Watchers.
	 *
	 * Events & watchers hashes should not overwrite one
	 * another, so we merge them as arrays.
	 */
	
	strats.watch = strats.events = function (parentVal, childVal) {
	  if (!childVal) return parentVal;
	  if (!parentVal) return childVal;
	  var ret = {};
	  extend(ret, parentVal);
	  for (var key in childVal) {
	    var parent = ret[key];
	    var child = childVal[key];
	    if (parent && !isArray(parent)) {
	      parent = [parent];
	    }
	    ret[key] = parent ? parent.concat(child) : [child];
	  }
	  return ret;
	};
	
	/**
	 * Other object hashes.
	 */
	
	strats.props = strats.methods = strats.computed = function (parentVal, childVal) {
	  if (!childVal) return parentVal;
	  if (!parentVal) return childVal;
	  var ret = Object.create(null);
	  extend(ret, parentVal);
	  extend(ret, childVal);
	  return ret;
	};
	
	/**
	 * Default strategy.
	 */
	
	var defaultStrat = function defaultStrat(parentVal, childVal) {
	  return childVal === undefined ? parentVal : childVal;
	};
	
	/**
	 * Make sure component options get converted to actual
	 * constructors.
	 *
	 * @param {Object} options
	 */
	
	function guardComponents(options) {
	  if (options.components) {
	    var components = options.components = guardArrayAssets(options.components);
	    var ids = Object.keys(components);
	    var def;
	    if (process.env.NODE_ENV !== 'production') {
	      var map = options._componentNameMap = {};
	    }
	    for (var i = 0, l = ids.length; i < l; i++) {
	      var key = ids[i];
	      if (commonTagRE.test(key) || reservedTagRE.test(key)) {
	        process.env.NODE_ENV !== 'production' && warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + key);
	        continue;
	      }
	      // record a all lowercase <-> kebab-case mapping for
	      // possible custom element case error warning
	      if (process.env.NODE_ENV !== 'production') {
	        map[key.replace(/-/g, '').toLowerCase()] = hyphenate(key);
	      }
	      def = components[key];
	      if (isPlainObject(def)) {
	        components[key] = Vue.extend(def);
	      }
	    }
	  }
	}
	
	/**
	 * Ensure all props option syntax are normalized into the
	 * Object-based format.
	 *
	 * @param {Object} options
	 */
	
	function guardProps(options) {
	  var props = options.props;
	  var i, val;
	  if (isArray(props)) {
	    options.props = {};
	    i = props.length;
	    while (i--) {
	      val = props[i];
	      if (typeof val === 'string') {
	        options.props[val] = null;
	      } else if (val.name) {
	        options.props[val.name] = val;
	      }
	    }
	  } else if (isPlainObject(props)) {
	    var keys = Object.keys(props);
	    i = keys.length;
	    while (i--) {
	      val = props[keys[i]];
	      if (typeof val === 'function') {
	        props[keys[i]] = { type: val };
	      }
	    }
	  }
	}
	
	/**
	 * Guard an Array-format assets option and converted it
	 * into the key-value Object format.
	 *
	 * @param {Object|Array} assets
	 * @return {Object}
	 */
	
	function guardArrayAssets(assets) {
	  if (isArray(assets)) {
	    var res = {};
	    var i = assets.length;
	    var asset;
	    while (i--) {
	      asset = assets[i];
	      var id = typeof asset === 'function' ? asset.options && asset.options.name || asset.id : asset.name || asset.id;
	      if (!id) {
	        process.env.NODE_ENV !== 'production' && warn('Array-syntax assets must provide a "name" or "id" field.');
	      } else {
	        res[id] = asset;
	      }
	    }
	    return res;
	  }
	  return assets;
	}
	
	/**
	 * Merge two option objects into a new one.
	 * Core utility used in both instantiation and inheritance.
	 *
	 * @param {Object} parent
	 * @param {Object} child
	 * @param {Vue} [vm] - if vm is present, indicates this is
	 *                     an instantiation merge.
	 */
	
	function mergeOptions(parent, child, vm) {
	  guardComponents(child);
	  guardProps(child);
	  if (process.env.NODE_ENV !== 'production') {
	    if (child.propsData && !vm) {
	      warn('propsData can only be used as an instantiation option.');
	    }
	  }
	  var options = {};
	  var key;
	  if (child['extends']) {
	    parent = typeof child['extends'] === 'function' ? mergeOptions(parent, child['extends'].options, vm) : mergeOptions(parent, child['extends'], vm);
	  }
	  if (child.mixins) {
	    for (var i = 0, l = child.mixins.length; i < l; i++) {
	      var mixin = child.mixins[i];
	      var mixinOptions = mixin.prototype instanceof Vue ? mixin.options : mixin;
	      parent = mergeOptions(parent, mixinOptions, vm);
	    }
	  }
	  for (key in parent) {
	    mergeField(key);
	  }
	  for (key in child) {
	    if (!hasOwn(parent, key)) {
	      mergeField(key);
	    }
	  }
	  function mergeField(key) {
	    var strat = strats[key] || defaultStrat;
	    options[key] = strat(parent[key], child[key], vm, key);
	  }
	  return options;
	}
	
	/**
	 * Resolve an asset.
	 * This function is used because child instances need access
	 * to assets defined in its ancestor chain.
	 *
	 * @param {Object} options
	 * @param {String} type
	 * @param {String} id
	 * @param {Boolean} warnMissing
	 * @return {Object|Function}
	 */
	
	function resolveAsset(options, type, id, warnMissing) {
	  /* istanbul ignore if */
	  if (typeof id !== 'string') {
	    return;
	  }
	  var assets = options[type];
	  var camelizedId;
	  var res = assets[id] ||
	  // camelCase ID
	  assets[camelizedId = camelize(id)] ||
	  // Pascal Case ID
	  assets[camelizedId.charAt(0).toUpperCase() + camelizedId.slice(1)];
	  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
	    warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options);
	  }
	  return res;
	}
	
	var uid$1 = 0;
	
	/**
	 * A dep is an observable that can have multiple
	 * directives subscribing to it.
	 *
	 * @constructor
	 */
	function Dep() {
	  this.id = uid$1++;
	  this.subs = [];
	}
	
	// the current target watcher being evaluated.
	// this is globally unique because there could be only one
	// watcher being evaluated at any time.
	Dep.target = null;
	
	/**
	 * Add a directive subscriber.
	 *
	 * @param {Directive} sub
	 */
	
	Dep.prototype.addSub = function (sub) {
	  this.subs.push(sub);
	};
	
	/**
	 * Remove a directive subscriber.
	 *
	 * @param {Directive} sub
	 */
	
	Dep.prototype.removeSub = function (sub) {
	  this.subs.$remove(sub);
	};
	
	/**
	 * Add self as a dependency to the target watcher.
	 */
	
	Dep.prototype.depend = function () {
	  Dep.target.addDep(this);
	};
	
	/**
	 * Notify all subscribers of a new value.
	 */
	
	Dep.prototype.notify = function () {
	  // stablize the subscriber list first
	  var subs = toArray(this.subs);
	  for (var i = 0, l = subs.length; i < l; i++) {
	    subs[i].update();
	  }
	};
	
	var arrayProto = Array.prototype;
	var arrayMethods = Object.create(arrayProto)
	
	/**
	 * Intercept mutating methods and emit events
	 */
	
	;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
	  // cache original method
	  var original = arrayProto[method];
	  def(arrayMethods, method, function mutator() {
	    // avoid leaking arguments:
	    // http://jsperf.com/closure-with-arguments
	    var i = arguments.length;
	    var args = new Array(i);
	    while (i--) {
	      args[i] = arguments[i];
	    }
	    var result = original.apply(this, args);
	    var ob = this.__ob__;
	    var inserted;
	    switch (method) {
	      case 'push':
	        inserted = args;
	        break;
	      case 'unshift':
	        inserted = args;
	        break;
	      case 'splice':
	        inserted = args.slice(2);
	        break;
	    }
	    if (inserted) ob.observeArray(inserted);
	    // notify change
	    ob.dep.notify();
	    return result;
	  });
	});
	
	/**
	 * Swap the element at the given index with a new value
	 * and emits corresponding event.
	 *
	 * @param {Number} index
	 * @param {*} val
	 * @return {*} - replaced element
	 */
	
	def(arrayProto, '$set', function $set(index, val) {
	  if (index >= this.length) {
	    this.length = Number(index) + 1;
	  }
	  return this.splice(index, 1, val)[0];
	});
	
	/**
	 * Convenience method to remove the element at given index or target element reference.
	 *
	 * @param {*} item
	 */
	
	def(arrayProto, '$remove', function $remove(item) {
	  /* istanbul ignore if */
	  if (!this.length) return;
	  var index = indexOf(this, item);
	  if (index > -1) {
	    return this.splice(index, 1);
	  }
	});
	
	var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
	
	/**
	 * By default, when a reactive property is set, the new value is
	 * also converted to become reactive. However in certain cases, e.g.
	 * v-for scope alias and props, we don't want to force conversion
	 * because the value may be a nested value under a frozen data structure.
	 *
	 * So whenever we want to set a reactive property without forcing
	 * conversion on the new value, we wrap that call inside this function.
	 */
	
	var shouldConvert = true;
	
	function withoutConversion(fn) {
	  shouldConvert = false;
	  fn();
	  shouldConvert = true;
	}
	
	/**
	 * Observer class that are attached to each observed
	 * object. Once attached, the observer converts target
	 * object's property keys into getter/setters that
	 * collect dependencies and dispatches updates.
	 *
	 * @param {Array|Object} value
	 * @constructor
	 */
	
	function Observer(value) {
	  this.value = value;
	  this.dep = new Dep();
	  def(value, '__ob__', this);
	  if (isArray(value)) {
	    var augment = hasProto ? protoAugment : copyAugment;
	    augment(value, arrayMethods, arrayKeys);
	    this.observeArray(value);
	  } else {
	    this.walk(value);
	  }
	}
	
	// Instance methods
	
	/**
	 * Walk through each property and convert them into
	 * getter/setters. This method should only be called when
	 * value type is Object.
	 *
	 * @param {Object} obj
	 */
	
	Observer.prototype.walk = function (obj) {
	  var keys = Object.keys(obj);
	  for (var i = 0, l = keys.length; i < l; i++) {
	    this.convert(keys[i], obj[keys[i]]);
	  }
	};
	
	/**
	 * Observe a list of Array items.
	 *
	 * @param {Array} items
	 */
	
	Observer.prototype.observeArray = function (items) {
	  for (var i = 0, l = items.length; i < l; i++) {
	    observe(items[i]);
	  }
	};
	
	/**
	 * Convert a property into getter/setter so we can emit
	 * the events when the property is accessed/changed.
	 *
	 * @param {String} key
	 * @param {*} val
	 */
	
	Observer.prototype.convert = function (key, val) {
	  defineReactive(this.value, key, val);
	};
	
	/**
	 * Add an owner vm, so that when $set/$delete mutations
	 * happen we can notify owner vms to proxy the keys and
	 * digest the watchers. This is only called when the object
	 * is observed as an instance's root $data.
	 *
	 * @param {Vue} vm
	 */
	
	Observer.prototype.addVm = function (vm) {
	  (this.vms || (this.vms = [])).push(vm);
	};
	
	/**
	 * Remove an owner vm. This is called when the object is
	 * swapped out as an instance's $data object.
	 *
	 * @param {Vue} vm
	 */
	
	Observer.prototype.removeVm = function (vm) {
	  this.vms.$remove(vm);
	};
	
	// helpers
	
	/**
	 * Augment an target Object or Array by intercepting
	 * the prototype chain using __proto__
	 *
	 * @param {Object|Array} target
	 * @param {Object} src
	 */
	
	function protoAugment(target, src) {
	  /* eslint-disable no-proto */
	  target.__proto__ = src;
	  /* eslint-enable no-proto */
	}
	
	/**
	 * Augment an target Object or Array by defining
	 * hidden properties.
	 *
	 * @param {Object|Array} target
	 * @param {Object} proto
	 */
	
	function copyAugment(target, src, keys) {
	  for (var i = 0, l = keys.length; i < l; i++) {
	    var key = keys[i];
	    def(target, key, src[key]);
	  }
	}
	
	/**
	 * Attempt to create an observer instance for a value,
	 * returns the new observer if successfully observed,
	 * or the existing observer if the value already has one.
	 *
	 * @param {*} value
	 * @param {Vue} [vm]
	 * @return {Observer|undefined}
	 * @static
	 */
	
	function observe(value, vm) {
	  if (!value || typeof value !== 'object') {
	    return;
	  }
	  var ob;
	  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
	    ob = value.__ob__;
	  } else if (shouldConvert && (isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
	    ob = new Observer(value);
	  }
	  if (ob && vm) {
	    ob.addVm(vm);
	  }
	  return ob;
	}
	
	/**
	 * Define a reactive property on an Object.
	 *
	 * @param {Object} obj
	 * @param {String} key
	 * @param {*} val
	 */
	
	function defineReactive(obj, key, val) {
	  var dep = new Dep();
	
	  var property = Object.getOwnPropertyDescriptor(obj, key);
	  if (property && property.configurable === false) {
	    return;
	  }
	
	  // cater for pre-defined getter/setters
	  var getter = property && property.get;
	  var setter = property && property.set;
	
	  var childOb = observe(val);
	  Object.defineProperty(obj, key, {
	    enumerable: true,
	    configurable: true,
	    get: function reactiveGetter() {
	      var value = getter ? getter.call(obj) : val;
	      if (Dep.target) {
	        dep.depend();
	        if (childOb) {
	          childOb.dep.depend();
	        }
	        if (isArray(value)) {
	          for (var e, i = 0, l = value.length; i < l; i++) {
	            e = value[i];
	            e && e.__ob__ && e.__ob__.dep.depend();
	          }
	        }
	      }
	      return value;
	    },
	    set: function reactiveSetter(newVal) {
	      var value = getter ? getter.call(obj) : val;
	      if (newVal === value) {
	        return;
	      }
	      if (setter) {
	        setter.call(obj, newVal);
	      } else {
	        val = newVal;
	      }
	      childOb = observe(newVal);
	      dep.notify();
	    }
	  });
	}
	
	
	
	var util = Object.freeze({
		defineReactive: defineReactive,
		set: set,
		del: del,
		hasOwn: hasOwn,
		isLiteral: isLiteral,
		isReserved: isReserved,
		_toString: _toString,
		toNumber: toNumber,
		toBoolean: toBoolean,
		stripQuotes: stripQuotes,
		camelize: camelize,
		hyphenate: hyphenate,
		classify: classify,
		bind: bind,
		toArray: toArray,
		extend: extend,
		isObject: isObject,
		isPlainObject: isPlainObject,
		def: def,
		debounce: _debounce,
		indexOf: indexOf,
		cancellable: cancellable,
		looseEqual: looseEqual,
		isArray: isArray,
		hasProto: hasProto,
		inBrowser: inBrowser,
		devtools: devtools,
		isIE: isIE,
		isIE9: isIE9,
		isAndroid: isAndroid,
		isIos: isIos,
		iosVersionMatch: iosVersionMatch,
		iosVersion: iosVersion,
		hasMutationObserverBug: hasMutationObserverBug,
		get transitionProp () { return transitionProp; },
		get transitionEndEvent () { return transitionEndEvent; },
		get animationProp () { return animationProp; },
		get animationEndEvent () { return animationEndEvent; },
		nextTick: nextTick,
		get _Set () { return _Set; },
		query: query,
		inDoc: inDoc,
		getAttr: getAttr,
		getBindAttr: getBindAttr,
		hasBindAttr: hasBindAttr,
		before: before,
		after: after,
		remove: remove,
		prepend: prepend,
		replace: replace,
		on: on,
		off: off,
		setClass: setClass,
		addClass: addClass,
		removeClass: removeClass,
		extractContent: extractContent,
		trimNode: trimNode,
		isTemplate: isTemplate,
		createAnchor: createAnchor,
		findRef: findRef,
		mapNodeRange: mapNodeRange,
		removeNodeRange: removeNodeRange,
		isFragment: isFragment,
		getOuterHTML: getOuterHTML,
		mergeOptions: mergeOptions,
		resolveAsset: resolveAsset,
		checkComponentAttr: checkComponentAttr,
		commonTagRE: commonTagRE,
		reservedTagRE: reservedTagRE,
		get warn () { return warn; }
	});
	
	var uid = 0;
	
	function initMixin (Vue) {
	  /**
	   * The main init sequence. This is called for every
	   * instance, including ones that are created from extended
	   * constructors.
	   *
	   * @param {Object} options - this options object should be
	   *                           the result of merging class
	   *                           options and the options passed
	   *                           in to the constructor.
	   */
	
	  Vue.prototype._init = function (options) {
	    options = options || {};
	
	    this.$el = null;
	    this.$parent = options.parent;
	    this.$root = this.$parent ? this.$parent.$root : this;
	    this.$children = [];
	    this.$refs = {}; // child vm references
	    this.$els = {}; // element references
	    this._watchers = []; // all watchers as an array
	    this._directives = []; // all directives
	
	    // a uid
	    this._uid = uid++;
	
	    // a flag to avoid this being observed
	    this._isVue = true;
	
	    // events bookkeeping
	    this._events = {}; // registered callbacks
	    this._eventsCount = {}; // for $broadcast optimization
	
	    // fragment instance properties
	    this._isFragment = false;
	    this._fragment = // @type {DocumentFragment}
	    this._fragmentStart = // @type {Text|Comment}
	    this._fragmentEnd = null; // @type {Text|Comment}
	
	    // lifecycle state
	    this._isCompiled = this._isDestroyed = this._isReady = this._isAttached = this._isBeingDestroyed = this._vForRemoving = false;
	    this._unlinkFn = null;
	
	    // context:
	    // if this is a transcluded component, context
	    // will be the common parent vm of this instance
	    // and its host.
	    this._context = options._context || this.$parent;
	
	    // scope:
	    // if this is inside an inline v-for, the scope
	    // will be the intermediate scope created for this
	    // repeat fragment. this is used for linking props
	    // and container directives.
	    this._scope = options._scope;
	
	    // fragment:
	    // if this instance is compiled inside a Fragment, it
	    // needs to reigster itself as a child of that fragment
	    // for attach/detach to work properly.
	    this._frag = options._frag;
	    if (this._frag) {
	      this._frag.children.push(this);
	    }
	
	    // push self into parent / transclusion host
	    if (this.$parent) {
	      this.$parent.$children.push(this);
	    }
	
	    // merge options.
	    options = this.$options = mergeOptions(this.constructor.options, options, this);
	
	    // set ref
	    this._updateRef();
	
	    // initialize data as empty object.
	    // it will be filled up in _initData().
	    this._data = {};
	
	    // call init hook
	    this._callHook('init');
	
	    // initialize data observation and scope inheritance.
	    this._initState();
	
	    // setup event system and option events.
	    this._initEvents();
	
	    // call created hook
	    this._callHook('created');
	
	    // if `el` option is passed, start compilation.
	    if (options.el) {
	      this.$mount(options.el);
	    }
	  };
	}
	
	var pathCache = new Cache(1000);
	
	// actions
	var APPEND = 0;
	var PUSH = 1;
	var INC_SUB_PATH_DEPTH = 2;
	var PUSH_SUB_PATH = 3;
	
	// states
	var BEFORE_PATH = 0;
	var IN_PATH = 1;
	var BEFORE_IDENT = 2;
	var IN_IDENT = 3;
	var IN_SUB_PATH = 4;
	var IN_SINGLE_QUOTE = 5;
	var IN_DOUBLE_QUOTE = 6;
	var AFTER_PATH = 7;
	var ERROR = 8;
	
	var pathStateMachine = [];
	
	pathStateMachine[BEFORE_PATH] = {
	  'ws': [BEFORE_PATH],
	  'ident': [IN_IDENT, APPEND],
	  '[': [IN_SUB_PATH],
	  'eof': [AFTER_PATH]
	};
	
	pathStateMachine[IN_PATH] = {
	  'ws': [IN_PATH],
	  '.': [BEFORE_IDENT],
	  '[': [IN_SUB_PATH],
	  'eof': [AFTER_PATH]
	};
	
	pathStateMachine[BEFORE_IDENT] = {
	  'ws': [BEFORE_IDENT],
	  'ident': [IN_IDENT, APPEND]
	};
	
	pathStateMachine[IN_IDENT] = {
	  'ident': [IN_IDENT, APPEND],
	  '0': [IN_IDENT, APPEND],
	  'number': [IN_IDENT, APPEND],
	  'ws': [IN_PATH, PUSH],
	  '.': [BEFORE_IDENT, PUSH],
	  '[': [IN_SUB_PATH, PUSH],
	  'eof': [AFTER_PATH, PUSH]
	};
	
	pathStateMachine[IN_SUB_PATH] = {
	  "'": [IN_SINGLE_QUOTE, APPEND],
	  '"': [IN_DOUBLE_QUOTE, APPEND],
	  '[': [IN_SUB_PATH, INC_SUB_PATH_DEPTH],
	  ']': [IN_PATH, PUSH_SUB_PATH],
	  'eof': ERROR,
	  'else': [IN_SUB_PATH, APPEND]
	};
	
	pathStateMachine[IN_SINGLE_QUOTE] = {
	  "'": [IN_SUB_PATH, APPEND],
	  'eof': ERROR,
	  'else': [IN_SINGLE_QUOTE, APPEND]
	};
	
	pathStateMachine[IN_DOUBLE_QUOTE] = {
	  '"': [IN_SUB_PATH, APPEND],
	  'eof': ERROR,
	  'else': [IN_DOUBLE_QUOTE, APPEND]
	};
	
	/**
	 * Determine the type of a character in a keypath.
	 *
	 * @param {Char} ch
	 * @return {String} type
	 */
	
	function getPathCharType(ch) {
	  if (ch === undefined) {
	    return 'eof';
	  }
	
	  var code = ch.charCodeAt(0);
	
	  switch (code) {
	    case 0x5B: // [
	    case 0x5D: // ]
	    case 0x2E: // .
	    case 0x22: // "
	    case 0x27: // '
	    case 0x30:
	      // 0
	      return ch;
	
	    case 0x5F: // _
	    case 0x24:
	      // $
	      return 'ident';
	
	    case 0x20: // Space
	    case 0x09: // Tab
	    case 0x0A: // Newline
	    case 0x0D: // Return
	    case 0xA0: // No-break space
	    case 0xFEFF: // Byte Order Mark
	    case 0x2028: // Line Separator
	    case 0x2029:
	      // Paragraph Separator
	      return 'ws';
	  }
	
	  // a-z, A-Z
	  if (code >= 0x61 && code <= 0x7A || code >= 0x41 && code <= 0x5A) {
	    return 'ident';
	  }
	
	  // 1-9
	  if (code >= 0x31 && code <= 0x39) {
	    return 'number';
	  }
	
	  return 'else';
	}
	
	/**
	 * Format a subPath, return its plain form if it is
	 * a literal string or number. Otherwise prepend the
	 * dynamic indicator (*).
	 *
	 * @param {String} path
	 * @return {String}
	 */
	
	function formatSubPath(path) {
	  var trimmed = path.trim();
	  // invalid leading 0
	  if (path.charAt(0) === '0' && isNaN(path)) {
	    return false;
	  }
	  return isLiteral(trimmed) ? stripQuotes(trimmed) : '*' + trimmed;
	}
	
	/**
	 * Parse a string path into an array of segments
	 *
	 * @param {String} path
	 * @return {Array|undefined}
	 */
	
	function parse(path) {
	  var keys = [];
	  var index = -1;
	  var mode = BEFORE_PATH;
	  var subPathDepth = 0;
	  var c, newChar, key, type, transition, action, typeMap;
	
	  var actions = [];
	
	  actions[PUSH] = function () {
	    if (key !== undefined) {
	      keys.push(key);
	      key = undefined;
	    }
	  };
	
	  actions[APPEND] = function () {
	    if (key === undefined) {
	      key = newChar;
	    } else {
	      key += newChar;
	    }
	  };
	
	  actions[INC_SUB_PATH_DEPTH] = function () {
	    actions[APPEND]();
	    subPathDepth++;
	  };
	
	  actions[PUSH_SUB_PATH] = function () {
	    if (subPathDepth > 0) {
	      subPathDepth--;
	      mode = IN_SUB_PATH;
	      actions[APPEND]();
	    } else {
	      subPathDepth = 0;
	      key = formatSubPath(key);
	      if (key === false) {
	        return false;
	      } else {
	        actions[PUSH]();
	      }
	    }
	  };
	
	  function maybeUnescapeQuote() {
	    var nextChar = path[index + 1];
	    if (mode === IN_SINGLE_QUOTE && nextChar === "'" || mode === IN_DOUBLE_QUOTE && nextChar === '"') {
	      index++;
	      newChar = '\\' + nextChar;
	      actions[APPEND]();
	      return true;
	    }
	  }
	
	  while (mode != null) {
	    index++;
	    c = path[index];
	
	    if (c === '\\' && maybeUnescapeQuote()) {
	      continue;
	    }
	
	    type = getPathCharType(c);
	    typeMap = pathStateMachine[mode];
	    transition = typeMap[type] || typeMap['else'] || ERROR;
	
	    if (transition === ERROR) {
	      return; // parse error
	    }
	
	    mode = transition[0];
	    action = actions[transition[1]];
	    if (action) {
	      newChar = transition[2];
	      newChar = newChar === undefined ? c : newChar;
	      if (action() === false) {
	        return;
	      }
	    }
	
	    if (mode === AFTER_PATH) {
	      keys.raw = path;
	      return keys;
	    }
	  }
	}
	
	/**
	 * External parse that check for a cache hit first
	 *
	 * @param {String} path
	 * @return {Array|undefined}
	 */
	
	function parsePath(path) {
	  var hit = pathCache.get(path);
	  if (!hit) {
	    hit = parse(path);
	    if (hit) {
	      pathCache.put(path, hit);
	    }
	  }
	  return hit;
	}
	
	/**
	 * Get from an object from a path string
	 *
	 * @param {Object} obj
	 * @param {String} path
	 */
	
	function getPath(obj, path) {
	  return parseExpression(path).get(obj);
	}
	
	/**
	 * Warn against setting non-existent root path on a vm.
	 */
	
	var warnNonExistent;
	if (process.env.NODE_ENV !== 'production') {
	  warnNonExistent = function (path, vm) {
	    warn('You are setting a non-existent path "' + path.raw + '" ' + 'on a vm instance. Consider pre-initializing the property ' + 'with the "data" option for more reliable reactivity ' + 'and better performance.', vm);
	  };
	}
	
	/**
	 * Set on an object from a path
	 *
	 * @param {Object} obj
	 * @param {String | Array} path
	 * @param {*} val
	 */
	
	function setPath(obj, path, val) {
	  var original = obj;
	  if (typeof path === 'string') {
	    path = parse(path);
	  }
	  if (!path || !isObject(obj)) {
	    return false;
	  }
	  var last, key;
	  for (var i = 0, l = path.length; i < l; i++) {
	    last = obj;
	    key = path[i];
	    if (key.charAt(0) === '*') {
	      key = parseExpression(key.slice(1)).get.call(original, original);
	    }
	    if (i < l - 1) {
	      obj = obj[key];
	      if (!isObject(obj)) {
	        obj = {};
	        if (process.env.NODE_ENV !== 'production' && last._isVue) {
	          warnNonExistent(path, last);
	        }
	        set(last, key, obj);
	      }
	    } else {
	      if (isArray(obj)) {
	        obj.$set(key, val);
	      } else if (key in obj) {
	        obj[key] = val;
	      } else {
	        if (process.env.NODE_ENV !== 'production' && obj._isVue) {
	          warnNonExistent(path, obj);
	        }
	        set(obj, key, val);
	      }
	    }
	  }
	  return true;
	}
	
	var path = Object.freeze({
	  parsePath: parsePath,
	  getPath: getPath,
	  setPath: setPath
	});
	
	var expressionCache = new Cache(1000);
	
	var allowedKeywords = 'Math,Date,this,true,false,null,undefined,Infinity,NaN,' + 'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' + 'encodeURIComponent,parseInt,parseFloat';
	var allowedKeywordsRE = new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)');
	
	// keywords that don't make sense inside expressions
	var improperKeywords = 'break,case,class,catch,const,continue,debugger,default,' + 'delete,do,else,export,extends,finally,for,function,if,' + 'import,in,instanceof,let,return,super,switch,throw,try,' + 'var,while,with,yield,enum,await,implements,package,' + 'protected,static,interface,private,public';
	var improperKeywordsRE = new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)');
	
	var wsRE = /\s/g;
	var newlineRE = /\n/g;
	var saveRE = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g;
	var restoreRE = /"(\d+)"/g;
	var pathTestRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
	var identRE = /[^\w$\.](?:[A-Za-z_$][\w$]*)/g;
	var literalValueRE$1 = /^(?:true|false|null|undefined|Infinity|NaN)$/;
	
	function noop() {}
	
	/**
	 * Save / Rewrite / Restore
	 *
	 * When rewriting paths found in an expression, it is
	 * possible for the same letter sequences to be found in
	 * strings and Object literal property keys. Therefore we
	 * remove and store these parts in a temporary array, and
	 * restore them after the path rewrite.
	 */
	
	var saved = [];
	
	/**
	 * Save replacer
	 *
	 * The save regex can match two possible cases:
	 * 1. An opening object literal
	 * 2. A string
	 * If matched as a plain string, we need to escape its
	 * newlines, since the string needs to be preserved when
	 * generating the function body.
	 *
	 * @param {String} str
	 * @param {String} isString - str if matched as a string
	 * @return {String} - placeholder with index
	 */
	
	function save(str, isString) {
	  var i = saved.length;
	  saved[i] = isString ? str.replace(newlineRE, '\\n') : str;
	  return '"' + i + '"';
	}
	
	/**
	 * Path rewrite replacer
	 *
	 * @param {String} raw
	 * @return {String}
	 */
	
	function rewrite(raw) {
	  var c = raw.charAt(0);
	  var path = raw.slice(1);
	  if (allowedKeywordsRE.test(path)) {
	    return raw;
	  } else {
	    path = path.indexOf('"') > -1 ? path.replace(restoreRE, restore) : path;
	    return c + 'scope.' + path;
	  }
	}
	
	/**
	 * Restore replacer
	 *
	 * @param {String} str
	 * @param {String} i - matched save index
	 * @return {String}
	 */
	
	function restore(str, i) {
	  return saved[i];
	}
	
	/**
	 * Rewrite an expression, prefixing all path accessors with
	 * `scope.` and generate getter/setter functions.
	 *
	 * @param {String} exp
	 * @return {Function}
	 */
	
	function compileGetter(exp) {
	  if (improperKeywordsRE.test(exp)) {
	    process.env.NODE_ENV !== 'production' && warn('Avoid using reserved keywords in expression: ' + exp);
	  }
	  // reset state
	  saved.length = 0;
	  // save strings and object literal keys
	  var body = exp.replace(saveRE, save).replace(wsRE, '');
	  // rewrite all paths
	  // pad 1 space here because the regex matches 1 extra char
	  body = (' ' + body).replace(identRE, rewrite).replace(restoreRE, restore);
	  return makeGetterFn(body);
	}
	
	/**
	 * Build a getter function. Requires eval.
	 *
	 * We isolate the try/catch so it doesn't affect the
	 * optimization of the parse function when it is not called.
	 *
	 * @param {String} body
	 * @return {Function|undefined}
	 */
	
	function makeGetterFn(body) {
	  try {
	    /* eslint-disable no-new-func */
	    return new Function('scope', 'return ' + body + ';');
	    /* eslint-enable no-new-func */
	  } catch (e) {
	    if (process.env.NODE_ENV !== 'production') {
	      /* istanbul ignore if */
	      if (e.toString().match(/unsafe-eval|CSP/)) {
	        warn('It seems you are using the default build of Vue.js in an environment ' + 'with Content Security Policy that prohibits unsafe-eval. ' + 'Use the CSP-compliant build instead: ' + 'http://vuejs.org/guide/installation.html#CSP-compliant-build');
	      } else {
	        warn('Invalid expression. ' + 'Generated function body: ' + body);
	      }
	    }
	    return noop;
	  }
	}
	
	/**
	 * Compile a setter function for the expression.
	 *
	 * @param {String} exp
	 * @return {Function|undefined}
	 */
	
	function compileSetter(exp) {
	  var path = parsePath(exp);
	  if (path) {
	    return function (scope, val) {
	      setPath(scope, path, val);
	    };
	  } else {
	    process.env.NODE_ENV !== 'production' && warn('Invalid setter expression: ' + exp);
	  }
	}
	
	/**
	 * Parse an expression into re-written getter/setters.
	 *
	 * @param {String} exp
	 * @param {Boolean} needSet
	 * @return {Function}
	 */
	
	function parseExpression(exp, needSet) {
	  exp = exp.trim();
	  // try cache
	  var hit = expressionCache.get(exp);
	  if (hit) {
	    if (needSet && !hit.set) {
	      hit.set = compileSetter(hit.exp);
	    }
	    return hit;
	  }
	  var res = { exp: exp };
	  res.get = isSimplePath(exp) && exp.indexOf('[') < 0
	  // optimized super simple getter
	  ? makeGetterFn('scope.' + exp)
	  // dynamic getter
	  : compileGetter(exp);
	  if (needSet) {
	    res.set = compileSetter(exp);
	  }
	  expressionCache.put(exp, res);
	  return res;
	}
	
	/**
	 * Check if an expression is a simple path.
	 *
	 * @param {String} exp
	 * @return {Boolean}
	 */
	
	function isSimplePath(exp) {
	  return pathTestRE.test(exp) &&
	  // don't treat literal values as paths
	  !literalValueRE$1.test(exp) &&
	  // Math constants e.g. Math.PI, Math.E etc.
	  exp.slice(0, 5) !== 'Math.';
	}
	
	var expression = Object.freeze({
	  parseExpression: parseExpression,
	  isSimplePath: isSimplePath
	});
	
	// we have two separate queues: one for directive updates
	// and one for user watcher registered via $watch().
	// we want to guarantee directive updates to be called
	// before user watchers so that when user watchers are
	// triggered, the DOM would have already been in updated
	// state.
	
	var queue = [];
	var userQueue = [];
	var has = {};
	var circular = {};
	var waiting = false;
	
	/**
	 * Reset the batcher's state.
	 */
	
	function resetBatcherState() {
	  queue.length = 0;
	  userQueue.length = 0;
	  has = {};
	  circular = {};
	  waiting = false;
	}
	
	/**
	 * Flush both queues and run the watchers.
	 */
	
	function flushBatcherQueue() {
	  var _again = true;
	
	  _function: while (_again) {
	    _again = false;
	
	    runBatcherQueue(queue);
	    runBatcherQueue(userQueue);
	    // user watchers triggered more watchers,
	    // keep flushing until it depletes
	    if (queue.length) {
	      _again = true;
	      continue _function;
	    }
	    // dev tool hook
	    /* istanbul ignore if */
	    if (devtools && config.devtools) {
	      devtools.emit('flush');
	    }
	    resetBatcherState();
	  }
	}
	
	/**
	 * Run the watchers in a single queue.
	 *
	 * @param {Array} queue
	 */
	
	function runBatcherQueue(queue) {
	  // do not cache length because more watchers might be pushed
	  // as we run existing watchers
	  for (var i = 0; i < queue.length; i++) {
	    var watcher = queue[i];
	    var id = watcher.id;
	    has[id] = null;
	    watcher.run();
	    // in dev build, check and stop circular updates.
	    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
	      circular[id] = (circular[id] || 0) + 1;
	      if (circular[id] > config._maxUpdateCount) {
	        warn('You may have an infinite update loop for watcher ' + 'with expression "' + watcher.expression + '"', watcher.vm);
	        break;
	      }
	    }
	  }
	  queue.length = 0;
	}
	
	/**
	 * Push a watcher into the watcher queue.
	 * Jobs with duplicate IDs will be skipped unless it's
	 * pushed when the queue is being flushed.
	 *
	 * @param {Watcher} watcher
	 *   properties:
	 *   - {Number} id
	 *   - {Function} run
	 */
	
	function pushWatcher(watcher) {
	  var id = watcher.id;
	  if (has[id] == null) {
	    // push watcher into appropriate queue
	    var q = watcher.user ? userQueue : queue;
	    has[id] = q.length;
	    q.push(watcher);
	    // queue the flush
	    if (!waiting) {
	      waiting = true;
	      nextTick(flushBatcherQueue);
	    }
	  }
	}
	
	var uid$2 = 0;
	
	/**
	 * A watcher parses an expression, collects dependencies,
	 * and fires callback when the expression value changes.
	 * This is used for both the $watch() api and directives.
	 *
	 * @param {Vue} vm
	 * @param {String|Function} expOrFn
	 * @param {Function} cb
	 * @param {Object} options
	 *                 - {Array} filters
	 *                 - {Boolean} twoWay
	 *                 - {Boolean} deep
	 *                 - {Boolean} user
	 *                 - {Boolean} sync
	 *                 - {Boolean} lazy
	 *                 - {Function} [preProcess]
	 *                 - {Function} [postProcess]
	 * @constructor
	 */
	function Watcher(vm, expOrFn, cb, options) {
	  // mix in options
	  if (options) {
	    extend(this, options);
	  }
	  var isFn = typeof expOrFn === 'function';
	  this.vm = vm;
	  vm._watchers.push(this);
	  this.expression = expOrFn;
	  this.cb = cb;
	  this.id = ++uid$2; // uid for batching
	  this.active = true;
	  this.dirty = this.lazy; // for lazy watchers
	  this.deps = [];
	  this.newDeps = [];
	  this.depIds = new _Set();
	  this.newDepIds = new _Set();
	  this.prevError = null; // for async error stacks
	  // parse expression for getter/setter
	  if (isFn) {
	    this.getter = expOrFn;
	    this.setter = undefined;
	  } else {
	    var res = parseExpression(expOrFn, this.twoWay);
	    this.getter = res.get;
	    this.setter = res.set;
	  }
	  this.value = this.lazy ? undefined : this.get();
	  // state for avoiding false triggers for deep and Array
	  // watchers during vm._digest()
	  this.queued = this.shallow = false;
	}
	
	/**
	 * Evaluate the getter, and re-collect dependencies.
	 */
	
	Watcher.prototype.get = function () {
	  this.beforeGet();
	  var scope = this.scope || this.vm;
	  var value;
	  try {
	    value = this.getter.call(scope, scope);
	  } catch (e) {
	    if (process.env.NODE_ENV !== 'production' && config.warnExpressionErrors) {
	      warn('Error when evaluating expression ' + '"' + this.expression + '": ' + e.toString(), this.vm);
	    }
	  }
	  // "touch" every property so they are all tracked as
	  // dependencies for deep watching
	  if (this.deep) {
	    traverse(value);
	  }
	  if (this.preProcess) {
	    value = this.preProcess(value);
	  }
	  if (this.filters) {
	    value = scope._applyFilters(value, null, this.filters, false);
	  }
	  if (this.postProcess) {
	    value = this.postProcess(value);
	  }
	  this.afterGet();
	  return value;
	};
	
	/**
	 * Set the corresponding value with the setter.
	 *
	 * @param {*} value
	 */
	
	Watcher.prototype.set = function (value) {
	  var scope = this.scope || this.vm;
	  if (this.filters) {
	    value = scope._applyFilters(value, this.value, this.filters, true);
	  }
	  try {
	    this.setter.call(scope, scope, value);
	  } catch (e) {
	    if (process.env.NODE_ENV !== 'production' && config.warnExpressionErrors) {
	      warn('Error when evaluating setter ' + '"' + this.expression + '": ' + e.toString(), this.vm);
	    }
	  }
	  // two-way sync for v-for alias
	  var forContext = scope.$forContext;
	  if (forContext && forContext.alias === this.expression) {
	    if (forContext.filters) {
	      process.env.NODE_ENV !== 'production' && warn('It seems you are using two-way binding on ' + 'a v-for alias (' + this.expression + '), and the ' + 'v-for has filters. This will not work properly. ' + 'Either remove the filters or use an array of ' + 'objects and bind to object properties instead.', this.vm);
	      return;
	    }
	    forContext._withLock(function () {
	      if (scope.$key) {
	        // original is an object
	        forContext.rawValue[scope.$key] = value;
	      } else {
	        forContext.rawValue.$set(scope.$index, value);
	      }
	    });
	  }
	};
	
	/**
	 * Prepare for dependency collection.
	 */
	
	Watcher.prototype.beforeGet = function () {
	  Dep.target = this;
	};
	
	/**
	 * Add a dependency to this directive.
	 *
	 * @param {Dep} dep
	 */
	
	Watcher.prototype.addDep = function (dep) {
	  var id = dep.id;
	  if (!this.newDepIds.has(id)) {
	    this.newDepIds.add(id);
	    this.newDeps.push(dep);
	    if (!this.depIds.has(id)) {
	      dep.addSub(this);
	    }
	  }
	};
	
	/**
	 * Clean up for dependency collection.
	 */
	
	Watcher.prototype.afterGet = function () {
	  Dep.target = null;
	  var i = this.deps.length;
	  while (i--) {
	    var dep = this.deps[i];
	    if (!this.newDepIds.has(dep.id)) {
	      dep.removeSub(this);
	    }
	  }
	  var tmp = this.depIds;
	  this.depIds = this.newDepIds;
	  this.newDepIds = tmp;
	  this.newDepIds.clear();
	  tmp = this.deps;
	  this.deps = this.newDeps;
	  this.newDeps = tmp;
	  this.newDeps.length = 0;
	};
	
	/**
	 * Subscriber interface.
	 * Will be called when a dependency changes.
	 *
	 * @param {Boolean} shallow
	 */
	
	Watcher.prototype.update = function (shallow) {
	  if (this.lazy) {
	    this.dirty = true;
	  } else if (this.sync || !config.async) {
	    this.run();
	  } else {
	    // if queued, only overwrite shallow with non-shallow,
	    // but not the other way around.
	    this.shallow = this.queued ? shallow ? this.shallow : false : !!shallow;
	    this.queued = true;
	    // record before-push error stack in debug mode
	    /* istanbul ignore if */
	    if (process.env.NODE_ENV !== 'production' && config.debug) {
	      this.prevError = new Error('[vue] async stack trace');
	    }
	    pushWatcher(this);
	  }
	};
	
	/**
	 * Batcher job interface.
	 * Will be called by the batcher.
	 */
	
	Watcher.prototype.run = function () {
	  if (this.active) {
	    var value = this.get();
	    if (value !== this.value ||
	    // Deep watchers and watchers on Object/Arrays should fire even
	    // when the value is the same, because the value may
	    // have mutated; but only do so if this is a
	    // non-shallow update (caused by a vm digest).
	    (isObject(value) || this.deep) && !this.shallow) {
	      // set new value
	      var oldValue = this.value;
	      this.value = value;
	      // in debug + async mode, when a watcher callbacks
	      // throws, we also throw the saved before-push error
	      // so the full cross-tick stack trace is available.
	      var prevError = this.prevError;
	      /* istanbul ignore if */
	      if (process.env.NODE_ENV !== 'production' && config.debug && prevError) {
	        this.prevError = null;
	        try {
	          this.cb.call(this.vm, value, oldValue);
	        } catch (e) {
	          nextTick(function () {
	            throw prevError;
	          }, 0);
	          throw e;
	        }
	      } else {
	        this.cb.call(this.vm, value, oldValue);
	      }
	    }
	    this.queued = this.shallow = false;
	  }
	};
	
	/**
	 * Evaluate the value of the watcher.
	 * This only gets called for lazy watchers.
	 */
	
	Watcher.prototype.evaluate = function () {
	  // avoid overwriting another watcher that is being
	  // collected.
	  var current = Dep.target;
	  this.value = this.get();
	  this.dirty = false;
	  Dep.target = current;
	};
	
	/**
	 * Depend on all deps collected by this watcher.
	 */
	
	Watcher.prototype.depend = function () {
	  var i = this.deps.length;
	  while (i--) {
	    this.deps[i].depend();
	  }
	};
	
	/**
	 * Remove self from all dependencies' subcriber list.
	 */
	
	Watcher.prototype.teardown = function () {
	  if (this.active) {
	    // remove self from vm's watcher list
	    // this is a somewhat expensive operation so we skip it
	    // if the vm is being destroyed or is performing a v-for
	    // re-render (the watcher list is then filtered by v-for).
	    if (!this.vm._isBeingDestroyed && !this.vm._vForRemoving) {
	      this.vm._watchers.$remove(this);
	    }
	    var i = this.deps.length;
	    while (i--) {
	      this.deps[i].removeSub(this);
	    }
	    this.active = false;
	    this.vm = this.cb = this.value = null;
	  }
	};
	
	/**
	 * Recrusively traverse an object to evoke all converted
	 * getters, so that every nested property inside the object
	 * is collected as a "deep" dependency.
	 *
	 * @param {*} val
	 */
	
	var seenObjects = new _Set();
	function traverse(val, seen) {
	  var i = undefined,
	      keys = undefined;
	  if (!seen) {
	    seen = seenObjects;
	    seen.clear();
	  }
	  var isA = isArray(val);
	  var isO = isObject(val);
	  if ((isA || isO) && Object.isExtensible(val)) {
	    if (val.__ob__) {
	      var depId = val.__ob__.dep.id;
	      if (seen.has(depId)) {
	        return;
	      } else {
	        seen.add(depId);
	      }
	    }
	    if (isA) {
	      i = val.length;
	      while (i--) traverse(val[i], seen);
	    } else if (isO) {
	      keys = Object.keys(val);
	      i = keys.length;
	      while (i--) traverse(val[keys[i]], seen);
	    }
	  }
	}
	
	var text$1 = {
	
	  bind: function bind() {
	    this.attr = this.el.nodeType === 3 ? 'data' : 'textContent';
	  },
	
	  update: function update(value) {
	    this.el[this.attr] = _toString(value);
	  }
	};
	
	var templateCache = new Cache(1000);
	var idSelectorCache = new Cache(1000);
	
	var map = {
	  efault: [0, '', ''],
	  legend: [1, '<fieldset>', '</fieldset>'],
	  tr: [2, '<table><tbody>', '</tbody></table>'],
	  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>']
	};
	
	map.td = map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];
	
	map.option = map.optgroup = [1, '<select multiple="multiple">', '</select>'];
	
	map.thead = map.tbody = map.colgroup = map.caption = map.tfoot = [1, '<table>', '</table>'];
	
	map.g = map.defs = map.symbol = map.use = map.image = map.text = map.circle = map.ellipse = map.line = map.path = map.polygon = map.polyline = map.rect = [1, '<svg ' + 'xmlns="http://www.w3.org/2000/svg" ' + 'xmlns:xlink="http://www.w3.org/1999/xlink" ' + 'xmlns:ev="http://www.w3.org/2001/xml-events"' + 'version="1.1">', '</svg>'];
	
	/**
	 * Check if a node is a supported template node with a
	 * DocumentFragment content.
	 *
	 * @param {Node} node
	 * @return {Boolean}
	 */
	
	function isRealTemplate(node) {
	  return isTemplate(node) && isFragment(node.content);
	}
	
	var tagRE$1 = /<([\w:-]+)/;
	var entityRE = /&#?\w+?;/;
	var commentRE = /<!--/;
	
	/**
	 * Convert a string template to a DocumentFragment.
	 * Determines correct wrapping by tag types. Wrapping
	 * strategy found in jQuery & component/domify.
	 *
	 * @param {String} templateString
	 * @param {Boolean} raw
	 * @return {DocumentFragment}
	 */
	
	function stringToFragment(templateString, raw) {
	  // try a cache hit first
	  var cacheKey = raw ? templateString : templateString.trim();
	  var hit = templateCache.get(cacheKey);
	  if (hit) {
	    return hit;
	  }
	
	  var frag = document.createDocumentFragment();
	  var tagMatch = templateString.match(tagRE$1);
	  var entityMatch = entityRE.test(templateString);
	  var commentMatch = commentRE.test(templateString);
	
	  if (!tagMatch && !entityMatch && !commentMatch) {
	    // text only, return a single text node.
	    frag.appendChild(document.createTextNode(templateString));
	  } else {
	    var tag = tagMatch && tagMatch[1];
	    var wrap = map[tag] || map.efault;
	    var depth = wrap[0];
	    var prefix = wrap[1];
	    var suffix = wrap[2];
	    var node = document.createElement('div');
	
	    node.innerHTML = prefix + templateString + suffix;
	    while (depth--) {
	      node = node.lastChild;
	    }
	
	    var child;
	    /* eslint-disable no-cond-assign */
	    while (child = node.firstChild) {
	      /* eslint-enable no-cond-assign */
	      frag.appendChild(child);
	    }
	  }
	  if (!raw) {
	    trimNode(frag);
	  }
	  templateCache.put(cacheKey, frag);
	  return frag;
	}
	
	/**
	 * Convert a template node to a DocumentFragment.
	 *
	 * @param {Node} node
	 * @return {DocumentFragment}
	 */
	
	function nodeToFragment(node) {
	  // if its a template tag and the browser supports it,
	  // its content is already a document fragment. However, iOS Safari has
	  // bug when using directly cloned template content with touch
	  // events and can cause crashes when the nodes are removed from DOM, so we
	  // have to treat template elements as string templates. (#2805)
	  /* istanbul ignore if */
	  if (isRealTemplate(node)) {
	    return stringToFragment(node.innerHTML);
	  }
	  // script template
	  if (node.tagName === 'SCRIPT') {
	    return stringToFragment(node.textContent);
	  }
	  // normal node, clone it to avoid mutating the original
	  var clonedNode = cloneNode(node);
	  var frag = document.createDocumentFragment();
	  var child;
	  /* eslint-disable no-cond-assign */
	  while (child = clonedNode.firstChild) {
	    /* eslint-enable no-cond-assign */
	    frag.appendChild(child);
	  }
	  trimNode(frag);
	  return frag;
	}
	
	// Test for the presence of the Safari template cloning bug
	// https://bugs.webkit.org/showug.cgi?id=137755
	var hasBrokenTemplate = (function () {
	  /* istanbul ignore else */
	  if (inBrowser) {
	    var a = document.createElement('div');
	    a.innerHTML = '<template>1</template>';
	    return !a.cloneNode(true).firstChild.innerHTML;
	  } else {
	    return false;
	  }
	})();
	
	// Test for IE10/11 textarea placeholder clone bug
	var hasTextareaCloneBug = (function () {
	  /* istanbul ignore else */
	  if (inBrowser) {
	    var t = document.createElement('textarea');
	    t.placeholder = 't';
	    return t.cloneNode(true).value === 't';
	  } else {
	    return false;
	  }
	})();
	
	/**
	 * 1. Deal with Safari cloning nested <template> bug by
	 *    manually cloning all template instances.
	 * 2. Deal with IE10/11 textarea placeholder bug by setting
	 *    the correct value after cloning.
	 *
	 * @param {Element|DocumentFragment} node
	 * @return {Element|DocumentFragment}
	 */
	
	function cloneNode(node) {
	  /* istanbul ignore if */
	  if (!node.querySelectorAll) {
	    return node.cloneNode();
	  }
	  var res = node.cloneNode(true);
	  var i, original, cloned;
	  /* istanbul ignore if */
	  if (hasBrokenTemplate) {
	    var tempClone = res;
	    if (isRealTemplate(node)) {
	      node = node.content;
	      tempClone = res.content;
	    }
	    original = node.querySelectorAll('template');
	    if (original.length) {
	      cloned = tempClone.querySelectorAll('template');
	      i = cloned.length;
	      while (i--) {
	        cloned[i].parentNode.replaceChild(cloneNode(original[i]), cloned[i]);
	      }
	    }
	  }
	  /* istanbul ignore if */
	  if (hasTextareaCloneBug) {
	    if (node.tagName === 'TEXTAREA') {
	      res.value = node.value;
	    } else {
	      original = node.querySelectorAll('textarea');
	      if (original.length) {
	        cloned = res.querySelectorAll('textarea');
	        i = cloned.length;
	        while (i--) {
	          cloned[i].value = original[i].value;
	        }
	      }
	    }
	  }
	  return res;
	}
	
	/**
	 * Process the template option and normalizes it into a
	 * a DocumentFragment that can be used as a partial or a
	 * instance template.
	 *
	 * @param {*} template
	 *        Possible values include:
	 *        - DocumentFragment object
	 *        - Node object of type Template
	 *        - id selector: '#some-template-id'
	 *        - template string: '<div><span>{{msg}}</span></div>'
	 * @param {Boolean} shouldClone
	 * @param {Boolean} raw
	 *        inline HTML interpolation. Do not check for id
	 *        selector and keep whitespace in the string.
	 * @return {DocumentFragment|undefined}
	 */
	
	function parseTemplate(template, shouldClone, raw) {
	  var node, frag;
	
	  // if the template is already a document fragment,
	  // do nothing
	  if (isFragment(template)) {
	    trimNode(template);
	    return shouldClone ? cloneNode(template) : template;
	  }
	
	  if (typeof template === 'string') {
	    // id selector
	    if (!raw && template.charAt(0) === '#') {
	      // id selector can be cached too
	      frag = idSelectorCache.get(template);
	      if (!frag) {
	        node = document.getElementById(template.slice(1));
	        if (node) {
	          frag = nodeToFragment(node);
	          // save selector to cache
	          idSelectorCache.put(template, frag);
	        }
	      }
	    } else {
	      // normal string template
	      frag = stringToFragment(template, raw);
	    }
	  } else if (template.nodeType) {
	    // a direct node
	    frag = nodeToFragment(template);
	  }
	
	  return frag && shouldClone ? cloneNode(frag) : frag;
	}
	
	var template = Object.freeze({
	  cloneNode: cloneNode,
	  parseTemplate: parseTemplate
	});
	
	var html = {
	
	  bind: function bind() {
	    // a comment node means this is a binding for
	    // {{{ inline unescaped html }}}
	    if (this.el.nodeType === 8) {
	      // hold nodes
	      this.nodes = [];
	      // replace the placeholder with proper anchor
	      this.anchor = createAnchor('v-html');
	      replace(this.el, this.anchor);
	    }
	  },
	
	  update: function update(value) {
	    value = _toString(value);
	    if (this.nodes) {
	      this.swap(value);
	    } else {
	      this.el.innerHTML = value;
	    }
	  },
	
	  swap: function swap(value) {
	    // remove old nodes
	    var i = this.nodes.length;
	    while (i--) {
	      remove(this.nodes[i]);
	    }
	    // convert new value to a fragment
	    // do not attempt to retrieve from id selector
	    var frag = parseTemplate(value, true, true);
	    // save a reference to these nodes so we can remove later
	    this.nodes = toArray(frag.childNodes);
	    before(frag, this.anchor);
	  }
	};
	
	/**
	 * Abstraction for a partially-compiled fragment.
	 * Can optionally compile content with a child scope.
	 *
	 * @param {Function} linker
	 * @param {Vue} vm
	 * @param {DocumentFragment} frag
	 * @param {Vue} [host]
	 * @param {Object} [scope]
	 * @param {Fragment} [parentFrag]
	 */
	function Fragment(linker, vm, frag, host, scope, parentFrag) {
	  this.children = [];
	  this.childFrags = [];
	  this.vm = vm;
	  this.scope = scope;
	  this.inserted = false;
	  this.parentFrag = parentFrag;
	  if (parentFrag) {
	    parentFrag.childFrags.push(this);
	  }
	  this.unlink = linker(vm, frag, host, scope, this);
	  var single = this.single = frag.childNodes.length === 1 &&
	  // do not go single mode if the only node is an anchor
	  !frag.childNodes[0].__v_anchor;
	  if (single) {
	    this.node = frag.childNodes[0];
	    this.before = singleBefore;
	    this.remove = singleRemove;
	  } else {
	    this.node = createAnchor('fragment-start');
	    this.end = createAnchor('fragment-end');
	    this.frag = frag;
	    prepend(this.node, frag);
	    frag.appendChild(this.end);
	    this.before = multiBefore;
	    this.remove = multiRemove;
	  }
	  this.node.__v_frag = this;
	}
	
	/**
	 * Call attach/detach for all components contained within
	 * this fragment. Also do so recursively for all child
	 * fragments.
	 *
	 * @param {Function} hook
	 */
	
	Fragment.prototype.callHook = function (hook) {
	  var i, l;
	  for (i = 0, l = this.childFrags.length; i < l; i++) {
	    this.childFrags[i].callHook(hook);
	  }
	  for (i = 0, l = this.children.length; i < l; i++) {
	    hook(this.children[i]);
	  }
	};
	
	/**
	 * Insert fragment before target, single node version
	 *
	 * @param {Node} target
	 * @param {Boolean} withTransition
	 */
	
	function singleBefore(target, withTransition) {
	  this.inserted = true;
	  var method = withTransition !== false ? beforeWithTransition : before;
	  method(this.node, target, this.vm);
	  if (inDoc(this.node)) {
	    this.callHook(attach);
	  }
	}
	
	/**
	 * Remove fragment, single node version
	 */
	
	function singleRemove() {
	  this.inserted = false;
	  var shouldCallRemove = inDoc(this.node);
	  var self = this;
	  this.beforeRemove();
	  removeWithTransition(this.node, this.vm, function () {
	    if (shouldCallRemove) {
	      self.callHook(detach);
	    }
	    self.destroy();
	  });
	}
	
	/**
	 * Insert fragment before target, multi-nodes version
	 *
	 * @param {Node} target
	 * @param {Boolean} withTransition
	 */
	
	function multiBefore(target, withTransition) {
	  this.inserted = true;
	  var vm = this.vm;
	  var method = withTransition !== false ? beforeWithTransition : before;
	  mapNodeRange(this.node, this.end, function (node) {
	    method(node, target, vm);
	  });
	  if (inDoc(this.node)) {
	    this.callHook(attach);
	  }
	}
	
	/**
	 * Remove fragment, multi-nodes version
	 */
	
	function multiRemove() {
	  this.inserted = false;
	  var self = this;
	  var shouldCallRemove = inDoc(this.node);
	  this.beforeRemove();
	  removeNodeRange(this.node, this.end, this.vm, this.frag, function () {
	    if (shouldCallRemove) {
	      self.callHook(detach);
	    }
	    self.destroy();
	  });
	}
	
	/**
	 * Prepare the fragment for removal.
	 */
	
	Fragment.prototype.beforeRemove = function () {
	  var i, l;
	  for (i = 0, l = this.childFrags.length; i < l; i++) {
	    // call the same method recursively on child
	    // fragments, depth-first
	    this.childFrags[i].beforeRemove(false);
	  }
	  for (i = 0, l = this.children.length; i < l; i++) {
	    // Call destroy for all contained instances,
	    // with remove:false and defer:true.
	    // Defer is necessary because we need to
	    // keep the children to call detach hooks
	    // on them.
	    this.children[i].$destroy(false, true);
	  }
	  var dirs = this.unlink.dirs;
	  for (i = 0, l = dirs.length; i < l; i++) {
	    // disable the watchers on all the directives
	    // so that the rendered content stays the same
	    // during removal.
	    dirs[i]._watcher && dirs[i]._watcher.teardown();
	  }
	};
	
	/**
	 * Destroy the fragment.
	 */
	
	Fragment.prototype.destroy = function () {
	  if (this.parentFrag) {
	    this.parentFrag.childFrags.$remove(this);
	  }
	  this.node.__v_frag = null;
	  this.unlink();
	};
	
	/**
	 * Call attach hook for a Vue instance.
	 *
	 * @param {Vue} child
	 */
	
	function attach(child) {
	  if (!child._isAttached && inDoc(child.$el)) {
	    child._callHook('attached');
	  }
	}
	
	/**
	 * Call detach hook for a Vue instance.
	 *
	 * @param {Vue} child
	 */
	
	function detach(child) {
	  if (child._isAttached && !inDoc(child.$el)) {
	    child._callHook('detached');
	  }
	}
	
	var linkerCache = new Cache(5000);
	
	/**
	 * A factory that can be used to create instances of a
	 * fragment. Caches the compiled linker if possible.
	 *
	 * @param {Vue} vm
	 * @param {Element|String} el
	 */
	function FragmentFactory(vm, el) {
	  this.vm = vm;
	  var template;
	  var isString = typeof el === 'string';
	  if (isString || isTemplate(el) && !el.hasAttribute('v-if')) {
	    template = parseTemplate(el, true);
	  } else {
	    template = document.createDocumentFragment();
	    template.appendChild(el);
	  }
	  this.template = template;
	  // linker can be cached, but only for components
	  var linker;
	  var cid = vm.constructor.cid;
	  if (cid > 0) {
	    var cacheId = cid + (isString ? el : getOuterHTML(el));
	    linker = linkerCache.get(cacheId);
	    if (!linker) {
	      linker = compile(template, vm.$options, true);
	      linkerCache.put(cacheId, linker);
	    }
	  } else {
	    linker = compile(template, vm.$options, true);
	  }
	  this.linker = linker;
	}
	
	/**
	 * Create a fragment instance with given host and scope.
	 *
	 * @param {Vue} host
	 * @param {Object} scope
	 * @param {Fragment} parentFrag
	 */
	
	FragmentFactory.prototype.create = function (host, scope, parentFrag) {
	  var frag = cloneNode(this.template);
	  return new Fragment(this.linker, this.vm, frag, host, scope, parentFrag);
	};
	
	var ON = 700;
	var MODEL = 800;
	var BIND = 850;
	var TRANSITION = 1100;
	var EL = 1500;
	var COMPONENT = 1500;
	var PARTIAL = 1750;
	var IF = 2100;
	var FOR = 2200;
	var SLOT = 2300;
	
	var uid$3 = 0;
	
	var vFor = {
	
	  priority: FOR,
	  terminal: true,
	
	  params: ['track-by', 'stagger', 'enter-stagger', 'leave-stagger'],
	
	  bind: function bind() {
	    // support "item in/of items" syntax
	    var inMatch = this.expression.match(/(.*) (?:in|of) (.*)/);
	    if (inMatch) {
	      var itMatch = inMatch[1].match(/\((.*),(.*)\)/);
	      if (itMatch) {
	        this.iterator = itMatch[1].trim();
	        this.alias = itMatch[2].trim();
	      } else {
	        this.alias = inMatch[1].trim();
	      }
	      this.expression = inMatch[2];
	    }
	
	    if (!this.alias) {
	      process.env.NODE_ENV !== 'production' && warn('Invalid v-for expression "' + this.descriptor.raw + '": ' + 'alias is required.', this.vm);
	      return;
	    }
	
	    // uid as a cache identifier
	    this.id = '__v-for__' + ++uid$3;
	
	    // check if this is an option list,
	    // so that we know if we need to update the <select>'s
	    // v-model when the option list has changed.
	    // because v-model has a lower priority than v-for,
	    // the v-model is not bound here yet, so we have to
	    // retrive it in the actual updateModel() function.
	    var tag = this.el.tagName;
	    this.isOption = (tag === 'OPTION' || tag === 'OPTGROUP') && this.el.parentNode.tagName === 'SELECT';
	
	    // setup anchor nodes
	    this.start = createAnchor('v-for-start');
	    this.end = createAnchor('v-for-end');
	    replace(this.el, this.end);
	    before(this.start, this.end);
	
	    // cache
	    this.cache = Object.create(null);
	
	    // fragment factory
	    this.factory = new FragmentFactory(this.vm, this.el);
	  },
	
	  update: function update(data) {
	    this.diff(data);
	    this.updateRef();
	    this.updateModel();
	  },
	
	  /**
	   * Diff, based on new data and old data, determine the
	   * minimum amount of DOM manipulations needed to make the
	   * DOM reflect the new data Array.
	   *
	   * The algorithm diffs the new data Array by storing a
	   * hidden reference to an owner vm instance on previously
	   * seen data. This allows us to achieve O(n) which is
	   * better than a levenshtein distance based algorithm,
	   * which is O(m * n).
	   *
	   * @param {Array} data
	   */
	
	  diff: function diff(data) {
	    // check if the Array was converted from an Object
	    var item = data[0];
	    var convertedFromObject = this.fromObject = isObject(item) && hasOwn(item, '$key') && hasOwn(item, '$value');
	
	    var trackByKey = this.params.trackBy;
	    var oldFrags = this.frags;
	    var frags = this.frags = new Array(data.length);
	    var alias = this.alias;
	    var iterator = this.iterator;
	    var start = this.start;
	    var end = this.end;
	    var inDocument = inDoc(start);
	    var init = !oldFrags;
	    var i, l, frag, key, value, primitive;
	
	    // First pass, go through the new Array and fill up
	    // the new frags array. If a piece of data has a cached
	    // instance for it, we reuse it. Otherwise build a new
	    // instance.
	    for (i = 0, l = data.length; i < l; i++) {
	      item = data[i];
	      key = convertedFromObject ? item.$key : null;
	      value = convertedFromObject ? item.$value : item;
	      primitive = !isObject(value);
	      frag = !init && this.getCachedFrag(value, i, key);
	      if (frag) {
	        // reusable fragment
	        frag.reused = true;
	        // update $index
	        frag.scope.$index = i;
	        // update $key
	        if (key) {
	          frag.scope.$key = key;
	        }
	        // update iterator
	        if (iterator) {
	          frag.scope[iterator] = key !== null ? key : i;
	        }
	        // update data for track-by, object repeat &
	        // primitive values.
	        if (trackByKey || convertedFromObject || primitive) {
	          withoutConversion(function () {
	            frag.scope[alias] = value;
	          });
	        }
	      } else {
	        // new isntance
	        frag = this.create(value, alias, i, key);
	        frag.fresh = !init;
	      }
	      frags[i] = frag;
	      if (init) {
	        frag.before(end);
	      }
	    }
	
	    // we're done for the initial render.
	    if (init) {
	      return;
	    }
	
	    // Second pass, go through the old fragments and
	    // destroy those who are not reused (and remove them
	    // from cache)
	    var removalIndex = 0;
	    var totalRemoved = oldFrags.length - frags.length;
	    // when removing a large number of fragments, watcher removal
	    // turns out to be a perf bottleneck, so we batch the watcher
	    // removals into a single filter call!
	    this.vm._vForRemoving = true;
	    for (i = 0, l = oldFrags.length; i < l; i++) {
	      frag = oldFrags[i];
	      if (!frag.reused) {
	        this.deleteCachedFrag(frag);
	        this.remove(frag, removalIndex++, totalRemoved, inDocument);
	      }
	    }
	    this.vm._vForRemoving = false;
	    if (removalIndex) {
	      this.vm._watchers = this.vm._watchers.filter(function (w) {
	        return w.active;
	      });
	    }
	
	    // Final pass, move/insert new fragments into the
	    // right place.
	    var targetPrev, prevEl, currentPrev;
	    var insertionIndex = 0;
	    for (i = 0, l = frags.length; i < l; i++) {
	      frag = frags[i];
	      // this is the frag that we should be after
	      targetPrev = frags[i - 1];
	      prevEl = targetPrev ? targetPrev.staggerCb ? targetPrev.staggerAnchor : targetPrev.end || targetPrev.node : start;
	      if (frag.reused && !frag.staggerCb) {
	        currentPrev = findPrevFrag(frag, start, this.id);
	        if (currentPrev !== targetPrev && (!currentPrev ||
	        // optimization for moving a single item.
	        // thanks to suggestions by @livoras in #1807
	        findPrevFrag(currentPrev, start, this.id) !== targetPrev)) {
	          this.move(frag, prevEl);
	        }
	      } else {
	        // new instance, or still in stagger.
	        // insert with updated stagger index.
	        this.insert(frag, insertionIndex++, prevEl, inDocument);
	      }
	      frag.reused = frag.fresh = false;
	    }
	  },
	
	  /**
	   * Create a new fragment instance.
	   *
	   * @param {*} value
	   * @param {String} alias
	   * @param {Number} index
	   * @param {String} [key]
	   * @return {Fragment}
	   */
	
	  create: function create(value, alias, index, key) {
	    var host = this._host;
	    // create iteration scope
	    var parentScope = this._scope || this.vm;
	    var scope = Object.create(parentScope);
	    // ref holder for the scope
	    scope.$refs = Object.create(parentScope.$refs);
	    scope.$els = Object.create(parentScope.$els);
	    // make sure point $parent to parent scope
	    scope.$parent = parentScope;
	    // for two-way binding on alias
	    scope.$forContext = this;
	    // define scope properties
	    // important: define the scope alias without forced conversion
	    // so that frozen data structures remain non-reactive.
	    withoutConversion(function () {
	      defineReactive(scope, alias, value);
	    });
	    defineReactive(scope, '$index', index);
	    if (key) {
	      defineReactive(scope, '$key', key);
	    } else if (scope.$key) {
	      // avoid accidental fallback
	      def(scope, '$key', null);
	    }
	    if (this.iterator) {
	      defineReactive(scope, this.iterator, key !== null ? key : index);
	    }
	    var frag = this.factory.create(host, scope, this._frag);
	    frag.forId = this.id;
	    this.cacheFrag(value, frag, index, key);
	    return frag;
	  },
	
	  /**
	   * Update the v-ref on owner vm.
	   */
	
	  updateRef: function updateRef() {
	    var ref = this.descriptor.ref;
	    if (!ref) return;
	    var hash = (this._scope || this.vm).$refs;
	    var refs;
	    if (!this.fromObject) {
	      refs = this.frags.map(findVmFromFrag);
	    } else {
	      refs = {};
	      this.frags.forEach(function (frag) {
	        refs[frag.scope.$key] = findVmFromFrag(frag);
	      });
	    }
	    hash[ref] = refs;
	  },
	
	  /**
	   * For option lists, update the containing v-model on
	   * parent <select>.
	   */
	
	  updateModel: function updateModel() {
	    if (this.isOption) {
	      var parent = this.start.parentNode;
	      var model = parent && parent.__v_model;
	      if (model) {
	        model.forceUpdate();
	      }
	    }
	  },
	
	  /**
	   * Insert a fragment. Handles staggering.
	   *
	   * @param {Fragment} frag
	   * @param {Number} index
	   * @param {Node} prevEl
	   * @param {Boolean} inDocument
	   */
	
	  insert: function insert(frag, index, prevEl, inDocument) {
	    if (frag.staggerCb) {
	      frag.staggerCb.cancel();
	      frag.staggerCb = null;
	    }
	    var staggerAmount = this.getStagger(frag, index, null, 'enter');
	    if (inDocument && staggerAmount) {
	      // create an anchor and insert it synchronously,
	      // so that we can resolve the correct order without
	      // worrying about some elements not inserted yet
	      var anchor = frag.staggerAnchor;
	      if (!anchor) {
	        anchor = frag.staggerAnchor = createAnchor('stagger-anchor');
	        anchor.__v_frag = frag;
	      }
	      after(anchor, prevEl);
	      var op = frag.staggerCb = cancellable(function () {
	        frag.staggerCb = null;
	        frag.before(anchor);
	        remove(anchor);
	      });
	      setTimeout(op, staggerAmount);
	    } else {
	      var target = prevEl.nextSibling;
	      /* istanbul ignore if */
	      if (!target) {
	        // reset end anchor position in case the position was messed up
	        // by an external drag-n-drop library.
	        after(this.end, prevEl);
	        target = this.end;
	      }
	      frag.before(target);
	    }
	  },
	
	  /**
	   * Remove a fragment. Handles staggering.
	   *
	   * @param {Fragment} frag
	   * @param {Number} index
	   * @param {Number} total
	   * @param {Boolean} inDocument
	   */
	
	  remove: function remove(frag, index, total, inDocument) {
	    if (frag.staggerCb) {
	      frag.staggerCb.cancel();
	      frag.staggerCb = null;
	      // it's not possible for the same frag to be removed
	      // twice, so if we have a pending stagger callback,
	      // it means this frag is queued for enter but removed
	      // before its transition started. Since it is already
	      // destroyed, we can just leave it in detached state.
	      return;
	    }
	    var staggerAmount = this.getStagger(frag, index, total, 'leave');
	    if (inDocument && staggerAmount) {
	      var op = frag.staggerCb = cancellable(function () {
	        frag.staggerCb = null;
	        frag.remove();
	      });
	      setTimeout(op, staggerAmount);
	    } else {
	      frag.remove();
	    }
	  },
	
	  /**
	   * Move a fragment to a new position.
	   * Force no transition.
	   *
	   * @param {Fragment} frag
	   * @param {Node} prevEl
	   */
	
	  move: function move(frag, prevEl) {
	    // fix a common issue with Sortable:
	    // if prevEl doesn't have nextSibling, this means it's
	    // been dragged after the end anchor. Just re-position
	    // the end anchor to the end of the container.
	    /* istanbul ignore if */
	    if (!prevEl.nextSibling) {
	      this.end.parentNode.appendChild(this.end);
	    }
	    frag.before(prevEl.nextSibling, false);
	  },
	
	  /**
	   * Cache a fragment using track-by or the object key.
	   *
	   * @param {*} value
	   * @param {Fragment} frag
	   * @param {Number} index
	   * @param {String} [key]
	   */
	
	  cacheFrag: function cacheFrag(value, frag, index, key) {
	    var trackByKey = this.params.trackBy;
	    var cache = this.cache;
	    var primitive = !isObject(value);
	    var id;
	    if (key || trackByKey || primitive) {
	      id = getTrackByKey(index, key, value, trackByKey);
	      if (!cache[id]) {
	        cache[id] = frag;
	      } else if (trackByKey !== '$index') {
	        process.env.NODE_ENV !== 'production' && this.warnDuplicate(value);
	      }
	    } else {
	      id = this.id;
	      if (hasOwn(value, id)) {
	        if (value[id] === null) {
	          value[id] = frag;
	        } else {
	          process.env.NODE_ENV !== 'production' && this.warnDuplicate(value);
	        }
	      } else if (Object.isExtensible(value)) {
	        def(value, id, frag);
	      } else if (process.env.NODE_ENV !== 'production') {
	        warn('Frozen v-for objects cannot be automatically tracked, make sure to ' + 'provide a track-by key.');
	      }
	    }
	    frag.raw = value;
	  },
	
	  /**
	   * Get a cached fragment from the value/index/key
	   *
	   * @param {*} value
	   * @param {Number} index
	   * @param {String} key
	   * @return {Fragment}
	   */
	
	  getCachedFrag: function getCachedFrag(value, index, key) {
	    var trackByKey = this.params.trackBy;
	    var primitive = !isObject(value);
	    var frag;
	    if (key || trackByKey || primitive) {
	      var id = getTrackByKey(index, key, value, trackByKey);
	      frag = this.cache[id];
	    } else {
	      frag = value[this.id];
	    }
	    if (frag && (frag.reused || frag.fresh)) {
	      process.env.NODE_ENV !== 'production' && this.warnDuplicate(value);
	    }
	    return frag;
	  },
	
	  /**
	   * Delete a fragment from cache.
	   *
	   * @param {Fragment} frag
	   */
	
	  deleteCachedFrag: function deleteCachedFrag(frag) {
	    var value = frag.raw;
	    var trackByKey = this.params.trackBy;
	    var scope = frag.scope;
	    var index = scope.$index;
	    // fix #948: avoid accidentally fall through to
	    // a parent repeater which happens to have $key.
	    var key = hasOwn(scope, '$key') && scope.$key;
	    var primitive = !isObject(value);
	    if (trackByKey || key || primitive) {
	      var id = getTrackByKey(index, key, value, trackByKey);
	      this.cache[id] = null;
	    } else {
	      value[this.id] = null;
	      frag.raw = null;
	    }
	  },
	
	  /**
	   * Get the stagger amount for an insertion/removal.
	   *
	   * @param {Fragment} frag
	   * @param {Number} index
	   * @param {Number} total
	   * @param {String} type
	   */
	
	  getStagger: function getStagger(frag, index, total, type) {
	    type = type + 'Stagger';
	    var trans = frag.node.__v_trans;
	    var hooks = trans && trans.hooks;
	    var hook = hooks && (hooks[type] || hooks.stagger);
	    return hook ? hook.call(frag, index, total) : index * parseInt(this.params[type] || this.params.stagger, 10);
	  },
	
	  /**
	   * Pre-process the value before piping it through the
	   * filters. This is passed to and called by the watcher.
	   */
	
	  _preProcess: function _preProcess(value) {
	    // regardless of type, store the un-filtered raw value.
	    this.rawValue = value;
	    return value;
	  },
	
	  /**
	   * Post-process the value after it has been piped through
	   * the filters. This is passed to and called by the watcher.
	   *
	   * It is necessary for this to be called during the
	   * watcher's dependency collection phase because we want
	   * the v-for to update when the source Object is mutated.
	   */
	
	  _postProcess: function _postProcess(value) {
	    if (isArray(value)) {
	      return value;
	    } else if (isPlainObject(value)) {
	      // convert plain object to array.
	      var keys = Object.keys(value);
	      var i = keys.length;
	      var res = new Array(i);
	      var key;
	      while (i--) {
	        key = keys[i];
	        res[i] = {
	          $key: key,
	          $value: value[key]
	        };
	      }
	      return res;
	    } else {
	      if (typeof value === 'number' && !isNaN(value)) {
	        value = range(value);
	      }
	      return value || [];
	    }
	  },
	
	  unbind: function unbind() {
	    if (this.descriptor.ref) {
	      (this._scope || this.vm).$refs[this.descriptor.ref] = null;
	    }
	    if (this.frags) {
	      var i = this.frags.length;
	      var frag;
	      while (i--) {
	        frag = this.frags[i];
	        this.deleteCachedFrag(frag);
	        frag.destroy();
	      }
	    }
	  }
	};
	
	/**
	 * Helper to find the previous element that is a fragment
	 * anchor. This is necessary because a destroyed frag's
	 * element could still be lingering in the DOM before its
	 * leaving transition finishes, but its inserted flag
	 * should have been set to false so we can skip them.
	 *
	 * If this is a block repeat, we want to make sure we only
	 * return frag that is bound to this v-for. (see #929)
	 *
	 * @param {Fragment} frag
	 * @param {Comment|Text} anchor
	 * @param {String} id
	 * @return {Fragment}
	 */
	
	function findPrevFrag(frag, anchor, id) {
	  var el = frag.node.previousSibling;
	  /* istanbul ignore if */
	  if (!el) return;
	  frag = el.__v_frag;
	  while ((!frag || frag.forId !== id || !frag.inserted) && el !== anchor) {
	    el = el.previousSibling;
	    /* istanbul ignore if */
	    if (!el) return;
	    frag = el.__v_frag;
	  }
	  return frag;
	}
	
	/**
	 * Find a vm from a fragment.
	 *
	 * @param {Fragment} frag
	 * @return {Vue|undefined}
	 */
	
	function findVmFromFrag(frag) {
	  var node = frag.node;
	  // handle multi-node frag
	  if (frag.end) {
	    while (!node.__vue__ && node !== frag.end && node.nextSibling) {
	      node = node.nextSibling;
	    }
	  }
	  return node.__vue__;
	}
	
	/**
	 * Create a range array from given number.
	 *
	 * @param {Number} n
	 * @return {Array}
	 */
	
	function range(n) {
	  var i = -1;
	  var ret = new Array(Math.floor(n));
	  while (++i < n) {
	    ret[i] = i;
	  }
	  return ret;
	}
	
	/**
	 * Get the track by key for an item.
	 *
	 * @param {Number} index
	 * @param {String} key
	 * @param {*} value
	 * @param {String} [trackByKey]
	 */
	
	function getTrackByKey(index, key, value, trackByKey) {
	  return trackByKey ? trackByKey === '$index' ? index : trackByKey.charAt(0).match(/\w/) ? getPath(value, trackByKey) : value[trackByKey] : key || value;
	}
	
	if (process.env.NODE_ENV !== 'production') {
	  vFor.warnDuplicate = function (value) {
	    warn('Duplicate value found in v-for="' + this.descriptor.raw + '": ' + JSON.stringify(value) + '. Use track-by="$index" if ' + 'you are expecting duplicate values.', this.vm);
	  };
	}
	
	var vIf = {
	
	  priority: IF,
	  terminal: true,
	
	  bind: function bind() {
	    var el = this.el;
	    if (!el.__vue__) {
	      // check else block
	      var next = el.nextElementSibling;
	      if (next && getAttr(next, 'v-else') !== null) {
	        remove(next);
	        this.elseEl = next;
	      }
	      // check main block
	      this.anchor = createAnchor('v-if');
	      replace(el, this.anchor);
	    } else {
	      process.env.NODE_ENV !== 'production' && warn('v-if="' + this.expression + '" cannot be ' + 'used on an instance root element.', this.vm);
	      this.invalid = true;
	    }
	  },
	
	  update: function update(value) {
	    if (this.invalid) return;
	    if (value) {
	      if (!this.frag) {
	        this.insert();
	      }
	    } else {
	      this.remove();
	    }
	  },
	
	  insert: function insert() {
	    if (this.elseFrag) {
	      this.elseFrag.remove();
	      this.elseFrag = null;
	    }
	    // lazy init factory
	    if (!this.factory) {
	      this.factory = new FragmentFactory(this.vm, this.el);
	    }
	    this.frag = this.factory.create(this._host, this._scope, this._frag);
	    this.frag.before(this.anchor);
	  },
	
	  remove: function remove() {
	    if (this.frag) {
	      this.frag.remove();
	      this.frag = null;
	    }
	    if (this.elseEl && !this.elseFrag) {
	      if (!this.elseFactory) {
	        this.elseFactory = new FragmentFactory(this.elseEl._context || this.vm, this.elseEl);
	      }
	      this.elseFrag = this.elseFactory.create(this._host, this._scope, this._frag);
	      this.elseFrag.before(this.anchor);
	    }
	  },
	
	  unbind: function unbind() {
	    if (this.frag) {
	      this.frag.destroy();
	    }
	    if (this.elseFrag) {
	      this.elseFrag.destroy();
	    }
	  }
	};
	
	var show = {
	
	  bind: function bind() {
	    // check else block
	    var next = this.el.nextElementSibling;
	    if (next && getAttr(next, 'v-else') !== null) {
	      this.elseEl = next;
	    }
	  },
	
	  update: function update(value) {
	    this.apply(this.el, value);
	    if (this.elseEl) {
	      this.apply(this.elseEl, !value);
	    }
	  },
	
	  apply: function apply(el, value) {
	    if (inDoc(el)) {
	      applyTransition(el, value ? 1 : -1, toggle, this.vm);
	    } else {
	      toggle();
	    }
	    function toggle() {
	      el.style.display = value ? '' : 'none';
	    }
	  }
	};
	
	var text$2 = {
	
	  bind: function bind() {
	    var self = this;
	    var el = this.el;
	    var isRange = el.type === 'range';
	    var lazy = this.params.lazy;
	    var number = this.params.number;
	    var debounce = this.params.debounce;
	
	    // handle composition events.
	    //   http://blog.evanyou.me/2014/01/03/composition-event/
	    // skip this for Android because it handles composition
	    // events quite differently. Android doesn't trigger
	    // composition events for language input methods e.g.
	    // Chinese, but instead triggers them for spelling
	    // suggestions... (see Discussion/#162)
	    var composing = false;
	    if (!isAndroid && !isRange) {
	      this.on('compositionstart', function () {
	        composing = true;
	      });
	      this.on('compositionend', function () {
	        composing = false;
	        // in IE11 the "compositionend" event fires AFTER
	        // the "input" event, so the input handler is blocked
	        // at the end... have to call it here.
	        //
	        // #1327: in lazy mode this is unecessary.
	        if (!lazy) {
	          self.listener();
	        }
	      });
	    }
	
	    // prevent messing with the input when user is typing,
	    // and force update on blur.
	    this.focused = false;
	    if (!isRange && !lazy) {
	      this.on('focus', function () {
	        self.focused = true;
	      });
	      this.on('blur', function () {
	        self.focused = false;
	        // do not sync value after fragment removal (#2017)
	        if (!self._frag || self._frag.inserted) {
	          self.rawListener();
	        }
	      });
	    }
	
	    // Now attach the main listener
	    this.listener = this.rawListener = function () {
	      if (composing || !self._bound) {
	        return;
	      }
	      var val = number || isRange ? toNumber(el.value) : el.value;
	      self.set(val);
	      // force update on next tick to avoid lock & same value
	      // also only update when user is not typing
	      nextTick(function () {
	        if (self._bound && !self.focused) {
	          self.update(self._watcher.value);
	        }
	      });
	    };
	
	    // apply debounce
	    if (debounce) {
	      this.listener = _debounce(this.listener, debounce);
	    }
	
	    // Support jQuery events, since jQuery.trigger() doesn't
	    // trigger native events in some cases and some plugins
	    // rely on $.trigger()
	    //
	    // We want to make sure if a listener is attached using
	    // jQuery, it is also removed with jQuery, that's why
	    // we do the check for each directive instance and
	    // store that check result on itself. This also allows
	    // easier test coverage control by unsetting the global
	    // jQuery variable in tests.
	    this.hasjQuery = typeof jQuery === 'function';
	    if (this.hasjQuery) {
	      var method = jQuery.fn.on ? 'on' : 'bind';
	      jQuery(el)[method]('change', this.rawListener);
	      if (!lazy) {
	        jQuery(el)[method]('input', this.listener);
	      }
	    } else {
	      this.on('change', this.rawListener);
	      if (!lazy) {
	        this.on('input', this.listener);
	      }
	    }
	
	    // IE9 doesn't fire input event on backspace/del/cut
	    if (!lazy && isIE9) {
	      this.on('cut', function () {
	        nextTick(self.listener);
	      });
	      this.on('keyup', function (e) {
	        if (e.keyCode === 46 || e.keyCode === 8) {
	          self.listener();
	        }
	      });
	    }
	
	    // set initial value if present
	    if (el.hasAttribute('value') || el.tagName === 'TEXTAREA' && el.value.trim()) {
	      this.afterBind = this.listener;
	    }
	  },
	
	  update: function update(value) {
	    // #3029 only update when the value changes. This prevent
	    // browsers from overwriting values like selectionStart
	    value = _toString(value);
	    if (value !== this.el.value) this.el.value = value;
	  },
	
	  unbind: function unbind() {
	    var el = this.el;
	    if (this.hasjQuery) {
	      var method = jQuery.fn.off ? 'off' : 'unbind';
	      jQuery(el)[method]('change', this.listener);
	      jQuery(el)[method]('input', this.listener);
	    }
	  }
	};
	
	var radio = {
	
	  bind: function bind() {
	    var self = this;
	    var el = this.el;
	
	    this.getValue = function () {
	      // value overwrite via v-bind:value
	      if (el.hasOwnProperty('_value')) {
	        return el._value;
	      }
	      var val = el.value;
	      if (self.params.number) {
	        val = toNumber(val);
	      }
	      return val;
	    };
	
	    this.listener = function () {
	      self.set(self.getValue());
	    };
	    this.on('change', this.listener);
	
	    if (el.hasAttribute('checked')) {
	      this.afterBind = this.listener;
	    }
	  },
	
	  update: function update(value) {
	    this.el.checked = looseEqual(value, this.getValue());
	  }
	};
	
	var select = {
	
	  bind: function bind() {
	    var _this = this;
	
	    var self = this;
	    var el = this.el;
	
	    // method to force update DOM using latest value.
	    this.forceUpdate = function () {
	      if (self._watcher) {
	        self.update(self._watcher.get());
	      }
	    };
	
	    // check if this is a multiple select
	    var multiple = this.multiple = el.hasAttribute('multiple');
	
	    // attach listener
	    this.listener = function () {
	      var value = getValue(el, multiple);
	      value = self.params.number ? isArray(value) ? value.map(toNumber) : toNumber(value) : value;
	      self.set(value);
	    };
	    this.on('change', this.listener);
	
	    // if has initial value, set afterBind
	    var initValue = getValue(el, multiple, true);
	    if (multiple && initValue.length || !multiple && initValue !== null) {
	      this.afterBind = this.listener;
	    }
	
	    // All major browsers except Firefox resets
	    // selectedIndex with value -1 to 0 when the element
	    // is appended to a new parent, therefore we have to
	    // force a DOM update whenever that happens...
	    this.vm.$on('hook:attached', function () {
	      nextTick(_this.forceUpdate);
	    });
	    if (!inDoc(el)) {
	      nextTick(this.forceUpdate);
	    }
	  },
	
	  update: function update(value) {
	    var el = this.el;
	    el.selectedIndex = -1;
	    var multi = this.multiple && isArray(value);
	    var options = el.options;
	    var i = options.length;
	    var op, val;
	    while (i--) {
	      op = options[i];
	      val = op.hasOwnProperty('_value') ? op._value : op.value;
	      /* eslint-disable eqeqeq */
	      op.selected = multi ? indexOf$1(value, val) > -1 : looseEqual(value, val);
	      /* eslint-enable eqeqeq */
	    }
	  },
	
	  unbind: function unbind() {
	    /* istanbul ignore next */
	    this.vm.$off('hook:attached', this.forceUpdate);
	  }
	};
	
	/**
	 * Get select value
	 *
	 * @param {SelectElement} el
	 * @param {Boolean} multi
	 * @param {Boolean} init
	 * @return {Array|*}
	 */
	
	function getValue(el, multi, init) {
	  var res = multi ? [] : null;
	  var op, val, selected;
	  for (var i = 0, l = el.options.length; i < l; i++) {
	    op = el.options[i];
	    selected = init ? op.hasAttribute('selected') : op.selected;
	    if (selected) {
	      val = op.hasOwnProperty('_value') ? op._value : op.value;
	      if (multi) {
	        res.push(val);
	      } else {
	        return val;
	      }
	    }
	  }
	  return res;
	}
	
	/**
	 * Native Array.indexOf uses strict equal, but in this
	 * case we need to match string/numbers with custom equal.
	 *
	 * @param {Array} arr
	 * @param {*} val
	 */
	
	function indexOf$1(arr, val) {
	  var i = arr.length;
	  while (i--) {
	    if (looseEqual(arr[i], val)) {
	      return i;
	    }
	  }
	  return -1;
	}
	
	var checkbox = {
	
	  bind: function bind() {
	    var self = this;
	    var el = this.el;
	
	    this.getValue = function () {
	      return el.hasOwnProperty('_value') ? el._value : self.params.number ? toNumber(el.value) : el.value;
	    };
	
	    function getBooleanValue() {
	      var val = el.checked;
	      if (val && el.hasOwnProperty('_trueValue')) {
	        return el._trueValue;
	      }
	      if (!val && el.hasOwnProperty('_falseValue')) {
	        return el._falseValue;
	      }
	      return val;
	    }
	
	    this.listener = function () {
	      var model = self._watcher.value;
	      if (isArray(model)) {
	        var val = self.getValue();
	        if (el.checked) {
	          if (indexOf(model, val) < 0) {
	            model.push(val);
	          }
	        } else {
	          model.$remove(val);
	        }
	      } else {
	        self.set(getBooleanValue());
	      }
	    };
	
	    this.on('change', this.listener);
	    if (el.hasAttribute('checked')) {
	      this.afterBind = this.listener;
	    }
	  },
	
	  update: function update(value) {
	    var el = this.el;
	    if (isArray(value)) {
	      el.checked = indexOf(value, this.getValue()) > -1;
	    } else {
	      if (el.hasOwnProperty('_trueValue')) {
	        el.checked = looseEqual(value, el._trueValue);
	      } else {
	        el.checked = !!value;
	      }
	    }
	  }
	};
	
	var handlers = {
	  text: text$2,
	  radio: radio,
	  select: select,
	  checkbox: checkbox
	};
	
	var model = {
	
	  priority: MODEL,
	  twoWay: true,
	  handlers: handlers,
	  params: ['lazy', 'number', 'debounce'],
	
	  /**
	   * Possible elements:
	   *   <select>
	   *   <textarea>
	   *   <input type="*">
	   *     - text
	   *     - checkbox
	   *     - radio
	   *     - number
	   */
	
	  bind: function bind() {
	    // friendly warning...
	    this.checkFilters();
	    if (this.hasRead && !this.hasWrite) {
	      process.env.NODE_ENV !== 'production' && warn('It seems you are using a read-only filter with ' + 'v-model="' + this.descriptor.raw + '". ' + 'You might want to use a two-way filter to ensure correct behavior.', this.vm);
	    }
	    var el = this.el;
	    var tag = el.tagName;
	    var handler;
	    if (tag === 'INPUT') {
	      handler = handlers[el.type] || handlers.text;
	    } else if (tag === 'SELECT') {
	      handler = handlers.select;
	    } else if (tag === 'TEXTAREA') {
	      handler = handlers.text;
	    } else {
	      process.env.NODE_ENV !== 'production' && warn('v-model does not support element type: ' + tag, this.vm);
	      return;
	    }
	    el.__v_model = this;
	    handler.bind.call(this);
	    this.update = handler.update;
	    this._unbind = handler.unbind;
	  },
	
	  /**
	   * Check read/write filter stats.
	   */
	
	  checkFilters: function checkFilters() {
	    var filters = this.filters;
	    if (!filters) return;
	    var i = filters.length;
	    while (i--) {
	      var filter = resolveAsset(this.vm.$options, 'filters', filters[i].name);
	      if (typeof filter === 'function' || filter.read) {
	        this.hasRead = true;
	      }
	      if (filter.write) {
	        this.hasWrite = true;
	      }
	    }
	  },
	
	  unbind: function unbind() {
	    this.el.__v_model = null;
	    this._unbind && this._unbind();
	  }
	};
	
	// keyCode aliases
	var keyCodes = {
	  esc: 27,
	  tab: 9,
	  enter: 13,
	  space: 32,
	  'delete': [8, 46],
	  up: 38,
	  left: 37,
	  right: 39,
	  down: 40
	};
	
	function keyFilter(handler, keys) {
	  var codes = keys.map(function (key) {
	    var charCode = key.charCodeAt(0);
	    if (charCode > 47 && charCode < 58) {
	      return parseInt(key, 10);
	    }
	    if (key.length === 1) {
	      charCode = key.toUpperCase().charCodeAt(0);
	      if (charCode > 64 && charCode < 91) {
	        return charCode;
	      }
	    }
	    return keyCodes[key];
	  });
	  codes = [].concat.apply([], codes);
	  return function keyHandler(e) {
	    if (codes.indexOf(e.keyCode) > -1) {
	      return handler.call(this, e);
	    }
	  };
	}
	
	function stopFilter(handler) {
	  return function stopHandler(e) {
	    e.stopPropagation();
	    return handler.call(this, e);
	  };
	}
	
	function preventFilter(handler) {
	  return function preventHandler(e) {
	    e.preventDefault();
	    return handler.call(this, e);
	  };
	}
	
	function selfFilter(handler) {
	  return function selfHandler(e) {
	    if (e.target === e.currentTarget) {
	      return handler.call(this, e);
	    }
	  };
	}
	
	var on$1 = {
	
	  priority: ON,
	  acceptStatement: true,
	  keyCodes: keyCodes,
	
	  bind: function bind() {
	    // deal with iframes
	    if (this.el.tagName === 'IFRAME' && this.arg !== 'load') {
	      var self = this;
	      this.iframeBind = function () {
	        on(self.el.contentWindow, self.arg, self.handler, self.modifiers.capture);
	      };
	      this.on('load', this.iframeBind);
	    }
	  },
	
	  update: function update(handler) {
	    // stub a noop for v-on with no value,
	    // e.g. @mousedown.prevent
	    if (!this.descriptor.raw) {
	      handler = function () {};
	    }
	
	    if (typeof handler !== 'function') {
	      process.env.NODE_ENV !== 'production' && warn('v-on:' + this.arg + '="' + this.expression + '" expects a function value, ' + 'got ' + handler, this.vm);
	      return;
	    }
	
	    // apply modifiers
	    if (this.modifiers.stop) {
	      handler = stopFilter(handler);
	    }
	    if (this.modifiers.prevent) {
	      handler = preventFilter(handler);
	    }
	    if (this.modifiers.self) {
	      handler = selfFilter(handler);
	    }
	    // key filter
	    var keys = Object.keys(this.modifiers).filter(function (key) {
	      return key !== 'stop' && key !== 'prevent' && key !== 'self' && key !== 'capture';
	    });
	    if (keys.length) {
	      handler = keyFilter(handler, keys);
	    }
	
	    this.reset();
	    this.handler = handler;
	
	    if (this.iframeBind) {
	      this.iframeBind();
	    } else {
	      on(this.el, this.arg, this.handler, this.modifiers.capture);
	    }
	  },
	
	  reset: function reset() {
	    var el = this.iframeBind ? this.el.contentWindow : this.el;
	    if (this.handler) {
	      off(el, this.arg, this.handler);
	    }
	  },
	
	  unbind: function unbind() {
	    this.reset();
	  }
	};
	
	var prefixes = ['-webkit-', '-moz-', '-ms-'];
	var camelPrefixes = ['Webkit', 'Moz', 'ms'];
	var importantRE = /!important;?$/;
	var propCache = Object.create(null);
	
	var testEl = null;
	
	var style = {
	
	  deep: true,
	
	  update: function update(value) {
	    if (typeof value === 'string') {
	      this.el.style.cssText = value;
	    } else if (isArray(value)) {
	      this.handleObject(value.reduce(extend, {}));
	    } else {
	      this.handleObject(value || {});
	    }
	  },
	
	  handleObject: function handleObject(value) {
	    // cache object styles so that only changed props
	    // are actually updated.
	    var cache = this.cache || (this.cache = {});
	    var name, val;
	    for (name in cache) {
	      if (!(name in value)) {
	        this.handleSingle(name, null);
	        delete cache[name];
	      }
	    }
	    for (name in value) {
	      val = value[name];
	      if (val !== cache[name]) {
	        cache[name] = val;
	        this.handleSingle(name, val);
	      }
	    }
	  },
	
	  handleSingle: function handleSingle(prop, value) {
	    prop = normalize(prop);
	    if (!prop) return; // unsupported prop
	    // cast possible numbers/booleans into strings
	    if (value != null) value += '';
	    if (value) {
	      var isImportant = importantRE.test(value) ? 'important' : '';
	      if (isImportant) {
	        /* istanbul ignore if */
	        if (process.env.NODE_ENV !== 'production') {
	          warn('It\'s probably a bad idea to use !important with inline rules. ' + 'This feature will be deprecated in a future version of Vue.');
	        }
	        value = value.replace(importantRE, '').trim();
	        this.el.style.setProperty(prop.kebab, value, isImportant);
	      } else {
	        this.el.style[prop.camel] = value;
	      }
	    } else {
	      this.el.style[prop.camel] = '';
	    }
	  }
	
	};
	
	/**
	 * Normalize a CSS property name.
	 * - cache result
	 * - auto prefix
	 * - camelCase -> dash-case
	 *
	 * @param {String} prop
	 * @return {String}
	 */
	
	function normalize(prop) {
	  if (propCache[prop]) {
	    return propCache[prop];
	  }
	  var res = prefix(prop);
	  propCache[prop] = propCache[res] = res;
	  return res;
	}
	
	/**
	 * Auto detect the appropriate prefix for a CSS property.
	 * https://gist.github.com/paulirish/523692
	 *
	 * @param {String} prop
	 * @return {String}
	 */
	
	function prefix(prop) {
	  prop = hyphenate(prop);
	  var camel = camelize(prop);
	  var upper = camel.charAt(0).toUpperCase() + camel.slice(1);
	  if (!testEl) {
	    testEl = document.createElement('div');
	  }
	  var i = prefixes.length;
	  var prefixed;
	  if (camel !== 'filter' && camel in testEl.style) {
	    return {
	      kebab: prop,
	      camel: camel
	    };
	  }
	  while (i--) {
	    prefixed = camelPrefixes[i] + upper;
	    if (prefixed in testEl.style) {
	      return {
	        kebab: prefixes[i] + prop,
	        camel: prefixed
	      };
	    }
	  }
	}
	
	// xlink
	var xlinkNS = 'http://www.w3.org/1999/xlink';
	var xlinkRE = /^xlink:/;
	
	// check for attributes that prohibit interpolations
	var disallowedInterpAttrRE = /^v-|^:|^@|^(?:is|transition|transition-mode|debounce|track-by|stagger|enter-stagger|leave-stagger)$/;
	// these attributes should also set their corresponding properties
	// because they only affect the initial state of the element
	var attrWithPropsRE = /^(?:value|checked|selected|muted)$/;
	// these attributes expect enumrated values of "true" or "false"
	// but are not boolean attributes
	var enumeratedAttrRE = /^(?:draggable|contenteditable|spellcheck)$/;
	
	// these attributes should set a hidden property for
	// binding v-model to object values
	var modelProps = {
	  value: '_value',
	  'true-value': '_trueValue',
	  'false-value': '_falseValue'
	};
	
	var bind$1 = {
	
	  priority: BIND,
	
	  bind: function bind() {
	    var attr = this.arg;
	    var tag = this.el.tagName;
	    // should be deep watch on object mode
	    if (!attr) {
	      this.deep = true;
	    }
	    // handle interpolation bindings
	    var descriptor = this.descriptor;
	    var tokens = descriptor.interp;
	    if (tokens) {
	      // handle interpolations with one-time tokens
	      if (descriptor.hasOneTime) {
	        this.expression = tokensToExp(tokens, this._scope || this.vm);
	      }
	
	      // only allow binding on native attributes
	      if (disallowedInterpAttrRE.test(attr) || attr === 'name' && (tag === 'PARTIAL' || tag === 'SLOT')) {
	        process.env.NODE_ENV !== 'production' && warn(attr + '="' + descriptor.raw + '": ' + 'attribute interpolation is not allowed in Vue.js ' + 'directives and special attributes.', this.vm);
	        this.el.removeAttribute(attr);
	        this.invalid = true;
	      }
	
	      /* istanbul ignore if */
	      if (process.env.NODE_ENV !== 'production') {
	        var raw = attr + '="' + descriptor.raw + '": ';
	        // warn src
	        if (attr === 'src') {
	          warn(raw + 'interpolation in "src" attribute will cause ' + 'a 404 request. Use v-bind:src instead.', this.vm);
	        }
	
	        // warn style
	        if (attr === 'style') {
	          warn(raw + 'interpolation in "style" attribute will cause ' + 'the attribute to be discarded in Internet Explorer. ' + 'Use v-bind:style instead.', this.vm);
	        }
	      }
	    }
	  },
	
	  update: function update(value) {
	    if (this.invalid) {
	      return;
	    }
	    var attr = this.arg;
	    if (this.arg) {
	      this.handleSingle(attr, value);
	    } else {
	      this.handleObject(value || {});
	    }
	  },
	
	  // share object handler with v-bind:class
	  handleObject: style.handleObject,
	
	  handleSingle: function handleSingle(attr, value) {
	    var el = this.el;
	    var interp = this.descriptor.interp;
	    if (this.modifiers.camel) {
	      attr = camelize(attr);
	    }
	    if (!interp && attrWithPropsRE.test(attr) && attr in el) {
	      var attrValue = attr === 'value' ? value == null // IE9 will set input.value to "null" for null...
	      ? '' : value : value;
	
	      if (el[attr] !== attrValue) {
	        el[attr] = attrValue;
	      }
	    }
	    // set model props
	    var modelProp = modelProps[attr];
	    if (!interp && modelProp) {
	      el[modelProp] = value;
	      // update v-model if present
	      var model = el.__v_model;
	      if (model) {
	        model.listener();
	      }
	    }
	    // do not set value attribute for textarea
	    if (attr === 'value' && el.tagName === 'TEXTAREA') {
	      el.removeAttribute(attr);
	      return;
	    }
	    // update attribute
	    if (enumeratedAttrRE.test(attr)) {
	      el.setAttribute(attr, value ? 'true' : 'false');
	    } else if (value != null && value !== false) {
	      if (attr === 'class') {
	        // handle edge case #1960:
	        // class interpolation should not overwrite Vue transition class
	        if (el.__v_trans) {
	          value += ' ' + el.__v_trans.id + '-transition';
	        }
	        setClass(el, value);
	      } else if (xlinkRE.test(attr)) {
	        el.setAttributeNS(xlinkNS, attr, value === true ? '' : value);
	      } else {
	        el.setAttribute(attr, value === true ? '' : value);
	      }
	    } else {
	      el.removeAttribute(attr);
	    }
	  }
	};
	
	var el = {
	
	  priority: EL,
	
	  bind: function bind() {
	    /* istanbul ignore if */
	    if (!this.arg) {
	      return;
	    }
	    var id = this.id = camelize(this.arg);
	    var refs = (this._scope || this.vm).$els;
	    if (hasOwn(refs, id)) {
	      refs[id] = this.el;
	    } else {
	      defineReactive(refs, id, this.el);
	    }
	  },
	
	  unbind: function unbind() {
	    var refs = (this._scope || this.vm).$els;
	    if (refs[this.id] === this.el) {
	      refs[this.id] = null;
	    }
	  }
	};
	
	var ref = {
	  bind: function bind() {
	    process.env.NODE_ENV !== 'production' && warn('v-ref:' + this.arg + ' must be used on a child ' + 'component. Found on <' + this.el.tagName.toLowerCase() + '>.', this.vm);
	  }
	};
	
	var cloak = {
	  bind: function bind() {
	    var el = this.el;
	    this.vm.$once('pre-hook:compiled', function () {
	      el.removeAttribute('v-cloak');
	    });
	  }
	};
	
	// must export plain object
	var directives = {
	  text: text$1,
	  html: html,
	  'for': vFor,
	  'if': vIf,
	  show: show,
	  model: model,
	  on: on$1,
	  bind: bind$1,
	  el: el,
	  ref: ref,
	  cloak: cloak
	};
	
	var vClass = {
	
	  deep: true,
	
	  update: function update(value) {
	    if (!value) {
	      this.cleanup();
	    } else if (typeof value === 'string') {
	      this.setClass(value.trim().split(/\s+/));
	    } else {
	      this.setClass(normalize$1(value));
	    }
	  },
	
	  setClass: function setClass(value) {
	    this.cleanup(value);
	    for (var i = 0, l = value.length; i < l; i++) {
	      var val = value[i];
	      if (val) {
	        apply(this.el, val, addClass);
	      }
	    }
	    this.prevKeys = value;
	  },
	
	  cleanup: function cleanup(value) {
	    var prevKeys = this.prevKeys;
	    if (!prevKeys) return;
	    var i = prevKeys.length;
	    while (i--) {
	      var key = prevKeys[i];
	      if (!value || value.indexOf(key) < 0) {
	        apply(this.el, key, removeClass);
	      }
	    }
	  }
	};
	
	/**
	 * Normalize objects and arrays (potentially containing objects)
	 * into array of strings.
	 *
	 * @param {Object|Array<String|Object>} value
	 * @return {Array<String>}
	 */
	
	function normalize$1(value) {
	  var res = [];
	  if (isArray(value)) {
	    for (var i = 0, l = value.length; i < l; i++) {
	      var _key = value[i];
	      if (_key) {
	        if (typeof _key === 'string') {
	          res.push(_key);
	        } else {
	          for (var k in _key) {
	            if (_key[k]) res.push(k);
	          }
	        }
	      }
	    }
	  } else if (isObject(value)) {
	    for (var key in value) {
	      if (value[key]) res.push(key);
	    }
	  }
	  return res;
	}
	
	/**
	 * Add or remove a class/classes on an element
	 *
	 * @param {Element} el
	 * @param {String} key The class name. This may or may not
	 *                     contain a space character, in such a
	 *                     case we'll deal with multiple class
	 *                     names at once.
	 * @param {Function} fn
	 */
	
	function apply(el, key, fn) {
	  key = key.trim();
	  if (key.indexOf(' ') === -1) {
	    fn(el, key);
	    return;
	  }
	  // The key contains one or more space characters.
	  // Since a class name doesn't accept such characters, we
	  // treat it as multiple classes.
	  var keys = key.split(/\s+/);
	  for (var i = 0, l = keys.length; i < l; i++) {
	    fn(el, keys[i]);
	  }
	}
	
	var component = {
	
	  priority: COMPONENT,
	
	  params: ['keep-alive', 'transition-mode', 'inline-template'],
	
	  /**
	   * Setup. Two possible usages:
	   *
	   * - static:
	   *   <comp> or <div v-component="comp">
	   *
	   * - dynamic:
	   *   <component :is="view">
	   */
	
	  bind: function bind() {
	    if (!this.el.__vue__) {
	      // keep-alive cache
	      this.keepAlive = this.params.keepAlive;
	      if (this.keepAlive) {
	        this.cache = {};
	      }
	      // check inline-template
	      if (this.params.inlineTemplate) {
	        // extract inline template as a DocumentFragment
	        this.inlineTemplate = extractContent(this.el, true);
	      }
	      // component resolution related state
	      this.pendingComponentCb = this.Component = null;
	      // transition related state
	      this.pendingRemovals = 0;
	      this.pendingRemovalCb = null;
	      // create a ref anchor
	      this.anchor = createAnchor('v-component');
	      replace(this.el, this.anchor);
	      // remove is attribute.
	      // this is removed during compilation, but because compilation is
	      // cached, when the component is used elsewhere this attribute
	      // will remain at link time.
	      this.el.removeAttribute('is');
	      this.el.removeAttribute(':is');
	      // remove ref, same as above
	      if (this.descriptor.ref) {
	        this.el.removeAttribute('v-ref:' + hyphenate(this.descriptor.ref));
	      }
	      // if static, build right now.
	      if (this.literal) {
	        this.setComponent(this.expression);
	      }
	    } else {
	      process.env.NODE_ENV !== 'production' && warn('cannot mount component "' + this.expression + '" ' + 'on already mounted element: ' + this.el);
	    }
	  },
	
	  /**
	   * Public update, called by the watcher in the dynamic
	   * literal scenario, e.g. <component :is="view">
	   */
	
	  update: function update(value) {
	    if (!this.literal) {
	      this.setComponent(value);
	    }
	  },
	
	  /**
	   * Switch dynamic components. May resolve the component
	   * asynchronously, and perform transition based on
	   * specified transition mode. Accepts a few additional
	   * arguments specifically for vue-router.
	   *
	   * The callback is called when the full transition is
	   * finished.
	   *
	   * @param {String} value
	   * @param {Function} [cb]
	   */
	
	  setComponent: function setComponent(value, cb) {
	    this.invalidatePending();
	    if (!value) {
	      // just remove current
	      this.unbuild(true);
	      this.remove(this.childVM, cb);
	      this.childVM = null;
	    } else {
	      var self = this;
	      this.resolveComponent(value, function () {
	        self.mountComponent(cb);
	      });
	    }
	  },
	
	  /**
	   * Resolve the component constructor to use when creating
	   * the child vm.
	   *
	   * @param {String|Function} value
	   * @param {Function} cb
	   */
	
	  resolveComponent: function resolveComponent(value, cb) {
	    var self = this;
	    this.pendingComponentCb = cancellable(function (Component) {
	      self.ComponentName = Component.options.name || (typeof value === 'string' ? value : null);
	      self.Component = Component;
	      cb();
	    });
	    this.vm._resolveComponent(value, this.pendingComponentCb);
	  },
	
	  /**
	   * Create a new instance using the current constructor and
	   * replace the existing instance. This method doesn't care
	   * whether the new component and the old one are actually
	   * the same.
	   *
	   * @param {Function} [cb]
	   */
	
	  mountComponent: function mountComponent(cb) {
	    // actual mount
	    this.unbuild(true);
	    var self = this;
	    var activateHooks = this.Component.options.activate;
	    var cached = this.getCached();
	    var newComponent = this.build();
	    if (activateHooks && !cached) {
	      this.waitingFor = newComponent;
	      callActivateHooks(activateHooks, newComponent, function () {
	        if (self.waitingFor !== newComponent) {
	          return;
	        }
	        self.waitingFor = null;
	        self.transition(newComponent, cb);
	      });
	    } else {
	      // update ref for kept-alive component
	      if (cached) {
	        newComponent._updateRef();
	      }
	      this.transition(newComponent, cb);
	    }
	  },
	
	  /**
	   * When the component changes or unbinds before an async
	   * constructor is resolved, we need to invalidate its
	   * pending callback.
	   */
	
	  invalidatePending: function invalidatePending() {
	    if (this.pendingComponentCb) {
	      this.pendingComponentCb.cancel();
	      this.pendingComponentCb = null;
	    }
	  },
	
	  /**
	   * Instantiate/insert a new child vm.
	   * If keep alive and has cached instance, insert that
	   * instance; otherwise build a new one and cache it.
	   *
	   * @param {Object} [extraOptions]
	   * @return {Vue} - the created instance
	   */
	
	  build: function build(extraOptions) {
	    var cached = this.getCached();
	    if (cached) {
	      return cached;
	    }
	    if (this.Component) {
	      // default options
	      var options = {
	        name: this.ComponentName,
	        el: cloneNode(this.el),
	        template: this.inlineTemplate,
	        // make sure to add the child with correct parent
	        // if this is a transcluded component, its parent
	        // should be the transclusion host.
	        parent: this._host || this.vm,
	        // if no inline-template, then the compiled
	        // linker can be cached for better performance.
	        _linkerCachable: !this.inlineTemplate,
	        _ref: this.descriptor.ref,
	        _asComponent: true,
	        _isRouterView: this._isRouterView,
	        // if this is a transcluded component, context
	        // will be the common parent vm of this instance
	        // and its host.
	        _context: this.vm,
	        // if this is inside an inline v-for, the scope
	        // will be the intermediate scope created for this
	        // repeat fragment. this is used for linking props
	        // and container directives.
	        _scope: this._scope,
	        // pass in the owner fragment of this component.
	        // this is necessary so that the fragment can keep
	        // track of its contained components in order to
	        // call attach/detach hooks for them.
	        _frag: this._frag
	      };
	      // extra options
	      // in 1.0.0 this is used by vue-router only
	      /* istanbul ignore if */
	      if (extraOptions) {
	        extend(options, extraOptions);
	      }
	      var child = new this.Component(options);
	      if (this.keepAlive) {
	        this.cache[this.Component.cid] = child;
	      }
	      /* istanbul ignore if */
	      if (process.env.NODE_ENV !== 'production' && this.el.hasAttribute('transition') && child._isFragment) {
	        warn('Transitions will not work on a fragment instance. ' + 'Template: ' + child.$options.template, child);
	      }
	      return child;
	    }
	  },
	
	  /**
	   * Try to get a cached instance of the current component.
	   *
	   * @return {Vue|undefined}
	   */
	
	  getCached: function getCached() {
	    return this.keepAlive && this.cache[this.Component.cid];
	  },
	
	  /**
	   * Teardown the current child, but defers cleanup so
	   * that we can separate the destroy and removal steps.
	   *
	   * @param {Boolean} defer
	   */
	
	  unbuild: function unbuild(defer) {
	    if (this.waitingFor) {
	      if (!this.keepAlive) {
	        this.waitingFor.$destroy();
	      }
	      this.waitingFor = null;
	    }
	    var child = this.childVM;
	    if (!child || this.keepAlive) {
	      if (child) {
	        // remove ref
	        child._inactive = true;
	        child._updateRef(true);
	      }
	      return;
	    }
	    // the sole purpose of `deferCleanup` is so that we can
	    // "deactivate" the vm right now and perform DOM removal
	    // later.
	    child.$destroy(false, defer);
	  },
	
	  /**
	   * Remove current destroyed child and manually do
	   * the cleanup after removal.
	   *
	   * @param {Function} cb
	   */
	
	  remove: function remove(child, cb) {
	    var keepAlive = this.keepAlive;
	    if (child) {
	      // we may have a component switch when a previous
	      // component is still being transitioned out.
	      // we want to trigger only one lastest insertion cb
	      // when the existing transition finishes. (#1119)
	      this.pendingRemovals++;
	      this.pendingRemovalCb = cb;
	      var self = this;
	      child.$remove(function () {
	        self.pendingRemovals--;
	        if (!keepAlive) child._cleanup();
	        if (!self.pendingRemovals && self.pendingRemovalCb) {
	          self.pendingRemovalCb();
	          self.pendingRemovalCb = null;
	        }
	      });
	    } else if (cb) {
	      cb();
	    }
	  },
	
	  /**
	   * Actually swap the components, depending on the
	   * transition mode. Defaults to simultaneous.
	   *
	   * @param {Vue} target
	   * @param {Function} [cb]
	   */
	
	  transition: function transition(target, cb) {
	    var self = this;
	    var current = this.childVM;
	    // for devtool inspection
	    if (current) current._inactive = true;
	    target._inactive = false;
	    this.childVM = target;
	    switch (self.params.transitionMode) {
	      case 'in-out':
	        target.$before(self.anchor, function () {
	          self.remove(current, cb);
	        });
	        break;
	      case 'out-in':
	        self.remove(current, function () {
	          target.$before(self.anchor, cb);
	        });
	        break;
	      default:
	        self.remove(current);
	        target.$before(self.anchor, cb);
	    }
	  },
	
	  /**
	   * Unbind.
	   */
	
	  unbind: function unbind() {
	    this.invalidatePending();
	    // Do not defer cleanup when unbinding
	    this.unbuild();
	    // destroy all keep-alive cached instances
	    if (this.cache) {
	      for (var key in this.cache) {
	        this.cache[key].$destroy();
	      }
	      this.cache = null;
	    }
	  }
	};
	
	/**
	 * Call activate hooks in order (asynchronous)
	 *
	 * @param {Array} hooks
	 * @param {Vue} vm
	 * @param {Function} cb
	 */
	
	function callActivateHooks(hooks, vm, cb) {
	  var total = hooks.length;
	  var called = 0;
	  hooks[0].call(vm, next);
	  function next() {
	    if (++called >= total) {
	      cb();
	    } else {
	      hooks[called].call(vm, next);
	    }
	  }
	}
	
	var propBindingModes = config._propBindingModes;
	var empty = {};
	
	// regexes
	var identRE$1 = /^[$_a-zA-Z]+[\w$]*$/;
	var settablePathRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\[[^\[\]]+\])*$/;
	
	/**
	 * Compile props on a root element and return
	 * a props link function.
	 *
	 * @param {Element|DocumentFragment} el
	 * @param {Array} propOptions
	 * @param {Vue} vm
	 * @return {Function} propsLinkFn
	 */
	
	function compileProps(el, propOptions, vm) {
	  var props = [];
	  var names = Object.keys(propOptions);
	  var i = names.length;
	  var options, name, attr, value, path, parsed, prop;
	  while (i--) {
	    name = names[i];
	    options = propOptions[name] || empty;
	
	    if (process.env.NODE_ENV !== 'production' && name === '$data') {
	      warn('Do not use $data as prop.', vm);
	      continue;
	    }
	
	    // props could contain dashes, which will be
	    // interpreted as minus calculations by the parser
	    // so we need to camelize the path here
	    path = camelize(name);
	    if (!identRE$1.test(path)) {
	      process.env.NODE_ENV !== 'production' && warn('Invalid prop key: "' + name + '". Prop keys ' + 'must be valid identifiers.', vm);
	      continue;
	    }
	
	    prop = {
	      name: name,
	      path: path,
	      options: options,
	      mode: propBindingModes.ONE_WAY,
	      raw: null
	    };
	
	    attr = hyphenate(name);
	    // first check dynamic version
	    if ((value = getBindAttr(el, attr)) === null) {
	      if ((value = getBindAttr(el, attr + '.sync')) !== null) {
	        prop.mode = propBindingModes.TWO_WAY;
	      } else if ((value = getBindAttr(el, attr + '.once')) !== null) {
	        prop.mode = propBindingModes.ONE_TIME;
	      }
	    }
	    if (value !== null) {
	      // has dynamic binding!
	      prop.raw = value;
	      parsed = parseDirective(value);
	      value = parsed.expression;
	      prop.filters = parsed.filters;
	      // check binding type
	      if (isLiteral(value) && !parsed.filters) {
	        // for expressions containing literal numbers and
	        // booleans, there's no need to setup a prop binding,
	        // so we can optimize them as a one-time set.
	        prop.optimizedLiteral = true;
	      } else {
	        prop.dynamic = true;
	        // check non-settable path for two-way bindings
	        if (process.env.NODE_ENV !== 'production' && prop.mode === propBindingModes.TWO_WAY && !settablePathRE.test(value)) {
	          prop.mode = propBindingModes.ONE_WAY;
	          warn('Cannot bind two-way prop with non-settable ' + 'parent path: ' + value, vm);
	        }
	      }
	      prop.parentPath = value;
	
	      // warn required two-way
	      if (process.env.NODE_ENV !== 'production' && options.twoWay && prop.mode !== propBindingModes.TWO_WAY) {
	        warn('Prop "' + name + '" expects a two-way binding type.', vm);
	      }
	    } else if ((value = getAttr(el, attr)) !== null) {
	      // has literal binding!
	      prop.raw = value;
	    } else if (process.env.NODE_ENV !== 'production') {
	      // check possible camelCase prop usage
	      var lowerCaseName = path.toLowerCase();
	      value = /[A-Z\-]/.test(name) && (el.getAttribute(lowerCaseName) || el.getAttribute(':' + lowerCaseName) || el.getAttribute('v-bind:' + lowerCaseName) || el.getAttribute(':' + lowerCaseName + '.once') || el.getAttribute('v-bind:' + lowerCaseName + '.once') || el.getAttribute(':' + lowerCaseName + '.sync') || el.getAttribute('v-bind:' + lowerCaseName + '.sync'));
	      if (value) {
	        warn('Possible usage error for prop `' + lowerCaseName + '` - ' + 'did you mean `' + attr + '`? HTML is case-insensitive, remember to use ' + 'kebab-case for props in templates.', vm);
	      } else if (options.required) {
	        // warn missing required
	        warn('Missing required prop: ' + name, vm);
	      }
	    }
	    // push prop
	    props.push(prop);
	  }
	  return makePropsLinkFn(props);
	}
	
	/**
	 * Build a function that applies props to a vm.
	 *
	 * @param {Array} props
	 * @return {Function} propsLinkFn
	 */
	
	function makePropsLinkFn(props) {
	  return function propsLinkFn(vm, scope) {
	    // store resolved props info
	    vm._props = {};
	    var inlineProps = vm.$options.propsData;
	    var i = props.length;
	    var prop, path, options, value, raw;
	    while (i--) {
	      prop = props[i];
	      raw = prop.raw;
	      path = prop.path;
	      options = prop.options;
	      vm._props[path] = prop;
	      if (inlineProps && hasOwn(inlineProps, path)) {
	        initProp(vm, prop, inlineProps[path]);
	      }if (raw === null) {
	        // initialize absent prop
	        initProp(vm, prop, undefined);
	      } else if (prop.dynamic) {
	        // dynamic prop
	        if (prop.mode === propBindingModes.ONE_TIME) {
	          // one time binding
	          value = (scope || vm._context || vm).$get(prop.parentPath);
	          initProp(vm, prop, value);
	        } else {
	          if (vm._context) {
	            // dynamic binding
	            vm._bindDir({
	              name: 'prop',
	              def: propDef,
	              prop: prop
	            }, null, null, scope); // el, host, scope
	          } else {
	              // root instance
	              initProp(vm, prop, vm.$get(prop.parentPath));
	            }
	        }
	      } else if (prop.optimizedLiteral) {
	        // optimized literal, cast it and just set once
	        var stripped = stripQuotes(raw);
	        value = stripped === raw ? toBoolean(toNumber(raw)) : stripped;
	        initProp(vm, prop, value);
	      } else {
	        // string literal, but we need to cater for
	        // Boolean props with no value, or with same
	        // literal value (e.g. disabled="disabled")
	        // see https://github.com/vuejs/vue-loader/issues/182
	        value = options.type === Boolean && (raw === '' || raw === hyphenate(prop.name)) ? true : raw;
	        initProp(vm, prop, value);
	      }
	    }
	  };
	}
	
	/**
	 * Process a prop with a rawValue, applying necessary coersions,
	 * default values & assertions and call the given callback with
	 * processed value.
	 *
	 * @param {Vue} vm
	 * @param {Object} prop
	 * @param {*} rawValue
	 * @param {Function} fn
	 */
	
	function processPropValue(vm, prop, rawValue, fn) {
	  var isSimple = prop.dynamic && isSimplePath(prop.parentPath);
	  var value = rawValue;
	  if (value === undefined) {
	    value = getPropDefaultValue(vm, prop);
	  }
	  value = coerceProp(prop, value, vm);
	  var coerced = value !== rawValue;
	  if (!assertProp(prop, value, vm)) {
	    value = undefined;
	  }
	  if (isSimple && !coerced) {
	    withoutConversion(function () {
	      fn(value);
	    });
	  } else {
	    fn(value);
	  }
	}
	
	/**
	 * Set a prop's initial value on a vm and its data object.
	 *
	 * @param {Vue} vm
	 * @param {Object} prop
	 * @param {*} value
	 */
	
	function initProp(vm, prop, value) {
	  processPropValue(vm, prop, value, function (value) {
	    defineReactive(vm, prop.path, value);
	  });
	}
	
	/**
	 * Update a prop's value on a vm.
	 *
	 * @param {Vue} vm
	 * @param {Object} prop
	 * @param {*} value
	 */
	
	function updateProp(vm, prop, value) {
	  processPropValue(vm, prop, value, function (value) {
	    vm[prop.path] = value;
	  });
	}
	
	/**
	 * Get the default value of a prop.
	 *
	 * @param {Vue} vm
	 * @param {Object} prop
	 * @return {*}
	 */
	
	function getPropDefaultValue(vm, prop) {
	  // no default, return undefined
	  var options = prop.options;
	  if (!hasOwn(options, 'default')) {
	    // absent boolean value defaults to false
	    return options.type === Boolean ? false : undefined;
	  }
	  var def = options['default'];
	  // warn against non-factory defaults for Object & Array
	  if (isObject(def)) {
	    process.env.NODE_ENV !== 'production' && warn('Invalid default value for prop "' + prop.name + '": ' + 'Props with type Object/Array must use a factory function ' + 'to return the default value.', vm);
	  }
	  // call factory function for non-Function types
	  return typeof def === 'function' && options.type !== Function ? def.call(vm) : def;
	}
	
	/**
	 * Assert whether a prop is valid.
	 *
	 * @param {Object} prop
	 * @param {*} value
	 * @param {Vue} vm
	 */
	
	function assertProp(prop, value, vm) {
	  if (!prop.options.required && ( // non-required
	  prop.raw === null || // abscent
	  value == null) // null or undefined
	  ) {
	      return true;
	    }
	  var options = prop.options;
	  var type = options.type;
	  var valid = !type;
	  var expectedTypes = [];
	  if (type) {
	    if (!isArray(type)) {
	      type = [type];
	    }
	    for (var i = 0; i < type.length && !valid; i++) {
	      var assertedType = assertType(value, type[i]);
	      expectedTypes.push(assertedType.expectedType);
	      valid = assertedType.valid;
	    }
	  }
	  if (!valid) {
	    if (process.env.NODE_ENV !== 'production') {
	      warn('Invalid prop: type check failed for prop "' + prop.name + '".' + ' Expected ' + expectedTypes.map(formatType).join(', ') + ', got ' + formatValue(value) + '.', vm);
	    }
	    return false;
	  }
	  var validator = options.validator;
	  if (validator) {
	    if (!validator(value)) {
	      process.env.NODE_ENV !== 'production' && warn('Invalid prop: custom validator check failed for prop "' + prop.name + '".', vm);
	      return false;
	    }
	  }
	  return true;
	}
	
	/**
	 * Force parsing value with coerce option.
	 *
	 * @param {*} value
	 * @param {Object} options
	 * @return {*}
	 */
	
	function coerceProp(prop, value, vm) {
	  var coerce = prop.options.coerce;
	  if (!coerce) {
	    return value;
	  }
	  if (typeof coerce === 'function') {
	    return coerce(value);
	  } else {
	    process.env.NODE_ENV !== 'production' && warn('Invalid coerce for prop "' + prop.name + '": expected function, got ' + typeof coerce + '.', vm);
	    return value;
	  }
	}
	
	/**
	 * Assert the type of a value
	 *
	 * @param {*} value
	 * @param {Function} type
	 * @return {Object}
	 */
	
	function assertType(value, type) {
	  var valid;
	  var expectedType;
	  if (type === String) {
	    expectedType = 'string';
	    valid = typeof value === expectedType;
	  } else if (type === Number) {
	    expectedType = 'number';
	    valid = typeof value === expectedType;
	  } else if (type === Boolean) {
	    expectedType = 'boolean';
	    valid = typeof value === expectedType;
	  } else if (type === Function) {
	    expectedType = 'function';
	    valid = typeof value === expectedType;
	  } else if (type === Object) {
	    expectedType = 'object';
	    valid = isPlainObject(value);
	  } else if (type === Array) {
	    expectedType = 'array';
	    valid = isArray(value);
	  } else {
	    valid = value instanceof type;
	  }
	  return {
	    valid: valid,
	    expectedType: expectedType
	  };
	}
	
	/**
	 * Format type for output
	 *
	 * @param {String} type
	 * @return {String}
	 */
	
	function formatType(type) {
	  return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'custom type';
	}
	
	/**
	 * Format value
	 *
	 * @param {*} value
	 * @return {String}
	 */
	
	function formatValue(val) {
	  return Object.prototype.toString.call(val).slice(8, -1);
	}
	
	var bindingModes = config._propBindingModes;
	
	var propDef = {
	
	  bind: function bind() {
	    var child = this.vm;
	    var parent = child._context;
	    // passed in from compiler directly
	    var prop = this.descriptor.prop;
	    var childKey = prop.path;
	    var parentKey = prop.parentPath;
	    var twoWay = prop.mode === bindingModes.TWO_WAY;
	
	    var parentWatcher = this.parentWatcher = new Watcher(parent, parentKey, function (val) {
	      updateProp(child, prop, val);
	    }, {
	      twoWay: twoWay,
	      filters: prop.filters,
	      // important: props need to be observed on the
	      // v-for scope if present
	      scope: this._scope
	    });
	
	    // set the child initial value.
	    initProp(child, prop, parentWatcher.value);
	
	    // setup two-way binding
	    if (twoWay) {
	      // important: defer the child watcher creation until
	      // the created hook (after data observation)
	      var self = this;
	      child.$once('pre-hook:created', function () {
	        self.childWatcher = new Watcher(child, childKey, function (val) {
	          parentWatcher.set(val);
	        }, {
	          // ensure sync upward before parent sync down.
	          // this is necessary in cases e.g. the child
	          // mutates a prop array, then replaces it. (#1683)
	          sync: true
	        });
	      });
	    }
	  },
	
	  unbind: function unbind() {
	    this.parentWatcher.teardown();
	    if (this.childWatcher) {
	      this.childWatcher.teardown();
	    }
	  }
	};
	
	var queue$1 = [];
	var queued = false;
	
	/**
	 * Push a job into the queue.
	 *
	 * @param {Function} job
	 */
	
	function pushJob(job) {
	  queue$1.push(job);
	  if (!queued) {
	    queued = true;
	    nextTick(flush);
	  }
	}
	
	/**
	 * Flush the queue, and do one forced reflow before
	 * triggering transitions.
	 */
	
	function flush() {
	  // Force layout
	  var f = document.documentElement.offsetHeight;
	  for (var i = 0; i < queue$1.length; i++) {
	    queue$1[i]();
	  }
	  queue$1 = [];
	  queued = false;
	  // dummy return, so js linters don't complain about
	  // unused variable f
	  return f;
	}
	
	var TYPE_TRANSITION = 'transition';
	var TYPE_ANIMATION = 'animation';
	var transDurationProp = transitionProp + 'Duration';
	var animDurationProp = animationProp + 'Duration';
	
	/**
	 * If a just-entered element is applied the
	 * leave class while its enter transition hasn't started yet,
	 * and the transitioned property has the same value for both
	 * enter/leave, then the leave transition will be skipped and
	 * the transitionend event never fires. This function ensures
	 * its callback to be called after a transition has started
	 * by waiting for double raf.
	 *
	 * It falls back to setTimeout on devices that support CSS
	 * transitions but not raf (e.g. Android 4.2 browser) - since
	 * these environments are usually slow, we are giving it a
	 * relatively large timeout.
	 */
	
	var raf = inBrowser && window.requestAnimationFrame;
	var waitForTransitionStart = raf
	/* istanbul ignore next */
	? function (fn) {
	  raf(function () {
	    raf(fn);
	  });
	} : function (fn) {
	  setTimeout(fn, 50);
	};
	
	/**
	 * A Transition object that encapsulates the state and logic
	 * of the transition.
	 *
	 * @param {Element} el
	 * @param {String} id
	 * @param {Object} hooks
	 * @param {Vue} vm
	 */
	function Transition(el, id, hooks, vm) {
	  this.id = id;
	  this.el = el;
	  this.enterClass = hooks && hooks.enterClass || id + '-enter';
	  this.leaveClass = hooks && hooks.leaveClass || id + '-leave';
	  this.hooks = hooks;
	  this.vm = vm;
	  // async state
	  this.pendingCssEvent = this.pendingCssCb = this.cancel = this.pendingJsCb = this.op = this.cb = null;
	  this.justEntered = false;
	  this.entered = this.left = false;
	  this.typeCache = {};
	  // check css transition type
	  this.type = hooks && hooks.type;
	  /* istanbul ignore if */
	  if (process.env.NODE_ENV !== 'production') {
	    if (this.type && this.type !== TYPE_TRANSITION && this.type !== TYPE_ANIMATION) {
	      warn('invalid CSS transition type for transition="' + this.id + '": ' + this.type, vm);
	    }
	  }
	  // bind
	  var self = this;['enterNextTick', 'enterDone', 'leaveNextTick', 'leaveDone'].forEach(function (m) {
	    self[m] = bind(self[m], self);
	  });
	}
	
	var p$1 = Transition.prototype;
	
	/**
	 * Start an entering transition.
	 *
	 * 1. enter transition triggered
	 * 2. call beforeEnter hook
	 * 3. add enter class
	 * 4. insert/show element
	 * 5. call enter hook (with possible explicit js callback)
	 * 6. reflow
	 * 7. based on transition type:
	 *    - transition:
	 *        remove class now, wait for transitionend,
	 *        then done if there's no explicit js callback.
	 *    - animation:
	 *        wait for animationend, remove class,
	 *        then done if there's no explicit js callback.
	 *    - no css transition:
	 *        done now if there's no explicit js callback.
	 * 8. wait for either done or js callback, then call
	 *    afterEnter hook.
	 *
	 * @param {Function} op - insert/show the element
	 * @param {Function} [cb]
	 */
	
	p$1.enter = function (op, cb) {
	  this.cancelPending();
	  this.callHook('beforeEnter');
	  this.cb = cb;
	  addClass(this.el, this.enterClass);
	  op();
	  this.entered = false;
	  this.callHookWithCb('enter');
	  if (this.entered) {
	    return; // user called done synchronously.
	  }
	  this.cancel = this.hooks && this.hooks.enterCancelled;
	  pushJob(this.enterNextTick);
	};
	
	/**
	 * The "nextTick" phase of an entering transition, which is
	 * to be pushed into a queue and executed after a reflow so
	 * that removing the class can trigger a CSS transition.
	 */
	
	p$1.enterNextTick = function () {
	  var _this = this;
	
	  // prevent transition skipping
	  this.justEntered = true;
	  waitForTransitionStart(function () {
	    _this.justEntered = false;
	  });
	  var enterDone = this.enterDone;
	  var type = this.getCssTransitionType(this.enterClass);
	  if (!this.pendingJsCb) {
	    if (type === TYPE_TRANSITION) {
	      // trigger transition by removing enter class now
	      removeClass(this.el, this.enterClass);
	      this.setupCssCb(transitionEndEvent, enterDone);
	    } else if (type === TYPE_ANIMATION) {
	      this.setupCssCb(animationEndEvent, enterDone);
	    } else {
	      enterDone();
	    }
	  } else if (type === TYPE_TRANSITION) {
	    removeClass(this.el, this.enterClass);
	  }
	};
	
	/**
	 * The "cleanup" phase of an entering transition.
	 */
	
	p$1.enterDone = function () {
	  this.entered = true;
	  this.cancel = this.pendingJsCb = null;
	  removeClass(this.el, this.enterClass);
	  this.callHook('afterEnter');
	  if (this.cb) this.cb();
	};
	
	/**
	 * Start a leaving transition.
	 *
	 * 1. leave transition triggered.
	 * 2. call beforeLeave hook
	 * 3. add leave class (trigger css transition)
	 * 4. call leave hook (with possible explicit js callback)
	 * 5. reflow if no explicit js callback is provided
	 * 6. based on transition type:
	 *    - transition or animation:
	 *        wait for end event, remove class, then done if
	 *        there's no explicit js callback.
	 *    - no css transition:
	 *        done if there's no explicit js callback.
	 * 7. wait for either done or js callback, then call
	 *    afterLeave hook.
	 *
	 * @param {Function} op - remove/hide the element
	 * @param {Function} [cb]
	 */
	
	p$1.leave = function (op, cb) {
	  this.cancelPending();
	  this.callHook('beforeLeave');
	  this.op = op;
	  this.cb = cb;
	  addClass(this.el, this.leaveClass);
	  this.left = false;
	  this.callHookWithCb('leave');
	  if (this.left) {
	    return; // user called done synchronously.
	  }
	  this.cancel = this.hooks && this.hooks.leaveCancelled;
	  // only need to handle leaveDone if
	  // 1. the transition is already done (synchronously called
	  //    by the user, which causes this.op set to null)
	  // 2. there's no explicit js callback
	  if (this.op && !this.pendingJsCb) {
	    // if a CSS transition leaves immediately after enter,
	    // the transitionend event never fires. therefore we
	    // detect such cases and end the leave immediately.
	    if (this.justEntered) {
	      this.leaveDone();
	    } else {
	      pushJob(this.leaveNextTick);
	    }
	  }
	};
	
	/**
	 * The "nextTick" phase of a leaving transition.
	 */
	
	p$1.leaveNextTick = function () {
	  var type = this.getCssTransitionType(this.leaveClass);
	  if (type) {
	    var event = type === TYPE_TRANSITION ? transitionEndEvent : animationEndEvent;
	    this.setupCssCb(event, this.leaveDone);
	  } else {
	    this.leaveDone();
	  }
	};
	
	/**
	 * The "cleanup" phase of a leaving transition.
	 */
	
	p$1.leaveDone = function () {
	  this.left = true;
	  this.cancel = this.pendingJsCb = null;
	  this.op();
	  removeClass(this.el, this.leaveClass);
	  this.callHook('afterLeave');
	  if (this.cb) this.cb();
	  this.op = null;
	};
	
	/**
	 * Cancel any pending callbacks from a previously running
	 * but not finished transition.
	 */
	
	p$1.cancelPending = function () {
	  this.op = this.cb = null;
	  var hasPending = false;
	  if (this.pendingCssCb) {
	    hasPending = true;
	    off(this.el, this.pendingCssEvent, this.pendingCssCb);
	    this.pendingCssEvent = this.pendingCssCb = null;
	  }
	  if (this.pendingJsCb) {
	    hasPending = true;
	    this.pendingJsCb.cancel();
	    this.pendingJsCb = null;
	  }
	  if (hasPending) {
	    removeClass(this.el, this.enterClass);
	    removeClass(this.el, this.leaveClass);
	  }
	  if (this.cancel) {
	    this.cancel.call(this.vm, this.el);
	    this.cancel = null;
	  }
	};
	
	/**
	 * Call a user-provided synchronous hook function.
	 *
	 * @param {String} type
	 */
	
	p$1.callHook = function (type) {
	  if (this.hooks && this.hooks[type]) {
	    this.hooks[type].call(this.vm, this.el);
	  }
	};
	
	/**
	 * Call a user-provided, potentially-async hook function.
	 * We check for the length of arguments to see if the hook
	 * expects a `done` callback. If true, the transition's end
	 * will be determined by when the user calls that callback;
	 * otherwise, the end is determined by the CSS transition or
	 * animation.
	 *
	 * @param {String} type
	 */
	
	p$1.callHookWithCb = function (type) {
	  var hook = this.hooks && this.hooks[type];
	  if (hook) {
	    if (hook.length > 1) {
	      this.pendingJsCb = cancellable(this[type + 'Done']);
	    }
	    hook.call(this.vm, this.el, this.pendingJsCb);
	  }
	};
	
	/**
	 * Get an element's transition type based on the
	 * calculated styles.
	 *
	 * @param {String} className
	 * @return {Number}
	 */
	
	p$1.getCssTransitionType = function (className) {
	  /* istanbul ignore if */
	  if (!transitionEndEvent ||
	  // skip CSS transitions if page is not visible -
	  // this solves the issue of transitionend events not
	  // firing until the page is visible again.
	  // pageVisibility API is supported in IE10+, same as
	  // CSS transitions.
	  document.hidden ||
	  // explicit js-only transition
	  this.hooks && this.hooks.css === false ||
	  // element is hidden
	  isHidden(this.el)) {
	    return;
	  }
	  var type = this.type || this.typeCache[className];
	  if (type) return type;
	  var inlineStyles = this.el.style;
	  var computedStyles = window.getComputedStyle(this.el);
	  var transDuration = inlineStyles[transDurationProp] || computedStyles[transDurationProp];
	  if (transDuration && transDuration !== '0s') {
	    type = TYPE_TRANSITION;
	  } else {
	    var animDuration = inlineStyles[animDurationProp] || computedStyles[animDurationProp];
	    if (animDuration && animDuration !== '0s') {
	      type = TYPE_ANIMATION;
	    }
	  }
	  if (type) {
	    this.typeCache[className] = type;
	  }
	  return type;
	};
	
	/**
	 * Setup a CSS transitionend/animationend callback.
	 *
	 * @param {String} event
	 * @param {Function} cb
	 */
	
	p$1.setupCssCb = function (event, cb) {
	  this.pendingCssEvent = event;
	  var self = this;
	  var el = this.el;
	  var onEnd = this.pendingCssCb = function (e) {
	    if (e.target === el) {
	      off(el, event, onEnd);
	      self.pendingCssEvent = self.pendingCssCb = null;
	      if (!self.pendingJsCb && cb) {
	        cb();
	      }
	    }
	  };
	  on(el, event, onEnd);
	};
	
	/**
	 * Check if an element is hidden - in that case we can just
	 * skip the transition alltogether.
	 *
	 * @param {Element} el
	 * @return {Boolean}
	 */
	
	function isHidden(el) {
	  if (/svg$/.test(el.namespaceURI)) {
	    // SVG elements do not have offset(Width|Height)
	    // so we need to check the client rect
	    var rect = el.getBoundingClientRect();
	    return !(rect.width || rect.height);
	  } else {
	    return !(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
	  }
	}
	
	var transition$1 = {
	
	  priority: TRANSITION,
	
	  update: function update(id, oldId) {
	    var el = this.el;
	    // resolve on owner vm
	    var hooks = resolveAsset(this.vm.$options, 'transitions', id);
	    id = id || 'v';
	    oldId = oldId || 'v';
	    el.__v_trans = new Transition(el, id, hooks, this.vm);
	    removeClass(el, oldId + '-transition');
	    addClass(el, id + '-transition');
	  }
	};
	
	var internalDirectives = {
	  style: style,
	  'class': vClass,
	  component: component,
	  prop: propDef,
	  transition: transition$1
	};
	
	// special binding prefixes
	var bindRE = /^v-bind:|^:/;
	var onRE = /^v-on:|^@/;
	var dirAttrRE = /^v-([^:]+)(?:$|:(.*)$)/;
	var modifierRE = /\.[^\.]+/g;
	var transitionRE = /^(v-bind:|:)?transition$/;
	
	// default directive priority
	var DEFAULT_PRIORITY = 1000;
	var DEFAULT_TERMINAL_PRIORITY = 2000;
	
	/**
	 * Compile a template and return a reusable composite link
	 * function, which recursively contains more link functions
	 * inside. This top level compile function would normally
	 * be called on instance root nodes, but can also be used
	 * for partial compilation if the partial argument is true.
	 *
	 * The returned composite link function, when called, will
	 * return an unlink function that tearsdown all directives
	 * created during the linking phase.
	 *
	 * @param {Element|DocumentFragment} el
	 * @param {Object} options
	 * @param {Boolean} partial
	 * @return {Function}
	 */
	
	function compile(el, options, partial) {
	  // link function for the node itself.
	  var nodeLinkFn = partial || !options._asComponent ? compileNode(el, options) : null;
	  // link function for the childNodes
	  var childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && !isScript(el) && el.hasChildNodes() ? compileNodeList(el.childNodes, options) : null;
	
	  /**
	   * A composite linker function to be called on a already
	   * compiled piece of DOM, which instantiates all directive
	   * instances.
	   *
	   * @param {Vue} vm
	   * @param {Element|DocumentFragment} el
	   * @param {Vue} [host] - host vm of transcluded content
	   * @param {Object} [scope] - v-for scope
	   * @param {Fragment} [frag] - link context fragment
	   * @return {Function|undefined}
	   */
	
	  return function compositeLinkFn(vm, el, host, scope, frag) {
	    // cache childNodes before linking parent, fix #657
	    var childNodes = toArray(el.childNodes);
	    // link
	    var dirs = linkAndCapture(function compositeLinkCapturer() {
	      if (nodeLinkFn) nodeLinkFn(vm, el, host, scope, frag);
	      if (childLinkFn) childLinkFn(vm, childNodes, host, scope, frag);
	    }, vm);
	    return makeUnlinkFn(vm, dirs);
	  };
	}
	
	/**
	 * Apply a linker to a vm/element pair and capture the
	 * directives created during the process.
	 *
	 * @param {Function} linker
	 * @param {Vue} vm
	 */
	
	function linkAndCapture(linker, vm) {
	  /* istanbul ignore if */
	  if (process.env.NODE_ENV === 'production') {
	    // reset directives before every capture in production
	    // mode, so that when unlinking we don't need to splice
	    // them out (which turns out to be a perf hit).
	    // they are kept in development mode because they are
	    // useful for Vue's own tests.
	    vm._directives = [];
	  }
	  var originalDirCount = vm._directives.length;
	  linker();
	  var dirs = vm._directives.slice(originalDirCount);
	  dirs.sort(directiveComparator);
	  for (var i = 0, l = dirs.length; i < l; i++) {
	    dirs[i]._bind();
	  }
	  return dirs;
	}
	
	/**
	 * Directive priority sort comparator
	 *
	 * @param {Object} a
	 * @param {Object} b
	 */
	
	function directiveComparator(a, b) {
	  a = a.descriptor.def.priority || DEFAULT_PRIORITY;
	  b = b.descriptor.def.priority || DEFAULT_PRIORITY;
	  return a > b ? -1 : a === b ? 0 : 1;
	}
	
	/**
	 * Linker functions return an unlink function that
	 * tearsdown all directives instances generated during
	 * the process.
	 *
	 * We create unlink functions with only the necessary
	 * information to avoid retaining additional closures.
	 *
	 * @param {Vue} vm
	 * @param {Array} dirs
	 * @param {Vue} [context]
	 * @param {Array} [contextDirs]
	 * @return {Function}
	 */
	
	function makeUnlinkFn(vm, dirs, context, contextDirs) {
	  function unlink(destroying) {
	    teardownDirs(vm, dirs, destroying);
	    if (context && contextDirs) {
	      teardownDirs(context, contextDirs);
	    }
	  }
	  // expose linked directives
	  unlink.dirs = dirs;
	  return unlink;
	}
	
	/**
	 * Teardown partial linked directives.
	 *
	 * @param {Vue} vm
	 * @param {Array} dirs
	 * @param {Boolean} destroying
	 */
	
	function teardownDirs(vm, dirs, destroying) {
	  var i = dirs.length;
	  while (i--) {
	    dirs[i]._teardown();
	    if (process.env.NODE_ENV !== 'production' && !destroying) {
	      vm._directives.$remove(dirs[i]);
	    }
	  }
	}
	
	/**
	 * Compile link props on an instance.
	 *
	 * @param {Vue} vm
	 * @param {Element} el
	 * @param {Object} props
	 * @param {Object} [scope]
	 * @return {Function}
	 */
	
	function compileAndLinkProps(vm, el, props, scope) {
	  var propsLinkFn = compileProps(el, props, vm);
	  var propDirs = linkAndCapture(function () {
	    propsLinkFn(vm, scope);
	  }, vm);
	  return makeUnlinkFn(vm, propDirs);
	}
	
	/**
	 * Compile the root element of an instance.
	 *
	 * 1. attrs on context container (context scope)
	 * 2. attrs on the component template root node, if
	 *    replace:true (child scope)
	 *
	 * If this is a fragment instance, we only need to compile 1.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @param {Object} contextOptions
	 * @return {Function}
	 */
	
	function compileRoot(el, options, contextOptions) {
	  var containerAttrs = options._containerAttrs;
	  var replacerAttrs = options._replacerAttrs;
	  var contextLinkFn, replacerLinkFn;
	
	  // only need to compile other attributes for
	  // non-fragment instances
	  if (el.nodeType !== 11) {
	    // for components, container and replacer need to be
	    // compiled separately and linked in different scopes.
	    if (options._asComponent) {
	      // 2. container attributes
	      if (containerAttrs && contextOptions) {
	        contextLinkFn = compileDirectives(containerAttrs, contextOptions);
	      }
	      if (replacerAttrs) {
	        // 3. replacer attributes
	        replacerLinkFn = compileDirectives(replacerAttrs, options);
	      }
	    } else {
	      // non-component, just compile as a normal element.
	      replacerLinkFn = compileDirectives(el.attributes, options);
	    }
	  } else if (process.env.NODE_ENV !== 'production' && containerAttrs) {
	    // warn container directives for fragment instances
	    var names = containerAttrs.filter(function (attr) {
	      // allow vue-loader/vueify scoped css attributes
	      return attr.name.indexOf('_v-') < 0 &&
	      // allow event listeners
	      !onRE.test(attr.name) &&
	      // allow slots
	      attr.name !== 'slot';
	    }).map(function (attr) {
	      return '"' + attr.name + '"';
	    });
	    if (names.length) {
	      var plural = names.length > 1;
	      warn('Attribute' + (plural ? 's ' : ' ') + names.join(', ') + (plural ? ' are' : ' is') + ' ignored on component ' + '<' + options.el.tagName.toLowerCase() + '> because ' + 'the component is a fragment instance: ' + 'http://vuejs.org/guide/components.html#Fragment-Instance');
	    }
	  }
	
	  options._containerAttrs = options._replacerAttrs = null;
	  return function rootLinkFn(vm, el, scope) {
	    // link context scope dirs
	    var context = vm._context;
	    var contextDirs;
	    if (context && contextLinkFn) {
	      contextDirs = linkAndCapture(function () {
	        contextLinkFn(context, el, null, scope);
	      }, context);
	    }
	
	    // link self
	    var selfDirs = linkAndCapture(function () {
	      if (replacerLinkFn) replacerLinkFn(vm, el);
	    }, vm);
	
	    // return the unlink function that tearsdown context
	    // container directives.
	    return makeUnlinkFn(vm, selfDirs, context, contextDirs);
	  };
	}
	
	/**
	 * Compile a node and return a nodeLinkFn based on the
	 * node type.
	 *
	 * @param {Node} node
	 * @param {Object} options
	 * @return {Function|null}
	 */
	
	function compileNode(node, options) {
	  var type = node.nodeType;
	  if (type === 1 && !isScript(node)) {
	    return compileElement(node, options);
	  } else if (type === 3 && node.data.trim()) {
	    return compileTextNode(node, options);
	  } else {
	    return null;
	  }
	}
	
	/**
	 * Compile an element and return a nodeLinkFn.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Function|null}
	 */
	
	function compileElement(el, options) {
	  // preprocess textareas.
	  // textarea treats its text content as the initial value.
	  // just bind it as an attr directive for value.
	  if (el.tagName === 'TEXTAREA') {
	    var tokens = parseText(el.value);
	    if (tokens) {
	      el.setAttribute(':value', tokensToExp(tokens));
	      el.value = '';
	    }
	  }
	  var linkFn;
	  var hasAttrs = el.hasAttributes();
	  var attrs = hasAttrs && toArray(el.attributes);
	  // check terminal directives (for & if)
	  if (hasAttrs) {
	    linkFn = checkTerminalDirectives(el, attrs, options);
	  }
	  // check element directives
	  if (!linkFn) {
	    linkFn = checkElementDirectives(el, options);
	  }
	  // check component
	  if (!linkFn) {
	    linkFn = checkComponent(el, options);
	  }
	  // normal directives
	  if (!linkFn && hasAttrs) {
	    linkFn = compileDirectives(attrs, options);
	  }
	  return linkFn;
	}
	
	/**
	 * Compile a textNode and return a nodeLinkFn.
	 *
	 * @param {TextNode} node
	 * @param {Object} options
	 * @return {Function|null} textNodeLinkFn
	 */
	
	function compileTextNode(node, options) {
	  // skip marked text nodes
	  if (node._skip) {
	    return removeText;
	  }
	
	  var tokens = parseText(node.wholeText);
	  if (!tokens) {
	    return null;
	  }
	
	  // mark adjacent text nodes as skipped,
	  // because we are using node.wholeText to compile
	  // all adjacent text nodes together. This fixes
	  // issues in IE where sometimes it splits up a single
	  // text node into multiple ones.
	  var next = node.nextSibling;
	  while (next && next.nodeType === 3) {
	    next._skip = true;
	    next = next.nextSibling;
	  }
	
	  var frag = document.createDocumentFragment();
	  var el, token;
	  for (var i = 0, l = tokens.length; i < l; i++) {
	    token = tokens[i];
	    el = token.tag ? processTextToken(token, options) : document.createTextNode(token.value);
	    frag.appendChild(el);
	  }
	  return makeTextNodeLinkFn(tokens, frag, options);
	}
	
	/**
	 * Linker for an skipped text node.
	 *
	 * @param {Vue} vm
	 * @param {Text} node
	 */
	
	function removeText(vm, node) {
	  remove(node);
	}
	
	/**
	 * Process a single text token.
	 *
	 * @param {Object} token
	 * @param {Object} options
	 * @return {Node}
	 */
	
	function processTextToken(token, options) {
	  var el;
	  if (token.oneTime) {
	    el = document.createTextNode(token.value);
	  } else {
	    if (token.html) {
	      el = document.createComment('v-html');
	      setTokenType('html');
	    } else {
	      // IE will clean up empty textNodes during
	      // frag.cloneNode(true), so we have to give it
	      // something here...
	      el = document.createTextNode(' ');
	      setTokenType('text');
	    }
	  }
	  function setTokenType(type) {
	    if (token.descriptor) return;
	    var parsed = parseDirective(token.value);
	    token.descriptor = {
	      name: type,
	      def: directives[type],
	      expression: parsed.expression,
	      filters: parsed.filters
	    };
	  }
	  return el;
	}
	
	/**
	 * Build a function that processes a textNode.
	 *
	 * @param {Array<Object>} tokens
	 * @param {DocumentFragment} frag
	 */
	
	function makeTextNodeLinkFn(tokens, frag) {
	  return function textNodeLinkFn(vm, el, host, scope) {
	    var fragClone = frag.cloneNode(true);
	    var childNodes = toArray(fragClone.childNodes);
	    var token, value, node;
	    for (var i = 0, l = tokens.length; i < l; i++) {
	      token = tokens[i];
	      value = token.value;
	      if (token.tag) {
	        node = childNodes[i];
	        if (token.oneTime) {
	          value = (scope || vm).$eval(value);
	          if (token.html) {
	            replace(node, parseTemplate(value, true));
	          } else {
	            node.data = _toString(value);
	          }
	        } else {
	          vm._bindDir(token.descriptor, node, host, scope);
	        }
	      }
	    }
	    replace(el, fragClone);
	  };
	}
	
	/**
	 * Compile a node list and return a childLinkFn.
	 *
	 * @param {NodeList} nodeList
	 * @param {Object} options
	 * @return {Function|undefined}
	 */
	
	function compileNodeList(nodeList, options) {
	  var linkFns = [];
	  var nodeLinkFn, childLinkFn, node;
	  for (var i = 0, l = nodeList.length; i < l; i++) {
	    node = nodeList[i];
	    nodeLinkFn = compileNode(node, options);
	    childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && node.tagName !== 'SCRIPT' && node.hasChildNodes() ? compileNodeList(node.childNodes, options) : null;
	    linkFns.push(nodeLinkFn, childLinkFn);
	  }
	  return linkFns.length ? makeChildLinkFn(linkFns) : null;
	}
	
	/**
	 * Make a child link function for a node's childNodes.
	 *
	 * @param {Array<Function>} linkFns
	 * @return {Function} childLinkFn
	 */
	
	function makeChildLinkFn(linkFns) {
	  return function childLinkFn(vm, nodes, host, scope, frag) {
	    var node, nodeLinkFn, childrenLinkFn;
	    for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
	      node = nodes[n];
	      nodeLinkFn = linkFns[i++];
	      childrenLinkFn = linkFns[i++];
	      // cache childNodes before linking parent, fix #657
	      var childNodes = toArray(node.childNodes);
	      if (nodeLinkFn) {
	        nodeLinkFn(vm, node, host, scope, frag);
	      }
	      if (childrenLinkFn) {
	        childrenLinkFn(vm, childNodes, host, scope, frag);
	      }
	    }
	  };
	}
	
	/**
	 * Check for element directives (custom elements that should
	 * be resovled as terminal directives).
	 *
	 * @param {Element} el
	 * @param {Object} options
	 */
	
	function checkElementDirectives(el, options) {
	  var tag = el.tagName.toLowerCase();
	  if (commonTagRE.test(tag)) {
	    return;
	  }
	  var def = resolveAsset(options, 'elementDirectives', tag);
	  if (def) {
	    return makeTerminalNodeLinkFn(el, tag, '', options, def);
	  }
	}
	
	/**
	 * Check if an element is a component. If yes, return
	 * a component link function.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Function|undefined}
	 */
	
	function checkComponent(el, options) {
	  var component = checkComponentAttr(el, options);
	  if (component) {
	    var ref = findRef(el);
	    var descriptor = {
	      name: 'component',
	      ref: ref,
	      expression: component.id,
	      def: internalDirectives.component,
	      modifiers: {
	        literal: !component.dynamic
	      }
	    };
	    var componentLinkFn = function componentLinkFn(vm, el, host, scope, frag) {
	      if (ref) {
	        defineReactive((scope || vm).$refs, ref, null);
	      }
	      vm._bindDir(descriptor, el, host, scope, frag);
	    };
	    componentLinkFn.terminal = true;
	    return componentLinkFn;
	  }
	}
	
	/**
	 * Check an element for terminal directives in fixed order.
	 * If it finds one, return a terminal link function.
	 *
	 * @param {Element} el
	 * @param {Array} attrs
	 * @param {Object} options
	 * @return {Function} terminalLinkFn
	 */
	
	function checkTerminalDirectives(el, attrs, options) {
	  // skip v-pre
	  if (getAttr(el, 'v-pre') !== null) {
	    return skip;
	  }
	  // skip v-else block, but only if following v-if
	  if (el.hasAttribute('v-else')) {
	    var prev = el.previousElementSibling;
	    if (prev && prev.hasAttribute('v-if')) {
	      return skip;
	    }
	  }
	
	  var attr, name, value, modifiers, matched, dirName, rawName, arg, def, termDef;
	  for (var i = 0, j = attrs.length; i < j; i++) {
	    attr = attrs[i];
	    name = attr.name.replace(modifierRE, '');
	    if (matched = name.match(dirAttrRE)) {
	      def = resolveAsset(options, 'directives', matched[1]);
	      if (def && def.terminal) {
	        if (!termDef || (def.priority || DEFAULT_TERMINAL_PRIORITY) > termDef.priority) {
	          termDef = def;
	          rawName = attr.name;
	          modifiers = parseModifiers(attr.name);
	          value = attr.value;
	          dirName = matched[1];
	          arg = matched[2];
	        }
	      }
	    }
	  }
	
	  if (termDef) {
	    return makeTerminalNodeLinkFn(el, dirName, value, options, termDef, rawName, arg, modifiers);
	  }
	}
	
	function skip() {}
	skip.terminal = true;
	
	/**
	 * Build a node link function for a terminal directive.
	 * A terminal link function terminates the current
	 * compilation recursion and handles compilation of the
	 * subtree in the directive.
	 *
	 * @param {Element} el
	 * @param {String} dirName
	 * @param {String} value
	 * @param {Object} options
	 * @param {Object} def
	 * @param {String} [rawName]
	 * @param {String} [arg]
	 * @param {Object} [modifiers]
	 * @return {Function} terminalLinkFn
	 */
	
	function makeTerminalNodeLinkFn(el, dirName, value, options, def, rawName, arg, modifiers) {
	  var parsed = parseDirective(value);
	  var descriptor = {
	    name: dirName,
	    arg: arg,
	    expression: parsed.expression,
	    filters: parsed.filters,
	    raw: value,
	    attr: rawName,
	    modifiers: modifiers,
	    def: def
	  };
	  // check ref for v-for and router-view
	  if (dirName === 'for' || dirName === 'router-view') {
	    descriptor.ref = findRef(el);
	  }
	  var fn = function terminalNodeLinkFn(vm, el, host, scope, frag) {
	    if (descriptor.ref) {
	      defineReactive((scope || vm).$refs, descriptor.ref, null);
	    }
	    vm._bindDir(descriptor, el, host, scope, frag);
	  };
	  fn.terminal = true;
	  return fn;
	}
	
	/**
	 * Compile the directives on an element and return a linker.
	 *
	 * @param {Array|NamedNodeMap} attrs
	 * @param {Object} options
	 * @return {Function}
	 */
	
	function compileDirectives(attrs, options) {
	  var i = attrs.length;
	  var dirs = [];
	  var attr, name, value, rawName, rawValue, dirName, arg, modifiers, dirDef, tokens, matched;
	  while (i--) {
	    attr = attrs[i];
	    name = rawName = attr.name;
	    value = rawValue = attr.value;
	    tokens = parseText(value);
	    // reset arg
	    arg = null;
	    // check modifiers
	    modifiers = parseModifiers(name);
	    name = name.replace(modifierRE, '');
	
	    // attribute interpolations
	    if (tokens) {
	      value = tokensToExp(tokens);
	      arg = name;
	      pushDir('bind', directives.bind, tokens);
	      // warn against mixing mustaches with v-bind
	      if (process.env.NODE_ENV !== 'production') {
	        if (name === 'class' && Array.prototype.some.call(attrs, function (attr) {
	          return attr.name === ':class' || attr.name === 'v-bind:class';
	        })) {
	          warn('class="' + rawValue + '": Do not mix mustache interpolation ' + 'and v-bind for "class" on the same element. Use one or the other.', options);
	        }
	      }
	    } else
	
	      // special attribute: transition
	      if (transitionRE.test(name)) {
	        modifiers.literal = !bindRE.test(name);
	        pushDir('transition', internalDirectives.transition);
	      } else
	
	        // event handlers
	        if (onRE.test(name)) {
	          arg = name.replace(onRE, '');
	          pushDir('on', directives.on);
	        } else
	
	          // attribute bindings
	          if (bindRE.test(name)) {
	            dirName = name.replace(bindRE, '');
	            if (dirName === 'style' || dirName === 'class') {
	              pushDir(dirName, internalDirectives[dirName]);
	            } else {
	              arg = dirName;
	              pushDir('bind', directives.bind);
	            }
	          } else
	
	            // normal directives
	            if (matched = name.match(dirAttrRE)) {
	              dirName = matched[1];
	              arg = matched[2];
	
	              // skip v-else (when used with v-show)
	              if (dirName === 'else') {
	                continue;
	              }
	
	              dirDef = resolveAsset(options, 'directives', dirName, true);
	              if (dirDef) {
	                pushDir(dirName, dirDef);
	              }
	            }
	  }
	
	  /**
	   * Push a directive.
	   *
	   * @param {String} dirName
	   * @param {Object|Function} def
	   * @param {Array} [interpTokens]
	   */
	
	  function pushDir(dirName, def, interpTokens) {
	    var hasOneTimeToken = interpTokens && hasOneTime(interpTokens);
	    var parsed = !hasOneTimeToken && parseDirective(value);
	    dirs.push({
	      name: dirName,
	      attr: rawName,
	      raw: rawValue,
	      def: def,
	      arg: arg,
	      modifiers: modifiers,
	      // conversion from interpolation strings with one-time token
	      // to expression is differed until directive bind time so that we
	      // have access to the actual vm context for one-time bindings.
	      expression: parsed && parsed.expression,
	      filters: parsed && parsed.filters,
	      interp: interpTokens,
	      hasOneTime: hasOneTimeToken
	    });
	  }
	
	  if (dirs.length) {
	    return makeNodeLinkFn(dirs);
	  }
	}
	
	/**
	 * Parse modifiers from directive attribute name.
	 *
	 * @param {String} name
	 * @return {Object}
	 */
	
	function parseModifiers(name) {
	  var res = Object.create(null);
	  var match = name.match(modifierRE);
	  if (match) {
	    var i = match.length;
	    while (i--) {
	      res[match[i].slice(1)] = true;
	    }
	  }
	  return res;
	}
	
	/**
	 * Build a link function for all directives on a single node.
	 *
	 * @param {Array} directives
	 * @return {Function} directivesLinkFn
	 */
	
	function makeNodeLinkFn(directives) {
	  return function nodeLinkFn(vm, el, host, scope, frag) {
	    // reverse apply because it's sorted low to high
	    var i = directives.length;
	    while (i--) {
	      vm._bindDir(directives[i], el, host, scope, frag);
	    }
	  };
	}
	
	/**
	 * Check if an interpolation string contains one-time tokens.
	 *
	 * @param {Array} tokens
	 * @return {Boolean}
	 */
	
	function hasOneTime(tokens) {
	  var i = tokens.length;
	  while (i--) {
	    if (tokens[i].oneTime) return true;
	  }
	}
	
	function isScript(el) {
	  return el.tagName === 'SCRIPT' && (!el.hasAttribute('type') || el.getAttribute('type') === 'text/javascript');
	}
	
	var specialCharRE = /[^\w\-:\.]/;
	
	/**
	 * Process an element or a DocumentFragment based on a
	 * instance option object. This allows us to transclude
	 * a template node/fragment before the instance is created,
	 * so the processed fragment can then be cloned and reused
	 * in v-for.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Element|DocumentFragment}
	 */
	
	function transclude(el, options) {
	  // extract container attributes to pass them down
	  // to compiler, because they need to be compiled in
	  // parent scope. we are mutating the options object here
	  // assuming the same object will be used for compile
	  // right after this.
	  if (options) {
	    options._containerAttrs = extractAttrs(el);
	  }
	  // for template tags, what we want is its content as
	  // a documentFragment (for fragment instances)
	  if (isTemplate(el)) {
	    el = parseTemplate(el);
	  }
	  if (options) {
	    if (options._asComponent && !options.template) {
	      options.template = '<slot></slot>';
	    }
	    if (options.template) {
	      options._content = extractContent(el);
	      el = transcludeTemplate(el, options);
	    }
	  }
	  if (isFragment(el)) {
	    // anchors for fragment instance
	    // passing in `persist: true` to avoid them being
	    // discarded by IE during template cloning
	    prepend(createAnchor('v-start', true), el);
	    el.appendChild(createAnchor('v-end', true));
	  }
	  return el;
	}
	
	/**
	 * Process the template option.
	 * If the replace option is true this will swap the $el.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Element|DocumentFragment}
	 */
	
	function transcludeTemplate(el, options) {
	  var template = options.template;
	  var frag = parseTemplate(template, true);
	  if (frag) {
	    var replacer = frag.firstChild;
	    var tag = replacer.tagName && replacer.tagName.toLowerCase();
	    if (options.replace) {
	      /* istanbul ignore if */
	      if (el === document.body) {
	        process.env.NODE_ENV !== 'production' && warn('You are mounting an instance with a template to ' + '<body>. This will replace <body> entirely. You ' + 'should probably use `replace: false` here.');
	      }
	      // there are many cases where the instance must
	      // become a fragment instance: basically anything that
	      // can create more than 1 root nodes.
	      if (
	      // multi-children template
	      frag.childNodes.length > 1 ||
	      // non-element template
	      replacer.nodeType !== 1 ||
	      // single nested component
	      tag === 'component' || resolveAsset(options, 'components', tag) || hasBindAttr(replacer, 'is') ||
	      // element directive
	      resolveAsset(options, 'elementDirectives', tag) ||
	      // for block
	      replacer.hasAttribute('v-for') ||
	      // if block
	      replacer.hasAttribute('v-if')) {
	        return frag;
	      } else {
	        options._replacerAttrs = extractAttrs(replacer);
	        mergeAttrs(el, replacer);
	        return replacer;
	      }
	    } else {
	      el.appendChild(frag);
	      return el;
	    }
	  } else {
	    process.env.NODE_ENV !== 'production' && warn('Invalid template option: ' + template);
	  }
	}
	
	/**
	 * Helper to extract a component container's attributes
	 * into a plain object array.
	 *
	 * @param {Element} el
	 * @return {Array}
	 */
	
	function extractAttrs(el) {
	  if (el.nodeType === 1 && el.hasAttributes()) {
	    return toArray(el.attributes);
	  }
	}
	
	/**
	 * Merge the attributes of two elements, and make sure
	 * the class names are merged properly.
	 *
	 * @param {Element} from
	 * @param {Element} to
	 */
	
	function mergeAttrs(from, to) {
	  var attrs = from.attributes;
	  var i = attrs.length;
	  var name, value;
	  while (i--) {
	    name = attrs[i].name;
	    value = attrs[i].value;
	    if (!to.hasAttribute(name) && !specialCharRE.test(name)) {
	      to.setAttribute(name, value);
	    } else if (name === 'class' && !parseText(value) && (value = value.trim())) {
	      value.split(/\s+/).forEach(function (cls) {
	        addClass(to, cls);
	      });
	    }
	  }
	}
	
	/**
	 * Scan and determine slot content distribution.
	 * We do this during transclusion instead at compile time so that
	 * the distribution is decoupled from the compilation order of
	 * the slots.
	 *
	 * @param {Element|DocumentFragment} template
	 * @param {Element} content
	 * @param {Vue} vm
	 */
	
	function resolveSlots(vm, content) {
	  if (!content) {
	    return;
	  }
	  var contents = vm._slotContents = Object.create(null);
	  var el, name;
	  for (var i = 0, l = content.children.length; i < l; i++) {
	    el = content.children[i];
	    /* eslint-disable no-cond-assign */
	    if (name = el.getAttribute('slot')) {
	      (contents[name] || (contents[name] = [])).push(el);
	    }
	    /* eslint-enable no-cond-assign */
	    if (process.env.NODE_ENV !== 'production' && getBindAttr(el, 'slot')) {
	      warn('The "slot" attribute must be static.', vm.$parent);
	    }
	  }
	  for (name in contents) {
	    contents[name] = extractFragment(contents[name], content);
	  }
	  if (content.hasChildNodes()) {
	    var nodes = content.childNodes;
	    if (nodes.length === 1 && nodes[0].nodeType === 3 && !nodes[0].data.trim()) {
	      return;
	    }
	    contents['default'] = extractFragment(content.childNodes, content);
	  }
	}
	
	/**
	 * Extract qualified content nodes from a node list.
	 *
	 * @param {NodeList} nodes
	 * @return {DocumentFragment}
	 */
	
	function extractFragment(nodes, parent) {
	  var frag = document.createDocumentFragment();
	  nodes = toArray(nodes);
	  for (var i = 0, l = nodes.length; i < l; i++) {
	    var node = nodes[i];
	    if (isTemplate(node) && !node.hasAttribute('v-if') && !node.hasAttribute('v-for')) {
	      parent.removeChild(node);
	      node = parseTemplate(node, true);
	    }
	    frag.appendChild(node);
	  }
	  return frag;
	}
	
	
	
	var compiler = Object.freeze({
		compile: compile,
		compileAndLinkProps: compileAndLinkProps,
		compileRoot: compileRoot,
		transclude: transclude,
		resolveSlots: resolveSlots
	});
	
	function stateMixin (Vue) {
	  /**
	   * Accessor for `$data` property, since setting $data
	   * requires observing the new object and updating
	   * proxied properties.
	   */
	
	  Object.defineProperty(Vue.prototype, '$data', {
	    get: function get() {
	      return this._data;
	    },
	    set: function set(newData) {
	      if (newData !== this._data) {
	        this._setData(newData);
	      }
	    }
	  });
	
	  /**
	   * Setup the scope of an instance, which contains:
	   * - observed data
	   * - computed properties
	   * - user methods
	   * - meta properties
	   */
	
	  Vue.prototype._initState = function () {
	    this._initProps();
	    this._initMeta();
	    this._initMethods();
	    this._initData();
	    this._initComputed();
	  };
	
	  /**
	   * Initialize props.
	   */
	
	  Vue.prototype._initProps = function () {
	    var options = this.$options;
	    var el = options.el;
	    var props = options.props;
	    if (props && !el) {
	      process.env.NODE_ENV !== 'production' && warn('Props will not be compiled if no `el` option is ' + 'provided at instantiation.', this);
	    }
	    // make sure to convert string selectors into element now
	    el = options.el = query(el);
	    this._propsUnlinkFn = el && el.nodeType === 1 && props
	    // props must be linked in proper scope if inside v-for
	    ? compileAndLinkProps(this, el, props, this._scope) : null;
	  };
	
	  /**
	   * Initialize the data.
	   */
	
	  Vue.prototype._initData = function () {
	    var dataFn = this.$options.data;
	    var data = this._data = dataFn ? dataFn() : {};
	    if (!isPlainObject(data)) {
	      data = {};
	      process.env.NODE_ENV !== 'production' && warn('data functions should return an object.', this);
	    }
	    var props = this._props;
	    // proxy data on instance
	    var keys = Object.keys(data);
	    var i, key;
	    i = keys.length;
	    while (i--) {
	      key = keys[i];
	      // there are two scenarios where we can proxy a data key:
	      // 1. it's not already defined as a prop
	      // 2. it's provided via a instantiation option AND there are no
	      //    template prop present
	      if (!props || !hasOwn(props, key)) {
	        this._proxy(key);
	      } else if (process.env.NODE_ENV !== 'production') {
	        warn('Data field "' + key + '" is already defined ' + 'as a prop. To provide default value for a prop, use the "default" ' + 'prop option; if you want to pass prop values to an instantiation ' + 'call, use the "propsData" option.', this);
	      }
	    }
	    // observe data
	    observe(data, this);
	  };
	
	  /**
	   * Swap the instance's $data. Called in $data's setter.
	   *
	   * @param {Object} newData
	   */
	
	  Vue.prototype._setData = function (newData) {
	    newData = newData || {};
	    var oldData = this._data;
	    this._data = newData;
	    var keys, key, i;
	    // unproxy keys not present in new data
	    keys = Object.keys(oldData);
	    i = keys.length;
	    while (i--) {
	      key = keys[i];
	      if (!(key in newData)) {
	        this._unproxy(key);
	      }
	    }
	    // proxy keys not already proxied,
	    // and trigger change for changed values
	    keys = Object.keys(newData);
	    i = keys.length;
	    while (i--) {
	      key = keys[i];
	      if (!hasOwn(this, key)) {
	        // new property
	        this._proxy(key);
	      }
	    }
	    oldData.__ob__.removeVm(this);
	    observe(newData, this);
	    this._digest();
	  };
	
	  /**
	   * Proxy a property, so that
	   * vm.prop === vm._data.prop
	   *
	   * @param {String} key
	   */
	
	  Vue.prototype._proxy = function (key) {
	    if (!isReserved(key)) {
	      // need to store ref to self here
	      // because these getter/setters might
	      // be called by child scopes via
	      // prototype inheritance.
	      var self = this;
	      Object.defineProperty(self, key, {
	        configurable: true,
	        enumerable: true,
	        get: function proxyGetter() {
	          return self._data[key];
	        },
	        set: function proxySetter(val) {
	          self._data[key] = val;
	        }
	      });
	    }
	  };
	
	  /**
	   * Unproxy a property.
	   *
	   * @param {String} key
	   */
	
	  Vue.prototype._unproxy = function (key) {
	    if (!isReserved(key)) {
	      delete this[key];
	    }
	  };
	
	  /**
	   * Force update on every watcher in scope.
	   */
	
	  Vue.prototype._digest = function () {
	    for (var i = 0, l = this._watchers.length; i < l; i++) {
	      this._watchers[i].update(true); // shallow updates
	    }
	  };
	
	  /**
	   * Setup computed properties. They are essentially
	   * special getter/setters
	   */
	
	  function noop() {}
	  Vue.prototype._initComputed = function () {
	    var computed = this.$options.computed;
	    if (computed) {
	      for (var key in computed) {
	        var userDef = computed[key];
	        var def = {
	          enumerable: true,
	          configurable: true
	        };
	        if (typeof userDef === 'function') {
	          def.get = makeComputedGetter(userDef, this);
	          def.set = noop;
	        } else {
	          def.get = userDef.get ? userDef.cache !== false ? makeComputedGetter(userDef.get, this) : bind(userDef.get, this) : noop;
	          def.set = userDef.set ? bind(userDef.set, this) : noop;
	        }
	        Object.defineProperty(this, key, def);
	      }
	    }
	  };
	
	  function makeComputedGetter(getter, owner) {
	    var watcher = new Watcher(owner, getter, null, {
	      lazy: true
	    });
	    return function computedGetter() {
	      if (watcher.dirty) {
	        watcher.evaluate();
	      }
	      if (Dep.target) {
	        watcher.depend();
	      }
	      return watcher.value;
	    };
	  }
	
	  /**
	   * Setup instance methods. Methods must be bound to the
	   * instance since they might be passed down as a prop to
	   * child components.
	   */
	
	  Vue.prototype._initMethods = function () {
	    var methods = this.$options.methods;
	    if (methods) {
	      for (var key in methods) {
	        this[key] = bind(methods[key], this);
	      }
	    }
	  };
	
	  /**
	   * Initialize meta information like $index, $key & $value.
	   */
	
	  Vue.prototype._initMeta = function () {
	    var metas = this.$options._meta;
	    if (metas) {
	      for (var key in metas) {
	        defineReactive(this, key, metas[key]);
	      }
	    }
	  };
	}
	
	var eventRE = /^v-on:|^@/;
	
	function eventsMixin (Vue) {
	  /**
	   * Setup the instance's option events & watchers.
	   * If the value is a string, we pull it from the
	   * instance's methods by name.
	   */
	
	  Vue.prototype._initEvents = function () {
	    var options = this.$options;
	    if (options._asComponent) {
	      registerComponentEvents(this, options.el);
	    }
	    registerCallbacks(this, '$on', options.events);
	    registerCallbacks(this, '$watch', options.watch);
	  };
	
	  /**
	   * Register v-on events on a child component
	   *
	   * @param {Vue} vm
	   * @param {Element} el
	   */
	
	  function registerComponentEvents(vm, el) {
	    var attrs = el.attributes;
	    var name, value, handler;
	    for (var i = 0, l = attrs.length; i < l; i++) {
	      name = attrs[i].name;
	      if (eventRE.test(name)) {
	        name = name.replace(eventRE, '');
	        // force the expression into a statement so that
	        // it always dynamically resolves the method to call (#2670)
	        // kinda ugly hack, but does the job.
	        value = attrs[i].value;
	        if (isSimplePath(value)) {
	          value += '.apply(this, $arguments)';
	        }
	        handler = (vm._scope || vm._context).$eval(value, true);
	        handler._fromParent = true;
	        vm.$on(name.replace(eventRE), handler);
	      }
	    }
	  }
	
	  /**
	   * Register callbacks for option events and watchers.
	   *
	   * @param {Vue} vm
	   * @param {String} action
	   * @param {Object} hash
	   */
	
	  function registerCallbacks(vm, action, hash) {
	    if (!hash) return;
	    var handlers, key, i, j;
	    for (key in hash) {
	      handlers = hash[key];
	      if (isArray(handlers)) {
	        for (i = 0, j = handlers.length; i < j; i++) {
	          register(vm, action, key, handlers[i]);
	        }
	      } else {
	        register(vm, action, key, handlers);
	      }
	    }
	  }
	
	  /**
	   * Helper to register an event/watch callback.
	   *
	   * @param {Vue} vm
	   * @param {String} action
	   * @param {String} key
	   * @param {Function|String|Object} handler
	   * @param {Object} [options]
	   */
	
	  function register(vm, action, key, handler, options) {
	    var type = typeof handler;
	    if (type === 'function') {
	      vm[action](key, handler, options);
	    } else if (type === 'string') {
	      var methods = vm.$options.methods;
	      var method = methods && methods[handler];
	      if (method) {
	        vm[action](key, method, options);
	      } else {
	        process.env.NODE_ENV !== 'production' && warn('Unknown method: "' + handler + '" when ' + 'registering callback for ' + action + ': "' + key + '".', vm);
	      }
	    } else if (handler && type === 'object') {
	      register(vm, action, key, handler.handler, handler);
	    }
	  }
	
	  /**
	   * Setup recursive attached/detached calls
	   */
	
	  Vue.prototype._initDOMHooks = function () {
	    this.$on('hook:attached', onAttached);
	    this.$on('hook:detached', onDetached);
	  };
	
	  /**
	   * Callback to recursively call attached hook on children
	   */
	
	  function onAttached() {
	    if (!this._isAttached) {
	      this._isAttached = true;
	      this.$children.forEach(callAttach);
	    }
	  }
	
	  /**
	   * Iterator to call attached hook
	   *
	   * @param {Vue} child
	   */
	
	  function callAttach(child) {
	    if (!child._isAttached && inDoc(child.$el)) {
	      child._callHook('attached');
	    }
	  }
	
	  /**
	   * Callback to recursively call detached hook on children
	   */
	
	  function onDetached() {
	    if (this._isAttached) {
	      this._isAttached = false;
	      this.$children.forEach(callDetach);
	    }
	  }
	
	  /**
	   * Iterator to call detached hook
	   *
	   * @param {Vue} child
	   */
	
	  function callDetach(child) {
	    if (child._isAttached && !inDoc(child.$el)) {
	      child._callHook('detached');
	    }
	  }
	
	  /**
	   * Trigger all handlers for a hook
	   *
	   * @param {String} hook
	   */
	
	  Vue.prototype._callHook = function (hook) {
	    this.$emit('pre-hook:' + hook);
	    var handlers = this.$options[hook];
	    if (handlers) {
	      for (var i = 0, j = handlers.length; i < j; i++) {
	        handlers[i].call(this);
	      }
	    }
	    this.$emit('hook:' + hook);
	  };
	}
	
	function noop$1() {}
	
	/**
	 * A directive links a DOM element with a piece of data,
	 * which is the result of evaluating an expression.
	 * It registers a watcher with the expression and calls
	 * the DOM update function when a change is triggered.
	 *
	 * @param {Object} descriptor
	 *                 - {String} name
	 *                 - {Object} def
	 *                 - {String} expression
	 *                 - {Array<Object>} [filters]
	 *                 - {Object} [modifiers]
	 *                 - {Boolean} literal
	 *                 - {String} attr
	 *                 - {String} arg
	 *                 - {String} raw
	 *                 - {String} [ref]
	 *                 - {Array<Object>} [interp]
	 *                 - {Boolean} [hasOneTime]
	 * @param {Vue} vm
	 * @param {Node} el
	 * @param {Vue} [host] - transclusion host component
	 * @param {Object} [scope] - v-for scope
	 * @param {Fragment} [frag] - owner fragment
	 * @constructor
	 */
	function Directive(descriptor, vm, el, host, scope, frag) {
	  this.vm = vm;
	  this.el = el;
	  // copy descriptor properties
	  this.descriptor = descriptor;
	  this.name = descriptor.name;
	  this.expression = descriptor.expression;
	  this.arg = descriptor.arg;
	  this.modifiers = descriptor.modifiers;
	  this.filters = descriptor.filters;
	  this.literal = this.modifiers && this.modifiers.literal;
	  // private
	  this._locked = false;
	  this._bound = false;
	  this._listeners = null;
	  // link context
	  this._host = host;
	  this._scope = scope;
	  this._frag = frag;
	  // store directives on node in dev mode
	  if (process.env.NODE_ENV !== 'production' && this.el) {
	    this.el._vue_directives = this.el._vue_directives || [];
	    this.el._vue_directives.push(this);
	  }
	}
	
	/**
	 * Initialize the directive, mixin definition properties,
	 * setup the watcher, call definition bind() and update()
	 * if present.
	 */
	
	Directive.prototype._bind = function () {
	  var name = this.name;
	  var descriptor = this.descriptor;
	
	  // remove attribute
	  if ((name !== 'cloak' || this.vm._isCompiled) && this.el && this.el.removeAttribute) {
	    var attr = descriptor.attr || 'v-' + name;
	    this.el.removeAttribute(attr);
	  }
	
	  // copy def properties
	  var def = descriptor.def;
	  if (typeof def === 'function') {
	    this.update = def;
	  } else {
	    extend(this, def);
	  }
	
	  // setup directive params
	  this._setupParams();
	
	  // initial bind
	  if (this.bind) {
	    this.bind();
	  }
	  this._bound = true;
	
	  if (this.literal) {
	    this.update && this.update(descriptor.raw);
	  } else if ((this.expression || this.modifiers) && (this.update || this.twoWay) && !this._checkStatement()) {
	    // wrapped updater for context
	    var dir = this;
	    if (this.update) {
	      this._update = function (val, oldVal) {
	        if (!dir._locked) {
	          dir.update(val, oldVal);
	        }
	      };
	    } else {
	      this._update = noop$1;
	    }
	    var preProcess = this._preProcess ? bind(this._preProcess, this) : null;
	    var postProcess = this._postProcess ? bind(this._postProcess, this) : null;
	    var watcher = this._watcher = new Watcher(this.vm, this.expression, this._update, // callback
	    {
	      filters: this.filters,
	      twoWay: this.twoWay,
	      deep: this.deep,
	      preProcess: preProcess,
	      postProcess: postProcess,
	      scope: this._scope
	    });
	    // v-model with inital inline value need to sync back to
	    // model instead of update to DOM on init. They would
	    // set the afterBind hook to indicate that.
	    if (this.afterBind) {
	      this.afterBind();
	    } else if (this.update) {
	      this.update(watcher.value);
	    }
	  }
	};
	
	/**
	 * Setup all param attributes, e.g. track-by,
	 * transition-mode, etc...
	 */
	
	Directive.prototype._setupParams = function () {
	  if (!this.params) {
	    return;
	  }
	  var params = this.params;
	  // swap the params array with a fresh object.
	  this.params = Object.create(null);
	  var i = params.length;
	  var key, val, mappedKey;
	  while (i--) {
	    key = hyphenate(params[i]);
	    mappedKey = camelize(key);
	    val = getBindAttr(this.el, key);
	    if (val != null) {
	      // dynamic
	      this._setupParamWatcher(mappedKey, val);
	    } else {
	      // static
	      val = getAttr(this.el, key);
	      if (val != null) {
	        this.params[mappedKey] = val === '' ? true : val;
	      }
	    }
	  }
	};
	
	/**
	 * Setup a watcher for a dynamic param.
	 *
	 * @param {String} key
	 * @param {String} expression
	 */
	
	Directive.prototype._setupParamWatcher = function (key, expression) {
	  var self = this;
	  var called = false;
	  var unwatch = (this._scope || this.vm).$watch(expression, function (val, oldVal) {
	    self.params[key] = val;
	    // since we are in immediate mode,
	    // only call the param change callbacks if this is not the first update.
	    if (called) {
	      var cb = self.paramWatchers && self.paramWatchers[key];
	      if (cb) {
	        cb.call(self, val, oldVal);
	      }
	    } else {
	      called = true;
	    }
	  }, {
	    immediate: true,
	    user: false
	  });(this._paramUnwatchFns || (this._paramUnwatchFns = [])).push(unwatch);
	};
	
	/**
	 * Check if the directive is a function caller
	 * and if the expression is a callable one. If both true,
	 * we wrap up the expression and use it as the event
	 * handler.
	 *
	 * e.g. on-click="a++"
	 *
	 * @return {Boolean}
	 */
	
	Directive.prototype._checkStatement = function () {
	  var expression = this.expression;
	  if (expression && this.acceptStatement && !isSimplePath(expression)) {
	    var fn = parseExpression(expression).get;
	    var scope = this._scope || this.vm;
	    var handler = function handler(e) {
	      scope.$event = e;
	      fn.call(scope, scope);
	      scope.$event = null;
	    };
	    if (this.filters) {
	      handler = scope._applyFilters(handler, null, this.filters);
	    }
	    this.update(handler);
	    return true;
	  }
	};
	
	/**
	 * Set the corresponding value with the setter.
	 * This should only be used in two-way directives
	 * e.g. v-model.
	 *
	 * @param {*} value
	 * @public
	 */
	
	Directive.prototype.set = function (value) {
	  /* istanbul ignore else */
	  if (this.twoWay) {
	    this._withLock(function () {
	      this._watcher.set(value);
	    });
	  } else if (process.env.NODE_ENV !== 'production') {
	    warn('Directive.set() can only be used inside twoWay' + 'directives.');
	  }
	};
	
	/**
	 * Execute a function while preventing that function from
	 * triggering updates on this directive instance.
	 *
	 * @param {Function} fn
	 */
	
	Directive.prototype._withLock = function (fn) {
	  var self = this;
	  self._locked = true;
	  fn.call(self);
	  nextTick(function () {
	    self._locked = false;
	  });
	};
	
	/**
	 * Convenience method that attaches a DOM event listener
	 * to the directive element and autometically tears it down
	 * during unbind.
	 *
	 * @param {String} event
	 * @param {Function} handler
	 * @param {Boolean} [useCapture]
	 */
	
	Directive.prototype.on = function (event, handler, useCapture) {
	  on(this.el, event, handler, useCapture);(this._listeners || (this._listeners = [])).push([event, handler]);
	};
	
	/**
	 * Teardown the watcher and call unbind.
	 */
	
	Directive.prototype._teardown = function () {
	  if (this._bound) {
	    this._bound = false;
	    if (this.unbind) {
	      this.unbind();
	    }
	    if (this._watcher) {
	      this._watcher.teardown();
	    }
	    var listeners = this._listeners;
	    var i;
	    if (listeners) {
	      i = listeners.length;
	      while (i--) {
	        off(this.el, listeners[i][0], listeners[i][1]);
	      }
	    }
	    var unwatchFns = this._paramUnwatchFns;
	    if (unwatchFns) {
	      i = unwatchFns.length;
	      while (i--) {
	        unwatchFns[i]();
	      }
	    }
	    if (process.env.NODE_ENV !== 'production' && this.el) {
	      this.el._vue_directives.$remove(this);
	    }
	    this.vm = this.el = this._watcher = this._listeners = null;
	  }
	};
	
	function lifecycleMixin (Vue) {
	  /**
	   * Update v-ref for component.
	   *
	   * @param {Boolean} remove
	   */
	
	  Vue.prototype._updateRef = function (remove) {
	    var ref = this.$options._ref;
	    if (ref) {
	      var refs = (this._scope || this._context).$refs;
	      if (remove) {
	        if (refs[ref] === this) {
	          refs[ref] = null;
	        }
	      } else {
	        refs[ref] = this;
	      }
	    }
	  };
	
	  /**
	   * Transclude, compile and link element.
	   *
	   * If a pre-compiled linker is available, that means the
	   * passed in element will be pre-transcluded and compiled
	   * as well - all we need to do is to call the linker.
	   *
	   * Otherwise we need to call transclude/compile/link here.
	   *
	   * @param {Element} el
	   */
	
	  Vue.prototype._compile = function (el) {
	    var options = this.$options;
	
	    // transclude and init element
	    // transclude can potentially replace original
	    // so we need to keep reference; this step also injects
	    // the template and caches the original attributes
	    // on the container node and replacer node.
	    var original = el;
	    el = transclude(el, options);
	    this._initElement(el);
	
	    // handle v-pre on root node (#2026)
	    if (el.nodeType === 1 && getAttr(el, 'v-pre') !== null) {
	      return;
	    }
	
	    // root is always compiled per-instance, because
	    // container attrs and props can be different every time.
	    var contextOptions = this._context && this._context.$options;
	    var rootLinker = compileRoot(el, options, contextOptions);
	
	    // resolve slot distribution
	    resolveSlots(this, options._content);
	
	    // compile and link the rest
	    var contentLinkFn;
	    var ctor = this.constructor;
	    // component compilation can be cached
	    // as long as it's not using inline-template
	    if (options._linkerCachable) {
	      contentLinkFn = ctor.linker;
	      if (!contentLinkFn) {
	        contentLinkFn = ctor.linker = compile(el, options);
	      }
	    }
	
	    // link phase
	    // make sure to link root with prop scope!
	    var rootUnlinkFn = rootLinker(this, el, this._scope);
	    var contentUnlinkFn = contentLinkFn ? contentLinkFn(this, el) : compile(el, options)(this, el);
	
	    // register composite unlink function
	    // to be called during instance destruction
	    this._unlinkFn = function () {
	      rootUnlinkFn();
	      // passing destroying: true to avoid searching and
	      // splicing the directives
	      contentUnlinkFn(true);
	    };
	
	    // finally replace original
	    if (options.replace) {
	      replace(original, el);
	    }
	
	    this._isCompiled = true;
	    this._callHook('compiled');
	  };
	
	  /**
	   * Initialize instance element. Called in the public
	   * $mount() method.
	   *
	   * @param {Element} el
	   */
	
	  Vue.prototype._initElement = function (el) {
	    if (isFragment(el)) {
	      this._isFragment = true;
	      this.$el = this._fragmentStart = el.firstChild;
	      this._fragmentEnd = el.lastChild;
	      // set persisted text anchors to empty
	      if (this._fragmentStart.nodeType === 3) {
	        this._fragmentStart.data = this._fragmentEnd.data = '';
	      }
	      this._fragment = el;
	    } else {
	      this.$el = el;
	    }
	    this.$el.__vue__ = this;
	    this._callHook('beforeCompile');
	  };
	
	  /**
	   * Create and bind a directive to an element.
	   *
	   * @param {Object} descriptor - parsed directive descriptor
	   * @param {Node} node   - target node
	   * @param {Vue} [host] - transclusion host component
	   * @param {Object} [scope] - v-for scope
	   * @param {Fragment} [frag] - owner fragment
	   */
	
	  Vue.prototype._bindDir = function (descriptor, node, host, scope, frag) {
	    this._directives.push(new Directive(descriptor, this, node, host, scope, frag));
	  };
	
	  /**
	   * Teardown an instance, unobserves the data, unbind all the
	   * directives, turn off all the event listeners, etc.
	   *
	   * @param {Boolean} remove - whether to remove the DOM node.
	   * @param {Boolean} deferCleanup - if true, defer cleanup to
	   *                                 be called later
	   */
	
	  Vue.prototype._destroy = function (remove, deferCleanup) {
	    if (this._isBeingDestroyed) {
	      if (!deferCleanup) {
	        this._cleanup();
	      }
	      return;
	    }
	
	    var destroyReady;
	    var pendingRemoval;
	
	    var self = this;
	    // Cleanup should be called either synchronously or asynchronoysly as
	    // callback of this.$remove(), or if remove and deferCleanup are false.
	    // In any case it should be called after all other removing, unbinding and
	    // turning of is done
	    var cleanupIfPossible = function cleanupIfPossible() {
	      if (destroyReady && !pendingRemoval && !deferCleanup) {
	        self._cleanup();
	      }
	    };
	
	    // remove DOM element
	    if (remove && this.$el) {
	      pendingRemoval = true;
	      this.$remove(function () {
	        pendingRemoval = false;
	        cleanupIfPossible();
	      });
	    }
	
	    this._callHook('beforeDestroy');
	    this._isBeingDestroyed = true;
	    var i;
	    // remove self from parent. only necessary
	    // if parent is not being destroyed as well.
	    var parent = this.$parent;
	    if (parent && !parent._isBeingDestroyed) {
	      parent.$children.$remove(this);
	      // unregister ref (remove: true)
	      this._updateRef(true);
	    }
	    // destroy all children.
	    i = this.$children.length;
	    while (i--) {
	      this.$children[i].$destroy();
	    }
	    // teardown props
	    if (this._propsUnlinkFn) {
	      this._propsUnlinkFn();
	    }
	    // teardown all directives. this also tearsdown all
	    // directive-owned watchers.
	    if (this._unlinkFn) {
	      this._unlinkFn();
	    }
	    i = this._watchers.length;
	    while (i--) {
	      this._watchers[i].teardown();
	    }
	    // remove reference to self on $el
	    if (this.$el) {
	      this.$el.__vue__ = null;
	    }
	
	    destroyReady = true;
	    cleanupIfPossible();
	  };
	
	  /**
	   * Clean up to ensure garbage collection.
	   * This is called after the leave transition if there
	   * is any.
	   */
	
	  Vue.prototype._cleanup = function () {
	    if (this._isDestroyed) {
	      return;
	    }
	    // remove self from owner fragment
	    // do it in cleanup so that we can call $destroy with
	    // defer right when a fragment is about to be removed.
	    if (this._frag) {
	      this._frag.children.$remove(this);
	    }
	    // remove reference from data ob
	    // frozen object may not have observer.
	    if (this._data && this._data.__ob__) {
	      this._data.__ob__.removeVm(this);
	    }
	    // Clean up references to private properties and other
	    // instances. preserve reference to _data so that proxy
	    // accessors still work. The only potential side effect
	    // here is that mutating the instance after it's destroyed
	    // may affect the state of other components that are still
	    // observing the same object, but that seems to be a
	    // reasonable responsibility for the user rather than
	    // always throwing an error on them.
	    this.$el = this.$parent = this.$root = this.$children = this._watchers = this._context = this._scope = this._directives = null;
	    // call the last hook...
	    this._isDestroyed = true;
	    this._callHook('destroyed');
	    // turn off all instance listeners.
	    this.$off();
	  };
	}
	
	function miscMixin (Vue) {
	  /**
	   * Apply a list of filter (descriptors) to a value.
	   * Using plain for loops here because this will be called in
	   * the getter of any watcher with filters so it is very
	   * performance sensitive.
	   *
	   * @param {*} value
	   * @param {*} [oldValue]
	   * @param {Array} filters
	   * @param {Boolean} write
	   * @return {*}
	   */
	
	  Vue.prototype._applyFilters = function (value, oldValue, filters, write) {
	    var filter, fn, args, arg, offset, i, l, j, k;
	    for (i = 0, l = filters.length; i < l; i++) {
	      filter = filters[write ? l - i - 1 : i];
	      fn = resolveAsset(this.$options, 'filters', filter.name, true);
	      if (!fn) continue;
	      fn = write ? fn.write : fn.read || fn;
	      if (typeof fn !== 'function') continue;
	      args = write ? [value, oldValue] : [value];
	      offset = write ? 2 : 1;
	      if (filter.args) {
	        for (j = 0, k = filter.args.length; j < k; j++) {
	          arg = filter.args[j];
	          args[j + offset] = arg.dynamic ? this.$get(arg.value) : arg.value;
	        }
	      }
	      value = fn.apply(this, args);
	    }
	    return value;
	  };
	
	  /**
	   * Resolve a component, depending on whether the component
	   * is defined normally or using an async factory function.
	   * Resolves synchronously if already resolved, otherwise
	   * resolves asynchronously and caches the resolved
	   * constructor on the factory.
	   *
	   * @param {String|Function} value
	   * @param {Function} cb
	   */
	
	  Vue.prototype._resolveComponent = function (value, cb) {
	    var factory;
	    if (typeof value === 'function') {
	      factory = value;
	    } else {
	      factory = resolveAsset(this.$options, 'components', value, true);
	    }
	    /* istanbul ignore if */
	    if (!factory) {
	      return;
	    }
	    // async component factory
	    if (!factory.options) {
	      if (factory.resolved) {
	        // cached
	        cb(factory.resolved);
	      } else if (factory.requested) {
	        // pool callbacks
	        factory.pendingCallbacks.push(cb);
	      } else {
	        factory.requested = true;
	        var cbs = factory.pendingCallbacks = [cb];
	        factory.call(this, function resolve(res) {
	          if (isPlainObject(res)) {
	            res = Vue.extend(res);
	          }
	          // cache resolved
	          factory.resolved = res;
	          // invoke callbacks
	          for (var i = 0, l = cbs.length; i < l; i++) {
	            cbs[i](res);
	          }
	        }, function reject(reason) {
	          process.env.NODE_ENV !== 'production' && warn('Failed to resolve async component' + (typeof value === 'string' ? ': ' + value : '') + '. ' + (reason ? '\nReason: ' + reason : ''));
	        });
	      }
	    } else {
	      // normal component
	      cb(factory);
	    }
	  };
	}
	
	var filterRE$1 = /[^|]\|[^|]/;
	
	function dataAPI (Vue) {
	  /**
	   * Get the value from an expression on this vm.
	   *
	   * @param {String} exp
	   * @param {Boolean} [asStatement]
	   * @return {*}
	   */
	
	  Vue.prototype.$get = function (exp, asStatement) {
	    var res = parseExpression(exp);
	    if (res) {
	      if (asStatement) {
	        var self = this;
	        return function statementHandler() {
	          self.$arguments = toArray(arguments);
	          var result = res.get.call(self, self);
	          self.$arguments = null;
	          return result;
	        };
	      } else {
	        try {
	          return res.get.call(this, this);
	        } catch (e) {}
	      }
	    }
	  };
	
	  /**
	   * Set the value from an expression on this vm.
	   * The expression must be a valid left-hand
	   * expression in an assignment.
	   *
	   * @param {String} exp
	   * @param {*} val
	   */
	
	  Vue.prototype.$set = function (exp, val) {
	    var res = parseExpression(exp, true);
	    if (res && res.set) {
	      res.set.call(this, this, val);
	    }
	  };
	
	  /**
	   * Delete a property on the VM
	   *
	   * @param {String} key
	   */
	
	  Vue.prototype.$delete = function (key) {
	    del(this._data, key);
	  };
	
	  /**
	   * Watch an expression, trigger callback when its
	   * value changes.
	   *
	   * @param {String|Function} expOrFn
	   * @param {Function} cb
	   * @param {Object} [options]
	   *                 - {Boolean} deep
	   *                 - {Boolean} immediate
	   * @return {Function} - unwatchFn
	   */
	
	  Vue.prototype.$watch = function (expOrFn, cb, options) {
	    var vm = this;
	    var parsed;
	    if (typeof expOrFn === 'string') {
	      parsed = parseDirective(expOrFn);
	      expOrFn = parsed.expression;
	    }
	    var watcher = new Watcher(vm, expOrFn, cb, {
	      deep: options && options.deep,
	      sync: options && options.sync,
	      filters: parsed && parsed.filters,
	      user: !options || options.user !== false
	    });
	    if (options && options.immediate) {
	      cb.call(vm, watcher.value);
	    }
	    return function unwatchFn() {
	      watcher.teardown();
	    };
	  };
	
	  /**
	   * Evaluate a text directive, including filters.
	   *
	   * @param {String} text
	   * @param {Boolean} [asStatement]
	   * @return {String}
	   */
	
	  Vue.prototype.$eval = function (text, asStatement) {
	    // check for filters.
	    if (filterRE$1.test(text)) {
	      var dir = parseDirective(text);
	      // the filter regex check might give false positive
	      // for pipes inside strings, so it's possible that
	      // we don't get any filters here
	      var val = this.$get(dir.expression, asStatement);
	      return dir.filters ? this._applyFilters(val, null, dir.filters) : val;
	    } else {
	      // no filter
	      return this.$get(text, asStatement);
	    }
	  };
	
	  /**
	   * Interpolate a piece of template text.
	   *
	   * @param {String} text
	   * @return {String}
	   */
	
	  Vue.prototype.$interpolate = function (text) {
	    var tokens = parseText(text);
	    var vm = this;
	    if (tokens) {
	      if (tokens.length === 1) {
	        return vm.$eval(tokens[0].value) + '';
	      } else {
	        return tokens.map(function (token) {
	          return token.tag ? vm.$eval(token.value) : token.value;
	        }).join('');
	      }
	    } else {
	      return text;
	    }
	  };
	
	  /**
	   * Log instance data as a plain JS object
	   * so that it is easier to inspect in console.
	   * This method assumes console is available.
	   *
	   * @param {String} [path]
	   */
	
	  Vue.prototype.$log = function (path) {
	    var data = path ? getPath(this._data, path) : this._data;
	    if (data) {
	      data = clean(data);
	    }
	    // include computed fields
	    if (!path) {
	      var key;
	      for (key in this.$options.computed) {
	        data[key] = clean(this[key]);
	      }
	      if (this._props) {
	        for (key in this._props) {
	          data[key] = clean(this[key]);
	        }
	      }
	    }
	    console.log(data);
	  };
	
	  /**
	   * "clean" a getter/setter converted object into a plain
	   * object copy.
	   *
	   * @param {Object} - obj
	   * @return {Object}
	   */
	
	  function clean(obj) {
	    return JSON.parse(JSON.stringify(obj));
	  }
	}
	
	function domAPI (Vue) {
	  /**
	   * Convenience on-instance nextTick. The callback is
	   * auto-bound to the instance, and this avoids component
	   * modules having to rely on the global Vue.
	   *
	   * @param {Function} fn
	   */
	
	  Vue.prototype.$nextTick = function (fn) {
	    nextTick(fn, this);
	  };
	
	  /**
	   * Append instance to target
	   *
	   * @param {Node} target
	   * @param {Function} [cb]
	   * @param {Boolean} [withTransition] - defaults to true
	   */
	
	  Vue.prototype.$appendTo = function (target, cb, withTransition) {
	    return insert(this, target, cb, withTransition, append, appendWithTransition);
	  };
	
	  /**
	   * Prepend instance to target
	   *
	   * @param {Node} target
	   * @param {Function} [cb]
	   * @param {Boolean} [withTransition] - defaults to true
	   */
	
	  Vue.prototype.$prependTo = function (target, cb, withTransition) {
	    target = query(target);
	    if (target.hasChildNodes()) {
	      this.$before(target.firstChild, cb, withTransition);
	    } else {
	      this.$appendTo(target, cb, withTransition);
	    }
	    return this;
	  };
	
	  /**
	   * Insert instance before target
	   *
	   * @param {Node} target
	   * @param {Function} [cb]
	   * @param {Boolean} [withTransition] - defaults to true
	   */
	
	  Vue.prototype.$before = function (target, cb, withTransition) {
	    return insert(this, target, cb, withTransition, beforeWithCb, beforeWithTransition);
	  };
	
	  /**
	   * Insert instance after target
	   *
	   * @param {Node} target
	   * @param {Function} [cb]
	   * @param {Boolean} [withTransition] - defaults to true
	   */
	
	  Vue.prototype.$after = function (target, cb, withTransition) {
	    target = query(target);
	    if (target.nextSibling) {
	      this.$before(target.nextSibling, cb, withTransition);
	    } else {
	      this.$appendTo(target.parentNode, cb, withTransition);
	    }
	    return this;
	  };
	
	  /**
	   * Remove instance from DOM
	   *
	   * @param {Function} [cb]
	   * @param {Boolean} [withTransition] - defaults to true
	   */
	
	  Vue.prototype.$remove = function (cb, withTransition) {
	    if (!this.$el.parentNode) {
	      return cb && cb();
	    }
	    var inDocument = this._isAttached && inDoc(this.$el);
	    // if we are not in document, no need to check
	    // for transitions
	    if (!inDocument) withTransition = false;
	    var self = this;
	    var realCb = function realCb() {
	      if (inDocument) self._callHook('detached');
	      if (cb) cb();
	    };
	    if (this._isFragment) {
	      removeNodeRange(this._fragmentStart, this._fragmentEnd, this, this._fragment, realCb);
	    } else {
	      var op = withTransition === false ? removeWithCb : removeWithTransition;
	      op(this.$el, this, realCb);
	    }
	    return this;
	  };
	
	  /**
	   * Shared DOM insertion function.
	   *
	   * @param {Vue} vm
	   * @param {Element} target
	   * @param {Function} [cb]
	   * @param {Boolean} [withTransition]
	   * @param {Function} op1 - op for non-transition insert
	   * @param {Function} op2 - op for transition insert
	   * @return vm
	   */
	
	  function insert(vm, target, cb, withTransition, op1, op2) {
	    target = query(target);
	    var targetIsDetached = !inDoc(target);
	    var op = withTransition === false || targetIsDetached ? op1 : op2;
	    var shouldCallHook = !targetIsDetached && !vm._isAttached && !inDoc(vm.$el);
	    if (vm._isFragment) {
	      mapNodeRange(vm._fragmentStart, vm._fragmentEnd, function (node) {
	        op(node, target, vm);
	      });
	      cb && cb();
	    } else {
	      op(vm.$el, target, vm, cb);
	    }
	    if (shouldCallHook) {
	      vm._callHook('attached');
	    }
	    return vm;
	  }
	
	  /**
	   * Check for selectors
	   *
	   * @param {String|Element} el
	   */
	
	  function query(el) {
	    return typeof el === 'string' ? document.querySelector(el) : el;
	  }
	
	  /**
	   * Append operation that takes a callback.
	   *
	   * @param {Node} el
	   * @param {Node} target
	   * @param {Vue} vm - unused
	   * @param {Function} [cb]
	   */
	
	  function append(el, target, vm, cb) {
	    target.appendChild(el);
	    if (cb) cb();
	  }
	
	  /**
	   * InsertBefore operation that takes a callback.
	   *
	   * @param {Node} el
	   * @param {Node} target
	   * @param {Vue} vm - unused
	   * @param {Function} [cb]
	   */
	
	  function beforeWithCb(el, target, vm, cb) {
	    before(el, target);
	    if (cb) cb();
	  }
	
	  /**
	   * Remove operation that takes a callback.
	   *
	   * @param {Node} el
	   * @param {Vue} vm - unused
	   * @param {Function} [cb]
	   */
	
	  function removeWithCb(el, vm, cb) {
	    remove(el);
	    if (cb) cb();
	  }
	}
	
	function eventsAPI (Vue) {
	  /**
	   * Listen on the given `event` with `fn`.
	   *
	   * @param {String} event
	   * @param {Function} fn
	   */
	
	  Vue.prototype.$on = function (event, fn) {
	    (this._events[event] || (this._events[event] = [])).push(fn);
	    modifyListenerCount(this, event, 1);
	    return this;
	  };
	
	  /**
	   * Adds an `event` listener that will be invoked a single
	   * time then automatically removed.
	   *
	   * @param {String} event
	   * @param {Function} fn
	   */
	
	  Vue.prototype.$once = function (event, fn) {
	    var self = this;
	    function on() {
	      self.$off(event, on);
	      fn.apply(this, arguments);
	    }
	    on.fn = fn;
	    this.$on(event, on);
	    return this;
	  };
	
	  /**
	   * Remove the given callback for `event` or all
	   * registered callbacks.
	   *
	   * @param {String} event
	   * @param {Function} fn
	   */
	
	  Vue.prototype.$off = function (event, fn) {
	    var cbs;
	    // all
	    if (!arguments.length) {
	      if (this.$parent) {
	        for (event in this._events) {
	          cbs = this._events[event];
	          if (cbs) {
	            modifyListenerCount(this, event, -cbs.length);
	          }
	        }
	      }
	      this._events = {};
	      return this;
	    }
	    // specific event
	    cbs = this._events[event];
	    if (!cbs) {
	      return this;
	    }
	    if (arguments.length === 1) {
	      modifyListenerCount(this, event, -cbs.length);
	      this._events[event] = null;
	      return this;
	    }
	    // specific handler
	    var cb;
	    var i = cbs.length;
	    while (i--) {
	      cb = cbs[i];
	      if (cb === fn || cb.fn === fn) {
	        modifyListenerCount(this, event, -1);
	        cbs.splice(i, 1);
	        break;
	      }
	    }
	    return this;
	  };
	
	  /**
	   * Trigger an event on self.
	   *
	   * @param {String|Object} event
	   * @return {Boolean} shouldPropagate
	   */
	
	  Vue.prototype.$emit = function (event) {
	    var isSource = typeof event === 'string';
	    event = isSource ? event : event.name;
	    var cbs = this._events[event];
	    var shouldPropagate = isSource || !cbs;
	    if (cbs) {
	      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
	      // this is a somewhat hacky solution to the question raised
	      // in #2102: for an inline component listener like <comp @test="doThis">,
	      // the propagation handling is somewhat broken. Therefore we
	      // need to treat these inline callbacks differently.
	      var hasParentCbs = isSource && cbs.some(function (cb) {
	        return cb._fromParent;
	      });
	      if (hasParentCbs) {
	        shouldPropagate = false;
	      }
	      var args = toArray(arguments, 1);
	      for (var i = 0, l = cbs.length; i < l; i++) {
	        var cb = cbs[i];
	        var res = cb.apply(this, args);
	        if (res === true && (!hasParentCbs || cb._fromParent)) {
	          shouldPropagate = true;
	        }
	      }
	    }
	    return shouldPropagate;
	  };
	
	  /**
	   * Recursively broadcast an event to all children instances.
	   *
	   * @param {String|Object} event
	   * @param {...*} additional arguments
	   */
	
	  Vue.prototype.$broadcast = function (event) {
	    var isSource = typeof event === 'string';
	    event = isSource ? event : event.name;
	    // if no child has registered for this event,
	    // then there's no need to broadcast.
	    if (!this._eventsCount[event]) return;
	    var children = this.$children;
	    var args = toArray(arguments);
	    if (isSource) {
	      // use object event to indicate non-source emit
	      // on children
	      args[0] = { name: event, source: this };
	    }
	    for (var i = 0, l = children.length; i < l; i++) {
	      var child = children[i];
	      var shouldPropagate = child.$emit.apply(child, args);
	      if (shouldPropagate) {
	        child.$broadcast.apply(child, args);
	      }
	    }
	    return this;
	  };
	
	  /**
	   * Recursively propagate an event up the parent chain.
	   *
	   * @param {String} event
	   * @param {...*} additional arguments
	   */
	
	  Vue.prototype.$dispatch = function (event) {
	    var shouldPropagate = this.$emit.apply(this, arguments);
	    if (!shouldPropagate) return;
	    var parent = this.$parent;
	    var args = toArray(arguments);
	    // use object event to indicate non-source emit
	    // on parents
	    args[0] = { name: event, source: this };
	    while (parent) {
	      shouldPropagate = parent.$emit.apply(parent, args);
	      parent = shouldPropagate ? parent.$parent : null;
	    }
	    return this;
	  };
	
	  /**
	   * Modify the listener counts on all parents.
	   * This bookkeeping allows $broadcast to return early when
	   * no child has listened to a certain event.
	   *
	   * @param {Vue} vm
	   * @param {String} event
	   * @param {Number} count
	   */
	
	  var hookRE = /^hook:/;
	  function modifyListenerCount(vm, event, count) {
	    var parent = vm.$parent;
	    // hooks do not get broadcasted so no need
	    // to do bookkeeping for them
	    if (!parent || !count || hookRE.test(event)) return;
	    while (parent) {
	      parent._eventsCount[event] = (parent._eventsCount[event] || 0) + count;
	      parent = parent.$parent;
	    }
	  }
	}
	
	function lifecycleAPI (Vue) {
	  /**
	   * Set instance target element and kick off the compilation
	   * process. The passed in `el` can be a selector string, an
	   * existing Element, or a DocumentFragment (for block
	   * instances).
	   *
	   * @param {Element|DocumentFragment|string} el
	   * @public
	   */
	
	  Vue.prototype.$mount = function (el) {
	    if (this._isCompiled) {
	      process.env.NODE_ENV !== 'production' && warn('$mount() should be called only once.', this);
	      return;
	    }
	    el = query(el);
	    if (!el) {
	      el = document.createElement('div');
	    }
	    this._compile(el);
	    this._initDOMHooks();
	    if (inDoc(this.$el)) {
	      this._callHook('attached');
	      ready.call(this);
	    } else {
	      this.$once('hook:attached', ready);
	    }
	    return this;
	  };
	
	  /**
	   * Mark an instance as ready.
	   */
	
	  function ready() {
	    this._isAttached = true;
	    this._isReady = true;
	    this._callHook('ready');
	  }
	
	  /**
	   * Teardown the instance, simply delegate to the internal
	   * _destroy.
	   *
	   * @param {Boolean} remove
	   * @param {Boolean} deferCleanup
	   */
	
	  Vue.prototype.$destroy = function (remove, deferCleanup) {
	    this._destroy(remove, deferCleanup);
	  };
	
	  /**
	   * Partially compile a piece of DOM and return a
	   * decompile function.
	   *
	   * @param {Element|DocumentFragment} el
	   * @param {Vue} [host]
	   * @param {Object} [scope]
	   * @param {Fragment} [frag]
	   * @return {Function}
	   */
	
	  Vue.prototype.$compile = function (el, host, scope, frag) {
	    return compile(el, this.$options, true)(this, el, host, scope, frag);
	  };
	}
	
	/**
	 * The exposed Vue constructor.
	 *
	 * API conventions:
	 * - public API methods/properties are prefixed with `$`
	 * - internal methods/properties are prefixed with `_`
	 * - non-prefixed properties are assumed to be proxied user
	 *   data.
	 *
	 * @constructor
	 * @param {Object} [options]
	 * @public
	 */
	
	function Vue(options) {
	  this._init(options);
	}
	
	// install internals
	initMixin(Vue);
	stateMixin(Vue);
	eventsMixin(Vue);
	lifecycleMixin(Vue);
	miscMixin(Vue);
	
	// install instance APIs
	dataAPI(Vue);
	domAPI(Vue);
	eventsAPI(Vue);
	lifecycleAPI(Vue);
	
	var slot = {
	
	  priority: SLOT,
	  params: ['name'],
	
	  bind: function bind() {
	    // this was resolved during component transclusion
	    var name = this.params.name || 'default';
	    var content = this.vm._slotContents && this.vm._slotContents[name];
	    if (!content || !content.hasChildNodes()) {
	      this.fallback();
	    } else {
	      this.compile(content.cloneNode(true), this.vm._context, this.vm);
	    }
	  },
	
	  compile: function compile(content, context, host) {
	    if (content && context) {
	      if (this.el.hasChildNodes() && content.childNodes.length === 1 && content.childNodes[0].nodeType === 1 && content.childNodes[0].hasAttribute('v-if')) {
	        // if the inserted slot has v-if
	        // inject fallback content as the v-else
	        var elseBlock = document.createElement('template');
	        elseBlock.setAttribute('v-else', '');
	        elseBlock.innerHTML = this.el.innerHTML;
	        // the else block should be compiled in child scope
	        elseBlock._context = this.vm;
	        content.appendChild(elseBlock);
	      }
	      var scope = host ? host._scope : this._scope;
	      this.unlink = context.$compile(content, host, scope, this._frag);
	    }
	    if (content) {
	      replace(this.el, content);
	    } else {
	      remove(this.el);
	    }
	  },
	
	  fallback: function fallback() {
	    this.compile(extractContent(this.el, true), this.vm);
	  },
	
	  unbind: function unbind() {
	    if (this.unlink) {
	      this.unlink();
	    }
	  }
	};
	
	var partial = {
	
	  priority: PARTIAL,
	
	  params: ['name'],
	
	  // watch changes to name for dynamic partials
	  paramWatchers: {
	    name: function name(value) {
	      vIf.remove.call(this);
	      if (value) {
	        this.insert(value);
	      }
	    }
	  },
	
	  bind: function bind() {
	    this.anchor = createAnchor('v-partial');
	    replace(this.el, this.anchor);
	    this.insert(this.params.name);
	  },
	
	  insert: function insert(id) {
	    var partial = resolveAsset(this.vm.$options, 'partials', id, true);
	    if (partial) {
	      this.factory = new FragmentFactory(this.vm, partial);
	      vIf.insert.call(this);
	    }
	  },
	
	  unbind: function unbind() {
	    if (this.frag) {
	      this.frag.destroy();
	    }
	  }
	};
	
	var elementDirectives = {
	  slot: slot,
	  partial: partial
	};
	
	var convertArray = vFor._postProcess;
	
	/**
	 * Limit filter for arrays
	 *
	 * @param {Number} n
	 * @param {Number} offset (Decimal expected)
	 */
	
	function limitBy(arr, n, offset) {
	  offset = offset ? parseInt(offset, 10) : 0;
	  n = toNumber(n);
	  return typeof n === 'number' ? arr.slice(offset, offset + n) : arr;
	}
	
	/**
	 * Filter filter for arrays
	 *
	 * @param {String} search
	 * @param {String} [delimiter]
	 * @param {String} ...dataKeys
	 */
	
	function filterBy(arr, search, delimiter) {
	  arr = convertArray(arr);
	  if (search == null) {
	    return arr;
	  }
	  if (typeof search === 'function') {
	    return arr.filter(search);
	  }
	  // cast to lowercase string
	  search = ('' + search).toLowerCase();
	  // allow optional `in` delimiter
	  // because why not
	  var n = delimiter === 'in' ? 3 : 2;
	  // extract and flatten keys
	  var keys = Array.prototype.concat.apply([], toArray(arguments, n));
	  var res = [];
	  var item, key, val, j;
	  for (var i = 0, l = arr.length; i < l; i++) {
	    item = arr[i];
	    val = item && item.$value || item;
	    j = keys.length;
	    if (j) {
	      while (j--) {
	        key = keys[j];
	        if (key === '$key' && contains(item.$key, search) || contains(getPath(val, key), search)) {
	          res.push(item);
	          break;
	        }
	      }
	    } else if (contains(item, search)) {
	      res.push(item);
	    }
	  }
	  return res;
	}
	
	/**
	 * Filter filter for arrays
	 *
	 * @param {String|Array<String>|Function} ...sortKeys
	 * @param {Number} [order]
	 */
	
	function orderBy(arr) {
	  var comparator = null;
	  var sortKeys = undefined;
	  arr = convertArray(arr);
	
	  // determine order (last argument)
	  var args = toArray(arguments, 1);
	  var order = args[args.length - 1];
	  if (typeof order === 'number') {
	    order = order < 0 ? -1 : 1;
	    args = args.length > 1 ? args.slice(0, -1) : args;
	  } else {
	    order = 1;
	  }
	
	  // determine sortKeys & comparator
	  var firstArg = args[0];
	  if (!firstArg) {
	    return arr;
	  } else if (typeof firstArg === 'function') {
	    // custom comparator
	    comparator = function (a, b) {
	      return firstArg(a, b) * order;
	    };
	  } else {
	    // string keys. flatten first
	    sortKeys = Array.prototype.concat.apply([], args);
	    comparator = function (a, b, i) {
	      i = i || 0;
	      return i >= sortKeys.length - 1 ? baseCompare(a, b, i) : baseCompare(a, b, i) || comparator(a, b, i + 1);
	    };
	  }
	
	  function baseCompare(a, b, sortKeyIndex) {
	    var sortKey = sortKeys[sortKeyIndex];
	    if (sortKey) {
	      if (sortKey !== '$key') {
	        if (isObject(a) && '$value' in a) a = a.$value;
	        if (isObject(b) && '$value' in b) b = b.$value;
	      }
	      a = isObject(a) ? getPath(a, sortKey) : a;
	      b = isObject(b) ? getPath(b, sortKey) : b;
	    }
	    return a === b ? 0 : a > b ? order : -order;
	  }
	
	  // sort on a copy to avoid mutating original array
	  return arr.slice().sort(comparator);
	}
	
	/**
	 * String contain helper
	 *
	 * @param {*} val
	 * @param {String} search
	 */
	
	function contains(val, search) {
	  var i;
	  if (isPlainObject(val)) {
	    var keys = Object.keys(val);
	    i = keys.length;
	    while (i--) {
	      if (contains(val[keys[i]], search)) {
	        return true;
	      }
	    }
	  } else if (isArray(val)) {
	    i = val.length;
	    while (i--) {
	      if (contains(val[i], search)) {
	        return true;
	      }
	    }
	  } else if (val != null) {
	    return val.toString().toLowerCase().indexOf(search) > -1;
	  }
	}
	
	var digitsRE = /(\d{3})(?=\d)/g;
	
	// asset collections must be a plain object.
	var filters = {
	
	  orderBy: orderBy,
	  filterBy: filterBy,
	  limitBy: limitBy,
	
	  /**
	   * Stringify value.
	   *
	   * @param {Number} indent
	   */
	
	  json: {
	    read: function read(value, indent) {
	      return typeof value === 'string' ? value : JSON.stringify(value, null, arguments.length > 1 ? indent : 2);
	    },
	    write: function write(value) {
	      try {
	        return JSON.parse(value);
	      } catch (e) {
	        return value;
	      }
	    }
	  },
	
	  /**
	   * 'abc' => 'Abc'
	   */
	
	  capitalize: function capitalize(value) {
	    if (!value && value !== 0) return '';
	    value = value.toString();
	    return value.charAt(0).toUpperCase() + value.slice(1);
	  },
	
	  /**
	   * 'abc' => 'ABC'
	   */
	
	  uppercase: function uppercase(value) {
	    return value || value === 0 ? value.toString().toUpperCase() : '';
	  },
	
	  /**
	   * 'AbC' => 'abc'
	   */
	
	  lowercase: function lowercase(value) {
	    return value || value === 0 ? value.toString().toLowerCase() : '';
	  },
	
	  /**
	   * 12345 => $12,345.00
	   *
	   * @param {String} sign
	   * @param {Number} decimals Decimal places
	   */
	
	  currency: function currency(value, _currency, decimals) {
	    value = parseFloat(value);
	    if (!isFinite(value) || !value && value !== 0) return '';
	    _currency = _currency != null ? _currency : '$';
	    decimals = decimals != null ? decimals : 2;
	    var stringified = Math.abs(value).toFixed(decimals);
	    var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
	    var i = _int.length % 3;
	    var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
	    var _float = decimals ? stringified.slice(-1 - decimals) : '';
	    var sign = value < 0 ? '-' : '';
	    return sign + _currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float;
	  },
	
	  /**
	   * 'item' => 'items'
	   *
	   * @params
	   *  an array of strings corresponding to
	   *  the single, double, triple ... forms of the word to
	   *  be pluralized. When the number to be pluralized
	   *  exceeds the length of the args, it will use the last
	   *  entry in the array.
	   *
	   *  e.g. ['single', 'double', 'triple', 'multiple']
	   */
	
	  pluralize: function pluralize(value) {
	    var args = toArray(arguments, 1);
	    var length = args.length;
	    if (length > 1) {
	      var index = value % 10 - 1;
	      return index in args ? args[index] : args[length - 1];
	    } else {
	      return args[0] + (value === 1 ? '' : 's');
	    }
	  },
	
	  /**
	   * Debounce a handler function.
	   *
	   * @param {Function} handler
	   * @param {Number} delay = 300
	   * @return {Function}
	   */
	
	  debounce: function debounce(handler, delay) {
	    if (!handler) return;
	    if (!delay) {
	      delay = 300;
	    }
	    return _debounce(handler, delay);
	  }
	};
	
	function installGlobalAPI (Vue) {
	  /**
	   * Vue and every constructor that extends Vue has an
	   * associated options object, which can be accessed during
	   * compilation steps as `this.constructor.options`.
	   *
	   * These can be seen as the default options of every
	   * Vue instance.
	   */
	
	  Vue.options = {
	    directives: directives,
	    elementDirectives: elementDirectives,
	    filters: filters,
	    transitions: {},
	    components: {},
	    partials: {},
	    replace: true
	  };
	
	  /**
	   * Expose useful internals
	   */
	
	  Vue.util = util;
	  Vue.config = config;
	  Vue.set = set;
	  Vue['delete'] = del;
	  Vue.nextTick = nextTick;
	
	  /**
	   * The following are exposed for advanced usage / plugins
	   */
	
	  Vue.compiler = compiler;
	  Vue.FragmentFactory = FragmentFactory;
	  Vue.internalDirectives = internalDirectives;
	  Vue.parsers = {
	    path: path,
	    text: text,
	    template: template,
	    directive: directive,
	    expression: expression
	  };
	
	  /**
	   * Each instance constructor, including Vue, has a unique
	   * cid. This enables us to create wrapped "child
	   * constructors" for prototypal inheritance and cache them.
	   */
	
	  Vue.cid = 0;
	  var cid = 1;
	
	  /**
	   * Class inheritance
	   *
	   * @param {Object} extendOptions
	   */
	
	  Vue.extend = function (extendOptions) {
	    extendOptions = extendOptions || {};
	    var Super = this;
	    var isFirstExtend = Super.cid === 0;
	    if (isFirstExtend && extendOptions._Ctor) {
	      return extendOptions._Ctor;
	    }
	    var name = extendOptions.name || Super.options.name;
	    if (process.env.NODE_ENV !== 'production') {
	      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
	        warn('Invalid component name: "' + name + '". Component names ' + 'can only contain alphanumeric characaters and the hyphen.');
	        name = null;
	      }
	    }
	    var Sub = createClass(name || 'VueComponent');
	    Sub.prototype = Object.create(Super.prototype);
	    Sub.prototype.constructor = Sub;
	    Sub.cid = cid++;
	    Sub.options = mergeOptions(Super.options, extendOptions);
	    Sub['super'] = Super;
	    // allow further extension
	    Sub.extend = Super.extend;
	    // create asset registers, so extended classes
	    // can have their private assets too.
	    config._assetTypes.forEach(function (type) {
	      Sub[type] = Super[type];
	    });
	    // enable recursive self-lookup
	    if (name) {
	      Sub.options.components[name] = Sub;
	    }
	    // cache constructor
	    if (isFirstExtend) {
	      extendOptions._Ctor = Sub;
	    }
	    return Sub;
	  };
	
	  /**
	   * A function that returns a sub-class constructor with the
	   * given name. This gives us much nicer output when
	   * logging instances in the console.
	   *
	   * @param {String} name
	   * @return {Function}
	   */
	
	  function createClass(name) {
	    /* eslint-disable no-new-func */
	    return new Function('return function ' + classify(name) + ' (options) { this._init(options) }')();
	    /* eslint-enable no-new-func */
	  }
	
	  /**
	   * Plugin system
	   *
	   * @param {Object} plugin
	   */
	
	  Vue.use = function (plugin) {
	    /* istanbul ignore if */
	    if (plugin.installed) {
	      return;
	    }
	    // additional parameters
	    var args = toArray(arguments, 1);
	    args.unshift(this);
	    if (typeof plugin.install === 'function') {
	      plugin.install.apply(plugin, args);
	    } else {
	      plugin.apply(null, args);
	    }
	    plugin.installed = true;
	    return this;
	  };
	
	  /**
	   * Apply a global mixin by merging it into the default
	   * options.
	   */
	
	  Vue.mixin = function (mixin) {
	    Vue.options = mergeOptions(Vue.options, mixin);
	  };
	
	  /**
	   * Create asset registration methods with the following
	   * signature:
	   *
	   * @param {String} id
	   * @param {*} definition
	   */
	
	  config._assetTypes.forEach(function (type) {
	    Vue[type] = function (id, definition) {
	      if (!definition) {
	        return this.options[type + 's'][id];
	      } else {
	        /* istanbul ignore if */
	        if (process.env.NODE_ENV !== 'production') {
	          if (type === 'component' && (commonTagRE.test(id) || reservedTagRE.test(id))) {
	            warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + id);
	          }
	        }
	        if (type === 'component' && isPlainObject(definition)) {
	          if (!definition.name) {
	            definition.name = id;
	          }
	          definition = Vue.extend(definition);
	        }
	        this.options[type + 's'][id] = definition;
	        return definition;
	      }
	    };
	  });
	
	  // expose internal transition API
	  extend(Vue.transition, transition);
	}
	
	installGlobalAPI(Vue);
	
	Vue.version = '1.0.26';
	
	// devtools global hook
	/* istanbul ignore next */
	setTimeout(function () {
	  if (config.devtools) {
	    if (devtools) {
	      devtools.emit('init', Vue);
	    } else if (process.env.NODE_ENV !== 'production' && inBrowser && /Chrome\/\d+/.test(window.navigator.userAgent)) {
	      console.log('Download the Vue Devtools for a better development experience:\n' + 'https://github.com/vuejs/vue-devtools');
	    }
	  }
	}, 0);
	
	module.exports = Vue;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(6)))

/***/ },
/* 6 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	(function () {
	  try {
	    cachedSetTimeout = setTimeout;
	  } catch (e) {
	    cachedSetTimeout = function () {
	      throw new Error('setTimeout is not defined');
	    }
	  }
	  try {
	    cachedClearTimeout = clearTimeout;
	  } catch (e) {
	    cachedClearTimeout = function () {
	      throw new Error('clearTimeout is not defined');
	    }
	  }
	} ())
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = cachedSetTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    cachedClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        cachedSetTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var require;var require;/* WEBPACK VAR INJECTION */(function(global) {/*!
	    localForage -- Offline Storage, Improved
	    Version 1.4.2
	    https://mozilla.github.io/localForage
	    (c) 2013-2015 Mozilla, Apache License 2.0
	*/
	(function(f){if(true){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.localforage = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
	'use strict';
	var immediate = _dereq_(2);
	
	/* istanbul ignore next */
	function INTERNAL() {}
	
	var handlers = {};
	
	var REJECTED = ['REJECTED'];
	var FULFILLED = ['FULFILLED'];
	var PENDING = ['PENDING'];
	
	module.exports = exports = Promise;
	
	function Promise(resolver) {
	  if (typeof resolver !== 'function') {
	    throw new TypeError('resolver must be a function');
	  }
	  this.state = PENDING;
	  this.queue = [];
	  this.outcome = void 0;
	  if (resolver !== INTERNAL) {
	    safelyResolveThenable(this, resolver);
	  }
	}
	
	Promise.prototype["catch"] = function (onRejected) {
	  return this.then(null, onRejected);
	};
	Promise.prototype.then = function (onFulfilled, onRejected) {
	  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
	    typeof onRejected !== 'function' && this.state === REJECTED) {
	    return this;
	  }
	  var promise = new this.constructor(INTERNAL);
	  if (this.state !== PENDING) {
	    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
	    unwrap(promise, resolver, this.outcome);
	  } else {
	    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
	  }
	
	  return promise;
	};
	function QueueItem(promise, onFulfilled, onRejected) {
	  this.promise = promise;
	  if (typeof onFulfilled === 'function') {
	    this.onFulfilled = onFulfilled;
	    this.callFulfilled = this.otherCallFulfilled;
	  }
	  if (typeof onRejected === 'function') {
	    this.onRejected = onRejected;
	    this.callRejected = this.otherCallRejected;
	  }
	}
	QueueItem.prototype.callFulfilled = function (value) {
	  handlers.resolve(this.promise, value);
	};
	QueueItem.prototype.otherCallFulfilled = function (value) {
	  unwrap(this.promise, this.onFulfilled, value);
	};
	QueueItem.prototype.callRejected = function (value) {
	  handlers.reject(this.promise, value);
	};
	QueueItem.prototype.otherCallRejected = function (value) {
	  unwrap(this.promise, this.onRejected, value);
	};
	
	function unwrap(promise, func, value) {
	  immediate(function () {
	    var returnValue;
	    try {
	      returnValue = func(value);
	    } catch (e) {
	      return handlers.reject(promise, e);
	    }
	    if (returnValue === promise) {
	      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
	    } else {
	      handlers.resolve(promise, returnValue);
	    }
	  });
	}
	
	handlers.resolve = function (self, value) {
	  var result = tryCatch(getThen, value);
	  if (result.status === 'error') {
	    return handlers.reject(self, result.value);
	  }
	  var thenable = result.value;
	
	  if (thenable) {
	    safelyResolveThenable(self, thenable);
	  } else {
	    self.state = FULFILLED;
	    self.outcome = value;
	    var i = -1;
	    var len = self.queue.length;
	    while (++i < len) {
	      self.queue[i].callFulfilled(value);
	    }
	  }
	  return self;
	};
	handlers.reject = function (self, error) {
	  self.state = REJECTED;
	  self.outcome = error;
	  var i = -1;
	  var len = self.queue.length;
	  while (++i < len) {
	    self.queue[i].callRejected(error);
	  }
	  return self;
	};
	
	function getThen(obj) {
	  // Make sure we only access the accessor once as required by the spec
	  var then = obj && obj.then;
	  if (obj && typeof obj === 'object' && typeof then === 'function') {
	    return function appyThen() {
	      then.apply(obj, arguments);
	    };
	  }
	}
	
	function safelyResolveThenable(self, thenable) {
	  // Either fulfill, reject or reject with error
	  var called = false;
	  function onError(value) {
	    if (called) {
	      return;
	    }
	    called = true;
	    handlers.reject(self, value);
	  }
	
	  function onSuccess(value) {
	    if (called) {
	      return;
	    }
	    called = true;
	    handlers.resolve(self, value);
	  }
	
	  function tryToUnwrap() {
	    thenable(onSuccess, onError);
	  }
	
	  var result = tryCatch(tryToUnwrap);
	  if (result.status === 'error') {
	    onError(result.value);
	  }
	}
	
	function tryCatch(func, value) {
	  var out = {};
	  try {
	    out.value = func(value);
	    out.status = 'success';
	  } catch (e) {
	    out.status = 'error';
	    out.value = e;
	  }
	  return out;
	}
	
	exports.resolve = resolve;
	function resolve(value) {
	  if (value instanceof this) {
	    return value;
	  }
	  return handlers.resolve(new this(INTERNAL), value);
	}
	
	exports.reject = reject;
	function reject(reason) {
	  var promise = new this(INTERNAL);
	  return handlers.reject(promise, reason);
	}
	
	exports.all = all;
	function all(iterable) {
	  var self = this;
	  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
	    return this.reject(new TypeError('must be an array'));
	  }
	
	  var len = iterable.length;
	  var called = false;
	  if (!len) {
	    return this.resolve([]);
	  }
	
	  var values = new Array(len);
	  var resolved = 0;
	  var i = -1;
	  var promise = new this(INTERNAL);
	
	  while (++i < len) {
	    allResolver(iterable[i], i);
	  }
	  return promise;
	  function allResolver(value, i) {
	    self.resolve(value).then(resolveFromAll, function (error) {
	      if (!called) {
	        called = true;
	        handlers.reject(promise, error);
	      }
	    });
	    function resolveFromAll(outValue) {
	      values[i] = outValue;
	      if (++resolved === len && !called) {
	        called = true;
	        handlers.resolve(promise, values);
	      }
	    }
	  }
	}
	
	exports.race = race;
	function race(iterable) {
	  var self = this;
	  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
	    return this.reject(new TypeError('must be an array'));
	  }
	
	  var len = iterable.length;
	  var called = false;
	  if (!len) {
	    return this.resolve([]);
	  }
	
	  var i = -1;
	  var promise = new this(INTERNAL);
	
	  while (++i < len) {
	    resolver(iterable[i]);
	  }
	  return promise;
	  function resolver(value) {
	    self.resolve(value).then(function (response) {
	      if (!called) {
	        called = true;
	        handlers.resolve(promise, response);
	      }
	    }, function (error) {
	      if (!called) {
	        called = true;
	        handlers.reject(promise, error);
	      }
	    });
	  }
	}
	
	},{"2":2}],2:[function(_dereq_,module,exports){
	(function (global){
	'use strict';
	var Mutation = global.MutationObserver || global.WebKitMutationObserver;
	
	var scheduleDrain;
	
	{
	  if (Mutation) {
	    var called = 0;
	    var observer = new Mutation(nextTick);
	    var element = global.document.createTextNode('');
	    observer.observe(element, {
	      characterData: true
	    });
	    scheduleDrain = function () {
	      element.data = (called = ++called % 2);
	    };
	  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
	    var channel = new global.MessageChannel();
	    channel.port1.onmessage = nextTick;
	    scheduleDrain = function () {
	      channel.port2.postMessage(0);
	    };
	  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
	    scheduleDrain = function () {
	
	      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	      var scriptEl = global.document.createElement('script');
	      scriptEl.onreadystatechange = function () {
	        nextTick();
	
	        scriptEl.onreadystatechange = null;
	        scriptEl.parentNode.removeChild(scriptEl);
	        scriptEl = null;
	      };
	      global.document.documentElement.appendChild(scriptEl);
	    };
	  } else {
	    scheduleDrain = function () {
	      setTimeout(nextTick, 0);
	    };
	  }
	}
	
	var draining;
	var queue = [];
	//named nextTick for less confusing stack traces
	function nextTick() {
	  draining = true;
	  var i, oldQueue;
	  var len = queue.length;
	  while (len) {
	    oldQueue = queue;
	    queue = [];
	    i = -1;
	    while (++i < len) {
	      oldQueue[i]();
	    }
	    len = queue.length;
	  }
	  draining = false;
	}
	
	module.exports = immediate;
	function immediate(task) {
	  if (queue.push(task) === 1 && !draining) {
	    scheduleDrain();
	  }
	}
	
	}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
	},{}],3:[function(_dereq_,module,exports){
	(function (global){
	'use strict';
	if (typeof global.Promise !== 'function') {
	  global.Promise = _dereq_(1);
	}
	
	}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
	},{"1":1}],4:[function(_dereq_,module,exports){
	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function getIDB() {
	    /* global indexedDB,webkitIndexedDB,mozIndexedDB,OIndexedDB,msIndexedDB */
	    if (typeof indexedDB !== 'undefined') {
	        return indexedDB;
	    }
	    if (typeof webkitIndexedDB !== 'undefined') {
	        return webkitIndexedDB;
	    }
	    if (typeof mozIndexedDB !== 'undefined') {
	        return mozIndexedDB;
	    }
	    if (typeof OIndexedDB !== 'undefined') {
	        return OIndexedDB;
	    }
	    if (typeof msIndexedDB !== 'undefined') {
	        return msIndexedDB;
	    }
	}
	
	var idb = getIDB();
	
	function isIndexedDBValid() {
	    try {
	        // Initialize IndexedDB; fall back to vendor-prefixed versions
	        // if needed.
	        if (!idb) {
	            return false;
	        }
	        // We mimic PouchDB here; just UA test for Safari (which, as of
	        // iOS 8/Yosemite, doesn't properly support IndexedDB).
	        // IndexedDB support is broken and different from Blink's.
	        // This is faster than the test case (and it's sync), so we just
	        // do this. *SIGH*
	        // http://bl.ocks.org/nolanlawson/raw/c83e9039edf2278047e9/
	        //
	        // We test for openDatabase because IE Mobile identifies itself
	        // as Safari. Oh the lulz...
	        if (typeof openDatabase !== 'undefined' && typeof navigator !== 'undefined' && navigator.userAgent && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
	            return false;
	        }
	
	        return idb && typeof idb.open === 'function' &&
	        // Some Samsung/HTC Android 4.0-4.3 devices
	        // have older IndexedDB specs; if this isn't available
	        // their IndexedDB is too old for us to use.
	        // (Replaces the onupgradeneeded test.)
	        typeof IDBKeyRange !== 'undefined';
	    } catch (e) {
	        return false;
	    }
	}
	
	function isWebSQLValid() {
	    return typeof openDatabase === 'function';
	}
	
	function isLocalStorageValid() {
	    try {
	        return typeof localStorage !== 'undefined' && 'setItem' in localStorage && localStorage.setItem;
	    } catch (e) {
	        return false;
	    }
	}
	
	// Abstracts constructing a Blob object, so it also works in older
	// browsers that don't support the native Blob constructor. (i.e.
	// old QtWebKit versions, at least).
	// Abstracts constructing a Blob object, so it also works in older
	// browsers that don't support the native Blob constructor. (i.e.
	// old QtWebKit versions, at least).
	function createBlob(parts, properties) {
	    /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
	    parts = parts || [];
	    properties = properties || {};
	    try {
	        return new Blob(parts, properties);
	    } catch (e) {
	        if (e.name !== 'TypeError') {
	            throw e;
	        }
	        var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder : typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : WebKitBlobBuilder;
	        var builder = new Builder();
	        for (var i = 0; i < parts.length; i += 1) {
	            builder.append(parts[i]);
	        }
	        return builder.getBlob(properties.type);
	    }
	}
	
	// This is CommonJS because lie is an external dependency, so Rollup
	// can just ignore it.
	if (typeof Promise === 'undefined' && typeof _dereq_ !== 'undefined') {
	    _dereq_(3);
	}
	var Promise$1 = Promise;
	
	function executeCallback(promise, callback) {
	    if (callback) {
	        promise.then(function (result) {
	            callback(null, result);
	        }, function (error) {
	            callback(error);
	        });
	    }
	}
	
	// Some code originally from async_storage.js in
	// [Gaia](https://github.com/mozilla-b2g/gaia).
	
	var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
	var supportsBlobs;
	var dbContexts;
	
	// Transform a binary string to an array buffer, because otherwise
	// weird stuff happens when you try to work with the binary string directly.
	// It is known.
	// From http://stackoverflow.com/questions/14967647/ (continues on next line)
	// encode-decode-image-with-base64-breaks-image (2013-04-21)
	function _binStringToArrayBuffer(bin) {
	    var length = bin.length;
	    var buf = new ArrayBuffer(length);
	    var arr = new Uint8Array(buf);
	    for (var i = 0; i < length; i++) {
	        arr[i] = bin.charCodeAt(i);
	    }
	    return buf;
	}
	
	//
	// Blobs are not supported in all versions of IndexedDB, notably
	// Chrome <37 and Android <5. In those versions, storing a blob will throw.
	//
	// Various other blob bugs exist in Chrome v37-42 (inclusive).
	// Detecting them is expensive and confusing to users, and Chrome 37-42
	// is at very low usage worldwide, so we do a hacky userAgent check instead.
	//
	// content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
	// 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
	// FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
	//
	// Code borrowed from PouchDB. See:
	// https://github.com/pouchdb/pouchdb/blob/9c25a23/src/adapters/idb/blobSupport.js
	//
	function _checkBlobSupportWithoutCaching(txn) {
	    return new Promise$1(function (resolve) {
	        var blob = createBlob(['']);
	        txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');
	
	        txn.onabort = function (e) {
	            // If the transaction aborts now its due to not being able to
	            // write to the database, likely due to the disk being full
	            e.preventDefault();
	            e.stopPropagation();
	            resolve(false);
	        };
	
	        txn.oncomplete = function () {
	            var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
	            var matchedEdge = navigator.userAgent.match(/Edge\//);
	            // MS Edge pretends to be Chrome 42:
	            // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
	            resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
	        };
	    })["catch"](function () {
	        return false; // error, so assume unsupported
	    });
	}
	
	function _checkBlobSupport(idb) {
	    if (typeof supportsBlobs === 'boolean') {
	        return Promise$1.resolve(supportsBlobs);
	    }
	    return _checkBlobSupportWithoutCaching(idb).then(function (value) {
	        supportsBlobs = value;
	        return supportsBlobs;
	    });
	}
	
	function _deferReadiness(dbInfo) {
	    var dbContext = dbContexts[dbInfo.name];
	
	    // Create a deferred object representing the current database operation.
	    var deferredOperation = {};
	
	    deferredOperation.promise = new Promise$1(function (resolve) {
	        deferredOperation.resolve = resolve;
	    });
	
	    // Enqueue the deferred operation.
	    dbContext.deferredOperations.push(deferredOperation);
	
	    // Chain its promise to the database readiness.
	    if (!dbContext.dbReady) {
	        dbContext.dbReady = deferredOperation.promise;
	    } else {
	        dbContext.dbReady = dbContext.dbReady.then(function () {
	            return deferredOperation.promise;
	        });
	    }
	}
	
	function _advanceReadiness(dbInfo) {
	    var dbContext = dbContexts[dbInfo.name];
	
	    // Dequeue a deferred operation.
	    var deferredOperation = dbContext.deferredOperations.pop();
	
	    // Resolve its promise (which is part of the database readiness
	    // chain of promises).
	    if (deferredOperation) {
	        deferredOperation.resolve();
	    }
	}
	
	function _getConnection(dbInfo, upgradeNeeded) {
	    return new Promise$1(function (resolve, reject) {
	
	        if (dbInfo.db) {
	            if (upgradeNeeded) {
	                _deferReadiness(dbInfo);
	                dbInfo.db.close();
	            } else {
	                return resolve(dbInfo.db);
	            }
	        }
	
	        var dbArgs = [dbInfo.name];
	
	        if (upgradeNeeded) {
	            dbArgs.push(dbInfo.version);
	        }
	
	        var openreq = idb.open.apply(idb, dbArgs);
	
	        if (upgradeNeeded) {
	            openreq.onupgradeneeded = function (e) {
	                var db = openreq.result;
	                try {
	                    db.createObjectStore(dbInfo.storeName);
	                    if (e.oldVersion <= 1) {
	                        // Added when support for blob shims was added
	                        db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
	                    }
	                } catch (ex) {
	                    if (ex.name === 'ConstraintError') {
	                        console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + e.oldVersion + ' to version ' + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
	                    } else {
	                        throw ex;
	                    }
	                }
	            };
	        }
	
	        openreq.onerror = function () {
	            reject(openreq.error);
	        };
	
	        openreq.onsuccess = function () {
	            resolve(openreq.result);
	            _advanceReadiness(dbInfo);
	        };
	    });
	}
	
	function _getOriginalConnection(dbInfo) {
	    return _getConnection(dbInfo, false);
	}
	
	function _getUpgradedConnection(dbInfo) {
	    return _getConnection(dbInfo, true);
	}
	
	function _isUpgradeNeeded(dbInfo, defaultVersion) {
	    if (!dbInfo.db) {
	        return true;
	    }
	
	    var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
	    var isDowngrade = dbInfo.version < dbInfo.db.version;
	    var isUpgrade = dbInfo.version > dbInfo.db.version;
	
	    if (isDowngrade) {
	        // If the version is not the default one
	        // then warn for impossible downgrade.
	        if (dbInfo.version !== defaultVersion) {
	            console.warn('The database "' + dbInfo.name + '"' + ' can\'t be downgraded from version ' + dbInfo.db.version + ' to version ' + dbInfo.version + '.');
	        }
	        // Align the versions to prevent errors.
	        dbInfo.version = dbInfo.db.version;
	    }
	
	    if (isUpgrade || isNewStore) {
	        // If the store is new then increment the version (if needed).
	        // This will trigger an "upgradeneeded" event which is required
	        // for creating a store.
	        if (isNewStore) {
	            var incVersion = dbInfo.db.version + 1;
	            if (incVersion > dbInfo.version) {
	                dbInfo.version = incVersion;
	            }
	        }
	
	        return true;
	    }
	
	    return false;
	}
	
	// encode a blob for indexeddb engines that don't support blobs
	function _encodeBlob(blob) {
	    return new Promise$1(function (resolve, reject) {
	        var reader = new FileReader();
	        reader.onerror = reject;
	        reader.onloadend = function (e) {
	            var base64 = btoa(e.target.result || '');
	            resolve({
	                __local_forage_encoded_blob: true,
	                data: base64,
	                type: blob.type
	            });
	        };
	        reader.readAsBinaryString(blob);
	    });
	}
	
	// decode an encoded blob
	function _decodeBlob(encodedBlob) {
	    var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
	    return createBlob([arrayBuff], { type: encodedBlob.type });
	}
	
	// is this one of our fancy encoded blobs?
	function _isEncodedBlob(value) {
	    return value && value.__local_forage_encoded_blob;
	}
	
	// Specialize the default `ready()` function by making it dependent
	// on the current database operations. Thus, the driver will be actually
	// ready when it's been initialized (default) *and* there are no pending
	// operations on the database (initiated by some other instances).
	function _fullyReady(callback) {
	    var self = this;
	
	    var promise = self._initReady().then(function () {
	        var dbContext = dbContexts[self._dbInfo.name];
	
	        if (dbContext && dbContext.dbReady) {
	            return dbContext.dbReady;
	        }
	    });
	
	    promise.then(callback, callback);
	    return promise;
	}
	
	// Open the IndexedDB database (automatically creates one if one didn't
	// previously exist), using any options set in the config.
	function _initStorage(options) {
	    var self = this;
	    var dbInfo = {
	        db: null
	    };
	
	    if (options) {
	        for (var i in options) {
	            dbInfo[i] = options[i];
	        }
	    }
	
	    // Initialize a singleton container for all running localForages.
	    if (!dbContexts) {
	        dbContexts = {};
	    }
	
	    // Get the current context of the database;
	    var dbContext = dbContexts[dbInfo.name];
	
	    // ...or create a new context.
	    if (!dbContext) {
	        dbContext = {
	            // Running localForages sharing a database.
	            forages: [],
	            // Shared database.
	            db: null,
	            // Database readiness (promise).
	            dbReady: null,
	            // Deferred operations on the database.
	            deferredOperations: []
	        };
	        // Register the new context in the global container.
	        dbContexts[dbInfo.name] = dbContext;
	    }
	
	    // Register itself as a running localForage in the current context.
	    dbContext.forages.push(self);
	
	    // Replace the default `ready()` function with the specialized one.
	    if (!self._initReady) {
	        self._initReady = self.ready;
	        self.ready = _fullyReady;
	    }
	
	    // Create an array of initialization states of the related localForages.
	    var initPromises = [];
	
	    function ignoreErrors() {
	        // Don't handle errors here,
	        // just makes sure related localForages aren't pending.
	        return Promise$1.resolve();
	    }
	
	    for (var j = 0; j < dbContext.forages.length; j++) {
	        var forage = dbContext.forages[j];
	        if (forage !== self) {
	            // Don't wait for itself...
	            initPromises.push(forage._initReady()["catch"](ignoreErrors));
	        }
	    }
	
	    // Take a snapshot of the related localForages.
	    var forages = dbContext.forages.slice(0);
	
	    // Initialize the connection process only when
	    // all the related localForages aren't pending.
	    return Promise$1.all(initPromises).then(function () {
	        dbInfo.db = dbContext.db;
	        // Get the connection or open a new one without upgrade.
	        return _getOriginalConnection(dbInfo);
	    }).then(function (db) {
	        dbInfo.db = db;
	        if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
	            // Reopen the database for upgrading.
	            return _getUpgradedConnection(dbInfo);
	        }
	        return db;
	    }).then(function (db) {
	        dbInfo.db = dbContext.db = db;
	        self._dbInfo = dbInfo;
	        // Share the final connection amongst related localForages.
	        for (var k = 0; k < forages.length; k++) {
	            var forage = forages[k];
	            if (forage !== self) {
	                // Self is already up-to-date.
	                forage._dbInfo.db = dbInfo.db;
	                forage._dbInfo.version = dbInfo.version;
	            }
	        }
	    });
	}
	
	function getItem(key, callback) {
	    var self = this;
	
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
	            var req = store.get(key);
	
	            req.onsuccess = function () {
	                var value = req.result;
	                if (value === undefined) {
	                    value = null;
	                }
	                if (_isEncodedBlob(value)) {
	                    value = _decodeBlob(value);
	                }
	                resolve(value);
	            };
	
	            req.onerror = function () {
	                reject(req.error);
	            };
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Iterate over all items stored in database.
	function iterate(iterator, callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
	
	            var req = store.openCursor();
	            var iterationNumber = 1;
	
	            req.onsuccess = function () {
	                var cursor = req.result;
	
	                if (cursor) {
	                    var value = cursor.value;
	                    if (_isEncodedBlob(value)) {
	                        value = _decodeBlob(value);
	                    }
	                    var result = iterator(value, cursor.key, iterationNumber++);
	
	                    if (result !== void 0) {
	                        resolve(result);
	                    } else {
	                        cursor["continue"]();
	                    }
	                } else {
	                    resolve();
	                }
	            };
	
	            req.onerror = function () {
	                reject(req.error);
	            };
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	
	    return promise;
	}
	
	function setItem(key, value, callback) {
	    var self = this;
	
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }
	
	    var promise = new Promise$1(function (resolve, reject) {
	        var dbInfo;
	        self.ready().then(function () {
	            dbInfo = self._dbInfo;
	            if (value instanceof Blob) {
	                return _checkBlobSupport(dbInfo.db).then(function (blobSupport) {
	                    if (blobSupport) {
	                        return value;
	                    }
	                    return _encodeBlob(value);
	                });
	            }
	            return value;
	        }).then(function (value) {
	            var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
	            var store = transaction.objectStore(dbInfo.storeName);
	
	            // The reason we don't _save_ null is because IE 10 does
	            // not support saving the `null` type in IndexedDB. How
	            // ironic, given the bug below!
	            // See: https://github.com/mozilla/localForage/issues/161
	            if (value === null) {
	                value = undefined;
	            }
	
	            transaction.oncomplete = function () {
	                // Cast to undefined so the value passed to
	                // callback/promise is the same as what one would get out
	                // of `getItem()` later. This leads to some weirdness
	                // (setItem('foo', undefined) will return `null`), but
	                // it's not my fault localStorage is our baseline and that
	                // it's weird.
	                if (value === undefined) {
	                    value = null;
	                }
	
	                resolve(value);
	            };
	            transaction.onabort = transaction.onerror = function () {
	                var err = req.error ? req.error : req.transaction.error;
	                reject(err);
	            };
	
	            var req = store.put(value, key);
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function removeItem(key, callback) {
	    var self = this;
	
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
	            var store = transaction.objectStore(dbInfo.storeName);
	
	            // We use a Grunt task to make this safe for IE and some
	            // versions of Android (including those used by Cordova).
	            // Normally IE won't like `.delete()` and will insist on
	            // using `['delete']()`, but we have a build step that
	            // fixes this for us now.
	            var req = store["delete"](key);
	            transaction.oncomplete = function () {
	                resolve();
	            };
	
	            transaction.onerror = function () {
	                reject(req.error);
	            };
	
	            // The request will be also be aborted if we've exceeded our storage
	            // space.
	            transaction.onabort = function () {
	                var err = req.error ? req.error : req.transaction.error;
	                reject(err);
	            };
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function clear(callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
	            var store = transaction.objectStore(dbInfo.storeName);
	            var req = store.clear();
	
	            transaction.oncomplete = function () {
	                resolve();
	            };
	
	            transaction.onabort = transaction.onerror = function () {
	                var err = req.error ? req.error : req.transaction.error;
	                reject(err);
	            };
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function length(callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
	            var req = store.count();
	
	            req.onsuccess = function () {
	                resolve(req.result);
	            };
	
	            req.onerror = function () {
	                reject(req.error);
	            };
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function key(n, callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        if (n < 0) {
	            resolve(null);
	
	            return;
	        }
	
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
	
	            var advanced = false;
	            var req = store.openCursor();
	            req.onsuccess = function () {
	                var cursor = req.result;
	                if (!cursor) {
	                    // this means there weren't enough keys
	                    resolve(null);
	
	                    return;
	                }
	
	                if (n === 0) {
	                    // We have the first key, return it if that's what they
	                    // wanted.
	                    resolve(cursor.key);
	                } else {
	                    if (!advanced) {
	                        // Otherwise, ask the cursor to skip ahead n
	                        // records.
	                        advanced = true;
	                        cursor.advance(n);
	                    } else {
	                        // When we get here, we've got the nth key.
	                        resolve(cursor.key);
	                    }
	                }
	            };
	
	            req.onerror = function () {
	                reject(req.error);
	            };
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function keys(callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
	
	            var req = store.openCursor();
	            var keys = [];
	
	            req.onsuccess = function () {
	                var cursor = req.result;
	
	                if (!cursor) {
	                    resolve(keys);
	                    return;
	                }
	
	                keys.push(cursor.key);
	                cursor["continue"]();
	            };
	
	            req.onerror = function () {
	                reject(req.error);
	            };
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	var asyncStorage = {
	    _driver: 'asyncStorage',
	    _initStorage: _initStorage,
	    iterate: iterate,
	    getItem: getItem,
	    setItem: setItem,
	    removeItem: removeItem,
	    clear: clear,
	    length: length,
	    key: key,
	    keys: keys
	};
	
	// Sadly, the best way to save binary data in WebSQL/localStorage is serializing
	// it to Base64, so this is how we store it to prevent very strange errors with less
	// verbose ways of binary <-> string data storage.
	var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	
	var BLOB_TYPE_PREFIX = '~~local_forage_type~';
	var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;
	
	var SERIALIZED_MARKER = '__lfsc__:';
	var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;
	
	// OMG the serializations!
	var TYPE_ARRAYBUFFER = 'arbf';
	var TYPE_BLOB = 'blob';
	var TYPE_INT8ARRAY = 'si08';
	var TYPE_UINT8ARRAY = 'ui08';
	var TYPE_UINT8CLAMPEDARRAY = 'uic8';
	var TYPE_INT16ARRAY = 'si16';
	var TYPE_INT32ARRAY = 'si32';
	var TYPE_UINT16ARRAY = 'ur16';
	var TYPE_UINT32ARRAY = 'ui32';
	var TYPE_FLOAT32ARRAY = 'fl32';
	var TYPE_FLOAT64ARRAY = 'fl64';
	var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;
	
	function stringToBuffer(serializedString) {
	    // Fill the string into a ArrayBuffer.
	    var bufferLength = serializedString.length * 0.75;
	    var len = serializedString.length;
	    var i;
	    var p = 0;
	    var encoded1, encoded2, encoded3, encoded4;
	
	    if (serializedString[serializedString.length - 1] === '=') {
	        bufferLength--;
	        if (serializedString[serializedString.length - 2] === '=') {
	            bufferLength--;
	        }
	    }
	
	    var buffer = new ArrayBuffer(bufferLength);
	    var bytes = new Uint8Array(buffer);
	
	    for (i = 0; i < len; i += 4) {
	        encoded1 = BASE_CHARS.indexOf(serializedString[i]);
	        encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
	        encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
	        encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);
	
	        /*jslint bitwise: true */
	        bytes[p++] = encoded1 << 2 | encoded2 >> 4;
	        bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
	        bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
	    }
	    return buffer;
	}
	
	// Converts a buffer to a string to store, serialized, in the backend
	// storage library.
	function bufferToString(buffer) {
	    // base64-arraybuffer
	    var bytes = new Uint8Array(buffer);
	    var base64String = '';
	    var i;
	
	    for (i = 0; i < bytes.length; i += 3) {
	        /*jslint bitwise: true */
	        base64String += BASE_CHARS[bytes[i] >> 2];
	        base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
	        base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
	        base64String += BASE_CHARS[bytes[i + 2] & 63];
	    }
	
	    if (bytes.length % 3 === 2) {
	        base64String = base64String.substring(0, base64String.length - 1) + '=';
	    } else if (bytes.length % 3 === 1) {
	        base64String = base64String.substring(0, base64String.length - 2) + '==';
	    }
	
	    return base64String;
	}
	
	// Serialize a value, afterwards executing a callback (which usually
	// instructs the `setItem()` callback/promise to be executed). This is how
	// we store binary data with localStorage.
	function serialize(value, callback) {
	    var valueString = '';
	    if (value) {
	        valueString = value.toString();
	    }
	
	    // Cannot use `value instanceof ArrayBuffer` or such here, as these
	    // checks fail when running the tests using casper.js...
	    //
	    // TODO: See why those tests fail and use a better solution.
	    if (value && (value.toString() === '[object ArrayBuffer]' || value.buffer && value.buffer.toString() === '[object ArrayBuffer]')) {
	        // Convert binary arrays to a string and prefix the string with
	        // a special marker.
	        var buffer;
	        var marker = SERIALIZED_MARKER;
	
	        if (value instanceof ArrayBuffer) {
	            buffer = value;
	            marker += TYPE_ARRAYBUFFER;
	        } else {
	            buffer = value.buffer;
	
	            if (valueString === '[object Int8Array]') {
	                marker += TYPE_INT8ARRAY;
	            } else if (valueString === '[object Uint8Array]') {
	                marker += TYPE_UINT8ARRAY;
	            } else if (valueString === '[object Uint8ClampedArray]') {
	                marker += TYPE_UINT8CLAMPEDARRAY;
	            } else if (valueString === '[object Int16Array]') {
	                marker += TYPE_INT16ARRAY;
	            } else if (valueString === '[object Uint16Array]') {
	                marker += TYPE_UINT16ARRAY;
	            } else if (valueString === '[object Int32Array]') {
	                marker += TYPE_INT32ARRAY;
	            } else if (valueString === '[object Uint32Array]') {
	                marker += TYPE_UINT32ARRAY;
	            } else if (valueString === '[object Float32Array]') {
	                marker += TYPE_FLOAT32ARRAY;
	            } else if (valueString === '[object Float64Array]') {
	                marker += TYPE_FLOAT64ARRAY;
	            } else {
	                callback(new Error('Failed to get type for BinaryArray'));
	            }
	        }
	
	        callback(marker + bufferToString(buffer));
	    } else if (valueString === '[object Blob]') {
	        // Conver the blob to a binaryArray and then to a string.
	        var fileReader = new FileReader();
	
	        fileReader.onload = function () {
	            // Backwards-compatible prefix for the blob type.
	            var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);
	
	            callback(SERIALIZED_MARKER + TYPE_BLOB + str);
	        };
	
	        fileReader.readAsArrayBuffer(value);
	    } else {
	        try {
	            callback(JSON.stringify(value));
	        } catch (e) {
	            console.error("Couldn't convert value into a JSON string: ", value);
	
	            callback(null, e);
	        }
	    }
	}
	
	// Deserialize data we've inserted into a value column/field. We place
	// special markers into our strings to mark them as encoded; this isn't
	// as nice as a meta field, but it's the only sane thing we can do whilst
	// keeping localStorage support intact.
	//
	// Oftentimes this will just deserialize JSON content, but if we have a
	// special marker (SERIALIZED_MARKER, defined above), we will extract
	// some kind of arraybuffer/binary data/typed array out of the string.
	function deserialize(value) {
	    // If we haven't marked this string as being specially serialized (i.e.
	    // something other than serialized JSON), we can just return it and be
	    // done with it.
	    if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
	        return JSON.parse(value);
	    }
	
	    // The following code deals with deserializing some kind of Blob or
	    // TypedArray. First we separate out the type of data we're dealing
	    // with from the data itself.
	    var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
	    var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);
	
	    var blobType;
	    // Backwards-compatible blob type serialization strategy.
	    // DBs created with older versions of localForage will simply not have the blob type.
	    if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
	        var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
	        blobType = matcher[1];
	        serializedString = serializedString.substring(matcher[0].length);
	    }
	    var buffer = stringToBuffer(serializedString);
	
	    // Return the right type based on the code/type set during
	    // serialization.
	    switch (type) {
	        case TYPE_ARRAYBUFFER:
	            return buffer;
	        case TYPE_BLOB:
	            return createBlob([buffer], { type: blobType });
	        case TYPE_INT8ARRAY:
	            return new Int8Array(buffer);
	        case TYPE_UINT8ARRAY:
	            return new Uint8Array(buffer);
	        case TYPE_UINT8CLAMPEDARRAY:
	            return new Uint8ClampedArray(buffer);
	        case TYPE_INT16ARRAY:
	            return new Int16Array(buffer);
	        case TYPE_UINT16ARRAY:
	            return new Uint16Array(buffer);
	        case TYPE_INT32ARRAY:
	            return new Int32Array(buffer);
	        case TYPE_UINT32ARRAY:
	            return new Uint32Array(buffer);
	        case TYPE_FLOAT32ARRAY:
	            return new Float32Array(buffer);
	        case TYPE_FLOAT64ARRAY:
	            return new Float64Array(buffer);
	        default:
	            throw new Error('Unkown type: ' + type);
	    }
	}
	
	var localforageSerializer = {
	    serialize: serialize,
	    deserialize: deserialize,
	    stringToBuffer: stringToBuffer,
	    bufferToString: bufferToString
	};
	
	/*
	 * Includes code from:
	 *
	 * base64-arraybuffer
	 * https://github.com/niklasvh/base64-arraybuffer
	 *
	 * Copyright (c) 2012 Niklas von Hertzen
	 * Licensed under the MIT license.
	 */
	// Open the WebSQL database (automatically creates one if one didn't
	// previously exist), using any options set in the config.
	function _initStorage$1(options) {
	    var self = this;
	    var dbInfo = {
	        db: null
	    };
	
	    if (options) {
	        for (var i in options) {
	            dbInfo[i] = typeof options[i] !== 'string' ? options[i].toString() : options[i];
	        }
	    }
	
	    var dbInfoPromise = new Promise$1(function (resolve, reject) {
	        // Open the database; the openDatabase API will automatically
	        // create it for us if it doesn't exist.
	        try {
	            dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
	        } catch (e) {
	            return reject(e);
	        }
	
	        // Create our key/value table if it doesn't exist.
	        dbInfo.db.transaction(function (t) {
	            t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' (id INTEGER PRIMARY KEY, key unique, value)', [], function () {
	                self._dbInfo = dbInfo;
	                resolve();
	            }, function (t, error) {
	                reject(error);
	            });
	        });
	    });
	
	    dbInfo.serializer = localforageSerializer;
	    return dbInfoPromise;
	}
	
	function getItem$1(key, callback) {
	    var self = this;
	
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                t.executeSql('SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function (t, results) {
	                    var result = results.rows.length ? results.rows.item(0).value : null;
	
	                    // Check to see if this is serialized content we need to
	                    // unpack.
	                    if (result) {
	                        result = dbInfo.serializer.deserialize(result);
	                    }
	
	                    resolve(result);
	                }, function (t, error) {
	
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function iterate$1(iterator, callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	
	            dbInfo.db.transaction(function (t) {
	                t.executeSql('SELECT * FROM ' + dbInfo.storeName, [], function (t, results) {
	                    var rows = results.rows;
	                    var length = rows.length;
	
	                    for (var i = 0; i < length; i++) {
	                        var item = rows.item(i);
	                        var result = item.value;
	
	                        // Check to see if this is serialized content
	                        // we need to unpack.
	                        if (result) {
	                            result = dbInfo.serializer.deserialize(result);
	                        }
	
	                        result = iterator(result, item.key, i + 1);
	
	                        // void(0) prevents problems with redefinition
	                        // of `undefined`.
	                        if (result !== void 0) {
	                            resolve(result);
	                            return;
	                        }
	                    }
	
	                    resolve();
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function setItem$1(key, value, callback) {
	    var self = this;
	
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            // The localStorage API doesn't return undefined values in an
	            // "expected" way, so undefined is always cast to null in all
	            // drivers. See: https://github.com/mozilla/localForage/pull/42
	            if (value === undefined) {
	                value = null;
	            }
	
	            // Save the original value to pass to the callback.
	            var originalValue = value;
	
	            var dbInfo = self._dbInfo;
	            dbInfo.serializer.serialize(value, function (value, error) {
	                if (error) {
	                    reject(error);
	                } else {
	                    dbInfo.db.transaction(function (t) {
	                        t.executeSql('INSERT OR REPLACE INTO ' + dbInfo.storeName + ' (key, value) VALUES (?, ?)', [key, value], function () {
	                            resolve(originalValue);
	                        }, function (t, error) {
	                            reject(error);
	                        });
	                    }, function (sqlError) {
	                        // The transaction failed; check
	                        // to see if it's a quota error.
	                        if (sqlError.code === sqlError.QUOTA_ERR) {
	                            // We reject the callback outright for now, but
	                            // it's worth trying to re-run the transaction.
	                            // Even if the user accepts the prompt to use
	                            // more storage on Safari, this error will
	                            // be called.
	                            //
	                            // TODO: Try to re-run the transaction.
	                            reject(sqlError);
	                        }
	                    });
	                }
	            });
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function removeItem$1(key, callback) {
	    var self = this;
	
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                t.executeSql('DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function () {
	                    resolve();
	                }, function (t, error) {
	
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Deletes every item in the table.
	// TODO: Find out if this resets the AUTO_INCREMENT number.
	function clear$1(callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                t.executeSql('DELETE FROM ' + dbInfo.storeName, [], function () {
	                    resolve();
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Does a simple `COUNT(key)` to get the number of items stored in
	// localForage.
	function length$1(callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                // Ahhh, SQL makes this one soooooo easy.
	                t.executeSql('SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function (t, results) {
	                    var result = results.rows.item(0).c;
	
	                    resolve(result);
	                }, function (t, error) {
	
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Return the key located at key index X; essentially gets the key from a
	// `WHERE id = ?`. This is the most efficient way I can think to implement
	// this rarely-used (in my experience) part of the API, but it can seem
	// inconsistent, because we do `INSERT OR REPLACE INTO` on `setItem()`, so
	// the ID of each key will change every time it's updated. Perhaps a stored
	// procedure for the `setItem()` SQL would solve this problem?
	// TODO: Don't change ID on `setItem()`.
	function key$1(n, callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                t.executeSql('SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function (t, results) {
	                    var result = results.rows.length ? results.rows.item(0).key : null;
	                    resolve(result);
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function keys$1(callback) {
	    var self = this;
	
	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                t.executeSql('SELECT key FROM ' + dbInfo.storeName, [], function (t, results) {
	                    var keys = [];
	
	                    for (var i = 0; i < results.rows.length; i++) {
	                        keys.push(results.rows.item(i).key);
	                    }
	
	                    resolve(keys);
	                }, function (t, error) {
	
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	var webSQLStorage = {
	    _driver: 'webSQLStorage',
	    _initStorage: _initStorage$1,
	    iterate: iterate$1,
	    getItem: getItem$1,
	    setItem: setItem$1,
	    removeItem: removeItem$1,
	    clear: clear$1,
	    length: length$1,
	    key: key$1,
	    keys: keys$1
	};
	
	// Config the localStorage backend, using options set in the config.
	function _initStorage$2(options) {
	    var self = this;
	    var dbInfo = {};
	    if (options) {
	        for (var i in options) {
	            dbInfo[i] = options[i];
	        }
	    }
	
	    dbInfo.keyPrefix = dbInfo.name + '/';
	
	    if (dbInfo.storeName !== self._defaultConfig.storeName) {
	        dbInfo.keyPrefix += dbInfo.storeName + '/';
	    }
	
	    self._dbInfo = dbInfo;
	    dbInfo.serializer = localforageSerializer;
	
	    return Promise$1.resolve();
	}
	
	// Remove all keys from the datastore, effectively destroying all data in
	// the app's key/value store!
	function clear$2(callback) {
	    var self = this;
	    var promise = self.ready().then(function () {
	        var keyPrefix = self._dbInfo.keyPrefix;
	
	        for (var i = localStorage.length - 1; i >= 0; i--) {
	            var key = localStorage.key(i);
	
	            if (key.indexOf(keyPrefix) === 0) {
	                localStorage.removeItem(key);
	            }
	        }
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Retrieve an item from the store. Unlike the original async_storage
	// library in Gaia, we don't modify return values at all. If a key's value
	// is `undefined`, we pass that value to the callback function.
	function getItem$2(key, callback) {
	    var self = this;
	
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }
	
	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        var result = localStorage.getItem(dbInfo.keyPrefix + key);
	
	        // If a result was found, parse it from the serialized
	        // string into a JS object. If result isn't truthy, the key
	        // is likely undefined and we'll pass it straight to the
	        // callback.
	        if (result) {
	            result = dbInfo.serializer.deserialize(result);
	        }
	
	        return result;
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Iterate over all items in the store.
	function iterate$2(iterator, callback) {
	    var self = this;
	
	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        var keyPrefix = dbInfo.keyPrefix;
	        var keyPrefixLength = keyPrefix.length;
	        var length = localStorage.length;
	
	        // We use a dedicated iterator instead of the `i` variable below
	        // so other keys we fetch in localStorage aren't counted in
	        // the `iterationNumber` argument passed to the `iterate()`
	        // callback.
	        //
	        // See: github.com/mozilla/localForage/pull/435#discussion_r38061530
	        var iterationNumber = 1;
	
	        for (var i = 0; i < length; i++) {
	            var key = localStorage.key(i);
	            if (key.indexOf(keyPrefix) !== 0) {
	                continue;
	            }
	            var value = localStorage.getItem(key);
	
	            // If a result was found, parse it from the serialized
	            // string into a JS object. If result isn't truthy, the
	            // key is likely undefined and we'll pass it straight
	            // to the iterator.
	            if (value) {
	                value = dbInfo.serializer.deserialize(value);
	            }
	
	            value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);
	
	            if (value !== void 0) {
	                return value;
	            }
	        }
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Same as localStorage's key() method, except takes a callback.
	function key$2(n, callback) {
	    var self = this;
	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        var result;
	        try {
	            result = localStorage.key(n);
	        } catch (error) {
	            result = null;
	        }
	
	        // Remove the prefix from the key, if a key is found.
	        if (result) {
	            result = result.substring(dbInfo.keyPrefix.length);
	        }
	
	        return result;
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	function keys$2(callback) {
	    var self = this;
	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        var length = localStorage.length;
	        var keys = [];
	
	        for (var i = 0; i < length; i++) {
	            if (localStorage.key(i).indexOf(dbInfo.keyPrefix) === 0) {
	                keys.push(localStorage.key(i).substring(dbInfo.keyPrefix.length));
	            }
	        }
	
	        return keys;
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Supply the number of keys in the datastore to the callback function.
	function length$2(callback) {
	    var self = this;
	    var promise = self.keys().then(function (keys) {
	        return keys.length;
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Remove an item from the store, nice and simple.
	function removeItem$2(key, callback) {
	    var self = this;
	
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }
	
	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        localStorage.removeItem(dbInfo.keyPrefix + key);
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	// Set a key's value and run an optional callback once the value is set.
	// Unlike Gaia's implementation, the callback function is passed the value,
	// in case you want to operate on that value only after you're sure it
	// saved, or something like that.
	function setItem$2(key, value, callback) {
	    var self = this;
	
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }
	
	    var promise = self.ready().then(function () {
	        // Convert undefined values to null.
	        // https://github.com/mozilla/localForage/pull/42
	        if (value === undefined) {
	            value = null;
	        }
	
	        // Save the original value to pass to the callback.
	        var originalValue = value;
	
	        return new Promise$1(function (resolve, reject) {
	            var dbInfo = self._dbInfo;
	            dbInfo.serializer.serialize(value, function (value, error) {
	                if (error) {
	                    reject(error);
	                } else {
	                    try {
	                        localStorage.setItem(dbInfo.keyPrefix + key, value);
	                        resolve(originalValue);
	                    } catch (e) {
	                        // localStorage capacity exceeded.
	                        // TODO: Make this a specific error/event.
	                        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
	                            reject(e);
	                        }
	                        reject(e);
	                    }
	                }
	            });
	        });
	    });
	
	    executeCallback(promise, callback);
	    return promise;
	}
	
	var localStorageWrapper = {
	    _driver: 'localStorageWrapper',
	    _initStorage: _initStorage$2,
	    // Default API, from Gaia/localStorage.
	    iterate: iterate$2,
	    getItem: getItem$2,
	    setItem: setItem$2,
	    removeItem: removeItem$2,
	    clear: clear$2,
	    length: length$2,
	    key: key$2,
	    keys: keys$2
	};
	
	function executeTwoCallbacks(promise, callback, errorCallback) {
	    if (typeof callback === 'function') {
	        promise.then(callback);
	    }
	
	    if (typeof errorCallback === 'function') {
	        promise["catch"](errorCallback);
	    }
	}
	
	// Custom drivers are stored here when `defineDriver()` is called.
	// They are shared across all instances of localForage.
	var CustomDrivers = {};
	
	var DriverType = {
	    INDEXEDDB: 'asyncStorage',
	    LOCALSTORAGE: 'localStorageWrapper',
	    WEBSQL: 'webSQLStorage'
	};
	
	var DefaultDriverOrder = [DriverType.INDEXEDDB, DriverType.WEBSQL, DriverType.LOCALSTORAGE];
	
	var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'];
	
	var DefaultConfig = {
	    description: '',
	    driver: DefaultDriverOrder.slice(),
	    name: 'localforage',
	    // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
	    // we can use without a prompt.
	    size: 4980736,
	    storeName: 'keyvaluepairs',
	    version: 1.0
	};
	
	var driverSupport = {};
	// Check to see if IndexedDB is available and if it is the latest
	// implementation; it's our preferred backend library. We use "_spec_test"
	// as the name of the database because it's not the one we'll operate on,
	// but it's useful to make sure its using the right spec.
	// See: https://github.com/mozilla/localForage/issues/128
	driverSupport[DriverType.INDEXEDDB] = isIndexedDBValid();
	
	driverSupport[DriverType.WEBSQL] = isWebSQLValid();
	
	driverSupport[DriverType.LOCALSTORAGE] = isLocalStorageValid();
	
	var isArray = Array.isArray || function (arg) {
	    return Object.prototype.toString.call(arg) === '[object Array]';
	};
	
	function callWhenReady(localForageInstance, libraryMethod) {
	    localForageInstance[libraryMethod] = function () {
	        var _args = arguments;
	        return localForageInstance.ready().then(function () {
	            return localForageInstance[libraryMethod].apply(localForageInstance, _args);
	        });
	    };
	}
	
	function extend() {
	    for (var i = 1; i < arguments.length; i++) {
	        var arg = arguments[i];
	
	        if (arg) {
	            for (var key in arg) {
	                if (arg.hasOwnProperty(key)) {
	                    if (isArray(arg[key])) {
	                        arguments[0][key] = arg[key].slice();
	                    } else {
	                        arguments[0][key] = arg[key];
	                    }
	                }
	            }
	        }
	    }
	
	    return arguments[0];
	}
	
	function isLibraryDriver(driverName) {
	    for (var driver in DriverType) {
	        if (DriverType.hasOwnProperty(driver) && DriverType[driver] === driverName) {
	            return true;
	        }
	    }
	
	    return false;
	}
	
	var LocalForage = function () {
	    function LocalForage(options) {
	        _classCallCheck(this, LocalForage);
	
	        this.INDEXEDDB = DriverType.INDEXEDDB;
	        this.LOCALSTORAGE = DriverType.LOCALSTORAGE;
	        this.WEBSQL = DriverType.WEBSQL;
	
	        this._defaultConfig = extend({}, DefaultConfig);
	        this._config = extend({}, this._defaultConfig, options);
	        this._driverSet = null;
	        this._initDriver = null;
	        this._ready = false;
	        this._dbInfo = null;
	
	        this._wrapLibraryMethodsWithReady();
	        this.setDriver(this._config.driver);
	    }
	
	    // Set any config values for localForage; can be called anytime before
	    // the first API call (e.g. `getItem`, `setItem`).
	    // We loop through options so we don't overwrite existing config
	    // values.
	
	
	    LocalForage.prototype.config = function config(options) {
	        // If the options argument is an object, we use it to set values.
	        // Otherwise, we return either a specified config value or all
	        // config values.
	        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
	            // If localforage is ready and fully initialized, we can't set
	            // any new configuration values. Instead, we return an error.
	            if (this._ready) {
	                return new Error("Can't call config() after localforage " + 'has been used.');
	            }
	
	            for (var i in options) {
	                if (i === 'storeName') {
	                    options[i] = options[i].replace(/\W/g, '_');
	                }
	
	                this._config[i] = options[i];
	            }
	
	            // after all config options are set and
	            // the driver option is used, try setting it
	            if ('driver' in options && options.driver) {
	                this.setDriver(this._config.driver);
	            }
	
	            return true;
	        } else if (typeof options === 'string') {
	            return this._config[options];
	        } else {
	            return this._config;
	        }
	    };
	
	    // Used to define a custom driver, shared across all instances of
	    // localForage.
	
	
	    LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
	        var promise = new Promise$1(function (resolve, reject) {
	            try {
	                var driverName = driverObject._driver;
	                var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');
	                var namingError = new Error('Custom driver name already in use: ' + driverObject._driver);
	
	                // A driver name should be defined and not overlap with the
	                // library-defined, default drivers.
	                if (!driverObject._driver) {
	                    reject(complianceError);
	                    return;
	                }
	                if (isLibraryDriver(driverObject._driver)) {
	                    reject(namingError);
	                    return;
	                }
	
	                var customDriverMethods = LibraryMethods.concat('_initStorage');
	                for (var i = 0; i < customDriverMethods.length; i++) {
	                    var customDriverMethod = customDriverMethods[i];
	                    if (!customDriverMethod || !driverObject[customDriverMethod] || typeof driverObject[customDriverMethod] !== 'function') {
	                        reject(complianceError);
	                        return;
	                    }
	                }
	
	                var supportPromise = Promise$1.resolve(true);
	                if ('_support' in driverObject) {
	                    if (driverObject._support && typeof driverObject._support === 'function') {
	                        supportPromise = driverObject._support();
	                    } else {
	                        supportPromise = Promise$1.resolve(!!driverObject._support);
	                    }
	                }
	
	                supportPromise.then(function (supportResult) {
	                    driverSupport[driverName] = supportResult;
	                    CustomDrivers[driverName] = driverObject;
	                    resolve();
	                }, reject);
	            } catch (e) {
	                reject(e);
	            }
	        });
	
	        executeTwoCallbacks(promise, callback, errorCallback);
	        return promise;
	    };
	
	    LocalForage.prototype.driver = function driver() {
	        return this._driver || null;
	    };
	
	    LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
	        var self = this;
	        var getDriverPromise = Promise$1.resolve().then(function () {
	            if (isLibraryDriver(driverName)) {
	                switch (driverName) {
	                    case self.INDEXEDDB:
	                        return asyncStorage;
	                    case self.LOCALSTORAGE:
	                        return localStorageWrapper;
	                    case self.WEBSQL:
	                        return webSQLStorage;
	                }
	            } else if (CustomDrivers[driverName]) {
	                return CustomDrivers[driverName];
	            } else {
	                throw new Error('Driver not found.');
	            }
	        });
	        executeTwoCallbacks(getDriverPromise, callback, errorCallback);
	        return getDriverPromise;
	    };
	
	    LocalForage.prototype.getSerializer = function getSerializer(callback) {
	        var serializerPromise = Promise$1.resolve(localforageSerializer);
	        executeTwoCallbacks(serializerPromise, callback);
	        return serializerPromise;
	    };
	
	    LocalForage.prototype.ready = function ready(callback) {
	        var self = this;
	
	        var promise = self._driverSet.then(function () {
	            if (self._ready === null) {
	                self._ready = self._initDriver();
	            }
	
	            return self._ready;
	        });
	
	        executeTwoCallbacks(promise, callback, callback);
	        return promise;
	    };
	
	    LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
	        var self = this;
	
	        if (!isArray(drivers)) {
	            drivers = [drivers];
	        }
	
	        var supportedDrivers = this._getSupportedDrivers(drivers);
	
	        function setDriverToConfig() {
	            self._config.driver = self.driver();
	        }
	
	        function initDriver(supportedDrivers) {
	            return function () {
	                var currentDriverIndex = 0;
	
	                function driverPromiseLoop() {
	                    while (currentDriverIndex < supportedDrivers.length) {
	                        var driverName = supportedDrivers[currentDriverIndex];
	                        currentDriverIndex++;
	
	                        self._dbInfo = null;
	                        self._ready = null;
	
	                        return self.getDriver(driverName).then(function (driver) {
	                            self._extend(driver);
	                            setDriverToConfig();
	
	                            self._ready = self._initStorage(self._config);
	                            return self._ready;
	                        })["catch"](driverPromiseLoop);
	                    }
	
	                    setDriverToConfig();
	                    var error = new Error('No available storage method found.');
	                    self._driverSet = Promise$1.reject(error);
	                    return self._driverSet;
	                }
	
	                return driverPromiseLoop();
	            };
	        }
	
	        // There might be a driver initialization in progress
	        // so wait for it to finish in order to avoid a possible
	        // race condition to set _dbInfo
	        var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function () {
	            return Promise$1.resolve();
	        }) : Promise$1.resolve();
	
	        this._driverSet = oldDriverSetDone.then(function () {
	            var driverName = supportedDrivers[0];
	            self._dbInfo = null;
	            self._ready = null;
	
	            return self.getDriver(driverName).then(function (driver) {
	                self._driver = driver._driver;
	                setDriverToConfig();
	                self._wrapLibraryMethodsWithReady();
	                self._initDriver = initDriver(supportedDrivers);
	            });
	        })["catch"](function () {
	            setDriverToConfig();
	            var error = new Error('No available storage method found.');
	            self._driverSet = Promise$1.reject(error);
	            return self._driverSet;
	        });
	
	        executeTwoCallbacks(this._driverSet, callback, errorCallback);
	        return this._driverSet;
	    };
	
	    LocalForage.prototype.supports = function supports(driverName) {
	        return !!driverSupport[driverName];
	    };
	
	    LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
	        extend(this, libraryMethodsAndProperties);
	    };
	
	    LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
	        var supportedDrivers = [];
	        for (var i = 0, len = drivers.length; i < len; i++) {
	            var driverName = drivers[i];
	            if (this.supports(driverName)) {
	                supportedDrivers.push(driverName);
	            }
	        }
	        return supportedDrivers;
	    };
	
	    LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
	        // Add a stub for each driver API method that delays the call to the
	        // corresponding driver method until localForage is ready. These stubs
	        // will be replaced by the driver methods as soon as the driver is
	        // loaded, so there is no performance impact.
	        for (var i = 0; i < LibraryMethods.length; i++) {
	            callWhenReady(this, LibraryMethods[i]);
	        }
	    };
	
	    LocalForage.prototype.createInstance = function createInstance(options) {
	        return new LocalForage(options);
	    };
	
	    return LocalForage;
	}();
	
	// The actual localForage object that we expose as a module or via a
	// global. It's extended by pulling in one of our other libraries.
	
	
	var localforage_js = new LocalForage();
	
	module.exports = localforage_js;
	
	},{"3":3}]},{},[4])(4)
	});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map