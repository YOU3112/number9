const CACHE_NAME = 'number-puzzle-pwa-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    // アイコンファイルもキャッシュに追加
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'
];

// インストールイベント: アプリシェルをキャッシュ
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: キャッシュを開きました');
                return cache.addAll(urlsToCache);
            })
    );
});

// フェッチイベント: キャッシュからリソースを提供、なければネットワークから取得
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // キャッシュに見つかったらそれを返す
                if (response) {
                    return response;
                }
                // キャッシュになければネットワークから取得
                return fetch(event.request);
            })
    );
});

// アクティベートイベント: 古いキャッシュをクリア
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Service Worker: 古いキャッシュを削除します:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
