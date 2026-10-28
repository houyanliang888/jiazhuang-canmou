const CACHE="jzcm-pwa-v2";
const ASSETS=["./","./index.html","./app.webmanifest","./icon-192.png","./icon-512.png","./家装风格图库.html","./gallery.webmanifest"];
self.addEventListener("install",e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(CACHE);
    // 逐个缓存，任一缺失(404)不拖垮整体安装
    await Promise.all(ASSETS.map(u=>c.add(u).catch(()=>{})));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin)return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    if(res&&res.status===200){const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}
    return res;
  }).catch(()=>caches.match("./"))));
});
