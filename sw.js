const CACHE_NAME = 'kronos360-v1';
const ASSETS = [
    '.',
    'index.html',
    'verify.html',
    'dashboard.html',
    'manifest.json',
    'css/style.css',
    'js/main.js',
    'js/folio-generator.js',
    'js/trazabilidad.js',
    'js/dashboard.js',
    'js/quantum-seal.js',
    'js/offline-vault.js',
    'js/forensic.js',
    'js/document-verifier.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Cacheando KRONOS 360...');
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.url.includes('/api/')) return;
    event.respondWith(
        caches.match(event.request)
            .then(cached => {
                if (cached) return cached;
                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200) return response;
                        const cloned = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(event.request, cloned));
                        return response;
                    })
                    .catch(() => {
                        if (event.request.mode === 'navigate') {
                            return caches.match('index.html');
                        }
                    });
            })
    );
});