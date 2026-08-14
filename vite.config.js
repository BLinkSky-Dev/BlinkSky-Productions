import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { adminApiPlugin } from './scripts/vite-plugin-admin.mjs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      adminApiPlugin({
        root: process.cwd(),
        password: env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || '',
      }),
    ],
    server: {
      host: '127.0.0.1',
      port: Number(process.env.PORT) || 5173,
    },
  }
})
