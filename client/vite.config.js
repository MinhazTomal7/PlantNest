import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/uploads': {             // Add this
        target: 'http://localhost:3000', // your backend serving uploads
        changeOrigin: true,
      }
    }
  }
})
