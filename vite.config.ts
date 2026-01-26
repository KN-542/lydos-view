import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    https: (() => {
      const certPath = path.resolve(__dirname, '../lydos-setup/certs/localhost.pem')
      const keyPath = path.resolve(__dirname, '../lydos-setup/certs/localhost-key.pem')
      
      // 証明書が存在する場合はHTTPSを有効化
      if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        return {
          cert: fs.readFileSync(certPath),
          key: fs.readFileSync(keyPath),
        }
      }
      return undefined
    })(),
    hmr: {
      protocol: 'wss',
      host: 'local.lydos',
      clientPort: 443,
    },
  },
})
