import browser from 'webextension-polyfill'

export interface I18nService {
  /** Obtient un message traduit par sa clé */
  getMessage: (key: string, substitutions?: string | string[]) => string
  /** Obtient la langue actuelle de l'interface */
  getCurrentLanguage: () => string
  /** Obtient toutes les langues préférées de l'utilisateur */
  getPreferredLanguages: () => readonly string[]
  /** Vérifie si une langue est supportée */
  isLanguageSupported: (lang: string) => boolean
}

/**
 * Service gérant les traductions de l'extension
 * Utilise l'API i18n de Chrome et le système de messages
 */
export class ChromeI18nService implements I18nService {
  private readonly supportedLanguages = ['en', 'fr']
  private readonly defaultLanguage = 'en'

  getMessage = (key: string, substitutions?: string | string[]): string => {
    return browser.i18n.getMessage(key, substitutions) || key
  }

  getCurrentLanguage = (): string => {
    return browser.i18n.getUILanguage()
  }

  getPreferredLanguages = (): readonly string[] => {
    return navigator.languages
  }

  isLanguageSupported = (lang: string): boolean => {
    const normalizedLang = this.normalizeLang(lang)
    return this.supportedLanguages.includes(normalizedLang)
  }

  private normalizeLang = (lang: string): string => {
    return lang.split('-')[0].toLowerCase()
  }
} 