const CACHE_NAME = 'smart-class-v1.6'; // Ubah angka ini setiap kali ada update aplikasi
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png' // Pastikan file gambar ini benar-benar ada di repo
];

// PROSES INSTALL & SIMPAN CACHE BARU
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Paksa service worker baru langsung aktif
});

// PROSES AKTIVASI & HAPUS CACHE VERSI LAMA
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Jika nama cache tidak sama dengan versi terbaru, maka hapus!
          if (cacheName !== CACHE_NAME) {
            console.log('Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// PROSES FETCH (MENAMPILKAN HALAMAN)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Jika ada di cache, tampilkan. Jika tidak, ambil dari internet (GitHub)
      return response || fetch(e.request);
    })
  );
});
