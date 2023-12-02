import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      'events': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
   },
  base: "RIP_front",
  plugins: [react()],
})