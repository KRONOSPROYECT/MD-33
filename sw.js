const CACHE_NAME = 'kronos360-v1';
const ASSETS = [
    '.',
    'index.html',
    'verify.html',
    'dashboard.html',
    'manifest.json',
    'js/main.js',
    'js/folio-generator.js',
    'js/trazabilidad.js',
    'js/dashboard.js',
    'js/quantum-seal.js',
    'js/offline-vault.js',
    'js/forensic.js',
    'js/document-verifier.js'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('📦 Cacheando KRONOS 360...');
                return cache.addAll(ASSETS);
            })
            .then(function() {
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(key) {
                    return key !== CACHE_NAME;
                }).map(function(key) {
                    return caches.delete(key);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    if (event.request.url.includes('/api/')) return;
    
    event.respondWith(
        caches.match(event.request)
            .then(function(cached) {
                if (cached) return cached;
                return fetch(event.request)
                    .then(function(response) {
                        if (!response || response.status !== 200) return response;
                        var cloned = response.clone();
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, cloned);
                            });
                        return response;
                    })
                    .catch(function() {
                        if (event.request.mode === 'navigate') {
                            return caches.match('index.html');
                        }
                    });
            })
    );
});