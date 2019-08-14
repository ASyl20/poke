// console.log('Service Worker running');
// import DB from './assets/js/db.js'
const offlineUrl = 'offline.html'
const cacheName = 'comics-cache-1.0';
self.addEventListener('install', function (evt) {
    console.log(`Installation ${evt}`)
    const cachePromise = caches.open(cacheName).then(cache => {
        return cache.addAll([
            './offline.html',
            './assets/js/app.js',
            './assets/js/main.js',
            './assets/js/lib.js',
            './assets/js/db.js',
            './assets/js/pouchdb.js',
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

self.addEventListener('fetch', function (evt) {
    if (!navigator.onLine) {
        // console.log('hors ligne');
        const url = "https://raw.githubusercontent.com/akabab/superhero-api/master/api/all.json"
        // console.log(evt.request.url)
        // if(url == evt.request.url){
        //     // console.log('bon')
        // }
        evt.respondWith(
            fetch(evt.request.url)
            .then(res => {
                // console.log(evt.request.url)
                if (res && !(url == evt.request.url)) {
                    // console.log(res)
                    return res;
                }
            })
            .catch(error => {
                // Return the offline page
                // console.log(error)
                return caches.match(offlineUrl);
            }));
    }
    // console.log(evt.request.url);
    //     if (evt.request.mode === 'navigate' || (evt.request.method === 'GET' && evt.request.headers.get('accept').includes('text/html'))) {
    //         evt.respondWith(
    //             fetch(evt.request.url)
    //             .then(res=>{
    //                 if(res){
    //                     return res;
    //                 }
    //             })
    //             .catch(error => {
    //               // Return the offline page
    //               console.log(error)
    //               return caches.match(offlineUrl);
    //           }).catch(err=>{
    //               console.log(err)
    //           })
    //     );
    //   }
    else {
        evt.respondWith(
            caches.match(evt.request).then(res => {
                // console.log('url fetchée ' + res);
                if (res) {
                    return res;
                } else {
                    return fetch(evt.request)
                        .then(function (result) {
                            return caches.open(cacheName)
                                .then(function (cache) {
                                    cache.put(evt.request.url, result.clone())
                                    return result
                                })
                        })
                        .catch((err) => {
                            return caches.open(cacheName)
                                .then(function (cache) {
                                    return cache.match(offlineUrl);
                                });

                        })
                }
                // // Si une requete echoue on fait un fetch normal
                // return fetch(evt.request).then(newResponse =>{
                //     // console.log('url récupérée sur le reseau puis mise en cache ' + evt.request.url +' '+ newResponse);
                //     caches.open(cacheName).then( cache => {
                //         if(evt.request.status === 200)
                //             cache.put(evt.request,newResponse)
                //     }).catch(err=>{
                //         console.log(err)
                //     });
                //     // Comme une réponse ne peut pas être utiliser deux fois on doit la clonée
                //     return newResponse.clone();
                // }).catch(err=>{
                //     console.log(err)
                //     return caches.match(offlineUrl);
                // });
            })
        );
    }
    // // Stratégie cache with network fallback
});