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
  const outputDir = resolve(process.cwd(), 'dist/firefox', extensionName, '_locales', locale)
  mkdirSync(outputDir, { recursive: true })
  writeFileSync(resolve(outputDir, 'messages.json'), JSON.stringify(messages, null, 2))
})

// remove unsupported fields
// @ts-expect-error ManifestConfig provides all required fields
delete ManifestConfig.offline_enabled;
// @ts-expect-error ManifestConfig provides all required fields
delete ManifestConfig.version_name;

// @ts-expect-error ManifestConfig provides all required fields
export default defineManifest((_env) => ({
  ...ManifestConfig,
  browser_specific_settings: {
    gecko: {
      id: '{2e4f5834-d742-411d-bfe1-49fc4433aaa1}', // ID from manifest.config.ts
    },
  },
  background: {
    scripts: ['src/background/index.ts'],
    type: 'module',
    persistent: false,
  },
  // @ts-expect-error ManifestConfig provides all required fields
  permissions: ManifestConfig.permissions.filter(
    (permission) => permission !== 'background'
  ),
}))
