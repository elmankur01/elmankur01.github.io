// Service Worker для PWA «АвтоТема»
const CACHE_NAME = 'avtotema-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/interactive.js',
    '/footer.js',
    '/article_images.js',
    '/manifest.json',
    '/logo-icon.svg',
    '/favicon.png',
    '/favicon.ico'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_ASSETS).catch(() => {});
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(k => {
                    if (k !== CACHE_NAME) return caches.delete(k);
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    
    const url = new URL(event.request.url);
    // Не кэшировать служебные / админ страницы
    if (url.pathname.includes('4cc55b6066d79bfb2a80') || url.pathname.includes('4182e144696b3e5c1899') || url.pathname.includes('gate.js')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(res => {
                if (res && res.status === 200 && res.type === 'basic') {
                    const resClone = res.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, resClone);
                    });
                }
                return res;
            })
            .catch(() => caches.match(event.request))
    );
});
