
import path from 'path';
import vue from '@vitejs/plugin-vue';
import fs from 'fs'

import { VitePWA } from 'vite-plugin-pwa'

const packageJSONData = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
const appVersion = packageJSONData.version
const chunkPrefix = appVersion.replace(/\./g, '')

console.log("Running vite config with chunk prefix ", chunkPrefix)

const SRC_DIR = path.resolve(__dirname, './src');
const PUBLIC_DIR = path.resolve(__dirname, './public');
const BUILD_DIR = path.resolve(__dirname, './www',);
export default async () => {

  return  {
    plugins: [
      vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.includes('swiper-') } } }),,

    ],
    root: SRC_DIR,
    base: '',
    publicDir: PUBLIC_DIR,
    build: {
      outDir: BUILD_DIR,
      assetsInlineLimit: 0,
      emptyOutDir: true,
      rollupOptions: {
        treeshake: false,
        output: {
          entryFileNames: `assets/[name]-${chunkPrefix}.js`,
          chunkFileNames: `assets/[name]-${chunkPrefix}.js`,
          assetFileNames: `assets/[name].[ext]`
        }
      },
    },
    resolve: {
      alias: {
        '@': SRC_DIR,
      },
    },
    server: {
      host: true,
    },
    optimizeDeps: {
      exclude: ['tesseract-wasm']
    },  
    define: {
      '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
    }
  };
}
