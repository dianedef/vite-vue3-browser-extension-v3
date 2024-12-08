import { env } from 'node:process'
import type { ManifestV3Export } from '@crxjs/vite-plugin'
import baseManifest from '../../../manifest.config'

export default {
   ...baseManifest,
   name: env.mode === 'staging' ? '[INTERNAL] Boilerplate' : "__MSG_extensionName__",
   description: "__MSG_extensionDescription__",
   version: "1.0.0"
} as ManifestV3Export 