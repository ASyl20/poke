console.log('Service Worker running');

const cacheName = 'comics-cache-1.0';
self.addEventListener('install',function(evt){
    console.log(`Installation ${evt}`)
    const cachePromise = caches.open(cacheName).then(cache => {
        return cache.addAll([
            './assets/js/app.js',
            './assets/js/lib.js',
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


self.addEventListener('activate',function(evt){
    console.log(`Activation ${evt}`)
    let cacheCleanedPromise =  caches.keys().then(keys=>{
        keys.map(key=>{
            if(key !== cacheName){
                return caches.delete(key);
            }
        });
    });
    // On attendre jusqu'a ce que la promesse soit résolue
    evt.waitUntil(cacheCleanedPromise);
})

self.addEventListener('fetch',function(evt){
    // Détecter que le navigator est hors ligne
    if(!navigator.onLine){
        // On va créer une nouvelle réponse 
        // SI on rajoute pas le header le html ne sera pas traité
        const headers = {headers:{"Content-Type":"text/html"}};
        evt.respondWith(new Response('<h1>Pas de connection internet! Veuillez vous connectez</h1>',headers));
    }
    // Stratégie network first with cache fallback
    evt.respondWith(
        // On fait un fetch sur notre requete interceptée
        fetch(evt.request).then(res=>{
            // On va mettre directement le nouveau contenue en caches
            console.log(`${evt.request.url} fetchée depuis le réseau`);
            caches.open(cacheName).then(cache=>{
                if(evt.request.status === 200)
                  cache.put(evt.request,res);
                }
            );
            // On clone car on ne peut lire que le flux qu'une fois
            // On renvoie notre réponse
            return res.clone();
        }).catch(err=>{
            console.log(`${evt.request.url} fetchée depuis le cache`);
            // Si on a pas de réponse depuis le réseau on cherche depuis le cache
            return caches.match(evt.request);
        })
    );
});