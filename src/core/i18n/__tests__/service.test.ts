import { beforeAll, describe, expect, it, vi } from 'vitest'
import { ChromeI18nService } from '../service'
import browser from 'webextension-polyfill'

// Mock browser.i18n
vi.mock('webextension-polyfill', () => ({
  default: {
    i18n: {
      getMessage: vi.fn(),
      getUILanguage: vi.fn(),
    },
  },
}))

describe('ChromeI18nService', () => {
  let service: ChromeI18nService

  beforeAll(() => {
    service = new ChromeI18nService()
  })

  describe('getMessage', () => {
    it('devrait retourner le message traduit', () => {
      const key = 'test'
      const translation = 'Test message'
      vi.mocked(browser.i18n.getMessage).mockReturnValue(translation)

      const result = service.getMessage(key)
      expect(result).toBe(translation)
      expect(browser.i18n.getMessage).toHaveBeenCalledWith(key, undefined)
    })

    it('devrait retourner la clé si la traduction est manquante', () => {
      const key = 'missing'
      vi.mocked(browser.i18n.getMessage).mockReturnValue('')

      const result = service.getMessage(key)
      expect(result).toBe(key)
    })

    it('devrait gérer les substitutions', () => {
      const key = 'welcome'
      const substitutions = ['John']
      vi.mocked(browser.i18n.getMessage).mockReturnValue('Welcome, John!')

      const result = service.getMessage(key, substitutions)
      expect(result).toBe('Welcome, John!')
      expect(browser.i18n.getMessage).toHaveBeenCalledWith(key, substitutions)
    })
  })

  describe('getCurrentLanguage', () => {
    it('devrait retourner la langue de l\'interface', () => {
      const language = 'fr'
      vi.mocked(browser.i18n.getUILanguage).mockReturnValue(language)

      const result = service.getCurrentLanguage()
      expect(result).toBe(language)
      expect(browser.i18n.getUILanguage).toHaveBeenCalled()
    })
  })

  describe('isLanguageSupported', () => {
    it('devrait retourner true pour les langues supportées', () => {
      expect(service.isLanguageSupported('fr')).toBe(true)
      expect(service.isLanguageSupported('en')).toBe(true)
    })

    it('devrait retourner false pour les langues non supportées', () => {
      expect(service.isLanguageSupported('es')).toBe(false)
      expect(service.isLanguageSupported('de')).toBe(false)
    })

    it('devrait normaliser les codes de langue', () => {
      expect(service.isLanguageSupported('fr-FR')).toBe(true)
      expect(service.isLanguageSupported('en-US')).toBe(true)
      expect(service.isLanguageSupported('FR')).toBe(true)
    })
  })

  describe('getPreferredLanguages', () => {
    it('devrait retourner les langues préférées du navigateur', () => {
      const languages = ['fr-FR', 'en-US']
      Object.defineProperty(navigator, 'languages', {
        value: languages,
        configurable: true
      })

      const result = service.getPreferredLanguages()
      expect(result).toEqual(languages)
    })
  })
}) 