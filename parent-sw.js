// Parent PWA: offline shell, avoid stale HTML after version updates.
const CACHE='manabi-parent-assets-v1';
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./parent-icon-192.png','./parent-icon-512.png','./parent-manifest.webmanifest'])));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('manabi-parent-assets-')&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',event=>{if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>new Response('<h1>オフラインです</h1><p>インターネット接続を確認してください。</p>',{headers:{'Content-Type':'text/html; charset=utf-8'}})));return;}event.respondWith(caches.match(event.request).then(res=>res||fetch(event.request)))});
