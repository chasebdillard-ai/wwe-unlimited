// retired 2026-11-18: site moved to WrestleWorld+. This worker clears caches and unregisters itself.
self.addEventListener('install',function(){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.map(function(n){return caches.delete(n)}))}).then(function(){return self.registration.unregister()}).then(function(){return self.clients.matchAll({type:'window'})}).then(function(cs){cs.forEach(function(c){c.navigate('https://chasebdillard-ai.github.io/wrestleworld-plus/')})}))});
