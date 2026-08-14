import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { adminApiPlugin } from './scripts/vite-plugin-admin.mjs'

export default defineConfig({
  plugins: [
    react(),
    adminApiPlugin({
      root: process.cwd(),
    }),
  ],
  server: {
    host: '127.0.0.1',
    port: Number(process.env.PORT) || 5173,
  },
})
