import { beforeEach, describe, expect, it, vi } from 'vitest'
import { resolveMessages } from '@/utils/i18n-resolver'
import ManifestConfig from '../../../manifest.config'

// Mock des modules
vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal()
  const mockMkdirSync = vi.fn()
  const mockWriteFileSync = vi.fn()
  return {
    ...actual,
    default: {
      ...actual.default,
      mkdirSync: mockMkdirSync,
      writeFileSync: mockWriteFileSync
    },
    mkdirSync: mockMkdirSync,
    writeFileSync: mockWriteFileSync
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

vi.mock('@/utils/i18n-resolver', () => ({
  resolveMessages: vi.fn()
}))

describe('manifest build', () => {
  const extensionName = 'test-extension'
  
  beforeEach(async () => {
    vi.clearAllMocks()
    process.env.EXT = extensionName

    // Réinitialiser les modules pour chaque test
    vi.resetModules()
  })

  it('should generate manifest with correct structure', () => {
    expect(ManifestConfig).toMatchObject({
      manifest_version: 3,
      default_locale: "fr",
      name: "__MSG_extensionName__",
      description: "__MSG_extensionDescription__"
    })
  })

  it('should create locales directories and write messages', async () => {
    // Mock des messages résolus
    const mockMessages = {
      extensionName: {
        message: "Test Extension",
        description: "Extension name"
      }
    }
    vi.mocked(resolveMessages).mockReturnValue(mockMessages)

    const { mkdirSync, writeFileSync } = await import('node:fs')

    // Import dynamique pour déclencher la génération
    await import('../../../manifest.chrome.config')

    // Vérifie que les dossiers sont créés
    expect(mkdirSync).toHaveBeenCalledWith(
      expect.stringContaining('_locales'),
      expect.any(Object)
    )

    // Vérifie que les fichiers de traduction sont écrits
    expect(writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('messages.json'),
      JSON.stringify(mockMessages, null, 2)
    )
  })

  it('should handle multiple locales', async () => {
    const mockMessages = {
      fr: {
        extensionName: { message: "Extension Test" }
      },
      en: {
        extensionName: { message: "Test Extension" }
      }
    }

    vi.mocked(resolveMessages).mockImplementation((locale) => mockMessages[locale])

    const { writeFileSync } = await import('node:fs')

    await import('../../../manifest.chrome.config')

    // Vérifie que chaque locale est traitée
    expect(resolveMessages).toHaveBeenCalledWith('fr', extensionName)
    expect(resolveMessages).toHaveBeenCalledWith('en', extensionName)

    // Vérifie que les fichiers sont créés pour chaque locale
    expect(writeFileSync).toHaveBeenCalledTimes(2)
  })

  it('should use correct paths for different browsers', async () => {
    // Réinitialiser les modules pour ce test spécifique
    vi.resetModules()

    const { mkdirSync } = await import('node:fs')

    // Importer les configurations une par une
    await import('../../../manifest.chrome.config')
    
    // Vérifie le chemin pour Chrome
    expect(mkdirSync).toHaveBeenCalledWith(
      expect.stringContaining('dist/chrome'),
      expect.any(Object)
    )

    // Réinitialiser les mocks avant d'importer Firefox
    vi.clearAllMocks()
    vi.resetModules()

    await import('../../../manifest.firefox.config')
    
    // Vérifie le chemin pour Firefox
    expect(mkdirSync).toHaveBeenCalledWith(
      expect.stringContaining('dist/firefox'),
      expect.any(Object)
    )
  })
}) 