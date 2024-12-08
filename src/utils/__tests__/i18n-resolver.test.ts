import { beforeEach, describe, expect, it, vi } from 'vitest'
import { resolveMessages } from '../i18n-resolver'

// Mock du système de fichiers
vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal()
  const mockReadFileSync = vi.fn()
  const mockExistsSync = vi.fn()
  return {
    ...actual,
    default: {
      ...actual.default,
      readFileSync: mockReadFileSync,
      existsSync: mockExistsSync
    },
    readFileSync: mockReadFileSync,
    existsSync: mockExistsSync
  }
})

vi.mock('node:path', async (importOriginal) => {
  const actual = await importOriginal()
  const mockResolve = (...args: string[]) => args.join('/')
  return {
    ...actual,
    default: {
      ...actual.default,
      resolve: mockResolve
    },
    resolve: mockResolve
  }
})

describe('i18n resolver', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should load base messages only when no extension messages exist', async () => {
    // Mock des fichiers existants
    const { existsSync, readFileSync } = await import('node:fs')
    vi.mocked(existsSync).mockImplementation((path: string) => 
      path.includes('_locales/fr/messages.json')
    )

    // Mock du contenu des fichiers
    vi.mocked(readFileSync).mockImplementation(() => JSON.stringify({
      settingsTitle: {
        message: "Paramètres",
        description: "Titre de la page des paramètres"
      }
    }))

    const messages = resolveMessages('fr', 'test-extension')
    
    expect(messages.settingsTitle.message).toBe('Paramètres')
    expect(Object.keys(messages)).toHaveLength(1)
  })

  it('should merge base and extension messages with extension priority', async () => {
    // Mock des fichiers existants
    const { existsSync, readFileSync } = await import('node:fs')
    vi.mocked(existsSync).mockReturnValue(true)

    // Messages de base
    const baseMessages = {
      settingsTitle: {
        message: "Paramètres",
        description: "Titre de la page des paramètres"
      },
      commonKey: {
        message: "Message de base",
        description: "Description de base"
      }
    }

    // Messages de l'extension
    const extensionMessages = {
      extensionName: {
        message: "Mon Extension",
        description: "Nom de l'extension"
      },
      commonKey: {
        message: "Message surchargé",
        description: "Description surchargée"
      }
    }

    // Mock du contenu des fichiers en fonction du chemin exact
    vi.mocked(readFileSync).mockImplementation((path: string) => {
      console.log('Reading file:', path)
      // Chemin de base: _locales/fr/messages.json
      if (path === process.cwd() + '/_locales/fr/messages.json') {
        console.log('Returning base messages:', baseMessages)
        return JSON.stringify(baseMessages)
      }
      // Chemin de l'extension: src/extensions/test-extension/_locales/fr/messages.json
      if (path === process.cwd() + '/src/extensions/test-extension/_locales/fr/messages.json') {
        console.log('Returning extension messages:', extensionMessages)
        return JSON.stringify(extensionMessages)
      }
      return '{}'
    })

    const messages = resolveMessages('fr', 'test-extension')
    console.log('Merged messages:', messages)
    
    // Vérifie que les messages sont correctement fusionnés
    expect(messages).toEqual({
      settingsTitle: {
        message: "Paramètres",
        description: "Titre de la page des paramètres"
      },
      extensionName: {
        message: "Mon Extension",
        description: "Nom de l'extension"
      },
      commonKey: {
        message: "Message surchargé",
        description: "Description surchargée"
      }
    })
  })

  it('should handle missing files gracefully', async () => {
    const { existsSync } = await import('node:fs')
    vi.mocked(existsSync).mockReturnValue(false)

    const messages = resolveMessages('fr', 'test-extension')
    expect(messages).toEqual({})
  })

  it('should handle invalid JSON files', async () => {
    const { existsSync, readFileSync } = await import('node:fs')
    vi.mocked(existsSync).mockReturnValue(true)
    vi.mocked(readFileSync).mockReturnValue('invalid json')

    expect(() => resolveMessages('fr', 'test-extension')).toThrow()
  })

  it('should handle different locales', async () => {
    const { existsSync, readFileSync } = await import('node:fs')
    vi.mocked(existsSync).mockReturnValue(true)

    const localeMessages = {
      fr: {
        greeting: { message: "Bonjour" }
      },
      en: {
        greeting: { message: "Hello" }
      }
    }

    vi.mocked(readFileSync).mockImplementation((path: string) => {
      const locale = path.includes('/fr/') ? 'fr' : 'en'
      return JSON.stringify(localeMessages[locale])
    })

    const frMessages = resolveMessages('fr', 'test-extension')
    const enMessages = resolveMessages('en', 'test-extension')
    
    expect(frMessages.greeting.message).toBe('Bonjour')
    expect(enMessages.greeting.message).toBe('Hello')
  })
}) 