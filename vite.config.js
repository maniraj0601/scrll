import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Single-page app: index.html hosts both the Studio home ("/") and the editor
// ("/edit", lazy-loaded). Vite's SPA fallback serves index.html for /edit in dev.
export default defineConfig({
  plugins: [react()],
})
