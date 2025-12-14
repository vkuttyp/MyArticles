// Empty service worker file to prevent 404 errors
// This file is required by @nuxtjs/seo but not used in development

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
});
