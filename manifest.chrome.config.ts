import { env } from 'node:process'
import { crx, defineManifest } from '@crxjs/vite-plugin'
import ManifestConfig from './manifest.config'
import { resolveMessages } from './src/utils/i18n-resolver'
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const extensionName = env.EXT || 'boilerplate'

// Résoudre et écrire les traductions
const locales = ['fr', 'en']
locales.forEach(locale => {
  const messages = resolveMessages(locale, extensionName)
  const outputDir = resolve(process.cwd(), 'dist/chrome', extensionName, '_locales', locale)
  mkdirSync(outputDir, { recursive: true })
  writeFileSync(resolve(outputDir, 'messages.json'), JSON.stringify(messages, null, 2))
})

// @ts-expect-error ManifestConfig provides all required fields
export default defineManifest((_env) => ({
  ...ManifestConfig,
}))
