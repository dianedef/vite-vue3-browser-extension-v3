import { inject } from 'vue'
import type { I18nService } from '@/core/i18n/service'

/**
 * Composable pour gérer les traductions
 * @returns Fonctions et utilitaires de traduction
 */
export function useI18n() {
const i18n = inject<I18nService>('i18n')
if (!i18n) throw new Error('I18nService not provided')

return {
   /** Traduit un message par sa clé */
   t: (key: string, substitutions?: string | string[]) => 
   i18n.getMessage(key, substitutions),
   
   /** Obtient la langue actuelle */
   currentLanguage: () => i18n.getCurrentLanguage(),
   
   /** Obtient les langues préférées */
   preferredLanguages: () => i18n.getPreferredLanguages(),
   
   /** Vérifie si une langue est supportée */
   isLanguageSupported: (lang: string) => i18n.isLanguageSupported(lang)
}
} 