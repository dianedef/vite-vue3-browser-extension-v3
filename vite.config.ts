import { dirname, relative } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { env } from 'node:process'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import vueDevTools from 'vite-plugin-vue-devtools'
import { defineViteConfig as define } from './define.config'

// Récupération du nom de l'extension depuis les arguments
const extensionName = env.EXT || 'boilerplate'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3333,
    strictPort: true,
    hmr: {
      port: 3333,
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./src', import.meta.url)),
      src: fileURLToPath(new URL('./src', import.meta.url)),
      '@ext': fileURLToPath(new URL(`./src/extensions/${extensionName}`, import.meta.url)),
      '@assets': fileURLToPath(new URL(`./src/extensions/${extensionName}/assets`, import.meta.url)),
      '/primevue/': fileURLToPath(new URL('./node_modules/primevue/', import.meta.url)),
      '/primeicons/': fileURLToPath(new URL('./node_modules/primeicons/', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
    devSourcemap: true,
  },
  plugins: [
    vue(),
    vueDevTools(),
    Pages({
      dirs: [
        {
          dir: 'src/pages',
          baseRoute: 'common',
        },
        {
          dir: 'src/setup/pages',
          baseRoute: 'setup',
        },
        {
          dir: 'src/popup/pages',
          baseRoute: 'popup',
        },
        {
          dir: 'src/options/pages',
          baseRoute: 'options',
        },
        {
          dir: 'src/content-script/iframe/pages',
          baseRoute: 'iframe',
        },
      ],
    }),

    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        {
          'webextension-polyfill': [['*', 'browser']],
        },
      ],
      dts: 'src/types/auto-imports.d.ts',
      dirs: ['src/composables/', 'src/stores/', 'src/utils/'],
      eslintrc: {
        enabled: true,
        filepath: 'src/types/.eslintrc-auto-import.json',
      },
    }),

    Components({
      dirs: ['src/components'],
      dts: 'src/types/components.d.ts',
      resolvers: [
        IconsResolver(),
      ],
    }),

    Icons({
      autoInstall: true,
      compiler: 'vue3',
      scale: 1.5,
    }),
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml(html, { path }) {
        const assetsPath = relative(dirname(path), '/assets').replace(
          /\\/g,
          '/'
        )
        return html.replace(/"\/assets\//g, `"${assetsPath}/`)
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        iframe: 'src/content-script/iframe/index.html',
        popup: 'src/popup/index.html',
        setup: 'src/setup/index.html',
        options: 'src/options/index.html',
      }
    },
    emptyOutDir: false,
    outDir: `dist/${extensionName}`,
  },
  optimizeDeps: {
    include: [
      'vue',
      '@vueuse/core',
      'webextension-polyfill',
      'primevue/config',
      'primevue/button',
      'primevue/inputtext',
      'primevue/toast',
      'primevue/toastservice'
    ],
    exclude: ['vue-demi'],
  },
  assetsInclude: ['src/assets/*/**'],
  define,
})
