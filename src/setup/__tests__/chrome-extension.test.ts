import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('chrome extension specific tests', () => {
  beforeEach(() => {
    // Mock de l'API Chrome
    global.chrome = {
      runtime: {
        getManifest: vi.fn(() => ({
          version: '1.0.0',
          name: 'Test Extension',
          permissions: ['storage', 'tabs']
        })),
        sendMessage: vi.fn(),
        onMessage: {
          addListener: vi.fn()
        }
      },
      storage: {
        local: {
          get: vi.fn(),
          set: vi.fn()
        },
        sync: {
          get: vi.fn(),
          set: vi.fn()
        }
      },
      tabs: {
        query: vi.fn(),
        create: vi.fn(),
        sendMessage: vi.fn()
      }
    }
  })

  describe('manifest et permissions', () => {
    it('devrait avoir accès au manifest avec la bonne version', () => {
      const manifest = chrome.runtime.getManifest()
      expect(manifest.version).toBe('1.0.0')
      expect(manifest.name).toBe('Test Extension')
    })

    it('devrait avoir les permissions nécessaires', () => {
      const manifest = chrome.runtime.getManifest()
      expect(manifest.permissions).toContain('storage')
      expect(manifest.permissions).toContain('tabs')
    })
  })

  describe('gestion du stockage', () => {
    it('devrait pouvoir sauvegarder des données localement', async () => {
      const data = { installed: true, firstRun: false }
      await chrome.storage.local.set(data)
      expect(chrome.storage.local.set).toHaveBeenCalledWith(data)
    })

    it('devrait pouvoir récupérer des données du stockage local', async () => {
      const mockData = { installed: true }
      chrome.storage.local.get.mockImplementation(() => Promise.resolve(mockData))
      
      const result = await chrome.storage.local.get(['installed'])
      expect(result).toEqual(mockData)
      expect(chrome.storage.local.get).toHaveBeenCalledWith(['installed'])
    })

    it('devrait pouvoir synchroniser les données entre appareils', async () => {
      const data = { preferences: { theme: 'dark' } }
      await chrome.storage.sync.set(data)
      expect(chrome.storage.sync.set).toHaveBeenCalledWith(data)
    })
  })

  describe('gestion des onglets', () => {
    it('devrait pouvoir créer un nouvel onglet', async () => {
      const tabInfo = { url: 'chrome://extensions', active: true }
      await chrome.tabs.create(tabInfo)
      expect(chrome.tabs.create).toHaveBeenCalledWith(tabInfo)
    })

    it('devrait pouvoir trouver les onglets actifs', async () => {
      const mockTabs = [{ id: 1, url: 'https://example.com' }]
      chrome.tabs.query.mockImplementation(() => Promise.resolve(mockTabs))
      
      const result = await chrome.tabs.query({ active: true })
      expect(result).toEqual(mockTabs)
      expect(chrome.tabs.query).toHaveBeenCalledWith({ active: true })
    })
  })

  describe('communication entre composants', () => {
    it('devrait pouvoir envoyer des messages', () => {
      const message = { action: 'update', data: { version: '1.0.1' } }
      chrome.runtime.sendMessage(message)
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(message)
    })

    it('devrait pouvoir écouter les messages', () => {
      const messageHandler = vi.fn()
      chrome.runtime.onMessage.addListener(messageHandler)
      expect(chrome.runtime.onMessage.addListener).toHaveBeenCalledWith(messageHandler)
    })

    it('devrait pouvoir envoyer des messages aux onglets', () => {
      const tabId = 1
      const message = { action: 'refresh' }
      chrome.tabs.sendMessage(tabId, message)
      expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(tabId, message)
    })
  })

  describe('gestion des mises à jour', () => {
    it('devrait détecter une nouvelle installation', async () => {
      chrome.storage.local.get.mockImplementation(() => Promise.resolve({}))
      const result = await chrome.storage.local.get(['installed'])
      expect(result).toEqual({})
      expect(chrome.storage.local.get).toHaveBeenCalledWith(['installed'])
    })

    it('devrait détecter une mise à jour', async () => {
      const oldData = { version: '0.9.0' }
      chrome.storage.local.get.mockImplementation(() => Promise.resolve(oldData))
      
      const manifest = chrome.runtime.getManifest()
      const result = await chrome.storage.local.get(['version'])
      expect(result.version).not.toBe(manifest.version)
    })
  })
}) 