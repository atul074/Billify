import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//   ],
// })



export default defineConfig({
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
        target: 'http://localhost:8087',
        ws: true, // Enable WebSocket proxy
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:8087',
        changeOrigin: true,
      }
    }
  },
  optimizeDeps: {
    include: ['sockjs-client'],
    esbuildOptions: {
      define: {
        global: 'globalThis', // Additional global definition
      },
    },
  },
})
