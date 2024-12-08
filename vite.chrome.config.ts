import { env } from 'node:process'
import { crx } from '@crxjs/vite-plugin'
import { defineConfig } from 'vite'
import manifest from './manifest.chrome.config'
import ViteConfig from './vite.config'

const extensionName = env.EXT || 'boilerplate'

ViteConfig.plugins?.push(
  crx({
    manifest,
    browser: 'chrome',
    contentScripts: {
      injectCss: true,
    },
  })
)

if (!ViteConfig.build) {
  ViteConfig.build = {}
}

ViteConfig.build.outDir = `dist/chrome/${extensionName}`

// https://vitejs.dev/config/
export default defineConfig({
  ...ViteConfig,
})
