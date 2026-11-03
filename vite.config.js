import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { editorIconMarkup } from './src/editor/icons.js'

// Inlines Lucide icons into editor.html: a tiny `window.ICONS` map for the
// classic editor script, plus static <i data-icon="name"></i> placeholders.
function editorIcons() {
  const icons = editorIconMarkup()
  const svg = (name, extra = '') => {
    if (!icons[name]) throw new Error(`Unknown editor icon "${name}"`)
    const cls = extra.match(/\sclass="([^"]*)"/)
    const rest = extra.replace(/\sclass="[^"]*"/, '')
    return `<svg class="i${cls ? ` ${cls[1]}` : ''}" viewBox="0 0 24 24" aria-hidden="true"${rest}>${icons[name]}</svg>`
  }
  return {
    name: 'editor-icons',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (!ctx.filename.endsWith('editor.html')) return html
        return html
          .replace('<!--editor-icons-->', `<script>window.ICONS=${JSON.stringify(icons)}</script>`)
          .replace(/<i data-icon="([\w-]+)"([^>]*)><\/i>/g, (_, name, extra) => svg(name, extra))
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), editorIcons()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        editor: resolve(import.meta.dirname, 'editor.html'),
      },
    },
  },
})
