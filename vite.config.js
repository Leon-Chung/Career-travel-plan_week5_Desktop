import { defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { glob } from 'glob';

import liveReload from 'vite-plugin-live-reload';

import vue from '@vitejs/plugin-vue';

function moveOutputPlugin() {
  return {
    name: 'move-output',
    enforce: 'post',
    apply: 'build',
    async generateBundle(options, bundle) {
      for (const fileName in bundle) {
        if (fileName.startsWith('pages/')) {
          const newFileName = fileName.slice('pages/'.length);
          bundle[fileName].fileName = newFileName;
        }
      }
    },
  };
}

export default defineConfig({
  // base 的寫法:
  // base: '/Repository 的名稱/'
  base: '/Career-travel-plan_week5_Desktop/',
  plugins: [
    liveReload(['./layout/**/*.ejs', './pages/**/*.ejs', './pages/**/*.html']),
    ViteEjsPlugin(),
    moveOutputPlugin(),
    vue() // 新增 vue 插件
  ],
  server: {
    // 啟動 server 時預設開啟的頁面
    open: 'pages/index.html',
  },
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync('pages/**/*.html')
          .map((file) => [
            path.relative(
              'pages',
              file.slice(0, file.length - path.extname(file).length)
            ),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
    },
    outDir: 'dist',
  },
  // 💡 這裡很重要！指定帶編譯器的 Vue 版本
   resolve: {
    alias: {
      // 💡 這裡很重要！指定帶編譯器的 Vue 版本
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  }
});
