import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Configuration globale pour Vue Test Utils
config.global.mocks = {
  // Mock des variables d'environnement
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
const chrome = {
  runtime: {
    getManifest: vi.fn(() => ({
      version: '1.0.0',
      name: 'Test Extension'
    }))
  }
}

// @ts-ignore
global.chrome = chrome

// Mock des variables d'environnement globalement
global.__VERSION__ = '1.0.0'
global.__DISPLAY_NAME__ = 'Test Extension'
global.__CHANGELOG__ = '# Changelog\n- Test update'
global.__GIT_COMMIT__ = 'abc123'
global.__GITHUB_URL__ = 'https://github.com/test/repo'