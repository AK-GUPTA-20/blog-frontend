import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react'
            }
            if (id.includes('@sentry')) {
              return 'vendor-sentry'
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer'
            }
            if (id.includes('lucide-react')) {
              return 'vendor-lucide'
            }
            return 'vendor'
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://blog-backend-mueu.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path, // Keep the path as-is
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    },
  },
})