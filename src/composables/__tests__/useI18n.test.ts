import { describe, expect, it, vi } from 'vitest'
import { useI18n } from '../useI18n'
import type { I18nService } from '@/core/i18n'

// Mock du service i18n
const mockI18nService: I18nService = {
  getMessage: vi.fn(),
  getCurrentLanguage: vi.fn(),
  getPreferredLanguages: vi.fn(),
  isLanguageSupported: vi.fn()
}

// Mock de l'injection Vue
vi.mock('vue', () => ({
  inject: () => mockI18nService
}))

describe('useI18n', () => {
  it('should translate messages', () => {
    const message = 'Message traduit'
    vi.mocked(mockI18nService.getMessage).mockReturnValue(message)
    
    const { t } = useI18n()
    const result = t('test.key')
    
    expect(result).toBe(message)
    expect(mockI18nService.getMessage).toHaveBeenCalledWith('test.key', undefined)
  })

  it('should translate with substitutions', () => {
    const message = 'Hello John!'
    const substitutions = ['John']
    vi.mocked(mockI18nService.getMessage).mockReturnValue(message)
    
    const { t } = useI18n()
    const result = t('greeting', substitutions)
    
    expect(result).toBe(message)
    expect(mockI18nService.getMessage).toHaveBeenCalledWith('greeting', substitutions)
  })

  it('should get current language', () => {
    const lang = 'fr'
    vi.mocked(mockI18nService.getCurrentLanguage).mockReturnValue(lang)
    
    const { currentLanguage } = useI18n()
    const result = currentLanguage()
    
    expect(result).toBe(lang)
    expect(mockI18nService.getCurrentLanguage).toHaveBeenCalled()
  })

  it('should get preferred languages', () => {
    const languages = ['fr-FR', 'en-US']
    vi.mocked(mockI18nService.getPreferredLanguages).mockReturnValue(languages)
    
    const { preferredLanguages } = useI18n()
    const result = preferredLanguages()
    
    expect(result).toEqual(languages)
    expect(mockI18nService.getPreferredLanguages).toHaveBeenCalled()
  })

  it('should check language support', () => {
    vi.mocked(mockI18nService.isLanguageSupported).mockReturnValue(true)
    
    const { isLanguageSupported } = useI18n()
    const result = isLanguageSupported('fr')
    
    expect(result).toBe(true)
    expect(mockI18nService.isLanguageSupported).toHaveBeenCalledWith('fr')
  })
}) 