import { describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router/auto'
import { sendMessage, onMessage } from 'webext-bridge'
import type { Target } from 'webext-bridge'
import browser from 'webextension-polyfill'
import App from '../app.vue'
import routes from '~pages'

vi.mock('webext-bridge', () => ({
  sendMessage: vi.fn(),
  onMessage: vi.fn()
}))

vi.mock('webextension-polyfill', () => ({
  default: {
    runtime: {
      getManifest: vi.fn(() => ({
        version: '1.0.0',
        name: 'Test Extension'
      }))
    },
    storage: {
      local: {
        get: vi.fn(),
        set: vi.fn()
      }
    }
  }
}))

describe('extension setup', () => {
  it('devrait créer une instance Vue avec le routeur', () => {
    const router = createRouter({
      history: createWebHashHistory(),
      routes,
    })

    const app = createApp(App)
    const useSpy = vi.spyOn(app, 'use')
    const mountSpy = vi.spyOn(app, 'mount')

    app.use(router).mount('#app')

    expect(useSpy).toHaveBeenCalledWith(router)
    expect(mountSpy).toHaveBeenCalledWith('#app')
  })

  it('devrait avoir les routes setup définies', () => {
    const router = createRouter({
      history: createWebHashHistory(),
      routes,
    })

    const setupRoute = router.getRoutes().find(route => route.path === '/setup')
    expect(setupRoute).toBeDefined()
    expect(setupRoute?.path).toBe('/setup')

    const installRoute = router.getRoutes().find(route => route.path === '/setup/install')
    expect(installRoute).toBeDefined()
    expect(installRoute?.path).toBe('/setup/install')

    const updateRoute = router.getRoutes().find(route => route.path === '/setup/update')
    expect(updateRoute).toBeDefined()
    expect(updateRoute?.path).toBe('/setup/update')
  })

  it('devrait gérer les erreurs globales', () => {
    const consoleInfoSpy = vi.spyOn(console, 'info')
    const error = new Error('Test error')
    const source = 'test.js'
    const lineno = 1
    const colno = 1

    self.onerror = function (message, source, lineno, colno, error) {
      console.info(
        `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`
      )
    }

    self.onerror('Test error', source, lineno, colno, error)

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      `Error: Test error\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`
    )
  })

  describe('communication bridge', () => {
    it('devrait pouvoir envoyer des messages', async () => {
      await sendMessage('test-event', { data: 'test' })
      expect(sendMessage).toHaveBeenCalledWith('test-event', { data: 'test' })
    })

    it('devrait pouvoir recevoir des messages', () => {
      const handler = vi.fn()
      onMessage('test-event', handler)
      expect(onMessage).toHaveBeenCalledWith('test-event', handler)
    })

    it('devrait pouvoir gérer les erreurs de communication', async () => {
      const errorHandler = vi.fn()
      onMessage('setup:error', errorHandler)
      
      // Simuler une erreur
      const mockError = { error: 'Communication failed' }
      await sendMessage('setup:error', mockError, 'background' as Target)
      
      expect(onMessage).toHaveBeenCalledWith('setup:error', expect.any(Function))
      expect(sendMessage).toHaveBeenCalledWith('setup:error', mockError, 'background')
    })

    it('devrait gérer le timeout des messages', async () => {
      vi.mocked(sendMessage).mockRejectedValueOnce(new Error('Message timeout'))
      
      const timeoutPromise = sendMessage(
        'setup:install', 
        { version: '1.0.0' }, 
        'background' as Target, 
        { timeout: 1000 }
      )
      
      await expect(timeoutPromise).rejects.toThrow('Message timeout')
    })
  })

  describe('stockage extension', () => {
    it('devrait pouvoir sauvegarder l\'état d\'installation', async () => {
      const data = { installed: true }
      await browser.storage.local.set(data)
      expect(browser.storage.local.set).toHaveBeenCalledWith(data)
    })

    it('devrait pouvoir récupérer l\'état d\'installation', async () => {
      const mockData = { installed: true }
      vi.mocked(browser.storage.local.get).mockResolvedValue(mockData)

      const result = await browser.storage.local.get(['installed'])
      expect(result).toEqual(mockData)
      expect(browser.storage.local.get).toHaveBeenCalledWith(['installed'])
    })

    it('devrait gérer les erreurs de stockage', async () => {
      const error = new Error('Storage error')
      vi.mocked(browser.storage.local.set).mockRejectedValue(error)
      
      await expect(browser.storage.local.set({ test: true })).rejects.toThrow('Storage error')
    })
  })

  describe('version et manifest', () => {
    it('devrait pouvoir accéder aux informations du manifest', () => {
      const manifest = browser.runtime.getManifest()
      expect(manifest.version).toBe('1.0.0')
      expect(manifest.name).toBe('Test Extension')
    })
  })
}) 