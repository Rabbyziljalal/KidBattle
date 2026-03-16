/**
 * Service Worker for Brain Tug PWA
 * Version: 1.5.2
 * Implements offline-first caching strategy
 */

const CACHE_VERSION = 'brain-tug-v1.5.2';
const CACHE_NAME = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Files to cache immediately on install
const STATIC_ASSETS = [
  './',
  './index.html',
  './install/index.html',
  './manifest.json',
  
  // CSS Files
  './style.css',
  './landingPage.css',
  './fruitLearning.css',
  './vegetableLearning.css',
  './animalLearning.css',
  './birdsLearning.css',
  './flowerLearning.css',
  './poemLearning.css',
  './alphabetLearning.css',
  './fruitRecognition.css',
  './colorMood.css',
  './missingPartGame.css',
  './animalTheme.css',
  './desktop-mode.css',
  './chatbot.css',
  
  // JavaScript Files
  './script.js',
  './colorMood.js',
  './fruitData.js',
  './vegetableData.js',
  './animalData.js',
  './birdsData.js',
  './flowerData.js',
  './poemData.js',
  './alphabetData.js',
  './questions.js',
  './tug3d.js',
  './fruitLearning.js',
  './vegetableLearning.js',
  './animalLearning.js',
  './birdsLearning.js',
  './flowerLearning.js',
  './fruitRecognition.js',
  './vegetableRecognition.js',
  './animalRecognition.js',
  './birdRecognition.js',
  './poemLearning.js',
  './alphabetLearning.js',
  './missingPartGame.js',
  './animalTheme.js',
  './pwa-install.js',
  './standalone-detector.js',
  './chatbot.js',
  './chatbot-config.js',
  './chatbot-ai.js',
  './resources/image/kid.png',
  
  // Chatbot Component
  './chatbot.html',
  
  // Fonts
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap',
  
  // PWA Icons
  './pwa-icons/icon-512x512.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[ServiceWorker] Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              // Delete old caches
              return name !== CACHE_NAME && name !== DYNAMIC_CACHE;
            })
            .map((name) => {
              console.log('[ServiceWorker] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests (CDN, external APIs)
  if (url.origin !== location.origin) {
    // For external resources, use network first with cache fallback
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }
  
  // For local resources, use cache-first strategy
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache if not a success response
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache the new resource dynamically
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
            
            return response;
          })
          .catch((error) => {
            console.error('[ServiceWorker] Fetch failed:', error);
            
            // Return offline fallback page if available
            if (request.destination === 'document') {
              return caches.match('./index.html');
            }
            
            // For images, you could return a placeholder
            if (request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Offline</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urlsToCache = event.data.payload;
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => cache.addAll(urlsToCache))
    );
  }
});

// Background sync (for future implementation)
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync:', event.tag);
  
  if (event.tag === 'sync-game-progress') {
    event.waitUntil(
      // Sync game progress when online
      Promise.resolve()
    );
  }
});

// Push notification handler (for future implementation)
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: './pwa-icons/icon-512x512.svg',
    badge: './pwa-icons/icon-512x512.svg',
    vibrate: [200, 100, 200],
    tag: 'brain-tug-notification',
    requireInteraction: false
  };
  
  event.waitUntil(
    self.registration.showNotification('Brain Tug', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('./')
  );
});

console.log('[ServiceWorker] Loaded version:', CACHE_VERSION);
