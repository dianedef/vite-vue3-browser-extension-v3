import { env } from 'node:process'
import type { ManifestV3Export } from '@crxjs/vite-plugin'
import packageJson from './package.json'

const { version, name } = packageJson
const [major, minor, patch = '0'] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/)

export default {
  name: env.mode === 'staging' ? `[INTERNAL] ${name}` : "__MSG_extensionName__",
  description: "__MSG_extensionDescription__",
  version: `${major}.${minor}.${patch}`,
  version_name: version,
  manifest_version: 3,
  default_locale: "fr",
  action: {
    default_popup: 'src/popup/index.html',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      all_frames: true,
      js: ['src/content-script/index.ts'],
      matches: ['*://*/*'],
      run_at: 'document_end',
    },
  ],
  // Full options page
  options_page: 'src/options/index.html',
  // Embedded options page
  // options_ui: {
  //   page: 'src/options/index.html',
  // },
  offline_enabled: true,
  permissions: ['storage', 'tabs'],
  web_accessible_resources: [
    {
      matches: ['*://*/*'],
      resources: [
        'src/content-script/index.ts',
        'src/content-script/iframe/index.html',
        'src/content-script/iframe/*',
        'src/setup/index.html',
        'src/setup/*'
      ]
    }
  ],
  icons: {
    16: 'src/assets/logo.png',
    24: 'src/assets/logo.png',
    32: 'src/assets/logo.png',
    128: 'src/assets/logo.png',
  },
} as ManifestV3Export
