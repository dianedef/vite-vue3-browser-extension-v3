import { config } from '@vue/test-utils'
import { vi } from 'vitest'
import './mocks/webextension-polyfill'

// Configuration globale pour Vue Test Utils
config.global.mocks = {
  __VERSION__: '1.0.0',
  __DISPLAY_NAME__: 'Test Extension',
  __CHANGELOG__: '# Changelog\n- Test update',
  __GIT_COMMIT__: 'abc123',
  __GITHUB_URL__: 'https://github.com/test/repo'
}

// Mock de window.self
Object.defineProperty(window, 'self', {
  value: window,
  writable: true
})

// Mock de chrome.runtime
const mockChrome = {
  runtime: {
    getManifest: vi.fn(() => ({
      manifest_version: 3,
      version: '1.0.0',
      name: 'Test Extension'
    }))
  }
} as unknown as typeof chrome;

global.chrome = mockChrome;

// Mock des variables d'environnement globalement
const globals = {
  __VERSION__: '1.0.0',
  __DISPLAY_NAME__: 'Test Extension',
  __CHANGELOG__: '# Changelog\n- Test update',
  __GIT_COMMIT__: 'abc123',
  __GITHUB_URL__: 'https://github.com/test/repo'
} as unknown as typeof globalThis;

Object.assign(global, globals);
