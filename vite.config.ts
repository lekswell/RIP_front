import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/bouquets/': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
   },
  base: "YOUR_REPOSITORY_NAME",
  plugins: [react()],
})