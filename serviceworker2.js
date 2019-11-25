const cacheName = 'v1';

// Call install event
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
});

// call activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');

    // remove unwanted previously cached files
    event.waitUntil(
        /* here we will iterate through all the caches and delete all the cache other the one whose name is saved in 'cacheName' variable */
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('Service Worker: claering Old cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// call fetch event
self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetching');
    // first check if live site is availabe else fetch file from cache
    event.respondWith(
        /* if there is no connection then fetching will fail then we would call a catch function since it returns a promise*/
        fetch(event.request)
            .then(res => {
                // make a copy of response which we get from the server
                const resClone = res.clone();
                /* open cache */
                caches
                    .open(cacheName)
                    .then(cache => {
                        console.log('Service Worker: Caching File');
                        // add response to cache
                        cache.put(event.request, resClone);
                    });
                    return res;
            })
            .catch( () => {caches.match(e.request).then(res => res)})
    )
})