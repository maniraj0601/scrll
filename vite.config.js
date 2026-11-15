import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Single-page app: index.html hosts both the Studio home ("/") and the editor
// ("/edit", lazy-loaded). Vite's SPA fallback serves index.html for /edit in dev.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: 'Carousel Studio',
        short_name: 'Carousel Studio',
        description: 'Browse, preview, and customize polished carousel templates in Carousel Studio.',
        start_url: '/',
        display: 'standalone',
        background_color: '#f5f5f7',
        theme_color: '#f5f5f7',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Drafts live in IndexedDB, not the cache — this only needs to make the app shell
        // (JS/CSS/HTML) load offline, which also lets /edit open and keep working on
        // already-saved drafts without a connection.
        globPatterns: ['**/*.{js,css,html,svg}'],
      },
    }),
  ],
})
