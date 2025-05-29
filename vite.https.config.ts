import fs from 'fs'
import { defineConfig, loadEnv, ConfigEnv } from 'vite'

export default defineConfig((config: ConfigEnv) => {
  Object.assign(process.env, loadEnv(config.mode, process.cwd(), ''))

  return {
    base: '/glasses-style',
    server: {
      https: {
        key: fs.readFileSync('./.cert/key.pem'),
        cert: fs.readFileSync('./.cert/cert.pem'),
      },
      port: parseInt(process.env.APP_PORT ?? '2025', 10),
      strictPort: true,
      hmr: false,
    },
    assetsInclude: ['**/*.png']
  }
})
