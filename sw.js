// Service Worker АвтоТемы.
// Стратегии:
//  - HTML-страницы: network-first (новости всегда свежие; при офлайне — из кэша, затем главная);
//  - статика (CSS/JS/шрифты/картинки): stale-while-revalidate (мгновенно из кэша + фоновое обновление);
//    версии файлов задаются query-параметрами (?v=N), поэтому обновление подхватывается автоматически;
//  - служебные страницы (админка, статистика) и запросы не GET не перехватываются.
const VERSION = 'v3';
const STATIC_CACHE = 'avtotema-static-' + VERSION;
const PAGE_CACHE = 'avtotema-pages-' + VERSION;

// Ядро для офлайна: главная и ключевые ресурсы
const PRECACHE_URLS = [
    '/',
    '/styles.css?v=6',
    '/theme.js',
    '/script.js?v=3',
    '/likes.js?v=2',
    '/footer.js?v=2',
    '/manifest.json',
    '/favicon.ico',
    '/logo-icon.svg'
];

// Служебные пути — SW их не обслуживает
const BYPASS_PATHS = [
    '/4cc55b6066d79bfb2a80.html',
    '/4182e144696b3e5c1899.html',
    '/state/'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(function (cache) { return cache.addAll(PRECACHE_URLS); })
            .then(function () { return self.skipWaiting(); })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (key) {
                if (key !== STATIC_CACHE && key !== PAGE_CACHE) return caches.delete(key);
            }));
        }).then(function () { return self.clients.claim(); })
    );
});

function isStaticAsset(url) {
    return /\.(css|js|png|jpe?g|webp|gif|svg|ico|woff2?|ttf|otf)(\?|$)/i.test(url.pathname) ||
           url.pathname.startsWith('/fonts/') ||
           url.pathname.startsWith('/images/');
}

function isHtmlRequest(request, url) {
    if (request.mode === 'navigate') return true;
    var accept = request.headers.get('accept') || '';
    return accept.indexOf('text/html') !== -1 && !isStaticAsset(url);
}

self.addEventListener('fetch', function (event) {
    var request = event.request;
    if (request.method !== 'GET') return;

    var url = new URL(request.url);
    if (url.origin !== location.origin) return;
    if (BYPASS_PATHS.some(function (p) { return url.pathname.startsWith(p); })) return;

    // Статика: мгновенно из кэша + фоновое обновление
    if (isStaticAsset(url)) {
        event.respondWith(
            caches.open(STATIC_CACHE).then(function (cache) {
                return cache.match(request).then(function (cached) {
                    var network = fetch(request).then(function (response) {
                        if (response && response.ok) cache.put(request, response.clone());
                        return response;
                    }).catch(function () { return cached; });
                    return cached || network;
                });
            })
        );
        return;
    }

    // HTML: сначала сеть, при офлайне — кэш, затем главная
    if (isHtmlRequest(request, url)) {
        event.respondWith(
            fetch(request).then(function (response) {
                if (response && response.ok) {
                    var copy = response.clone();
                    caches.open(PAGE_CACHE).then(function (cache) { cache.put(request, copy); });
                }
                return response;
            }).catch(function () {
                return caches.match(request).then(function (cached) {
                    return cached || caches.match('/');
                });
            })
        );
    }
});
