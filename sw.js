
const offlineUrl = 'offline.html';
const cacheName = 'comics-cache-1.0';
self.addEventListener('install', function (evt) {
    console.log(`Installation ${evt}`);
    const cachePromise = caches.open(cacheName).then(cache => {
        return cache.addAll([
            './offline.html',
            './assets/js/app.js',
            './assets/js/main.js',
            './assets/js/lib.js',
            './assets/js/db.js',
            './assets/js/pouchdb.js',
            './assets/js/pouchdb.find.js',
            './assets/css/all.min.css',
            './assets/css/app.css',
            './assets/css/reset.css',
            './assets/webfonts/fa-brands-400.eot',
            './assets/webfonts/fa-brands-400.svg',
            './assets/webfonts/fa-brands-400.ttf',
            './assets/webfonts/fa-brands-400.woff',
            './assets/webfonts/fa-brands-400.woff2',
            './assets/webfonts/fa-regular-400.eot',
            './assets/webfonts/fa-regular-400.svg',
            './assets/webfonts/fa-regular-400.ttf',
            './assets/webfonts/fa-regular-400.woff',
            './assets/webfonts/fa-regular-400.woff2',
            './assets/webfonts/fa-solid-900.eot',
            './assets/webfonts/fa-solid-900.svg',
            './assets/webfonts/fa-solid-900.ttf',
            './assets/webfonts/fa-solid-900.woff',
            './assets/webfonts/fa-solid-900.woff2',
        ]);
    });
    // IL est possible que le cache n'a pas fini de mettre tout en cache donc c'est pour ça qu'il y a la méthod waitUntil
    // waitUntil va attendre que la promise soit finit avant de sortir du callback
    evt.waitUntil(cachePromise);
});


self.addEventListener('activate', function (evt) {
    // console.log(`Activation ${evt}`)
    let cacheCleanedPromise = caches.keys().then(keys => {
        keys.map(key => {
            if (key !== cacheName) {
                return caches.delete(key);
            }
        });
    });
    // On attendre jusqu'a ce que la promesse soit résolue
    evt.waitUntil(cacheCleanedPromise);
})

self.addEventListener('fetch',async function (evt) {
    if (!navigator.onLine) {
        const url = "https://raw.githubusercontent.com/akabab/superhero-api/master/api/all.json"
        evt.respondWith(
            fetch(evt.request.url)
            .then(res => {
                if (res && !(url == evt.request.url)) {
                    // console.log(res)
                    return res;
                }
            })
            .catch(error => {
                // Return the offline page
                return caches.match(offlineUrl);
            }));
    } else {
    // Stale While Revalidate => on récupère le cache et on l'envoie. 
    // Le contenu est ainsi directement disponible.
    // Ensuite, on va chercher la requête sur le réseau pour que ce soit à jour la prochaine fois qu'on fait la requête
    const { request } = evt

    // Prevent Chrome Developer Tools error:
    // Failed to execute 'fetch' on 'ServiceWorkerGlobalScope': 'only-if-cached' can be set only with 'same-origin' mode
    //
    // See also https://stackoverflow.com/a/49719964/1217468
    if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
      return
    }
  
    evt.respondWith(async function () {
      const cache = await caches.open(cacheName)
  
      const cachedResponsePromise = await cache.match(request)
      const networkResponsePromise = fetch(request)
  
      if (request.url.startsWith(self.location.origin)) {
        evt.waitUntil(async function () {
            const networkResponse = await networkResponsePromise
            // console.log(networkResponsePromise)
  
          await cache.put(request, networkResponse.clone())
        }())
      }
  
      return cachedResponsePromise || networkResponsePromise
    }())
    }
});