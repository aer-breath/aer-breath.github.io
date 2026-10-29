const CACHE="aer-standalone-115641e30479", SCOPE="/", URLS=["/432hz_2.mp3","/aer-icon.png","/aer-og.png","/analytics-config.json","/assets/CoachChat-Cr-0LpF5-dd41c66483.js","/assets/index-BZnjhlrr-dd41c66483.js","/assets/index-_xrbRke4-dd41c66483.css","/exhale_2.mp3","/heart-beating.mp3","/icon-192.png","/icon-512.png","/index.html","/inhale.mp3","/manifest.webmanifest","/vendor/README.txt","/vendor/telegram-web-app.js","/youcan-icon.png"];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(c => c.addAll(URLS))); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('aer-standalone-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
 const url = new URL(event.request.url);
 if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(SCOPE)) return;
 if (event.request.mode === 'navigate') {
  event.respondWith(fetch(event.request).catch(() => caches.match(SCOPE + 'index.html', { ignoreVary: true }))); return;
 }
 if (URLS.includes(url.pathname)) event.respondWith(caches.match(event.request, { ignoreVary: true }).then(async hit => {
   if (!hit) return fetch(event.request);
   const range = event.request.headers.get('Range');
   if (!range) return hit;
   const match = /^bytes=(\d*)-(\d*)$/.exec(range);
   if (!match || (!match[1] && !match[2])) return fetch(event.request);
   const body = await hit.blob(), size = body.size;
   const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
   const end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
   if (start >= size || end < start) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + size } });
   const headers = new Headers(hit.headers);
   headers.delete('Content-Encoding');
   headers.set('Content-Range', 'bytes ' + start + '-' + end + '/' + size);
   headers.set('Content-Length', String(end - start + 1));
   headers.set('Accept-Ranges', 'bytes');
   return new Response(body.slice(start, end + 1), { status: 206, headers });
 }));
});
