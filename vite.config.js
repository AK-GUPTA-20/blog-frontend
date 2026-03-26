import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_PROXY_TARGET;
  const devPort = Number(env.VITE_DEV_PORT || 5173);
  const previewPort = Number(env.VITE_PREVIEW_PORT || 4173);

  return {
    plugins: [react()],
    server: {
      port: devPort,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
        }
      }
    },
    preview: {
      port: previewPort,
    }
  };
})
