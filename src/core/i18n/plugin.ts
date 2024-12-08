import type { App } from 'vue'
import { ChromeI18nService } from './service'

export const i18n = {
  install: (app: App) => {
    // Création et injection du service
    const i18nService = new ChromeI18nService()
    app.provide('i18n', i18nService)
  }
} 