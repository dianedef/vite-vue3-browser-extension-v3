import { beforeEach, describe, expect, it, vi } from 'vitest'
import browser from 'webextension-polyfill'
import { ChromeI18nService } from '../service'  

vi.mock('webextension-polyfill', () => ({
  default: {
    i18n: {
      getMessage: vi.fn(),
      getUILanguage: vi.fn()
    }
  }
}))

describe('i18n service', () => {
  let service: ChromeI18nService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new ChromeI18nService()
  })

  it('should get translated message', () => {
    const key = 'testKey'
    const translation = 'Test Message'
    vi.mocked(browser.i18n.getMessage).mockReturnValue(translation)

    const result = service.getMessage(key)
    
    expect(result).toBe(translation)
    expect(browser.i18n.getMessage).toHaveBeenCalledWith(key, undefined)
  })

  it('should return key if translation not found', () => {
    const key = 'unknownKey'
    vi.mocked(browser.i18n.getMessage).mockReturnValue('')

    const result = service.getMessage(key)
    
    expect(result).toBe(key)
  })

  it('should get current language', () => {
    const lang = 'fr'
    vi.mocked(browser.i18n.getUILanguage).mockReturnValue(lang)

    const result = service.getCurrentLanguage()
    
    expect(result).toBe(lang)
    expect(browser.i18n.getUILanguage).toHaveBeenCalled()
  })

  it('should check if language is supported', () => {
    expect(service.isLanguageSupported('fr')).toBe(true)
    expect(service.isLanguageSupported('fr-FR')).toBe(true)
    expect(service.isLanguageSupported('en')).toBe(true)
    expect(service.isLanguageSupported('de')).toBe(false)
  })

  it('should get preferred languages', () => {
    const languages = ['fr-FR', 'en-US']
    Object.defineProperty(navigator, 'languages', {
      value: languages,
      configurable: true
    })

    const result = service.getPreferredLanguages()
    
    expect(result).toEqual(languages)
  })
}) 