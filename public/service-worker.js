// Pocket Pastor PWA Service Worker with Security Enhancements
// Version: 2.2.0
const CACHE_NAME = 'pocket-pastor-v2.2.0'; 
const BIBLE_CACHE = 'pocket-pastor-bible-v2.2.0';
const USER_DATA_CACHE = 'pocket-pastor-user-data-v2.2.0';

// Import security configuration
try {
  importScripts('/csp-config.js');
} catch (error) {
  console.warn('CSP config not available in service worker');
}

// Core app files to cache
const coreFilesToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install a service worker
self.addEventListener('install', event => {
  console.log('Installing new service worker version');
  
  // Force activation of the new service worker immediately
  self.skipWaiting();
  
  event.waitUntil(
    Promise.all([
      // Cache core app files
      caches.open(CACHE_NAME).then(cache => {
        console.log('Caching core app files');
        return cache.addAll(coreFilesToCache);
      }),
      // Initialize Bible cache
      caches.open(BIBLE_CACHE).then(cache => {
        console.log('Initialized Bible cache');
        return cache;
      }),
      // Initialize user data cache
      caches.open(USER_DATA_CACHE).then(cache => {
        console.log('Initialized user data cache');
        return cache;
      })
    ])
  );
});

// Enhanced fetch handler with better offline support
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip caching for external API calls
  if (event.request.url.includes('supabase.co') ||
      event.request.url.includes('openai.com') ||
      !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Handle Bible data requests with dedicated cache
  if (url.pathname.includes('/src/data/bible/')) {
    event.respondWith(
      caches.open(BIBLE_CACHE).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            console.log('Serving Bible data from cache');
            return cachedResponse;
          }
          
          // Fetch and cache Bible data
          return fetch(event.request).then(response => {
            if (response.status === 200) {
        // Apply security headers to cached responses
        const secureResponse = addSecurityHeaders(response.clone());
        cache.put(event.request, secureResponse.clone());
        return secureResponse;
      }
      return addSecurityHeaders(response);
          }).catch(() => {
            // Return offline fallback for Bible content
            return new Response(JSON.stringify({
              error: 'Bible content not available offline',
              offline: true
            }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            });
          });
        });
      })
    );
    return;
  }
  
  // Default caching strategy - network first with immediate cache invalidation
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Don't cache responses with status !== 200
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response since it can only be consumed once
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Return offline fallback
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
          
          return new Response('Offline', { 
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

// Update a service worker - force immediate activation and cache clearing
self.addEventListener('activate', event => {
  console.log('New service worker activating - clearing all caches');
  
  // Claim clients immediately and clear ALL caches
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clear ALL caches aggressively to force refresh
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        // Reload all clients to get fresh content
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'CACHE_UPDATED', action: 'reload' });
          });
        });
      })
    ])
  );
});

// Handle messages from client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Clear all caches on demand
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }).then(() => {
        console.log('All caches cleared');
        event.ports[0].postMessage({ success: true });
      })
    );
  }
  
  // Cache specific Bible book for offline reading
  if (event.data && event.data.type === 'CACHE_BIBLE_BOOK') {
    const { bookPath } = event.data;
    event.waitUntil(
      caches.open(BIBLE_CACHE).then(cache => {
        return fetch(bookPath).then(response => {
          if (response.ok) {
            return cache.put(bookPath, response.clone());
          }
        }).then(() => {
          console.log('Bible book cached for offline:', bookPath);
          event.ports[0].postMessage({ success: true, cached: bookPath });
        });
      }).catch(error => {
        console.error('Failed to cache Bible book:', error);
        event.ports[0].postMessage({ success: false, error: error.message });
      })
    );
  }
  
  // Check offline status
  if (event.data && event.data.type === 'CHECK_OFFLINE_STATUS') {
    event.waitUntil(
      caches.open(BIBLE_CACHE).then(cache => {
        return cache.keys().then(cachedRequests => {
          const cachedBooks = cachedRequests.map(req => req.url);
          event.ports[0].postMessage({ 
            success: true, 
            cachedBooks: cachedBooks 
          });
        });
      })
    );
  }
});

// Background sync for user data when online
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync user data when connection is restored
      syncUserData()
    );
  }
});

// Add security headers to responses
const addSecurityHeaders = (response) => {
  if (!response) return response;
  
  const headers = new Headers(response.headers);
  
  // Add CSP header if available
  if (self.CSP_HEADER) {
    headers.set('Content-Security-Policy', self.CSP_HEADER);
  }
  
  // Add additional security headers if available
  if (self.SECURITY_HEADERS) {
    Object.entries(self.SECURITY_HEADERS).forEach(([key, value]) => {
      headers.set(key, value);
    });
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
};

// Function to sync user data
async function syncUserData() {
  try {
    // Check if user has pending data to sync
    const cache = await caches.open(USER_DATA_CACHE);
    const pendingRequests = await cache.keys();
    
    for (const request of pendingRequests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const secureResponse = addSecurityHeaders(response.clone());
          await cache.put(request, secureResponse);
        }
        await cache.delete(request);
        console.log('Synced pending request:', request.url);
      } catch (error) {
        console.log('Failed to sync request:', request.url, error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}
