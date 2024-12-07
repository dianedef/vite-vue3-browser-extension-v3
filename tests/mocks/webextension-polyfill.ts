import { vi } from 'vitest'

export const mockBrowser = {
storage: {
   local: {
   get: vi.fn(),
   set: vi.fn()
   }
},
runtime: {
   getManifest: vi.fn(() => ({
   manifest_version: 3,
   version: '1.0.0',
   name: 'Test Extension'
   }))
}
}

vi.mock('webextension-polyfill', () => ({
default: mockBrowser
})) 