import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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