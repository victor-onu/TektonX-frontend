import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      manifest: false, // we use our own public/manifest.json
      workbox: {
        navigateFallback: null, // no SPA fallback — let server handle 404
        runtimeCaching: [
          {
            // API calls — NetworkFirst (try network, fall back to cache)
            urlPattern: /\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            // Google Fonts — CacheFirst with 30-day expiry
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // Static assets (JS, CSS, images) — CacheFirst
            urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        // A second HTML entry, built and served only at
        // /events/tech-ai-future-uyo (see vercel.json), so that route can
        // carry its own <title>/description/Open Graph/Twitter Card tags
        // instead of the site-wide ones — the actual page content still
        // comes from the same React app (same /src/main.tsx bootstrap).
        uyoEvent: path.resolve(__dirname, 'events/tech-ai-future-uyo/index.html'),
      },
    },
  },
})
