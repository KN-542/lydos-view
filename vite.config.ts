import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',  // すべてのネットワークインターフェースでlisten（Dockerから接続可能に）
    port: 5173,
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
      return false
    })(),
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
