import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// 환경 변수에서 API URL 가져오기 (없으면 localhost 사용)
const API_URL = process.env.VITE_API_URL || 'http://localhost:5001'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/kiosk/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: '스터디그라운드 키오스크',
        short_name: '스터디그라운드',
        description: '스터디그라운드 체크인/체크아웃 키오스크',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  server: {
    host: '0.0.0.0', // 모든 네트워크 인터페이스에서 수신
    port: 3000,
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true
      }
    }
  }
})
