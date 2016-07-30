const toolbox = require('sw-toolbox');

// self.addEventListener('fetch', function(event) {
//     var request = event.request;
//     console.log(request.url);
//     if (request.method === 'GET' && request.url === '/') {
//         event.respondWith(
//             fetch('/index.html').catch(function(error) { console.error(error); }
//         );
//     }
// });
//
//
// toolbox.precache(['/index.html', '/main.js', '/main.css', 'https://www.gstatic.com/firebasejs/3.1.0/firebase.js']);

toolbox.router.get('/', toolbox.networkFirst);
// toolbox.router.get('https://www.gstatic.com/firebasejs/3.1.0/firebase.js', toolbox.cacheFirst, { origin: /www\.gstatic\.com/i });
toolbox.router.get(/https\:\/\/fonts\.g/, toolbox.cacheFirst);
toolbox.router.get(/firebase\.js/, toolbox.cacheFirst);
// toolbox.router.get(/https\:\/\/www\.gstatic\.com\/firebasejs\/3\.1\.0\/firebase\.js/, toolbox.cacheFirst);
toolbox.router.get(/\/main\.(js|css)/i, toolbox.networkFirst);

// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//         caches.match(event.request).then(function(response) {
//             return response || fetch(event.request);
//         }));
// });

// self.addEventListener('fetch', function(event) {
//     if (event.request.url.indexOf('firebase.js') > 0) {
//         console.log('firebase fetch evt', event.request.url);
//         event.respondWith(
//             caches.match(event.request).then(function(response) {
//                 return response || fetch(event.request);
//             }));
//     }
// });

// toolbox.precache(['/index.html', '/main.js', '/main.css']);
// toolbox.router.get('/', toolbox.networkFirst);
// toolbox.router.get('/index.html', toolbox.networkFirst);
// toolbox.router.get('/main.js', toolbox.networkFirst);
// toolbox.router.get('/main.css', toolbox.networkFirst);
// toolbox.router.post('/firebasejs/3.1.0/firebase.js', toolbox.networkFirst, { origin: 'https://www.gstatic.com' });


//
// toolbox.router.get('/', function(request, values) {
//   return fetch('/index.html');
// });
//
// toolbox.router.get('/(.*)', toolbox.cacheFirst, {
//     cache: {
//       name: 'googleapis',
//       maxEntries: 10,
//       maxAgeSeconds: 86400 // cache for a day
//     },
//     origin: /\.gstatic\.com$/,
//     // Set a timeout threshold of 2 seconds
//     networkTimeoutSeconds: 2
//   });
