/* Cache leve para abrir mais rápido em conexões fracas.
   Páginas e dados: busca na internet primeiro (sempre atualizados) e usa o cache só sem conexão.
   Imagens e fontes: usa o cache primeiro.  Áudios não são guardados (economiza espaço do celular). */
var VERSAO = "devocional-2027-v4";
var BASE = ["./", "index.html", "style.css", "app.js", "manifest.webmanifest", "assets/icones/icone-192.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSAO).then(function (c) { return c.addAll(BASE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== VERSAO; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (/\.mp3$/i.test(url.pathname) || req.headers.get("range")) return; // áudio direto da internet
  var primeiroCache = /\.(webp|png|jpg|jpeg|woff2?|ttf)$/i.test(url.pathname) || url.hostname.indexOf("fonts.g") === 0;
  if (primeiroCache) {
    e.respondWith(caches.match(req).then(function (r) {
      return r || fetch(req).then(function (resp) {
        if (resp && (resp.ok || resp.type === "opaque")) { var cp = resp.clone(); caches.open(VERSAO).then(function (c) { c.put(req, cp); }); }
        return resp;
      });
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  e.respondWith(fetch(req).then(function (resp) {
    if (resp && resp.ok) { var cp = resp.clone(); caches.open(VERSAO).then(function (c) { c.put(req, cp); }); }
    return resp;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: req.mode === "navigate" }).then(function (r) { return r || caches.match("index.html"); });
  }));
});
