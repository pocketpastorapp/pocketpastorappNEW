
// Register Service Worker with improved cache handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        
        // Register for background sync
        if ('sync' in window.ServiceWorkerRegistration.prototype) {
          console.log('Background sync is supported');
        }
        
        // Listen for updates and handle them immediately
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New update available - force immediate refresh
                  console.log('New content is available. Refreshing page...');
                  window.location.reload();
                } else {
                  // Content is cached for the first time
                  console.log('Content is cached for offline use.');
                }
              }
            });
          }
        });
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', event => {
          if (event.data && event.data.type === 'CACHE_UPDATED') {
            console.log('Cache updated, reloading page...');
            window.location.reload();
          }
        });
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
  
  // Enhanced cache management functions
  window.clearServiceWorkerCache = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data.success) {
          console.log('Cache cleared successfully');
          window.location.reload();
        }
      };
      
      navigator.serviceWorker.controller.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    }
  };
  
  // Force refresh function
  window.forceRefresh = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        Promise.all(registrations.map(registration => registration.unregister()))
          .then(() => {
            console.log('All service workers unregistered');
            // Clear all caches
            if ('caches' in window) {
              caches.keys().then(cacheNames => {
                return Promise.all(
                  cacheNames.map(cacheName => caches.delete(cacheName))
                );
              }).then(() => {
                console.log('All caches cleared');
                window.location.reload();
              });
            } else {
              window.location.reload();
            }
          });
      });
    } else {
      window.location.reload();
    }
  };
  
  // Function to cache specific Bible book
  window.cacheBibleBook = (bookPath) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();
      return new Promise((resolve, reject) => {
        messageChannel.port1.onmessage = (event) => {
          if (event.data.success) {
            console.log('Bible book cached:', event.data.cached);
            resolve(event.data);
          } else {
            reject(new Error(event.data.error || 'Failed to cache'));
          }
        };
        
        navigator.serviceWorker.controller.postMessage(
          { type: 'CACHE_BIBLE_BOOK', bookPath },
          [messageChannel.port2]
        );
      });
    }
    return Promise.reject(new Error('Service Worker not available'));
  };
  
  // Function to check what's cached offline
  window.checkOfflineContent = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();
      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data);
        };
        
        navigator.serviceWorker.controller.postMessage(
          { type: 'CHECK_OFFLINE_STATUS' },
          [messageChannel.port2]
        );
      });
    }
    return Promise.resolve({ success: false, cachedBooks: [] });
  };
}
