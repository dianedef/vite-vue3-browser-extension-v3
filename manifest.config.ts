import { env } from 'node:process'
import type { ManifestV3Export } from '@crxjs/vite-plugin'
import packageJson from './package.json'
import { resolveManifestPaths } from './src/utils/path-resolver'

const { version, name } = packageJson
const [major, minor, patch = '0'] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/)

const extensionName = env.EXT || 'boilerplate'
const paths = resolveManifestPaths(extensionName)

export default {
  name: "__MSG_extensionName__",
  description: "__MSG_extensionDescription__",
  version: `${major}.${minor}.${patch}`,
  version_name: version,
  manifest_version: 3,
  default_locale: "fr",
  action: {
    default_popup: paths.popup,
  },
  background: {
    service_worker: paths.background,
    type: 'module',
  },
  content_scripts: [
    {
      all_frames: true,
      js: [paths.contentScript],
      matches: ['http://*/*', 'https://*/*'],
      exclude_matches: [
        'https://chrome.google.com/*'
      ],
      run_at: 'document_end',
    },
  ],
  options_page: paths.options,
  offline_enabled: true,
  permissions: ['storage', 'tabs'],
  web_accessible_resources: [
    {
      matches: ['*://*/*'],
      resources: [
        paths.contentScript,
        paths.setup,
        // Ajoutez d'autres ressources au besoin
      ]
    }
  ],
  icons: {
    16: `src/extensions/${extensionName}/assets/logo.png`,
    24: `src/extensions/${extensionName}/assets/logo.png`,
    32: `src/extensions/${extensionName}/assets/logo.png`,
    128: `src/extensions/${extensionName}/assets/logo.png`,
  },
} as ManifestV3Export
