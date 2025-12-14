// Handle service worker requests
// This prevents the 404 error from @nuxtjs/seo trying to register a service worker
export default defineEventHandler((event) => {
    // Return an empty service worker that unregisters itself
    setResponseHeader(event, 'Content-Type', 'application/javascript');
    setResponseHeader(event, 'Service-Worker-Allowed', '/');
    
    return `
// Empty service worker - unregister any previously registered workers
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.registration.unregister().then(() => {
      return self.clients.matchAll();
    }).then((clients) => {
      clients.forEach(client => client.navigate(client.url));
    })
  );
});
`.trim();
});
