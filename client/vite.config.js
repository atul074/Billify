import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      global: 'window', // Fixes SockJS global reference
    },
    server: {
      proxy: {
        '/ws': {
          target: env.VITE_API_BASE_URL,
          ws: true,
          changeOrigin: true,
        },
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        },
      },
    },
    optimizeDeps: {
      include: ['sockjs-client'],
      esbuildOptions: {
        define: {
          global: 'globalThis', // Additional global definition
        },
      },
    },
  };
});
