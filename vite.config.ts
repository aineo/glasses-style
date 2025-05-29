import { defineConfig, loadEnv, ConfigEnv } from 'vite'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig((config: ConfigEnv) => {
  Object.assign(process.env, loadEnv(config.mode, process.cwd(), ''))

  return {
    base: '/glasses-style',
    build: {
      outDir: 'build',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          entryFileNames: `[name].js`,
          chunkFileNames: `[name].js`,
          assetFileNames: `assets/[name].[ext]`,
        },
        plugins: [
          visualizer({ filename: 'visualize-bundle.html', gzipSize: true }),
        ],
      },
    },
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: path.resolve(__dirname, './src/backgrounds'),
            dest: 'assets',
          },
          {
            src: path.resolve(__dirname, './src/models'),
            dest: 'assets',
          },
        ]
      })
    ],
    server: {
      port: parseInt(process.env.APP_PORT ?? '2025', 10),
      strictPort: true,
    },
    assetsInclude: ['**/*.png']
  }
})
