import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Copy icon from src/assets to public automatically on startup or build
try {
  const srcPath = path.resolve(__dirname, 'src/assets/momentumicon.png')
  const destPath = path.resolve(__dirname, 'public/momentumicon.png')
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath)
  }
} catch (e) {
  console.warn('Failed to copy momentumicon.png to public:', e)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['momentumicon.png', 'favicon.svg', 'icons.svg'],
      manifest: {
        name: 'Momentum - Routine & DSA Tracker',
        short_name: 'Momentum',
        description: 'Small actions. Massive momentum.',
        theme_color: '#0a0a16',
        background_color: '#0a0a16',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'momentumicon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'momentumicon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'momentumicon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'momentumicon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ]
})
