import { crx } from '@crxjs/vite-plugin'
import { defineConfig } from 'vite'
import manifest from './manifest.firefox.config'
import ViteConfig from './vite.config'
import { env } from 'node:process'

const extensionName = env.EXT || 'boilerplate'

ViteConfig.plugins?.push(
  crx({
    manifest,
    browser: 'firefox',
    contentScripts: {
      injectCss: true,
    },
  })
)

if (!ViteConfig.build) {
  ViteConfig.build = {}
}

ViteConfig.build.outDir = `dist/firefox/${extensionName}`

// https://vitejs.dev/config/
export default defineConfig({
  ...ViteConfig,
})
